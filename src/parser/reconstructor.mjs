// re-construct DSL (Merlin Lite) from parsed DSL

export default function reconstructDSL(parsedDSL) {
    const lines = [];
    
    // Process definitions
    if (parsedDSL.defs) {
        parsedDSL.defs.forEach(def => {
            if (def.type === 'comment') {
                lines.push(`// ${def.content}`);
            } else {
                lines.push(reconstructDefinition(def));
            }
        });
        // Empty line after definitions
        lines.push(''); 
    }
    
    // Process commands
    if (parsedDSL.cmds) {
        parsedDSL.cmds.forEach(cmd => {
            if (cmd.type === 'comment') {
                lines.push(`// ${cmd.content}`);
            } else {
                const reconstructed = reconstructCommand(cmd);
                if (reconstructed) {
                    lines.push(reconstructed);
                }
            }
        });
    }
    
    return lines.join('\n').trim();
}

function reconstructDefinition(def) {
    const { type, name, body } = def;
    if (!body) {
        console.error(`Error: No body found in definition for ${type} ${name}`);
        return `${type} ${name} = {}\n`;
    }
    
    let result = `${type} ${name} = {\n`;
    
    for (const [key, value] of Object.entries(body)) {
        result += `\t${key}: ${formatValues(key, value)}\n`;
    }
    
    result += '}';
    return result;
}

function getMethodName(action, target, isPlural = false) {
    // Handle special cases for singular forms
    const singularMap = {
        'nodes': 'Node',
        'edges': 'Edge',
        'values': 'Value',
        'colors': 'Color',
        'arrows': 'Arrow',
        'hidden': 'Hidden'
    };
    
    // Handle special plural cases that don't follow standard rules
    const pluralExceptions = {
        'hidden': 'Hidden'  // hidden stays the same in plural
    };
    
    let targetName;
    if (isPlural) {
        if (pluralExceptions[target]) {
            targetName = pluralExceptions[target];
        } else if (singularMap[target]) {
            targetName = singularMap[target] + 's';
        } else {
            targetName = capitalize(target) + 's';
        }
    } else {
        if (singularMap[target]) {
            targetName = singularMap[target];
        } else {
            targetName = capitalize(target);
        }
    }
    
    return `${action}${targetName}`;
}

function isTextComponent(cmd) {
    // Simple check - could be enhanced to actually verify component type
    return cmd.target === 'value' && typeof cmd.args === 'string';
}

function reconstructCommand(cmd) {
    switch (cmd.type) {
        case 'page':
            return '\npage';
            
        case 'show':
            if (cmd.position) {
                return `show ${cmd.value} ${formatPosition(cmd.position)}`;
            }
            return `show ${cmd.value}`;
            
            
        case 'set':
            // Special handling for text components
            if (cmd.target === 'value' && isTextComponent(cmd)) {
                const methodName = 'setValue';
                const value = formatValue(cmd.args, cmd.target);
                return `${cmd.name}.${methodName}(${value})`;
            } else {
                // Original array-based handling
                const methodName = getMethodName('set', cmd.target, false);
                const index = cmd.args.index;
                const value = formatValue(cmd.args.value, cmd.target);
                return `${cmd.name}.${methodName}(${index}, ${value})`;
            }
            
        case 'set_multiple':
            const pluralMethodName = getMethodName('set', cmd.target, true);
            const values = formatValues(cmd.target, cmd.args);
            return `${cmd.name}.${pluralMethodName}(${values})`;
            
        case 'set_matrix':
            const matrixMethodName = getMethodName('set', cmd.target, false);
            const row = cmd.args.row;
            const col = cmd.args.col;
            const matrixValue = formatValue(cmd.args.value);
            return `${cmd.name}.${matrixMethodName}(${row}, ${col}, ${matrixValue})`;
            
        case 'set_matrix_multiple':
            const matrixMultipleMethodName = getMethodName('set', cmd.target, true);
            const matrixMultipleValue = formatMatrix(cmd.args);
            return `${cmd.name}.${matrixMultipleMethodName}(${matrixMultipleValue})`;
            
        case 'add':
            const addMethodName = getMethodName('add', cmd.target, false);
            
            // Handle special case for nodes with optional value
            if (cmd.target === 'nodes' && cmd.args && typeof cmd.args === 'object' && cmd.args.index !== undefined) {
                const nodeName = formatValue(cmd.args.index, cmd.target);
                const nodeValue = formatValue(cmd.args.value, cmd.target);
                return `${cmd.name}.${addMethodName}(${nodeName}, ${nodeValue})`;
            } else {
                const addValue = formatValue(cmd.args, cmd.target);
                return `${cmd.name}.${addMethodName}(${addValue})`;
            }
            
        case 'insert':
            const insertMethodName = getMethodName('insert', cmd.target, false);
            const insertIndex = cmd.args.index;
            const insertValue = formatValue(cmd.args.value, cmd.target);
            return `${cmd.name}.${insertMethodName}(${insertIndex}, ${insertValue})`;
            
        case 'remove':
            const removeMethodName = getMethodName('remove', cmd.target, false);
            const removeValue = formatValue(cmd.args, cmd.target);
            return `${cmd.name}.${removeMethodName}(${removeValue})`;
            
        case 'remove_at':
            const removeAtIndex = cmd.args;
            return `${cmd.name}.removeAt(${removeAtIndex})`;

        default:
            return null;
    }
}

