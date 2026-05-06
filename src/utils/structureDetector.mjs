/**
 * Detection logic for data structures.
 * Priority order: Stack → Tree → Graph → List
 * Uses metadata (class_name, ds_hint) + variable name heuristics
 */

import {
  ListModel,
  StackModel,
  TreeModel,
  GraphModel,
  TextModel,
} from './structureModels.mjs';

function isRootVariableName(varName) {
  const lower = varName.toLowerCase();
  return (
    lower === 'root' ||
    lower === 'tree' ||
    lower === 'head' ||
    lower === 'start' ||
    lower.startsWith('tree_') ||
    lower.endsWith('_tree') ||
    lower.endsWith('_root')
  );
}

function isTreeNodeInstance(obj, heap) {
  if (!obj || obj.type !== 't' || !obj.attributes) {
    return false;
  }

  const attrs = obj.attributes;
  const hasValue = 'value' in attrs;
  const hasChildren = 'children' in attrs;
  
  const childrenRef = attrs.children;
  let childrenIsArray = false;
  
  if (childrenRef) {
    if (childrenRef.type === 'list' && childrenRef.value && Array.isArray(childrenRef.value)) {
      childrenIsArray = true;
    } else if (childrenRef.ref && heap[childrenRef.ref]) {
      const childrenObj = heap[childrenRef.ref];
      if (childrenObj.type === 'list' || childrenObj.type === 'array') {
        childrenIsArray = true;
      }
    }
  }

  return hasValue && hasChildren && childrenIsArray;
}

function findTreeNodeParent(targetRef, locals, heap) {
  for (const [varName, serializedValue] of Object.entries(locals)) {
    if (!serializedValue || !serializedValue.ref) continue;
    
    const parentRef = serializedValue.ref;
    if (!heap[parentRef]) continue;
    
    const parentObj = heap[parentRef];
    if (!isTreeNodeInstance(parentObj, heap)) continue;
    
    const childrenRef = parentObj.attributes.children;
    if (!childrenRef) continue;
    
    let childrenArray = null;
    if (childrenRef.ref && heap[childrenRef.ref]) {
      childrenArray = heap[childrenRef.ref];
    } else if (childrenRef.type === 'list' && childrenRef.value) {
      childrenArray = childrenRef;
    }
    
    if (childrenArray && childrenArray.value && Array.isArray(childrenArray.value)) {
      for (const childRef of childrenArray.value) {
        if (childRef && childRef.ref === targetRef) {
          return {
            parentVar: varName,
            parentObj,
            parentRef,
          };
        }
      }
    }
  }
  
  return null;
}

function resolveValue(value, heap) {
  if (!value) return null;
  if (value.type) return value.value;
  if (value.ref && heap[value.ref]) return heap[value.ref];
  return null;
}


function isTreeNodeInstanceByStructure(heapObj, heap) {
  if (!heapObj) return false;

  if (heapObj.ref && heap[heapObj.ref]) {
    heapObj = heap[heapObj.ref];
  }

  return isTreeNodeInstance(heapObj, heap);
}

export function detectFromMetadata(heapObj) {
  if (!heapObj || heapObj.type !== 't') {
    return null;
  }

  if (heapObj.ds_hint) {
    return heapObj.ds_hint;
  }

  const className = (heapObj.class_name || '').toLowerCase();

  if (className.includes('stack')) return 'stack';
  if (className.includes('tree') || className.includes('node')) return 'tree';
  if (className.includes('graph') || className.includes('network')) return 'graph';

  return null;
}

export function detectFromVariableName(varName) {
  if (!varName || typeof varName !== 'string') return null;

  const lower = varName.toLowerCase();

  if (['stack', 'st', 's'].includes(lower) || lower.startsWith('stack_') || lower.endsWith('_stack')) {
    return 'stack';
  }
  if (['tree', 'root'].includes(lower) || lower.startsWith('tree_') || lower.endsWith('_tree')) {
    return 'tree';
  }
  if (['graph', 'network'].includes(lower) || lower.startsWith('graph_') || lower.endsWith('_graph')) {
    return 'graph';
  }

  return null;
}

// Detect patterns in custom objects
export function detectFromPattern(heapObj, heap) {
  if (!heapObj || heapObj.type !== 't' || !heapObj.attributes) {
    return null;
  }

  const attrs = heapObj.attributes;
  const attrNames = new Set(Object.keys(attrs));

  // Stack pattern: has items/elements + (top OR size OR length)
  if (
    (attrNames.has('items') || attrNames.has('elements')) &&
    (attrNames.has('top') || attrNames.has('size') || attrNames.has('length'))
  ) {
    return 'stack';
  }

  // Tree pattern: has left AND right children
  if (attrNames.has('left') && attrNames.has('right')) {
    return 'tree';
  }

  // Tree pattern: has children array
  if (attrNames.has('children') && Array.isArray(resolveValue(attrs.children, heap))) {
    return 'tree';
  }

  return null;
}

