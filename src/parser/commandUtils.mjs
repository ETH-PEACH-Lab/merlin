// This file defines some functions to handle GUI Editor changes and merging commands, it operates on the parsed code structure to create optimized commands for value updates.

/**
 * Creates optimized commands for array, matrix, and position field value updates
 */
export function createOptimizedCommand(relevantCommands, componentName, fieldKey, coordinates, value, componentDefinition = null) {
    // Handle position field updates
    if (fieldKey === "position") {
        return createOptimizedPositionCommand(relevantCommands, componentName, value);
    }
    
    // Handle global text properties (no coordinates)
    if (!coordinates) {
        return createOptimizedGlobalCommand(relevantCommands, componentName, fieldKey, value);
    }
    
    const isMatrix = coordinates.isMatrix;
    
    if (isMatrix) {
        return createOptimizedMatrixCommand(relevantCommands, componentName, fieldKey, coordinates.row, coordinates.col, value);
    } else {
        return createOptimizedArrayCommand(relevantCommands, componentName, fieldKey, coordinates.index, value, componentDefinition);
    }
}

/**
 * Finds commands that affect a specific component and field on a page
 */
export function findRelevantCommands(commands, pageStartIndex, pageEndIndex, componentName, fieldKey, isMatrix = false, coordinates = null) {
    const relevantCommands = [];
    const commandsToRemove = [];
    
    // Handle position field commands
    if (fieldKey === "position") {
        const targetTypes = ["show"];
        
        for (let i = pageStartIndex; i < pageEndIndex; i++) {
            const cmd = commands[i];
            if (targetTypes.includes(cmd.type) && cmd.value === componentName) {
                relevantCommands.push(cmd);
                commandsToRemove.push(i);
            }
        }
        
        return { relevantCommands, commandsToRemove };
    }
    
    // Check if this is a global property (coordinates is null)
    if (coordinates === null) {
        // For global properties, look for simple set commands (without index)
        const targetTypes = ["set"];
        
        for (let i = pageStartIndex; i < pageEndIndex; i++) {
            const cmd = commands[i];
            if (targetTypes.includes(cmd.type) && 
                cmd.name === componentName && 
                cmd.target === fieldKey &&
                // Global set commands have args as direct value, not object with index
                (typeof cmd.args !== 'object' || !cmd.args.hasOwnProperty('index'))) {
                relevantCommands.push(cmd);
                commandsToRemove.push(i);
            }
        }
        
        return { relevantCommands, commandsToRemove };
    }
    
    // For matrix value updates, only consider set commands, not structural modifications
    const targetTypes = isMatrix 
        ? ["set_matrix", "set_matrix_multiple"]
        : ["set", "set_multiple"];
    
    for (let i = pageStartIndex; i < pageEndIndex; i++) {
        const cmd = commands[i];
        if (targetTypes.includes(cmd.type) && 
            cmd.name === componentName && 
            (cmd.target === fieldKey || cmd.type.startsWith("add_matrix_") || cmd.type.startsWith("remove_matrix_"))) {
            relevantCommands.push(cmd);
            commandsToRemove.push(i);
        }
    }
    
    return { relevantCommands, commandsToRemove };
}

/**
 * Internal function for global command optimization (properties without coordinates)
 */
function createOptimizedGlobalCommand(relevantCommands, componentName, fieldKey, value) {
    // For global properties, we just create a single command
    // No need to merge multiple commands since it's a single value
    
    // If value is null, undefined, or empty string, don't create a command (effectively clearing the property)
    if (value === null || value === undefined || value === "" || value === "null") {
        return null;
    }
    
    return {
        type: "set",
        target: fieldKey,
        args: value,  // For global properties, args is just the value, not an object with index
        name: componentName,
        line: 0,
        col: 0
    };
}

/**
 * Internal function for array command optimization
 */
