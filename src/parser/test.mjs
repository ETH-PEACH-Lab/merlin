import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
data: 
stack cd = {
structure : [[12,234],*,[paris,2024,olmpics]]
color : [[blue,null],*]
hidden : [[True, True], [False], *, [True, True, False]]
}
array ab = {
structure : [[a,b],[hello, world, shuwang]]
}
linkedlist ef = {
structure : [[node1,node2,node3], *, *]
}
tree tr = {
structure : [[1,None,2,3,3,4,5,None],*,*,*] 
}
draw:
page p:= [1,2] {
    show cd[i]
}
`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
