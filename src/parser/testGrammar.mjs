import nearley from 'nearley';
import grammar from './parser.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `// Graph - Network connectivity
graph network = {
  nodes: [server1, server2, server3, router]
  value: [100, 50, 75, 200]
  edges: [server1-router, server2-router, server3-router]
  arrow: ["start", null, null, "hub"]
  color: [null, null, null, "blue"]
  hidden: [false, false, false, false]
}

page
show network
network.setHidden(0, false)

page
network.addNode(client, 25)
network.addEdge(client-router)
network.setColor(4, "green")

page
network.removeEdge(server2-router)
network.setColor(1, "red")
network.setArrow(1, "offline")

page
network.setColor(2, "orange")
network.setValue(2, 90)
network.setArrow(2, "high load")`;
	
parser.feed(input);
const parsedData = parser.results[0];  // Parsed output


console.log(JSON.stringify(parsedData, null, 2));
console.log(`We got ${parser.results.length} results from parsing.`);

// Second exampl
