// myCompiler to convert myDSL into mermaid code

import { generateArray } from "./types/generateArray.mjs"
import { generateLinkedlist } from "./types/generateLinkedlist.mjs";
import { generateStack } from "./types/generateStack.mjs";
import { generateTree } from "./types/generateTree.mjs";
import { generateMatrix } from "./types/generateMatrix.mjs";
import { generateGraph } from "./types/generateGraph.mjs";

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

    commands.forEach((command) => {
        switch (command.type) {
            case "page":
                // Keep previous page if exists
                if (pages.length > 0) {
                    const lastPage = JSON.parse(JSON.stringify(pages[pages.length - 1]));
                    pages.push(lastPage);
                } else {
                    pages.push([]);
                }
                break;
            case "show":
                const componentNameToShow = command.value;
                const componentData = findComponentDefinitionByName(definitions, componentNameToShow);

                if (componentData) {
                    pages[pages.length - 1].push({
                        type: componentData.type,
                        name: componentData.name,
                        body: componentData.body,
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

    // Generate the mermaid string
    let mermaidString = "visual\n";
    for (const page of pages) {
        mermaidString += "page\n"
        for (const component of page) {
            switch (component.type) {
                case "array":
                    mermaidString += generateArray(component);
                    break;
                case "linkedlist":
                    mermaidString += generateLinkedlist(component);
                    break;
                case "stack":
                    mermaidString += generateStack(component);
                    break;
                case "tree":
                    mermaidString += generateTree(component);
                    break;
                case "matrix":
                    mermaidString += generateMatrix(component);
                    break;
                case "graph":
                    mermaidString += generateGraph(component);
                    break;
                default:
                    console.log(`No matching component type:\n${component.type}!`)
                    break;
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
    // parsedDSL.cmds.forEach(cmd => {
// <<<<<<< HEAD
//         if (!["page", "show", "hide", "set", "set_multiple", "set_matrix", "set_matrix_multiple", "add", "insert", "remove", "remove_at", "comment", "add_matrix_row", "add_matrix_column", "remove_matrix_row", "remove_matrix_column", "add_matrix_border"].includes(cmd.type)) {
//             throw new Error(`Unknown command type: ${cmd.type}`);
// =======
        // if (!["page", "show", "hide", "set", "set_multiple", "set_matrix", "set_matrix_multiple", "add", "insert", "remove", "remove_at", "comment"].includes(cmd.type)) {
        //     throw new Error(`Unknown command\n\nType: ${cmd.type}`);
// >>>>>>> 9e31aa3 (fix: Rewrite error messages to be max 40 characters wide.)
    //     }
    // });
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

    // For each page, check if it has at least one component
    pages.forEach((page, index) => {
        if (page.length === 0) {
            throw new Error(`Page ${index + 1} empty\n\nPlease show a component using:\nshow <component_name>`);
        }
    });
}