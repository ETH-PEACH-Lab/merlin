import { computeIndexArrows, computeNodeArrows } from './indexPointerDetector.mjs';
import { computeValueNodeArrows } from './algorithmOverlayDetector.mjs';


const RESERVED_DSL_WORDS = new Set([
  'array', 'matrix', 'graph', 'linkedlist', 'tree', 'stack', 'text', 'frame',
]);


export function sanitizeDSLIdentifier(name) {
  const safe = name.replace(/[^a-zA-Z0-9_]/g, '_');
  return RESERVED_DSL_WORDS.has(safe) ? `${safe}_` : safe;
}

function formatArrowLabel(label) {
  return label === null || label === undefined ? 'null' : `"${label}"`;
}


function diffIndexArrows(varName, currentArrows, previousArrows) {
  const updates = [];
  
  const len = currentArrows?.length || 0;
  for (let i = 0; i < len; i++) {
    const cur = currentArrows?.[i] ?? null;
    const prev = previousArrows?.[i] ?? null;
    if (cur !== prev) {
      updates.push(`${varName}.setArrow(${i}, ${formatArrowLabel(cur)})`);
    }
  }
  return updates;
}

function diffNodeArrows(varName, currentArrows, previousArrows, currentNodeIds) {
  const updates = [];
  const cur = currentArrows || new Map();
  const prev = previousArrows || new Map();

  for (const [nodeId, label] of cur) {
    if (prev.get(nodeId) !== label) {
      updates.push(`${varName}.setArrow(${nodeId}, ${formatArrowLabel(label)})`);
    }
  }
  for (const [nodeId] of prev) {
    if (!cur.has(nodeId) && currentNodeIds.has(nodeId)) {
      updates.push(`${varName}.setArrow(${nodeId}, null)`);
    }
  }
  return updates;
}


class StructureModel {
  constructor(varName, heapObj, heap, locals, previousLocals = null) {
    this.varName = varName;
    this.heapObj = heapObj;  // Current snapshot's object
    this.heap = heap;
    this.locals = locals;
    this.previousLocals = previousLocals;
    this.type = null;  // Subclass sets: 'list', 'stack', 'tree', 'graph'
    this.elements = [];  // For list/stack: array of {id, value}
    this.nodes = new Map();  // For tree/graph: id → {id, value, edges, children}
  }

  toDSLDeclaration() {
    throw new Error('toDSLDeclaration() must be implemented by subclass');
  }

  toDSLUpdates(previousModel) {
    throw new Error('toDSLUpdates() must be implemented by subclass');
  }

  resolveValue(value) {
    if (!value) return null;
    if (value.type) return value.value;
    if (value.ref && this.heap[value.ref]) return this.heap[value.ref];
    return null;
  }

  sanitizeName(name) {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
  }
}

export class FrameModel extends StructureModel {
  constructor(frameInfo) {
    super(frameInfo.id, null, null, null);
    this.type = 'frame';
    this.id = frameInfo.id;
    this.displayName = frameInfo.displayName;
    this.depth = frameInfo.depth;
    this.variables = new Map();
    this.coloredVariables = new Set();
  }

  addVariable(varModel) {
    this.variables.set(varModel.varName, varModel);
  }

  // Frame component name used in emitted DSL. Sanitize so the id is a valid word.
  componentName() {
    return `${this.sanitizeName(this.id)}_frame`;
  }

  formatVariableValue(varModel) {
    if (varModel.type === 'text') {
      const sv = varModel.serializedValue;
      if (!sv) return '';
      if (sv.type === 'str') return sv.value;
      if (sv.type === 'int' || sv.type === 'float') return String(sv.value ?? '');
      if (sv.type === 'bool') return sv.value ? 'True' : 'False';
      if (sv.type === 'NoneType') return 'None';
      return String(varModel.displayValue ?? '');
    }
    return varModel.type; // "list" | "stack" | "tree" | "graph"
  }

