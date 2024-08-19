export function generateArray(arrayComponent) {
    console.log("arrayComponent: ", arrayComponent);
    let result = "array\n@\n";
    // for (const id of arrayComponent.attributes.structure) {
    //     result += `${id}\n`
    // }
    const structure = arrayComponent.attributes.structure;
    const color = arrayComponent.attributes.color || [];
    const arrow = arrayComponent.attributes.arrow || [];
    for (let i = 0; i < structure.length ; i++) {
        result += `${structure[i]} {color:"${color[i] || ""}", arrow:"${arrow[i] || ""}"}\n`;
      }
    result += "@\n";
    return result;
}