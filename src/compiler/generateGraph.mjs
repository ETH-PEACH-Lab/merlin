export function generateGraph(graphComponent) {
    let result = "graph\n@";
    // for (const id of arrayComponent.attributes.structure) {
    //     result += `${id}\n`
    // }
    const id = graphComponent.attributes.id;
    const edges = graphComponent.attributes.edge || [];
    const value = graphComponent.attributes.value || [];
    const color = graphComponent.attributes.color || [];

    for (let idx = 0; idx < id.length; idx ++ ) {
        result += `\nnode:${id[idx]} {value:"${value[idx] || ""}", color:"${color[idx] || null}"}`;
    }

    for (const edge of edges) {
        result += `\nedge:(${edge.startPoint},${edge.endPoint})`;
    }
    result += "\n@\n";
    return result;
}