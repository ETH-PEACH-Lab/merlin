// re-construct DSL from parserd DSL

export function reconstructDSL (parserdDSL) {
    let result_string = "";
    let data_part = parserdDSL.data;
    let draw_part = parserdDSL.draw;
    // add data part
    result_string += "data:";
    data_part.forEach((compoenent) => {
        switch(compoenent.type) {
            case 'array':
                result_string += reconstructArray(compoenent);
                break;
            case 'stack':
                result_string += reconstructStack(compoenent);
                break;
            case 'tree':
                result_string += reconstructTree(compoenent);
                break;
            case 'linkedlist':
                result_string += reconstructLinkedlist(compoenent);
                break;
            case 'graph':
                result_string += reconstructGraph(compoenent);
                break;
            case 'matrix':
                result_string += reconstructMatrix(compoenent);
                break;
            default:
                console.log("reconstructDSl: no component type matching!");
        }
    });
    // add draw part
    result_string += "\ndraw:";
    draw_part.forEach((draw_entry)=> {
        result_string += `\npage ${draw_entry.page_index}:=[${draw_entry.range.start},${draw_entry.range.end}] {`;
        draw_entry.show.forEach((show_entry) => {
            result_string += `\nshow ${show_entry.component_name}[${show_entry.component_index}]`
        });
        result_string += `\n}`
    });
    return result_string;
}

function reconstructArray (parsedComponent) {
    let charToRemove = `"`;
    let regex = new RegExp(charToRemove, 'g');
    let result_string = "";
    result_string += `\narray ${parsedComponent.name} = {`;
    result_string += `\n  structure:${JSON.stringify(parsedComponent["attributes"]["structure"]).replace(regex,"")}`;
    result_string += `\n  value:${JSON.stringify(parsedComponent["attributes"]["value"]).replace(regex,"")}`;
    result_string += `\n  color:${JSON.stringify(parsedComponent["attributes"]["color"]).replace(regex,"")}`;
    result_string += `\n  arrow:${JSON.stringify(parsedComponent["attributes"]["arrow"]).replace(regex,"")}`;
    result_string += `\n  hidden:${JSON.stringify(parsedComponent["attributes"]["hidden"]).replace(regex,"")}`;
    result_string += `\n}`
    return result_string;
}

function reconstructTree (parsedComponent) {
    let charToRemove = `"`;
    let regex = new RegExp(charToRemove, 'g');
    let result_string = "";
    result_string += `\ntree ${parsedComponent.name} = {`;
    result_string += `\n  structure:${JSON.stringify(parsedComponent["attributes"]["structure"]).replace(regex,"")}`;
    result_string += `\n  value:${JSON.stringify(parsedComponent["attributes"]["value"]).replace(regex,"")}`;
    result_string += `\n  color:${JSON.stringify(parsedComponent["attributes"]["color"]).replace(regex,"")}`;
    result_string += `\n  arrow:${JSON.stringify(parsedComponent["attributes"]["arrow"]).replace(regex,"")}`;
    result_string += `\n  hidden:${JSON.stringify(parsedComponent["attributes"]["hidden"]).replace(regex,"")}`;
    result_string += `\n}`
    return result_string;
}

function reconstructStack (parsedComponent) {
    let charToRemove = `"`;
    let regex = new RegExp(charToRemove, 'g');
    let result_string = "";
    result_string += `\nstack ${parsedComponent.name} = {`;
    result_string += `\n  structure:${JSON.stringify(parsedComponent["attributes"]["structure"]).replace(regex,"")}`;
    result_string += `\n  value:${JSON.stringify(parsedComponent["attributes"]["value"]).replace(regex,"")}`;
    result_string += `\n  color:${JSON.stringify(parsedComponent["attributes"]["color"]).replace(regex,"")}`;
    result_string += `\n  arrow:${JSON.stringify(parsedComponent["attributes"]["arrow"]).replace(regex,"")}`;
    result_string += `\n  hidden:${JSON.stringify(parsedComponent["attributes"]["hidden"]).replace(regex,"")}`;
    result_string += `\n}`
    return result_string;
}

function reconstructLinkedlist (parsedComponent) {
    let charToRemove = `"`;
    let regex = new RegExp(charToRemove, 'g');
    let result_string = "";
    result_string += `\nlinkedlist ${parsedComponent.name} = {`;
    result_string += `\n  structure:${JSON.stringify(parsedComponent["attributes"]["structure"]).replace(regex,"")}`;
    result_string += `\n  value:${JSON.stringify(parsedComponent["attributes"]["value"]).replace(regex,"")}`;
    result_string += `\n  color:${JSON.stringify(parsedComponent["attributes"]["color"]).replace(regex,"")}`;
    result_string += `\n  arrow:${JSON.stringify(parsedComponent["attributes"]["arrow"]).replace(regex,"")}`;
    result_string += `\n  hidden:${JSON.stringify(parsedComponent["attributes"]["hidden"]).replace(regex,"")}`;
    result_string += `\n}`
    return result_string;
}

function reconstructGraph (parsedComponent) {
    let charToRemove = `"`;
    let regex = new RegExp(charToRemove, 'g');
    let result_string = "";
    result_string += `\ngraph ${parsedComponent.name} = {`;
    result_string += `\n  id:${JSON.stringify(parsedComponent["attributes"]["id"]).replace(regex,"")}`;
    // result_string += `\n  edge:${JSON.stringify(parsedComponent["attributes"]["edge"]).replace(regex,"")}`;
    let edge_string = "\n  edge:[";
    parsedComponent["attributes"]["edge"].forEach((component_edges) => {
        let edges = [];
        component_edges.forEach((edge) => {
            edges.push(`(${edge['startPoint'][0]},${edge['endPoint'][0]})`)
        });
        edges = edges.join(",");
        edge_string += `[${JSON.stringify(edges).replace(regex,"")}],`;
    });
    edge_string = edge_string.slice(0,-1) + "]";
    result_string += edge_string;
    result_string += `\n  value:${JSON.stringify(parsedComponent["attributes"]["value"]).replace(regex,"")}`;
    result_string += `\n  color:${JSON.stringify(parsedComponent["attributes"]["color"]).replace(regex,"")}`;
    result_string += `\n  arrow:${JSON.stringify(parsedComponent["attributes"]["arrow"]).replace(regex,"")}`;
    result_string += `\n  hidden:${JSON.stringify(parsedComponent["attributes"]["hidden"]).replace(regex,"")}`;
    result_string += `\n}`
    return result_string;
}

function reconstructMatrix(parsedComponent) {
    let charToRemove = `"`;
    let regex = new RegExp(charToRemove, 'g');
    let result_string = "";
    result_string += `\nmatrix ${parsedComponent.name} = {`;
    result_string += `\n  structure:${JSON.stringify(parsedComponent["attributes"]["structure"]).replace(regex,"")}`;
    result_string += `\n  value:${JSON.stringify(parsedComponent["attributes"]["value"]).replace(regex,"")}`;
    result_string += `\n  color:${JSON.stringify(parsedComponent["attributes"]["color"]).replace(regex,"")}`;
    result_string += `\n  arrow:${JSON.stringify(parsedComponent["attributes"]["arrow"]).replace(regex,"")}`;
    result_string += `\n  hidden:${JSON.stringify(parsedComponent["attributes"]["hidden"]).replace(regex,"")}`;
    result_string += `\n}`
    return result_string;
}