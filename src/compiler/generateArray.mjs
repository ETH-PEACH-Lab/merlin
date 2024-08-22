export function generateArray(arrayComponent) {
    let result = "array\n@\n";

    const structure = arrayComponent.attributes.structure;
    const color = arrayComponent.attributes.color || [];
    const arrow = arrayComponent.attributes.arrow || [];
    for (let i = 0; i < structure.length ; i++) {
        result += `${structure[i]} {color:"${color[i] || ""}", arrow:"${arrow[i] || ""}"}\n`;
      }
    result += "@\n";
    return result;
}