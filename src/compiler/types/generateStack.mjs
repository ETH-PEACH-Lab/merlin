import { formatNodeName, formatNullValue } from '../compiler.mjs';
import { formatPositionForOutput } from '../../utils/positionUtils.mjs';

export function generateStack(stackComponent, layout = [3, 3]) {
    let result = "stack\n";
    
    // Add position information if available
    result += formatPositionForOutput(stackComponent.position, layout);
    
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