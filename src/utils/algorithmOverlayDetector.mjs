/**
 * Algorithm-state overlay detection for graph traversal (BFS/DFS). Graph nodes
 * are identified by *value* (the dict key, e.g. "A") rather than heap ref, since
 * GraphModel node ids are `N_<key>`. Provides computeValueNodeArrows, which
 * draws "current node" pointer arrows from traversal cursor variables.
 */

const GRAPH_POINTER_NAMES = new Set([
  'current', 'curr', 'cur', 'node', 'start', 'end', 'target',
  'neighbor', 'neighbour', 'next', 'parent',
  'u', 'v', 'src', 'source', 'dst', 'dest',
]);

// Scalar out of a serialized value, or null for refs/compound types.
function scalarValue(serialized) {
  if (!serialized || serialized.ref !== undefined) return null;
  if (serialized.value === undefined) return null;
  return String(serialized.value);
}

/**
 * Build "current node" pointer arrows for a graph by matching traversal cursor
 * variables (current, node, u, v, …) to nodes *by value* (the dict key). A
 * pointer that hasn't moved since `previousLocals` is suppressed; multiple
 * pointers on one node are joined, sorted by name.
 * @param {Map} nodes - Node id → node ({value, …}).
 * @param {Object} locals - Frame locals to scan for cursor variables.
 * @param {string} selfName - The graph's own variable name (skipped).
 * @param {Object} [previousLocals] - Prior locals, to suppress unmoved pointers.
 * @returns {Map<string,string>} Node id → arrow label.
 */
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
