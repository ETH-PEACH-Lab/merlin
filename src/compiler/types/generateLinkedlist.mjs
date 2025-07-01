export function generateLinkedlist(linkedListComponent) {
    let result = "linkedList\n";
    
    // Add position information if available
    if (linkedListComponent.position && Array.isArray(linkedListComponent.position)) {
        result += `position: (${linkedListComponent.position[0]},${linkedListComponent.position[1]})\n`;
    }
    
    result += "@";
    
    const nodes = linkedListComponent.body.nodes || [];
    const value = linkedListComponent.body.value || [];
    const color = linkedListComponent.body.color || [];
    const arrow = linkedListComponent.body.arrow || [];

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const nodeValue = i < value.length ? value[i] : null;
        const nodeColor = i < color.length ? color[i] : null;
        const nodeArrow = i < arrow.length ? arrow[i] : null;
        
        result += `\n${node} {value:"${nodeValue ?? node}", color:"${nodeColor ?? "null"}", arrow:"${nodeArrow === 'empty' ? "" : (nodeArrow ?? "null")}"}`;
    }
    
    result += "\n@\n";
    return result;
}