import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";

const dsl = `
neuralnetwork nn = {
  layers: [1, 2]
	showLabels: true
	labelPosition: "bottom"
	showWeights: true
	showArrowheads: true
}


page
show nn

page
nn.addNeurons(0, ["x", "y"])
nn.addNeurons(3, ["x", "y"])








`;

const parsed = parseText(dsl);

const result = compiler(parsed);

//console.log(result);

/*


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
