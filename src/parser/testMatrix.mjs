import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
data: 
matrix matrix = {
structure : [[[9,8,7,6,5],[4,3,2], [1]], [[1,2],[3,4]], *, *]
color : [[[blue,red],[blue, green]],*]
}
array ar = {
structure : [[1],[1,2,3],[1,2,3,4]]
color : [[blue, red], [green], *, [black, white, grey]]
}

draw:
page p := [0,1] {
show matrix[1]
show arr[p+4]
}
`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
