const examples = [
  {
    groupName: "Task User Study",
    items: [
      {
        id: "Task 1",
        title: "Task 1",
        userCode: `neuralnetwork nn = {

}
page
show nn
`,
      },
      {
        id: "Task 2",
        title: "Task 2",
        userCode: `architecture a = {

}
page
show a
`,
      },
      {
        id: "Task 3",
        title: "Task 3",
        userCode: `architecture a = {

}
page
show a
`,
      },
      {
        id: "Task 4",
        title: "Task 4",
        userCode: `architecture a = {

}
page
show a
`,
      },
    ],
  },
  {
    groupName: "Template",
    items: [
      {
        id: "emptyTemplate",
        title: "Empty Template",
        userCode: `page`,
      },
    ],
  },
  {
    groupName: "Single-Page Examples",
    items: [
      {
        id: "arrayExample",
        title: "Example - Array",
        userCode: `// Array - Sorting visualization
array numbers = {
	value: [64,34,25,12,22,11,90]
	color: [null,"blue",null,null,null,null,null]
	arrow: [null,null,"important",null,null,null,null]
}


page
show numbers

page
numbers.setColor(0, "green")
numbers.setColor(1, "red")
numbers.setArrows(["i","j",null,_])

page
numbers.setColor(3, "#d95000")
numbers.setValues([34,64,25,12,22,11,90])
numbers.setColors([_,"red",null,null,null,null,null])

page
numbers.insertValue(0, 0)

// Remove a certain Value
numbers.removeValue(34)

// Or remove at index
numbers.removeAt(2)

// Clear arrow and color
numbers.setColor(1, null)
numbers.setArrow(1, null)`,
      },
      {
        id: "graphExample",
        title: "Example - Graph",
        userCode: `// Graph - Network connectivity
graph network = {
	nodes: [server1,server2,server3,router]
	value: [100,50,75,200]
	edges: [server1-router,server2-router,server3-router]
	arrow: ["start",null,null,"hub"]
	color: [null,null,null,"blue"]
	hidden: [false,false,false,false]
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
network.setArrow(2, "high load")`,
      },
      {
        id: "matrixExample",
        title: "Example - Matrix",
        userCode: `// Matrix - 2D grid operations
matrix grid = {
	value: [[1, 2], [3, 4]]
	color: [[null, null], [null, "red"]]
	arrow: [[null, null],[null,"done"]]
}


page
show grid
grid.setValue(0, 1, 5)

page
grid.setColor(1, 0, "green")
grid.setValues([[3, 2], [_, 5]])
grid.insertColumn(1, [8, 9])

page
grid.setArrow(1, 1, "target")
grid.setColors([[null, "blue"], ["green", "orange"]])

page
// Dynamic resizing - setValue will expand the matrix automatically
grid.setValue(2, 2, 9)
grid.setColor(2, 2, "purple")

page
// Structural editing - Add a new row at the end
grid.addRow()
grid.setValue(3, 0, 7)
grid.setValue(3, 1, 8)
grid.setValue(3, 2, 9)

page
// Add a new column
grid.addColumn([1,2,3,4])
grid.setValues([[1, 10, 5], [3, 11, 5], [_, 12, 9], [7, 13, 9]])
grid.setColors([[null, "yellow", "blue"], ["green", "yellow", "orange"], [null, "yellow", "purple"], [null, "yellow", null]])

page
// Remove row at index 1
grid.removeRow(1)

page
// Remove column at index 2
grid.removeColumn(2)

page
// Add border around the matrix with specified value and color
// This will add a border of zeros with gray color around the matrix
grid.addBorder(0, "gray")`,
      },
      {
        id: "stackExample",
        title: "Example - Stack",
        userCode: `// Stack - Function call stack
stack callStack = {
	value: ["main", "process", "calculate"]
	color: [null, "blue", null]
	arrow: [null, null, "top"]
}


page
show callStack
callStack.setColor(0, "green")

page
callStack.setArrow(2, "peak")
callStack.setValues([_,_,"validate","execute"])`,
      },
      {
        id: "treeExample",
        title: "Example - Tree",
        userCode: `// Tree - Organizational hierarchy with dynamic restructuring
tree orgChart = {
	nodes: [CEO, CTO, CFO, LeadDev, Intern]
	value: ["Alice", "Bob", "Carol", "Dave", "Eve"]
	color: ["gold", "lightblue", "lightgreen", null, null]
	children: [CEO-CTO, CEO-CFO, CTO-LeadDev, LeadDev-Intern]
	arrow: [null,null,null,null,null]
}

page
show orgChart

page
orgChart.addChild(CFO-TechLead, "Frank")
orgChart.addChild(TechLead-Engineer, "Grace")
orgChart.setColor(TechLead, "lightcoral")
orgChart.setArrow(CEO, "CEO")

page
orgChart.setChild(CEO-TechLead)
orgChart.removeSubtree(Intern)`,
      },
      {
        id: "linkedlist",
        title: "Example - Linked List",
        userCode: `linkedlist traverse = {
  nodes: [x1, x2, x3, x4]
  value: ["first", "second", "third", "last"]
  color: [null, null, null, null]
}

page
show traverse

page
traverse.setColor(0, "blue")
traverse.setArrow(0, "visiting")

page
traverse.setColor(0, "gray")
traverse.setColor(1, "blue")
traverse.setArrow(0, "visited")
traverse.setArrow(1, "visiting")

page
traverse.setColor(1, "gray")
traverse.setColor(2, "blue")
traverse.setArrow(1, "visited")
traverse.setArrow(2, "visiting")`,
      },
      {
        id: "textAndFormattingExample",
        title: "Example - Text and Formatting",
        userCode: `array numbers = {
	value: [1, 2, 3]
	color: ["blue", "green", "red"]
	below: "belowNumbers"
	above: "Prime Number Sequence"
}
text belowNumbers = {
	value: "These are the first three prime numbers."
	fontSize: 14
	color: "gray"
	fontWeight: "normal"
	fontFamily: "Georgia"
	align: "center"
	lineSpacing: 10
	width: 100
	height: 40
}
graph myGraph = {
	nodes: [n1,n2,n3]
	edges: [n1-n2,n2-n3,n3-n1]
	below: "Triangle Graph Representation"
}
text randomText = {
	value: ["This graph forms a triangle,", "each node connected to the others.", "It's a simple cyclic graph."]
	fontSize: [null, 14, 13]
	color: ["#222222", "#0055aa", "#007700"]
	fontWeight: [null, "bold", "normal"]
	fontFamily: ["Helvetica", null, null]
	align: ["left", "right", "center"]
	lineSpacing: 30
	width: 500
	height: 100
}
text randomTextToo = {
	value: "Prime numbers and graphs—fundamental math concepts!"
	fontSize: 15
	color: "#cc0000"
	fontWeight: "bold"
	fontFamily: "Courier New"
	align: "center"
	lineSpacing: 14
	width: 300
	height: 40
}


page 2x2
show numbers (0, 0)
show myGraph (0, 1)
show randomText (1, 1)
show randomTextToo (1, 0)

`,
      },

      {
        id: "neuralNetworkExample",
        title: "Example - MLP Neural-Network",
        userCode: `neuralnetwork nn = {
	layers: ["layer1", "hidden", "output"]
	neurons: [["null", "x1"], ["x2", "x3"], ["x4", "x5"]]
	layerColors: ["blue", null, "red"]
	neuronColors: [["blue", "blue"],[null, "blue"], ["blue", "red"]]
    showBias: true
    showLabels: true
    labelPosition: bottom
    showWeights: true
    showArrowheads: true
}
page
show nn

page
nn.setNeuronColor(0, 1, "yellow")
page
nn.addLayer("newLayer0", [null, 1])
page
nn.addLayer("newLayer1", [])
page
nn.addLayer("anotherOne", [])
page
nn.addNeurons(5, ["x1", "x2"])
page
nn.addLayer("newLayer2", [null, 1])

page
nn.addNeurons(4, ["neurons"])

page
nn.addNeurons(6, ["neurons"])

page
nn.setNeuronColor(2, 0, "purple")
nn.setNeuronColor(2, 1, null)

page
nn.setNeuron(0, 1, "xNEW")

page
nn.setNeuron(1, 0, "x2NEW")
nn.setNeuron(1, 1, "x3NEW")

page
nn.setLayer(1, "hidden2")

page
nn.setLayerColor(2, "green")

page
nn.setNeurons([["x1", "x2"], [null, "x3"], ["x4", "x3x"]])

page
nn.setNeurons([["a", "b", "c"], ["d"], ["e", "f"]])

`,
      },

      {
        id: "neuralNetworkExampleTestEnv",
        title: "Example - MLP Neural-Network Without Methods",
        userCode: `neuralnetwork nn = {
	layers: ["input layer", "hidden layer 1", "hidden layer 2", "output layer"]
	neurons: [[null, null, null], [null, null, null, null], [null, null, null, null], [null]]
	layerColors: ["#E4DCBD", "#C8E3F5", "#CEE7B2", "#E6C6C0"]
    neuronColors: [["blue"]]
    showBias: true
    showLabels: true
    labelPosition: bottom
    showWeights: true
    showArrowheads: true
    edgeWidth: 0.3
    edgeColor: "red"
    layerSpacing: 125
    neuronSpacing: 125
    layerStrokes: ["#666666", "#666666", "#666666", "#666666"]

}
page
show nn
`,
      },

      {
        id: "blockExample12",
        title: "Example - CNN",
        userCode: `architecture a = {
  title: "Hello",
  block Encoder: [
    layout: horizontal,
    gap: 16,
    shape: rounded,
    annotation.top: "hello",

    nodes: [
      in0 = type: text label.text: "Input Image" opLabel.text: "opLabel.text"  opLabel.subtext: "opLabel.subtext" label.fontColor: "yellow",
      s0 = type: stacked shape: 8x128x128 kernelSize: 10x10 color: "blue",
      conv1 = type: rect label.text: "Conv1" label.orientation: (vertical,right) subLabel.text: "7x7 stride=2, 64ch" opLabel.text: "opLabel.text" opLabel.subtext: "opLabel.text SUBTEXT" annotation.top: "TOP" size: (180,70) shape: rounded stroke.color: "black",
      bn1 = type: rect label.text: "BatchNorm" subLabel.text: "normalize features" stroke.color: "black",
      relu1 = type: rect label.text: "ReLU" subLabel.text: "activation" opLabel.text: "opLabel.text" size: (110,40) stroke.color: "black",
      s1 = type: stacked shape: 8x128x128 kernelSize: 10x10 label.text: "8@128x128" subLabel.text: "subLabel.text" subLabel.fontColor: "red" subLabel.fontFamily: "math" subLabel.fontSize: 15 subLabel.fontWeight: 900 subLabel.fontStyle: italic,
      s2 = type: stacked shape: 8x64x64 kernelSize: 16x16 label.text: "8@64x64" subLabel.text: " dsadasdad dasddasdasd dsadasdsa dsadasd ddsadasdaddd dasdsdsdsad" opLabel.text: "opLabel.text" opLabel.subtext: "opLabel.subtext" color: "red",
      s3 = type: stacked shape: 24x48x48 label.text: "8@64x64" color: "white",
      f1 = type: flatten shape: 24x1 label.text: "8@128x128" subLabel.text: "Hellod dsadasdad dasddasdasd dsadasdsa" opLabel.text: "opLabel.text" color: "blue",
      fully1 = type: fullyConnected shape: [24, 12, 6, 3] outputLabels: ["label", "hello", "world"] label.text: "1x128" opLabel.text: "Dense" color: ["blue", "black", "red", "yellow"],
      fully2 = type: fullyConnected shape: [24, 12, 6, 3] outputLabels: ["label", "hello", "world"] label.text: "1x128" opLabel.text: "Dense" color: ["blue", "black", "red", "yellow"]
    ],

    edges: [
      e4 = conv1.right -> bn1.left transition: flatten gap: 50 color: "blue",
      e3 = s1.top -> s2.left transition: featureMap,
      e0 = s2.right -> s3.left,
      e1 = s3.right -> f1.left transition: flatten,
      e2 = f1.top -> fully1.left transition: fullyConnected,
      e5 = fully1.top -> fully2.left
    ],

    groups: [
      row0 = members: [in0, s0, conv1, bn1, relu1],
      row1 = members: [s1, s2, s3, f1, fully1] marker.type: bracket marker.position: bottom marker.text: "TESTING" marker.fontColor: "blue" marker.fontFamily: "math" marker.fontSize: 15 marker.fontWeight: 900 marker.fontStyle: italic
    ]
  ]
}

page
show a















`,
      },

      {
        id: "blockExample2",
        title: "Block Playground",
        userCode: `architecture a = {


}

page
show a
`,
      },

      {
        id: "blockExampleAutocomplete2",
        title: "Block Autocomplete TEST",
        userCode: `architecture a = {
    block Encoder: [
        layout: horizontal
        gap: 10
        size: (200, 100)
        color: "red"
        stroke.color: "blue"
        stroke.style: solid
        stroke.width: 15
        shape: rounded
        fontFamily: "Arial"
        fontSize: 14
        fontWeight: 100
        fontStyle: normal
        fontColor: "red"
        nodes: [
            node0 = type: rect
            node1 = type: rect
        ]
        edges: [
            e0
        ]
      



        
        
        
        


        




        
    ]
    diagram: [
        gap: 10
        layout: horizontal
        annotation.top: "text"
        rotateRight: 2
        uses: [e = Encoder]
        connects: [
            e.node0.top -> e.node0.top 
        ]

        
    ]


}

page
show a




























`,
      },
    ],
  },
  {
    groupName: "20 examples architecture",
    items: [
      {
        id: "block0",
        title: "Transformer",
        userCode: `architecture a = {
	block Encoder: [
		layout: vertical,
		fontFamily: "Helvetica",
		fontWeight: 100,
		gap: 40,
		nodes: [
			add_norm0 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			feed_forward = type: rect label.text: "Feed\\nForward" size: (90, 35) shape: rounded color: "#CAE7F5" stroke.color: "black" stroke.width: 2.2,
			add_norm1 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			multi_head_attention = type: rect label.text: "Multi-Head\\nAttention" size: (90, 35) shape: rounded color: "#FAE3C0" stroke.color: "black" stroke.width: 2.2,
			plus = type: circle label.text: "+" label.fontSize: 20 size: (15, 15),
			positional_encoding = type: circle label.text: "∿" label.fontSize: 56 annotation.left: "Positional\\nEncoding" annotation.fontFamily: "Helvetica" annotation.fontSize: 14 annotation.fontWeight: 100 size: (30, 30),
			input_embedding = type: rect label.text: "Input\\nEmbedding" size: (90, 35) shape: rounded color: "#F8E1E2" stroke.color: "black" stroke.width: 2.2,
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
			row6 = members: [row3, row4] layout: vertical anchor.source: plus anchor.target: multi_head_attention,
			row5 = members: [row6, input_embedding] layout: vertical gap: 10
		]
	],
	block Decoder: [
		layout: vertical,
		fontFamily: "Helvetica",
		fontWeight: 100,
		gap: 40,
		nodes: [
			output = type: text label.text: "Output\\nProbabilities" label.fontSize: 14,
			softmax = type: rect label.text: "Softmax" size: (90, 25) shape: rounded color: "#D1E6D1" stroke.color: "black" stroke.width: 2.2,
			linear = type: rect label.text: "Linear" size: (90, 25) shape: rounded color: "#DCDFEE" stroke.color: "black" stroke.width: 2.2,
			add_norm0 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			feed_forward = type: rect label.text: "Feed\\nForward" size: (90, 35) shape: rounded color: "#CAE7F5" stroke.color: "black" stroke.width: 2.2,
			add_norm1 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			multi_head_attention = type: rect label.text: "Multi-Head\\nAttention" size: (90, 35) shape: rounded color: "#FAE3C0" stroke.color: "black" stroke.width: 2.2,
			add_norm2 = type: rect label.text: "Add & Norm" size: (90, 25) shape: rounded color: "#F3F4C6" stroke.color: "black" stroke.width: 2.2,
			masked_multi_head_attention = type: rect label.text: "Masked\\nMulti-Head\\nAttention" size: (90, 55) shape: rounded color: "#FAE3C0" stroke.color: "black" stroke.width: 2.2,
			plus = type: circle label.text: "+" label.fontSize: 20 size: (15, 15),
			positional_encoding = type: circle label.text: "∿" label.fontSize: 56 annotation.right: "Positional\\nEncoding" annotation.fontFamily: "Helvetica" annotation.fontSize: 14 annotation.fontWeight: 100 size: (33, 33),
			output_embedding = type: rect label.text: "Output\\nEmbedding" size: (90, 35) shape: rounded color: "#F8E1E2" stroke.color: "black" stroke.width: 2.2,
			outputs = type: text label.text: "Outputs\\n(shifted right)" label.fontSize: 14 label.fontWeight: 100
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

`,
      },
      {
        id: "block1",
        title: "Encoder-Decoder",
        userCode: `architecture a = {
	block Encoder: [
		layout: horizontal,
		nodes: [
			rnn1 = type: rect label.text: "RNN" label.fontFamily: "Arial" size: (50, 30) color: "#FBE7F0",
			rnn2 = type: rect label.text: "RNN" label.fontFamily: "Arial" size: (50, 30) color: "#FBE7F0",
			rnn3 = type: rect label.text: "RNN" label.fontFamily: "Arial" size: (50, 30) color: "#FBE7F0",
			x1 = type: rect annotation.bottom: "x_1" annotation.gap: 5 annotation.fontFamily: "sans-serif" annotation.fontStyle: italic size: (30, 20) color: "#FBE7F0",
			x2 = type: rect annotation.bottom: "x_2" annotation.gap: 5 annotation.fontFamily: "sans-serif" annotation.fontStyle: italic size: (30, 20) color: "#FBE7F0",
			x3 = type: rect annotation.bottom: "x_3" annotation.gap: 5 annotation.fontFamily: "sans-serif" annotation.fontStyle: italic size: (30, 20) color: "#FBE7F0",
			empty = type: rect size: (50, 30) color: "transparent" stroke.color: "transparent"
		],
		edges: [
			e0 = empty.right[2] -> rnn1.left[2] label.text: "h_1" label.fontFamily: "sans-serif" label.fontStyle: italic label.shift.top: 3 width: 1.5,
			e1 = rnn1.right[2] -> rnn2.left[2] label.text: "h_2" label.fontFamily: "sans-serif" label.fontStyle: italic label.shift.top: 3 width: 1.5,
			e2 = rnn2.right[2] -> rnn3.left[2] label.text: "h_3" label.fontFamily: "sans-serif" label.fontStyle: italic label.shift.top: 3 width: 1.5,
			e3 = x1.top -> rnn1.left[6] width: 1.5,
			e4 = x2.top -> rnn2.left[6] width: 1.5,
			e5 = x3.top -> rnn3.left[6] width: 1.5
		],
		groups: [
			row1 = members: [empty, rnn1, rnn2, rnn3] gap: 55,
			row2 = members: [x1, x2, x3] gap: 75,
			row3 = members: [row1, row2] layout: vertical annotation.top: "Encoder" annotation.top.shift.top: 30 annotation.top.shift.right: 20 annotation.fontFamily: "Arial" annotation.fontWeight: 900
		]
	],
	block middle: [
		layout: horizontal,
		nodes: [
			encoder_vector = type: rect label.text: "Encoder Vector" label.orientation: (vertical,left) label.fontFamily: "Arial" size: (35, 125)
		]
	],
	block Decoder: [
		layout: horizontal,
		nodes: [
			rnn1 = type: rect label.text: "RNN" label.fontFamily: "Arial" size: (50, 30) color: "#E9F4FE",
			rnn2 = type: rect label.text: "RNN" label.fontFamily: "Arial" size: (50, 30) color: "#E9F4FE",
			y1 = type: rect annotation.top: "y_1" annotation.gap: 1 annotation.fontFamily: "sans-serif" annotation.fontStyle: italic size: (30, 20) color: "#E9F4FE",
			y2 = type: rect annotation.top: "y_2" annotation.gap: 1 annotation.fontFamily: "sans-serif" annotation.fontStyle: italic size: (30, 20) color: "#E9F4FE"
		],
		edges: [
			e1 = rnn1.top -> y1.bottom width: 1.5,
			e2 = rnn2.top -> y2.bottom width: 1.5,
			e3 = rnn1.right -> rnn2.left width: 1.5
		],
		groups: [
			row1 = members: [rnn1, rnn2] gap: 55,
			row2 = members: [y1, y2] gap: 75,
			row3 = members: [row2, row1] layout: vertical gap: 40 annotation.bottom: "Decoder" annotation.bottom.shift.bottom: 30 annotation.fontFamily: "Arial" annotation.fontWeight: 900
		]
	],
	diagram: [
		gap: -30,
		uses: [e = Encoder, m = middle, d = Decoder],
		connects: [
			e.rnn3.right -> m.encoder_vector.left[5] alignToIndexedPort: true,
			m.encoder_vector.right[1] -> d.rnn1.left alignToIndexedPort: true
		]
	]
}


page
show a

`,
      },
      {
        id: "block2",
        title:
          "Original ResNet with skip connections in place. The same ResNet model with removed and shortened skip connections",
        userCode: `architecture a = {
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

`,
      },
      {
        id: "block3",
        title: "MLP1",
        userCode: `neuralnetwork nn = {
	layers: ["input layer", "hidden layer 1", "hidden layer 2", "output layer"]
	neurons: [[null, null, null], [null, null, null, null], [null, null, null, null], [null]]
	layerColors: ["#E4DCBD", "#C8E3F5", "#CEE7B2", "#E6C6C0"]
	showLabels: true
	labelPosition: bottom
	showArrowheads: true
	edgeWidth: 0.3
	layerSpacing: 125
	layerStrokes: ["#666666", "#666666", "#666666", "#666666"]
	edgeColor: "#333333"
}


page
show nn`,
      },
      {
        id: "block4",
        title: "MLP2 ETH IML",
        userCode: `neuralnetwork nn = {
	layers: ["Input Layer", "Hidden Layer", "Output Layer"]
	neurons: [["x1", "x2", "x3"], ["v1", "v2", "v3"], ["f"]]
	layerColors: ["#D8D8D8", "#D8D8D8", "#D8D8D8"]
	showBias: true
	showLabels: true
	labelPosition: bottom
	showWeights: true
	showArrowheads: true
	layerSpacing: 250
	neuronSpacing: 60
}


page
show nn
`,
      },
      {
        id: "block5",
        title:
          "Standard Connectivity/ ResNet Connectivity/ DenseNet Connectivity",
        userCode: `architecture a = {
	block Standard: [
		annotation.fontFamily: "Arial",
		annotation.right: "Successive convolutions",
		gap: 50,
		annotation.fontSize: 15,
		layout: horizontal,
		nodes: [
			stacked0 = type: stacked shape: 3x80x80 filterSpacing: 5 color: "#279B45",
			stacked1 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#F4DD5E",
			stacked2 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#D93C39",
			stacked3 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#75A8AC",
			stacked4 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#4F5569"
		],
		edges: [
			e1 = stacked0.right -> stacked1.left gap: 15 color: "#5F5F5F",
			e2 = stacked1.right -> stacked2.left gap: 15 color: "#5F5F5F",
			e3 = stacked2.right -> stacked3.left gap: 15 color: "#5F5F5F",
			e4 = stacked3.right -> stacked4.left gap: 15 color: "#5F5F5F"
		]
	],
	block Resnet: [
		annotation.fontFamily: "Arial",
		annotation.right: "Element-wise feature\nsummation",
		annotation.top.shift.top: 10,
		annotation.fontSize: 15,
		layout: horizontal,
		nodes: [
			stacked0 = type: stacked shape: 3x80x80 filterSpacing: 5 color: "#279B45",
			plusEmpty = type: circle size: (20, 20) color: "transparent" stroke.color: "transparent",
			stacked1 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#F4DD5E",
			plus0 = type: circle label.text: "+" size: (20, 20) color: "#8DD7D3",
			stacked2 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#D93C39",
			plus1 = type: circle label.text: "+" size: (20, 20) color: "#8DD7D3",
			stacked3 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#75A8AC",
			plus2 = type: circle label.text: "+" size: (20, 20) color: "#8DD7D3",
			stacked4 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#4F5569",
			plus3 = type: circle label.text: "+" size: (20, 20) color: "#8DD7D3",
			empty0 = type: rect size: (-20, 0) color: "transparent" stroke.color: "transparent",
			plusBottom = type: circle label.text: "+" annotation.right: ":Element-wise addition" size: (20, 20) color: "#8DD7D3"
		],
		edges: [
			e1 = stacked0.right -> stacked1.left gap: 15 color: "#5F5F5F",
			e2 = e1.mid -> plus0.top shape: arc curveHeight: 120 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e3 = stacked1.right -> stacked2.left gap: 15 color: "#5F5F5F",
			e4 = e3.end -> plus1.top shape: arc curveHeight: 120 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e5 = stacked2.right -> stacked3.left gap: 15 color: "#5F5F5F",
			e6 = e5.end -> plus2.top shape: arc curveHeight: 120 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e7 = stacked3.right -> stacked4.left gap: 15 color: "#5F5F5F",
			e8 = e7.end -> plus3.top shape: arc curveHeight: 120 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e9 = stacked4.right -> empty0.left gap: 15 color: "#5F5F5F"
		],
		groups: [
			row0 = members: [stacked0, plusEmpty, stacked1, plus0, stacked2, plus1, stacked3, plus2, stacked4, plus3, empty0],
			row2 = members: [plusBottom] shift.left: 200,
			row1 = members: [row0, row2] layout: vertical gap: 25
		]
	],
	block DenseNet: [
		annotation.fontFamily: "Arial",
		annotation.right: "Feature concatenation",
		annotation.fontSize: 15,
		layout: horizontal,
		nodes: [
			stacked0 = type: stacked shape: 3x80x80 filterSpacing: 5 color: "#279B45",
			cEmpty = type: circle size: (20, 20) color: "transparent" stroke.color: "transparent",
			stacked1 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#F4DD5E",
			c0 = type: circle label.text: "c" size: (20, 20) color: "#50A243",
			stacked2 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#D93C39",
			c1 = type: circle label.text: "c" size: (20, 20) color: "#50A243",
			stacked3 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#75A8AC",
			c2 = type: circle label.text: "c" size: (20, 20) color: "#50A243",
			stacked4 = type: stacked shape: 11x80x80 filterSpacing: 5 color: "#4F5569",
			c3 = type: circle label.text: "c" size: (20, 20) color: "#50A243",
			empty0 = type: rect size: (-20, 0) color: "transparent" stroke.color: "transparent",
			cBottom = type: circle label.text: "c" annotation.right: ":Channel-wise concatenation" size: (20, 20) color: "#50A243"
		],
		edges: [
			e1 = stacked0.right -> stacked1.left gap: 15 color: "#5F5F5F",
			e2 = e1.mid -> c0.top shape: arc curveHeight: 80 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e3 = e1.mid -> c1.top shape: arc curveHeight: 150 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e4 = e1.mid -> c2.top shape: arc curveHeight: 190 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e5 = e1.mid -> c3.top shape: arc curveHeight: 250 edgeAnchorOffset: [-10,0] color: "#5F5F5F",
			e6 = stacked1.right -> stacked2.left gap: 15 color: "#5F5F5F",
			e7 = e6.start -> c1.top shape: arc curveHeight: 80 color: "#5F5F5F",
			e8 = e6.start -> c2.top shape: arc curveHeight: 150 color: "#5F5F5F",
			e9 = e6.start -> c3.top shape: arc curveHeight: 190 color: "#5F5F5F",
			e10 = stacked2.right -> stacked3.left gap: 15 color: "#5F5F5F",
			e11 = e10.start -> c2.top shape: arc curveHeight: 80 color: "#5F5F5F",
			e12 = e10.start -> c3.top shape: arc curveHeight: 150 color: "#5F5F5F",
			e13 = stacked3.right -> stacked4.left gap: 15 color: "#5F5F5F",
			e14 = e13.start -> c3.top shape: arc curveHeight: 80 color: "#5F5F5F",
			e15 = stacked4.right -> empty0.left gap: 15
		],
		groups: [
			row1 = members: [cBottom] shift.left: 200,
			row0 = members: [stacked0, cEmpty, stacked1, c0, stacked2, c1, stacked3, c2, stacked4, c3, empty0],
			row2 = members: [row0, row1] layout: vertical
		]
	],
	diagram: [
		gap: 160,
		uses: [s = Standard anchor: stacked0, r = Resnet anchor: stacked0, d = DenseNet anchor: stacked0],
		layout: vertical
	]
}


page
show a

`,
      },
      {
        id: "block6",
        title: "GAN",
        userCode: `architecture a = {
	block GAN: [
		gap: 50,
		fontFamily: "Arial",
		nodes: [
			rect0 = type: rect label.text: "Training data" size: (135, 70) color: "#E5F0DC" stroke.color: "#9CCF5F" stroke.width: 1.9,
			stacked0 = type: stacked shape: 6x10x10 filterSpacing: 7 annotation.top: "'real' samples" annotation.gap: 7 annotation.fontSize: 12 size: (70, 70) color: "#7F7F7F" outerStroke.color: "#DDDDDD" outerStroke.style: dashed,
			rect1 = type: rect label.text: "Generator, G" label.fontWeight: 900 subLabel.text: "Multilayer\\nneural network" subLabel.fontColor: "grey" size: (135, 108) shape: rounded color: "#FBE8E7" stroke.color: "#EA3424" stroke.width: 1.9,
			stacked1 = type: stacked shape: 6x10x10 filterSpacing: 7 annotation.bottom: "Generated 'fake' samples" annotation.gap: -5 annotation.fontSize: 12 size: (70, 70) color: "#7F7F7F" outerStroke.color: "#DDDDDD" outerStroke.style: dashed,
			rect2 = type: rect label.text: "Random noise" label.orientation: (vertical,left) size: (40, 120) color: "#FFFFFF" stroke.color: "#8A8A8A" stroke.width: 1.9,
			rect3 = type: rect label.text: "Discriminator, D" label.fontWeight: 900 subLabel.text: "Multilayer neural network" subLabel.fontColor: "grey" size: (135, 108) shape: rounded color: "#E0EAF6" stroke.color: "#73C6F0" stroke.width: 1.9,
			rect4 = type: rect label.text: "Discriminator loss" label.orientation: (vertical,right) size: (40, 155) color: "#FFFFFF" stroke.color: "#8A8A8A" stroke.width: 1.9,
			rect5 = type: rect label.text: "Generator loss" label.orientation: (vertical,right) size: (40, 140) color: "#FFFFFF" stroke.color: "#8A8A8A" stroke.width: 1.9
		],
		edges: [
			e1 = rect2.right -> rect1.left shape: straight width: 1.5,
			e2 = rect1.right -> stacked1.left shape: straight width: 1.5,
			e3 = rect0.right -> stacked0.left shape: straight width: 1.5,
			e4 = stacked1.right -> rect3.left width: 1.5,
			e5 = stacked0.right -> rect3.left width: 1.5,
			e6 = rect5.left -> rect3.bottom[8] color: "#DC7534",
			e7 = rect4.left -> rect3.top[8] label.text: "Backpropagation" label.shift.left: 30 color: "#DC7534",
			e8 = rect3.bottom[7] -> rect1.bottom[3] label.text: "Backpropagation" label.shift.right: 170 color: "#DC7534",
			e9 = rect3.right -> rect4.left[6] shape: straight width: 1.5,
			e10 = rect3.right -> rect5.left[4] shape: straight width: 1.5
		],
		groups: [
			row7 = members: [stacked0],
			row8 = members: [stacked1],
			row1 = members: [rect0, row7] gap: 35,
			row2 = members: [rect2, rect1, row8] gap: 35,
			row3 = members: [row1, row2] layout: vertical anchor.source: stacked0 anchor.target: stacked1,
			row4 = members: [row3, rect3] align: true,
			row5 = members: [rect4, rect5] layout: vertical,
			row6 = members: [row4, row5] layout: horizontal gap: 50 align: true
		]
	]
}


page
show a
`,
      },
      {
        id: "block7",
        title: "CNN",
        userCode: `architecture a = {
	block CNN: [
		gap: 50,
		layout: horizontal,
		fontFamily: "Arial",
		nodes: [
			stacked0 = type: stacked shape: 1x128x128 kernelSize: 20x20 label.text: "Input\\nimage" label.fontWeight: 700 color: "#DDDDDD" stroke.color: "#DDDDDD",
			stacked1 = type: stacked shape: 24x128x128 kernelSize: 20x20 filterSpacing: 5 label.text: "Convolution+\\nRelu" label.fontWeight: 700 annotation.top: "Pooling" color: "#279B45",
			stacked2 = type: stacked shape: 20x128x128 kernelSize: 20x20 filterSpacing: 5 label.text: "Convolution+\\nRelu" label.fontWeight: 700 annotation.top: "Pooling" color: "#279B45",
			stacked3 = type: stacked shape: 20x80x80 kernelSize: 20x20 filterSpacing: 5 label.text: "Convolution+\\nRelu" label.fontWeight: 700 annotation.top: "Pooling" color: "#279B45",
			stacked4 = type: stacked shape: 20x80x80 filterSpacing: 5 label.text: "Convolution+\\nRelu" label.fontWeight: 700 annotation.top: "Pooling" color: "#279B45",
			flatten0 = type: rect label.text: "Flattened" label.orientation: (vertical,right) label.fontWeight: 700 size: (15, 190) color: "#F2EED1" stroke.color: "#F2EED1",
			fullyConnected0 = type: fullyConnected shape: [8, 4] outputLabels: ["0.3", "0.1", "0.2", "0.9"] size: (200, 250) color: ["#CFDCFB", "#F1B0AC"]
		],
		edges: [
			e1 = stacked0.right -> stacked1.left transition: featureMap,
			e2 = stacked1.right -> stacked2.left transition: featureMap,
			e3 = stacked2.right -> stacked3.left transition: featureMap,
			e4 = stacked3.right -> stacked4.left transition: featureMap,
			e5 = stacked4.right -> flatten0.left transition: flatten,
			e6 = flatten0.right -> fullyConnected0.left transition: fullyConnected
		],
		groups: [
			row1 = members: [stacked1, stacked2, stacked3, stacked4] gap: 5 marker.type: arrow marker.position: top marker.text: "Feature Maps" marker.fontWeight: 700 marker.shift.top: -5 marker.shift.left: -10 marker.shift.right: -80,
			row2 = members: [stacked0, row1] marker.type: bracket marker.text: "Feature Extraction" marker.fontWeight: 700 marker.shift.top: -10 marker.shift.bottom: -5 marker.shift.left: -5,
			row3 = members: [flatten0],
			row4 = members: [fullyConnected0] marker.type: brace marker.position: top marker.text: "Fully Connected Layer" marker.fontWeight: 700 marker.shift.top: -5 marker.shift.bottom: -20 marker.shift.left: 25
		]
	]
}


page
show a

`,
      },
      {
        id: "block8",
        title: "VAE",
        userCode: `architecture a = {
	block VAE: [
		gap: 40,
		layout: horizontal,
		fontFamily: "Arial",
		fontWeight: 900,
		nodes: [
			rect0 = type: rect label.text: "x" annotation.top: "Input\\n" annotation.gap: 0 size: (50, 148) stroke.width: 1.5,
			trapezoid0 = type: trapezoid label.text: "Encoder" size: (80, 148) color: "#C8D7BA" stroke.color: "#B3CAA3" stroke.width: 1.5,
			rect1 = type: rect label.text: "μ" size: (60, 50) color: "#C8D7BA" stroke.color: "#B3CAA3" stroke.width: 1.5,
			rect2 = type: rect label.text: "σ" size: (60, 50) color: "#C8D7BA" stroke.color: "#B3CAA3" stroke.width: 1.5,
			rect3 = type: rect label.text: "z" size: (60, 50) color: "#DCA8A3" stroke.color: "#A47470" stroke.width: 1.5,
			trapezoid1 = type: trapezoid label.text: "Decoder" size: (80, 148) color: "#B6C5E1" stroke.color: "#A4B2CD" stroke.width: 1.5 direction: left,
			rect4 = type: rect label.text: "x'" annotation.top: "Reconstructed\\nInput\\n" annotation.gap: -10 size: (50, 148) stroke.width: 1.5,
			text0 = type: text label.text: "z = μ + σɛ\\nɛ ~ N(0,I)"
		],
		edges: [
			e1 = rect0.right -> trapezoid0.left shape: straight,
			e2 = trapezoid0.right -> rect1.left width: 1.75,
			e3 = trapezoid0.right -> rect2.left width: 1.75,
			e4 = rect1.right -> rect3.left width: 1.75,
			e5 = rect2.right -> rect3.left width: 1.75,
			e6 = rect3.right -> trapezoid1.left,
			e7 = trapezoid1.right -> rect4.left
		],
		groups: [
			row2 = members: [rect1, rect2] layout: vertical,
			row1 = members: [rect0, trapezoid0, row2, rect3, trapezoid1, rect4] align: true,
			row0 = members: [text0] shift.top: 10 shift.right: 50,
			final = members: [row1, row0] layout: vertical
		]
	]
}


page
show a
`,
      },
      {
        id: "block9",
        title: "GoogleLeNet Model",
        userCode: `architecture a = {
	block GoogLeNet: [
		fontFamily: "Arial",
		annotation.bottom: "Fig. 8.4.2 The GoogLeNet architecture.",
		annotation.fontFamily: "Times New Roman",
		annotation.fontSize: 19,
		annotation.gap: -5,
		layout: horizontal,
		nodes: [
			rect0 = type: rect label.text: "7 x 7 Conv" label.orientation: (vertical,right) size: (25, 122) color: "#69B2EC",
			rect1 = type: rect label.text: "3 x 3 MaxPool" label.orientation: (vertical,right) size: (25, 122) color: "#BAD8FC",
			rect2 = type: rect label.text: "1 x 1 Conv" label.orientation: (vertical,right) size: (25, 122),
			rect3 = type: rect label.text: "3 x 3 Conv" label.orientation: (vertical,right) size: (25, 122) color: "#69B2EC",
			rect4 = type: rect label.text: "3 x 3 MaxPool" label.orientation: (vertical,right) size: (25, 122) color: "#BAD8FC",
			rect5 = type: rect label.text: "3 x 3 MaxPool" label.orientation: (vertical,right) size: (25, 122) color: "#BAD8FC",
			rect6 = type: rect label.text: "3 x 3 MaxPool" label.orientation: (vertical,right) size: (25, 122) color: "#BAD8FC",
			rect7 = type: rect label.text: "Global AvgPool" label.orientation: (vertical,right) size: (25, 122) color: "#BAD8FC",
			rect8 = type: rect label.text: "FC" label.orientation: (vertical,right) size: (25, 122),
			leftBar0 = type: rect size: (5, 27) color: "#BAD8FC",
			rightBar0 = type: rect size: (5, 27) color: "#BAD8FC",
			topStem0 = type: rect annotation.top: "2 x\\n" size: (5, 27) color: "#BAD8FC",
			a1 = type: rect size: (5, 27),
			a2 = type: rect size: (5, 27) color: "#69B2EC",
			b1 = type: rect size: (5, 27),
			b2 = type: rect size: (5, 27) color: "#69B2EC",
			c1 = type: rect size: (5, 27) color: "#BAD8FC",
			c2 = type: rect size: (5, 27),
			leftBar1 = type: rect size: (5, 27) color: "#BAD8FC",
			rightBar1 = type: rect size: (5, 27) color: "#BAD8FC",
			topStem1 = type: rect annotation.top: "5 x\\n" size: (5, 27) color: "#BAD8FC",
			a3 = type: rect size: (5, 27),
			a4 = type: rect size: (5, 27) color: "#69B2EC",
			b3 = type: rect size: (5, 27),
			b4 = type: rect size: (5, 27) color: "#69B2EC",
			c3 = type: rect size: (5, 27) color: "#BAD8FC",
			c4 = type: rect size: (5, 27),
			leftBar2 = type: rect size: (5, 27) color: "#BAD8FC",
			rightBar2 = type: rect size: (5, 27) color: "#BAD8FC",
			topStem2 = type: rect annotation.top: "2 x\\n" size: (5, 27) color: "#BAD8FC",
			a5 = type: rect size: (5, 27),
			a6 = type: rect size: (5, 27) color: "#69B2EC",
			b5 = type: rect size: (5, 27),
			b6 = type: rect size: (5, 27) color: "#69B2EC",
			c5 = type: rect size: (5, 27) color: "#BAD8FC",
			c6 = type: rect size: (5, 27)
		],
		edges: [
			e1 = rect0.right -> rect1.left shape: straight width: 1.5,
			e2 = rect1.right -> rect2.left shape: straight width: 1.5,
			e3 = rect2.right -> rect3.left shape: straight width: 1.5,
			e19 = rect3.right -> rect4.left shape: straight width: 1.5,
			e4 = rect4.right -> leftBar0.left shape: straight width: 1.5,
			e5 = rightBar0.right -> rect5.left shape: straight width: 1.5,
			e6 = rect5.right -> leftBar1.left shape: straight width: 1.5,
			e7 = rightBar1.right -> rect6.left shape: straight width: 1.5,
			e8 = rect6.right -> leftBar2.left shape: straight width: 1.5,
			e9 = rightBar2.right -> rect7.left shape: straight width: 1.5,
			e10 = rect7.right -> rect8.left shape: straight width: 1.5,
			e11 = leftBar0.top -> topStem0.left shape: bow width: 1,
			e12 = topStem0.right -> rightBar0.top shape: bow width: 1,
			e13 = c2.right -> rightBar0.bottom shape: bow width: 1,
			e14 = leftBar0.bottom -> c1.left shape: bow width: 1,
			e15 = leftBar0.right[1] -> a1.left shape: straight width: 1,
			e16 = leftBar0.right[3] -> b1.left shape: straight width: 1,
			e17 = a2.right[2] -> rightBar0.left shape: straight width: 1.5 arrowheads: 0,
			e18 = b2.right[2] -> rightBar0.left shape: straight width: 1.5 arrowheads: 0,
			e22 = a1.right -> a2.left shape: straight,
			e21 = b1.right -> b2.left shape: straight,
			e20 = c1.right -> c2.left shape: straight,
			e23 = leftBar1.top -> topStem1.left shape: bow width: 1,
			e24 = topStem1.right -> rightBar1.top shape: bow width: 1,
			e25 = c4.right -> rightBar1.bottom shape: bow width: 1,
			e26 = leftBar1.bottom -> c3.left shape: bow width: 1,
			e27 = leftBar1.right[1] -> a3.left shape: straight width: 1,
			e28 = leftBar1.right[3] -> b3.left shape: straight width: 1,
			e29 = a4.right[2] -> rightBar1.left shape: straight width: 1.5 arrowheads: 0,
			e30 = b4.right[2] -> rightBar1.left shape: straight width: 1.5 arrowheads: 0,
			e31 = a3.right -> a4.left shape: straight,
			e32 = b3.right -> b4.left shape: straight,
			e33 = c3.right -> c4.left shape: straight,
			e34 = leftBar2.top -> topStem2.left shape: bow width: 1,
			e35 = topStem2.right -> rightBar2.top shape: bow width: 1,
			e36 = c6.right -> rightBar2.bottom shape: bow width: 1,
			e37 = leftBar2.bottom -> c5.left shape: bow width: 1,
			e38 = leftBar2.right[1] -> a5.left shape: straight width: 1,
			e39 = leftBar2.right[3] -> b5.left shape: straight width: 1,
			e40 = a6.right[2] -> rightBar2.left shape: straight width: 1.5 arrowheads: 0,
			e41 = b6.right[2] -> rightBar2.left shape: straight width: 1.5 arrowheads: 0,
			e42 = a5.right -> a6.left shape: straight,
			e43 = b5.right -> b6.left shape: straight,
			e344 = c5.right -> c6.left shape: straight
		],
		groups: [
			row1 = members: [a1, a2] gap: 4,
			row3 = members: [b1, b2] gap: 4,
			row4 = members: [c1, c2] gap: 4,
			core0 = members: [topStem0, row1, row3, row4] layout: vertical gap: 4,
			module0 = members: [leftBar0, core0, rightBar0] layout: horizontal gap: 8 align: true,
			row5 = members: [a3, a4] gap: 4,
			row7 = members: [b3, b4] gap: 4,
			row8 = members: [c3, c4] gap: 4,
			core1 = members: [topStem1, row5, row7, row8] layout: vertical gap: 4,
			module1 = members: [leftBar1, core1, rightBar1] layout: horizontal gap: 8 align: true,
			row9 = members: [a5, a6] gap: 4,
			row11 = members: [b5, b6] gap: 4,
			row12 = members: [c5, c6] gap: 4,
			core2 = members: [topStem2, row9, row11, row12] layout: vertical gap: 4,
			module2 = members: [leftBar2, core2, rightBar2] layout: horizontal gap: 8 align: true,
			all = members: [rect0, rect1, rect2, rect3, rect4, module0, rect5, module1, rect6, module2, rect7, rect8] layout: horizontal gap: 15
		]
	]
}


page
show a

`,
      },
      {
        id: "block10",
        title:
          "A: Multi-Scale residual block/ Residual convolutional skip-connection",
        userCode: `architecture a = {
	block MultiScaleResidualBlock: [
		gap: 40,
		layout: horizontal,
		fontFamily: "Times New Roman",
		fontWeight: 900,
		nodes: [
			input = type: text label.text: "Input",
			rect0 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect1 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect3 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect4 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect5 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect6 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			plus = type: circle label.text: "+" label.fontColor: "#6175AE" label.fontFamily: "Helvetica" label.fontSize: 15 size: (15, 15) stroke.color: "#6175AE",
			output = type: text label.text: "output",
			rect7 = type: rect size: (15, 60) color: "#DD874B" stroke.color: "#D48B58"
		],
		edges: [
			e1 = input.right -> rect0.left width: 1 color: "#8F9FC5",
			e2 = rect0.right -> rect1.left width: 1 color: "#8F9FC5",
			e3 = rect1.right -> rect3.left width: 1 color: "#8F9FC5",
			e5 = rect3.right -> rect4.left width: 4 color: "#A3A3A3",
			e6 = rect6.right -> plus.left width: 1 color: "#8F9FC5",
			e7 = plus.right -> output.left width: 1 color: "#8F9FC5",
			e8 = rect0.top -> rect6.top curveHeight: -1 width: 4 color: "#A3A3A3",
			e9 = rect1.bottom -> rect5.bottom curveHeight: 0 width: 4 color: "#A3A3A3",
			e10 = input.bottom -> rect7.left width: 1 color: "#8F9FC5",
			e11 = rect7.right -> plus.bottom width: 1 color: "#8F9FC5"
		],
		groups: [
			row0 = members: [input, rect0, rect1],
			row3 = members: [rect3, rect7] layout: vertical gap: 30,
			row1 = members: [rect4, rect5, rect6] gap: 0,
			row2 = members: [plus, output]
		]
	],
	block BelowMultiScaleResidualBlock: [
		gap: 40,
		layout: horizontal,
		fontFamily: "Times New Roman",
		fontWeight: 900,
		nodes: [
			rect7 = type: rect annotation.right: "3x3 convolution (ReLU)" size: (10, 30) color: "#6A98D0" stroke.color: "#6388B1",
			rect0 = type: rect annotation.right: "1x1 convolution (ReLU)" size: (10, 30) color: "#DD874B" stroke.color: "#D48B58",
			plus = type: circle label.text: "+" label.fontColor: "#6175AE" label.fontFamily: "Helvetica" label.fontSize: 15 annotation.right: "Addition" size: (10, 15) stroke.color: "#6175AE",
			arrow0 = type: arrow annotation.right: "Concatenation" annotation.gap: -2 size: (15, 15) color: "#A3A3A3" stroke.color: "#A3A3A3"
		],
		groups: [
			row1 = members: [rect0, plus] gap: 180,
			row2 = members: [rect7, arrow0] gap: 180,
			row3 = members: [row2, row1] layout: vertical gap: 10
		]
	],
	diagram: [
		annotation.fontWeight: 900,
		annotation.fontFamily: "Times New Roman",
		annotation.top: "Multi-scale residual block",
		gap: -30,
		uses: [m = MultiScaleResidualBlock anchor: input, b = BelowMultiScaleResidualBlock anchor: rect0],
		layout: vertical
	]
}


page
show a

`,
      },
      {
        id: "block11",
        title:
          "B: Multi-Scale residual block/ Residual convolutional skip-connection",
        userCode: `architecture a = {
	block MultiScaleResidualBlock: [
		gap: 40,
		layout: horizontal,
		nodes: [
			encoder = type: text label.text: "Encoder" label.fontFamily: "Times New Roman" label.fontWeight: 900,
			decoder = type: text label.text: "Decoder" label.fontFamily: "Times New Roman" label.fontWeight: 900,
			rect0 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect1 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect2 = type: rect size: (15, 60) color: "#6A98D0" stroke.color: "#6388B1",
			rect3 = type: rect size: (15, 60) color: "#DD874B" stroke.color: "#DD874B",
			rect4 = type: rect size: (15, 60) color: "#DD874B" stroke.color: "#DD874B",
			rect5 = type: rect size: (15, 60) color: "#DD874B" stroke.color: "#DD874B",
			plus0 = type: circle label.text: "+" label.fontColor: "#6175AE" label.fontFamily: "Helvetica" label.fontSize: 15 label.fontWeight: 900 size: (15, 15) stroke.color: "#6175AE",
			plus1 = type: circle label.text: "+" label.fontColor: "#6175AE" label.fontFamily: "Helvetica" label.fontSize: 15 label.fontWeight: 900 size: (15, 15) stroke.color: "#6175AE",
			plus2 = type: circle label.text: "+" label.fontColor: "#6175AE" label.fontFamily: "Helvetica" label.fontSize: 15 label.fontWeight: 900 size: (15, 15) stroke.color: "#6175AE"
		],
		edges: [
			e1 = encoder.right -> rect0.left width: 1 color: "#8F9FC5",
			e2 = rect0.right -> plus0.left width: 1 color: "#8F9FC5",
			e3 = plus0.right -> rect1.left width: 1 color: "#8F9FC5",
			e4 = rect1.right -> plus1.left width: 1 color: "#8F9FC5",
			e5 = plus1.right -> rect2.left width: 1 color: "#8F9FC5",
			e6 = rect2.right -> plus2.left width: 1 color: "#8F9FC5",
			e7 = plus2.right -> decoder.left width: 1 color: "#8F9FC5",
			e8 = encoder.bottom -> rect3.left width: 1 color: "#8F9FC5",
			e9 = rect3.right -> plus0.bottom width: 1 color: "#8F9FC5",
			e10 = e3.mid -> rect4.left width: 1 color: "#8F9FC5",
			e11 = rect4.right -> plus1.bottom width: 1 color: "#8F9FC5",
			e12 = e5.mid -> rect5.left width: 1 color: "#8F9FC5",
			e13 = rect5.right -> plus2.bottom width: 1 color: "#8F9FC5"
		],
		groups: [
			row1 = members: [rect0, rect3] layout: vertical gap: 10,
			row2 = members: [rect1, rect4] layout: vertical gap: 10,
			row3 = members: [rect2, rect5] layout: vertical gap: 10,
			row5 = members: [encoder, row1, plus0, row2, plus1, row3, plus2, decoder]
		]
	],
	block BelowMultiScaleResidualBlock: [
		gap: 40,
		layout: horizontal,
		fontFamily: "Times New Roman",
		fontWeight: 900,
		nodes: [
			rect7 = type: rect annotation.right: "3x3 convolution (ReLU)" size: (10, 30) color: "#6A98D0" stroke.color: "#6388B1",
			rect0 = type: rect annotation.right: "1x1 convolution (ReLU)" size: (10, 30) color: "#DD874B" stroke.color: "#D48B58",
			plus = type: circle label.text: "+" label.fontColor: "#6175AE" label.fontFamily: "Helvetica" label.fontSize: 15 annotation.right: "Addition" size: (15, 15) stroke.color: "#6175AE",
			empty = type: rect size: (15, 15) color: "transparent" stroke.color: "transparent"
		],
		groups: [
			row1 = members: [rect0, empty] gap: 180,
			row2 = members: [rect7, plus] gap: 180,
			row3 = members: [row2, row1] layout: vertical gap: 10
		]
	],
	diagram: [
		annotation.fontWeight: 900,
		annotation.fontFamily: "Times New Roman",
		annotation.top: "Residual convolutional skip-connection",
		gap: -20,
		uses: [m = MultiScaleResidualBlock anchor: encoder, b = BelowMultiScaleResidualBlock anchor: rect0],
		layout: vertical
	]
}


page
show a

`,
      },
      {
        id: "block12",
        title: "Decoder-only transformer",
        userCode: `architecture a = {
	block TokenFlow: [
		layout: vertical,
		gap: 34,
		fontFamily: "Arial",
		nodes: [
			outa0 = type: rect annotation.left: "Output Token\\nVectors" annotation.fontWeight: 900 size: (25, 20) color: "#D8E5D2" stroke.color: "#666666",
			outa1 = type: rect size: (25, 20) color: "#D8E5D2" stroke.color: "#666666",
			outa2 = type: rect size: (25, 20) color: "#D8E5D2" stroke.color: "#666666",
			outb0 = type: rect size: (25, 20) color: "#C8D7F0" stroke.color: "#666666",
			outb1 = type: rect size: (25, 20) color: "#C8D7F0" stroke.color: "#666666",
			outb2 = type: rect size: (25, 20) color: "#C8D7F0" stroke.color: "#666666",
			outc0 = type: rect size: (25, 20) color: "#E6BFB8" stroke.color: "#666666",
			outc1 = type: rect size: (25, 20) color: "#E6BFB8" stroke.color: "#666666",
			outc2 = type: rect size: (25, 20) color: "#E6BFB8" stroke.color: "#666666",
			outd0 = type: rect size: (25, 20) color: "#DAC7D2" stroke.color: "#666666",
			outd1 = type: rect size: (25, 20) color: "#DAC7D2" stroke.color: "#666666",
			outd2 = type: rect size: (25, 20) color: "#DAC7D2" stroke.color: "#666666",
			decoder0 = type: rect label.text: "Decoder Block" label.fontWeight: 100 size: (560, 18) shape: rounded color: "#EFC492" stroke.color: "#666666",
			decoder1 = type: rect label.text: "Decoder Block" label.fontWeight: 100 size: (560, 18) shape: rounded color: "#EFC492" stroke.color: "#666666",
			decoderdots = type: rect label.text: "⋮" label.fontSize: 20 label.fontWeight: 100 size: (0, 10) stroke.color: "transparent",
			decoder2 = type: rect label.text: "Decoder Block" label.fontWeight: 100 size: (560, 18) shape: rounded color: "#EFC492" stroke.color: "#666666",
			pos_embedding = type: rect label.text: "Position Embedding" label.fontWeight: 100 size: (560, 20) shape: rounded color: "#EBD892",
			plus0 = type: circle label.text: "+" label.fontSize: 20 label.fontWeight: 900 size: (20, 20) color: "#F2F2F2" stroke.color: "#666666" stroke.width: 2.5 label.fontFamily: "Helvetica",
			plus1 = type: circle label.text: "+" label.fontSize: 20 label.fontWeight: 900 size: (20, 20) color: "#F2F2F2" stroke.color: "#666666" stroke.width: 2.5 label.fontFamily: "Helvetica",
			plus2 = type: circle label.text: "+" label.fontSize: 20 label.fontWeight: 900 size: (20, 20) color: "#F2F2F2" stroke.color: "#666666" stroke.width: 2.5 label.fontFamily: "Helvetica",
			plus3 = type: circle label.text: "+" label.fontSize: 20 label.fontWeight: 900 size: (20, 20) color: "#F2F2F2" stroke.color: "#666666" stroke.width: 2.5 label.fontFamily: "Helvetica",
			ina0 = type: rect annotation.left: "Input Token\\nVectors" annotation.fontWeight: 900 size: (25, 20) color: "#D8E5D2" stroke.color: "#666666",
			ina1 = type: rect size: (25, 20) color: "#D8E5D2" stroke.color: "#666666",
			ina2 = type: rect size: (25, 20) color: "#D8E5D2" stroke.color: "#666666",
			inb0 = type: rect size: (25, 20) color: "#C8D7F0" stroke.color: "#666666",
			inb1 = type: rect size: (25, 20) color: "#C8D7F0" stroke.color: "#666666",
			inb2 = type: rect size: (25, 20) color: "#C8D7F0" stroke.color: "#666666",
			inc0 = type: rect size: (25, 20) color: "#E6BFB8" stroke.color: "#666666",
			inc1 = type: rect size: (25, 20) color: "#E6BFB8" stroke.color: "#666666",
			inc2 = type: rect size: (25, 20) color: "#E6BFB8" stroke.color: "#666666",
			ind0 = type: rect size: (25, 20) color: "#DAC7D2" stroke.color: "#666666",
			ind1 = type: rect size: (25, 20) color: "#DAC7D2" stroke.color: "#666666",
			ind2 = type: rect size: (25, 20) color: "#DAC7D2" stroke.color: "#666666"
		],
		groups: [
			row1 = members: [outa0, outa1, outa2] gap: 0,
			row2 = members: [outb0, outb1, outb2] gap: 0,
			row3 = members: [outc0, outc1, outc2] gap: 0,
			row4 = members: [outd0, outd1, outd2] gap: 0,
			gout = members: [row1, row2, row3, row4] layout: horizontal gap: 40,
			gdecstack = members: [decoder0, decoder1, decoderdots, decoder2] layout: vertical gap: 10 colorBoxAdjustments: (-18,-22,-18,-22) stroke.color: "#5A5A5A" stroke.width: 2.5 shape: rounded,
			row5 = members: [ina0, ina1, ina2] gap: 0,
			row6 = members: [inb0, inb1, inb2] gap: 0,
			row7 = members: [inc0, inc1, inc2] gap: 0,
			row8 = members: [ind0, ind1, ind2] gap: 0,
			gplus0 = members: [plus0, row5] layout: vertical gap: 15,
			gplus1 = members: [plus1, row6] layout: vertical gap: 15,
			gplus2 = members: [plus2, row7] layout: vertical gap: 15,
			gplus3 = members: [plus3, row8] layout: vertical gap: 15,
			gbottom = members: [gplus0, gplus1, gplus2, gplus3] layout: horizontal gap: 40,
			gmiddle = members: [pos_embedding, gbottom] layout: vertical gap: 15
		],
		edges: [
			e1 = gdecstack.top[2] -> outa1.bottom color: "#5A5A5A",
			e2 = gdecstack.top[4] -> outb1.bottom color: "#5A5A5A",
			e3 = gdecstack.top[6] -> outc1.bottom color: "#5A5A5A",
			e4 = gdecstack.top[8] -> outd1.bottom color: "#5A5A5A",
			e5 = ina1.top -> gdecstack.bottom[2] color: "#5A5A5A",
			e6 = inb1.top -> gdecstack.bottom[4] color: "#5A5A5A",
			e7 = inc1.top -> gdecstack.bottom[6] color: "#5A5A5A",
			e8 = ind1.top -> gdecstack.bottom[8] color: "#5A5A5A"
		]
	],
	block DecoderZoom: [
		layout: vertical,
		fontFamily: "Arial",
		nodes: [
			top_stub = type: rect size: (10, 10) color: "transparent" stroke.color: "transparent",
			plus_top = type: circle label.fontFamily: "Helvetica" label.text: "+" label.fontSize: 22 label.fontWeight: 500 size: (30, 30) color: "#F2F2F2" stroke.color: "#5A5A5A" stroke.width: 2.5,
			ffnn = type: rect label.text: "FFNN" label.fontSize: 15 label.fontWeight: 100 size: (230, 30) shape: rounded color: "#DCC8D5" stroke.color: "#666666",
			ln1 = type: rect label.text: "Layer Norm" label.fontSize: 15 label.fontWeight: 100 size: (230, 30) shape: rounded color: "#C7D8EB" stroke.color: "#666666",
			plus_mid = type: circle label.fontFamily: "Helvetica" label.text: "+" label.fontSize: 22 label.fontWeight: 500 size: (30, 30) color: "#F2F2F2" stroke.color: "#5A5A5A" stroke.width: 2.5,
			masked_sa = type: rect label.text: "Masked Self-Attention" label.fontSize: 15 label.fontWeight: 100 size: (230, 30) shape: rounded color: "#D5E5CC" stroke.color: "#666666",
			ln0 = type: rect label.text: "Layer Norm" label.fontSize: 15 label.fontWeight: 100 size: (230, 30) shape: rounded color: "#C7D8EB" stroke.color: "#666666",
			bottom_stub = type: rect size: (10, 10) color: "transparent" stroke.color: "transparent"
		],
		edges: [
			e1 = bottom_stub.top -> ln0.bottom width: 1.75 color: "#5A5A5A",
			e2 = ln0.top -> masked_sa.bottom width: 1.75 color: "#5A5A5A",
			e3 = masked_sa.top -> plus_mid.bottom width: 1.75 color: "#5A5A5A",
			e4 = plus_mid.top -> ln1.bottom width: 1.75 color: "#5A5A5A",
			e5 = ln1.top -> ffnn.bottom width: 1.75 color: "#5A5A5A",
			e6 = ffnn.top -> plus_top.bottom width: 1.75 color: "#5A5A5A",
			e7 = plus_top.top -> top_stub.bottom width: 1.75 color: "#5A5A5A",
			e8 = e1.mid -> plus_mid.right curveHeight: 60 width: 1.75 color: "#5A5A5A",
			e9 = e4.mid -> plus_top.right curveHeight: 60 width: 1.75 color: "#5A5A5A"
		],
		groups: [
			zoom_body = members: [top_stub, plus_top, ffnn, ln1, plus_mid, masked_sa, ln0, bottom_stub] layout: vertical gap: 30 color: "#F2F2F2" colorBoxAdjustments: (-37,-7,-37,-20) stroke.color: "#666666" stroke.width: 2.5
		]
	],
	diagram: [
		gap: 0,
		uses: [t = TokenFlow anchor: pos_embedding, z = DecoderZoom anchor: masked_sa],
		connects: [
			t.decoder2.right -> z.zoom_body.left style: dashed transition: flatten
		],
		annotation.bottom: "Structure of a decoder-only transformer model",
		annotation.fontWeight: 100,
		annotation.fontFamily: "Times New Roman",
		annotation.fontColor: "#7C7C7C",
		annotation.fontSize: 16
	]
}


page
show a
`,
      },
      {
        id: "block13",
        title: "ResNet-18 architecture",
        userCode: `architecture a = {
	block ResNet: [
		annotation.bottom: "Fig. 8.4.2 The ResNet-18 architecture.",
		annotation.fontFamily: "Times New Roman",
		annotation.fontSize: 19,
		annotation.fontWeight: 100,
		annotation.gap: 0,
		gap: 5,
		layout: horizontal,
		nodes: [
			rect0 = type: rect label.text: "7 x 7 Conv" label.orientation: (vertical,right) label.fontFamily: "Helvetica" label.fontWeight: 500 size: (25, 122) color: "#BAD8FC",
			rect1 = type: rect label.text: "Batch norm" label.orientation: (vertical,right) label.fontFamily: "Helvetica" label.fontWeight: 500 size: (25, 122),
			rect2 = type: rect label.text: "3 x 3 MaxPool" label.orientation: (vertical,right) label.fontFamily: "Helvetica" label.fontWeight: 500 size: (25, 122) color: "#69B2EC",
			small_rect19 = type: rect size: (10, 50) color: "#69B2EC",
			small_rect0 = type: rect size: (10, 50) color: "#BAD8FC",
			small_rect1 = type: rect size: (10, 50),
			small_rect2 = type: rect size: (10, 50) color: "#69B2EC",
			small_rect3 = type: rect size: (10, 50) color: "#BAD8FC",
			small_rect4 = type: rect size: (10, 50),
			plus0 = type: circle label.text: "+" label.fontFamily: "Helvetica" size: (10, 10) color: "#BAD8FC" stroke.width: 2,
			small_rect5 = type: rect size: (10, 50) color: "#BAD8FC",
			small_rect6 = type: rect size: (10, 50),
			small_rect7 = type: rect size: (10, 50) color: "#69B2EC",
			small_rect8 = type: rect size: (10, 50) color: "#BAD8FC",
			small_rect9 = type: rect size: (10, 50),
			small_rect10 = type: rect size: (10, 50) color: "#BAD8FC",
			plus1 = type: circle label.text: "+" label.fontFamily: "Helvetica" size: (10, 10) color: "#BAD8FC" stroke.width: 2,
			small_rect11 = type: rect size: (10, 50),
			small_rect12 = type: rect size: (10, 50) color: "#69B2EC",
			small_rect13 = type: rect size: (10, 50) color: "#BAD8FC",
			small_rect14 = type: rect size: (10, 50),
			small_rect15 = type: rect size: (10, 50) color: "#BAD8FC",
			small_rect16 = type: rect size: (10, 50) color: "#69B2EC",
			plus2 = type: circle label.text: "+" label.fontFamily: "Helvetica" size: (10, 10) color: "#BAD8FC" stroke.width: 2,
			small_rect17 = type: rect size: (10, 50) color: "#69B2EC",
			small_rect18 = type: rect size: (10, 50) color: "#69B2EC",
			rect3 = type: rect label.text: "Global AvgPool" label.orientation: (vertical,right) label.fontFamily: "Helvetica" label.fontWeight: 500 size: (25, 122) color: "#69B2EC",
			rect4 = type: rect label.text: "FC" label.orientation: (vertical,right) label.fontFamily: "Helvetica" label.fontWeight: 500 size: (25, 122)
		],
		edges: [
			e0 = rect0.right -> rect1.left shape: straight width: 1.5,
			e1 = rect1.right -> rect2.left shape: straight width: 1.5,
			e2 = rect2.right -> small_rect19.left shape: straight width: 1,
			e3 = small_rect19.right -> small_rect0.left shape: straight width: 1,
			e4 = small_rect0.right -> small_rect1.left shape: straight width: 1,
			e5 = small_rect1.right -> small_rect2.left shape: straight width: 1,
			e6 = small_rect2.right -> small_rect3.left shape: straight width: 1,
			e7 = small_rect3.right -> small_rect4.left shape: straight width: 1,
			e8 = small_rect4.right -> plus0.left shape: straight width: 1,
			e9 = plus0.right -> small_rect16.left shape: straight width: 1,
			e10 = small_rect16.right -> small_rect5.left shape: straight width: 1,
			e11 = small_rect5.right -> small_rect6.left shape: straight width: 1,
			e12 = small_rect6.right -> small_rect7.left shape: straight width: 1,
			e13 = small_rect7.right -> small_rect8.left shape: straight width: 1,
			e14 = small_rect8.right -> small_rect9.left shape: straight width: 1,
			e15 = small_rect9.right -> plus1.left shape: straight width: 1,
			e16 = plus1.right -> small_rect17.left shape: straight width: 1,
			e17 = small_rect17.right -> small_rect10.left shape: straight width: 1,
			e18 = small_rect10.right -> small_rect11.left shape: straight width: 1,
			e19 = small_rect11.right -> small_rect12.left shape: straight width: 1,
			e20 = small_rect12.right -> small_rect13.left shape: straight width: 1,
			e21 = small_rect13.right -> small_rect14.left shape: straight width: 1,
			e22 = small_rect14.right -> plus2.left shape: straight width: 1,
			e23 = plus2.right -> small_rect18.left shape: straight width: 1,
			e24 = small_rect18.right -> rect3.left shape: straight width: 1.5,
			e25 = rect3.right -> rect4.left shape: straight width: 1.5,
			e26 = e3.mid -> plus0.bottom curveHeight: 35 width: 1 edgeAnchorOffset: [-2,0],
			e27 = e10.mid -> small_rect15.left width: 1 edgeAnchorOffset: [-3,0],
			e28 = small_rect15.right -> plus1.bottom width: 1,
			e29 = e17.mid -> plus2.bottom curveHeight: 35 width: 1 edgeAnchorOffset: [-2,0]
		],
		groups: [
			row0 = members: [small_rect0, small_rect1, small_rect2, small_rect3, small_rect4] gap: 8 colorBoxAdjustments: (-20,-26.5,-20,-23) stroke.color: "black" stroke.style: dashed,
			row10 = members: [small_rect19, row0] gap: 20,
			row4 = members: [row10, plus0] gap: 14 marker.type: arrow marker.position: top marker.text: "2 x" marker.shift.top: -5 marker.shift.left: -2,
			row1 = members: [small_rect5, small_rect6, small_rect7, small_rect8, small_rect9] gap: 8 colorBoxAdjustments: (-20,-26.5,-20,-23) stroke.color: "black" stroke.style: dashed,
			row3 = members: [row1, small_rect15] layout: vertical,
			row5 = members: [small_rect16, row3] gap: 20,
			row7 = members: [row5, plus1] gap: 14,
			row2 = members: [small_rect10, small_rect11, small_rect12, small_rect13, small_rect14] gap: 8 colorBoxAdjustments: (-20,-26.5,-20,-23) stroke.color: "black" stroke.style: dashed,
			row9 = members: [small_rect17, row2] gap: 20,
			row11 = members: [row9, plus2] gap: 14 marker.type: arrow marker.position: top marker.text: "3 x" marker.shift.top: -5 marker.shift.left: 125 marker.shift.right: 15,
			row6 = members: [rect0, rect1, rect2] gap: 15,
			row8 = members: [small_rect18, rect3, rect4] gap: 15,
			rowFinal = members: [row6, row4, row7, row11, row8] layout: horizontal gap: 10
		]
	]
}


page
show a

`,
      },
      {
        id: "block14",
        title: "Triplet Loss architecture with Siamese network",
        userCode: `architecture a = {
	block TripletLossWithSiameseNetwork: [
		gap: 28,
		layout: horizontal,
		fontFamily: "Arial",
		nodes: [
			img0 = type: rect annotation.left: "Anchor" annotation.gap: 15 annotation.fontSize: 15 size: (75, 75) color: "#EDEDED",
			img1 = type: rect annotation.left: "Positive" annotation.gap: 15 annotation.fontSize: 15 size: (75, 75) color: "#EDEDED",
			img2 = type: rect annotation.left: "Negative" annotation.gap: 15 annotation.fontSize: 15 size: (75, 75) color: "#EDEDED",
			cnn0 = type: rect label.text: "CNN" label.fontSize: 26 label.fontWeight: 400 size: (90, 50) shape: rounded color: "#DCECF8",
			cnn1 = type: rect label.text: "CNN" label.fontSize: 26 label.fontWeight: 400 size: (90, 50) shape: rounded color: "#DCECF8",
			cnn2 = type: rect label.text: "CNN" label.fontSize: 26 label.fontWeight: 400 size: (90, 50) shape: rounded color: "#DCECF8",
			c0 = type: circle size: (12, 12) color: "#FF1E1E",
			c1 = type: circle size: (12, 12) color: "#1E5BDB",
			c2 = type: circle size: (12, 12) color: "#3F962E",
			c3 = type: circle size: (12, 12) color: "#F0E91C",
			c4 = type: circle size: (12, 12) color: "#FF1E1E",
			c5 = type: circle size: (12, 12) color: "#1E5BDB",
			c6 = type: circle size: (12, 12) color: "#3F962E",
			c7 = type: circle size: (12, 12) color: "#F0E91C",
			c8 = type: circle size: (12, 12) color: "#FF1E1E",
			c9 = type: circle size: (12, 12) color: "#1E5BDB",
			c10 = type: circle size: (12, 12) color: "#3F962E",
			c11 = type: circle size: (12, 12) color: "#F0E91C",
			tripletLoss = type: rect label.text: "Triplet Loss" label.fontSize: 20 label.fontWeight: 400 size: (130, 28) color: "#DCECF8"
		],
		edges: [
			e0 = img0.right -> cnn0.left shape: straight width: 1.2,
			e1 = img1.right -> cnn1.left shape: straight width: 1.2,
			e2 = img2.right -> cnn2.left shape: straight width: 1.2,
			e3 = cnn0.right -> embedCol0.left shape: straight width: 1.2,
			e4 = cnn1.right -> embedCol1.left shape: straight width: 1.2,
			e5 = cnn2.right -> embedCol2.left shape: straight width: 1.2,
			e6 = embedCol0.right -> tripletLoss.top shape: straight width: 1.2,
			e7 = embedCol1.right -> tripletLoss.left shape: straight width: 1.2,
			e8 = embedCol2.right -> tripletLoss.bottom shape: straight width: 1.2,
			e9 = cnn0.bottom -> cnn1.top label.text: "Shared  Weights" label.fontSize: 15 label.shift.left: 62 width: 5 bidirectional: true color: "#DCECF8",
			e10 = cnn1.bottom -> cnn2.top label.text: "Shared  Weights" label.fontSize: 15 label.shift.left: 62 width: 5 bidirectional: true color: "#DCECF8"
		],
		groups: [
			embedCol0 = members: [c0, c1, c2, c3] layout: vertical gap: 14 color: "#EAF3FA" colorBoxAdjustments: (-23,-30,-23,-30) stroke.color: "black" shape: rounded,
			embedCol1 = members: [c4, c5, c6, c7] layout: vertical gap: 14 color: "#EAF3FA" colorBoxAdjustments: (-23,-30,-23,-30) stroke.color: "black" shape: rounded,
			embedCol2 = members: [c8, c9, c10, c11] layout: vertical gap: 14 color: "#EAF3FA" colorBoxAdjustments: (-23,-30,-23,-30) stroke.color: "black" shape: rounded,
			row0 = members: [img0, cnn0, embedCol0] gap: 100 align: true,
			row1 = members: [img1, cnn1, embedCol1] gap: 100 align: true,
			row2 = members: [img2, cnn2, embedCol2] gap: 100 align: true,
			leftStack = members: [row0, row1, row2] layout: vertical gap: 70,
			final = members: [leftStack, tripletLoss] gap: 100 align: true
		]
	]
}


page
show a

`,
      },
      {
        id: "block15",
        title: "UNet",
        userCode: `architecture a = {
	block UNet: [
		layout: vertical,
		gap: 34,
		annotation.fontFamily: "Arial",
		annotation.fontWeight: 900,
		annotation.fontSize: 34,
		annotation.top: "UNet",
		annotation.gap: -40,
		fontFamily: "sans-serif",
		nodes: [
			a0 = type: rect annotation.left: "128x128" size: (1, 110) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			a1 = type: rect annotation.top: "64" annotation.gap: 0 size: (6, 110) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			a2 = type: rect annotation.top: "64" annotation.gap: 0 size: (6, 110) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			b0 = type: rect size: (4, 58) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			b1 = type: rect annotation.top: "128" annotation.gap: -3 size: (14, 58) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1,
			b2 = type: rect annotation.top: "128" annotation.gap: -3 size: (14, 58) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			c0 = type: rect size: (8, 25) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			c1 = type: rect annotation.top: "256" annotation.gap: -3 size: (20, 25) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			c2 = type: rect annotation.top: "256" annotation.gap: -3 size: (20, 25) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			d0 = type: rect size: (22, 22) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			d1 = type: rect annotation.top: "512" annotation.gap: -3 size: (56, 22) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			d2 = type: rect annotation.top: "512" annotation.gap: -3 size: (56, 22) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			e0 = type: rect size: (72, 16) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			e1 = type: rect annotation.top: "1024" annotation.gap: -3 size: (118, 16) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			e2 = type: rect size: (118, 16) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			f0 = type: rect annotation.top: "1024" annotation.gap: -3 size: (46, 20) stroke.color: "#C77D12" stroke.width: 1.3,
			f1 = type: rect size: (46, 20) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			f2 = type: rect annotation.top: "512" annotation.gap: -3 size: (56, 20) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			f3 = type: rect size: (56, 20) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			g0 = type: rect annotation.top: "512" annotation.gap: -3 size: (20, 25) stroke.color: "#C77D12" stroke.width: 1.3,
			g1 = type: rect size: (20, 25) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			g2 = type: rect annotation.top: "256" annotation.gap: -3 size: (20, 25) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			g3 = type: rect size: (20, 25) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			h0 = type: rect annotation.top: "256" annotation.gap: -3 size: (8, 58) stroke.color: "#C77D12" stroke.width: 1.3,
			h1 = type: rect size: (8, 58) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			h2 = type: rect annotation.top: "128" annotation.gap: -3 size: (14, 58) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1,
			h3 = type: rect size: (14, 58) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			i0 = type: rect annotation.top: "128" annotation.gap: 0 size: (5, 110) stroke.color: "#C77D12" stroke.width: 1.3,
			i1 = type: rect size: (5, 110) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			i2 = type: rect annotation.top: "64" annotation.gap: 0 size: (8, 110) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			i3 = type: rect annotation.top: "64" annotation.gap: 0 size: (8, 110) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3,
			i4 = type: rect annotation.top: "11" annotation.gap: 0 size: (8, 110) color: "#F39A1E" stroke.color: "#C77D12" stroke.width: 1.3
		],
		edges: [
			edge0 = a2.right -> i0.left width: 4 gap: 40 color: "#969696",
			edge28 = b2.right -> h0.left width: 4 gap: 40 color: "#969696",
			edge29 = c2.right -> g0.left width: 4 gap: 40 color: "#969696",
			edge30 = d2.right -> f0.left width: 4 gap: 40 color: "#969696",
			edge1 = a0.right -> a1.left shape: straight color: "#2A46BA",
			edge2 = a1.right -> a2.left shape: straight color: "#2A46BA",
			edge3 = a2.bottom -> b0.top label.text: "64x64" shape: straight width: 4 gap: 5 color: "#AF3331",
			edge4 = b0.right -> b1.left shape: straight color: "#2A46BA",
			edge5 = b1.right -> b2.left shape: straight color: "#2A46BA",
			edge6 = b2.bottom -> c0.top label.text: "32x32" shape: straight width: 4 gap: 5 color: "#AF3331",
			edge7 = c0.right -> c1.left shape: straight color: "#2A46BA",
			edge8 = c1.right -> c2.left shape: straight color: "#2A46BA",
			edge9 = c2.bottom -> d0.top label.text: "16x16" shape: straight width: 4 gap: 5 color: "#AF3331",
			edge10 = d0.right -> d1.left shape: straight color: "#2A46BA",
			edge11 = d1.right -> d2.left shape: straight color: "#2A46BA",
			edge12 = d2.bottom -> e0.top label.text: "8x8" shape: straight width: 4 gap: 5 color: "#AF3331",
			edge13 = e0.right -> e1.left shape: straight color: "#2A46BA",
			edge14 = e1.right -> e2.left shape: straight color: "#2A46BA",
			edge15 = e2.top -> f1.bottom label.text: "16x16" shape: straight width: 4 gap: 5 color: "#4B7C33",
			edge17 = f1.right -> f2.left shape: straight color: "#2A46BA",
			edge31 = f2.right -> f3.left shape: straight color: "#2A46BA",
			edge18 = f3.top -> g0.bottom label.text: "32x32" shape: straight width: 4 gap: 5 color: "#4B7C33",
			edge19 = g0.right -> g1.left shape: straight color: "#2A46BA",
			edge20 = g1.right -> g2.left shape: straight color: "#2A46BA",
			edge32 = g2.right -> g3.left shape: straight color: "#2A46BA",
			edge21 = g3.top -> h0.bottom label.text: "64x64" shape: straight width: 4 gap: 5 color: "#4B7C33",
			edge22 = h0.right -> h1.left shape: straight color: "#2A46BA",
			edge23 = h1.right -> h2.left shape: straight color: "#2A46BA",
			edge33 = h2.right -> h3.left shape: straight color: "#2A46BA",
			edge24 = h3.top -> i0.bottom label.text: "128x128" shape: straight width: 4 gap: 5 color: "#4B7C33",
			edge25 = i0.right -> i1.left shape: straight color: "#2A46BA",
			edge26 = i1.right -> i2.left shape: straight color: "#2A46BA",
			edge27 = i2.right -> i3.left shape: straight color: "#2A46BA",
			edge34 = i3.right -> i4.left shape: straight color: "#2A46BA"
		],
		groups: [
			row0 = members: [a0, a1, a2] layout: horizontal gap: 14,
			row1 = members: [b0, b1, b2] layout: horizontal gap: 14,
			row2 = members: [row0, row1] layout: vertical anchor.source: a2 anchor.target: b0,
			row3 = members: [c0, c1, c2] layout: horizontal gap: 14,
			row4 = members: [row2, row3] layout: vertical anchor.source: b2 anchor.target: c0,
			row5 = members: [d0, d1, d2] layout: horizontal gap: 14,
			row6 = members: [row4, row5] layout: vertical anchor.source: c2 anchor.target: d0,
			row7 = members: [e0, e1, e2] layout: horizontal gap: 14,
			row8 = members: [row6, row7] layout: vertical anchor.source: d2 anchor.target: e0,
			row17 = members: [f0, f1] gap: 0,
			row9 = members: [row17, f2, f3] layout: horizontal gap: 14,
			row10 = members: [row9, row8] layout: vertical gap: -352 anchor.source: f1 anchor.target: e2,
			row18 = members: [g0, g1] gap: 0,
			row11 = members: [row18, g2, g3] layout: horizontal gap: 14,
			row12 = members: [row11, row10] layout: vertical anchor.source: g0 anchor.target: f3,
			row19 = members: [h0, h1] gap: 0,
			row13 = members: [row19, h2, h3] layout: horizontal gap: 14,
			row14 = members: [row13, row12] layout: vertical anchor.source: h0 anchor.target: g3,
			row20 = members: [i0, i1] gap: 0,
			row15 = members: [row20, i2, i3, i4] layout: horizontal gap: 14,
			row16 = members: [row15, row14] layout: vertical anchor.source: i0 anchor.target: h3
		]
	],
	block rightBox: [
		fontFamily: "sans-serif",
		nodes: [
			rightBox0 = type: arrow annotation.right: "Conv (3 x3), RELU" color: "#2A46BA",
			rightBox1 = type: arrow annotation.right: "Max Pool (2 x 2)" color: "#AF3331",
			rightBox2 = type: arrow annotation.right: "De conv (2 x 2)" color: "#4B7C33",
			rightBox3 = type: arrow annotation.right: "Crop and\\nconcatenate" color: "#969696"
		]
	],
	diagram: [
		gap: -210,
		uses: [u = UNet anchor: f3, r = rightBox anchor: rightBox0]
	]
}


page
show a
`,
      },
      {
        id: "block16",
        title: "EfficientNet Architecture",
        userCode: `architecture a = {
	block EfficientNetVertical: [
		fontFamily: "Arial",
		nodes: [
			t0 = type: text label.text: "Input Image",
			n0 = type: rect label.text: "Conv 3 X 3" size: (150, 28) color: "#C9D8C6" stroke.color: "#B7C7B4" stroke.width: 1.1,
			n1 = type: rect label.text: "MBConv1, 3 X 3" size: (150, 28) color: "#EFEFEF" stroke.color: "#E3E3E3" stroke.width: 1.1,
			n2 = type: rect label.text: "MBConv6, 3 X 3" size: (150, 28) color: "#EEC9C9" stroke.color: "#E2B5B5" stroke.width: 1.1,
			n3 = type: rect label.text: "MBConv6, 3 X 3" size: (150, 28) color: "#EEC9C9" stroke.color: "#E2B5B5" stroke.width: 1.1,
			n4 = type: rect label.text: "MBConv6, 5 X 5" size: (195, 28) color: "#CFD8EC" stroke.color: "#C0CAE0" stroke.width: 1.1,
			n5 = type: rect label.text: "MBConv6, 5 X 5" size: (195, 28) color: "#CFD8EC" stroke.color: "#C0CAE0" stroke.width: 1.1,
			n6 = type: rect label.text: "MBConv6, 3 X 3" size: (150, 28) color: "#F0EF8D" stroke.color: "#E2E06F" stroke.width: 1.1,
			n7 = type: rect label.text: "MBConv6, 3 X 3" size: (150, 28) color: "#F0EF8D" stroke.color: "#E2E06F" stroke.width: 1.1,
			n8 = type: rect label.text: "MBConv6, 3 X 3" size: (150, 28) color: "#F0EF8D" stroke.color: "#E2E06F" stroke.width: 1.1,
			n9 = type: rect label.text: "MBConv6, 5 X 5" size: (190, 28) color: "#BCD0E8" stroke.color: "#A9C0DE" stroke.width: 1.1,
			n10 = type: rect label.text: "MBConv6, 5 X 5" size: (190, 28) color: "#BCD0E8" stroke.color: "#A9C0DE" stroke.width: 1.1,
			n11 = type: rect label.text: "MBConv6, 5 X 5" size: (190, 28) color: "#BCD0E8" stroke.color: "#A9C0DE" stroke.width: 1.1,
			n12 = type: rect label.text: "MBConv6, 5 X 5" size: (190, 28) color: "#A9CCE0" stroke.color: "#96BED5" stroke.width: 1.1,
			n13 = type: rect label.text: "MBConv6, 5 X 5" size: (190, 28) color: "#A9CCE0" stroke.color: "#96BED5" stroke.width: 1.1,
			n14 = type: rect label.text: "MBConv6, 5 X 5" size: (190, 28) color: "#A9CCE0" stroke.color: "#96BED5" stroke.width: 1.1,
			n15 = type: rect label.text: "MBConv6, 5 X 5" size: (190, 28) color: "#A9CCE0" stroke.color: "#96BED5" stroke.width: 1.1,
			n16 = type: rect label.text: "MBConv6, 3 X 3" size: (190, 28) color: "#F2C48F" stroke.color: "#E7B375" stroke.width: 1.1,
			t1 = type: text label.text: "Feature Map"
		],
		edges: [
			e0 = t0.bottom -> n0.top shape: straight headOnly: true color: "#4C9EDC",
			e1 = n16.bottom -> t1.top shape: straight headOnly: true color: "#4C9EDC"
		],
		groups: [
			g1 = members: [n1] layout: vertical marker.type: brace marker.color: "#666666" marker.position: right marker.text: "Block 1" marker.fontColor: "#666666" marker.fontSize: 15 marker.shift.top: -28 marker.shift.bottom: -28 marker.shift.left: -6 marker.shift.right: 15,
			g2 = members: [n2, n3] layout: vertical gap: 12 marker.type: brace marker.color: "#666666" marker.position: right marker.text: "Block 2" marker.fontColor: "#D6291F" marker.fontSize: 15 marker.shift.top: -28 marker.shift.bottom: -28 marker.shift.left: -6 marker.shift.right: 15,
			g3 = members: [n4, n5] layout: vertical gap: 12 marker.type: brace marker.color: "#666666" marker.position: right marker.text: "Block 3" marker.fontColor: "#1E4AA8" marker.fontSize: 15 marker.shift.top: -28 marker.shift.bottom: -28 marker.shift.left: -30 marker.shift.right: 15,
			g4 = members: [n6, n7, n8] layout: vertical gap: 12 marker.type: brace marker.color: "#666666" marker.position: right marker.text: "Block 4" marker.fontColor: "#B19B16" marker.fontSize: 15 marker.shift.top: -28 marker.shift.bottom: -28 marker.shift.left: -8 marker.shift.right: 15,
			g5 = members: [n9, n10, n11] layout: vertical gap: 12 marker.type: brace marker.color: "#666666" marker.position: right marker.text: "Block 5" marker.fontColor: "#1A2FCD" marker.fontSize: 15 marker.shift.top: -28 marker.shift.bottom: -28 marker.shift.left: -30 marker.shift.right: 15,
			g6 = members: [n12, n13, n14, n15] layout: vertical gap: 12 marker.type: brace marker.color: "#666666" marker.position: right marker.text: "Block 6" marker.fontColor: "#0F98A8" marker.fontSize: 15 marker.shift.top: -28 marker.shift.bottom: -28 marker.shift.left: -30 marker.shift.right: 15,
			g7 = members: [n16] layout: vertical marker.type: brace marker.color: "#666666" marker.position: right marker.text: "Block 7" marker.fontColor: "#B35A16" marker.fontSize: 15 marker.shift.top: -28 marker.shift.bottom: -28 marker.shift.left: -30 marker.shift.right: 15,
			final = members: [t0, n0, g1, g2, g3, g4, g5, g6, g7] layout: vertical
		]
	],
	diagram: [
		uses: [u = EfficientNetVertical],
		rotateRight: 3
	]
}


page
show a

`,
      },
      {
        id: "block17",
        title: "BiLSTM network",
        userCode: `architecture a = {
	block BiLSTM: [
		nodes: [
			circle0 = type: circle label.text: "x_t-1" annotation.left: "Inputs" annotation.gap: 45 annotation.fontWeight: 900 size: (35, 35),
			circle1 = type: circle label.text: "x_t" size: (35, 35),
			circle2 = type: circle label.text: "x_t+1" size: (35, 35),
			rect0 = type: rect label.text: "LSTM" label.fontFamily: "Arial" label.fontWeight: 900 label.fontStyle: italic shape: rounded,
			rect1 = type: rect label.text: "LSTM" label.fontFamily: "Arial" label.fontWeight: 900 label.fontStyle: italic shape: rounded,
			rect2 = type: rect label.text: "LSTM" label.fontFamily: "Arial" label.fontWeight: 900 label.fontStyle: italic shape: rounded,
			rect3 = type: rect label.text: "LSTM" label.fontFamily: "Arial" label.fontWeight: 900 label.fontStyle: italic shape: rounded,
			rect4 = type: rect label.text: "LSTM" label.fontFamily: "Arial" label.fontWeight: 900 label.fontStyle: italic shape: rounded,
			rect5 = type: rect label.text: "LSTM" label.fontFamily: "Arial" label.fontWeight: 900 label.fontStyle: italic shape: rounded,
			rect6 = type: rect label.text: "Concat" label.fontFamily: "Arial" label.fontSize: 11 size: (60, 28),
			rect7 = type: rect label.text: "Concat" label.fontFamily: "Arial" label.fontSize: 11 size: (60, 28),
			rect8 = type: rect label.text: "Concat" label.fontFamily: "Arial" label.fontSize: 11 size: (60, 28),
			circle3 = type: circle label.text: "y_t-1" annotation.left: "outputs" annotation.gap: 105 annotation.fontWeight: 900 size: (35, 35),
			circle4 = type: circle label.text: "y_t" size: (35, 35),
			circle5 = type: circle label.text: "y_t+1" size: (35, 35),
			empty0 = type: rect color: "transparent" stroke.color: "transparent",
			empty1 = type: rect color: "transparent" stroke.color: "transparent",
			empty2 = type: rect color: "transparent" stroke.color: "transparent",
			empty3 = type: rect color: "transparent" stroke.color: "transparent"
		],
		groups: [
			x = members: [circle0, circle1, circle2] gap: 115 shift.right: 4,
			row3 = members: [empty0, rect0] gap: 30,
			lstmX = members: [row3, rect1, rect2, empty1] gap: 90 shift.right: 35,
			row1 = members: [rect5, empty3] gap: 30,
			lstmY = members: [empty2, rect3, rect4, row1] gap: 90 shift.right: 70,
			concat = members: [rect6, rect7, rect8] gap: 80 shift.right: 60,
			y = members: [circle3, circle4, circle5] gap: 105 shift.right: 60,
			row0 = members: [y, concat] layout: vertical gap: 30,
			row2 = members: [row0, lstmY] layout: vertical gap: 60,
			rowFinal = members: [row2, lstmX, x] layout: vertical gap: 30
		],
		edges: [
			e0 = circle0.top -> rect0.bottom shape: straight width: 1.75,
			e1 = circle0.top -> rect3.bottom shape: straight width: 1.75,
			e2 = empty0.right -> rect0.left shape: straight width: 1.75,
			e3 = rect0.right -> rect1.left shape: straight width: 1.75,
			e4 = rect1.right -> rect2.left shape: straight width: 1.75,
			e5 = rect2.right -> empty1.left label.text: "Forward" label.fontWeight: 900 label.shift.bottom: 25 shape: straight,
			e6 = circle1.top -> rect1.bottom shape: straight width: 1.75,
			e7 = circle1.top -> rect4.bottom shape: straight width: 1.75,
			e8 = circle2.top -> rect2.bottom shape: straight width: 1.75,
			e9 = circle2.top -> rect5.bottom shape: straight width: 1.75,
			e10 = rect0.top -> rect6.bottom label.text: "h_t-1" label.shift.top: 30 label.shift.left: 20 shape: straight width: 1.75,
			e11 = rect1.top -> rect7.bottom label.text: "h_t" label.shift.top: 28 label.shift.left: 20 shape: straight width: 1.75,
			e12 = rect2.top -> rect8.bottom label.text: "h_t+1" label.shift.top: 28 label.shift.left: 28 shape: straight width: 1.75,
			e13 = rect3.top -> rect6.bottom label.text: "h_t-1" label.shift.bottom: 10 label.shift.right: 10 shape: straight width: 1.75,
			e14 = rect4.top -> rect7.bottom label.text: "h_t" label.shift.bottom: 10 label.shift.right: 10 shape: straight width: 1.75,
			e15 = rect5.top -> rect8.bottom label.text: "h_t+1" label.shift.bottom: 10 label.shift.right: 10 shape: straight width: 1.75,
			e16 = empty3.left -> rect5.right shape: straight width: 1.75,
			e17 = rect5.left -> rect4.right shape: straight width: 1.75,
			e18 = rect4.left -> rect3.right shape: straight width: 1.75,
			e19 = rect3.left -> empty2.right label.text: "Backward" label.fontWeight: 900 label.shift.left: 25 shape: straight width: 1.75,
			e20 = rect6.top -> circle3.bottom shape: straight width: 1.75,
			e21 = rect7.top -> circle4.bottom shape: straight width: 1.75,
			e22 = rect8.top -> circle5.bottom shape: straight width: 1.75
		]
	]
}


page
show a

`,
      },
      {
        id: "block18",
        title: "LSTM",
        userCode: `architecture a = {
	block LSTMCell: [
		fontFamily: "Helvetica",
		nodes: [
			ct_prev = type: rect label.text: "C_t-1" label.fontSize: 28 label.fontWeight: 100 label.fontStyle: italic size: (70, 34) color: "#D9D7A8" stroke.color: "transparent",
			ht_prev = type: rect label.text: "h_t-1" label.fontSize: 28 label.fontWeight: 100 label.fontStyle: italic size: (70, 34) color: "#D9D9D9" stroke.color: "transparent",
			xt = type: circle label.text: "x_t" label.fontSize: 24 label.fontWeight: 100 label.fontStyle: italic size: (34, 34) color: "#BFEFE9" stroke.color: "transparent",
			sigma0 = type: rect label.text: "σ" label.fontSize: 22 label.fontWeight: 100 size: (52, 34) shape: rounded color: "#FF8F97" stroke.color: "transparent",
			sigma1 = type: rect label.text: "σ" label.fontSize: 22 label.fontWeight: 100 size: (52, 34) shape: rounded color: "#FF8F97" stroke.color: "transparent",
			tanh0 = type: rect label.text: "tanh" label.fontSize: 22 label.fontWeight: 100 size: (64, 34) shape: rounded color: "#FF8F97" stroke.color: "transparent",
			sigma2 = type: rect label.text: "σ" label.fontSize: 22 label.fontWeight: 100 size: (52, 34) shape: rounded color: "#FF8F97" stroke.color: "transparent",
			tanh1 = type: rect label.text: "tanh" label.fontSize: 22 label.fontWeight: 100 size: (64, 34) shape: rounded color: "#FF8F97" stroke.color: "transparent",
			x0 = type: circle label.text: "×" label.fontSize: 30 label.fontWeight: 100 size: (28, 28) color: "#FF2E71" stroke.color: "transparent",
			x1 = type: circle label.text: "×" label.fontSize: 30 label.fontWeight: 100 size: (28, 28) color: "#FF2E71" stroke.color: "transparent",
			plus = type: circle label.text: "+" label.fontSize: 30 label.fontWeight: 100 size: (28, 28) color: "#FF2E71" stroke.color: "transparent",
			x2 = type: circle label.text: "×" label.fontSize: 30 label.fontWeight: 100 size: (28, 28) color: "#FF2E71" stroke.color: "transparent",
			ct = type: rect label.text: "C_t" label.fontSize: 28 label.fontWeight: 100 label.fontStyle: italic size: (70, 34) color: "#D9D7A8" stroke.color: "transparent",
			ht = type: rect label.text: "h_t" label.fontSize: 28 label.fontWeight: 100 label.fontStyle: italic size: (70, 34) color: "#D9D9D9" stroke.color: "transparent",
			ht_top = type: rect label.text: "h_t" label.fontSize: 28 label.fontWeight: 100 label.fontStyle: italic size: (70, 34) color: "#D9D9D9" stroke.color: "transparent"
		],
		groups: [
			forget_col = members: [x2, sigma0] layout: vertical gap: 107 color: "#D9EBE7" colorBoxAdjustments: (-15,-20,20,-20) annotation.top: "Forget gate" annotation.gap: -20,
			input_mix = members: [plus, x1] layout: vertical gap: 40,
			input_col = members: [input_mix, tanh0] layout: vertical gap: 40,
			output_col = members: [tanh1, x0] layout: vertical shift.top: 100 shift.left: 10,
			row2 = members: [sigma1, input_col] gap: 30 color: "#EBEADF" colorBoxAdjustments: (-15,-20,20,-20) annotation.top: "Input gate" annotation.gap: -25,
			row3 = members: [sigma2, output_col] color: "#CCF1DF" colorBoxAdjustments: (120,-20,-28,-20) annotation.top: "Output gate" annotation.gap: -25,
			core_row = members: [forget_col, row2, row3] gap: 30 color: "#F2F2F2" colorBoxAdjustments: (10,20,-20,20) stroke.color: "black" stroke.style: dashed stroke.width: 4 shape: rounded,
			left_io = members: [ct_prev, ht_prev] layout: vertical gap: 150,
			main_with_left = members: [left_io, core_row] gap: 80 anchor.source: ct_prev anchor.target: x2,
			right_io = members: [ct, ht] layout: vertical gap: 140,
			main_with_right = members: [main_with_left, right_io] gap: 80 anchor.source: ct anchor.target: plus annotation.top: "LSTM Memory Cell" annotation.gap: 10 annotation.fontSize: 14 annotation.fontWeight: 900,
			row0 = members: [ht_top] shift.right: 220,
			row1 = members: [xt] layout: vertical shift.top: 40 shift.left: 200,
			final_layout = members: [row0, main_with_right, row1] layout: vertical gap: 80
		],
		edges: [
			e0 = ht_prev.right -> sigma2.bottom width: 3,
			e1 = xt.top -> e0.mid width: 3 arrowheads: 0,
			e2 = sigma0.top -> x2.bottom shape: straight width: 3,
			e3 = ct_prev.right -> x2.left shape: straight width: 3 arrowheads: 0,
			e4 = x2.right -> plus.left shape: straight width: 3 arrowheads: 0,
			e5 = plus.right -> ct.left shape: straight width: 3,
			e6 = sigma1.top -> x1.left width: 3,
			e7 = tanh0.top -> x1.bottom shape: straight width: 3,
			e8 = sigma2.top -> x0.left width: 3,
			e9 = tanh1.bottom -> x0.top shape: straight width: 3,
			e10 = x0.bottom -> ht.left width: 3,
			e11 = e10.mid -> ht_top.bottom shape: straight width: 3 edgeAnchorOffset: [40,0],
			e12 = e5.end -> tanh1.top shape: straight width: 3 edgeAnchorOffset: [-119,0],
			e13 = e0.mid -> sigma0.bottom shape: straight width: 3 arrowheads: 0 edgeAnchorOffset: [-89,0],
			e14 = e0.mid -> sigma1.bottom shape: straight width: 3 arrowheads: 0 edgeAnchorOffset: [-7,10],
			e15 = e0.mid -> tanh0.bottom shape: straight width: 3 arrowheads: 0 edgeAnchorOffset: [81,10]
		]
	]
}


page
show a



`,
      },
      {
        id: "block19",
        title: "Swin transformer",
        userCode: `architecture a = {
	block A: [
		layout: horizontal,
		fontFamily: "Times New Roman",
		annotation.bottom: "(a) Architecture",
		annotation.fontFamily: "Arial",
		annotation.gap: 10,
		gap: 35,
		nodes: [
			node0 = type: rect label.text: "Images" annotation.top: "H \\\\mul W \\\\mul 3" annotation.gap: -3 size: (55, 40) stroke.width: 1.75,
			node1 = type: rect label.text: "Patch Partition" label.orientation: (vertical,left) size: (25, 118) shape: rounded stroke.width: 1.75,
			node2 = type: rect label.text: "Linear Embedding" label.orientation: (vertical,left) size: (25, 118) shape: rounded stroke.width: 1.75,
			node3a = type: rect label.text: "Swin\\nTransformer\\nBlock" annotation.bottom: "\\\\mul2" annotation.top: "Stage 1" annotation.top.shift.top: 5 annotation.top.shift.left: 20 annotation.gap: 4 size: (75, 100) shape: rounded stroke.width: 1.75,
			node4a = type: rect label.text: "Patch Merging" label.orientation: (vertical,left) size: (25, 118) shape: rounded stroke.width: 1.75,
			node3b = type: rect label.text: "Swin\\nTransformer\\nBlock" annotation.bottom: "\\\\mul2" annotation.top: "Stage 2" annotation.top.shift.top: 5 annotation.top.shift.left: 20 annotation.gap: 4 size: (75, 100) shape: rounded stroke.width: 1.75,
			node4b = type: rect label.text: "Patch Merging" label.orientation: (vertical,left) size: (25, 118) shape: rounded stroke.width: 1.75,
			node3c = type: rect label.text: "Swin\\nTransformer\\nBlock" annotation.bottom: "\\\\mul6" annotation.top: "Stage 3" annotation.top.shift.top: 5 annotation.top.shift.left: 20 annotation.gap: 4 size: (75, 100) shape: rounded stroke.width: 1.75,
			node4c = type: rect label.text: "Patch Merging" label.orientation: (vertical,left) size: (25, 118) shape: rounded stroke.width: 1.75,
			node3d = type: rect label.text: "Swin\\nTransformer\\nBlock" annotation.bottom: "\\\\mul2" annotation.top: "Stage 4" annotation.top.shift.top: 5 annotation.top.shift.left: 20 annotation.gap: 4 size: (75, 100) shape: rounded stroke.width: 1.75,
			empty0 = type: rect color: "transparent" stroke.color: "transparent"
		],
		edges: [
			e0 = node0.right -> node1.left shape: straight,
			e1 = node1.right -> node2.left shape: straight,
			e2 = node2.right -> node3a.left shape: straight,
			e3 = node3a.right -> node4a.left shape: straight,
			e4 = node4a.right -> node3b.left shape: straight,
			e5 = node3b.right -> node4b.left shape: straight,
			e6 = node4b.right -> node3c.left shape: straight,
			e7 = node3c.right -> node4c.left shape: straight,
			e8 = node4c.right -> node3d.left shape: straight,
			e9 = node3d.right -> empty0.left shape: straight
		],
		groups: [
			row0 = members: [node2, node3a] gap: 15 colorBoxAdjustments: (-5,-25,-15,-20) stroke.color: "black" stroke.style: dashed shape: rounded annotation.top: "H/4 \\\\mul W/4 \\\\mul 48" annotation.top.shift.bottom: 6 annotation.top.shift.left: 65,
			row1 = members: [node4a, node3b] gap: 15 colorBoxAdjustments: (-5,-25,-15,-20) stroke.color: "black" stroke.style: dashed shape: rounded annotation.top: "H/4 \\\\mul W/4 \\\\mul C" annotation.top.shift.bottom: 6 annotation.top.shift.left: 65,
			row2 = members: [node4b, node3c] gap: 15 colorBoxAdjustments: (-5,-25,-15,-20) stroke.color: "black" stroke.style: dashed shape: rounded annotation.top: "H/8 \\\\mul W/8 \\\\mul 2C" annotation.top.shift.bottom: 6 annotation.top.shift.left: 65,
			row3 = members: [node4c, node3d] gap: 15 colorBoxAdjustments: (-5,-25,-15,-20) stroke.color: "black" stroke.style: dashed shape: rounded annotation.top: "H/16 \\\\mul W/16 \\\\mul 4C" annotation.top.shift.bottom: 6 annotation.top.shift.left: 65 annotation.bottom: "H/32 \\\\mul W/32 \\\\mul 8C" annotation.bottom.shift.top: 181 annotation.bottom.shift.right: 50,
			row5 = members: [node0, node1] gap: 15,
			row8 = members: [row5, row0, row1, row2, row3] gap: 30 align: true,
			row6 = members: [row8, empty0] gap: 20
		]
	],
	block B: [
		layout: horizontal,
		fontFamily: "Times New Roman",
		annotation.bottom: "(b) Two Successive Swin Transformer Blocks",
		annotation.fontFamily: "Arial",
		annotation.gap: -50,
		nodes: [
			ln1a = type: rect label.text: "LN" size: (52, 26) color: "#D9E6D3",
			wmsa = type: rect label.text: "W-MSA" size: (52, 26) color: "#D9B3CF",
			add1a = type: circle label.text: "+" label.fontFamily: "Helvetica" label.fontSize: 33 label.fontWeight: 100 annotation.left: "z^l" annotation.fontWeight: 900 size: (18, 18),
			ln2a = type: rect label.text: "LN" size: (52, 26) color: "#D9E6D3",
			mlp1 = type: rect label.text: "MLP" size: (52, 26) color: "#C7D8F0",
			add2a = type: circle label.text: "+" label.fontFamily: "Helvetica" label.fontSize: 33 label.fontWeight: 100 annotation.left: "z^l+1" annotation.gap: -3 annotation.fontWeight: 900 size: (18, 18),
			ln1b = type: rect label.text: "LN" size: (52, 26) color: "#D9E6D3",
			swmsa = type: rect label.text: "SW-MSA" size: (52, 26) color: "#D9B3CF",
			add1b = type: circle label.text: "+" label.fontFamily: "Helvetica" label.fontSize: 33 label.fontWeight: 100 annotation.left: "ẑ^l" annotation.fontWeight: 900 size: (18, 18),
			ln2b = type: rect label.text: "LN" size: (52, 26) color: "#D9E6D3",
			mlp2 = type: rect label.text: "MLP" size: (52, 26) color: "#C7D8F0",
			add2b = type: circle label.text: "+" label.fontFamily: "Helvetica" label.fontSize: 33 label.fontWeight: 100 annotation.left: "ẑ^l+1" annotation.gap: -3 annotation.fontWeight: 900 size: (18, 18),
			empty0 = type: rect color: "transparent" stroke.color: "transparent",
			empty1 = type: rect color: "transparent" stroke.color: "transparent"
		],
		edges: [
			e0 = ln1b.top -> wmsa.bottom shape: straight width: 1.5,
			e15 = empty0.top -> ln1b.bottom label.text: "z^l-1" label.fontWeight: 900 label.shift.left: 35 shape: straight width: 1.5,
			e1 = wmsa.top -> add1b.bottom shape: straight width: 1.5 arrowheads: 0,
			e2 = add1b.top -> ln1a.bottom shape: straight width: 1.5,
			e3 = ln1a.top -> mlp1.bottom shape: straight width: 1.5,
			e4 = mlp1.top -> add1a.bottom shape: straight width: 1.5 arrowheads: 0,
			e6 = e15.mid -> add1b.right curveHeight: -25 width: 1.5 edgeAnchorOffset: [5,0],
			e7 = e2.mid -> add1a.right curveHeight: -25 width: 1.5,
			e5 = add1a.top -> ln2b.bottom label.text: "z^l" label.fontWeight: 900 label.shift.bottom: 127 label.shift.right: 30 width: 1.5,
			e9 = e5.end -> add2b.right curveHeight: -57 width: 1.5 edgeAnchorOffset: [-7,0],
			e8 = ln2b.top -> swmsa.bottom shape: straight width: 1.5,
			e10 = swmsa.top -> add2b.bottom shape: straight width: 1.5 arrowheads: 0,
			e11 = add2b.top -> ln2a.bottom shape: straight width: 1.5,
			e12 = ln2a.top -> mlp2.bottom shape: straight width: 1.5,
			e13 = mlp2.top -> add2a.bottom shape: straight width: 1.5 arrowheads: 0,
			e14 = e11.mid -> add2a.right curveHeight: -25 width: 1.5,
			e16 = add2a.top -> empty1.bottom shape: straight width: 1.5
		],
		groups: [
			row0 = members: [add1a, mlp1, ln1a, add1b, wmsa, ln1b] layout: vertical gap: 20 colorBoxAdjustments: (-25,5,-5,-10) stroke.color: "black" stroke.style: dashed shape: rounded,
			row1 = members: [add2a, mlp2, ln2a, add2b, swmsa, ln2b] layout: vertical gap: 20 colorBoxAdjustments: (-25,5,-5,-10) stroke.color: "black" stroke.style: dashed shape: rounded,
			row3 = members: [row0, empty0] layout: vertical gap: 30,
			row4 = members: [empty1, row1] layout: vertical gap: 20,
			row2 = members: [row3, row4] layout: horizontal gap: 100 anchor.source: wmsa anchor.target: swmsa align: true
		]
	],
	diagram: [
		uses: [a = A anchor: node0, b = B anchor: wmsa],
		gap: -140
	]
}


page
show a



`,
      },
    ],
  },

  {
    groupName: "Old LeetCode Problems",
    items: [
      {
        id: "Fibonacci",
        title: "Fibonacci",
        userCode: `// Fibonacci sequence
array arr1 = {
	value: [1]
}


page
show arr1

page
arr1.addValue(1)

page
arr1.addValue(2)`,
      },
      {
        id: "LCAofTree",
        title: "LCA in a tree",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E, F, G]
	value: [1, 2, 3, 4, 5, 6, 7]
	color: [null, null, "blue", null, "blue", null, null]
	children: [A-B, A-C, B-D, B-E, C-F, C-G]
}

page
show tr1`,
      },
      {
        id: "DepthFirstSearch",
        title: "Depth First Search",
        userCode: `graph dfs = {
	nodes: [n1, n2, n3, n4, n5, n6, n7, n8]
	edges: [n1-n2, n1-n6, n1-n7, n2-n3, n3-n7, n3-n5, n4-n5, n4-n6, n4-n8]
	color: ["red", null, null, null, null, null, null, null]
	arrow: ["start", null, null, null, null, null, null, null]
}

page
show dfs

page
dfs.setColor(0, "blue")
dfs.setColor(1, "red")
dfs.setArrow(0, null)
dfs.setArrow(1, "cur")

page
dfs.setColor(1, "blue")
dfs.setColor(2, "red")
dfs.setArrow(1, null)
dfs.setArrow(2, "cur")

page
dfs.setColor(2, "blue")
dfs.setColor(4, "red")
dfs.setArrow(2, null)
dfs.setArrow(4, "cur")`,
      },
      {
        id: "NumbersOfIslands",
        title: "Numbers of Islands",
        userCode: `matrix mr1 = {
	value: [[0, 0, 1, 0], [0, 1, 1, 0], [1, 0, 0, 0], [0, 0, 1, 1]]
	color: [[null, null, "red", null]]
}

page
show mr1`,
      },
      {
        id: "ValidBrackets",
        title: "Valid Brackets",
        userCode: `array arr = {
	value: ["{", "{", "{", "}", "{", "}", "}", "{"]
	color: ["", "", "", "", "", "", "", ""]
}
stack stk = {
	value: ["{"]
	color: [""]
}

page
show arr
show stk`,
      },
      {
        id: "01Matrix",
        title: "01 - Matrix",
        userCode: `matrix mr1 = {
	value: [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1]]
	color: [[null, null, "red", null, null], [null, null, "red", null, null], ["red", null, null, null, null], [null, null, null, null, "red"], [null, null, null, null, "red"]]
}

page
show mr1

page
mr1.setColors([[null, "blue", "red", "blue", null], ["blue", "blue", "red", "blue", null], ["red", "blue", "blue", null, "blue"], ["blue", null, null, "blue", "red"], [null, null, null, "blue", "red"]])

page
mr1.setColors([["green", "blue", "red", "blue", "green"], ["blue", "blue", "red", "blue", "green"], ["red", "blue", "blue", "green", "blue"], ["blue", "green", "green", "blue", "red"], ["green", "green", "green", "blue", "red"]])`,
      },
      {
        id: "132Pattern",
        title: "132 - Pattern",
        userCode: `array arr1 = {
	value: [6, 12, 3, 4, 6, 11, 20]
	color: ["orange", "orange", "orange", "orange", "orange", "orange", "orange"]
}
array arr2 = {
	value: [6, 6, 3, 3, 3, 3, 3]
	color: ["green", "green", "green", "green", "green", "green", "green"]
}
stack stk = {
	value: [20]
}

page 2x2
show arr1
show arr2
show stk bottom

page
arr1.setColor(4, "yellow")
arr2.setColor(4, "yellow")
stk.insertValue(0, 11)

page
arr1.setColor(3, "yellow")
arr1.setColor(4, "orange")
arr2.setColor(3, "yellow")
arr2.setColor(4, "green")
stk.insertValue(0, 6)

page
arr1.setColor(2, "yellow")
arr1.setColor(3, "orange")
arr2.setColor(2, "yellow")
arr2.setColor(3, "green")
stk.insertValue(0, 4)

page
arr1.setColor(1, "yellow")
arr1.setColor(2, "orange")
arr2.setColor(1, "yellow")
arr2.setColor(2, "green")
stk.removeValue(4)`,
      },
      {
        id: "3sum",
        title: "3 Sum",
        userCode: `array arr = {
	value: [4, 1, 1, 0, 1, 2]
	arrow: ["i", null, null, null, null, null]
}

page
show arr

page
arr.setArrow(1, "lo")
arr.setArrow(5, "hi")

page
arr.setArrow(1, null)
arr.setArrow(2, "lo")

page
arr.setArrow(2, null)
arr.setArrow(3, "lo")

page
arr.setArrow(3, null)
arr.setArrow(4, "lo")

page
arr.setArrow(0, null)
arr.setArrow(1, "i")
arr.setArrow(4, null)
arr.setArrow(5, null)

page
arr.setArrow(2, "lo")
arr.setArrow(5, "hi")

page
arr.setColor(1, "green")
arr.setColor(2, "green")
arr.setColor(5, "green")
arr.setArrow(1, "i")
arr.setArrow(2, "lo")
arr.setArrow(5, "hi")`,
      },
      {
        id: "04",
        title: "Arithmetic Slices",
        userCode: `array arr1 = {
	value: [1,3,5,6,10,15,20,25,28,29]
	color: [null,null,null,null,null,null,null,null,null,null]
}
array arr2 = {
	value: [0,0,0,0,0,0,0,0,0,0]
	color: [null,null,null,null,null,null,null,null,null,null]
}

page
show arr1
show arr2
page
arr1.setColors(["green","green","green",null,null,null,null,null,null,null])
arr2.setValue(2, 1)
arr2.setColor(2, "yellow")
page
arr1.setColors([null,"green","green","green",null,null,null,null,null,null])
arr2.setValue(3, 2)
arr2.setColor(2, null)
arr2.setColor(3, "yellow")
page
arr1.setColors([null,null,"green","green","green",null,null,null,null,null])
arr2.setValue(4, 3)
arr2.setColor(3, null)
arr2.setColor(4, "yellow")
page
arr1.setColors([null,null,null,null,"green","green","green",null,null,null])
arr2.setColor(4, null)
arr2.setColor(6, "yellow")
page
arr1.setColors([null,null,null,null,null,"green","green","green",null,null])
arr2.setValue(7, 1)
arr2.setColor(6, null)
arr2.setColor(7, "yellow")
page
arr1.setColors([null,null,null,null,null,null,"green","green","green",null])
arr2.setColor(7, null)
arr2.setColor(8, "yellow")
arr2.setValue(7, 0)
page
arr1.setColors([null,null,null,null,null,null,null,"green","green","green"])
arr2.setColor(8, null)
arr2.setColor(9, "yellow")`,
      },
      {
        id: "05",
        title: "Binary Subarrays With Sum",
        userCode: `array arr1 = {
	value: [1, 0, 1, 0, 1]
	color: ["blue", null, null, null, null]
}
stack stk = {
	value: [1]
}

page
show arr1
show stk

page
arr1.setColor(1, "blue")
arr1.setArrow(1, "cur")
stk.setValue(0, 2)

page
arr1.setColor(2, "blue")
arr1.setArrow(1, null)
arr1.setArrow(2, "cur")
stk.setValues([1, 2])

page
arr1.setColor(3, "blue")
arr1.setArrow(2, null)
arr1.setArrow(3, "cur")
stk.setValues([2, 2])

page
arr1.setColor(4, "blue")
arr1.setArrow(3, null)
arr1.setArrow(4, "cur")
stk.setValues([1, 2, 2])`,
      },
      {
        id: "06",
        title: "Building With an Ocean View",
        userCode: `array arr1 = {
	value: [5, 3, 2, 4, 1, 1]
	color: ["green", "blue", "blue", "blue", "blue", "blue"]
	arrow: ["cur", null, null, null, null, null]
}
array arr2 = {
	value: [0]
	color: ["orange"]
}

page
show arr1
show arr2

page
arr1.setColor(0, "green")
arr1.setColor(1, "green")
arr1.setArrow(0, null)
arr1.setArrow(1, "cur")
arr2.addValue(1)
arr2.setColor(1, "orange")

page
arr1.setColor(1, "green")
arr1.setColor(2, "green")
arr1.setArrow(1, null)
arr1.setArrow(2, "cur")
arr2.addValue(2)
arr2.setColor(2, "orange")

page
arr1.setArrow(2, null)
arr1.setArrow(3, "cur")`,
      },
      {
        id: "07",
        title: "Checking Existence of Edge Length Limited Paths",
        userCode: `graph dfs = {
	nodes: [n1, n2, n3, n4, n5, n6]
	edges: [n1-n5, n1-n4, n2-n4, n2-n3]
	hidden: [false, false, false, false, false, false]
}

page
show dfs

page
dfs.removeEdge(n1-n5)
dfs.removeEdge(n1-n4)
dfs.removeEdge(n2-n4)

page
dfs.addEdge(n1-n4)

page
dfs.addEdge(n1-n5)

page
dfs.removeEdge(n1-n5)

page
dfs.addEdge(n1-n5)
dfs.addEdge(n2-n5)`,
      },
      {
        id: "08",
        title: "Construct Binary Search Tree From Preorder Traversal",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E]
	value: [8, 5, 10, 1, 7]
	color: [null, null, null, null, "blue"]
	arrow: [null, null, null, "nd", null]
	children: [A-B, A-C, B-D, B-E]
}

page
show tr1

page
tr1.setColor(1, "blue")
tr1.setColor(4, "green")
tr1.setArrow(1, "nd")
tr1.setArrow(3, null)

page
tr1.setColor(1, null)
tr1.setColor(4, "blue")
tr1.setArrow(1, null)
tr1.setArrow(4, "nd")

page
tr1.setColor(0, "blue")
tr1.setColor(4, null)
tr1.setArrow(0, "nd")
tr1.setArrow(4, null)

page
tr1.setColor(2, "green")
tr1.setArrow(0, "nd")`,
      },
      {
        id: "10",
        title: "Construct Binary Tree From Inorder and Postorder Traversal",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E]
	value: [3, 9, 20, 15, 7]
	color: [null, null, null, null, null]
	children: [A-B, A-C, C-D, C-E]
}

