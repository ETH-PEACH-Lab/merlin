// This file defines some functions to handle GUI Editor changes and merging commands, it operates on the parsed code structure to create optimized commands for value updates.

/**
 * Creates optimized commands for array, matrix, and position field value updates
 */
export function createOptimizedCommand(relevantCommands, componentName, fieldKey, coordinates, value) {
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
        return createOptimizedArrayCommand(relevantCommands, componentName, fieldKey, coordinates.index, value);
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
    
    const targetTypes = isMatrix 
        ? ["set_matrix", "set_matrix_multiple", "add_matrix_row", "add_matrix_column", "remove_matrix_row", "remove_matrix_column", "add_matrix_border"]
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
function createOptimizedArrayCommand(relevantCommands, componentName, fieldKey, idx, value) {
    // Create a merged state of all modifications
    const mergedModifications = new Map(); // index -> value

    // Process existing commands in order
    for (const cmd of relevantCommands) {
        if (cmd.type === "set") {
            const index = cmd.args.index;
            const cmdValue = cmd.args.value;
            mergedModifications.set(index, cmdValue);
        } else if (cmd.type === "set_multiple") {
            cmd.args.forEach((val, idx) => {
                if (val !== "_") {
                    mergedModifications.set(idx, val);
                }
            });
        }
    }
    
    // Handle the new modification
    if (value === "_") {
        // Remove the modification (undo)
        mergedModifications.delete(idx);
    } else {
        // Add the new modification
        mergedModifications.set(idx, value);
    }
    
    // Determine the new command to add
    if (mergedModifications.size === 0) {
        // No modifications left, don't add any command
        return null;
    } else if (mergedModifications.size === 1 && mergedModifications.has(idx) && value !== "_") {
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
        // Find the maximum index to determine array size
        const maxIndex = Math.max(...mergedModifications.keys());
        const args = new Array(maxIndex + 1).fill("_");
        
        // Fill in the modifications
        for (const [index, val] of mergedModifications) {
            args[index] = val;
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
    if (value === "_") {
        // Remove the modification (undo)
        mergedModifications.delete(currentKey);
    } else {
        // Add the new modification
        mergedModifications.set(currentKey, value);
    }
    
    // Determine the new command to add
    if (mergedModifications.size === 0) {
        // No modifications left, don't add any command
        return null;
    } else if (mergedModifications.size === 1 && mergedModifications.has(currentKey) && value !== "_") {
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
