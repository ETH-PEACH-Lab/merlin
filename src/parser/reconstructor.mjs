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
        'children': 'Child',
        'values': 'Value',
        'colors': 'Color',
        'arrows': 'Arrow',
        'hidden': 'Hidden',
        'fontSize': 'FontSize',
        'fontWeight': 'FontWeight',
        'fontFamily': 'FontFamily',
        'align': 'Align',
        'lineSpacing': 'LineSpacing',
        'width': 'Width',
        'height': 'Height'
    };
    
    // Handle special plural cases that don't follow standard rules
    const pluralExceptions = {
        'hidden': 'Hidden',  // hidden stays the same in plural
        'fontSize': 'FontSizes',  // fontSize -> FontSizes
        'fontWeight': 'FontWeights',  // fontWeight -> FontWeights  
        'fontFamily': 'FontFamilies',  // fontFamily -> FontFamilies
        'align': 'Aligns'  // align -> Aligns
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
    // For now, check if the command has specific properties that indicate it's for a text component
    // This could be enhanced to actually look up the component type in the parsed DSL
    return cmd.target === 'value' && typeof cmd.args === 'string' ||
           cmd.target === 'value' && cmd.args && typeof cmd.args.value === 'string' ||
           ['fontSize', 'fontWeight', 'fontFamily', 'align', 'lineSpacing', 'width', 'height'].includes(cmd.target);
}

function reconstructCommand(cmd) {
    switch (cmd.type) {
        case 'page':
            if (cmd.layout && Array.isArray(cmd.layout) && cmd.layout.length === 2) {
                return `\npage ${cmd.layout[0]}x${cmd.layout[1]}`;
            }
            return '\npage';
            
        case 'show':
            if (cmd.position) {
                return `show ${cmd.value} ${formatPosition(cmd.position)}`;
            }
            return `show ${cmd.value}`;
            
            
        case 'set':
            // Special handling for text components
            if (isTextComponent(cmd)) {
                // Check if it's an indexed operation or direct property setting
                if (cmd.args.index !== undefined) {
                    // Array-style operation with index
                    const methodName = getMethodName('set', cmd.target, false);
                    const index = cmd.args.index;
                    const value = formatValue(cmd.args.value, cmd.target);
                    return `${cmd.name}.${methodName}(${index}, ${value})`;
                } else {
                    // Direct property setting (no index)
                    const methodName = getMethodName('set', cmd.target, false);
                    const value = formatValue(cmd.args, cmd.target);
                    return `${cmd.name}.${methodName}(${value})`;
                }
            } else {
                // Original array-based handling for other components
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
        case 'add_child':
            // Handles both addChild(parent-child) and addChild(parent-child, value)
            if (cmd.args && cmd.args.start && cmd.args.end) {
                return `${cmd.name}.addChild(${cmd.args.start}-${cmd.args.end})`;
            } else if (cmd.args && cmd.args.index && cmd.args.value !== undefined && cmd.args.index.start && cmd.args.index.end) {
                return `${cmd.name}.addChild(${cmd.args.index.start}-${cmd.args.index.end}, ${formatValue(cmd.args.value)})`;
            }
            return null;

        case 'set_child':
            // setChild(child, parent)
            if (cmd.args && cmd.args.start && cmd.args.end) {
                return `${cmd.name}.setChild(${cmd.args.start}-${cmd.args.end})`;
            }
            return null;

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
            
            // Handle special case for insertNode with optional third parameter
            if (cmd.target === 'nodes' && cmd.args.nodeValue !== undefined) {
                const insertIndex = cmd.args.index;
                const insertNodeName = formatValue(cmd.args.value, cmd.target);
                const insertNodeValue = formatValue(cmd.args.nodeValue, cmd.target);
                return `${cmd.name}.${insertMethodName}(${insertIndex}, ${insertNodeName}, ${insertNodeValue})`;
            } else {
                const insertIndex = cmd.args.index;
                const insertValue = formatValue(cmd.args.value, cmd.target);
                return `${cmd.name}.${insertMethodName}(${insertIndex}, ${insertValue})`;
            }
            
        case 'remove':
            const removeMethodName = getMethodName('remove', cmd.target, false);
            const removeValue = formatValue(cmd.args, cmd.target);
            return `${cmd.name}.${removeMethodName}(${removeValue})`;
            
        case 'remove_at':
            const removeAtIndex = cmd.args;
            return `${cmd.name}.removeAt(${removeAtIndex})`;
            
        case 'remove_subtree':
            const subtreeNode = formatValue(cmd.args, cmd.target);
            return `${cmd.name}.removeSubtree(${subtreeNode})`;
            
        case 'add_matrix_row':
            const addRowValue = cmd.args !== null && cmd.args !== undefined ? cmd.args : '';
            return `${cmd.name}.addRow(${addRowValue})`;
            
        case 'add_matrix_column':
            const addColValue = cmd.args !== null && cmd.args !== undefined ? cmd.args : '';
            return `${cmd.name}.addColumn(${addColValue})`;
            
        case 'remove_matrix_row':
            return `${cmd.name}.removeRow(${cmd.args})`;
            
        case 'remove_matrix_column':
            return `${cmd.name}.removeColumn(${cmd.args})`;
            
        case 'add_matrix_border':
            const borderValue = formatValue(cmd.args.index);
            const borderColor = formatValue(cmd.args.value);
            return `${cmd.name}.addBorder(${borderValue}, ${borderColor})`;

        default:
            return null;
    }
}

export function formatPosition(position) {
    if (!position) {
        return '';
    }
    
    // Handle keyword-type positions
    if (typeof position === 'object' && position.type === 'keyword') {
        return position.value;
    }
    
    // Handle the new shape-based position format
    if (typeof position === 'object' && position.originalPosition) {
        position = position.originalPosition;
    }
    
    // Handle array-type positions (coordinate tuples)
    if (Array.isArray(position)) {
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
    
    // For any other format, return as-is (fallback)
    return '';
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
            
        case 'children':
            // For children (tree), format as "parent-child"
            return `[${value.map(child => `${child.start}-${child.end}`).join(',')}]`;
            
        default:
            // For other properties (value, color, arrow), use standard array formatting
            // For text properties, if all elements are strings, format accordingly
            if (key === 'value' && value.every(v => typeof v === 'string' || v === null)) {
                return `[${value.map(item => formatValue(item)).join(', ')}]`;
            }
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