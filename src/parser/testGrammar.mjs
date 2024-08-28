import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `data:
graph dfs = {
    id:[[n1,n2,n3,n4,n5,n6,n7,n8]]
    edge:[[(n1,n2)]]
}
draw:
page p:=[0,5] {
show dfs[p]
}`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