  toDSLDeclaration() {
    const varNames = [];
    const varValues = [];
    const varColors = [];

    for (const varModel of this.variables.values()) {
      varNames.push(this.sanitizeName(varModel.varName));
      varValues.push(`"${this.formatVariableValue(varModel)}"`);
      varColors.push('null');
    }

    const lines = [
      `frame ${this.componentName()} = {`,
      `  name: "${this.displayName}"`,
      `  variable: [${varNames.join(', ')}]`,
      `  value: [${varValues.join(', ')}]`,
      `  color: [${varColors.join(', ')}]`,
      `}`,
    ];
    return lines.join('\n');
  }

  getLayoutCommands() {
    return [];
  }

  toDSLUpdates(previousFrame) {
    const updates = [];
    if (!previousFrame || previousFrame.type !== 'frame') return updates;

    const component = this.componentName();

    if (previousFrame.coloredVariables && previousFrame.coloredVariables.size > 0) {
      previousFrame.coloredVariables.forEach((name) => {
        if (this.variables.has(name)) {
          updates.push(`${component}.setColor(${this.sanitizeName(name)}, null)`);
        }
      });
      previousFrame.coloredVariables.clear();
    }

    const current = new Map();
    for (const [name, model] of this.variables) {
      current.set(name, this.formatVariableValue(model));
    }
    const previous = new Map();
    for (const [name, model] of previousFrame.variables) {
      previous.set(name, previousFrame.formatVariableValue(model));
    }

    // Removed variables first (so subsequent indices stay valid).
    for (const name of previous.keys()) {
      if (!current.has(name)) {
        updates.push(`${component}.removeVariable(${this.sanitizeName(name)})`);
      }
    }

    // Added variables — highlight with yellow on entry.
    for (const [name, value] of current) {
      if (!previous.has(name)) {
        updates.push(
          `${component}.addVariable(${this.sanitizeName(name)}, "${value}", "yellow")`,
        );
        this.coloredVariables.add(name);
      }
    }

    // Changed values — update the value and highlight the variable.
    for (const [name, value] of current) {
      if (previous.has(name) && previous.get(name) !== value) {
        const safe = this.sanitizeName(name);
        updates.push(`${component}.setValue(${safe}, "${value}")`);
        updates.push(`${component}.setColor(${safe}, "yellow")`);
        this.coloredVariables.add(name);
      }
    }

    return updates;
  }
}


export class TextModel extends StructureModel {
  constructor(varName, serializedValue, heap, locals) {
    super(varName, serializedValue, heap, locals);
    this.type = 'text';
    this.serializedValue = serializedValue;
    this.displayValue = this.formatValue(serializedValue);
  }

  formatValue(serializedValue) {
    if (!serializedValue) return 'None';
    
    if (serializedValue.type === 'int') {
      return serializedValue.value;
    }
    if (serializedValue.type === 'str') {
      return `"${serializedValue.value}"`;
    }
    if (serializedValue.type === 'float') {
      return serializedValue.value;
    }
    if (serializedValue.type === 'bool') {
      return serializedValue.value ? 'True' : 'False';
    }
    
    if (typeof serializedValue === 'object') {
      return 'None';
    }
    
    return String(serializedValue);
  }

  toDSLDeclaration() {
    return `text ${this.varName} = { value: "${this.displayValue}" }`;
  }

  toDSLUpdates(previousModel) {
    if (!previousModel || previousModel.type !== 'text') {
      return [];
    }

    if (this.displayValue === previousModel.displayValue) {
      return [];
    }

    return [`${this.varName}.setValue("${this.displayValue}")`];
  }
}


export class ListModel extends StructureModel {
  constructor(varName, heapObj, heap, locals) {
    super(varName, heapObj, heap, locals);
    this.type = 'list';
    this.coloredIndices = new Set();
    this.normalize();
  }

