export function generateArray(arrayComponent) {
    let result = "array\n@\n";

    const structure = arrayComponent.attributes.structure;
    const color = arrayComponent.attributes.color || [];
    const value = arrayComponent.attributes.value || [];
    const arrow = arrayComponent.attributes.arrow || [];
    for (let i = 0; i < structure.length ; i++) {
        result += `${value[i] || structure[i]}`;
        result += ` {color:"${color[i] || ""}"`;
        console.log("debug array compiler: ", arrow[i]);
        result += `, arrow:"${arrow[i] === `empty` ? "" : arrow[i] || "null"}`;
        result += `"}\n`;
      }
    result += "@\n";
    return result;
}