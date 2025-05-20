export function generateTree(treeComponent) {
    let result = "tree\n@";

    const structure = treeComponent.attributes.structure;
    const value = treeComponent.attributes.value || [];
    const color = treeComponent.attributes.color || [];
    const arrow = treeComponent.attributes.arrow || [];
    // for (let i = 0; i < structure.length ; i++) {
    //     result += `${structure[i]} {value:"${value[i] || structure[i]}", color:"${color[i] || ""}", arrow:"${arrow[i] || ""}"}\n`;
    //   }
    // console.log("tree arrow\n", console.log(arrow));

    result += convertArrayToBinaryTree(structure, value, color, arrow);

    result += "\n@\n";
    return result;
}

function convertArrayToBinaryTree(structure, value, color, arrow) {
    if (!structure || structure.length === 0) return '';
  
    let queue = [{ node: structure[0], index: 0 }];
    
    let result = "";
  
    while (queue.length > 0) {
        let current = queue.shift();
        let node = current.node;
        let index = current.index;
  
        if (node === 'none') {
            result += `\nNone:[None,None]`;
        } else {
            let leftIndex = 2 * index + 1;
            let rightIndex = 2 * index + 2;
            
            let leftChild = (leftIndex < structure.length && structure[leftIndex] !== 'none') ? structure[leftIndex] : 'None';
            let rightChild = (rightIndex < structure.length && structure[rightIndex] !== 'none') ? structure[rightIndex] : 'None';
            
            //TODO edit how to generate tree
            result += `\n${node}:[${leftChild},${rightChild}]`;
            result += `{value:"${value[index] || node }"`;
            result += `, color:"${color[index] || "null"}"`;
            result += `, arrow:"${ arrow[index] === `empty` ? "" : arrow[index] || "null"}"`;
            result += `}`;
  
            if (leftChild !== 'None') {
                queue.push({ node: leftChild, index: leftIndex });
            }
  
            if (rightChild !== 'None') {
                queue.push({ node: rightChild, index: rightIndex });
            }
        }
    }
    console.log("compiler tree: ", result);
    return result;
  }