page
show tr1

page
tr1.setColor(0, "blue")

page
tr1.setColor(2, "blue")

page
tr1.setColor(4, "blue")

page
tr1.setColor(3, "blue")

page
tr1.setColor(1, "blue")`,
      },
      {
        id: "11",
        title: "Count Nice Pairs in an Array",
        userCode: `array arr1 = {
	value: [7, 3, 4, 4, 2, 4, 3, 3]
	color: [null, null, null, null, null, null, null, null]
}

page
show arr1
arr1.setColor(0, "green")

page
arr1.setColor(0, null)
arr1.setColor(1, "green")

page
arr1.setColor(1, null)
arr1.setColor(2, "green")

page
arr1.setColor(2, "blue")
arr1.setColor(3, "green")

page
arr1.setColor(2, null)
arr1.setColor(3, null)
arr1.setColor(4, "green")

page
arr1.setColor(4, null)
arr1.setColors([null, null, "blue", "blue", null, "green", null, null])

page
arr1.setColors([null, "blue", null, null, null, null, "green", null])

page
arr1.setColor(6, "blue")
arr1.setColor(7, "green")`,
      },
      {
        id: "12",
        title: "Count Pairs in Two Arrays",
        userCode: `array arr1 = {
	value: [2, 1, 0, 1, 2, 4]
	color: [null, "yellow", null, "green", null, "yellow"]
	arrow: ["i", "left", null, "mid", null, "right"]
}

