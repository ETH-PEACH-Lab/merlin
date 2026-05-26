import { detectStructureType, createModel, detectAllVariables } from './structureDetector.mjs';
import { computeDelta } from './structureDiffer.mjs';
import { FrameModel } from './structureModels.mjs';

function createFrameInfo(id, displayName, depth) {
  return { id, displayName, depth };
}

function convertElementToMerlin(el) {
  const num = Number(el);
  return isNaN(num) ? `"${el}"` : num;
}

function processSnapshotFrames(snapshot) {
  const frameModels = new Map();
  if (!snapshot || !snapshot.call_stack) {
    return frameModels;
  }

  const globalFrame = new FrameModel(createFrameInfo('global', 'Global', 0));
  frameModels.set('global', globalFrame);

  snapshot.call_stack.forEach((frame, index) => {
    const frameId = `${frame.function}_${frame.line}_${index}`;
    const funcFrame = new FrameModel(createFrameInfo(frameId, `${frame.function} (line ${frame.line})`, index + 1));
    frameModels.set(frameId, funcFrame);

    for (const [varName, serializedValue] of Object.entries(frame.locals)) {
      const model = createModel(varName, serializedValue, snapshot.heap, frame.locals);
      if (model) {
        funcFrame.addVariable(model);
      }
    }
  });
  
  if (snapshot.locals) {
    for (const [varName, serializedValue] of Object.entries(snapshot.locals)) {
      const inCallStack = snapshot.call_stack.some(f => f.locals.hasOwnProperty(varName));
      if (!inCallStack) {
        const model = createModel(varName, serializedValue, snapshot.heap, snapshot.locals);
        if (model) {
          globalFrame.addVariable(model);
        }
      }
    }
  }

  return frameModels;
}


export function convertSnapshotsToDSL(currentSnapshot, previousSnapshot) {
  const dslCommands = [];
  const currentFrames = processSnapshotFrames(currentSnapshot);
  const previousFrames = processSnapshotFrames(previousSnapshot);

  dslCommands.push('page');

  for (const [frameId, currentFrame] of currentFrames.entries()) {
    const previousFrame = previousFrames.get(frameId);

    if (!previousFrame) {
      dslCommands.push(currentFrame.toDSLDeclaration());
      dslCommands.push(...currentFrame.getLayoutCommands());
    } else {
      const varUpdates = computeDelta(currentFrame.variables, previousFrame.variables);
      dslCommands.push(...varUpdates);
    }
  }
 
  const sortedFrames = [...currentFrames.values()].sort((a, b) => a.depth - b.depth);
  for (let i = 0; i < sortedFrames.length - 1; i++) {
    const topFrame = sortedFrames[i];
    const bottomFrame = sortedFrames[i+1];
    dslCommands.push(`${topFrame.id}_frame.below = ${bottomFrame.id}_frame`);
  }

  return dslCommands.join('\n');
}


/**
 * LEGACY: Resolve a value from the serialized format (primitives or heap references)
 * Kept for backward compatibility
 * @param {*} value - Serialized value (primitive with {type, value} or heap ref with {ref})
 * @param {Object} heap - Heap dictionary mapping object IDs to their data
 * @returns {*} Resolved value
 */
export function resolveValue(value, heap) {
  if (!value) return null;
  
  if (value.type) {
    return value.value;
  }
  
  if (value.ref) {
    return heap[value.ref];
  }
  
  return null;
}

export function extractArrayElements(heapObj, heap) {
  if (!heapObj || !heapObj.value) return [];
  
  return heapObj.value.map((item) => {
    if (item.type) {
      return item.value !== undefined ? item.value : item.type;
    }
    if (item.ref && heap[item.ref]) {
      const refObj = heap[item.ref];
      if (refObj.type === 'list' || refObj.type === 'array') {
        return `[${extractArrayElements(refObj, heap).join(', ')}]`;
      }
      if (refObj.type === 'dict') {
        return '{...}';
      }
      return `${refObj.type}`;
    }
    return '?';
  });
}

export function sanitizeVariableName(name) {
  return name.replace(/[^a-zA-Z0-9_]/g, '_');
}

export function valuesAreEqual(oldValue, newValue, heap) {
  if (oldValue && newValue && oldValue.type === 'list' && newValue.type === 'list') {
    const oldElements = extractArrayElements(oldValue, heap).join(',');
    const newElements = extractArrayElements(newValue, heap).join(',');
    return oldElements === newElements;
  }
  
  if (oldValue && newValue && oldValue.type && newValue.type) {
    return oldValue.type === newValue.type && oldValue.value === newValue.value;
  }
  
  return oldValue === newValue;
}


