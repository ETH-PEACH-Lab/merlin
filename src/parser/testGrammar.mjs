import nearley from 'nearley';
import grammar from './parser.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `array arr1 = {
	value: [1,2,3,4,5,6,7]
	color: [null,null,"blue",null,"blue"]
	arrow: [null,null,"important",null,null]
}

array arr2 = {
	value: [3,3,3,3,3,3]
}

page
show arr1
arr1.setColor(4, "blue")
arr1.setValue(0, 4)
page
// arr1.reset()
arr1.setColor(0, "green")
arr1.setValues([2,_,4,_,_,_,_])
show arr2`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
