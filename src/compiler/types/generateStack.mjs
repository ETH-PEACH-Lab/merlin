export function generateStack(stackComponent) {
    let result = "stack\n";
    
    // Add position information if available
    if (stackComponent.position && Array.isArray(stackComponent.position)) {
        result += `position: (${stackComponent.position[0]},${stackComponent.position[1]})\n`;
    }
    
    result += "size: 7\n";
    result += "@\n";
    
    const value = stackComponent.body.value || [];
    const color = stackComponent.body.color || [];
    const arrow = stackComponent.body.arrow || [];
    
    for (let i = 0; i < value.length; i++) {
        const stackValue = value[i];
        const stackColor = i < color.length ? color[i] : null;
        const stackArrow = i < arrow.length ? arrow[i] : null;
        
        result += `${stackValue}`;
        result += ` {color:"${stackColor || "null"}"`;
        result += `, arrow:"${stackArrow === 'empty' ? "" : stackArrow || "null"}"`;
        result += `}\n`;
    }
    
    result += "@\n";
    return result;
}