/**
 * Algorithm-state overlay detection for graph traversal (BFS/DFS). Graph nodes
 * are identified by *value* (the dict key, e.g. "A") rather than heap ref, since
 * GraphModel node ids are `N_<key>`. Two overlays: computeValueNodeArrows
 * ("current node" pointer arrows) and computeMembershipColors (fill colors from
 * visited/queue/stack membership).
 */

const GRAPH_POINTER_NAMES = new Set([
  'current', 'curr', 'cur', 'node', 'start', 'end', 'target',
  'neighbor', 'neighbour', 'next', 'parent',
  'u', 'v', 'src', 'source', 'dst', 'dest',
]);

// Variable-name patterns -> fill color, in priority order; earlier roles win.
const ROLE_COLORS = [
  { pattern: /visited|seen|explored|done/i, color: 'lightgreen' },
  { pattern: /queue|frontier|pending|tovisit|to_visit/i, color: 'lightblue' },
  { pattern: /stack/i, color: 'orange' },
];

// Scalar out of a serialized value, or null for refs/compound types.
function scalarValue(serialized) {
  if (!serialized || serialized.ref !== undefined) return null;
  if (serialized.value === undefined) return null;
  return String(serialized.value);
}

export function computeValueNodeArrows(nodes, locals, selfName, previousLocals = null) {
  const result = new Map();
  if (!nodes || nodes.size === 0 || !locals) return result;

  const byValue = new Map();
  for (const node of nodes.values()) {
    byValue.set(String(node.value), node.id);
  }

  const byNode = new Map();

  for (const [name, serialized] of Object.entries(locals)) {
    if (name === selfName) continue;
    if (!GRAPH_POINTER_NAMES.has(name.toLowerCase())) continue;

    const value = scalarValue(serialized);
    if (value === null) continue;

    // Suppress pointers that haven't moved since the previous snapshot.
    if (previousLocals) {
      const prev = previousLocals[name];
      const prevValue = prev ? scalarValue(prev) : null;
      if (prevValue !== null && prevValue === value) continue;
    }

    const nodeId = byValue.get(value);
    if (!nodeId) continue;

    if (!byNode.has(nodeId)) byNode.set(nodeId, []);
    byNode.get(nodeId).push(name);
  }

  for (const [nodeId, names] of byNode) {
    result.set(nodeId, names.sort().join(', '));
  }

  return result;
}

function computeMembershipColors(nodes, locals, heap, selfName) {
  const result = new Map();
  if (!nodes || nodes.size === 0 || !locals || !heap) return result;

  const byValue = new Map();
  for (const node of nodes.values()) {
    byValue.set(String(node.value), node.id);
  }

  for (const { pattern, color } of ROLE_COLORS) {
    for (const [name, serialized] of Object.entries(locals)) {
      if (name === selfName) continue;
      if (!pattern.test(name)) continue;
      if (!serialized || serialized.ref === undefined) continue;

      const heapObj = heap[serialized.ref];
      if (!heapObj || !['list', 'set', 'tuple', 'deque'].includes(heapObj.type)) continue;
      if (!Array.isArray(heapObj.value)) continue;

      for (const item of heapObj.value) {
        const value = scalarValue(item);
        if (value === null) continue;

        const nodeId = byValue.get(value);
        if (!nodeId) continue;
        if (!result.has(nodeId)) result.set(nodeId, color);
      }
    }
  }

  return result;
}
