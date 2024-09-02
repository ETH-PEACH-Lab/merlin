import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `data:
graph gh = {
id:[[n1],[n1,n2],[n1,n2,n3],[n1,n2,n3,n4]]
value:[[1],[1,2],[1,2,3],[1,2,3,4]]
edge:[[(n1,n2)]]
}
draw:
page p := [0,2] {
show gh[p]
}`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
