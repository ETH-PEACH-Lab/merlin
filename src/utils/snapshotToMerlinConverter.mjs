/**
 * Snapshot → Merlin DSL converter (5-stage pipeline).
 *
 * Turns the execution snapshots captured by the Pyodide worker into Merlin DSL
 * source, one page per meaningful state change. The pipeline runs per snapshot:
 *
 *   1. Resolve   — heap refs in a snapshot's locals are already resolvable via
 *                  `snapshot.heap`; call-stack frames are merged so structures
 *                  built in an outer scope stay visible (`mergeCallStackLocals`).
 *   2. Detect    — `detectStructureType` classifies each variable
 *                  (list/stack/tree/graph/text) using the worker's ds_hint,
 *                  class-name/attribute patterns, and name heuristics.
 *   3. Normalize — `createModel` builds a structure model (ListModel, …) that
 *                  knows how to emit its own DSL.
 *   4. Diff      — `computeDelta` compares this step's models against the prior
 *                  step to find new/changed/removed variables.
 *   5. Emit      — the delta yields `declaration`/`update` DSL commands, laid
 *                  out onto a page.
 *
 * Active entry points (called from PythonVisualizerSection.jsx):
 *   - {@link snapshotsToMerlinDSL_Pipeline}   — full run over all snapshots.
 *   - {@link singleSnapshotToMerlin_Pipeline} — one snapshot (immediate export).
 *   - {@link processSnapshotPipeline}         — the per-snapshot core.
 */
import { detectStructureType, createModel } from './structureDetector.mjs';
import { computeDelta } from './structureDiffer.mjs';
import { sanitizeDSLIdentifier } from './structureModels.mjs';
import { detectValueAccessVars } from './indexPointerDetector.mjs';

/**
 * Merge locals from every call-stack frame into one {name: value} map, innermost
 * frame winning on name collisions. Lets structures created in an outer scope
 * (e.g. a `root` tree built at top level) stay visible while execution is inside
 * a function that walks them.
 * @param {Object} snapshot - Execution snapshot with optional `call_stack`/`locals`.
 * @returns {Object} Merged locals map.
 */
