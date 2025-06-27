import nearley from 'nearley';
import grammar from './parser.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `// Test matrix with addRow and addColumn with arrays
matrix testMatrix = {
  value: [[1, 2], [3, 4]]
}

page
show testMatrix

page
testMatrix.addRow([5, 6])

page  
testMatrix.addColumn([7, 8, 9])`;
	
parser.feed(input);
const parsedData = parser.results[0];  // Parsed output


console.log(JSON.stringify(parsedData, null, 2));
console.log(`We got ${parser.results.length} results from parsing.`);

// Second exampl
