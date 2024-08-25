import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `data: 
graph gp = {
id: [[node1,node2,node3,node4],*,*]
edge:[[(node1,node2),(node1,node4)],*,*]
value:[[1,2,3,4],*,*]
color: [[blue,blue,blue,red],*,*]
}
array ar = {
structure: [[1],[1,2,3],[1,2,3,4]]
color: [[blue,red],[green],*,[black,white,grey]]
}
draw:
page p := [0,1] {
show matrix[1]
show arr[p+4]
}`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