export function getMerlinType(resolvedValue) {
  if (resolvedValue && typeof resolvedValue === 'object') {
    if (resolvedValue.type === 'list' || resolvedValue.type === 'array') {
      return 'array';
    }
    if (resolvedValue.type === 'dict') {
      return 'text';
    }
  }
  return 'text';
}

function formatDisplayValue(value) {
  return typeof value === 'string' ? `"${value}"` : value;
}

class SnapshotToMerlinConverter {
  constructor() {
    this.dslCommands = [];
    this.frameComponentNames = [];
    this.declaredComponents = new Set();
  }

  addDslCommand(command) {
    this.dslCommands.push(command);
  }

  getDslCommands() {
    return this.dslCommands.join('\n');
  }

  _processCallStack(callStack) {
    this.frameComponentNames = [];
    if (!callStack) return;

    callStack.forEach((frame, index) => {
      const frameName = `frame_${index}`;
      this.frameComponentNames.push(frameName);
      const frameLabel = `${frame.function}:${frame.line}`;

      if (!this.declaredComponents.has(frameName)) {
        this.addDslCommand(`text ${frameName} = { value: "${frameLabel}" }`);
        this.declaredComponents.add(frameName);
      } else {
        this.addDslCommand(`${frameName}.value = "${frameLabel}"`);
      }
    });
  }

  _arrangeLayout() {
    if (this.frameComponentNames.length > 1) {
      for (let i = 0; i < this.frameComponentNames.length - 1; i++) {
        this.addDslCommand(`${this.frameComponentNames[i]}.below = ${this.frameComponentNames[i+1]}`);
      }
    }
  }

  convert(snapshot) {
    this.dslCommands = [];
    
    this._processCallStack(snapshot.call_stack);
    this._arrangeLayout();

    return this.getDslCommands();
  }
}

export function generateSnapshotUpdates(
  currentSnapshot,
  previousSnapshot,
  heap,
  declaredVariables,
  snapshotIndex
) {
  const declarations = [];
  const updates = [];
  const previousLocals = previousSnapshot?.locals || {};
  const currentLocals = currentSnapshot?.locals || {};
  
  Object.entries(currentLocals).forEach(([varName, serializedValue]) => {
    const safeName = sanitizeVariableName(varName);
    const resolvedValue = resolveValue(serializedValue, heap);
    
    if (resolvedValue === null) return;
    
    const isNewVariable = !previousLocals[varName];
    const wasChanged = previousLocals[varName] &&
      !valuesAreEqual(
        resolveValue(previousLocals[varName], previousSnapshot?.heap || {}),
        resolvedValue,
        heap
      );
    
    if (isNewVariable) {
      const type = getMerlinType(resolvedValue);
      
      if (type === 'array' && (resolvedValue.type === 'list' || resolvedValue.type === 'tuple')) {
        const elements = extractArrayElements(resolvedValue, heap);
        const merlinArray = elements.map(convertElementToMerlin);
        
        declarations.push(
          `array ${safeName} = {\n` +
          `\tvalue: [${merlinArray.join(', ')}]\n` +
          `}`
        );
      } else {
        const displayValue = formatDisplayValue(resolvedValue);
        
        declarations.push(
          `text ${safeName} = {\n` +
          `\tvalue: "${varName} = ${displayValue}"\n` +
          `}`
        );
      }
      
      declaredVariables.add(safeName);
    } else if (wasChanged && declaredVariables.has(safeName)) {
      if (resolvedValue.type === 'list' || resolvedValue.type === 'array' || resolvedValue.type === 'tuple') {
        const elements = extractArrayElements(resolvedValue, heap);
        const merlinArray = elements.map(convertElementToMerlin);
        
        updates.push(`${safeName}.setValues([${merlinArray.join(', ')}])`);
      } else {
        const displayValue = formatDisplayValue(resolvedValue);
        
        updates.push(
          `${safeName}.setValue("${varName} = ${displayValue}")`
        );
      }
    }
  });
  
  return { declarations, updates };
}


