export function generateArray(arrayComponent) {
    let result = "array\n@\n";

    const structure = arrayComponent.attributes.structure;
    const color = arrayComponent.attributes.color || [];
    const value = arrayComponent.attributes.value || [];
    const arrow = arrayComponent.attributes.arrow || [];
    for (let i = 0; i < structure.length ; i++) {
        result += `${value[i] || structure[i]} {color:"${color[i] || ""}", arrow:"${arrow[i] || "null"}"}\n`;
      }
    result += "@\n";
    return result;
}