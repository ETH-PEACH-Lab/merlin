import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";

const dsl = `
neuralnetwork nn = {
  layers: ["x"]
  neurons: [["x"]]
	showBias: true
	showLabels: true
	labelPosition: "bottom"
	showWeights: true
	showArrowheads: true
}


page
show nn

page
nn.addLayer("colorsLayer", ["a", "b"])
page
nn.removeNeuronsFromLayer(0, ["x"])
page
nn.removeLayerAt(0)









`;

const parsed = parseText(dsl);

const result = compiler(parsed);

console.log(result);

/*

nn.removeNeuronsFromLayer(0, ["x1", "null"])
nn.addNeurons(0, ["x", "y"])
nn.setNeuronColor(2, 0, "yellow")
nn.setNeuron(0, 0, "x")
nn.setLayers([1, 2, 3])
nn.setLayerColors(["blue", "red", "red"])
nn.setLayerColor(1, "blue")
nn.setLayer(0, "layerNEW")


BulletPROOF: 
nn.removeLayerAt(0)
nn.addLayer("colorsLayer", ["a", "b"])
nn.setNeurons([["x1", "x2"], [_, "x3"], ["x4", "x3x"]])
nn.setNeuronColors([["blue", null], [null, null], [null, "red"]])




*/
