export function generateTree(treeComponent) {
    let result = "tree\n@";

    const nodes = treeComponent.body.nodes || [];
    const value = treeComponent.body.value || [];
    const color = treeComponent.body.color || [];
    const arrow = treeComponent.body.arrow || [];

    result += convertArrayToBinaryTree(nodes, value, color, arrow);

    result += "\n@\n";
    return result;
}

function convertArrayToBinaryTree(nodes, value, color, arrow) {
    if (!nodes || nodes.length === 0) return '';
  
    let queue = [{ node: nodes[0], index: 0 }];
    
    let result = "";
  
    while (queue.length > 0) {
        let current = queue.shift();
        let node = current.node;
        let index = current.index;
  
        if (node === 'none' || !node) {
            result += `\nNone:[None,None]`;
        } else {
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            
            let leftChild = (leftIndex < nodes.length && nodes[leftIndex] && nodes[leftIndex] !== 'none') ? 
                            (nodes[leftIndex].name || nodes[leftIndex]) : 'None';
            let rightChild = (rightIndex < nodes.length && nodes[rightIndex] && nodes[rightIndex] !== 'none') ? 
                             (nodes[rightIndex].name || nodes[rightIndex]) : 'None';
            
            const nodeName = node;
            result += `\n${nodeName}:[${leftChild},${rightChild}]`;
            result += `{value:"${value[index] ?? nodeName}"`;
            result += `, color:"${color[index] ?? "null"}"`;
            result += `, arrow:"${ arrow[index] === 'empty' ? "" : (arrow[index] ?? "null")}"`;
            result += `}`;
  
            if (leftChild !== 'None') {
                queue.push({ node: nodes[leftIndex], index: leftIndex });
            }
  
            if (rightChild !== 'None') {
                queue.push({ node: nodes[rightIndex], index: rightIndex });
            }
        }
    }
    return result;
}