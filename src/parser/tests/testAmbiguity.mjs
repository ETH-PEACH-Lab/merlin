
import nearley from 'nearley';
import grammar from '../parser.js'; // Compiled from merlinLite.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `
array numbers = {
    value: [1, 2, 3]
    color: ["blue", "green", "red"]
    below: belowNumbers
    above: "Prime Number Sequence"
}

text belowNumbers = {
    value: "These are the first three prime numbers."
    fontSize: 14
    color: "gray"
    fontWeight: "normal"
    fontFamily: "Georgia"
    align: "center"
    lineSpacing: 10
    width: 100
    height: 40
}

graph myGraph = {
    nodes: [n1, n2, n3]
    edges: [n1-n2, n2-n3, n3-n1]
    below: "Triangle Graph Representation"
}

text randomText = {
    value: ["This graph forms a triangle,", "each node connected to the others.", "It's a simple cyclic graph."]
    fontSize: [null, 14, 13]
    color: ["#222222", "#0055aa", "#007700"]
    fontWeight: [null, "bold", "normal"]
    fontFamily: ["Helvetica", null, null]
    align: ["left", "right", "center"]
    lineSpacing: 30
    width: 500
    height: 100
}

text randomTextToo = {
    value: "Prime numbers and graphs—fundamental math concepts!"
    fontSize: 15
    color: "#cc0000"
    fontWeight: "bold"
    fontFamily: "Courier New"
    align: "center"
    lineSpacing: 14
    width: 300
    height: 40
}

page 2x2
show numbers (0,0)
show myGraph (0,1)
show randomText (1,1)
show randomTextToo
`;

try {
  parser.feed(input);
  console.log(JSON.stringify(parser.results, null, 2));
  console.log('We got ' + parser.results.length + ' results from parsing.');
  if (parser.results.length > 1) {
    console.log('Ambiguity detected!');
  }
} catch (e) {
  console.error('Parsing error:', e.message);
}
