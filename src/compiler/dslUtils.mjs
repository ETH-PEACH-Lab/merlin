// DSL utilities for handling matrix coordinates and component operations
// This file handles all DSL-specific parsing and coordinate transformation

import { formatPosition } from '../parser/reconstructor.mjs';

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
  } else if (unitIdPart === "component") {
    // Component-level selection (for text components without array indices)
    coordinates = null;
    displayId = "component";
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
  
  // For text components, handle differently based on whether coordinates are provided
  if (component.type === "text") {
    // If coordinates are provided and the field is an array
    if (coordinates && !coordinates.isMatrix && coordinates.index !== undefined) {
      const value = component.body[fieldKey];
      if (Array.isArray(value)) {
        return value[coordinates.index] ?? null;
      } else {
        // Single value but index requested - return the value for index 0, null for others
        return coordinates.index === 0 ? value : null;
      }
    } else {
      // No coordinates or non-array field - return the value directly
      return component.body[fieldKey];
    }
  }
  
  // Original logic for other component types
  if (coordinates.isMatrix) {
    const { row, col } = coordinates;
    return component.body[fieldKey]?.[row]?.[col] ?? null;
  } else {
    const { index } = coordinates;
    return component.body[fieldKey]?.[index] ?? null;
  }
}

/**
 * Dropdown options for specific field types
 */
export function getFieldDropdownOptions(fieldKey) {
  const dropdownOptions = {
    fontWeight: [
      { value: '', label: 'Default (normal)' },
      { value: 'normal', label: 'Normal' },
      { value: 'bold', label: 'Bold' },
      { value: 'bolder', label: 'Bolder' },
      { value: 'lighter', label: 'Lighter' },
      { value: '100', label: '100' },
      { value: '200', label: '200' },
      { value: '300', label: '300' },
      { value: '400', label: '400' },
      { value: '500', label: '500' },
      { value: '600', label: '600' },
      { value: '700', label: '700' },
      { value: '800', label: '800' },
      { value: '900', label: '900' },
    ],
    fontFamily: [
      { value: '', label: 'Default (sans-serif)' },
      { value: 'sans-serif', label: 'Sans-serif' },
      { value: 'serif', label: 'Serif' },
      { value: 'monospace', label: 'Monospace' },
      { value: 'Arial', label: 'Arial' },
      { value: 'Helvetica', label: 'Helvetica' },
      { value: 'Times New Roman', label: 'Times New Roman' },
      { value: 'Times', label: 'Times' },
      { value: 'Courier New', label: 'Courier New' },
      { value: 'Courier', label: 'Courier' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Verdana', label: 'Verdana' },
    ],
    align: [
      { value: '', label: 'Default (left)' },
      { value: 'left', label: 'Left' },
      { value: 'center', label: 'Center' },
      { value: 'right', label: 'Right' },
    ],
  };

  return dropdownOptions[fieldKey] || [];
}

/**
 * Determines which additional fields should be shown in the toolbar
 */
export function getAdditionalGUIFields(componentType) {
  const fieldDefinitions = {
    array: {
      add: ["Add", "add"],
      remove: ["Remove", "remove"],
    },
    matrix: {},
    stack: {
      add: ["Add", "add"],
      remove: ["Remove", "remove"],
    },
    graph: {},
    tree: {},
    linkedlist: {
      remove: ["Remove", "remove"],
    },
  };
  return fieldDefinitions[componentType] || {};
}
/**
 * Determines which fields are available for a component type
 */
export function getComponentFields(componentType) {
  const fieldDefinitions = {
    array: {
      value: ["Value", "number_or_string"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
      position: ["Position", "position"],
    },
    matrix: {
      value: ["Value", "number_or_string"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
      position: ["Position", "position"],
    },
    stack: {
      value: ["Value", "number_or_string"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
      position: ["Position", "position"],
    },
    graph: {
      value: ["Value", "number_or_string"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
      hidden: ["Hidden", "boolean"],
      position: ["Position", "position"],
    },
    tree: {
      value: ["Value", "number_or_string"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
      position: ["Position", "position"],
    },
    linkedlist: {
      value: ["Value", "number_or_string"],
      color: ["Color", "color"],
      arrow: ["Arrow Label", "string"],
      position: ["Position", "position"],
    },
    text: {
      value: ["Value", "string"],
      fontSize: ["Font Size", "number"],
      color: ["Color", "color"],
      fontWeight: ["Font Weight", "string"],
      fontFamily: ["Font Family", "string"],
      align: ["Alignment", "string"],
      lineSpacing: ["Line Spacing", "number"],
      width: ["Width", "number"],
      height: ["Height", "number"],
      position: ["Position", "position"],
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
    let value = null;
    
    // Skip position field for auto-generated placement text components
    // These are text components with names ending in _above, _below, _left, _right
    // These components are auto-positioned relative to their parent and shouldn't be manually positioned
    if (fieldKey === "position" && componentType === "text") {
      const placementSuffixes = ['_above', '_below', '_left', '_right'];
      const isPlacementText = placementSuffixes.some(suffix => componentName.endsWith(suffix));
      if (isPlacementText) {
        return; // Skip this field entirely - these components are auto-positioned
      }
    }
    
    // For text components, handle field values specially
    if (componentType === "text") {
      // Global properties should always show their actual value regardless of line selection
      if (["lineSpacing", "width", "height"].includes(fieldKey)) {
        value = component.body[fieldKey];
      } else if (fieldKey === "position") {
        // Position is stored at component level, not in body
        // Format position object to readable string
        value = component.position ? formatPosition(component.position) : null;
      } else if (coordinates && coordinates.index !== undefined) {
        // Get value for specific index (multi-line text editing)
        value = getFieldValue(component, fieldKey, coordinates);
      } else {
        // Get the whole value (single value or entire array)
        value = component.body[fieldKey];
      }
    } else {
      // Use coordinates for other component types
      if (fieldKey === "position") {
        // Position is stored at component level for all component types
        // Format position object to readable string
        value = component.position ? formatPosition(component.position) : null;
      } else {
        value = getFieldValue(component, fieldKey, coordinates);
      }
    }
    
    unitData[fieldKey] = value ?? "null";
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
      const num = Number(value);
      return isNaN(num) ? null : num;
    case "number_or_string":
      // Try to convert to number first, but keep as string if not a valid number
      const numValue = Number(value);
      return isNaN(numValue) ? String(value) : numValue;
    case "boolean":
      if (typeof value === "boolean") return value;
      if (typeof value === "string") {
        const lowerValue = value.toLowerCase().trim();
        return lowerValue === "true" || lowerValue === "1";
      }
      return Boolean(value);
    case "position":
      // Position can be a string representation like "(1,2)" or "center" or "1..3,2"
      return String(value);
    case "color":
    case "string":
    default:
      return String(value);
  }
}