function formatPosition(position) {
    if (!position) {
        return '';
    }
    
    // Handle the new shape-based position format
    if (typeof position === 'object' && position.originalPosition) {
        position = position.originalPosition;
    }
    
    if (!Array.isArray(position)) {
        return '';
    }
    
    const [x, y] = position;
    
    function formatPositionValue(value) {
        if (value && typeof value === 'object' && value.type === 'range') {
            return `${value.start}..${value.end}`;
        }
        return value;
    }
    
    const xStr = formatPositionValue(x);
    const yStr = formatPositionValue(y);
    
    return `(${xStr}, ${yStr})`;
}

function formatMatrix(matrix) {
    if (!Array.isArray(matrix)) {
        return formatValue(matrix);
    }
    
    // Handle 2D arrays for matrix
    if (Array.isArray(matrix[0])) {
        return `[${matrix.map(row => `[${row.map(item => formatValue(item)).join(', ')}]`).join(', ')}]`;
    }
    
    // Fallback to regular array formatting
    return `[${matrix.map(item => formatValue(item)).join(', ')}]`;
}

function formatValues(key, value) {
    if (!Array.isArray(value)) {
        return formatValue(value);
    }
    
    // Handle 2D arrays for matrix (value, values, color)
    if (key === 'value' || key === 'color' || key === 'arrow') {
        // Check if it's a 2D array (matrix)
        if (Array.isArray(value[0])) {
            return `[${value.map(row => `[${row.map(formatValue).join(', ')}]`).join(', ')}]`;
        }
    }
    
    switch (key) {
        case 'nodes':
            // For nodes, just extract the names without quotes
            return `[${value.join(',')}]`;
            
        case 'edges':
            // For edges, format as "start-end"
            return `[${value.map(edge => `${edge.start}-${edge.end}`).join(',')}]`;
            
        default:
            // For other properties (value, color, arrow), use standard array formatting
            return `[${value.map(item => formatValue(item)).join(', ')}]`;
    }
}

function formatValue(value, target = null) {
    if (value === '_') {
        return '_';
    }

    if (target === 'nodes') {
        return value;
    }

    if (value === null || value === undefined) {
        return 'null';
    }
    if (typeof value === 'string') {
        return `"${value}"`;
    }
    if (typeof value === 'number') {
        return value.toString();
    }
    if (typeof value === 'boolean') {
        return value.toString();
    }
    // Handle word objects (nodes)
    if (value && typeof value === 'object' && value.name && !value.start && !value.end) {
        return value.name;
    }
    // Handle edge objects
    if (value && typeof value === 'object' && value.start && value.end) {
        return `${value.start}-${value.end}`;
    }
    // For any other type, convert to string as fallback
    return String(value);
}

function capitalize(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}