  normalize() {
    if (!this.heapObj || !this.heapObj.value) {
      this.elements = [];
      this.arrows = [];
      this.arrowedIndices = new Set();
      return;
    }

    this.elements = this.heapObj.value.map((item, idx) => ({
      id: `${this.varName}[${idx}]`,
      value: this.resolveValue(item),
      serialized: item,
    }));

    this.arrows = computeIndexArrows(this.elements.length, this.locals, this.heap, this.varName);
    this.arrowedIndices = new Set(
      this.arrows.reduce((acc, a, i) => (a !== null ? (acc.push(i), acc) : acc), []),
    );
  }

  formatValue(serialized) {
    if (!serialized) return '"?"';
    if (serialized.type) {
      const num = Number(serialized.value);
      return isNaN(num) ? `"${serialized.value}"` : num;
    }
    if (serialized.ref !== undefined) {
      const obj = this.heap[serialized.ref];
      if (!obj) return '"?"';
      if (obj.type === 'list' || obj.type === 'tuple') return `"[${obj.length ?? '...'}]"`;
      if (obj.type === 'set') return `"{${obj.length ?? '...'}}"`;
      if (obj.type === 'dict') return '"{...}"';
      return '"[obj]"';
    }
    return '"?"';
  }

  toDSLDeclaration() {
    const values = this.elements.map((el) => this.formatValue(el.serialized));

    const lines = [
      `array ${this.varName} = {`,
      `  left: "${this.varName}"`,
      `  value: [${values.join(', ')}]`,
    ];

    if (this.arrowedIndices && this.arrowedIndices.size > 0) {
      const arrowVals = this.arrows.map(formatArrowLabel);
      lines.push(`  arrow: [${arrowVals.join(', ')}]`);
      // Highlight accessed (pointed-at) cells yellow.
      const colorVals = this.elements.map((_, i) =>
        this.arrowedIndices.has(i) ? '"yellow"' : 'null',
      );
      lines.push(`  color: [${colorVals.join(', ')}]`);
      this.arrowedIndices.forEach((i) => this.coloredIndices.add(i));
    }

    lines.push(`}`);

    return lines.join('\n');
  }

  toDSLUpdates(previousModel) {
    if (!previousModel || previousModel.type !== 'list') {
      return [];
    }

    const updates = [];
    if (previousModel.coloredIndices && previousModel.coloredIndices.size > 0) {
      previousModel.coloredIndices.forEach(idx => {
        updates.push(`${this.varName}.setColor(${idx}, null)`);
      });
      previousModel.coloredIndices.clear();
    }
    
    const oldLen = previousModel.elements.length;
    const newLen = this.elements.length;

    if (newLen > oldLen) {
      for (let i = oldLen; i < newLen; i++) {
        const newEl = this.elements[i];
        const val = this.formatValue(newEl.serialized);
        updates.push(`${this.varName}.addValue(${val})`);
        updates.push(`${this.varName}.setColor(${i}, "yellow")`);
        this.coloredIndices.add(i);
      }
    }

    if (newLen < oldLen) {

      let allRemovedFromEnd = true;
      for (let i = 0; i < newLen; i++) {
        const oldVal = previousModel.elements[i].value?.value ?? previousModel.elements[i].value;
        const newVal = this.elements[i].value?.value ?? this.elements[i].value;
        if (oldVal !== newVal) {
          allRemovedFromEnd = false;
          break;
        }
      }
      
      if (allRemovedFromEnd) {
        for (let i = oldLen - 1; i >= newLen; i--) {
          updates.push(`${this.varName}.removeAt(${i})`);
        }
      } else {
        const oldValues = previousModel.elements.map((e) => e.value?.value ?? e.value);
        const newValues = this.elements.map((e) => e.value?.value ?? e.value);
        const oldValueCounts = new Map();
        oldValues.forEach(val => {
          oldValueCounts.set(val, (oldValueCounts.get(val) || 0) + 1);
        });
        
        const newValueCounts = new Map();
        newValues.forEach(val => {
          newValueCounts.set(val, (newValueCounts.get(val) || 0) + 1);
        });
        
        for (const [val, oldCount] of oldValueCounts.entries()) {
          const newCount = newValueCounts.get(val) || 0;
          const removedOccurrences = oldCount - newCount;
          if (removedOccurrences > 0) {
            const formattedVal = isNaN(Number(val)) ? `"${val}"` : val;
            for (let i = 0; i < removedOccurrences; i++) {
              updates.push(`${this.varName}.removeValue(${formattedVal})`);
            }
          }
        }
      }
    }

    if (newLen === oldLen) {
      for (let i = 0; i < newLen; i++) {
        const oldVal = previousModel.elements[i].value?.value ?? previousModel.elements[i].value;
        const newVal = this.elements[i].value?.value ?? this.elements[i].value;

        if (oldVal !== newVal) {
          const formattedVal = this.formatValue(this.elements[i].serialized);
          updates.push(`${this.varName}.setValue(${i}, ${formattedVal})`);
          updates.push(`${this.varName}.setColor(${i}, "yellow")`);
          this.coloredIndices.add(i);
        }
      }
    }

    // Move pointer arrows after any value/structure changes so setArrow targets
    // cells that already exist this step.
    updates.push(...diffIndexArrows(this.varName, this.arrows, previousModel.arrows));

    // Highlight currently accessed (pointed-at) cells yellow. Cells already
    // coloured above (added/changed this step) are skipped to avoid duplicates;
    // last step's colours were cleared at the top of this method.
    this.arrowedIndices.forEach((i) => {
      if (!this.coloredIndices.has(i)) {
        updates.push(`${this.varName}.setColor(${i}, "yellow")`);
      }
      this.coloredIndices.add(i);
    });

    return updates;
  }
}


