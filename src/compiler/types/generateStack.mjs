import { formatNodeName, formatNullValue } from '../compiler.mjs';

export function generateStack(stackComponent) {
    let result = "stack\n";
    result += "size: 7\n";
    result += "@\n";
    
    const value = stackComponent.body.value || [];
    const color = stackComponent.body.color || [];
    const arrow = stackComponent.body.arrow || [];
    
    for (let i = 0; i < value.length; i++) {
        const stackValue = value[i];
        const stackColor = i < color.length ? color[i] : null;
        const stackArrow = i < arrow.length ? arrow[i] : null;
        
        result += `${formatNodeName(stackValue)}`;
        result += ` {color:"${formatNullValue(stackColor)}"`;
        result += `, arrow:"${stackArrow === 'empty' ? "" : formatNullValue(stackArrow)}"`;
        result += `}\n`;
    }
    
    result += "@\n";
    return result;
}