function mergeCallStackLocals(snapshot) {
  if (!snapshot) return {};
  const stack = snapshot.call_stack;
  if (!stack || stack.length === 0) return snapshot.locals || {};
  const merged = {};
  
  for (let i = stack.length - 1; i >= 0; i--) {
    const locals = stack[i].locals || {};
    for (const k in locals) {
      if (!(k in merged)) merged[k] = locals[k];
    }
  }
  return merged;
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
export function processSnapshotPipeline(
  currentSnapshot,
  previousSnapshot,
  previousModels = new Map(),
  initializedVariables = new Set(),
  sourceLine = '',
) {
  const heap = currentSnapshot.heap || {};
  // Vars whose `.value` is read on `sourceLine` (the just-executed line for this
  // page) — used to relabel a tree node's pointer arrow as `value = <n>` (vs the
  // plain variable name for `.left`/`.right` navigation).
  const valueAccessVars = detectValueAccessVars(sourceLine);
  // Frames are not drawn, but a data structure built in an outer scope (e.g. a
  // `root` tree created at top level inside the `user_code` wrapper) must still
  // be visualized while execution is inside a function that walks it. So we
  // DETECT structures across all call-stack frames (`detectionLocals`), while
  // POINTERS/arrows come from the innermost frame only (`innermostLocals`) — the
  // currently-executing scope — so only the active cursor (e.g. the `node`
  // parameter of a recursive traversal) highlights, not outer-frame temporaries.
  const innermostLocals = currentSnapshot.locals || {};
  const detectionLocals = mergeCallStackLocals(currentSnapshot);
  const previousLocals = previousSnapshot?.locals || {};

  // Only data structures (tree/list/stack/graph) get standalone components.
  // Scalars are NOT shown as text boxes — index/pointer variables already
  // appear as arrows over the accessed cell, and other scalars (target, n,
  // result, …) would just be noise floating in the layout.
  const currentModels = new Map();
  // Track heap refs already claimed in this snapshot to avoid duplicate models
  // (e.g. `graph` inside a function that aliases the outer `network` dict).
  const seenHeapRefs = new Set();
  // Pre-seed refs for out-of-scope previousModels only: if a var is no longer
  // in the current scope, block any aliased local from re-declaring its structure.
  // Vars that ARE still in scope must NOT be seeded — they need normal update
  // processing so that setColor / setArrow commands are generated each step.
  const currentSafeNames = new Set(
    Object.keys(detectionLocals).map((n) => sanitizeDSLIdentifier(n))
  );
  previousModels.forEach((m, varName) => {
    if (m.heapRef !== undefined && !currentSafeNames.has(varName)) {
      seenHeapRefs.add(m.heapRef);
    }
  });

  Object.entries(detectionLocals).forEach(([varName, serializedValue]) => {
    const detection = detectStructureType(varName, serializedValue, heap, detectionLocals);
    if (detection.type === 'text') return; // skip all scalars / non-structures
    // Skip if another model already represents this exact heap object.
    const ref = serializedValue?.ref;
    if (ref !== undefined) {
      if (seenHeapRefs.has(ref)) return;
      seenHeapRefs.add(ref);
    }
    // Sanitize the DSL identifier so a Python variable named e.g. `graph` or
    // `stack` doesn't collide with a reserved Merlin DSL keyword.
    const safeVarName = sanitizeDSLIdentifier(varName);
    const model = createModel(safeVarName, detection, heap, innermostLocals, previousLocals, valueAccessVars);
    if (model) {
      model.heapRef = ref;  // store for dedup in future snapshots
      currentModels.set(safeVarName, model);
    }
  });

  const delta = computeDelta(currentModels, previousModels, initializedVariables);
  const dslCommands = delta.getDSLCommands();

  return {
    dslCommands,
    models: currentModels,
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
  const previousModels = new Map();          // standalone models from prior step
  const initializedVariables = new Set();    // components already declared
  const sourceLines = (pythonCode || '').split('\n');
  // Match the worker's capture limit (maxSteps = 1000); snapshots with no
  // changes are skipped/sticky, so emitted pages stay far below this.
  const maxSnapshots = Math.min(snapshots.length, 1000);
  // snapshotToPage[i] = 1-based page index shown when stepping to snapshot i.
  // Snapshots that don't produce DSL changes "stick" on the last emitted page.
  const snapshotToPage = new Array(snapshots.length).fill(1);
  let currentPageNum = 0;

  for (let i = 0; i < maxSnapshots; i++) {
    const currentSnapshot = snapshots[i];
    const previousSnapshot = i > 0 ? snapshots[i - 1] : null;

    // A page built from snapshot i represents the state *after* the previous
    // line executed (the UI shows page[i+1] while line[i] is highlighted). So a
    // `<var>.value` read should be detected from the just-executed line — the
    // PREVIOUS snapshot's line — so `value = X` appears when that line is the
    // highlighted/active one, not one step early.
    const sourceLine =
      previousSnapshot && typeof previousSnapshot.line === 'number'
        ? sourceLines[previousSnapshot.line - 1] || ''
        : '';

    const { dslCommands, delta, models } = processSnapshotPipeline(
      currentSnapshot,
      previousSnapshot,
      previousModels,
      initializedVariables,
      sourceLine,
    );

    if (!delta.hasChanges()) {
      snapshotToPage[i] = Math.max(currentPageNum, 1);
      continue;
    }

    models.forEach((model, varName) => previousModels.set(varName, model));

    const declarations = dslCommands.filter((cmd) => cmd.type === 'declaration');
    const updates = dslCommands.filter((cmd) => cmd.type === 'update');
    const actualDeclarations = declarations.filter(
      (cmd) => !initializedVariables.has(cmd.varName),
    );

    if (actualDeclarations.length === 0 && updates.length === 0) {
      snapshotToPage[i] = Math.max(currentPageNum, 1);
      continue;
    }

    currentPageNum += 1;
    snapshotToPage[i] = currentPageNum;

    // Each component gets 2 grid rows for vertical breathing room.
    // 1 component → 4x2 grid, spans (0..3, 0..1) = full canvas height.
    // N components → 4x(2N) grid, each spans 2 rows = 1/N canvas height.
    const totalComponents = initializedVariables.size + actualDeclarations.length;
    const rowsPerComponent = 2;
    const rowsNeeded = Math.max(totalComponents, 1) * rowsPerComponent;
    lines.push(`page 4x${rowsNeeded}`);

    actualDeclarations.forEach((cmd) => {
      lines.push(cmd.command);
      initializedVariables.add(cmd.varName);
    });

    let row = 0;
    initializedVariables.forEach((varName) => {
      lines.push(`show ${varName} (0..3, ${row}..${row + rowsPerComponent - 1})`);
      row += rowsPerComponent;
    });

    updates.forEach((cmd) => lines.push(cmd.command));

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
