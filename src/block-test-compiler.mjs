import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";
import util from "node:util";


/*
*/

const dsl = `
architecture a = {
  title: "Hello"

  block Encoder: [
    layout: horizontal,
    gap: 16,
    style: rounded,
    annotation.top: "hello",

    nodes: [
      in0 = type: text label: "Input Image" opLabel: "OPLABEL"  opLabelSubtext: "opLabelSubtext" color: "yellow",
      s0 = type: stacked shape: 8x128x128 kernelSize: 10x10 color: "blue",
      conv1 = type: rect label: "Conv1" label.orientation: vertical labelSubtext: "7x7 stride=2, 64ch" opLabel: "OPLABEL" opLabelSubtext: "OPLABEL SUBTEXT" annotation.top: "TOP" size: (180,70) style: rounded stroke: "black",
      bn1 = type: rect label: "BatchNorm" labelSubtext: "normalize features"  stroke: "black",
      relu1 = type: rect label: "ReLU" labelSubtext: "activation" opLabel: "OPLABEL" size: (110,40) stroke: "black",
      s1 = type: stacked shape: 8x128x128 kernelSize: 10x10 label: "8@128x128" labelSubtext: "Hellod dsadasdad dasddasdasd dsadasdsa" color: "blue" size: (100, 100) annotation.top: "ANNOTATION.TOP"
      s2 = type: stacked shape: 8x64x64 kernelSize: 16x16 label: "8@64x64" labelSubtext: " dsadasdad dasddasdasd dsadasdsa dsadasd ddsadasdaddd dasdsdsdsad" opLabel: "OPLABEL" opLabelSubtext: "opLabelSubtext" color: "red"
      s3 = type: stacked shape: 24x48x48 label: "8@64x64" color: "white"
      f1 = type: flatten shape: 24x1 label: "8@128x128" labelSubtext: "Hellod dsadasdad dasddasdasd dsadasdsa" opLabel: "OPLABEL" color: "blue"
      fully1 = type: fullyConnected shape: [24, 12, 6, 3] outputLabels: ["label", "hello", "world"] label: "1x128" opLabel: "Dense" color: ["blue", "black", "red", "yellow"]
      fully2 = type: fullyConnected shape: [24, 12, 6, 3] outputLabels: ["label", "hello", "world"] label: "1x128" opLabel: "Dense" color: ["blue", "black", "red", "yellow"]
    ],

    edges: [
      e4 = conv1.right -> bn1.left transition: flatten gap: 50 color: "blue"
      e3 = s1.top -> s2.left transition: featureMap
      e0 = s2.right -> s3.left 
      e1 = s3.right -> f1.left transition: flatten
      e2 = f1.top -> fully1.left transition: fullyConnected
      e5 = fully1.top -> fully2.left
    ],

    groups: [
      row0 = members: [in0, s0, conv1, bn1, relu1],
      row1 = members: [s1, s2, s3, f1, fully1] markerType: bracket markerLabel: "TESTING" markerPosition: bottom
    ]
  ]
}

page
show a

a.setNodeShape(Encoder, s1, 25x1x1)



`;
const parsed = parseText(dsl);

//console.log("PARSED:")
console.log(util.inspect(parsed, { depth: null, colors: true }));

const result = compiler(parsed);

console.log("RESULT:")
console.log(result.mermaidString);


/*
a.removeNode(Stem, conv1)
a.removeNodes(Stem, [conv1, pool1])
a.setNodeLabel(Stem, conv1, "HERE")
a.setNodeColor(Stem, conv1, "blue")
a.setNodeStroke(Stem, pool1, "yellow")
a.setNodeAnnotation(Stem, conv1, left, "VALUE")
a.setEdgeLabel(Stem, e3, "HERE")
a.setEdgeColor(Stem, e3, "blue")
a.removeEdge(Stem, e3)
a.removeEdges(Stem, [e3,e1])
a.setBlockColor(Stem, "blue")
a.setBlockAnnotation(Stem, left, "VALUE")
a.setGroupColor(Stem, row1, "red") 
a.setGroupAnnotation(Stem, conv1, left, "VALUE")  
a.hideNode(Encoder, add_norm1)
a.showNode(Encoder, add_norm1)
a.hideEdge(Encoder, e1)
a.showEdge(Encoder, e1)
a.hideBlock(Stem)
a.showBlock(Stem)




BUG: 



*/


