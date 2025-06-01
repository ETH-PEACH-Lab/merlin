// DSL utilities for handling matrix coordinates and component operations
// This file handles all DSL-specific parsing and coordinate transformation

/**
 * Parses the inspectorIndex to extract component and unit information
 * Supports both 1D (unit_5) and 2D (unit_(0,1)) formats
 */
export function parseInspectorIndex(inspectorIndex, pages, currentPage) {
  if (!inspectorIndex) return null;

  const pageIdx = currentPage - 1; // Convert to zero-based index
  const componentIdx = parseInt(inspectorIndex.componentID.slice(10));
  const component = pages[pageIdx]?.[componentIdx];
  
  if (!component) return null;

  const unitIdPart = inspectorIndex.unitID.slice(5); // Remove "unit_" prefix
  
  let coordinates;
  let displayId;
  
  // Check if matrix coordinate format (row,col)
  const matrixMatch = unitIdPart.match(/^\((\d+),(\d+)\)$/);
  if (matrixMatch) {
    // Matrix format: unit_(0,1)
    const row = parseInt(matrixMatch[1]);
    const col = parseInt(matrixMatch[2]);
    coordinates = { row, col, isMatrix: true };
    displayId = `(${row},${col})`;
  } else {
    // Array format: unit_5
    const index = parseInt(unitIdPart, 10);
    coordinates = { index, isMatrix: false };
    displayId = index.toString();
  }

  return {
    pageIdx,
    componentIdx,
    component,
    coordinates,
    displayId,
    componentName: component.name,
    componentType: component.type
  };
}

/**
 * Gets the current value for a field at specific coordinates
 */
export function getFieldValue(component, fieldKey, coordinates) {
  if (!component.body?.[fieldKey]) return null;
  
  if (coordinates.isMatrix) {
    const { row, col } = coordinates;
    return component.body[fieldKey]?.[row]?.[col] ?? null;
  } else {
    const { index } = coordinates;
    return component.body[fieldKey]?.[index] ?? null;
  }
}

/**
 * Determines which fields are available for a component type
 */
export function getComponentFields(componentType) {
  const fieldDefinitions = {
    array: {
      value: ["Value", "number"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
    },
    matrix: {
      values: ["Values", "number"],
      color: ["Color", "color"],
    },
    stack: {
      value: ["Value", "number"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
    },
    graph: {
      value: ["Value", "number"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
      hidden: ["Hidden", "boolean"],
    },
    tree: {
      value: ["Value", "number"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
    },
    linkedlist: {
      value: ["Value", "number"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
    },
  };

  return fieldDefinitions[componentType] || {};
}

/**
 * Creates unit data object for the GUI editor
 */
export function createUnitData(parsedInfo) {
  if (!parsedInfo) return null;

  const { pageIdx, componentIdx, component, coordinates, displayId, componentName, componentType } = parsedInfo;
  
  const unitData = {
    displayId,
    coordinates,
    component: componentIdx,
    name: componentName,
    page: pageIdx,
    type: componentType,
  };

  // Add fields based on type definition
  const fields = getComponentFields(componentType);
  Object.keys(fields).forEach(fieldKey => {
    unitData[fieldKey] = getFieldValue(component, fieldKey, coordinates) ?? "null";
  });

  return unitData;
}

/**
 * Finds the visible unit index for array components (for backward compatibility)
 */
export function findVisibleUnitIndex(component, unitIdx) {
  // Find i'th visible unit index in the component
  if (!component.body || !component.body.value) return 0;
  
  const hidden = component.body.hidden || [];

  let visibleCount = 0;
  for (let i = 0; i < component.body.value.length; i++) {
    if (!hidden[i]) {
      if (visibleCount === unitIdx) {
        return i;
      }
      visibleCount++;
    }
  }
  return 0;
}

/**
 * Converts field value to appropriate type
 */
export function convertValueToType(value, type) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  
  switch (type) {
    case "number":
      const numValue = Number(value);
      return isNaN(numValue) ? null : numValue;
    case "boolean":
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        const lowerValue = value.toLowerCase().trim();
        return lowerValue === "true" || lowerValue === "1";
      }
      return Boolean(value);
    case "color":
    case "string":
    default:
      return String(value);
  }
}