export class StackModel extends StructureModel {
  constructor(varName, heapObj, heap, locals) {
    super(varName, heapObj, heap, locals);
    this.type = 'stack';
    this.coloredIndices = new Set();
    this.normalize();
  }

  normalize() {
    this.elements = [];
    this.arrows = [];
    this.arrowedIndices = new Set();
    if (!this.heapObj) return;

    if (this.heapObj.type === 'list' && this.heapObj.value) {
      this.elements = this.heapObj.value.map((item, idx) => ({
        id: `${this.varName}[${idx}]`,
        serialized: item,
      }));
    } else if (this.heapObj.type === 't' && this.heapObj.attributes) {
      const attrs = this.heapObj.attributes;
      let itemsArray = null;
      if (attrs.items) {
        itemsArray = this.resolveValue(attrs.items);
      } else if (attrs.elements) {
        itemsArray = this.resolveValue(attrs.elements);
      }
      if (itemsArray && itemsArray.value) {
        this.elements = itemsArray.value.map((item, idx) => ({
          id: `${this.varName}.items[${idx}]`,
          serialized: item,
        }));
      }
    }

    this.arrows = computeIndexArrows(this.elements.length, this.locals, this.heap, this.varName);
    this.arrowedIndices = new Set(
      this.arrows.reduce((acc, a, i) => (a !== null ? (acc.push(i), acc) : acc), []),
    );
  }

  formatValue(serialized) {
    if (!serialized) return '"?"';
    if (serialized.type) {
      const num = Number(serialized.value);
      return isNaN(num) ? `"${serialized.value}"` : num;
    }
    if (serialized.ref !== undefined) {
      const obj = this.heap[serialized.ref];
      if (!obj) return '"?"';
      if (obj.type === 'list' || obj.type === 'tuple') return `"[${obj.length ?? '...'}]"`;
      if (obj.type === 'set') return `"{${obj.length ?? '...'}}"`;
      if (obj.type === 'dict') return '"{...}"';
      return '"[obj]"';
    }
    return '"?"';
  }

