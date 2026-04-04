import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";
import util from "node:util";

const dsl = `
neuralnetwork nn = {
	layers: ["layer1", "hidden", "output"]
	neurons: [["null", "x1"], ["x2", "x3"], ["x4", "x5"]]
	neuronColors: [["blue", "blue"], [null, "blue"], ["blue", "red"]]
	showBias: true
	showLabels: true
	labelPosition: "bottom"
	showWeights: true
	showArrowheads: true
}

page
show nn
page
nn.setLayerColors(["blue"])









`;

const parsed = parseText(dsl);

//console.log("PARSED:")
//console.log(parsed);
//console.log(parsed.defs[0].body);

console.log(util.inspect(parsed, { depth: null, colors: true }));
const result = compiler(parsed);



/*
page
nn.setNeurons([[null, "x1"], ["x2", "x3"], ["x4", "x5"], ["x1", "x1", "x1"]])

nn.removeLayerAt(0)
nn.addLayer("colorsLayer", ["a", "b"])
nn.setNeurons([["x1", "x2"], [_, "x3"], ["x4", "x3x"]])
nn.setNeuronColors([["blue", null], [null, null], [null, "red"]])
nn.setLayerColor(1, "blue")
nn.setLayer(0, "layerNEW")
nn.setNeuron(0, 0, "x")
nn.setNeuronColor(2, 0, "yellow")
nn.removeNeuronsFromLayer(0, ["x1", "null"])
nn.setLayers([1, 2, 3])
nn.setLayerColors(["blue", "red", "red"])
nn.setNeuronColor(0, 0, "#f44336")
nn.addNeurons(3, ["x", "y"])

*/
