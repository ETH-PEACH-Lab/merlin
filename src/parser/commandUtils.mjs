// This file defines some functions to handle GUI Editor changes and merging commands, it operates on the parsed code structure to create optimized commands for value updates.

/**
 * Creates optimized commands for both array and matrix value updates
 */
export function createOptimizedCommand(relevantCommands, componentName, fieldKey, coordinates, value) {
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
export function findRelevantCommands(commands, pageStartIndex, pageEndIndex, componentName, fieldKey, isMatrix = false) {
    const relevantCommands = [];
    const commandsToRemove = [];
    
    const targetTypes = isMatrix 
        ? ["set_matrix", "set_matrix_multiple"]
        : ["set", "set_multiple"];
    
    for (let i = pageStartIndex; i < pageEndIndex; i++) {
        const cmd = commands[i];
        if (targetTypes.includes(cmd.type) && 
            cmd.name === componentName && 
            cmd.target === fieldKey) {
            relevantCommands.push(cmd);
            commandsToRemove.push(i);
        }
    }
    
    return { relevantCommands, commandsToRemove };
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
