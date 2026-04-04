import parseText from "./parser/parseText.mjs";
import compiler from "./compiler/compiler.mjs";
import util from "node:util";



const dsl = `
architecture a = {
  title: "Hello"

  block Encoder: [
    layout: vertical,
    gap: 40,
    color: "yellow",
    style: box,
    annotation.top: "hello",

    nodes: [
      add_norm1 = type: rect label: "Add & Norm" label.orientation: vertical color: "yellow",
      feed_forward = type: rect label: "Feed Forward" color: "blue",
      add_norm2 = type: rect label: "Add & Norm" color: "yellow",
      multi_head_attention = type: rect label: "Multi-Head Attention" color: "green",
      plus = type: circle label: "+",
      input_embedding = type: rect label: "Input Embedding",
      inputs = type: text label: "inputs",
      positional_encoding = type: circle label: "PE"
    ],

    edges: [
      e1 = multi_head_attention.top -> add_norm2.bottom arrowheads: 0,
      e2 = add_norm2.top -> feed_forward.bottom,
      e3 = e2.mid -> add_norm1.left style: bow,
      e4 = feed_forward.top -> add_norm1.bottom style: straight arrowheads: 0,
      e5 = input_embedding.top -> plus.bottom,
      e6 = plus.top -> multi_head_attention.bottom arrowheads: 2,
      e7 = inputs.top -> input_embedding.bottom,
      e8 = e6.mid -> add_norm2.left style: bow
    ],

    groups: [
      row1 = members: [add_norm1, feed_forward] layout: vertical gap: 10,
      row2 = members: [add_norm2, multi_head_attention] layout: vertical gap: 10,
      row3 = members: [row1, row2] layout: vertical gap: 40 color: "grey" annotation.top: "Nx" annotation.left: "Nx",
      row4 = members: [positional_encoding, plus] anchor: plus
    ]
  ],

  block Decoder: [
    layout: vertical,
    gap: 40,
    color: "yellow",
    style: box,

    nodes: [
      add_norm0 = type: rect label: "Add & Norm" color: "yellow",
      feed_forward = type: rect label: "Feed Forward" color: "blue",
      add_norm1 = type: rect label: "Add & Norm" color: "yellow",
      multi_head_attention = type: rect label: "Multi-Head Attention" color: "green",
      add_norm2 = type: rect label: "Add & Norm" color: "yellow",
      masked_multi_head_attention = type: rect label: "Masked Multi-Head Attention" label.orientation: vertical color: "green"
    ],

    edges: [
      e1 = feed_forward.top -> add_norm0.bottom color: "yellow" arrowheads: 0,
      e2 = multi_head_attention.top -> add_norm1.bottom arrowheads: 0,
      e3 = masked_multi_head_attention.top -> add_norm2.bottom arrowheads: 0,
      e4 = add_norm1.top -> feed_forward.bottom,
      e5 = e4.mid -> add_norm0.right style: bow,
      e6 = add_norm2.top -> multi_head_attention.bottom[2],
      e7 = e6.mid -> add_norm1.right style: bow
    ],

    groups: [
      row1 = members: [add_norm0, feed_forward] layout: vertical gap: 10 color: "grey",
      row2 = members: [add_norm1, multi_head_attention] layout: vertical gap: 10 color: "grey",
      row3 = members: [add_norm2, masked_multi_head_attention] layout: vertical gap: 10 color: "grey"
    ]
  ],

  diagram: [
    gap: 15,
    uses: [e = Encoder, d = Decoder],
    connects: [
      e.add_norm1.top -> d.multi_head_attention.bottom[1] style: bow arrowheads: 2
    ]
  ]
}

page
show a
a.removeBlock(Encoder)


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