export function snapshotsToMerlinDSL(snapshots, pythonCode) {
  if (!snapshots || snapshots.length === 0) {
    return 'page\ntext info = { value: "No execution snapshots to display" }';
  }

  const converter = new SnapshotToMerlinConverter();
  const pages = [];
  const declaredVariables = new Set();

  pages.push('// Python Execution Trace - Animated Execution');
  pages.push('// Generated from snapshot sequence');
  pages.push('');

  const maxSnapshots = Math.min(snapshots.length, 100);

  for (let i = 0; i < maxSnapshots; i++) {
    const currentSnapshot = snapshots[i];
    const previousSnapshot = i > 0 ? snapshots[i - 1] : null;
    const heap = currentSnapshot.heap || {};

    const frameDsl = converter.convert(currentSnapshot);

    const { declarations, updates } = generateSnapshotUpdates(
      currentSnapshot,
      previousSnapshot,
      heap,
      declaredVariables,
      i
    );

    if (declarations.length > 0 || updates.length > 0 || frameDsl) {
      pages.push(`// Step ${i + 1}`);
      if (currentSnapshot.line && currentSnapshot.line !== 'return') {
        pages.push(`// Line ${currentSnapshot.line}`);
      }
      pages.push('');

      if (declarations.length > 0) {
        pages.push(...declarations);
        pages.push('');
      }

      if (frameDsl) {
        pages.push(frameDsl);
        pages.push('');
      }

      pages.push('page');

      if (updates.length > 0) {
        pages.push(...updates);
      }

      declaredVariables.forEach((varName) => {
        pages.push(`show ${varName}`);
      });

      converter.frameComponentNames.forEach((frameName) => {
        pages.push(`show ${frameName}`);
      });

      pages.push('');
    }
  }

  return pages.join('\n');
}


export function singleSnapshotToMerlin(snapshot, pythonCode) {
  const declaredVariables = new Set();
  const heap = snapshot.heap || {};
  const { declarations, updates } = generateSnapshotUpdates(
    snapshot,
    null,
    heap,
    declaredVariables,
    0
  );
  
  const lines = [
    '// Single Snapshot',
    '',
    ...declarations,
    '',
    'page',
    ...updates,
  ];
  
  declaredVariables.forEach((varName) => {
    lines.push(`show ${varName}`);
  });
  
  return lines.join('\n');
}

/**
 * Process a single snapshot using the 5-stage pipeline
 * 
 * Stage 1: Resolve - values already in snapshot format
 * Stage 2: Detect - use detectStructureType() to identify each variable's type
 * Stage 3: Normalize - create appropriate model (ListModel, StackModel, etc.)
 * Stage 4: Diff - compare with previousModels to find changes
 * Stage 5: Emit - generate DSL declarations and update commands
 * 
 * @param {Object} currentSnapshot - Current execution snapshot
 * @param {Object} previousSnapshot - Previous snapshot (or null for first)
 * @returns {Object} {dslCommands, models, delta}
 */
// Resolve the call stack into FrameModels. Worker order is innermost→outermost;
// we walk outer→inner so depth 0 is the outermost frame ("global" for the
// module-level wrapper). Frame IDs are stable while a function stays on the
// stack — when the function name at a given depth changes (different call),
// a fresh id is allocated via `state.frameCounter`.
function buildFrames(snapshot, heap, state) {
  const rawStack = snapshot.call_stack || [];
  const outerToInner = [...rawStack].reverse();

  // Fallback: no call stack metadata (older snapshot format). Use top-level
  // locals as a synthetic global frame so the pipeline still emits something.
  if (outerToInner.length === 0 && snapshot.locals) {
    outerToInner.push({
      function: 'user_code',
      line: null,
      locals: snapshot.locals,
    });
  }

  const resolved = [];
  for (let i = 0; i < outerToInner.length; i++) {
    const entry = outerToInner[i];
    const isOutermost = i === 0;
    const isWrapper = entry.function === 'user_code' || entry.function === '<module>';
    const displayName = isOutermost && isWrapper ? 'global' : entry.function;

    const prev = state.previousFrameStack[i];
    let frameId;
    if (prev && prev.displayName === displayName) {
      frameId = prev.frameId;
    } else {
      // Strip leading/trailing underscores so __init__ → init_N (valid DSL identifier)
      const safeName = displayName.replace(/^_+|_+$/g, '') || 'func';
      frameId = `${safeName}_${state.frameCounter++}`;
    }

    resolved.push({
      frameId,
      displayName,
      depth: i,
      locals: entry.locals || {},
    });
  }

  const frames = new Map();
  resolved.forEach(({ frameId, displayName, depth, locals }) => {
    const frameModel = new FrameModel({ id: frameId, displayName, depth });
    Object.entries(locals).forEach(([varName, serializedValue]) => {
      const detection = detectStructureType(varName, serializedValue, heap, locals);
      const model = createModel(varName, detection, heap, locals);
      if (model) frameModel.addVariable(model);
    });
    frames.set(frameId, frameModel);
  });

  const innermostLocals = resolved.length > 0
    ? resolved[resolved.length - 1].locals
    : {};

  return { frames, resolvedStack: resolved, innermostLocals };
}

