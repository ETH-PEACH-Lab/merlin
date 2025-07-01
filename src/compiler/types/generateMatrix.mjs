import { formatPositionForOutput } from '../positionUtils.mjs';

export function generateMatrix(matrixComponent) {
    let result = "matrix\n";
    
    // Add position information if available
    result += formatPositionForOutput(matrixComponent.position);
    
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
                result += `${value} {color:"${cellColor || "null"}",arrow:"${cellArrow || "null"}"}`;
            } else {
                result += `, ${value} {color:"${cellColor || "null"}",arrow:"${cellArrow || "null"}"}`;
            }
        }
    }
    result += "\n@\n";
    return result;
}