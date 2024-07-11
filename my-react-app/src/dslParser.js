// src/dslParser.js

export const parseDSL = (dsl) => {
  const variableRegex = /^(\w+)\s*=\s*(\[.*?\])$/;
  const variables = {};

  const lines = dsl.split('\n').map(line => line.trim());
  lines.forEach(line => {
    const match = line.match(variableRegex);
    if (match) {
      // console.log('match:', match);
      const [, variable, value] = match;
      let parsedArray = JSON.parse(value);
      console.log('parserdArray:', parsedArray);

      variables[variable] = parsedArray;
    }
  });

  return variables;
};

export const convertToMermaid = (variables) => {
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
