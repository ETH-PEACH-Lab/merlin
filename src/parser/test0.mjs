import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `[ (node1,node2),(node3,node4) ]
 `;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
