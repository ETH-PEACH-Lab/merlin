import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";
import util from "node:util";


/*
*/

const dsl = `
architecture a = {
	block Encoder: [
		layout: vertical,
		gap: 40,
		style: box,
		nodes: [
			add_norm0 = type: rect label: "Add & Norm" color: "#F3F4C6" style: rounded size: (110, 25),
			feed_forward = type: rect label: "Feed Forward" color: "#CAE7F5" style: rounded size: (110, 35),
			add_norm1 = type: rect label: "Add & Norm" color: "#F3F4C6" style: rounded size: (110, 25),
			multi_head_attention = type: rect label: "Multi-Head Attention" color: "#FAE3C0" style: rounded size: (110, 35),
			plus = type: circle label: "+" size: (2, 2),
		    positional_encoding = type: circle label: "PE" annotation.left: "Positional Encoding" size: (40, 40),
			input_embedding = type: rect label: "Input Embedding" style: rounded color: "#F8E1E2",
			inputs = type: text label: "inputs"
		],
		edges: [
			e1 = multi_head_attention.top -> add_norm1.bottom arrowheads: 0,
			e2 = add_norm1.top -> feed_forward.bottom,
			e3 = e2.mid -> add_norm0.left style: bow,
			e4 = feed_forward.top -> add_norm0.bottom style: straight arrowheads: 0,
			e5 = input_embedding.top -> plus.bottom,
			e6 = plus.top -> multi_head_attention.bottom arrowheads: 3,
			e7 = inputs.top -> input_embedding.bottom,
			e8 = e6.mid -> add_norm1.left style: bow,
			e9 = positional_encoding.right -> plus.left arrowheads: 0
		],
		groups: [
			row1 = members: [add_norm0, feed_forward] layout: vertical gap: 5,
			row2 = members: [add_norm1, multi_head_attention] layout: vertical gap: 5,
			row3 = members: [row1, row2] layout: vertical gap: 40 color: "#F3F3F4" annotation.left: "Nx",
			row4 = members: [positional_encoding, plus] anchor: plus,
			row5 = members: [row4, input_embedding] layout: vertical gap: 10
		]
	],
	block Decoder: [
		layout: vertical,
		gap: 40,
		style: box,
		nodes: [
			output = type: text label: "Output Probabilities",
			softmax = type: rect label: "Softmax" color: "#D1E6D1" style: rounded size: (110, 25),
			linear = type: rect label: "Linear" color: "#DCDFEE" style: rounded size: (110, 25),
			add_norm0 = type: rect label: "Add & Norm" color: "#F3F4C6" style: rounded size: (110, 25),
			feed_forward = type: rect label: "Feed Forward" color: "#CAE7F5" style: rounded size: (110, 35),
			add_norm1 = type: rect label: "Add & Norm" color: "#F3F4C6" style: rounded size: (110, 25),
			multi_head_attention = type: rect label: "Multi-Head Attention" color: "#FAE3C0" style: rounded size: (110, 35),
			add_norm2 = type: rect label: "Add & Norm" color: "#F3F4C6" style: rounded size: (110, 25),
			masked_multi_head_attention = type: rect label: "Masked Multi-Head Attention" color: "#FAE3C0" style: rounded size: (110, 55),
			plus = type: circle label: "+" size: (2, 2),
			positional_encoding = type: circle label: "PE" annotation.right: "Positional Encoding" style: rounded size: (40,40),
			output_embedding = type: rect label: "Output Embedding" color: "#F8E1E2" style: rounded size: (110, 35),
			outputs = type: text label: "Outputs" annotation.bottom: "(shifted right)"
		],
		edges: [
			e1 = feed_forward.top -> add_norm0.bottom arrowheads: 0,
			e2 = multi_head_attention.top -> add_norm1.bottom arrowheads: 0,
			e3 = masked_multi_head_attention.top -> add_norm2.bottom arrowheads: 0,
			e4 = add_norm1.top -> feed_forward.bottom,
			e5 = e4.mid -> add_norm0.right style: bow,
			e6 = add_norm2.top -> multi_head_attention.bottom[2],
			e7 = e6.mid -> add_norm1.right style: bow,
			e8 = add_norm0.top -> linear.bottom,
			e9 = linear.top -> softmax.bottom,
			e10 = softmax.top -> output.bottom,
			e11 = plus.right -> positional_encoding.left arrowheads: 0,
			e12 = plus.top -> masked_multi_head_attention.bottom arrowheads: 3,
			e13 = outputs.top -> output_embedding.bottom,
			e14 = output_embedding.top -> plus.bottom,
            e15 = e12.mid -> add_norm2.right style: bow
		],
		groups: [
			row0 = members: [output, softmax, linear] layout: vertical,
			row1 = members: [add_norm0, feed_forward] layout: vertical gap: 5,
			row2 = members: [add_norm1, multi_head_attention] layout: vertical gap: 5,
			row3 = members: [add_norm2, masked_multi_head_attention] layout: vertical gap: 5,
			row4 = members: [row1, row2, row3] layout: vertical gap: 30 color: "#F3F3F4" annotation.right: "Nx",
            row6 = members: [row0, row4] layout: vertical,
			row5 = members: [plus, positional_encoding] anchor: plus,
			row7 = members: [row5, output_embedding] layout: vertical gap: 10
         
		]
	],
	diagram: [
		gap: 0,
		uses: [e = Encoder, d = Decoder],
		connects: [
			e.add_norm0.top -> d.multi_head_attention.bottom[1] style: bow arrowheads: 2
		]
	]
}

page
show a








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