  toDSLDeclaration() {
    const values = this.elements.map((el) => this.formatValue(el.serialized));

    const lines = [
      `stack ${this.varName} = {`,
      `  left: "${this.varName}"`,
      `  value: [${values.join(', ')}]`,
    ];

    if (this.arrowedIndices && this.arrowedIndices.size > 0) {
      const arrowVals = this.arrows.map(formatArrowLabel);
      lines.push(`  arrow: [${arrowVals.join(', ')}]`);
      // Highlight accessed (pointed-at) cells yellow.
      const colorVals = this.elements.map((_, i) =>
        this.arrowedIndices.has(i) ? '"yellow"' : 'null',
      );
      lines.push(`  color: [${colorVals.join(', ')}]`);
      this.arrowedIndices.forEach((i) => this.coloredIndices.add(i));
    }

    lines.push(`}`);

    return lines.join('\n');
  }

  toDSLUpdates(previousModel) {
    if (!previousModel || previousModel.type !== 'stack') return [];

    const updates = [];
    if (previousModel.coloredIndices && previousModel.coloredIndices.size > 0) {
      previousModel.coloredIndices.forEach(idx => {
        updates.push(`${this.varName}.setColor(${idx}, null)`);
      });
      previousModel.coloredIndices.clear();
    }
    
    const oldLen = previousModel.elements.length;
    const newLen = this.elements.length;

    if (newLen > oldLen) {
      for (let i = oldLen; i < newLen; i++) {
        const newEl = this.elements[i];
        const val = this.formatValue(newEl.serialized);
        updates.push(`${this.varName}.addValue(${val})`);
        updates.push(`${this.varName}.setColor(${i}, "yellow")`);
        this.coloredIndices.add(i);
      }
    }

    if (newLen < oldLen) {
      for (let i = oldLen - 1; i >= newLen; i--) {
        updates.push(`${this.varName}.removeAt(${i})`);
      }
    }

    if (newLen === oldLen) {
      for (let i = 0; i < newLen; i++) {
        const oldVal = previousModel.elements[i].value?.value ?? previousModel.elements[i].value;
        const newVal = this.elements[i].value?.value ?? this.elements[i].value;

        if (oldVal !== newVal) {
          const formattedVal = this.formatValue(this.elements[i].serialized);
          updates.push(`${this.varName}.setValue(${i}, ${formattedVal})`);
          updates.push(`${this.varName}.setColor(${i}, "yellow")`);
          this.coloredIndices.add(i);
        }
      }
    }

    updates.push(...diffIndexArrows(this.varName, this.arrows, previousModel.arrows));

    // Highlight currently accessed (pointed-at) cells yellow.
    this.arrowedIndices.forEach((i) => {
      if (!this.coloredIndices.has(i)) {
        updates.push(`${this.varName}.setColor(${i}, "yellow")`);
      }
      this.coloredIndices.add(i);
    });

    return updates;
  }
}

export class TreeModel extends StructureModel {
  constructor(varName, heapObj, heap, locals, valueAccessVars = null) {
    super(varName, heapObj, heap, locals);
    this.type = 'tree';
    this.edges = [];
    this.rootRef = null;
    this.coloredNodes = new Set();
    this.valueAccessVars = valueAccessVars;
    this.normalize();
  }

