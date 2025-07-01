import { formatPositionForOutput } from '../positionUtils.mjs';

export function generateLinkedlist(linkedListComponent, layout = [3, 3]) {
    let result = "linkedlist\n";
    
    // Add position information if available
    result += formatPositionForOutput(linkedListComponent.position, layout);
    
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