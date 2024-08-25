import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `data:
tree tr1 = {
structure:[[n1],[n1,n2],[n1,n2,n3],[n1,n2,n3,n4],[n1,n2,n3,n4,n5]]
color:[[blue],[null,blue],[null,null,blue]]
}
draw:
page p := [0,3] {
    show tr1[p]
}`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
