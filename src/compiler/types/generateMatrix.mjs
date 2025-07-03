import { formatNodeName, formatNullValue } from '../compiler.mjs';
import { formatPositionForOutput } from '../positionUtils.mjs';

export function generateMatrix(matrixComponent, layout = [3, 3]) {
    let result = "matrix\n";
    
    // Add position information if available
    result += formatPositionForOutput(matrixComponent.position, layout);
    
    result += "@";
    
    const values = matrixComponent.body.value || [];
    const color = matrixComponent.body.color || [];
    const arrow = matrixComponent.body.arrow || [];
    
    for (let row = 0; row < values.length; row++) {
        result += "\n";
        for (let col = 0; col < values[row].length; col++) {
            const value = values[row][col] !== undefined ? values[row][col] : null;
            const cellColor = color[row] ? (color[row][col] || null) : null;
            const cellArrow = arrow[row] ? (arrow[row][col] || null) : null;

            if (col === 0) {
                result += `${formatNodeName(value)} {color:"${formatNullValue(cellColor)}",arrow:"${formatNullValue(cellArrow)}"}`;
            } else {
                result += `, ${formatNodeName(value)} {color:"${formatNullValue(cellColor)}",arrow:"${formatNullValue(cellArrow)}"}`;
            }
        }
    }
    result += "\n@\n";
    return result;
}