page
show arr1
page

page
arr1.setColor(1, null)
arr1.setColor(3, null)
arr1.setColor(4, "yellow")
arr1.setArrow(1, null)
arr1.setArrow(3, null)
arr1.setArrow(4, "leftMid")

page
arr1.setColor(4, null)
arr1.setArrow(4, null)
arr1.setArrow(5, "leftMidRight")

page
arr1.setColor(4, "yellow")
arr1.setColor(5, "green")
arr1.setArrow(4, "right")
arr1.setArrow(5, "leftMid")`,
      },
      {
        id: "13",
        title: "Count Strictly Increasing Subarrays",
        userCode: `array arr1 = {
	value: [1, 3, 5, 4, 4, 6]
	color: ["orange", null, null, null, null, null]
}
array arr2 = {
	value: [0, 1, 2, 3, 4, 5]
	color: ["orange", null, null, null, null, null]
}

page
show arr1
show arr2

page
arr1.setColor(0, null)
arr1.setColor(1, "orange")
arr2.setColor(0, null)
arr2.setColor(1, "orange")

page
arr1.setColor(1, null)
arr1.setColor(2, "orange")
arr2.setColor(1, null)
arr2.setColor(2, "orange")

page
arr1.setColor(2, null)
arr1.setColor(3, "orange")
arr2.setColor(2, null)
arr2.setColor(3, "orange")

