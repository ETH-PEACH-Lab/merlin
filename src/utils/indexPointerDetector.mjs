/**
 * Detect "pointer" variables in a Python scope and turn them into arrow labels
 * on a data structure: integer index pointers into arrays/stacks
 * (computeIndexArrows) and heap-reference pointers into tree/graph nodes
 * (computeNodeArrows).
 */

// Only ints whose variable is *named* like a pointer become arrows, keeping
// unrelated ints (target, n, count, ...) from sprouting arrows by value alone.
const POINTER_NAMES = new Set([
  'i', 'j', 'k', 'l', 'r', 'm',
  'lo', 'hi', 'low', 'high',
  'left', 'right', 'mid', 'middle',
  'start', 'end', 'begin', 'finish',
  'idx', 'index', 'pos', 'position',
  'cur', 'curr', 'current',
  'p', 'q', 'pivot',
  'slow', 'fast',
  'first', 'last',
  'head', 'tail', 'ptr', 'pointer',
  'lft', 'rgt',
]);

export function isPointerName(name) {
  return POINTER_NAMES.has(name.toLowerCase());
}

// Read an int out of a serialized local, or null. Bools are excluded.
function asInt(serialized) {
  if (!serialized || serialized.type !== 'int') return null;
  const n = Number(serialized.value);
  return Number.isInteger(n) ? n : null;
}

export function computeIndexArrows(length, locals, _heap, selfName) {
  const arrows = new Array(length).fill(null);
  if (!locals || length === 0) return arrows;

  const byIndex = new Map();

  for (const [name, serialized] of Object.entries(locals)) {
    if (name === selfName) continue;
    if (!isPointerName(name)) continue;

    const value = asInt(serialized);
    if (value === null) continue;

    let idx = value;
    if (idx < 0) idx += length; // Python-style negative index
    if (idx < 0 || idx >= length) continue;

    if (!byIndex.has(idx)) byIndex.set(idx, []);
    byIndex.get(idx).push({ name, value });
  }

  for (const [idx, entries] of byIndex) {
    entries.sort((a, b) => a.name.localeCompare(b.name));
    arrows[idx] = entries.map((e) => `${e.name} = ${e.value}`).join(', ');
  }

  return arrows;
}

// Variables whose `.value` is read on a line, e.g. `print(node.value)` -> {"node"}.
export function detectValueAccessVars(sourceLine) {
  const vars = new Set();
  if (!sourceLine || typeof sourceLine !== 'string') return vars;
  const re = /(\w+)\s*\.\s*value\b/g;
  let m;
  while ((m = re.exec(sourceLine)) !== null) {
    vars.add(m[1]);
  }
  return vars;
}

export function computeNodeArrows(nodes, locals, _heap, selfName, valueAccessVars = null, selfRootRef = null) {
  const result = new Map();
  if (!nodes || nodes.size === 0 || !locals) return result;

  const byNode = new Map();

  for (const [name, serialized] of Object.entries(locals)) {
    if (!serialized || serialized.ref === undefined || serialized.ref === null) continue;
    // Suppress only the structure's own declaring binding (same name on the
    // root node), not a same-named cursor in another frame.
    if (name === selfName && serialized.ref === selfRootRef) continue;

    const nodeId = `N${serialized.ref}`;
    if (!nodes.has(nodeId)) continue;

    if (!byNode.has(nodeId)) byNode.set(nodeId, []);
    byNode.get(nodeId).push(name);
  }

  for (const [nodeId, names] of byNode) {
    const nodeValue = nodes.get(nodeId)?.value;
    const labels = names.sort().map((name) =>
      valueAccessVars && valueAccessVars.has(name) ? `value = ${nodeValue}` : name,
    );
    result.set(nodeId, [...new Set(labels)].join(', '));
  }

  return result;
}
