import nearley from 'nearley';
import grammar from './parser.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `

matrix mr1 = {
  value: [[1,0,"x",0],
  [0,0,"x",2],
  [0,"x",0,0],
  [0,0,0,0]
]
  color: [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
  arrow: [["start",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}

page
show mr1

page
mr1.setColors([[null,null,"red",null],[null,null,"red",null],[null,"red",null,null],[null,null,null,null]])

page
mr1.setColor(0,0,"blue")
mr1.setArrow(0,0,null)

page
mr1.setValue(0,1,1)
mr1.setColor(0,1,"blue")

page
mr1.setValue(1,1,2)
mr1.setColor(1,1,"blue")

page
mr1.setValue(1,0,1)
mr1.setColor(1,0,"blue")

page
mr1.setValue(2,0,2)
mr1.setColor(2,0,"blue")

page
mr1.setValue(3,0,3)
mr1.setColor(3,0,"blue")

page
mr1.setValue(3,1,4)
mr1.setColor(3,1,"blue")

page
mr1.setValue(3,2,5)
mr1.setColor(3,2,"blue")

page
mr1.setValue(2,2,5)
mr1.setColor(2,2,"blue")

page
mr1.setValue(3,3,6)
mr1.setColor(3,3,"blue")

page
mr1.setValue(2,3,7)
mr1.setColor(2,3,"blue")

page
mr1.setValue(1,3,8)
mr1.setColor(1,3,"green")
mr1.setArrow(1,3,"finish")


`;
	
parser.feed(input);
const parsedData = parser.results[0];  // Parsed output


console.log(JSON.stringify(parsedData, null, 2));
console.log(`We got ${parser.results.length} results from parsing.`);

// Second exampl