function createOptimizedArrayCommand(relevantCommands, componentName, fieldKey, idx, value, componentDefinition = null) {
    // Create a merged state of all modifications
    const mergedModifications = new Map(); // index -> value

    // Process existing commands in order
    for (const cmd of relevantCommands) {
        if (cmd.type === "set") {
            const index = cmd.args.index;
            const cmdValue = cmd.args.value;
            mergedModifications.set(index, cmdValue);
        } else if (cmd.type === "set_multiple") {
            if (Array.isArray(cmd.args)) {
                cmd.args.forEach((val, idx) => {
                    if (val !== "_") {
                        mergedModifications.set(idx, val);
                    }
                });
            } else {
                // Handle object format
                for (const [key, val] of Object.entries(cmd.args)) {
                    if (val !== "_") {
                        mergedModifications.set(key, val);
                    }
                }
            }
        }
    }
    
    // Handle the new modification
    if (value === "_" || value === undefined || value === "") {
        // Remove the modification (undo/clear)
        mergedModifications.delete(idx);
    } else {
        // Add the new modification
        mergedModifications.set(idx, value);
    }
    // Determine the new command to add
    if (mergedModifications.size === 0) {
        // No modifications left, don't add any command
        return null;
    } else if (mergedModifications.size === 1 && mergedModifications.has(idx) && 
               !(value === "_" || value === undefined || value === "")) {
        // Only one modification, use "set"
        return {
            type: "set",
            target: fieldKey,
            args: {
                index: idx,
                value: value
            },
            name: componentName,
            line: 0,
            col: 0
        };
    } else {
        // Multiple modifications, use "set_multiple"
        const keys = Array.from(mergedModifications.keys());
        
        // Special handling for array fields that should always output arrays
        if (fieldKey === "arrows" || fieldKey === "arrow" || fieldKey === "colors" || fieldKey === "color") {
            // For trees/graphs with node-based indexing, we need to map node names to indices
            const nodeToIndexMap = new Map();
            let maxArraySize = 0;
            
            // If we have component definition with nodes, use it for mapping
            if (componentDefinition && componentDefinition.body && componentDefinition.body.nodes) {
                const nodes = componentDefinition.body.nodes;
                nodes.forEach((nodeName, index) => {
                    nodeToIndexMap.set(nodeName, index);
                });
                maxArraySize = nodes.length;
            } else {
                // Fallback: analyze existing commands to understand the node structure
                for (const cmd of relevantCommands) {
                    if (cmd.type === "set" && typeof cmd.args.index === "number") {
                        maxArraySize = Math.max(maxArraySize, cmd.args.index + 1);
                    } else if (cmd.type === "set_multiple" && Array.isArray(cmd.args)) {
                        maxArraySize = Math.max(maxArraySize, cmd.args.length);
                    }
                }
                
                // For unknown node names, assign them to the next available indices
                let nextIndex = maxArraySize;
                for (const [key, val] of mergedModifications) {
                    if (isNaN(key) || !Number.isInteger(Number(key))) {
                        if (!nodeToIndexMap.has(key)) {
                            nodeToIndexMap.set(key, nextIndex);
                            nextIndex++;
                        }
                    }
                }
                maxArraySize = Math.max(maxArraySize, nextIndex);
            }
            
            // Also consider the current modifications to expand array size if needed
            for (const [key, val] of mergedModifications) {
                if (!isNaN(key) && Number.isInteger(Number(key))) {
                    maxArraySize = Math.max(maxArraySize, Number(key) + 1);
                }
            }
            
            const args = new Array(maxArraySize).fill("_");
            
            // Fill in all modifications using resolved indices
            for (const [key, val] of mergedModifications) {
                let index;
                if (!isNaN(key) && Number.isInteger(Number(key))) {
                    index = Number(key);
                } else {
                    index = nodeToIndexMap.get(key);
                }
                
                if (index !== undefined && index >= 0 && index < args.length) {
                    args[index] = val;
                }
            }
            
            return {
                type: "set_multiple",
                target: fieldKey,
                args: args,
                name: componentName,
                line: 0,
                col: 0
            };
        }
        
        const allNumeric = keys.every(k => typeof k === "number" || (!isNaN(k) && Number.isInteger(Number(k))));
        
        if (allNumeric) {
            // All keys are numeric, use array format
            const numericKeys = keys.map(Number);
            const maxIndex = Math.max(...numericKeys);
            const args = new Array(maxIndex + 1).fill("_");
            
            // Fill in the modifications
            for (const [index, val] of mergedModifications) {
                args[Number(index)] = val;
            }
            
            return {
                type: "set_multiple",
                target: fieldKey,
                args: args,
                name: componentName,
                line: 0,
                col: 0
            };
        } else {
            // Mixed or string keys, use object format
            const args = {};
            for (const [key, val] of mergedModifications) {
                args[key] = val;
            }
            
            return {
                type: "set_multiple",
                target: fieldKey,
                args: args,
                name: componentName,
                line: 0,
                col: 0
            };
        }
    }
}

/**
 * Internal function for matrix command optimization
 */