page
arr1.setColor(3, null)
arr1.setColor(4, "orange")
arr2.setColor(3, null)
arr2.setColor(4, "orange")

page
arr1.setColor(4, null)
arr1.setColor(5, "orange")
arr2.setColor(4, null)
arr2.setColor(5, "orange")`,
      },
      {
        id: "14",
        title: "Binary Tree Preorder Traversal",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E, F, G]
	value: [1, 2, 3, 4, 5, 6, 7]
	children: [A-B, A-C, B-D, B-E, C-F, C-G]
}

page
show tr1

page
tr1.setColor(0, "blue")

page
tr1.setColor(1, "blue")

page
tr1.setColor(2, "blue")

page
tr1.setColor(3, "blue")

page
tr1.setColor(4, "blue")

page
tr1.setColor(5, "blue")

page
tr1.setColor(6, "blue")`,
      },
      {
        id: "15",
        title: "Binary Tree Inorder Traversal",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E, F, G]
	value: [1, 2, 3, 4, 5, 6, 7]
	children: [A-B, A-C, B-D, B-E, C-F, C-G]
}

page
show tr1

page
tr1.setColor(3, "red")

page
tr1.setColor(1, "red")

page
tr1.setColor(4, "red")

page
tr1.setColor(0, "red")

page
tr1.setColor(5, "red")

