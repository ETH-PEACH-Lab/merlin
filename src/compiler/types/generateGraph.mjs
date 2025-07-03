import { formatNodeName, formatNullValue } from '../compiler.mjs';
import { formatPositionForOutput } from '../positionUtils.mjs';

export function generateGraph(graphComponent, layout = [3, 3]) {
    let result = "graph\n";
    
    // Add position information if available
    result += formatPositionForOutput(graphComponent.position, layout);
    
    result += "@";
    const nodes = graphComponent.body.nodes || [];
    const edges = graphComponent.body.edges || [];
    const value = graphComponent.body.value || [];
    const color = graphComponent.body.color || [];
    const arrow = graphComponent.body.arrow || [];
    const hidden = graphComponent.body.hidden || [];

    for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        if (!node) continue; // Skip null nodes
        
        const nodeValue = idx < value.length ? value[idx] : null;
        const nodeColor = idx < color.length ? color[idx] : null;
        const nodeArrow = idx < arrow.length ? arrow[idx] : null;
        const nodeHidden = idx < hidden.length ? hidden[idx] : null;
        
        result += `\nnode:${formatNodeName(node)} {value:"${formatNullValue(nodeValue) || node}", color:"${formatNullValue(nodeColor)}", arrow:"${nodeArrow === `empty` ? "" : formatNullValue(nodeArrow)}", hidden:"${formatNullValue(nodeHidden)}"}`;
    }

    for (const edge of edges) {
        result += `\nedge:(${formatNodeName(edge.start)},${formatNodeName(edge.end)})`;
    }
    result += "\n@\n";
    return result;
}