// Detect Graph instances as nested dictionaries
function isGraphInstanceByDict(heapObj, heap, varName) {
  if (!heapObj || heapObj.type !== 'dict' || !heapObj.value) return false;

  const nameHint = detectFromVariableName(varName);
  if (nameHint !== 'graph') return false;

  const entries = Object.values(heapObj.value);
  if (entries.length === 0) return true;

  const firstVal = entries[0];
  
  if (firstVal && firstVal.ref && heap[firstVal.ref]) {
    const valObj = heap[firstVal.ref];
    if (valObj.type === 'dict' || valObj.type === 'set' || valObj.type === 'list') {
      return true;
    }
  } else if (firstVal && (firstVal.type === 'dict' || firstVal.type === 'set' || firstVal.type === 'list')) {
    return true;
  }

  return false;
}

// Main detection function using priority order
export function detectStructureType(varName, serializedValue, heap, locals) {
  let heapObj = null;
  let ref = null;

  // Resolve to heap object and capture ref number
  if (serializedValue && serializedValue.ref && heap[serializedValue.ref]) {
    ref = serializedValue.ref;
    heapObj = heap[serializedValue.ref];
  }

  if (!heapObj && serializedValue && (serializedValue.type === 'list' || serializedValue.type === 'array')) {
    const nameHint = detectFromVariableName(varName);
    if (nameHint) {
      return {
        type: nameHint,
        heapObj: serializedValue,
        reason: 'inline_list_' + nameHint,
      };
    }
    return {
      type: 'list',
      heapObj: serializedValue,
      ref: null,
      reason: 'inline_list_default',
    };
  }

  if (heapObj && heapObj.type === 'dict' && isGraphInstanceByDict(heapObj, heap, varName)) {
    return {
      type: 'graph',
      heapObj,
      ref,
      reason: 'dict_graph_structure'
    };
  }

  if (heapObj && heapObj.type === 't' && isTreeNodeInstanceByStructure(heapObj, heap)) {
    if (isRootVariableName(varName)) {
      return {
        type: 'tree',
        heapObj,
        ref,
        reason: 'treenode_structure',
      };
    }
    return { type: 'text', heapObj, reason: 'treenode_not_root' };
  }

  if (heapObj && heapObj.type === 't') {
    const metadata = detectFromMetadata(heapObj);
    if (metadata) {
      if (metadata === 'tree' && !isRootVariableName(varName)) {
        return { type: 'text', heapObj, reason: 'tree_metadata_filtered' };
      }
      return {
        type: metadata,
        heapObj,
        ref,
        reason: 'metadata_hint',
      };
    }

    const pattern = detectFromPattern(heapObj, heap);
    if (pattern) {
      if (pattern === 'tree' && !isRootVariableName(varName)) {
        return { type: 'text', heapObj, reason: 'node_not_root' };
      }
      return {
        type: pattern,
        heapObj,
        ref,
        reason: 'semantic_pattern',
      };
    }

    return {
      type: 'text',
      heapObj,
      reason: 'custom_object_unknown',
    };
  }

  if (heapObj && (heapObj.type === 'list' || heapObj.type === 'array')) {
    const nameHint = detectFromVariableName(varName);
    if (nameHint) {
      return {
        type: nameHint,
        heapObj,
        ref,
        reason: 'variable_name_' + nameHint,
      };
    }

    return {
      type: 'list',
      heapObj,
      ref,
      reason: 'default_list',
    };
  }

  // Shouldn't reach here, but default to list if heapObj exists
  if (heapObj) {
    return {
      type: 'list',
      heapObj,
      ref,
      reason: 'default_fallback',
    };
  }

  return {
    type: 'text',
    heapObj: null,
    ref: null,
    reason: 'no_heap_object',
  };
}

export function createModel(varName, detection, heap, locals) {
  if (detection.type === 'text') {
    // Get the serialized value from locals
    const serializedValue = locals[varName];
    const textModel = new TextModel(varName, serializedValue, heap, locals);
    return textModel;
  }

  if (!detection.heapObj) {
    return null;
  }

  // For tree models with ref, reconstruct the ref pointer instead of passing resolved object
  let heapObjToPass = detection.heapObj;
  if (detection.type === 'tree' && detection.ref) {
    heapObjToPass = { ref: detection.ref };
  }

  switch (detection.type) {
    case 'stack':
      return new StackModel(varName, detection.heapObj, heap, locals);

    case 'tree':
      return new TreeModel(varName, heapObjToPass, heap, locals);

    case 'graph':
      return new GraphModel(varName, detection.heapObj, heap, locals);

    case 'list':
      return new ListModel(varName, detection.heapObj, heap, locals);

    default:
      return null;
  }
}

/**
 * Batch detect all variables in locals
 * @param {Object} locals - Current snapshot locals
 * @param {Object} heap - Current snapshot heap
 * @returns {Map<string, Object>} varName → detection result
 */
export function detectAllVariables(locals, heap) {
  const results = new Map();

  Object.entries(locals).forEach(([varName, serializedValue]) => {
    const detection = detectStructureType(varName, serializedValue, heap, locals);
    results.set(varName, detection);
  });

  return results;
}
