let pyodide = null;

// Initialize Pyodide 
async function initializePyodide() {
    if (!pyodide){
        importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');
        pyodide = await loadPyodide();
    }
    return pyodide;
}

async function executePythonWithTracing(code, maxSteps = 1000){
    const py = await initializePyodide();

    // Compute the line offset dynamically so line numbers are always correct
    const wrapperPrefix = `import sys
import json

snapshots = []
debug_events = []
max_steps = ${maxSteps}
line_offset = 0
object_ids = {}
next_object_id = 1
heap = {}
visited_during_serialize = set()  # Cycle detection

def get_object_id(v):
    global next_object_id
    vid = id(v)

    if vid not in object_ids:
        object_ids[vid] = next_object_id
        next_object_id += 1

    return object_ids[vid]

def detect_ds_hint(v):
    """Heuristically detect if object is a known data structure."""
    class_name = type(v).__name__
    if not hasattr(v, '__dict__'):
        return None
    
    attrs = v.__dict__
    attr_names = set(attrs.keys())
    
    # Stack detection: has 'items' or 'elements' list + optional 'top/size' markers
    if ('items' in attr_names or 'elements' in attr_names) and any(k in attr_names for k in ['top', 'size', 'length']):
        return 'stack'
    # Stack by name
    if 'stack' in class_name.lower():
        return 'stack'
    
    # Tree detection: has 'left' and 'right' attributes
    if 'left' in attr_names and 'right' in attr_names:
        return 'tree'
    # Tree by name or 'children' attribute
    if 'tree' in class_name.lower() or 'children' in attr_names:
        return 'tree'
    
    # Graph detection: has 'neighbors' or 'adj' list of references
    if ('neighbors' in attr_names or 'adj' in attr_names or 'edges' in attr_names):
        return 'graph'
    # Graph by name
    if 'graph' in class_name.lower() or 'node' in class_name.lower():
        return 'graph'
    
    return None

def serialize_value(v):
    t = type(v).__name__

    # Primitives
    if v is None or isinstance(v, (bool, int, float, str)):
        return {'type': t, 'value': v}

    # Lists
    elif isinstance(v, list):
        oid = get_object_id(v)

        heap[oid] = {
            'type': 'list',
            'length': len(v),
            'value': []
        }
        
        heap[oid]['value'] = [serialize_value(item) for item in v[:100]]

        return {'ref': oid}

    # Tuples
    elif isinstance(v, tuple):
        oid = get_object_id(v)

        heap[oid] = {
            'type': 'tuple',
            'length': len(v),
            'value': []
        }

        heap[oid]['value'] = [serialize_value(item) for item in v[:100]]

        return {'ref': oid}

    # Dicts
    elif isinstance(v, dict):
        oid = get_object_id(v)
        
        heap[oid] = {
            'type': 'dict',
            'length': len(v),
            'value': {}
        }
        
        heap[oid]['value'] = {str(k): serialize_value(val) for k, val in list(v.items())[:50]}

        return {'ref': oid}

    # Custom objects (linked lists, trees, etc.)
    elif hasattr(v, '__dict__'):
        vid = id(v)
        
        # Cycle detection: if already visiting this object, return a back-reference
        if vid in visited_during_serialize:
            return {'type': 'cyclic_ref', 'ref': get_object_id(v)}
        
        visited_during_serialize.add(vid)
        
        oid = get_object_id(v)
        class_name = type(v).__name__
        ds_hint = detect_ds_hint(v)

        heap[oid] = {
            'type': 't',
            'class_name': class_name,  # NEW: Explicit class name
            'attributes': {}
        }
        
        # Optional: add ds_hint if confidently detected
        if ds_hint:
            heap[oid]['ds_hint'] = ds_hint
        
        # Filter out dunder attributes, methods, and other non-data attributes
        filtered_attrs = {}
        for k, val in v.__dict__.items():
            # Skip dunder attributes (e.g., __module__, __qualname__)
            if k.startswith('__') and k.endswith('__'):
                continue
            # Skip callable objects (methods, functions)
            if callable(val):
                continue
            # Keep data attributes
            filtered_attrs[k] = serialize_value(val)
        
        heap[oid]['attributes'] = filtered_attrs
        
        visited_during_serialize.discard(vid)

        return {'ref': oid}

    # Fallback
    else:
        return {'type': t, 'repr': repr(v)}

def capture_locals(frame):
    """Capture and serialize local variables from a frame."""
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
    # Stop tracing if max steps reached
    if len(snapshots) >= max_steps:
        debug_events.append(f"Max steps ({max_steps}) reached, stopping tracer")
        sys.settrace(None)
        return None

    if event == 'call':
        return trace_calls
    elif event == 'line':
        try:
            local_vars = capture_locals(frame)

            # Build call stack for recursion tracking
            call_stack = []
            current_frame = frame
            depth = 0
            while current_frame and depth < 50:
                call_stack.append({
                    'function': current_frame.f_code.co_name,
                    'line': current_frame.f_lineno
                })
                current_frame = current_frame.f_back
                depth += 1

            # Fix line number relative to original user code
            actual_line = frame.f_lineno - line_offset

            snapshots.append({
                'line': actual_line,
                'locals': local_vars,
                'heap': dict(heap),
                'call_stack': call_stack,
                'stack_depth': len(call_stack)
            })

            debug_events.append(f"  -> Snapshot at user line {actual_line} with {len(local_vars)} vars")
        except Exception as e:
            debug_events.append(f"  -> Error capturing: {e}")
        return trace_calls
    elif event == 'return':
        # Capture final state when function returns
        try:
            local_vars = capture_locals(frame)
            
            if local_vars:  # Only add if there are variables
                snapshots.append({
                    'line': 'return',
                    'locals': local_vars,
                    'heap': dict(heap),
                    'call_stack': [],
                    'stack_depth': 0
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
try:
    user_code()
except Exception as e:
    import traceback
    execution_error = {
        'type': type(e).__name__,
        'message': str(e),
        'traceback': traceback.format_exc()
    }

sys.settrace(None)

# Clear all globals except what we need to return
user_vars = list(globals().keys())
for var in user_vars:
    if var not in ['snapshots', 'debug_events', 'json', 'sys', 'execution_error']:
        try:
            del globals()[var]
        except:
            pass

# Convert to JSON
snapshot_json = json.dumps(snapshots)
debug_json = json.dumps(debug_events)
error_json = json.dumps(execution_error)
`;

    const userCodeIndented = code.split('\n').map(line => '    ' + line).join('\n');
    
    const fullCode = wrapperPrefix + '\n' +
      userCodeIndented + '\n' +
      wrapperSuffix.replace('line_offset = 0', `line_offset = ${wrapperLinesBefore}`);
    
    try{
        // Run everything as one block
        await py.runPythonAsync(fullCode);

        // Check for execution error
        const errorJson = py.globals.get('error_json');
        const executionError = errorJson ? JSON.parse(errorJson) : null;
        
        if (executionError) {
            console.error('[Worker] Python execution error:', executionError);
            return {
                success: false,
                error: executionError.message,
                errorType: executionError.type,
                errorTraceback: executionError.traceback,
                snapshots: [],
                debug: []
            };
        }

        // Get JSON string and parse it
        const snapshotJson = py.globals.get('snapshot_json');
        const debugJson = py.globals.get('debug_json');
        
        if (!snapshotJson) {
            return { success: false, error: 'snapshot_json not found in Python globals' };
        }
        
        const snapshots = JSON.parse(snapshotJson);
        const debugEvents = debugJson ? JSON.parse(debugJson) : [];
        return { success: true, snapshots: snapshots, debug: debugEvents };

    } catch (error){
        console.error('[Worker] Execution error:', error);
        return {success: false, error: error.message};
    }
}

//message handler
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