
class StructureModel {
  constructor(varName, heapObj, heap, locals) {
    this.varName = varName;
    this.heapObj = heapObj;  // Current snapshot's object
    this.heap = heap;
    this.locals = locals;
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

// FrameModel is currently unused 
export class FrameModel extends StructureModel {
  constructor(frameInfo) {
    super(frameInfo.id, null, null, null);
    this.type = 'frame';
    this.id = frameInfo.id; 
    this.displayName = frameInfo.displayName;
    this.depth = frameInfo.depth;
    this.variables = new Map();
  }

  addVariable(varModel) {
    this.variables.set(varModel.varName, varModel);
  }

  toDSLDeclaration() {
    const headerDsl = `text ${this.id}_frame = { value: "--- ${this.displayName} ---" }`;
    const varDeclarations = [];
    for (const varModel of this.variables.values()) {
      varDeclarations.push(varModel.toDSLDeclaration());
    }

    return [headerDsl, ...varDeclarations].join('\n');
  }

  getLayoutCommands() {
    const commands = [];
    let lastVarName = null;

    for (const varName of this.variables.keys()) {
      if (lastVarName) {
        commands.push(`${lastVarName}.below = ${varName}`);
      }
      lastVarName = varName;
    }

    if (lastVarName) {
      commands.push(`${this.id}_frame.right = ${[...this.variables.keys()][0]}`);
    }

    return commands;
  }

  toDSLUpdates(previousFrame) {
    const updates = [];
 
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
      return;
    }

    this.elements = this.heapObj.value.map((item, idx) => ({
      id: `${this.varName}[${idx}]`,
      value: this.resolveValue(item),
      serialized: item,
    }));
  }

  formatValue(serialized) {
    if (serialized && serialized.type) {
      const num = Number(serialized.value);
      return isNaN(num) ? `"${serialized.value}"` : num;
    }
    return '?';
  }

  toDSLDeclaration() {
    const values = this.elements.map((el) => this.formatValue(el.serialized));
    
    const lines = [
      `array ${this.varName} = {`,
      `  value: [${values.join(', ')}]`,
      `}`,
    ];
    
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
      return updates;
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
            for (let i = 0; i < removedOccurrences; i++) {
              updates.push(`${this.varName}.removeValue(${val})`);
            }
          }
        }
      }
      
      return updates;
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
  }

  formatValue(serialized) {
    if (serialized && serialized.type) {
      const num = Number(serialized.value);
      return isNaN(num) ? `"${serialized.value}"` : num;
    }
    return '?';
  }

  toDSLDeclaration() {
    const values = this.elements.map((el) => this.formatValue(el.serialized));
    
    const lines = [
      `stack ${this.varName} = {`,
      `  value: [${values.join(', ')}]`,
      `}`,
    ];
    
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
      return updates;
    }

    if (newLen < oldLen) {
      for (let i = oldLen - 1; i >= newLen; i--) {
        updates.push(`${this.varName}.removeAt(${i})`);
      }
      return updates;
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

    return updates;
  }
}

export class TreeModel extends StructureModel {
  constructor(varName, heapObj, heap, locals) {
    super(varName, heapObj, heap, locals);
    this.type = 'tree';
    this.edges = [];
    this.rootRef = null;
    this.coloredNodes = new Set();
    this.normalize();
  }

  normalize() {
    this.nodes = new Map();
    this.edges = [];
    this.rootRef = null;

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
    if (!this.rootRef) {
      return `tree ${this.varName} = {\n  nodes: []\n  value: []\n  color: []\n  edges: []\n}`;
    }
    
    const rootId = `N${this.rootRef}`;
    const rootNode = this.nodes.get(rootId);
    const val = this.formatValue(rootNode.value);
    return [
      `tree ${this.varName} = {`,
      `  nodes: [${rootId}]`,
      `  value: [${val}]`,
      `  color: [null]`,
      `  children: []`,
      `}`
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

    return updates;
  }
}


export class GraphModel extends StructureModel {
  constructor(varName, heapObj, heap, locals) {
    super(varName, heapObj, heap, locals);
    this.type = 'graph';
    this.edges = [];
    this.coloredNodes = new Set();
    this.normalize();
  }

  normalize() {
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
  }

  toDSLDeclaration() {
    const nodes = Array.from(this.nodes.values());

    if (nodes.length === 0) {
      return `graph ${this.varName} = {\n  nodes: []\n  value: []\n  color: []\n  edges: []\n}`;
    }

    const nodeIds = [];
    const values = [];
    const colors = [];
    
    nodes.forEach((node) => {
      nodeIds.push(node.id);
      const val = typeof node.value === 'string' ? `"${node.value}"` : `"${node.value}"`;
      values.push(val);
      colors.push('null');
    });

    const edges = [];
    this.edges.forEach((edge) => {
      edges.push(`${edge.from}-${edge.to}`);
    });

    const lines = [
      `graph ${this.varName} = {`,
      `  nodes: [${nodeIds.join(', ')}]`,
      `  value: [${values.join(', ')}]`,
      `  color: [${colors.join(', ')}]`,
      `  edges: [${edges.join(', ')}]`,
      `}`,
    ];

    return lines.join('\n');
  }

  toDSLUpdates(previousModel) {
    if (!previousModel || previousModel.type !== 'graph') {
      return [];
    }

    const updates = [];
    
    if (previousModel.coloredNodes && previousModel.coloredNodes.size > 0) {
      previousModel.coloredNodes.forEach(nodeId => {
        updates.push(`${this.varName}.setColor(${nodeId}, null)`);
      });
      previousModel.coloredNodes.clear();
    }

    for (const [nodeId, node] of this.nodes) {
      if (!previousModel.nodes.has(nodeId)) {
        const val = typeof node.value === 'string' ? `"${node.value}"` : `"${node.value}"`;
        updates.push(`${this.varName}.addNode(${nodeId}, ${val})`);
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
      const currentEdgeExists = this.edges.some(
        (e) => `${e.from}-${e.to}` === edgeKey
      );
      if (!currentEdgeExists) {
        updates.push(`${this.varName}.removeEdge(${edgeKey})`);
      }
    });

    return updates;
  }
}
