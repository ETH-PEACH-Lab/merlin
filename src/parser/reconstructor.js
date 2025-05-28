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
        result += `\t${key}: ${formatArray(value)}\n`;
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
            const pluralMethodName = `set${capitalize(cmd.target)}s`;
            const values = formatArray(cmd.args);
            return `${cmd.name}.${pluralMethodName}(${values})`;
            
        default:
            return null;
    }
}

function formatArray(arr) {
    return `[${arr.map(formatValue).join(',')}]`;
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
    // For any other type, convert to string as fallback
    return String(value);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}