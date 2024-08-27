export function generateLinkedlist(linkedListComponent) {
    let result = "linkedList\n@\n";

    const structure = linkedListComponent.attributes.structure;
    const value = linkedListComponent.attributes.value || [];
    const color = linkedListComponent.attributes.color || [];
    const arrow = linkedListComponent.attributes.arrow || [];
    for (let i = 0; i < structure.length ; i++) {
        result += `${structure[i]} {value:"${value[i] || structure[i]}", color:"${color[i] || "null"}", arrow:"${arrow[i] || "null"}"}\n`;
      }
    result += "@\n";
    return result;
}