  normalize() {
    this.nodes = new Map();
    this.edges = [];
    this.rootRef = null;
    this.nodeArrows = new Map();

    if (!this.heapObj) return;

    let rootRef = null;
    let rootObj = null;
    if (this.heapObj.ref && this.heap[this.heapObj.ref]) {
      rootRef = this.heapObj.ref;
      rootObj = this.heap[this.heapObj.ref];
    } else if (this.heapObj.type === 't') {
      rootObj = this.heapObj;
      rootRef = this.heapObj.id || this.heapObj.ref || 'root';
    }

    if (!rootObj?.attributes) return;

    this.rootRef = rootRef;
    const visited = new Set();
    const queue = [{ ref: rootRef, obj: rootObj, parentId: null }];

    while (queue.length > 0) {
      const { ref, obj, parentId } = queue.shift();

      if (!obj?.attributes || visited.has(ref)) continue;
      visited.add(ref);

      const nodeId = `N${ref}`;
      this.nodes.set(nodeId, { id: nodeId, value: this.getNodeValue(obj) });

      if (parentId !== null) {
        this.edges.push({ parent: parentId, child: nodeId });
      }

      const childrenRef = obj.attributes.children;
      const childrenList = childrenRef?.ref 
        ? this.heap[childrenRef.ref] 
        : childrenRef;

      if (childrenList?.value) {
        childrenList.value.forEach(c => {
          const cObj = this.heap[c.ref];
          if (cObj?.type === 't') queue.push({ ref: c.ref, obj: cObj, parentId: nodeId });
        });
      } else {
        ['left', 'right'].forEach(side => {
          const sRef = obj.attributes[side];
          if (sRef?.ref) {
            const sObj = this.heap[sRef.ref];
            if (sObj?.type === 't') queue.push({ ref: sRef.ref, obj: sObj, parentId: nodeId });
          }
        });
      }
    }

    // No stale-pointer suppression: the cursor (e.g. a recursion's `node`) must
    // stay highlighted every step it points at a node, matching the array model
    // (computeIndexArrows). `this.locals` is the innermost frame only, so only
    // the currently-active pointer produces an arrow. `valueAccessVars` relabels
    // a pointer as `value = <n>` when the current line reads `<var>.value`.
    this.nodeArrows = computeNodeArrows(this.nodes, this.locals, this.heap, this.varName, this.valueAccessVars, this.rootRef);
  }

  getNodeValue(nodeObj) {
    if (!nodeObj.attributes) return '?';
    const valAttr = nodeObj.attributes.value || nodeObj.attributes.val;
    const resolved = this.resolveValue(valAttr);
    if (resolved && resolved.type) {
      return resolved.value;
    }

    if (typeof resolved === 'number' || typeof resolved === 'string') {
      return resolved;
    }

    return resolved || '?';
  }

  formatValue(value) {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return `"${value}"`;
  }

  toDSLDeclaration() {
    if (!this.rootRef || this.nodes.size === 0) {
      return `tree ${this.varName} = {\n  nodes: []\n  value: []\n  color: []\n  children: []\n}`;
    }

    // Emit the WHOLE tree up front (all nodes, values, and parent-child edges),
    // mirroring GraphModel. The previous version declared only the root and
    // relied on cross-snapshot updates to add the rest — which never happens
    // when the tree is built in a single step, so only the root rendered.
    const nodeIds = [];
    const values = [];
    const colors = [];
    const arrows = [];
    for (const node of this.nodes.values()) {
      nodeIds.push(node.id);
      values.push(this.formatValue(node.value));
      // Highlight accessed (pointed-at) nodes yellow, and label them with the
      // pointing variable name so the arrow shows on the first render too.
      const accessed = this.nodeArrows && this.nodeArrows.has(node.id);
      colors.push(accessed ? '"yellow"' : 'null');
      arrows.push(accessed ? formatArrowLabel(this.nodeArrows.get(node.id)) : 'null');
      if (accessed) this.coloredNodes.add(node.id);
    }

    const children = this.edges.map((e) => `${e.parent}-${e.child}`);

    return [
      `tree ${this.varName} = {`,
      `  nodes: [${nodeIds.join(', ')}]`,
      `  value: [${values.join(', ')}]`,
      `  color: [${colors.join(', ')}]`,
      `  arrow: [${arrows.join(', ')}]`,
      `  children: [${children.join(', ')}]`,
      `}`,
    ].join('\n');
  }