export function processSnapshotPipeline(
  currentSnapshot,
  previousSnapshot,
  previousModels = new Map(),
  initializedVariables = new Set(),
  state = { previousFrameStack: [], previousFrames: new Map(), frameCounter: 0 },
) {
  const heap = currentSnapshot.heap || {};

  // Build per-call-stack frame models (one Merlin frame per Python frame).
  const { frames, resolvedStack, innermostLocals } = buildFrames(currentSnapshot, heap, state);

  // Standalone complex models come from the innermost scope only — outer
  // frames' complex variables stay frame-only (shown as a type hint).
  const currentModels = new Map();
  Object.entries(innermostLocals).forEach(([varName, serializedValue]) => {
    const detection = detectStructureType(varName, serializedValue, heap, innermostLocals);
    if (detection.type === 'text') return;
    const model = createModel(varName, detection, heap, innermostLocals);
    if (model) currentModels.set(varName, model);
  });

  const delta = computeDelta(currentModels, previousModels, initializedVariables);
  const dslCommands = delta.getDSLCommands();

  // Diff frames against the previous snapshot's frames.
  const frameCommands = [];
  for (const [frameId, frameModel] of frames) {
    const previous = state.previousFrames.get(frameId);
    if (!previous) {
      frameCommands.push({
        type: 'frame_declaration',
        frameId,
        component: frameModel.componentName(),
        command: frameModel.toDSLDeclaration(),
      });
    } else {
      frameModel.toDSLUpdates(previous).forEach((cmd) => {
        frameCommands.push({
          type: 'frame_update',
          frameId,
          component: frameModel.componentName(),
          command: cmd,
        });
      });
    }
  }

  const removedFrameIds = [];
  for (const frameId of state.previousFrames.keys()) {
    if (!frames.has(frameId)) removedFrameIds.push(frameId);
  }

  return {
    dslCommands,
    models: currentModels,
    frames,
    resolvedStack,
    frameCommands,
    removedFrameIds,
    delta,
    initializedVariables: delta.initializedVariables,
  };
}

/**
 * Convert all snapshots using the NEW 5-stage pipeline
 * 
 * @param {Array} snapshots - Array of snapshots from execution
 * @param {string} pythonCode - Original Python code
 * @returns {string} Complete Merlin DSL code
 */
