// myCompiler to convert myDSL into mermaid code

import { expandPositionWithLayout, inferLayoutFromKeywords } from './positionUtils.mjs';

import { generateArray } from "./types/generateArray.mjs"
import { generateLinkedlist } from "./types/generateLinkedlist.mjs";
import { generateStack } from "./types/generateStack.mjs";
import { generateTree } from "./types/generateTree.mjs";
import { generateMatrix } from "./types/generateMatrix.mjs";
import { generateGraph } from "./types/generateGraph.mjs";
import { generateText } from "./types/generateText.mjs";
import { getMermaidContainerSize } from "./cssUtils.mjs";

// Helper function to maintain consistency across array properties when modifying arrays
function maintainArrayPropertyConsistency(body, modifiedProperty, index, operation) {
    // Define the properties that should be kept in sync for different component types
    let arrayProperties = ["arrow", "color", "value", "hidden"];
    
    // First, find the target length based on the modified property
    const targetLength = body[modifiedProperty] ? body[modifiedProperty].length : 0;
    
    arrayProperties.forEach(property => {
        if (property !== modifiedProperty && body[property]) {
            const currentLength = body[property].length;
            
            switch (operation) {
                case "insert":
                    // Ensure the array is long enough before inserting
                    while (body[property].length < index) {
                        body[property].push(null);
                    }
                    // Insert null at the same index to maintain alignment
                    body[property].splice(index, 0, null);
                    break;
                case "add":
                    // Ensure the array has the same length as the target (minus 1 since we just added)
                    while (body[property].length < targetLength - 1) {
                        body[property].push(null);
                    }
                    // Add null to maintain alignment
                    body[property].push(null);
                    break;
                case "remove":
                    // Remove element at the same index to maintain alignment
                    if (index < body[property].length) {
                        body[property].splice(index, 1);
                    }
                    break;
            }
        } else if (property !== modifiedProperty && !body[property]) {
            // If the property doesn't exist, create it with the appropriate length
            switch (operation) {
                case "insert":
                case "add":
                    body[property] = Array(targetLength).fill(null);
                    break;
                // For remove, we don't need to create new arrays
            }
        }
    });
}

// Helper function to expand ranged positions into shape dimensions
function expandRangedPosition(position) {
    if (!position || !Array.isArray(position)) {
        return position; // Return as-is if not a position array
    }
    
    const [xPos, yPos] = position;
    
    // Helper function to get range dimensions
    function getRangeDimensions(pos) {
        if (pos && typeof pos === 'object' && pos.type === 'range') {
            return {
                start: pos.start,
                end: pos.end,
                size: pos.end - pos.start + 1
            };
        }
        return {
            start: pos,
            end: pos,
            size: 1
        };
    }
    
    const xDim = getRangeDimensions(xPos);
    const yDim = getRangeDimensions(yPos);
    
    // Return the shape information
    return {
        x: xDim.start,
        y: yDim.start,
        width: xDim.size,
        height: yDim.size,
        originalPosition: position
    };
}