  toDSLUpdates(previousModel) {
    if (!previousModel || previousModel.type !== 'tree') return [];

    const updates = [];
    
    if (previousModel.coloredNodes && previousModel.coloredNodes.size > 0) {
      previousModel.coloredNodes.forEach(nodeId => {
        updates.push(`${this.varName}.setColor(${nodeId}, null)`);
      });
      previousModel.coloredNodes.clear();
    }

    for (const [nodeId, node] of this.nodes) {
      if (!previousModel.nodes.has(nodeId)) {
        const val = this.formatValue(node.value);
        updates.push(`${this.varName}.addNode(${nodeId}, ${val})`);
        updates.push(`${this.varName}.setColor(${nodeId}, "yellow")`);
        this.coloredNodes.add(nodeId);
      }
    }

    const prevEdgeSet = new Set();
    if (previousModel.edges) {
      previousModel.edges.forEach((edge) => {
        prevEdgeSet.add(`${edge.parent}-${edge.child}`);
      });
    }

    for (const edge of this.edges) {
      const edgeKey = `${edge.parent}-${edge.child}`;
      if (!prevEdgeSet.has(edgeKey)) {
        updates.push(`${this.varName}.addChild(${edge.parent}-${edge.child})`);
      }
    }

    // Node pointers after addNode, so setArrow targets nodes that now exist.
    updates.push(
      ...diffNodeArrows(this.varName, this.nodeArrows, previousModel.nodeArrows, new Set(this.nodes.keys())),
    );

    // Highlight currently accessed (pointed-at) nodes yellow.
    for (const nodeId of this.nodeArrows.keys()) {
      if (!this.coloredNodes.has(nodeId)) {
        updates.push(`${this.varName}.setColor(${nodeId}, "yellow")`);
      }
      this.coloredNodes.add(nodeId);
    }

    return updates;
  }
}


export class GraphModel extends StructureModel {
  constructor(varName, heapObj, heap, locals, previousLocals = null) {
    super(varName, heapObj, heap, locals, previousLocals);
    this.type = 'graph';
    this.edges = [];
    this.coloredNodes = new Set();
    this.normalize();
  }