page
tr1.setColor(2, "red")

page
tr1.setColor(6, "red")`,
      },
      {
        id: "16",
        title: "Binary Tree Postorder Traversal",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E, F, G]
	value: [1, 2, 3, 4, 5, 6, 7]
	children: [A-B, A-C, B-D, B-E, C-F, C-G]
}

page
show tr1
tr1.setColor(3, "purple")

page
tr1.setColor(4, "purple")

page
tr1.setColor(1, "purple")

page
tr1.setColor(5, "purple")

page
tr1.setColor(6, "purple")

page
tr1.setColor(2, "purple")

page
tr1.setColor(0, "purple")`,
      },
      {
        id: "17",
        title: "Binary Tree Level-Order Traversal",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E, F, G]
	value: [1, 2, 3, 4, 5, 6, 7]
	children: [A-B, A-C, B-D, B-E, C-F, C-G]
}

page
show tr1

page
tr1.setColor(0, "pink")

page
tr1.setColors(["pink","pink",null,null,null,null,null])

page
tr1.setColors(["pink","pink","pink",null,null,null,null])

page
tr1.setColors(["pink","pink","pink","pink",null,null,null])

page
tr1.setColors(["pink","pink","pink","pink","pink",null,null])

page
tr1.setColors(["pink","pink","pink","pink","pink","pink",null])

