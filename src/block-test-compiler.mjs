import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";
import util from "node:util";

/*
 */

const dsl = `
architecture a = {
	block Encoder: [
		layout: vertical,
		fontFamily: "Helvetica",
		fontWeight: 100,
		gap: 40,
		nodes: [
			add_norm0 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			feed_forward = type: rect label.text: "Feed\nForward" size: (90, 35) shape: rounded color: "#CAE7F5" stroke.color: "black" stroke.width: 2.2,
			add_norm1 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			multi_head_attention = type: rect label.text: "Multi-Head\nAttention" size: (90, 35) shape: rounded color: "#FAE3C0" stroke.color: "black" stroke.width: 2.2,
			plus = type: circle label.text: "+" label.fontSize: 20 size: (15, 15),
			positional_encoding = type: circle label.text: "∿" label.fontSize: 56 annotation.left: "Positional\nEncoding" annotation.fontFamily: "Helvetica" annotation.fontSize: 14 annotation.fontWeight: 100 size: (30, 30),
			input_embedding = type: rect label.text: "Input\nEmbedding" size: (90, 35) shape: rounded color: "#F8E1E2" stroke.color: "black" stroke.width: 2.2,
			inputs = type: text label.text: "Inputs" label.fontSize: 14
		],
		edges: [
			e1 = multi_head_attention.top -> add_norm1.bottom shape: straight arrowheads: 0,
			e2 = add_norm1.top -> feed_forward.bottom shape: straight,
			e3 = e2.mid -> add_norm0.left shape: bow,
			e4 = feed_forward.top -> add_norm0.bottom shape: straight arrowheads: 0,
			e5 = input_embedding.top -> plus.bottom shape: straight,
			e6 = plus.top -> multi_head_attention.bottom shape: straight arrowheads: 3,
			e7 = inputs.top -> input_embedding.bottom shape: straight,
			e8 = e6.mid -> add_norm1.left shape: bow,
			e9 = positional_encoding.right -> plus.left shape: straight arrowheads: 0
		],
		groups: [
			row1 = members: [add_norm0, feed_forward] layout: vertical gap: 5,
			row2 = members: [add_norm1, multi_head_attention] layout: vertical gap: 5,
			row3 = members: [row1, row2] layout: vertical gap: 40 color: "#F3F3F4" colorBoxAdjustments: (-10,-20,5,-5) stroke.color: "black" stroke.width: 2.2 shape: rounded annotation.left: "N\\\\mul" annotation.gap: 0 annotation.fontFamily: "Helvetica" annotation.fontSize: 14 annotation.fontWeight: 100,
			row4 = members: [positional_encoding, plus] gap: 12,
			row6 = members: [row3, row4] layout: vertical anchor.source: row3 anchor.target: multi_head_attention,
			row5 = members: [row6, input_embedding] layout: vertical gap: 10
		]
	],
	block Decoder: [
		layout: vertical,
		fontFamily: "Helvetica",
		fontWeight: 100,
		gap: 40,
		nodes: [
			output = type: text label.text: "Output\nProbabilities" label.fontSize: 14,
			softmax = type: rect label.text: "Softmax" size: (90, 25) shape: rounded color: "#D1E6D1" stroke.color: "black" stroke.width: 2.2,
			linear = type: rect label.text: "Linear" size: (90, 25) shape: rounded color: "#DCDFEE" stroke.color: "black" stroke.width: 2.2,
			add_norm0 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			feed_forward = type: rect label.text: "Feed\nForward" size: (90, 35) shape: rounded color: "#CAE7F5" stroke.color: "black" stroke.width: 2.2,
			add_norm1 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			multi_head_attention = type: rect label.text: "Multi-Head\nAttention" size: (90, 35) shape: rounded color: "#FAE3C0" stroke.color: "black" stroke.width: 2.2,
			add_norm2 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			masked_multi_head_attention = type: rect label.text: "Masked\nMulti-Head\nAttention" size: (90, 55) shape: rounded color: "#FAE3C0" stroke.color: "black" stroke.width: 2.2,
			plus = type: circle label.text: "+" label.fontSize: 20 size: (15, 15),
			positional_encoding = type: circle label.text: "∿" label.fontSize: 56 annotation.right: "Positional\nEncoding" annotation.fontFamily: "Helvetica" annotation.fontSize: 14 annotation.fontWeight: 100 size: (33, 33),
			output_embedding = type: rect label.text: "Output\nEmbedding" size: (90, 35) shape: rounded color: "#F8E1E2" stroke.color: "black" stroke.width: 2.2,
			outputs = type: text label.text: "Outputs\n(shifted right)" label.fontSize: 14 label.fontWeight: 100
		],
		edges: [
			e1 = feed_forward.top -> add_norm0.bottom shape: straight arrowheads: 0,
			e2 = multi_head_attention.top -> add_norm1.bottom shape: straight arrowheads: 0,
			e3 = masked_multi_head_attention.top -> add_norm2.bottom shape: straight arrowheads: 0,
			e4 = add_norm1.top -> feed_forward.bottom shape: straight,
			e5 = e4.mid -> add_norm0.right shape: bow,
			e6 = add_norm2.top[5] -> multi_head_attention.bottom[9] shape: bow,
			e7 = e6.start -> add_norm1.right shape: bow edgeAnchorOffset: [7,0],
			e8 = add_norm0.top -> linear.bottom shape: straight,
			e9 = linear.top -> softmax.bottom shape: straight,
			e10 = softmax.top -> output.bottom shape: straight,
			e11 = plus.right -> positional_encoding.left shape: straight arrowheads: 0,
			e12 = plus.top -> masked_multi_head_attention.bottom shape: straight arrowheads: 3,
			e13 = outputs.top -> output_embedding.bottom shape: straight,
			e14 = output_embedding.top -> plus.bottom shape: straight,
			e15 = e12.mid -> add_norm2.right shape: bow
		],
		groups: [
			row0 = members: [output, softmax, linear] layout: vertical gap: 25,
			row1 = members: [add_norm0, feed_forward] layout: vertical gap: 5,
			row2 = members: [add_norm1, multi_head_attention] layout: vertical gap: 5,
			row3 = members: [add_norm2, masked_multi_head_attention] layout: vertical gap: 5,
			row4 = members: [row1, row2, row3] layout: vertical gap: 30 color: "#F3F3F4" colorBoxAdjustments: (-22,-5,5,-20) stroke.color: "black" stroke.width: 2.2 shape: rounded annotation.right: "N\\\\mul" annotation.gap: 0 annotation.fontFamily: "Helvetica" annotation.fontSize: 14 annotation.fontWeight: 100,
			row6 = members: [row0, row4] layout: vertical gap: 25,
			row5 = members: [plus, positional_encoding] gap: 12,
			row8 = members: [row6, row5] layout: vertical anchor.source: plus anchor.target: masked_multi_head_attention,
			row7 = members: [row8, output_embedding] layout: vertical gap: 10
		]
	],
	diagram: [
		gap: -35,
		uses: [e = Encoder anchor: plus, d = Decoder anchor: plus],
		connects: [
			e.add_norm0.top -> d.multi_head_attention.bottom[3] shape: bow arrowheads: 2
		],
		annotation.bottom: "Figure 1: The Transformer - model architecture.",
		annotation.fontFamily: "serif",
		annotation.gap: 0,
		annotation.fontSize: 19
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
