import nearley from 'nearley';
import grammar from './parser.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `graph graph1 = {
	nodes: [n1,n2,n3,n4,n5,n6,n7]
	value: [1,2,3,4,5,6,7]
	color: [null,null,"blue",null,"blue"]
	edges: [n1-n2,n2-n3,n3-n4,n4-n5,n5-n6,n6-n7]
	arrow: [null,null,"important",null,null]
}

page
show graph1
graph1.addEdge(n1-n2)`;
	
parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