tr1.setColors(["pink","pink","pink","pink","pink","pink","pink"])
page
tr1.setColors(["pink","pink","pink","pink","pink","pink","pink"])
`,
      },
      {
        id: "18",
        title: "Find Smallest Common Element in All Rows",
        userCode: `matrix mr1 = {
	value: [[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]]
}

array arr1 = {
	value: ["F","N","N"]
}

page
show mr1
show arr1
mr1.setColors([["yellow","green","green","green","green"],["orange",null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]])

page
mr1.setColors([["yellow","green","green","green","green"],["orange",null,null,null,null],["orange",null,null,null,null],[null,null,null,null,null]])
arr1.setValues(["T","F","N"])

page
mr1.setColors([["green","green","yellow","green","green"],[null,"orange",null,null,null],[null,null,null,null,null],[null,null,null,null,null]])
arr1.setValues(["F","N","N"])

page
mr1.setColors([["green","green","green","yellow","green"],[null,"orange",null,null,null],[null,"orange",null,null,null],[null,null,null,null,null]])

page
mr1.setColors([["green","green","green","green","yellow"],[null,null,"orange",null,null],[null,"orange",null,null,null],[null,null,"orange",null,null]])
arr1.setValues(["T","T","T"])
arr1.setColors(["green","green","green"])`,
      },
      {
        id: "19",
        title: "Find the Safest Path in a Grid",
        userCode: `matrix mr1 = {
	value: [[1,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,1]]
}

