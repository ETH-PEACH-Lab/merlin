// This file defines some functions to handle GUI Editor changes and merging commands, it operates on the parsed code structure to create optimized commands for value updates.

/**
 * Merges and creates optimized commands for value updates
 */
export function createOptimizedCommand(relevantCommands, componentName, fieldKey, idx, value) {
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
 * Finds commands that affect a specific component and field on a page
 */
export function findRelevantCommands(commands, pageStartIndex, pageEndIndex, componentName, fieldKey) {
    const relevantCommands = [];
    const commandsToRemove = [];
    
    for (let i = pageStartIndex; i < pageEndIndex; i++) {
        const cmd = commands[i];
        if ((cmd.type === "set" || cmd.type === "set_multiple") && 
            cmd.name === componentName && 
            cmd.target === fieldKey) {
            relevantCommands.push(cmd);
            commandsToRemove.push(i);
        }
    }
    
    return { relevantCommands, commandsToRemove };
}
