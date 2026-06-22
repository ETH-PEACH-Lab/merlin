let pyodide = null;

async function initializePyodide() {
    if (!pyodide){
        importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
        pyodide = await loadPyodide();
    }
    return pyodide;
}

async function executePythonWithTracing(code, maxSteps = 1000){
    const py = await initializePyodide();

    const wrapperPrefix = `import sys
import io
import json
import collections

snapshots = []
debug_events = []
max_steps = ${maxSteps}
line_offset = 0
object_ids = {}
next_object_id = 1
heap = {}
visited_during_serialize = set()

_stdout_buffer = io.StringIO()
_orig_stdout = sys.stdout
_orig_stderr = sys.stderr

def get_object_id(v):
    global next_object_id
    vid = id(v)

    if vid not in object_ids:
        object_ids[vid] = next_object_id
        next_object_id += 1

    return object_ids[vid]

def detect_ds_hint(v):
    class_name = type(v).__name__
    if not hasattr(v, '__dict__'):
        return None

    attrs = v.__dict__
    attr_names = set(attrs.keys())

    if ('items' in attr_names or 'elements' in attr_names) and any(k in attr_names for k in ['top', 'size', 'length']):
        return 'stack'
    if 'stack' in class_name.lower():
        return 'stack'

    if 'left' in attr_names and 'right' in attr_names:
        return 'tree'
    if 'tree' in class_name.lower() or 'children' in attr_names:
        return 'tree'

    if ('neighbors' in attr_names or 'adj' in attr_names or 'edges' in attr_names):
        return 'graph'
    if 'graph' in class_name.lower() or 'node' in class_name.lower():
        return 'graph'

    return None

def serialize_value(v):
    t = type(v).__name__

    if v is None or isinstance(v, (bool, int, float, str)):
        return {'type': t, 'value': v}

    elif isinstance(v, list):
        oid = get_object_id(v)

        heap[oid] = {
            'type': 'list',
            'length': len(v),
            'value': []
        }

        heap[oid]['value'] = [serialize_value(item) for item in v[:100]]

        return {'ref': oid}

    # Sort set elements so iteration order is stable across snapshots.
    elif isinstance(v, (set, frozenset)):
        oid = get_object_id(v)

        try:
            items = sorted(v)
        except TypeError:
            items = list(v)

        heap[oid] = {
            'type': 'set',
            'length': len(v),
            'value': []
        }

        heap[oid]['value'] = [serialize_value(item) for item in items[:100]]

        return {'ref': oid}

    elif isinstance(v, collections.deque):
        oid = get_object_id(v)

        heap[oid] = {
            'type': 'deque',
            'length': len(v),
            'value': []
        }

        heap[oid]['value'] = [serialize_value(item) for item in list(v)[:100]]

        return {'ref': oid}

    elif isinstance(v, tuple):
        oid = get_object_id(v)

        heap[oid] = {
            'type': 'tuple',
            'length': len(v),
            'value': []
        }

        heap[oid]['value'] = [serialize_value(item) for item in v[:100]]

        return {'ref': oid}

    elif isinstance(v, dict):
        oid = get_object_id(v)

        heap[oid] = {
            'type': 'dict',
            'length': len(v),
            'value': {}
        }

        heap[oid]['value'] = {str(k): serialize_value(val) for k, val in list(v.items())[:50]}

        return {'ref': oid}

    elif hasattr(v, '__dict__'):
        vid = id(v)

        if vid in visited_during_serialize:
            return {'type': 'cyclic_ref', 'ref': get_object_id(v)}

        visited_during_serialize.add(vid)

        oid = get_object_id(v)
        class_name = type(v).__name__
        ds_hint = detect_ds_hint(v)

        heap[oid] = {
            'type': 't',
            'class_name': class_name,
            'attributes': {}
        }

        if ds_hint:
            heap[oid]['ds_hint'] = ds_hint

        filtered_attrs = {}
        for k, val in v.__dict__.items():
            if k.startswith('__') and k.endswith('__'):
                continue
            if callable(val):
                continue
            filtered_attrs[k] = serialize_value(val)

        heap[oid]['attributes'] = filtered_attrs

        visited_during_serialize.discard(vid)

        return {'ref': oid}

    else:
        return {'type': t, 'repr': repr(v)}

def capture_locals(frame):
    visited_during_serialize.clear()
    local_vars = {}
    for k, v in frame.f_locals.items():
        if k.startswith('__') and k.endswith('__'):
            continue
        if isinstance(v, type) or callable(v):
            continue
        local_vars[k] = serialize_value(v)
    return local_vars

def trace_calls(frame, event, arg):
    if len(snapshots) >= max_steps:
        debug_events.append(f"Max steps ({max_steps}) reached, stopping tracer")
        sys.settrace(None)
        return None

    # Don't trace into stdlib/import-machinery frames; they leak module objects into locals.
    if frame.f_code.co_filename != trace_calls.__code__.co_filename:
        return None

    if event == 'call':
        return trace_calls
    elif event == 'line':
        try:
            local_vars = capture_locals(frame)

            # Walk frames for recursion tracking, stopping at the user_code
            # wrapper so the worker's own globals aren't serialized every step.
            call_stack = []
            current_frame = frame
            depth = 0
            first = True
            while current_frame and depth < 50:
                fname = current_frame.f_code.co_name
                call_stack.append({
                    'function': fname,
                    'line': current_frame.f_lineno,
                    'locals': local_vars if first else capture_locals(current_frame)
                })
                first = False
                if fname == 'user_code':
                    break
                current_frame = current_frame.f_back
                depth += 1

            actual_line = frame.f_lineno - line_offset

            snapshots.append({
                'line': actual_line,
                'locals': local_vars,
                'heap': dict(heap),
                'call_stack': call_stack,
                'stack_depth': len(call_stack),
                'stdout_len': len(_stdout_buffer.getvalue())
            })

            debug_events.append(f"  -> Snapshot at user line {actual_line} with {len(local_vars)} vars")
        except Exception as e:
            debug_events.append(f"  -> Error capturing: {e}")
        return trace_calls
    elif event == 'return':
        try:
            local_vars = capture_locals(frame)

            call_stack = []
            current_frame = frame
            depth = 0
            first = True
            while current_frame and depth < 50:
                fname = current_frame.f_code.co_name
                call_stack.append({
                    'function': fname,
                    'line': current_frame.f_lineno,
                    'locals': local_vars if first else capture_locals(current_frame)
                })
                first = False
                if fname == 'user_code':
                    break
                current_frame = current_frame.f_back
                depth += 1

            if local_vars:
                snapshots.append({
                    'line': 'return',
                    'locals': local_vars,
                    'heap': dict(heap),
                    'call_stack': call_stack,
                    'stack_depth': len(call_stack),
                    'stdout_len': len(_stdout_buffer.getvalue())
                })
                debug_events.append(f"  -> Final snapshot on return with {len(local_vars)} vars")
        except Exception as e:
            debug_events.append(f"  -> Error capturing return: {e}")
    return trace_calls

def user_code():
    sys.settrace(trace_calls)
    sys._getframe().f_trace = trace_calls
`;
    const wrapperLinesBefore = wrapperPrefix.split('\n').length;

    const wrapperSuffix = `

execution_error = None
sys.stdout = _stdout_buffer
sys.stderr = _stdout_buffer
try:
    user_code()
except Exception as e:
    # Stop tracing IMMEDIATELY: the traceback helpers below create frames the
    # tracer would otherwise intercept, serializing all globals on every line.
    sys.settrace(None)
    sys._getframe().f_trace = None
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr
    import traceback
    tb_frames = traceback.extract_tb(e.__traceback__)
    user_start = next((i for i, fr in enumerate(tb_frames) if fr.name == 'user_code'), 0)
    clean_lines = ['Traceback (most recent call last):']
    error_line = None
    for fr in tb_frames[user_start:]:
        ul = fr.lineno - line_offset
        error_line = ul
        func = 'main' if fr.name == 'user_code' else fr.name
        clean_lines.append('  File "<program>", line {}, in {}'.format(ul, func))
        if fr.line:
            clean_lines.append('    ' + fr.line.strip())
    clean_lines.append('{}: {}'.format(type(e).__name__, str(e)))
    execution_error = {
        'type': type(e).__name__,
        'message': str(e),
        'traceback': '\\n'.join(clean_lines),
        'line': error_line
    }
finally:
    sys.settrace(None)
    sys.stdout = _orig_stdout
    sys.stderr = _orig_stderr

stdout_text = _stdout_buffer.getvalue()

user_vars = list(globals().keys())
for var in user_vars:
    if var not in ['snapshots', 'debug_events', 'json', 'sys', 'execution_error', 'stdout_text']:
        try:
            del globals()[var]
        except:
            pass

snapshot_json = json.dumps(snapshots)
debug_json = json.dumps(debug_events)
error_json = json.dumps(execution_error)
stdout_json = json.dumps(stdout_text)
`;

    const userCodeIndented = code.split('\n').map(line => '    ' + line).join('\n');

    const wrapperPrefixWithOffset = wrapperPrefix.replace('line_offset = 0', `line_offset = ${wrapperLinesBefore}`);

    const fullCode = wrapperPrefixWithOffset + '\n' +
      userCodeIndented + '\n' +
      wrapperSuffix;

    try{
        // Compile-check user code standalone so SyntaxError line numbers map to the user's source.
        py.globals.set('__user_source__', code);
        await py.runPythonAsync(`
import json as __json
__compile_error_json__ = None
try:
    compile(__user_source__, '<program>', 'exec')
except SyntaxError as __e:
    __compile_error_json__ = __json.dumps({
        'type': type(__e).__name__,
        'message': __e.msg,
        'line': __e.lineno,
        'offset': __e.offset,
        'text': __e.text,
    })
`);
        const compileErrorJson = py.globals.get('__compile_error_json__');
        if (compileErrorJson) {
            const compileError = JSON.parse(compileErrorJson);
            console.error('[Worker] Python compile error:', compileError);
            return {
                success: false,
                phase: 'compile',
                error: compileError.message,
                errorType: compileError.type,
                errorLine: compileError.line,
                errorOffset: compileError.offset,
                errorText: compileError.text,
                snapshots: [],
                debug: []
            };
        }

        await py.runPythonAsync(fullCode);

        const errorJson = py.globals.get('error_json');
        const executionError = errorJson ? JSON.parse(errorJson) : null;
        const stdoutJson = py.globals.get('stdout_json');
        const stdout = stdoutJson ? JSON.parse(stdoutJson) : '';

        if (executionError) {
            console.error('[Worker] Python execution error:', executionError);
            return {
                success: false,
                phase: 'runtime',
                error: executionError.message,
                errorType: executionError.type,
                errorTraceback: executionError.traceback,
                errorLine: executionError.line,
                stdout: stdout,
                snapshots: [],
                debug: []
            };
        }

        const snapshotJson = py.globals.get('snapshot_json');
        const debugJson = py.globals.get('debug_json');

        if (!snapshotJson) {
            return { success: false, error: 'snapshot_json not found in Python globals' };
        }

        const snapshots = JSON.parse(snapshotJson);
        const debugEvents = debugJson ? JSON.parse(debugJson) : [];
        return { success: true, snapshots: snapshots, debug: debugEvents, stdout: stdout };

    } catch (error){
        console.error('[Worker] Execution error:', error);
        return {success: false, error: error.message};
    }
}

self.onmessage = async (event) =>{
    const { type, code, id, maxSteps } = event.data;

    try {
        switch(type){
            case 'init':
                await initializePyodide();
                self.postMessage({ type: 'ready', id});
                break;

            case 'execute':
                const result = await executePythonWithTracing(code, maxSteps);
                self.postMessage({ type: 'result', id, ...result});
                break;

            default:
                console.warn('[Worker] Unknown message type:', type);
        }
    } catch (error) {
        console.error('[Worker] Error:', error);
        self.postMessage({ type: 'error', id, error: error.message });
    }
};