page
show mr1
mr1.setColors([[null,null,null,"pink"],[null,null,null,null],[null,null,null,null],["pink",null,null,null]])

page
mr1.setColors([[null,null,"green","pink"],[null,null,null,"green"],["green",null,null,null],["pink","green",null,null]])

page
mr1.setValues([[1,2,1,0],[2,1,2,1],[1,2,1,2],[0,1,2,1]])
mr1.setColors([[null,"blue","green","pink"],["blue",null,"blue","green"],["green","blue",null,"blue"],["pink","green","blue",null]])

page
mr1.setValues([[3,2,1,0],[2,3,2,1],[1,2,3,2],[0,1,2,3]])
mr1.setColors([["orange","blue","green","pink"],["blue","orange","blue","green"],["green","blue","orange","blue"],["pink","green","blue","orange"]])`,
      },
      {
        id: "20",
        title: "Number of Closed Islands",
        userCode: `matrix mr1 = {
	value: [[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]]
}

page
show mr1

page
mr1.setArrows([[null,null,null,null,"start"],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]])

page
mr1.setColors([[null,null,null,null,"pink"],[null,null,null,null,"pink"],[null,null,null,null,"pink"],[null,null,null,null,"pink"]])

page
mr1.setArrows([[null,null,null,null,null],[null,"start",null,null,null],[null,null,null,null,null],[null,null,null,null,null]])

page
mr1.setColors([[null,null,null,null,"pink"],[null,"purple","purple",null,"pink"],[null,"purple","purple",null,"pink"],[null,null,null,null,"pink"]])`,
      },
      {
        id: "21",
        title: "Number of Enclaves",
        userCode: `matrix mr1 = {
	value: [[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]]
}

page
show mr1
mr1.setArrows([[null,null,null,null,"root"],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]])

page
mr1.setColors([[null,null,null,null,"red"],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]])

page
mr1.setColors([[null,null,null,null,"red"],[null,null,null,null,"red"],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]])

page
mr1.setColors([[null,null,null,null,"red"],[null,null,null,null,"red"],[null,null,null,null,"red"],[null,null,null,null,null],[null,null,null,null,null]])

page
mr1.setArrows([[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,"root",null]])

page
mr1.setColors([[null,null,null,null,"red"],[null,null,null,null,"red"],[null,null,null,null,"red"],[null,null,null,"red",null],[null,null,null,"red","red"]])

page
mr1.setColors([[null,null,null,null,"red"],[null,null,"green",null,"red"],[null,"green",null,null,"red"],[null,"green",null,"red",null],[null,null,null,"red","red"]])`,
      },
      {
        id: "22",
        title: "Numbers of Islands",
        userCode: `matrix mr1 = {
	value: [[1,1,1],[0,1,0],[1,0,0],[1,0,1]]
}

page
show mr1
mr1.setArrows([["start",null,null],[null,null,null],[null,null,null],[null,null,null]])

page
mr1.setColors([["blue",null,null],[null,null,null],[null,null,null],[null,null,null]])

page
mr1.setColors([["blue","blue",null],[null,null,null],[null,null,null],[null,null,null]])

page
mr1.setColors([["blue","blue",null],[null,"blue",null],[null,null,null],[null,null,null]])

page
mr1.setColors([["blue","blue","blue"],[null,"blue",null],[null,null,null],[null,null,null]])

page
mr1.setArrows([[null,null,null],[null,null,null],["start",null,null],[null,null,null]])

page
mr1.setColors([["blue","blue","blue"],[null,"blue",null],["pink",null,null],[null,null,null]])

page
mr1.setColors([["blue","blue","blue"],[null,"blue",null],["pink",null,null],["pink",null,null]])

page
mr1.setArrows([[null,null,null],[null,null,null],[null,null,null],[null,null,"start"]])

page
mr1.setColors([["blue","blue","blue"],[null,"blue",null],["pink",null,null],["pink",null,"green"]])`,
      },
      {
        id: "24",
        title: "Pacific Atlantic Water Flow",
        userCode: `matrix mr1 = {
	value: [[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]]
}

page
show mr1

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","blue"],["blue",null,null,null,null,null,null,null,null],["blue",null,null,null,null,null,null,null,null],["blue",null,null,null,null,null,null,null,null],["blue",null,null,null,null,null,null,null,null]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","blue"],["blue","blue","blue","blue","blue","blue","blue","blue","blue"],["blue","blue","blue",null,null,null,"blue",null,"blue"],["blue","blue",null,null,null,null,"blue",null,null],["blue",null,null,null,null,null,null,null,null]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue",null,null,null,"blue",null,"yellow"],["blue","blue",null,null,null,null,"blue",null,"yellow"],["yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow"]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","yellow",null,null,null,"blue",null,"yellow"],["yellow","yellow","yellow","yellow","yellow",null,"yellow","yellow","yellow"],["yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow"]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","yellow",null,null,null,"blue",null,"yellow"],["yellow","yellow","green","green","green",null,"yellow","green","green"],["yellow","green","green","green","green","green","green","green","green"]])`,
      },
      {
        id: "25",
        title: "Score After Flipping Matrix",
        userCode: `matrix mr1 = {
	value: [[0,0,1,1],[1,0,1,0],[1,1,0,0]]
}

page
show mr1
mr1.setColors([["pink",null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setValues([[1,1,0,0],[1,0,1,0],[1,1,0,0]])
mr1.setColors([["blue","blue","blue","blue"],[null,null,null,null],[null,null,null,null]])

page
mr1.setColors([["blue","blue","blue","blue"],["green",null,null,null],[null,null,null,null]])

page
mr1.setColors([["blue","blue","blue","blue"],["green",null,null,null],["green",null,null,null]])

page
mr1.setColors([["blue","green","blue","blue"],["green","pink",null,null],["green","green",null,null]])

page
mr1.setColors([["blue","green","pink","blue"],["green","pink","green",null],["green","green","pink",null]])

page
mr1.setValues([[1,1,1,0],[1,0,0,0],[1,1,1,0]])

page
mr1.setColors([["blue","green","pink","orange"],["green","pink","green","orange"],["green","green","pink","orange"]])`,
      },
      {
        id: "26",
        title: "Shift 2D Grid",
        userCode: `matrix mr1 = {
	value: [[0,0,0,0],[0,0,0,0],[0,0,0,0]]
}

page
show mr1
mr1.setArrows([[null,null,null,null],[null,"start",null,null],[null,null,null,null]])

page
mr1.setValues([[0,0,0,0],[0,1,2,0],[0,0,0,0]])
mr1.setColors([[null,null,null,null],[null,"pink","pink",null],[null,null,null,null]])
mr1.setArrows([[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[0,0,0,0]])
mr1.setColors([[null,null,null,null],[null,"pink","pink","pink"],[null,null,null,null]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,0,0,0]])
mr1.setColors([[null,null,null,null],[null,"pink","pink","pink"],["pink",null,null,null]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,5,0,0]])
mr1.setColors([[null,null,null,null],[null,"pink","pink","pink"],["pink","pink",null,null]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,5,6,0]])
mr1.setColors([[null,null,null,null],[null,"pink","pink","pink"],["pink","pink","pink",null]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([[null,null,null,null],[null,"pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,0,0,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink",null,null,null],[null,"pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,0,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink",null,null],[null,"pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,10,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink","pink",null],[null,"pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,10,11],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink","pink","pink"],[null,"pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,10,11],[12,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink","pink","pink"],["pink","pink","pink","pink"],["pink","pink","pink","pink"]])`,
      },
      {
        id: "27",
        title: "Surrounded Regions",
        userCode: `matrix mr1 = {
	value: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
}

page
show mr1
mr1.setColors([["red","red","red","red"],["red","red","red","red"],[null,null,null,null],["red",null,null,null]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue",null,null,null],["red",null,null,null]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue",null,null],["red",null,null,null]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue",null],["red",null,null,null]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red",null,null,null]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red",null,null,"blue"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red",null,"blue","blue"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red","blue","blue","blue"]])`,
      },
      {
        id: "28",
        title: "Unique Path II",
        userCode: `matrix mr1 = {
	value: [[1,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]]
}

page
show mr1
mr1.setArrows([["start",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setColors([["red",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]])
mr1.setArrows([["start",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setValues([[0,1,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red",null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]])
mr1.setArrows([[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setValues([[0,0,1,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red","red",null],[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setValues([[0,0,0,1],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red","red","red"],[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setValues([[0,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red","red","red"],[null,null,null,"green"],[null,null,null,null],[null,null,null,null]])`,
      },
      {
        id: "30",
        title: "Word Search",
        userCode: `matrix mr1 = {
	value: [[1,2,2,1]]
}

matrix mr2 = {
	value: [[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]
}

page
show mr1
show mr2
mr1.setColors([["green",null,null,null]])

page
mr2.setColors([[null,null,null,null],[null,"green",null,null],[null,null,null,null],[null,null,null,null]])
mr1.setColors([["green",null,null,null]])
mr2.setColors([[null,null,null,null],[null,"green",null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setColors([["green","green",null,null]])
mr2.setColors([[null,null,null,null],[null,"green","green",null],[null,null,null,null],[null,null,null,null]])

page
mr1.setColors([["green","green","red",null]])
mr2.setColors([[null,null,null,null],[null,"green","green","red"],[null,null,null,null],[null,null,null,null]])

page
mr1.setColors([["green","green","green",null]])
mr2.setColors([[null,null,null,null],[null,"green","green","red"],[null,null,"green",null],[null,null,null,null]])

page
mr1.setColors([["green","green","green","green"]])
mr2.setColors([[null,null,null,null],[null,"green","green","red"],[null,null,"green","green"],[null,null,null,null]])`,
      },
      {
        id: "31",
        title: "Kth Largest Element in a Stream",
        userCode: `array arr1 = {
	value: [2,4,8,5]
	color: [null,null,null,null]
}

array arr2 = {
	value: [2,3,4,5,8]
	color: [null,null,null,null,null]
}

page
show arr1

page
arr1.removeAt(0)
arr1.setValues([4,5,8])

page


page
hide arr1
show arr2
arr2.setColors([null,null,"green",null,null])

page
arr2.setValues([2,3,4,5,5,8])
arr2.setColors([null,null,null,"green",null,null])

page
arr2.setValues([2,3,4,5,5,8,10])
arr2.setColors([null,null,null,null,"green",null,null])`,
      },
      {
        id: "32",
        title: "Validate Binary Search Tree",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E, F, G]
	value: [5, 1, 4, 0, 2, 3, 6]
	children: [A-B, A-C, B-D, B-E, C-F, C-G]
}