  normalize() {
    this.nodeArrows = new Map();
    if (!this.heapObj || this.heapObj.type !== 'dict' || !this.heapObj.value) return;

    this.nodes.clear();
    this.edges = [];

    // Parse the outer dictionary keys as the source nodes
    const entries = Object.entries(this.heapObj.value);
    
    entries.forEach(([sourceKeyStr, targetRef]) => {
      const cleanSourceKey = sourceKeyStr.replace(/^['"]|['"]$/g, '');
      const sourceId = `N_${this.sanitizeName(cleanSourceKey)}`;

      if (!this.nodes.has(sourceId)) {
        this.nodes.set(sourceId, {
          id: sourceId,
          value: cleanSourceKey,
        });
      }

      let targetObj = null;
      if (targetRef && targetRef.ref && this.heap[targetRef.ref]) {
        targetObj = this.heap[targetRef.ref];
      } else if (targetRef && ['dict', 'list', 'set'].includes(targetRef.type)) {
        targetObj = targetRef;
      }
      
      if (targetObj) {
        let targetItems = [];
        
        if (targetObj.type === 'dict' && targetObj.value) {
          targetItems = Object.keys(targetObj.value);
        } else if ((targetObj.type === 'list' || targetObj.type === 'set') && Array.isArray(targetObj.value)) {
           targetItems = targetObj.value.map(item => {
               if (item && item.type) return String(item.value);
               if (item && item.ref && this.heap[item.ref]) return String(this.heap[item.ref].value || '');
               return String(item);
           });
        }
        
        targetItems.forEach((targetKeyStr) => {
          const cleanTargetKey = targetKeyStr.replace(/^['"]|['"]$/g, '');
          const targetId = `N_${this.sanitizeName(cleanTargetKey)}`;

          if (!this.nodes.has(targetId)) {
            this.nodes.set(targetId, {
              id: targetId,
              value: cleanTargetKey,
            });
          }

          this.edges.push({ from: sourceId, to: targetId });
        });
      }
    });

    // Remove undirected duplicate edges
    const uniqueEdges = new Set();
    const deduplicatedEdges = [];
    this.edges.forEach(edge => {
      const edgeKey = [edge.from, edge.to].sort().join('-');
      if (!uniqueEdges.has(edgeKey)) {
        uniqueEdges.add(edgeKey);
        deduplicatedEdges.push(edge);
      }
    });
    this.edges = deduplicatedEdges;

    this.nodeArrows = computeValueNodeArrows(this.nodes, this.locals, this.varName, this.previousLocals);
  }

  toDSLDeclaration() {
    const nodes = Array.from(this.nodes.values());

    if (nodes.length === 0) {
      return `graph ${this.varName} = {\n  left: "${this.varName}"\n  nodes: []\n  value: []\n  color: []\n  edges: []\n}`;
    }

    const nodeIds = [];
    const values = [];
    const colors = [];

    nodes.forEach((node) => {
      nodeIds.push(node.id);
      values.push(`"${node.value}"`);
      const accessed = this.nodeArrows.has(node.id);
      colors.push(accessed ? '"yellow"' : 'null');
      if (accessed) this.coloredNodes.add(node.id);
    });

    const edges = this.edges.map((edge) => `${edge.from}-${edge.to}`);

    return [
      `graph ${this.varName} = {`,
      `  left: "${this.varName}"`,
      `  nodes: [${nodeIds.join(', ')}]`,
      `  value: [${values.join(', ')}]`,
      `  color: [${colors.join(', ')}]`,
      `  edges: [${edges.join(', ')}]`,
      `}`,
    ].join('\n');
  }

  toDSLUpdates(previousModel) {
    if (!previousModel || previousModel.type !== 'graph') {
      return [];
    }

    const updates = [];

    // Clear previous step's highlights first.
    if (previousModel.coloredNodes && previousModel.coloredNodes.size > 0) {
      previousModel.coloredNodes.forEach((nodeId) => {
        if (this.nodes.has(nodeId)) {
          updates.push(`${this.varName}.setColor(${nodeId}, null)`);
        }
      });
      previousModel.coloredNodes.clear();
    }

    for (const [nodeId, node] of this.nodes) {
      if (!previousModel.nodes.has(nodeId)) {
        updates.push(`${this.varName}.addNode(${nodeId}, "${node.value}")`);
        updates.push(`${this.varName}.setColor(${nodeId}, "yellow")`);
        this.coloredNodes.add(nodeId);
      }
    }

    const prevEdgeSet = new Set();
    previousModel.edges.forEach((edge) => {
      prevEdgeSet.add(`${edge.from}-${edge.to}`);
    });

    this.edges.forEach((edge) => {
      const edgeKey = `${edge.from}-${edge.to}`;
      if (!prevEdgeSet.has(edgeKey)) {
        updates.push(`${this.varName}.addEdge(${edgeKey})`);
      }
    });

    for (const [nodeId] of previousModel.nodes) {
      if (!this.nodes.has(nodeId)) {
        updates.push(`${this.varName}.removeNode(${nodeId})`);
      }
    }

    previousModel.edges.forEach((edge) => {
      const edgeKey = `${edge.from}-${edge.to}`;
      if (!this.edges.some((e) => `${e.from}-${e.to}` === edgeKey)) {
        updates.push(`${this.varName}.removeEdge(${edgeKey})`);
      }
    });

    updates.push(
      ...diffNodeArrows(this.varName, this.nodeArrows, previousModel.nodeArrows, new Set(this.nodes.keys())),
    );

    // Highlight currently pointed-at nodes yellow (mirrors TreeModel).
    for (const nodeId of this.nodeArrows.keys()) {
      if (!this.coloredNodes.has(nodeId)) {
        updates.push(`${this.varName}.setColor(${nodeId}, "yellow")`);
      }
      this.coloredNodes.add(nodeId);
    }

    return updates;
  }
}
