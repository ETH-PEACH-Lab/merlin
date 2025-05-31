// re-construct DSL (Merlin Lite) from parsed DSL

export default function reconstructDSL(parsedDSL) {
    const lines = [];
    
    // Process definitions
    if (parsedDSL.defs) {
        parsedDSL.defs.forEach(def => {
            lines.push(reconstructDefinition(def));
        });
        // Empty line after definitions
        lines.push(''); 
    }
    
    // Process commands
    if (parsedDSL.cmds) {
        parsedDSL.cmds.forEach(cmd => {
            const reconstructed = reconstructCommand(cmd);
            if (reconstructed) {
                lines.push(reconstructed);
            }
        });
    }
    
    return lines.join('\n').trim();
}

function reconstructDefinition(def) {
    const { type, name, body } = def;
    let result = `${type} ${name} = {\n`;
    
    for (const [key, value] of Object.entries(body)) {
        result += `\t${key}: ${formatValues(key, value)}\n`;
    }
    
    result += '}';
    return result;
}

function reconstructCommand(cmd) {
    switch (cmd.type) {
        case 'page':
            return 'page';
            
        case 'show':
            return `show ${cmd.value}`;
            
        case 'set':
            const methodName = `set${capitalize(cmd.target)}`;
            const index = cmd.args.index;
            const value = formatValue(cmd.args.value);
            return `${cmd.name}.${methodName}(${index}, ${value})`;
            
        case 'set_multiple':
            const samePlural = ['hidden']
            const pluralMethodName = samePlural.includes(cmd.target) ? `set${capitalize(cmd.target)}` : `set${capitalize(cmd.target)}s`;
            const values = formatValues(cmd.target, cmd.args);
            return `${cmd.name}.${pluralMethodName}(${values})`;
            
        case 'add':
            const addMethodName = `add${capitalize(cmd.target)}`;
            const addValue = formatValue(cmd.args);
            return `${cmd.name}.${addMethodName}(${addValue})`;
            
        case 'insert':
            const insertMethodName = `insert${capitalize(cmd.target)}`;
            const insertIndex = cmd.args.index;
            const insertValue = formatValue(cmd.args.value);
            return `${cmd.name}.${insertMethodName}(${insertIndex}, ${insertValue})`;
            
        case 'remove':
            const removeMethodName = `remove${capitalize(cmd.target)}`;
            const removeValue = formatValue(cmd.args);
            return `${cmd.name}.${removeMethodName}(${removeValue})`;

        default:
            return null;
    }
}

function formatValues(key, value) {
    if (!Array.isArray(value)) {
        return formatValue(value);
    }
    switch (key) {
        case 'nodes':
            // For nodes, just extract the names without quotes
            return `[${value.map(node => node.name).join(',')}]`;
            
        case 'edges':
            // For edges, format as "start-end"
            return `[${value.map(edge => `${edge.start}-${edge.end}`).join(',')}]`;
            
        default:
            // For other properties (value, color, arrow), use standard array formatting
            return `[${value.map(formatValue).join(',')}]`;
    }
}

function formatValue(value) {
    if (value === '_') {
        return '_';
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
    return str.charAt(0).toUpperCase() + str.slice(1);
}