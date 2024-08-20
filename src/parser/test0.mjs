import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `data: 
array arr1 = {
 structure: [[1],[1,2],[1,2,3],[1,2,3,4]]
}
array arr2 = {
 structure: [[1],[1,2],[1,2,3],[1,2,3,4]]
}
array arr3 = {
 structure: [[1],[1,2],[1,2,3],[1,2,3,4]]
}
draw:
page p:=[0,3] {
show arr1[p]
}
 `;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
