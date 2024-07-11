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
  console.log('variables: ', variables);
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
