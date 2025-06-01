export function generateMatrix(matrixComponent) {
    let result = "matrix\n@";
    
    const values = matrixComponent.body.values || [];
    const color = matrixComponent.body.color || [];
    
    for (let row = 0; row < values.length; row++) {
        result += "\n";
        for (let col = 0; col < values[row].length; col++) {
            const value = values[row][col] !== undefined ? values[row][col] : null;
            const cellColor = color[row] ? (color[row][col] || null) : null;
            
            if (col === 0) {
                result += `${value} {color:"${cellColor || ""}", arrow:"${null}"}`;
            } else {
                result += `, ${value} {color:"${cellColor || ""}", arrow:"${null}"}`;
            }
        }
    }
    result += "\n@\n";
    return result;
}