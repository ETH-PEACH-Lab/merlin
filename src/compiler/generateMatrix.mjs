export function generateMatrix(matrixComponent) {
    let result = "matrix\n@";
    // for (const id of arrayComponent.attributes.structure) {
    //     result += `${id}\n`
    // }
    const structure = matrixComponent.attributes.structure;
    const color = matrixComponent.attributes.color || [];
    const arrow = matrixComponent.attributes.arrow || [];
    for (let row = 0; row < structure.length ; row++) {
        result += "\n"
        // result += `${structure[i]} {color:"${color[i] || ""}", arrow:"${arrow[i] || ""}"}\n`;
        for (let col = 0; col < structure[row].length; col++) {
            if (col === 0) {
                result += `${structure[row][col]} {color:"${color[row] ? (color[row][col] || null) : null}",arrow:"${arrow[row] ? (arrow[row][col] || null) : null}"}`
            }
            else {
                result += `, ${structure[row][col]} {color:"${color[row] ? (color[row][col] || null) : null}",arrow:"${arrow[row] ? (arrow[row][col] || null) : null}"}` 
            }
        }
      }
    result += "\n@\n";
    return result;
}