page
show tr1
tr1.setColors(["blue",null,null,null,null,null,null])

page
tr1.setColors(["blue","red",null,"red","red",null,null])

page
tr1.setColors(["blue","red","green","red","red","green","green"])

page
tr1.setArrows([null,null,"notBST",null,null,null,null])`,
      },
      {
        id: "33",
        title: "Add Two Numbers II",
        userCode: `linkedlist li1 = {
	nodes: [n1,n2,n3,n4]
	value: [3,4,2,7]
}

linkedlist li2 = {
	nodes: [n1,n2,n3]
	value: [4,6,5]
}

linkedlist li3 = {
	nodes: [n1,n2]
	value: [7,0]
}

page
show li1
show li2
show li3
li1.setColors(["red",null,null,null])
li2.setColors(["red",null,null])
li3.setColors(["green",null])

page
li1.setColors(["red","red",null,null])
li2.setColors(["red","red",null])
li3.addNode(n3, 1)
li3.setColors(["green","green","green"])

page
li1.setColors(["red","red","red",null])
li2.setColors(["red","red","red"])
li3.addNode(n4, 0)
li3.setValues([7,0,8,0])
li3.setColors(["green","green","green","green"])

page
li1.setColors(["red","red","red","red"])
li2.setColors(["red","red","red"])
li3.setValues([7,0,8,7])
li3.setColors(["green","green","green","green"])

page
li1.setColors(["red","red","red","red"])
li2.setColors(["red","red","red"])
li3.addNode(n5, 0)
li3.setValues([7,0,8,7,0])
li3.setColors(["green","green","green","green","green"])
li3.setArrows([null,null,null,null,"return"])`,
      },
      {
        id: "34",
        title: "Print Immutable Linked List in Reverse",
        userCode: `linkedlist li = {
	nodes: [n1,n2,n3]
	value: [1,2,3]
}

stack stk = {
	value: [1]
}

page
show li
show stk
li.setColors(["green",null,null])
stk.setColors(["green"])

page
li.setColors([null,"green",null])
stk.setValues([2,1])
stk.setColors(["green",null])

page
li.setColors([null,null,"green"])
stk.setValues([3,2,1])
stk.setColors(["green",null,null])

page
li.setColors([null,null,"red"])
stk.removeAt(0)
stk.setColors([null,null])

page
li.setColors([null,"red",null])
stk.removeAt(0)
stk.setColors([null])`,
      },
      {
        id: "36",
        title: "Count Substrings With Only One Distinct Letter",
        userCode: `array arr1 = {
	value: ["a","a","a","a","b","b","a","c","c","c"]
}
array arr2 = {
	value: [1,0,0,0,0,0,0,0,0,0]
}

page
show arr1
show arr2
arr1.setColors(["pink",null,null,null,null,null,null,null,null,null])
arr2.setColors(["pink",null,null,null,null,null,null,null,null,null])

page
arr1.setValues(["a","a","a","a","b","b","a","c","c","c"])
arr2.setValues([1,2,0,0,0,0,0,0,0,0])
arr1.setColors([null,"pink",null,null,null,null,null,null,null,null])
arr2.setColors([null,"pink",null,null,null,null,null,null,null,null])

page
arr2.setValues([1,2,3,0,0,0,0,0,0,0])
arr1.setColors([null,null,"pink",null,null,null,null,null,null,null])
arr2.setColors([null,null,"pink",null,null,null,null,null,null,null])

page
arr2.setValues([1,2,3,4,0,0,0,0,0,0])
arr1.setColors([null,null,null,"pink",null,null,null,null,null,null])
arr2.setColors([null,null,null,"pink",null,null,null,null,null,null])

page
arr2.setValues([1,2,3,4,1,0,0,0,0,0])
arr1.setColors([null,null,null,null,"pink",null,null,null,null,null])
arr2.setColors([null,null,null,null,"pink",null,null,null,null,null])

page
arr2.setValues([1,2,3,4,1,2,0,0,0,0])
arr1.setColors([null,null,null,null,null,"pink",null,null,null,null])
arr2.setColors([null,null,null,null,null,"pink",null,null,null,null])

page
arr2.setValues([1,2,3,4,1,2,1,0,0,0])
arr1.setColors([null,null,null,null,null,null,"pink",null,null,null])
arr2.setColors([null,null,null,null,null,null,"pink",null,null,null])

page
arr2.setValues([1,2,3,4,1,2,1,1,0,0])
arr1.setColors([null,null,null,null,null,null,null,"pink",null,null])
arr2.setColors([null,null,null,null,null,null,null,"pink",null,null])

page
arr2.setValues([1,2,3,4,1,2,1,1,2,0])
arr1.setColors([null,null,null,null,null,null,null,null,"pink",null])
arr2.setColors([null,null,null,null,null,null,null,null,"pink",null])

page
arr2.setValues([1,2,3,4,1,2,1,1,2,3])
arr1.setColors([null,null,null,null,null,null,null,null,null,"pink"])
arr2.setColors([null,null,null,null,null,null,null,null,null,"pink"])`,
      },
      {
        id: "37",
        title: "Vote Game",
        userCode: `array arr = {
	value: ["d","r","d","r","d","r"]
}

page
show arr
arr.setArrow(0, "vote")

page
arr.setArrow(0, "vote")
arr.setColor(5, "red")

page
arr.setArrow(0, null)
arr.setArrow(1, "vote")
arr.setColor(1, "vote")
arr.setColors([null,"vote",null,null,"red","red"])

page
arr.setArrow(1, null)
arr.setArrow(2, "vote")
arr.setColors([null,null,null,"red","red","red"])

page
arr.setArrow(2, null)
arr.setArrow(1, "vote")
arr.setColors([null,null,"red","red","red","red"])

page
arr.setArrow(1, null)
arr.setArrow(0, "vote")
arr.setColors([null,"red","red","red","red","red"])

page
arr.setArrow(0, "win")
arr.setColors(["green",null,null,null,null,null])`,
      },
      {
        id: "38",
        title: "Longest Word in Dictionary Through Deleting",
        userCode: `array arr1 = {
	value: ["a","l","e"]
}
array arr2 = {
	value: ["a","p","p","l","l","e"]
}

page
show arr1
show arr2

page
arr1.setColor(0, "red")
arr2.setColor(0, "blue")

page
arr1.setColors(["red","red",null])
arr2.setColors(["blue","pink",null,null,null,null])

page
arr2.setColors(["blue","pink","pink",null,null,null])

page
arr2.setColors(["blue","pink","pink","blue",null,null])

page
arr2.setColors(["blue","pink","pink","blue","blue",null])

page
arr1.setColors(["red","red","red"])
arr2.setColors(["blue","pink","pink","blue","blue","red"])`,
      },
      {
        id: "39",
        title: "Minimum Length of String After Deleting Similar Ends",
        userCode: `array arr = {
	value: ["a","a","b","c","c","a","b","b","a"]
}

page
show arr
arr.setColor(0, "blue")
arr.setColor(8, "red")

page
arr.setColors(["blue","blue",null,null,null,null,null,null,"red"])

page
arr.setColors(["blue","blue","blue",null,null,null,null,"red","red"])

page
arr.setColors(["blue","blue","blue","blue",null,null,null,"red","red"])

page
arr.setColors(["blue","blue","blue","blue","blue",null,null,"red","red"])

page
arr.setColors(["blue","blue","blue","blue","blue","blue",null,"red","red"])

page
arr.setColors(["blue","blue","blue","blue","blue","blue","red","red","red"])`,
      },
      {
        id: "40",
        title: "Number of Ways to Form a Target String Given a Dictionary",
        userCode: `matrix mr1 = {
	value: [["a","c","c","a"],["b","b","b","b"],["c","a","c","a"]]
}

page
show mr1

page
mr1.setColor(0,0,"yellow")
mr1.setColor(1,0,"yellow")
mr1.setColor(2,0,"yellow")

page
mr1.setColor(0,0,"green")

page
mr1.setColors([[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
mr1.setColor(0,1,"yellow")
mr1.setColor(1,1,"yellow")
mr1.setColor(2,1,"yellow")

page
mr1.setColor(1,1,"green")

page
mr1.setColor(0,1,null)
mr1.setColor(1,1,null)
mr1.setColor(2,1,null)
mr1.setColor(0,3,"yellow")
mr1.setColor(1,3,"yellow")
mr1.setColor(2,3,"yellow")

page
mr1.setColor(2,3,"green")`,
      },
      {
        id: "41",
        title: "Smallest String Starting From Leaf",
        userCode: `tree tr1 = {
	nodes: [A, B, C, D, E, F, G]
	value: ["z","b","d","b","d","a","c"]
	color: [null,null,null,null,null,null,null]
	children: [A-B, A-C, B-D, B-E, C-F, C-G]
}

page
show tr1

page
tr1.setColor(0, "blue")

page
tr1.setColor(1, "blue")

page
tr1.setColors(["blue","blue",null,"blue",null,null,null])

page
tr1.setColors(["blue","blue",null,null,null,null,null])

page
tr1.setColors(["blue","blue",null,null,"blue",null,null])

page
tr1.setColors(["blue",null,"blue",null,null,null,null])

page
tr1.setColors(["blue",null,"blue",null,null,"blue",null])

page
tr1.setColors(["blue",null,"blue",null,null,null,null])

page
tr1.setColors(["blue",null,"blue",null,null,null,"blue"])`,
      },
      {
        id: "42",
        title: "Work Ladder",
        userCode: `matrix mr1 = {
	value: [[1,2,2,1]]
	color: [["green",null,null,null]]
}
matrix mr2 = {
	value: [[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]
	color: [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}

page
show mr1
show mr2

page
mr1.setColor(0,0,"green")
mr2.setColor(1,1,"green")

page
mr1.setColor(0,1,"green")
mr2.setColor(1,2,"green")

page
mr1.setColor(0,2,"red")
mr2.setColor(1,3,"red")

page
mr1.setColor(0,2,"green")
mr2.setColor(2,2,"green")

page
mr1.setColor(0,3,"green")
mr2.setColor(2,3,"green")`,
      },
      {
        id: "43",
        title: "Cheapest Flights Within K Stops",
        userCode: `graph gh = {
	nodes: [n1,n2,n3,n4,n5]
	value: [1,2,3,4,5]
	edges: [n1-n2, n1-n3, n2-n3, n2-n4, n4-n5, n3-n4, n3-n5]
	color: [null,null,null,null,null]
}

page
show gh

page
gh.setColor(0, "red")

page
gh.setColors(["red","green","green",null,null])

page
gh.setColors(["red","red","yellow","green",null])

page
gh.setColors(["red","red","green","green",null])

page
gh.setColors(["red","red","green","yellow","green"])`,
      },
      {
        id: "44",
        title: "Design Graph With Shortest Path Calculator",
        userCode: `graph gh = {
	nodes: [n1,n2,n3,n4,n5,n6]
	value: ["a","b","c","d","e","f"]
	edges: [n1-n2, n1-n3, n2-n4, n2-n5, n3-n5, n4-n6, n4-n5]
	color: [null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "blue")

page
gh.setColors(["grey","blue",null,null,null,null])

page
gh.setColors(["grey","grey","blue",null,null,null])

page
gh.setColors(["grey","grey","grey","blue",null,null])

page
gh.setColors(["grey","grey","grey","grey","blue",null])

page
gh.setColors(["grey","grey","grey","grey","grey","blue"])`,
      },
      {
        id: "46",
        title: "Find Circle",
        userCode: `graph gh = {
	nodes: [n1,n2,n3,n4,n5,n6,n7,n8]
	value: [1,2,3,4,5,6,7,8]
	edges: [n1-n2, n2-n3, n3-n4, n4-n5, n5-n6, n6-n7, n7-n8, n8-n4]
	color: [null,null,null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "red")

page
gh.setColors(["green","red",null,null,null,null,null,null])

page
gh.setColors(["green",null,"red",null,null,null,null,null])

page
gh.setColors([null,"green",null,null,"red",null,null,null])

page
gh.setColors([null,null,"green",null,null,null,"red",null])

page
gh.setColors([null,null,null,"green",null,null,null,"red"])

page
gh.setColors([null,null,null,null,"green","red",null,null])

page
gh.setColors([null,null,null,null,null,"green",null,"red"])

page
gh.setColors([null,null,null,null,null,null,"red","green"])

page
gh.setColors([null,null,null,"red",null,null,null,null])
gh.setArrow(3, "catch")`,
      },
      {
        id: "47",
        title: "BFS in a Graph",
        userCode: `graph gh = {
	nodes: [n1,n2,n3,n4,n5,n6,n7,n8]
	value: [1,2,3,4,5,6,7,8]
	edges: [n1-n2, n1-n3, n1-n4, n1-n6, n1-n7, n3-n4, n3-n6, n4-n5, n6-n8]
	color: [null,null,null,null,null,null,null,null]
	arrow: [null,null,null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "red")
gh.setArrow(0, "start")

page
gh.setColor(1, "red")
gh.setArrow(0, null)
gh.setArrow(1, "cur")

page
gh.setArrow(1, null)
gh.setArrow(0, "cur")

page
gh.setColor(2, "red")
gh.setArrow(0, null)
gh.setArrow(2, "cur")

page
gh.setColor(3, "red")
gh.setArrow(2, null)
gh.setArrow(3, "cur")

page
gh.setColor(5, "red")
gh.setArrow(3, null)
gh.setArrow(5, "cur")

page
gh.setColor(6, "red")
gh.setArrow(5, null)
gh.setArrow(6, "cur")

page
gh.setColor(4, "red")
gh.setArrow(6, null)
gh.setArrow(4, "cur")

page
gh.setColor(7, "red")
gh.setArrow(4, null)
gh.setArrow(7, "finish")`,
      },
      {
        id: "48",
        title: "DFS in a Graph",
        userCode: `graph gh = {
	nodes: [n1,n2,n3,n4,n5,n6,n7,n8]
	value: [1,2,3,4,5,6,7,8]
	edges: [n1-n2, n1-n3, n1-n4, n1-n6, n1-n7, n3-n4, n3-n6, n4-n5, n6-n8]
	color: [null,null,null,null,null,null,null,null]
	arrow: [null,null,null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "blue")
gh.setArrow(0, "start")

page
gh.setColor(1, "blue")
gh.setArrow(0, null)
gh.setArrow(1, "cur")

page
gh.setArrow(1, null)
gh.setArrow(0, "cur")

page
gh.setColor(2, "blue")
gh.setArrow(0, null)
gh.setArrow(2, "cur")

page
gh.setColor(3, "blue")
gh.setArrow(2, null)
gh.setArrow(3, "cur")

page
gh.setColor(4, "blue")
gh.setArrow(3, null)
gh.setArrow(4, "cur")

page
gh.setArrow(4, null)
gh.setArrow(2, "cur")

page
gh.setColor(5, "blue")
gh.setArrow(2, null)
gh.setArrow(5, "cur")

page
gh.setColor(7, "blue")
gh.setArrow(5, null)
gh.setArrow(7, "cur")

page
gh.setArrow(7, null)
gh.setArrow(0, "cur")

page
gh.setColor(6, "blue")
gh.setArrow(0, null)
gh.setArrow(6, "cur")`,
      },
      {
        id: "50",
        title: "Reconstruct Itinerary",
        userCode: `graph gh = {
	nodes: [n1,n2,n3,n4]
	value: ["aaa","bbb","ccc","jfk"]
	edges: [n1-n4, n2-n3, n3-n4, n2-n4]
	color: [null,null,null,null]
}

page
show gh

page
gh.setColor(3, "green")

page
gh.setColors(["green",null,null,"green"])

page
gh.setColors([null,null,null,"green"])

page
gh.setColors([null,null,"green","green"])

page
gh.setColors([null,"green","green","green"])

page
gh.setColors(["green","green","green","green"])`,
      },
      {
        id: "51",
        title: "find path in a maze i",
        userCode: `matrix mr1 = {
	value: [[1,0,"x",0],[0,0,"x",2],[0,0,0,0],["x","x",0,0]]
	color: [[null,null,"red",null],[null,null,"red","green"],[null,null,null,null],["red","red",null,null]]
	arrow: [["start",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}

page
show mr1

page
mr1.setColor(0,0,"blue")
mr1.setArrow(0,0,null)

page
mr1.setColor(0,1,"blue")
mr1.setArrow(0,1,"c")

page
mr1.setColor(1,1,"blue")
mr1.setArrow(0,1,null)
mr1.setArrow(1,1,"c")

page
mr1.setColor(1,0,"blue")
mr1.setArrow(1,1,null)
mr1.setArrow(1,0,"c")

page
mr1.setColor(2,0,"blue")
mr1.setArrow(1,0,null)
mr1.setArrow(2,0,"c")

page
mr1.setColor(2,1,"blue")
mr1.setArrow(2,0,null)
mr1.setArrow(2,1,"c")

page
mr1.setColor(2,2,"blue")
mr1.setArrow(2,1,null)
mr1.setArrow(2,2,"c")

page
mr1.setColor(2,3,"blue")
mr1.setArrow(2,2,null)
mr1.setArrow(2,3,"c")

page
mr1.setArrow(2,3,null)
mr1.setArrow(1,3,"finish")`,
      },
      {
        id: "52",
        title: "find path in a maze ii",
        userCode: `matrix mr1 = {
	value: [[1,0,"x",0],[0,0,"x",2],[0,"x",0,0],[0,0,0,0]]
	color: [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
	arrow: [["start",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}

page
show mr1

page
mr1.setColors([[null,null,"red",null],[null,null,"red",null],[null,"red",null,null],[null,null,null,null]])

page
mr1.setColor(0,0,"blue")
mr1.setArrow(0,0,null)

page
mr1.setValue(0,1,1)
mr1.setColor(0,1,"blue")

page
mr1.setValue(1,1,2)
mr1.setColor(1,1,"blue")

page
mr1.setValue(1,0,1)
mr1.setColor(1,0,"blue")

page
mr1.setValue(2,0,2)
mr1.setColor(2,0,"blue")

page
mr1.setValue(3,0,3)
mr1.setColor(3,0,"blue")

page
mr1.setValue(3,1,4)
mr1.setColor(3,1,"blue")

page
mr1.setValue(3,2,5)
mr1.setColor(3,2,"blue")

page
mr1.setValue(2,2,5)
mr1.setColor(2,2,"blue")

page
mr1.setValue(3,3,6)
mr1.setColor(3,3,"blue")

page
mr1.setValue(2,3,7)
mr1.setColor(2,3,"blue")

page
mr1.setValue(1,3,8)
mr1.setColor(1,3,"green")
mr1.setArrow(1,3,"finish")`,
      },
    ],
  },
];
module.exports = { examples };

/*
Example template for new entries in the examples array:
{
	"id":"",
	"title":"",
	"userCode" : ``,
},
*/
