import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";
import util from "node:util";

/*
 */

const dsl = `
architecture a = {
	block Traditional: [
		layout: vertical,
		fontFamily: "Helvetica",
		nodes: [
			empty0 = type: rect color: "transparent" stroke.color: "transparent",
			conv0 = type: rect label.text: "Conv" size: (125, 24) shape: rounded color: "#D7E9FD" stroke.color: "#879DC3",
			batch_norm0 = type: rect label.text: "BatchNorm" size: (125, 24) shape: rounded color: "#D0EAD2" stroke.color: "#97BE82",
			relu0 = type: rect label.text: "ReLU" size: (125, 24) shape: rounded color: "#FFF3C8" stroke.color: "#D9C374",
			conv1 = type: rect label.text: "Conv" size: (125, 24) shape: rounded color: "#D7E9FD" stroke.color: "#879DC3",
			batch_norm1 = type: rect label.text: "BatchNorm" size: (125, 24) shape: rounded color: "#D0EAD2" stroke.color: "#97BE82",
			plus = type: circle label.text: "+" label.fontSize: 20 label.fontWeight: 100 size: (20, 20),
			relu1 = type: rect label.text: "ReLU" size: (125, 24) shape: rounded color: "#FFF3C8" stroke.color: "#D9C374",
			empty1 = type: rect color: "transparent" stroke.color: "transparent"
		],
		edges: [
			e0 = empty0.bottom -> conv0.top shape: straight,
			e1 = conv0.bottom -> batch_norm0.top shape: straight,
			e2 = batch_norm0.bottom -> relu0.top shape: straight,
			e3 = relu0.bottom -> conv1.top shape: straight,
			e4 = conv1.bottom -> batch_norm1.top shape: straight,
			e5 = batch_norm1.bottom -> plus.top shape: straight,
			e6 = plus.bottom -> relu1.top shape: straight,
			e8 = e0.mid -> plus.right shape: bow curveHeight: -1 width: 3 color: "red",
			e9 = relu1.bottom -> empty1.top shape: straight
		],
		annotation.bottom: "(a) Traditional",
		annotation.fontFamily: "Times New Roman",
		annotation.fontWeight: 500,
		annotation.fontSize: 15,
        annotation.gap: -40
	],
	block Shortened: [
		layout: vertical,
		fontFamily: "Helvetica",
		nodes: [
			empty0 = type: rect color: "transparent" stroke.color: "transparent",
			conv0 = type: rect label.text: "Conv" size: (125, 24) shape: rounded color: "#D7E9FD" stroke.color: "#879DC3",
			batch_norm0 = type: rect label.text: "BatchNorm" size: (125, 24) shape: rounded color: "#D0EAD2" stroke.color: "#97BE82",
			relu0 = type: rect label.text: "ReLU" size: (125, 24) shape: rounded color: "#FFF3C8" stroke.color: "#D9C374",
			plus0 = type: circle label.text: "+" label.fontSize: 20 label.fontWeight: 100 size: (20, 20),
			conv1 = type: rect label.text: "Conv" size: (125, 24) shape: rounded color: "#D7E9FD" stroke.color: "#879DC3",
			batch_norm1 = type: rect label.text: "BatchNorm" size: (125, 24) shape: rounded color: "#D0EAD2" stroke.color: "#97BE82",
			relu1 = type: rect label.text: "ReLU" size: (125, 24) shape: rounded color: "#FFF3C8" stroke.color: "#D9C374",
			plus1 = type: circle label.text: "+" label.fontSize: 20 label.fontWeight: 100 size: (20, 20),
			empty1 = type: rect size: (0, -3) color: "transparent" stroke.color: "transparent"
		],
		edges: [
			e0 = empty0.bottom -> conv0.top shape: straight,
			e1 = conv0.bottom -> batch_norm0.top shape: straight,
			e2 = batch_norm0.bottom -> relu0.top shape: straight,
			e3 = relu0.bottom -> plus0.top shape: straight,
			e7 = plus0.bottom -> conv1.top shape: straight,
			e4 = conv1.bottom -> batch_norm1.top shape: straight,
			e5 = batch_norm1.bottom -> relu1.top shape: straight,
			e6 = relu1.bottom -> plus1.top shape: straight,
			e8 = e0.mid -> plus0.right shape: bow curveHeight: -1 width: 3 color: "red",
			e9 = plus1.bottom -> empty1.top shape: straight,
			e10 = e7.mid -> plus1.right shape: bow curveHeight: -1 width: 3 color: "red"
		],
		annotation.bottom: "(b) Shortened",
		annotation.fontFamily: "Times New Roman",
		annotation.fontWeight: 500,
		annotation.fontSize: 15,
		annotation.gap: 0
	],
	block None: [
		layout: vertical,
		fontFamily: "Helvetica",
		nodes: [
			empty0 = type: rect color: "transparent" stroke.color: "transparent",
			conv0 = type: rect label.text: "Conv" size: (125, 24) shape: rounded color: "#D7E9FD" stroke.color: "#879DC3",
			batch_norm0 = type: rect label.text: "BatchNorm" size: (125, 24) shape: rounded color: "#D0EAD2" stroke.color: "#97BE82",
			relu0 = type: rect label.text: "ReLU" size: (125, 24) shape: rounded color: "#FFF3C8" stroke.color: "#D9C374",
			conv1 = type: rect label.text: "Conv" size: (125, 24) shape: rounded color: "#D7E9FD" stroke.color: "#879DC3",
			batch_norm1 = type: rect label.text: "BatchNorm" size: (125, 24) shape: rounded color: "#D0EAD2" stroke.color: "#97BE82",
			relu1 = type: rect label.text: "ReLU" size: (125, 24) shape: rounded color: "#FFF3C8" stroke.color: "#D9C374",
			empty1 = type: rect size: (0, 80) color: "transparent" stroke.color: "transparent"
		],
		edges: [
			e0 = empty0.bottom -> conv0.top shape: straight,
			e1 = conv0.bottom -> batch_norm0.top shape: straight,
			e2 = batch_norm0.bottom -> relu0.top shape: straight,
			e3 = relu0.bottom -> conv1.top shape: straight,
			e4 = conv1.bottom -> batch_norm1.top shape: straight,
			e5 = batch_norm1.bottom -> relu1.top shape: straight,
			e9 = relu1.bottom -> empty1.top shape: straight
		],
		annotation.bottom: "(c) None",
		annotation.fontFamily: "Times New Roman",
		annotation.fontWeight: 500,
		annotation.fontSize: 15,
		annotation.gap: -48
	],
	diagram: [
		layout: horizontal,
		uses: [t = Traditional anchor: conv1, s = Shortened anchor: conv1, n = None anchor: conv1],
		gap: 30
	]
}


page
show a



`;

const parsed = parseText(dsl);

//console.log("PARSED:")
console.log(util.inspect(parsed, { depth: null, colors: true }));

const result = compiler(parsed);

console.log("RESULT:");
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






*/
