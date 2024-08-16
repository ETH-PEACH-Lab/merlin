import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
data: 
array cd = {
structure : [[paris,2024,olmpics], *]
color : [[blue,null],*]
}

draw:
page p:= [1,2] {
    show cd[i]
}
`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
