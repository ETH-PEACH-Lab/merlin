import parseText from "./parser/parseText.mjs";              
import compiler from "./compiler/compiler.mjs";

const dsl = `
neuralnetwork nn = {
	layers: ["layer1", "hidden", "output"]
  neurons: [["null", "x1"], ["x2", "x3"], ["x4", "x5"]]
	layerColors: ["blue", null, "red"]
	neuronColors: [["blue", "blue"],[null, "blue"], ["blue", "red"]]
  showBias: true
  showLabels: true
  labelPosition: "bottom"
  showWeights: true
  showArrowheads: true
}

page
show nn

page



`;

const parsed = parseText(dsl);                

/*console.log("==== COMMANDS ====");
console.table(parsed.cmds.map(c => ({
  type: c.type,
  name: c.name,
  target: c.target,
  args: JSON.stringify(c.args),
  line: c.line,
  col: c.col,
})));*/

const result = compiler(parsed);

console.log(result);

/*
nn.setNeuronColor(0, 0, "blue")
nn.setNeuron(0, 0, "x")
nn.setLayer(0, "layerNEW")
nn.setLayerColor(0, "blue")
nn.setNeurons([["x1", "x2"], [_, "x3"], ["x4", "x3x"]])
nn.setNeuronColors([["blue", null], [null, null], [null, "red"]])
nn.setLayers([1, 2, 3])
nn.setLayerColors(["blue", "red", "red"])
nn.addNeurons(0, ["x", "y"])
nn.addLayer("LayerName", ["x", "x", "y", "neuron"])
nn.removeLayerAt(1)
nn.removeNeuronsFromLayer(0, ["x1", "null"])
*/

/*


/*





*/