function createOptimizedMatrixCommand(relevantCommands, componentName, fieldKey, row, col, value) {
    // Create a merged state of all modifications
    const mergedModifications = new Map(); // "row,col" -> value

    // Process existing commands in order
    for (const cmd of relevantCommands) {
        if (cmd.type === "set_matrix") {
            const key = `${cmd.args.row},${cmd.args.col}`;
            mergedModifications.set(key, cmd.args.value);
        } else if (cmd.type === "set_matrix_multiple") {
            // Process 2D array
            cmd.args.forEach((rowArray, rowIdx) => {
                rowArray.forEach((val, colIdx) => {
                    if (val !== "_") {
                        const key = `${rowIdx},${colIdx}`;
                        mergedModifications.set(key, val);
                    }
                });
            });
        }
    }
    
    // Handle the new modification
    const currentKey = `${row},${col}`;
    if (value === "_" || value === undefined || value === "") {
        // Remove the modification (undo/clear)
        mergedModifications.delete(currentKey);
    } else {
        // Add the new modification
        mergedModifications.set(currentKey, value);
    }
    
    // Determine the new command to add
    if (mergedModifications.size === 0) {
        // No modifications left, don't add any command
        return null;
    } else if (mergedModifications.size === 1 && mergedModifications.has(currentKey) && 
               !(value === "_" || value === undefined || value === "")) {
        // Only one modification, use "set_matrix"
        return {
            type: "set_matrix",
            target: fieldKey,
            args: {
                row: row,
                col: col,
                value: value
            },
            name: componentName,
            line: 0,
            col: 0
        };
    } else {
        // Multiple modifications, use "set_matrix_multiple"
        // Find the maximum dimensions
        const coordinates = Array.from(mergedModifications.keys()).map(key => {
            const [r, c] = key.split(',').map(Number);
            return { row: r, col: c };
        });
        
        const maxRow = Math.max(...coordinates.map(coord => coord.row));
        const maxCol = Math.max(...coordinates.map(coord => coord.col));
        
        // Create 2D array filled with "_"
        const args = Array(maxRow + 1).fill(null).map(() => Array(maxCol + 1).fill("_"));
        
        // Fill in the modifications
        for (const [key, val] of mergedModifications) {
            const [r, c] = key.split(',').map(Number);
            args[r][c] = val;
        }
        
        return {
            type: "set_matrix_multiple",
            target: fieldKey,
            args: args,
            name: componentName,
            line: 0,
            col: 0
        };
    }
}

/**
 * Internal function for position command optimization
 */
function createOptimizedPositionCommand(relevantCommands, componentName, value) {
    // Find the most recent show command for this component
    let baseShowCommand = null;
    
    for (const cmd of relevantCommands) {
        if (cmd.type === "show" && cmd.value === componentName) {
            baseShowCommand = cmd;
        }
    }
    
    // Create the base command structure, preserving existing properties if available
    const newCommand = {
        type: "show",
        value: componentName,
        line: baseShowCommand?.line || 0,
        col: baseShowCommand?.col || 0
    };
    
    // Preserve any other properties from the base command (except position)
    if (baseShowCommand) {
        Object.keys(baseShowCommand).forEach(key => {
            if (key !== "type" && key !== "value" && key !== "position" && key !== "line" && key !== "col") {
                newCommand[key] = baseShowCommand[key];
            }
        });
    }
    
    // Handle position value
    if (value && value.trim() !== "") {
        newCommand.position = parsePositionValue(value);
    }
    // If no position value, the command will not have a position property (removing position)
    
    return newCommand;
}

/**
 * Parse position value from string to proper structure expected by reconstructor
 */
function parsePositionValue(value) {
    if (!value || typeof value !== 'string') {
        return value;
    }
    
    const trimmed = value.trim();
    
    // Handle position keywords (like "center", "top-left", "tl")
    const keywordMatch = trimmed.match(/^([a-zA-Z]+(?:-[a-zA-Z]+)?)$/);
    if (keywordMatch) {
        return {
            type: "keyword",
            value: keywordMatch[1],
            line: 0,
            col: 0
        };
    }
    
    // Handle coordinate tuple format "(x,y)" where x or y can be ranges
    const tupleMatch = trimmed.match(/^\(([^,]+),\s*([^)]+)\)$/);
    if (tupleMatch) {
        const xStr = tupleMatch[1].trim();
        const yStr = tupleMatch[2].trim();
        
        const parsePositionComponent = (str) => {
            // Check for range format like "0..1"
            const rangeMatch = str.match(/^(\d+)\.\.(\d+)$/);
            if (rangeMatch) {
                return {
                    type: "range",
                    start: parseInt(rangeMatch[1]),
                    end: parseInt(rangeMatch[2])
                };
            }
            // Simple number
            const numMatch = str.match(/^\d+$/);
            if (numMatch) {
                return parseInt(str);
            }
            // Return as-is if not recognized
            return str;
        };
        
        return [parsePositionComponent(xStr), parsePositionComponent(yStr)];
    }
    
    // If we can't parse it, return as-is
    return value;
}

/**
 * Creates optimized commands for matrix structure modifications
 */
export function createOptimizedMatrixStructureCommand(componentName, commandType, index) {
    return {
        type: commandType,
        target: "value", // Matrix structural changes affect all properties
        args: index,
        name: componentName,
        line: 0,
        col: 0
    };
}