// Helper function to properly quote node names when necessary
function formatNodeName(nodeName) {
    // If nodeName is null, undefined, or empty, return as is
    if (nodeName == null || nodeName === "") {
        return nodeName;
    }
    
    // Convert to string for processing
    const nodeStr = String(nodeName);
    
    // If it's a number (including negative numbers and decimals), don't quote
    if (/^-?\d+(\.\d+)?$/.test(nodeStr)) {
        return nodeStr;
    }
    
    // If it contains spaces, special characters, or starts with a quote, wrap in quotes
    if (/[\s"'`]/.test(nodeStr) || nodeStr !== nodeStr.trim()) {
        return `"${nodeStr.replace(/"/g, '\\"')}"`;
    }
    
    // For simple alphanumeric strings without spaces, return as is
    return nodeStr;
}

// Helper function to handle null values vs "null" strings
function formatNullValue(value) {
    if (value === null || value === undefined) {
        return "null";
    }
    if (value === "null") {
        return "\\\\null";
    }
    return value;
}

export { formatNodeName, formatNullValue };

export default function convertParsedDSLtoMermaid(parsedDSLOriginal) {
    // Deep copy to avoid mutating the original parsed DSL
    const parsedDSL = parsedDSLOriginal ? JSON.parse(JSON.stringify(parsedDSLOriginal)) : {};
    
    // Pre-checks to ensure the parsed DSL is valid
    preCheck(parsedDSL);

    const definitions = parsedDSL.defs; 
    const commands = parsedDSL.cmds;

    // Helper function to find a component definition by its name
    function findComponentDefinitionByName(defs, name) {
        return defs.find(def => def.name === name);
    }

    function causeCompileError(message, command) {
        const err = new Error(message);
        Object.assign(err, { line: command.line, col: command.col });
        throw err;
    }

    const pages = [];

    // Smart layout inference: collect position keywords to infer minimum layouts
    function inferSmartLayouts() {
        let currentPageIndex = -1;
        const pageKeywords = []; // Array of arrays - one per page
        
        // First pass: collect all position keywords per page
        commands.forEach((command) => {
            if (command.type === "page") {
                currentPageIndex++;
                pageKeywords[currentPageIndex] = [];
            } else if (command.type === "show" && command.position && command.position.type === 'keyword') {
                if (currentPageIndex >= 0) {
                    pageKeywords[currentPageIndex].push(command.position);
                }
            }
        });
        
        return pageKeywords.map(keywords => inferLayoutFromKeywords(keywords));
    }
    
    const inferredLayouts = inferSmartLayouts();
    let currentInferredLayoutIndex = -1;

    // Helper function to check if a position/slot is already occupied
    function checkSlotOccupancy(currentPage, layout, position, excludeComponentName = null) {
        if (!position || !currentPage._layout) return;
        
        const occupiedSlots = new Set();
        
        // Track occupied positions for all existing components on the page
        currentPage.forEach(component => {
            // Skip the component that's being updated
            if (excludeComponentName && component.name === excludeComponentName) {
                return;
            }
            
            if (component.position && component.position.x !== undefined && component.position.y !== undefined) {
                // Handle ranged positions
                for (let x = component.position.x; x < component.position.x + (component.position.width || 1); x++) {
                    for (let y = component.position.y; y < component.position.y + (component.position.height || 1); y++) {
                        occupiedSlots.add(`${x},${y}`);
                    }
                }
            }
        });
        
        // Check if the new position conflicts
        if (position.x !== undefined && position.y !== undefined) {
            for (let x = position.x; x < position.x + (position.width || 1); x++) {
                for (let y = position.y; y < position.y + (position.height || 1); y++) {
                    const slotKey = `${x},${y}`;
                    if (occupiedSlots.has(slotKey)) {
                        return `Slot already occupied\n\nPosition: (${x},${y})`;
                    }
                }
            }
        }
        
        return null; // No conflict
    }

    commands.forEach((command) => {
        switch (command.type) {
            case "page":
                currentInferredLayoutIndex++;
                
                // Keep previous page if exists
                if (pages.length > 0) {
                    const lastPage = JSON.parse(JSON.stringify(pages[pages.length - 1]));
                    pages.push(lastPage);
                } else {
                    pages.push([]);
                }
                
                // Store layout information on the page
                const currentPage = pages[pages.length - 1];
                if (command.layout) {
                    // Explicit layout provided
                    currentPage._layout = command.layout; // [cols, rows]
                } else if (inferredLayouts[currentInferredLayoutIndex]) {
                    // Use inferred layout based on position keywords
                    currentPage._layout = inferredLayouts[currentInferredLayoutIndex];
                }
                break;
            case "show":
                const componentNameToShow = command.value;
                const componentData = findComponentDefinitionByName(definitions, componentNameToShow);

                if (componentData) {
                    // Get current page layout for keyword translation
                    const currentPage = pages[pages.length - 1];
                    const currentLayout = currentPage._layout || [2, 2]; // Default to 2x2
                    
                    // Check if component is already present on current page
                    const existingComponentIndex = currentPage.findIndex(comp => comp.name === componentNameToShow);
                    
                    // First expand keywords with layout context, then expand ranged positions
                    let expandedPosition = null;
                    if (command.position) {
                        const keywordExpanded = expandPositionWithLayout(command.position, currentLayout);
                        expandedPosition = keywordExpanded.type === 'keyword' ? 
                            keywordExpanded : expandRangedPosition(keywordExpanded);
                        
                        // Check for slot occupancy only if it's a new component or position is changing
                        let shouldCheckOccupancy = true;
                        if (existingComponentIndex !== -1) {
                            const existingComponent = currentPage[existingComponentIndex];
                            // If position is the same, no need to check occupancy
                            if (JSON.stringify(existingComponent.position) === JSON.stringify(expandedPosition)) {
                                shouldCheckOccupancy = false;
                            }
                        }
                        
                        if (shouldCheckOccupancy) {
                            const excludeComponent = existingComponentIndex !== -1 ? componentNameToShow : null;
                            const occupancyError = checkSlotOccupancy(currentPage, currentLayout, expandedPosition, excludeComponent);
                            if (occupancyError) {
                                causeCompileError(occupancyError, command);
                            }
                        }
                    }
                    
                    if (existingComponentIndex !== -1) {
                        // Component already exists on page - only update position
                        if (expandedPosition) {
                            currentPage[existingComponentIndex].position = expandedPosition;
                        } else {
                            // Remove position if no position specified
                            delete currentPage[existingComponentIndex].position;
                        }
                    } else {
                        // Component doesn't exist - add new component
                        const component = {
                            type: componentData.type,
                            name: componentData.name,
                            body: componentData.body,
                        };
                        
                        // Add position information if provided
                        if (expandedPosition) {
                            component.position = expandedPosition;
                        }
                        
                        pages[pages.length - 1].push(component);
                    }
                    
                    // Handle placement text components (above, below, left, right)
                    const placementDirections = ['above', 'below', 'left', 'right'];
                    placementDirections.forEach(direction => {
                        if (componentData.body[direction]) {
                            const placementValue = componentData.body[direction];
                            let textComponent;
                            
                            // First, try to find a referenced component by name
                            const referencedComponent = findComponentDefinitionByName(definitions, placementValue);
                            if (referencedComponent && referencedComponent.type === 'text') {
                                // It's a reference to another text object
                                textComponent = {
                                    type: 'text',
                                    name: referencedComponent.name,
                                    body: referencedComponent.body,
                                    position: 'previous',
                                    placement: direction
                                };
                            } else {
                                // It's a direct string (no matching component found)
                                textComponent = {
                                    type: 'text',
                                    name: `${componentData.name}_${direction}`, // Generate a unique name
                                    body: { value: placementValue },
                                    position: 'previous',
                                    placement: direction
                                };
                            }
                            
                            if (textComponent) {
                                pages[pages.length - 1].push(textComponent);
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component not found\n\nName: ${componentNameToShow}`, command);
                }
                break;
            case "hide":
                const componentNameToHide = command.value;
                const componentToHide = pages[pages.length - 1].find(comp => comp.name === componentNameToHide);

                if (componentToHide) {
                    const index = pages[pages.length - 1].indexOf(componentToHide);
                    if (index > -1) {
                        pages[pages.length - 1].splice(index, 1);
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${componentNameToHide}`, command);
                }
                break;
            case "set": {
                const name = command.name;
                const property = command.target;
                const index = command.args.index;
                const newValue = command.args.value;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);
                const isValidIndex = Number.isInteger(index) && index >= 0;

                // Check if in bounds
                if (targetObject) {
                    const body = targetObject.body;
                    
                    // Special handling for text components
                    if (targetObject.type === "text") {
                        if (property === "value") {
                            // For text components, check if we're setting an array element or the whole value
                            if (isValidIndex) {
                                // Setting a specific line in a multi-line text
                                if (!Array.isArray(body[property])) {
                                    // Convert single string to array if needed
                                    body[property] = [body[property] || ""];
                                }
                                // Ensure array is long enough
                                while (body[property].length <= index) {
                                    body[property].push("");
                                }
                                body[property][index] = newValue;
                            } else {
                                // Setting the entire value (could be string or array)
                                body[property] = newValue;
                            }
                        } else {
                            // For other text properties (fontSize, color, etc.)
                            if (isValidIndex) {
                                // Setting array-based property
                                if (!Array.isArray(body[property])) {
                                    // Convert single value to array, preserving existing value
                                    const existingValue = body[property];
                                    body[property] = [];
                                    if (existingValue !== undefined && existingValue !== null) {
                                        body[property][0] = existingValue;
                                    }
                                }
                                // Ensure array is long enough
                                while (body[property].length <= index) {
                                    body[property].push(null);
                                }
                                body[property][index] = newValue;
                            } else {
                                // Setting single value property
                                body[property] = newValue;
                            }
                        }
                    } else {
                        // Original array-based handling for other components
                        const currentArray = body[property]
                        
                        // If property does not exist, create array of null of length property "value"
                        if (!currentArray) {
                            body[property] = Array(newValue.length).fill(null);
                            body[property][index] = newValue;
                        } else if (isValidIndex) {
                            currentArray[index] = newValue;
                        } else {
                            causeCompileError(`Index out of bounds\n\nIndex: ${index}\nProperty: ${property}\nComponent: ${name}`, command);
                        }
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }
                break;
            }
            case "set_multiple": {
                // command.args is an array e.g. [1,2,3,"_",2]
                // [1,2,3,"_",2] should set any array to [1,2,3,<prev_val_at_i=3>,2]
                // ["_","_","_",2] should keep the first 3 elements replace the 4th with 2 and cut off the rest (if exists)
                // ["_","_","_",2,"_"] should keep the whole array also all "overflowing elements" but replace the 4th value with 2
                const name = command.name;
                const property = command.target;
                const args = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);
                // Check if in bounds

                if (targetObject) {
                    const body = targetObject.body;
                    
                    // Special handling for text components
                    if (targetObject.type === "text") {
                        // If property does not exist, create array of null of length args
                        if (!body[property]) {
                            body[property] = Array(args.length).fill(null);
                        }
                        // Iterate over args and set the values
                        for (let i = 0; i < args.length; i++) {
                            const value = args[i];
                            const isValidIndex = Number.isInteger(i) && i >= 0;
                            if (value !== "_") {
                                if (isValidIndex) {
                                    // Ensure array is long enough
                                    while (body[property].length <= i) {
                                        body[property].push(null);
                                    }
                                    body[property][i] = value;
                                } else {
                                    causeCompileError(`Index out of bounds\n\nIndex: ${i}\nProperty: ${property}\nComponent: ${name}`, command);
                                }
                            }
                        }
                    } else {
                        // Original handling for other components
                        const currentArray = body[property];
                        // If property does not exist, create array of null of length args
                        if (!currentArray) {
                            body[property] = Array(args.length).fill(null);
                        }
                        // Iterate over args and set the values
                        for (let i = 0; i < args.length; i++) {
                            const value = args[i];
                            const isValidIndex = Number.isInteger(i) && i >= 0;
                            if (value !== "_") {
                                if (isValidIndex) {
                                    body[property][i] = value;
                                } else {
                                    causeCompileError(`Index out of bounds\n\nIndex: ${i}\nProperty: ${property}\nComponent: ${name}`, command);
                                }
                            }
                        }
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }
                break;
            }
            case "set_matrix": {
                const name = command.name;
                const property = command.target;
                const row = command.args.row;
                const col = command.args.col;
                const newValue = command.args.value;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const currentMatrix = body[property];
                    
                    // If property does not exist, create 2D array
                    if (!currentMatrix) {
                        body[property] = [];
                    }
                    
                    // Ensure the matrix has enough rows
                    while (body[property].length <= row) {
                        body[property].push([]);
                    }
                    
                    // Ensure the row has enough columns
                    while (body[property][row].length <= col) {
                        body[property][row].push(null);
                    }
                    
                    // Set the value
                    body[property][row][col] = newValue;
                    
                    // Ensure all rows have the same number of columns
                    const maxColumns = Math.max(...body[property].map(row => row.length));
                    for (let r = 0; r < body[property].length; r++) {
                        while (body[property][r].length < maxColumns) {
                            body[property][r].push(null);
                        }
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }
                break;
            }
            case "set_matrix_multiple": {
                const name = command.name;
                const property = command.target;
                const newMatrix = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const currentMatrix = body[property];
                    
                    // If property does not exist, create 2D array
                    if (!currentMatrix) {
                        body[property] = [];
                    }
                    
                    // Calculate dimensions needed
                    const numRows = newMatrix.length;
                    const numCols = Math.max(...newMatrix.map(row => row ? row.length : 0));
                    
                    // Ensure the matrix has enough rows
                    while (body[property].length < numRows) {
                        body[property].push([]);
                    }
                    
                    // Iterate over the matrix and set values, preserving "_" placeholders
                    for (let row = 0; row < newMatrix.length; row++) {
                        // Ensure the row has enough columns
                        while (body[property][row].length < numCols) {
                            body[property][row].push(null);
                        }
                        
                        if (newMatrix[row]) {
                            for (let col = 0; col < newMatrix[row].length; col++) {
                                const value = newMatrix[row][col];
                                if (value !== "_") {
                                    body[property][row][col] = value;
                                }
                            }
                        }
                    }
                    
                    // Ensure all rows have the same number of columns
                    const maxColumns = Math.max(...body[property].map(row => row.length));
                    for (let r = 0; r < body[property].length; r++) {
                        while (body[property][r].length < maxColumns) {
                            body[property][r].push(null);
                        }
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }
                break;
            }
            case "add": {
                const name = command.name;
                const target = command.target;
                const args = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (!body[target]) {
                        body[target] = [];
                    }
                    const insertIndex = body[target].length;
                    
                    // Handle different argument structures
                    if (target === "nodes" && args && typeof args === 'object' && args.index !== undefined) {
                        // New format: addNode(nodeName, nodeValue)
                        const nodeName = args.index; // For nodes, 'index' contains the node name
                        const nodeValue = args.value;
                        
                        body[target].push(nodeName);
                        
                        // If a value is provided, add it to the value array
                        if (nodeValue !== undefined) {
                            if (!body.value) {
                                body.value = [];
                            }
                            // Ensure value array is same length as nodes array
                            while (body.value.length < body[target].length - 1) {
                                body.value.push(null);
                            }
                            body.value.push(nodeValue);
                        }
                    } else {
                        // Original format: just add the value directly
                        body[target].push(args);
                    }
                    
                    // Maintain consistency across all array properties for all component types
                    maintainArrayPropertyConsistency(body, target, insertIndex, "add");
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }

                break;
            }
            case "insert": {
                const name = command.name;
                const target = command.target;
                const index = command.args.index;
                const value = command.args.value;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (!body[target]) {
                        body[target] = [];
                    }
                    const isValidIndex = Number.isInteger(index) && index >= 0 && index <= body[target].length;
                    if (isValidIndex) {
                        body[target].splice(index, 0, value);
                        
                        // Maintain consistency across all array properties for all component types
                        maintainArrayPropertyConsistency(body, target, index, "insert");
                    } else {
                        causeCompileError(`Insert index out of bounds\n\nIndex: ${index}\nProperty: ${target}\nComponent: ${name}`, command);
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }
                break;
            }
            case "remove": {
                const name = command.name;
                const target = command.target;
                const value = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (body[target]) {
                        let removedIndex = -1;
                        
                        // Special handling for graph edges which are objects with start and end properties
                        if (target === "edges" && targetObject.type === "graph" && typeof value === 'object' && value.start && value.end) {
                            // Find the edge with matching start and end nodes
                            const edgeIndex = body[target].findIndex(edge => 
                                edge.start === value.start && edge.end === value.end
                            );
                            
                            if (edgeIndex > -1) {
                                body[target].splice(edgeIndex, 1);
                                removedIndex = edgeIndex;
                            } else {
                                causeCompileError(`Edge not found\n\nFrom: ${value.start}\nTo: ${value.end}\nProperty: ${target}\nComponent: ${name}`, command);
                            }
                        } else {
                            const index = body[target].indexOf(value);
                            if (index > -1) {
                                body[target].splice(index, 1);
                                removedIndex = index;
                            } else {
                                causeCompileError(`Value not found\n\nValue: ${value}\nProperty: ${target}\nComponent: ${name}`, command);
                            }
                        }
                        
                        // Maintain consistency across all array properties for all component types
                        if (removedIndex > -1) {
                            maintainArrayPropertyConsistency(body, target, removedIndex, "remove");
                        }
                    } else {
                        causeCompileError(`Property not found\n\nProperty: ${target}\nComponent: ${name}`, command);
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }
                break;
            }
            case "remove_at": {
                const name = command.name;
                const index = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const arrayProperties = ["arrow", "color", "value", "nodes"];
                    
                    // Check if the index is valid for at least one property
                    let hasValidIndex = false;
                    arrayProperties.forEach(property => {
                        if (body[property] && Array.isArray(body[property]) && 
                            index >= 0 && index < body[property].length) {
                            hasValidIndex = true;
                        }
                    });
                    
                    if (!hasValidIndex) {
                        causeCompileError(`Index out of bounds\n\nIndex: ${index}\nComponent: ${name}`, command);
                    }
                    
                    // Remove element at the specified index from all array properties
                    arrayProperties.forEach(property => {
                        if (body[property] && Array.isArray(body[property]) && 
                            index >= 0 && index < body[property].length) {
                            body[property].splice(index, 1);
                        }
                    });
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}\nPage: ${pages.length - 1}`, command);
                }
                break;
            }
            case "add_matrix_row": {
                const name = command.name;
                const args = command.args; // Can be null, number, or array
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    // First, determine the current matrix dimensions
                    let numCols = 0;
                    let numRows = 0;
                    matrixProperties.forEach(property => {
                        if (body[property] && body[property].length > 0) {
                            numRows = Math.max(numRows, body[property].length);
                            numCols = Math.max(numCols, ...body[property].map(row => row.length));
                        }
                    });
                    
                    matrixProperties.forEach(property => {
                        // Create the property if it doesn't exist
                        if (!body[property]) {
                            body[property] = [];
                        }
                        
                        const currentMatrix = body[property];
                        
                        // Ensure the matrix has the right dimensions before adding
                        while (currentMatrix.length < numRows) {
                            currentMatrix.push(Array(numCols).fill(null));
                        }
                        currentMatrix.forEach(row => {
                            while (row.length < numCols) {
                                row.push(null);
                            }
                        });
                        
                        let newRow;
                        let insertIndex;
                        
                        if (Array.isArray(args)) {
                            // If args is an array, use it as the new row values and add at the end
                            if (property === "value") {
                                newRow = [...args];
                            } else if (property === "color" || property === "arrow") {
                                // For color and arrow, use null for all values
                                newRow = Array(args.length).fill(null);
                            }
                            // Pad with null if the array is shorter than existing columns
                            while (newRow.length < numCols) {
                                newRow.push(null);
                            }
                            insertIndex = currentMatrix.length; // Add at the end
                        } else if (typeof args === 'number') {
                            // If args is a number, use it as the index position and fill with null
                            newRow = Array(numCols).fill(null);
                            insertIndex = Math.max(0, Math.min(args, currentMatrix.length)); // Clamp to valid range
                        } else {
                            // If args is null or undefined, add at the end filled with null
                            newRow = Array(numCols).fill(null);
                            insertIndex = currentMatrix.length; // Add at the end
                        }
                        
                        // Insert the row at the specified index
                        currentMatrix.splice(insertIndex, 0, newRow);
                        
                        // Ensure all existing rows have the same number of columns as the new row
                        const maxCols = Math.max(numCols, newRow.length);
                        currentMatrix.forEach(row => {
                            while (row.length < maxCols) {
                                row.push(null);
                            }
                        });
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "add_matrix_column": {
                const name = command.name;
                const args = command.args; // Can be null, number, or array
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    // First, determine the current matrix dimensions
                    let numCols = 0;
                    let numRows = 0;
                    matrixProperties.forEach(property => {
                        if (body[property] && body[property].length > 0) {
                            numRows = Math.max(numRows, body[property].length);
                            numCols = Math.max(numCols, ...body[property].map(row => row.length));
                        }
                    });
                    
                    matrixProperties.forEach(property => {
                        // Create the property if it doesn't exist
                        if (!body[property]) {
                            body[property] = [];
                        }
                        
                        const currentMatrix = body[property];
                        
                        // Ensure the matrix has the right dimensions before adding
                        while (currentMatrix.length < numRows) {
                            currentMatrix.push(Array(numCols).fill(null));
                        }
                        currentMatrix.forEach(row => {
                            while (row.length < numCols) {
                                row.push(null);
                            }
                        });
                        
                        if (Array.isArray(args)) {
                            // If args is an array, use it as the new column values and add at the end
                            const targetNumRows = Math.max(numRows, args.length);
                            
                            for (let i = 0; i < targetNumRows; i++) {
                                // Ensure we have enough rows
                                if (i >= currentMatrix.length) {
                                    currentMatrix.push(Array(numCols).fill(null));
                                }
                                
                                const row = currentMatrix[i] || [];
                                let valueToAdd;
                                
                                if (property === "value") {
                                    // For value, use the actual values from the array
                                    valueToAdd = i < args.length ? args[i] : null;
                                } else if (property === "color" || property === "arrow") {
                                    // For color and arrow, use null for all values
                                    valueToAdd = null;
                                }
                                
                                row.push(valueToAdd);
                                currentMatrix[i] = row;
                            }
                        } else if (typeof args === 'number') {
                            // If args is a number, use it as the index position and fill with null
                            const insertIndex = Math.max(0, Math.min(args, numCols)); // Clamp to valid range
                            
                            for (let i = 0; i < currentMatrix.length; i++) {
                                const row = currentMatrix[i] || [];
                                // Ensure row has enough columns before inserting
                                while (row.length < insertIndex) {
                                    row.push(null);
                                }
                                // Insert null at the specified index
                                row.splice(insertIndex, 0, null);
                                currentMatrix[i] = row;
                            }
                        } else {
                            // If args is null or undefined, add at the end filled with null
                            for (let i = 0; i < currentMatrix.length; i++) {
                                const row = currentMatrix[i] || [];
                                row.push(null);
                                currentMatrix[i] = row;
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "remove_matrix_row": {
                const name = command.name;
                const rowIndex = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    matrixProperties.forEach(property => {
                        if (body[property]) {
                            const currentMatrix = body[property];
                            
                            if (rowIndex >= 0 && rowIndex < currentMatrix.length) {
                                currentMatrix.splice(rowIndex, 1);
                            } else {
                                causeCompileError(`Row index ${rowIndex} out of bounds for matrix in component "${name}".`, command);
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "remove_matrix_column": {
                const name = command.name;
                const colIndex = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    matrixProperties.forEach(property => {
                        if (body[property]) {
                            const currentMatrix = body[property];
                            let isValidIndex = false;
                            
                            for (let i = 0; i < currentMatrix.length; i++) {
                                const row = currentMatrix[i] || [];
                                
                                if (colIndex >= 0 && colIndex < row.length) {
                                    row.splice(colIndex, 1);
                                    isValidIndex = true;
                                }
                            }
                            
                            if (!isValidIndex && currentMatrix.length > 0) {
                                causeCompileError(`Column index ${colIndex} out of bounds for matrix in component "${name}".`, command);
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "add_matrix_border": {
                const name = command.name;
                const args = command.args;
                const borderValue = args.index !== undefined ? args.index : null;
                const borderColor = args.value !== undefined ? args.value : null;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProps = ["value", "color", "arrow"];
                    
                    // Get the dimensions from value matrix
                    const valueMatrix = body.value || [];
                    const isEmpty = valueMatrix.length === 0;
                    const rows = isEmpty ? 1 : valueMatrix.length;
                    const cols = isEmpty ? 1 : Math.max(...valueMatrix.map(row => row.length || 0));
                    
                    // For each matrix property (value, color, arrow)
                    matrixProps.forEach(prop => {
                        if (prop === "value" || body[prop]) {
                            const borderVal = prop === "value" ? borderValue : 
                                             prop === "color" ? borderColor : null;
                            
                            // Create new matrix with border
                            const newMatrix = [];
                            
                            // Add top border row
                            newMatrix.push(Array(cols + 2).fill(borderVal));
                            
                            // Add middle rows with side borders
                            for (let i = 0; i < rows; i++) {
                                const origRow = body[prop] && body[prop][i] ? body[prop][i] : Array(cols).fill(null);
                                const paddedRow = [...origRow];
                                while (paddedRow.length < cols) paddedRow.push(null);
                                newMatrix.push([borderVal, ...paddedRow, borderVal]);
                            }
                            
                            // Add bottom border row
                            newMatrix.push(Array(cols + 2).fill(borderVal));
                            
                            // Update the matrix
                            body[prop] = newMatrix;
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }

        }
    });

    postCheck(pages);

    // Generate the mermaid string with dynamic sizing
    const { width, height } = getMermaidContainerSize();
    let mermaidString = "visual\n";
    mermaidString += `size: (${width},${height})\n`;
    for (const page of pages) {
        mermaidString += "page\n"
        
        // Add layout information if available
        if (page._layout) {
            mermaidString += `layout: (${page._layout[0]},${page._layout[1]})\n`;
        }
        
        for (const component of page) {
            // Skip internal page properties
            if (component.type) {
                const currentLayout = page._layout || [3, 3]; // Default to 3x3
                
                switch (component.type) {
                    case "array":
                        mermaidString += generateArray(component, currentLayout);
                        break;
                    case "linkedlist":
                        mermaidString += generateLinkedlist(component, currentLayout);
                        break;
                    case "stack":
                        mermaidString += generateStack(component, currentLayout);
                        break;
                    case "tree":
                        mermaidString += generateTree(component, currentLayout);
                        break;
                    case "matrix":
                        mermaidString += generateMatrix(component, currentLayout);
                        break;
                    case "graph":
                        mermaidString += generateGraph(component, currentLayout);
                        break;
                    case "text":
                        mermaidString += generateText(component, currentLayout);
                        break;
                    default:
                        console.log(`No matching component type:\n${component.type}!`)
                        break;
                }
            }
        }
    }

    return {
        mermaidString,
        compiled_pages: pages,
    }
}

function preCheck(parsedDSL) {
    if (!parsedDSL || !parsedDSL.defs || !parsedDSL.cmds) {
        throw new Error("Nothing to show\n\nPlease define an object and a page.\nThen show it using the 'show' command");
    }

    // Check for duplicate component names
    const names = new Set();
    parsedDSL.defs.forEach(def => {
        if (names.has(def.name)) {
            throw new Error(`Duplicate component\n\nAffected: ${def.name} of type ${def.type}`);
        }
        names.add(def.name);
    });

    // Check for valid command types
    parsedDSL.cmds.forEach(cmd => {
        if (![
            "page", "show", "hide", "set", "set_multiple", "set_matrix", "set_matrix_multiple",
            "add", "insert", "remove", "remove_at", "comment",
            "add_matrix_row", "add_matrix_column", "remove_matrix_row", "remove_matrix_column", "add_matrix_border"
        ].includes(cmd.type)) {
            throw new Error(
                `Unknown command\n\nType: ${cmd.type}`
            );
        }
    });


    // Check if the first command is a page
    if (parsedDSL.cmds[0].type !== "page") {
        throw new Error("Command before page\n\nPlease start a page using 'page'.\nThen use any other commands.");
    }
}

function postCheck(pages) {
    // Check if there is at least one page
    if (pages.length === 0) {
        throw new Error("No pages found\n\nPlease define at least one page\nwith components.");
    }
}