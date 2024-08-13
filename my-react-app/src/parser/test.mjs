import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
data:
stack cd = [[12,234],[12,234]]
array ab = [[a,b],[hello, world, shuwang]]
`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
