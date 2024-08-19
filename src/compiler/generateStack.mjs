export function generateStack(stackComponent) {
    console.log('stackComponent: ', stackComponent);
    let result = "stack\n";
    result += "size: 7\n";
    result += "@\n";
    // for (const id of arrayComponent.attributes.structure) {
    //     result += `${id}\n`
    // }
    const structure = stackComponent.attributes.structure;
    const color = stackComponent.attributes.color || [];
    const arrow = stackComponent.attributes.arrow || [];
    for (let i = 0; i < structure.length ; i++) {
        result += `${structure[i]} {color:"${color[i] || ""}", arrow:"${arrow[i] || ""}"}\n`;
      }
    result += "@\n";
    return result;
}