export function snapshotsToMerlinDSL_Pipeline(snapshots, pythonCode) {
  if (!snapshots || snapshots.length === 0) {
    return {
      dsl: 'page\ntext info = { value: "No execution snapshots to display" }',
      snapshotToPage: [],
    };
  }

  const lines = [];
  const previousModels = new Map();          // standalone complex models
  const initializedVariables = new Set();    // standalone components already declared
  const initializedFrames = new Set();       // frame components already declared
  const state = {
    previousFrameStack: [],                  // outer→inner stack from prior snapshot
    previousFrames: new Map(),               // frameId → FrameModel from prior snapshot
    frameCounter: 0,
  };
  const maxSnapshots = Math.min(snapshots.length, 100);
  // snapshotToPage[i] = 1-based page index shown when stepping to snapshot i.
  // Snapshots that don't produce DSL changes "stick" on the last emitted page.
  const snapshotToPage = new Array(snapshots.length).fill(1);
  let currentPageNum = 0;

  for (let i = 0; i < maxSnapshots; i++) {
    const currentSnapshot = snapshots[i];
    const previousSnapshot = i > 0 ? snapshots[i - 1] : null;

    const {
      dslCommands,
      delta,
      models,
      frames,
      resolvedStack,
      frameCommands,
      removedFrameIds,
    } = processSnapshotPipeline(
      currentSnapshot,
      previousSnapshot,
      previousModels,
      initializedVariables,
      state,
    );

    const frameDeclarations = frameCommands.filter((c) => c.type === 'frame_declaration');
    const frameUpdates = frameCommands.filter((c) => c.type === 'frame_update');
    const hasFrameChanges =
      frameDeclarations.length > 0 ||
      frameUpdates.length > 0 ||
      removedFrameIds.length > 0;

    if (!delta.hasChanges() && !hasFrameChanges) {
      snapshotToPage[i] = Math.max(currentPageNum, 1);
      continue;
    }

    // Capture component names of frames that just went out of scope BEFORE
    // we overwrite state.previousFrames — we need them to emit `hide` commands.
    const hideCommands = removedFrameIds
      .map((id) => state.previousFrames.get(id))
      .filter(Boolean)
      .map((frameModel) => `hide ${frameModel.componentName()}`);

    models.forEach((model, varName) => previousModels.set(varName, model));
    state.previousFrames = frames;
    state.previousFrameStack = resolvedStack.map(({ frameId, displayName }) => ({
      frameId,
      displayName,
    }));

    const declarations = dslCommands.filter((cmd) => cmd.type === 'declaration');
    const updates = dslCommands.filter((cmd) => cmd.type === 'update');
    const actualDeclarations = declarations.filter(
      (cmd) => !initializedVariables.has(cmd.varName),
    );

    if (
      actualDeclarations.length === 0 &&
      updates.length === 0 &&
      frameDeclarations.length === 0 &&
      frameUpdates.length === 0 &&
      hideCommands.length === 0
    ) {
      snapshotToPage[i] = Math.max(currentPageNum, 1);
      continue;
    }

    currentPageNum += 1;
    snapshotToPage[i] = currentPageNum;

    // Generate the columns: 
    // Left column (col 0): Frames.
    // Right column (col 1): Data structures (lists, trees, graphs, variables).
    // The frames remain strictly adjacent to the border and not below the data structures.
    const maxFrameDepth = Math.max(
      -1,
      ...[...frames.values()].map((f) => f.depth),
    );
    const standaloneCount = initializedVariables.size;
    const rowsNeeded = Math.max(maxFrameDepth + 1, standaloneCount, 4);
    lines.push(`page 4x${rowsNeeded}`);

    actualDeclarations.forEach((cmd) => {
      lines.push(cmd.command);
      initializedVariables.add(cmd.varName);
    });

    frameDeclarations.forEach((cmd) => {
      lines.push(cmd.command);
      initializedFrames.add(cmd.frameId);
    });

    // Hide frames whose function just returned.
    hideCommands.forEach((cmd) => lines.push(cmd));

    // Only `show` frames currently on the stack. Position is column 0,
    frames.forEach((frameModel, frameId) => {
      if (initializedFrames.has(frameId)) {
        lines.push(`show ${frameModel.componentName()} (0, ${frameModel.depth})`);
      }
    });

    // Standalone components go in column 1 to 3 (right wide area), one per row.
    let standaloneRow = 0;
    initializedVariables.forEach((varName) => {
      lines.push(`show ${varName} (1..3, ${standaloneRow})`);
      standaloneRow++;
    });

    updates.forEach((cmd) => lines.push(cmd.command));
    frameUpdates.forEach((cmd) => lines.push(cmd.command));

    lines.push('');
  }

  // Any snapshots above the maxSnapshots cap stick on the last emitted page.
  for (let i = maxSnapshots; i < snapshots.length; i++) {
    snapshotToPage[i] = Math.max(currentPageNum, 1);
  }

  return { dsl: lines.join('\n'), snapshotToPage };
}

/**
 * Single snapshot using the new pipeline (for immediate exports)
 * 
 * @param {Object} snapshot - Single snapshot
 * @param {string} pythonCode - Original Python code  
 * @returns {string} Merlin DSL for single page
 */
export function singleSnapshotToMerlin_Pipeline(snapshot, pythonCode) {
  const initializedVariables = new Set();
  const { dslCommands, models } = processSnapshotPipeline(snapshot, null, initializedVariables);
  
  const lines = [
    '// Single Snapshot (Phase 3 Pipeline)',
    '',
  ];
  
  const declaredVariables = new Set();
  
  // Add declarations
  dslCommands
    .filter((cmd) => cmd.type === 'declaration')
    .forEach((cmd) => {
      lines.push(cmd.command);
      lines.push('');
      declaredVariables.add(cmd.varName);
    });
  
  lines.push('page');
  
  // Add updates (shouldn't be any for single snapshot)
  dslCommands
    .filter((cmd) => cmd.type === 'update')
    .forEach((cmd) => {
      lines.push(cmd.command);
    });
  
  // Show all
  declaredVariables.forEach((varName) => {
    lines.push(`show ${varName}`);
  });
  
  return lines.join('\n');
}
