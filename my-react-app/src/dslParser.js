function handleRepeat(inputStr) {
  let trimmedStr = inputStr.replace(/\s+/g, '');
  let inputArr = trimmedStr.slice(1, -1).split(/,(?![^\[]*\])/);
  let resultArr = [];
  let lastElement;

  for (let i = 0; i < inputArr.length; i++) {
      if (inputArr[i] === '*') {
          resultArr.push(lastElement);
      } else {
          resultArr.push(inputArr[i]);
          lastElement = inputArr[i];
      }
  }

  return `[${resultArr.join(',')}]`;
}


export const parseDSL = (dsl) => {
  const variableRegex = /^(\w+)\s*=\s*(\[.*?\])$/;
  const variables = {};

  const lines = dsl.split('\n').map(line => line.trim());
  lines.forEach(line => {
    const match = line.match(variableRegex);
    if (match) {
      // console.log('match:', match);
      const [, variable, value] = match;
      let processed_value = handleRepeat(value);
      // value is a string [[1],[1,2,3,4,5]]
      // console.log('value: ', value);
      let parsedArray = JSON.parse(processed_value);
      // console.log('parseredArray:', parsedArray);
      variables[variable] = parsedArray;
    }
  });

  return variables;
};

export const convertToMermaid = (variables) => {
  console.log('dslParser variables: ', variables);
  const mermaidLines = ['visslides'];

  const pages = {};

  Object.values(variables).forEach((arrays, index) => {
    arrays.forEach((array, arrayIndex) => {
      if (!pages[arrayIndex]) {
        pages[arrayIndex] = [];
      }
      pages[arrayIndex].push(array);
    });
  });

  Object.keys(pages).forEach(pageIndex => {
    mermaidLines.push('page');
    pages[pageIndex].forEach(array => {
      mermaidLines.push('array');
      array.forEach(item => mermaidLines.push(`@ ${item}`));
    });
  });

  return mermaidLines.join('\n');
};

export const convertToMermaidNearley = (variables) => {
  console.log('convertToMermaidNearley variables: ', variables);
  let result = "visual\n";
  let pageNum = 0;

  // Determine the maximum page number based on the longest value array in variables
  variables.forEach(obj => {
    if (obj.value.length > pageNum) {
      pageNum = obj.value.length;
    }
  });

  // Loop through each page number
  for (let i = 0; i < pageNum; i++) {
    result += "page\n";

    variables.forEach(item => {
      switch (item.type) {
        case "array":
          if (item.value[i]) {
            result += "array\n";
            item.value[i].forEach(value => {
              result += `@ ${value}\n`;
            });
          }
          break;

        case "linkedlist":
          if (item.value[i]) {
            result += "linkedList\n";
            item.value[i].forEach(node => {
              result += `@ ${node}\n`;
            });
          }
          break;

        case "stack":
          result += "stack\nsize:6\n";  // Fixed stack size of 8
          if (item.value[i]) {
            item.value[i].forEach(value => {
              result += `@ ${value}\n`;
            });
          }
          break;

        case "tree":
          result += convertArrayToBinaryTree(item.value[i])
          break;
        default:
          break;
      }
    });
  }

  return result.trim(); // Remove the last newline character
};

function convertArrayToBinaryTree(arr) {
  if (!arr || arr.length === 0) return '';

  let result = 'tree\n@';
  let queue = [{ node: arr[0], index: 0 }];

  while (queue.length > 0) {
      let current = queue.shift();
      let node = current.node;
      let index = current.index;

      if (node === 'none') {
          result += `\nNone:[None,None]`;
      } else {
          let leftIndex = 2 * index + 1;
          let rightIndex = 2 * index + 2;
          
          let leftChild = (leftIndex < arr.length && arr[leftIndex] !== 'none') ? arr[leftIndex] : 'None';
          let rightChild = (rightIndex < arr.length && arr[rightIndex] !== 'none') ? arr[rightIndex] : 'None';

          result += `\n${node}:[${leftChild},${rightChild}]`;

          if (leftChild !== 'None') {
              queue.push({ node: leftChild, index: leftIndex });
          }

          if (rightChild !== 'None') {
              queue.push({ node: rightChild, index: rightIndex });
          }
      }
  }

  result += '\n@';
  return result;
}