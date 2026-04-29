// Language configuration for Merlin custom language support
// This file contains all the definitions for syntax highlighting, autocomplete, and documentation

export const languageConfig = {
  // Basic language tokens
  keywords: ["page", "show", "hide"],

  symbols: [":", ":=", "=", "*", ",", "@", "&", "(", ")", "[", "]", "{", "}"],

  components: [
    "array",
    "matrix",
    "linkedlist",
    "stack",
    "tree",
    "graph",
    "text",
    "neuralnetwork",
    "architecture",
  ],

  attributes: [
    "id",
    "value",
    "color",
    "arrow",
    "nodes",
    "edges",
    "hidden",
    "above",
    "below",
    "left",
    "right",
    "fontSize",
    "fontWeight",
    "fontFamily",
    "align",
    "lineSpacing",
    "width",
    "height",
    "children",
    "title",
    "layers",
    "neurons",
    "layerColors",
    "neuronColors",
    "showBias",
    "showLabels",
    "labelPosition",
    "showWeights",
    "showArrowheads",
    "edgeWidth",
    "edgeColor",
    "layerSpacing",
    "layerStrokes",
    "neuronSpacing",
  ],

  // Position keywords for syntax highlighting
  positionKeywords: [
    // Corner positions
    "tl",
    "tr",
    "bl",
    "br",
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "top",
    "bottom",
    "left",
    "right",
    "center",
    "centre",
    "mid",
    "start",
    "end",
  ],

  namedColors: [
    // Basic colors
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "grey",
    "navy",
    "maroon",
    "olive",
    "teal",
    "cyan",
    "magenta",
    "lime",
    "aqua",
    "silver",
    "gold",
    "coral",
    "salmon",
    // Light colors
    "lightblue",
    "lightgreen",
    "lightcoral",
    "lightgray",
    "lightpink",
    "lightyellow",
    // Dark colors
    "darkblue",
    "darkgreen",
    "darkred",
    "darkgray",
    "darkviolet",
    // Named colors
    "cornflowerblue",
    "crimson",
    "indigo",
    "turquoise",
    "violet",
    "tomato",
  ],
  fontWeights: [
    "normal",
    "bold",
    "bolder",
    "lighter",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  fontWeightsArch: [
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
  fontStyles: ["normal", "italic", "oblique"],
  fontFamilies: [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Times",
    "Courier New",
    "Courier",
    "Verdana",
    "Georgia",
    "Palatino",
    "Garamond",
    "Bookman",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
    "Comic Sans MS",
    "Lucida Sans Unicode",
    "Tahoma",
    "Geneva",
    "Segoe UI",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Inter",
    "system-ui",
    "sans-serif",
    "serif",
    "monospace",
    "cursive",
    "fantasy",
    "math",
  ],
  alignValues: ["left", "center", "right"],
};

// Data structure type documentation with features and documentation links
export const typeDocumentation = {
  architecture: {
    description:
      "Architectures represent block-based system diagrams with nodes, edges, groups, and cross-block connections.",
    features: [
      "Multiple named blocks (for example Encoder and Decoder)",
      "Block-local nodes, edges, and groups",
      "Cross-block connections through diagram uses/connects",
      "Per-block styling, layout, spacing, and annotations",
    ],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/architecture",
    insertText: `architecture \${1:a} = {
  title: "\${2:Hello}",

  block \${3:Encoder}: [
    layout: \${4:vertical},
    gap: \${5:40},
    color: "\${6:yellow}",
    style: \${7:box},

    nodes: [
      \${8:add_norm1} = type: rect label: "Add & Norm",
      \${9:feed_forward} = type: rect label: "Feed Forward"
    ],

    edges: [
      \${10:e1} = \${8:add_norm1}.top -> \${9:feed_forward}.bottom
    ],

    groups: [
      \${11:row1} = members: [\${8:add_norm1}, \${9:feed_forward}] layout: vertical gap: 10
    ]
  ],

  diagram: [
    gap: \${12:15},
    uses: [\${13:e} = \${3:Encoder}],
    connects: []
  ]
}`,
    insertTextName: "a",
    supportedProperties: [
      "title",
      "diagram",
      "above",
      "below",
      "left",
      "right",
    ],
  },
  neuralnetwork: {
    description:
      "Neural networks represent layered structures of neurons, supporting per-layer and per-neuron values and colors.",
    features: [
      "Layer-based structure (input → hidden → output)",
      "Per-neuron values and colors",
      "Per-layer values and colors",
    ],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/neural-network",
    insertText: `neuralnetwork \${1:nn} = {\n  layers: [\${2:"input","hidden","output"}]\n  neurons: [[\${3:"x1","x2"}],[\${4:"h1","h2"}],[\${5:"y"}]]\n  layerColors: [\${6:"blue", null, "red"}]\n  neuronColors: [[\${7:"blue", null}],[null, null],[null]]\n  showBias: \${8:true}\n  showLabels: \${9:true}\n  labelPosition: "\${10:top}"\n  showWeights: \${11:false}\n  showArrowheads: \${12:true}\n}`,
    insertTextName: "nn",
    supportedProperties: [
      "layers",
      "neurons",
      "layerColors",
      "layerStrokes",
      "neuronColors",
      "showBias",
      "showLabels",
      "labelPosition",
      "showWeights",
      "showArrowheads",
      "edgeWidth",
      "edgeColor",
      "layerSpacing",
      "neuronSpacing",
      "above",
      "below",
      "left",
      "right",
    ],
  },
  array: {
    description:
      "Arrays represent ordered collections of elements with indexed access.",
    features: [
      "Fixed or dynamic size",
      "Index-based element access",
      "Support for colors and arrows",
    ],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/array",
    insertText: `array \${1:arr} = {\n  value: [\${2:1,2,3}]\n  color: [\${3:"red", null, "blue"}]\n  arrow: [\${4:null, "i", null}]\n}`,
    insertTextName: "arr",
    supportedProperties: [
      "value",
      "color",
      "arrow",
      "above",
      "below",
      "left",
      "right",
    ],
  },
  matrix: {
    description:
      "Matrices represent 2D grids of elements with row-column access.",
    features: [
      "2D grid structure",
      "Row and column operations",
      "Border support",
    ],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/matrix",
    insertText: `matrix \${1:grid} = {\n  value: [[\${2:1,2}],[\${3:3,4}]]\n  color: [[\${4:null, "red"}], [\${5:null, null}]]\n}`,
    insertTextName: "grid",
    supportedProperties: [
      "value",
      "color",
      "arrow",
      "above",
      "below",
      "left",
      "right",
    ],
  },
  linkedlist: {
    description: "Linked lists represent sequences of connected nodes.",
    features: ["Node-based structure", "Dynamic size", "Sequential access"],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/linkedlist",
    insertText: `linkedlist \${1:ll} = {\n  nodes: [\${2:head, node1, tail}]\n  value: [\${3:1, 2, 3}]\n}`,
    insertTextName: "ll",
    supportedProperties: [
      "nodes",
      "value",
      "color",
      "arrow",
      "above",
      "below",
      "left",
      "right",
    ],
  },
  stack: {
    description: "Stacks implement Last-In-First-Out (LIFO) data structure.",
    features: [
      "LIFO operations",
      "Push/pop semantics",
      "Visual stack representation",
    ],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/stack",
    insertText: `stack \${1:s} = {\n  value: [\${2:"main", "func"}]\n  color: [\${3:null, "blue"}]\n}`,
    insertTextName: "s",
    supportedProperties: [
      "value",
      "color",
      "arrow",
      "above",
      "below",
      "left",
      "right",
    ],
  },
  tree: {
    description:
      "Trees represent hierarchical data structures with parent-child relationships.",
    features: [
      "Hierarchical structure",
      "Parent-child relationships",
      "Subtree operations",
    ],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/tree",
    insertText: `tree \${1:t} = {\n  nodes: [\${2:n1, n2, n3}]\n  children: [\${3:n1-n2, n1-n3}]\n  value: [\${4:1,2,3}]\n}`,
    insertTextName: "t",
  },
  graph: {
    description: "Graphs represent networks of interconnected nodes and edges.",
    features: [
      "Node and edge operations",
      "Flexible connections",
      "Visibility control",
    ],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/graph",
    insertText: `graph \${1:g} = {\n  nodes: [\${2:A,B,C}]\n  edges: [\${3:A-B, B-C}]\n  value: [\${4:1,2,3}]\n  color: [\${5:"red", null, "blue"}]\n}`,
    insertTextName: "g",
    supportedProperties: [
      "nodes",
      "edges",
      "value",
      "color",
      "arrow",
      "hidden",
      "above",
      "below",
      "left",
      "right",
    ],
  },
  text: {
    description: "Text elements for displaying formatted text content.",
    features: ["Multi-line support", "Font customization", "Alignment options"],
    url: "https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/text",
    insertText: `text \${1:label} = {\n  value: \${2:"Hello, world!"}\n  fontSize: \${3:16}\n  color: \${4:"gray"}\n}`,
    insertTextName: "label",
    supportedProperties: [
      "value",
      "fontSize",
      "fontWeight",
      "fontFamily",
      "align",
      "lineSpacing",
      "width",
      "height",
    ],
  },
};

// Method availability by data structure type
export const typeMethodsMap = {
  architecture: {
    node: [
      "removeNode",
      "removeNodes",
      "setNodeLabel",
      "setNodeColor",
      "setNodeStroke",
      "setNodeAnnotation",
      "setNodeShape",
      "hideNode",
      "showNode",
    ],
    edge: [
      "setEdgeLabel",
      "setEdgeColor",
      "setEdgeShape",
      "removeEdge",
      "removeEdges",
      "hideEdge",
      "showEdge",
    ],
    block: [
      "setBlockColor",
      "setBlockAnnotation",
      "hideBlock",
      "showBlock",
      "setBlockLayout",
      "removeBlock",
    ],
    group: [
      "setGroupColor",
      "setGroupAnnotation",
      "setGroupLayout",
      "removeGroup",
    ],
    textControl: ["setText"],
  },
  neuralnetwork: {
    single: ["setLayer", "setNeuron", "setLayerColor", "setNeuronColor"],
    multiple: ["setLayers", "setNeurons", "setLayerColors", "setNeuronColors"],
    addInsert: ["addNeurons", "addLayer"],
    remove: ["removeLayerAt", "removeNeuronsFromLayer"],
    textControl: ["setText"],
  },
  array: {
    single: ["setValue", "setColor", "setArrow"],
    multiple: ["setValues", "setColors", "setArrows"],
    addInsert: ["addValue", "insertValue"],
    remove: ["removeValue", "removeAt"],
    textControl: ["setText"],
  },

  stack: {
    single: ["setValue", "setColor", "setArrow"],
    multiple: ["setValues", "setColors", "setArrows"],
    addInsert: ["addValue", "insertValue"],
    remove: ["removeValue", "removeAt"],
    textControl: ["setText"],
  },
  matrix: {
    single: ["setValue", "setColor", "setArrow"],
    multiple: ["setValues", "setColors", "setArrows"],
    matrixSpecific: [
      "addRow",
      "addColumn",
      "removeRow",
      "removeColumn",
      "addBorder",
      "insertRow",
      "insertColumn",
    ],
    textControl: ["setText"],
  },
  linkedlist: {
    single: ["setValue", "setColor", "setArrow"],
    multiple: ["setValues", "setColors", "setArrows"],
    addInsert: ["addNode", "insertNode"],
    remove: ["removeAt", "removeNode"],
    textControl: ["setText"],
  },
  graph: {
    single: ["setValue", "setColor", "setArrow", "setHidden"],
    multiple: ["setValues", "setColors", "setArrows", "setHidden"],
    addInsert: ["addNode", "addEdge", "insertNode"],
    remove: ["removeNode", "removeEdge"],
    graphSpecific: ["setEdges"],
    textControl: ["setText"],
  },
  tree: {
    single: ["setValue", "setColor", "setArrow"],
    multiple: ["setValues", "setColors", "setArrows"],
    addInsert: ["addNode", "addChild", "insertNode"],
    remove: ["removeNode", "removeSubtree"],
    treeSpecific: ["setChild"],
    textControl: ["setText"],
  },
  text: {
    single: [
      "setValue",
      "setFontSize",
      "setColor",
      "setFontWeight",
      "setFontFamily",
      "setAlign",
    ],
    multiple: [
      "setValues",
      "setFontSizes",
      "setColors",
      "setFontWeights",
      "setFontFamilies",
      "setAligns",
    ],
    textSpecific: ["setLineSpacing", "setWidth", "setHeight"],
    chained: {
      fontSize: "setFontSize",
      color: "setColor",
      fontWeight: "setFontWeight",
      fontFamily: "setFontFamily",
      align: "setAlign",
      value: "setValue",
      lineSpacing: "setLineSpacing",
      width: "setWidth",
      height: "setHeight",
    },
  },
};

// Helper function to get all supported methods for a component typeworl
export function getSupportedMethods(componentType) {
  const methodsMap = typeMethodsMap[componentType];
  if (!methodsMap) return [];

  const allMethods = [];
  Object.values(methodsMap).forEach((methods) => {
    if (Array.isArray(methods)) {
      allMethods.push(...methods);
    } else if (methods && typeof methods === "object") {
      allMethods.push(...Object.values(methods));
    }
  });
  return [...new Set(allMethods)]; // Remove duplicates
}

// Helper function to check if a method is supported for a component type
export function isMethodSupported(componentType, methodName) {
  const supportedMethods = getSupportedMethods(componentType);
  return supportedMethods.includes(methodName);
}

// Method signatures for autocomplete snippets
export const methodSignatures = {
  setValue: (varType) =>
    varType === "matrix"
      ? "setValue(${1:row}, ${2:col}, ${3:value})"
      : "setValue(${1:index}, ${2:value})",
  setColor: (varType) => {
    if (varType === "matrix")
      return 'setColor(${1:row}, ${2:col}, "${3:color}")';
    if (varType === "graph" || varType === "tree")
      return 'setColor(${1:node}, "${2:color}")';
    return 'setColor(${1:index}, "${2:color}")';
  },
  setArrow: (varType) =>
    varType === "matrix"
      ? "setArrow(${1:row}, ${2:col}, ${3:arrow})"
      : "setArrow(${1:index}, ${2:arrow})",
  setValues: () => "setValues([${1:values}])",
  setColors: () => "setColors([${1:colors}])",
  setArrows: () => "setArrows([${1:arrows}])",
  addValue: () => "addValue(${1:value})",
  insertValue: () => "insertValue(${1:index}, ${2:value})",
  removeValue: () => "removeValue(${1:value})",
  removeAt: () => "removeAt(${1:index})",
  addNode: () => "addNode(${1:name}, ${2:value})",
  insertNode: () => "insertNode(${1:id}, ${2:name}, ${3:value})",
  addEdge: () => "addEdge(${1:nodeA}-${2:nodeB})",
  setEdges: () => "setEdges([${1:edges}])",
  setHidden: () => "setHidden(${1:index}, ${2:hidden})",
  addChild: () => "addChild(${1:parent}-${2:child}, ${3:value})",
  setChild: () => "setChild(${1:parent}-${2:child})",
  removeSubtree: () => "removeSubtree(${1:node})",
  addRow: () => "addRow([${1:values}])",
  addColumn: () => "addColumn([${1:values}])",
  insertRow: () => "insertRow(${1:index}, [${2:values}])",
  insertColumn: () => "insertColumn(${1:index}, [${2:values}])",
  removeRow: () => "removeRow(${1:index})",
  removeColumn: () => "removeColumn(${1:index})",
  addBorder: () => "addBorder(${1:value}, ${2:color})",
  setFontSize: () => "setFontSize(${1:size})",
  setFontWeight: () => "setFontWeight(${1:weight})",
  setFontFamily: () => "setFontFamily(${1:family})",
  setAlign: () => "setAlign(${1:alignment})",
  setFontSizes: () => "setFontSizes([${1:sizes}])",
  setFontWeights: () => "setFontWeights([${1:weights}])",
  setFontFamilies: () => "setFontFamilies([${1:families}])",
  setAligns: () => "setAligns([${1:alignments}])",
  setLineSpacing: () => "setLineSpacing(${1:spacing})",
  setWidth: () => "setWidth(${1:width})",
  setHeight: () => "setHeight(${1:height})",
  setText: () => 'setText(${1:"text"}, ${2:"position"})',
  setNodeShape: () => "setNodeShape(${1:blockName}, ${2:nodeName}, ${3:shape})",
  setNeuronColor: () =>
    "setNeuronColor(${1:layerIndex}, ${2:neuronIndex}, ${3:color})",
  setNeuron: () => "setNeuron(${1:layerIndex}, ${2:neuronIndex}, ${3:value})",
  setLayer: () => "setLayer(${1:layerIndex}, ${2:value})",
  setLayerColor: () => "setLayerColor(${1:layerIndex}, ${2:color})",
  setNeurons: () =>
    "setNeurons([[${1:NeuronsForLayer1}], [${2:NeuronsForLayer2}], [${3:NeuronsForLayer3}]])",
  setNeuronColors: () =>
    "setNeuronColors([[${1:NeuronsColorLayer1}], [${2:NeuronsColorLayer2}], [${3:NeuronsColorLayer3}]])",
  setLayers: () => "setLayers([${1:layerValues}])",
  setLayerColors: () => "setLayerColors([${1:color}, ${2:color}, ${3:color}])",
  addNeurons: () => "addNeurons(${1:layerIndex}, [${2:neurons}])",
  addLayer: () => "addLayer(${1:layerName}, [${2:neurons}])",
  removeLayerAt: () => "removeLayerAt(${1:layerIndex})",
  removeNeuronsFromLayer: () =>
    "removeNeuronsFromLayer(${1:layerIndex}, [${2:neurons}])",

  removeNode: (varType) =>
    varType === "architecture"
      ? "removeNode(${1:blockName}, ${2:nodeName})"
      : "removeNode(${1:name})",

  removeEdge: (varType) =>
    varType === "architecture"
      ? "removeEdge(${1:blockNameOrdiagram}, ${2:edgeNameOrIndex})"
      : "removeEdge(${1:nodeA}-${2:nodeB})",

  removeNodes: () => "removeNodes(${1:blockName}, [${2:node1}, ${3:node2}])",
  removeGroup: () => "removeGroup(${1:blockName}, ${2:groupName})",
  removeBlock: () => "removeBlock(${1:blockName})",
  setNodeLabel: () => "setNodeLabel(${1:blockName}, ${2:nodeName}, ${3:label})",
  setNodeColor: () => "setNodeColor(${1:blockName}, ${2:nodeName}, ${3:color})",
  setNodeStroke: () =>
    "setNodeStroke(${1:blockName}, ${2:nodeName}, ${3:color})",
  setNodeAnnotation: () =>
    "setNodeAnnotation(${1:blockName}, ${2:nodeName}, ${3:left}, ${4:value})",
  hideNode: () => "hideNode(${1:blockName}, ${2:nodeName})",
  showNode: () => "showNode(${1:blockName}, ${2:nodeName})",
  setEdgeLabel: () =>
    "setEdgeLabel(${1:blockNameOrdiagram}, ${2:edgeNameOrIndex}, ${3:label})",
  setEdgeColor: () =>
    "setEdgeColor(${1:blockNameOrdiagram}, ${2:edgeNameOrIndex}, ${3:color})",
  setEdgeShape: () =>
    "setEdgeShape(${1:blockNameOrdiagram}, ${2:edgeNameOrIndex}, ${3:shape})",
  removeEdges: () =>
    "removeEdges(${1:blockNameOrdiagram}, [${2:edgeNameOrIndex1}, ${3:edgeNameOrIndex2}])",
  hideEdge: () => "hideEdge(${1:blockName}, ${2:edgeName})",
  showEdge: () => "showEdge(${1:blockName}, ${2:edgeName})",
  setBlockColor: () => "setBlockColor(${1:blockName}, ${2:color})",
  setBlockAnnotation: () =>
    "setBlockAnnotation(${1:blockName}, ${2:left}, ${3:value})",
  setBlockLayout: () => "setBlockLayout(${1:blockName}, ${2:layout})",
  hideBlock: () => "hideBlock(${1:blockName})",
  showBlock: () => "showBlock(${1:blockName})",
  setGroupColor: () =>
    "setGroupColor(${1:blockName}, ${2:groupName}, ${3:color})",
  setGroupAnnotation: () =>
    "setGroupAnnotation(${1:blockName}, ${2:groupName}, ${3:left}, ${4:value})",
  setGroupLayout: () =>
    "setGroupLayout(${1:blockName}, ${2:groupName}, ${3:layout})",
};

// Comprehensive method documentation with type-specific variations
export const methodDocumentation = {
  removeNode: (varType) =>
    varType === "architecture"
      ? {
          signature: "removeNode(blockName, nodeName)",
          description: "Remove a node from a specific block.",
          parameters: [
            "blockName: `identifier` - Block name",
            "nodeName: `identifier` - Node name to remove",
          ],
          example: "a.removeNode(Stem, conv1)",
        }
      : {
          description: "Remove node from structure",
          signature: "removeNode(name)",
          parameters: ["name: `id` - The node identifier to remove"],
          example: "myGraph.removeNode(client)",
        },

  removeNodes: {
    default: {
      signature: "removeNodes(blockName, nodeNames)",
      description: "Remove multiple nodes from a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeNames: `Array<identifier>` - List of node names to remove",
      ],
      example: "a.removeNodes(Stem, [conv1, pool1])",
    },
  },

  setNodeLabel: {
    default: {
      signature: "setNodeLabel(blockName, nodeName, label)",
      description: "Set the label of a node inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeName: `identifier` - Node name",
        "label: `string|null` - Label text to display (null clears the label)",
      ],
      example: 'a.setNodeLabel(Stem, conv1, "HERE")',
    },
  },

  setNodeShape: {
    default: {
      signature: "setNodeShape(blockName, nodeName, shape)",
      description:
        "Set the shape of a node inside a specific block. Shape must be a 2D or 3D shape string.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeName: `identifier` - Node name",
        "shape: 1x1x1/ 1x1 - Shape for stacked/flatten-style nodes",
      ],
      example:
        "a.setNodeShape(Stem, conv1, 3x32x32) or a.setNodeShape(Stem, conv1, 32x1) ",
      note: 'Use a 3D shape like "depth x height x width" or a 2D shape like "rows x columns".',
    },
  },

  setNodeColor: {
    default: {
      signature: "setNodeColor(blockName, nodeName, color)",
      description: "Set the fill color of a node inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeName: `identifier` - Node name",
        "color: `string|null` - Color name or hex code (null clears the color)",
      ],
      example: 'a.setNodeColor(Stem, conv1, "blue")',
    },
  },

  setNodeStroke: {
    default: {
      signature: "setNodeStroke(blockName, nodeName, color)",
      description:
        "Set the stroke/border color of a node inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeName: `identifier` - Node name",
        "color: `string|null` - Stroke color name or hex code (null clears the stroke)",
      ],
      example: 'a.setNodeStroke(Stem, pool1, "yellow")',
    },
  },

  setNodeAnnotation: {
    default: {
      signature: "setNodeAnnotation(blockName, nodeName, position, value)",
      description: "Set an annotation for a node at a specific position.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeName: `identifier` - Node name",
        "position: `left|right|above|below` - Annotation position relative to the node",
        "value: `string|null` - Annotation text (null clears the annotation)",
      ],
      example: 'a.setNodeAnnotation(Stem, conv1, left, "VALUE")',
    },
  },

  hideNode: {
    default: {
      signature: "hideNode(blockName, nodeName)",
      description: "Hide a node inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeName: `identifier` - Node name to hide",
      ],
      example: "a.hideNode(Encoder, add_norm1)",
    },
  },

  showNode: {
    default: {
      signature: "showNode(blockName, nodeName)",
      description: "Show a node inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "nodeName: `identifier` - Node name to show",
      ],
      example: "a.showNode(Encoder, add_norm1)",
    },
  },

  setEdgeLabel: {
    default: {
      signature:
        "setEdgeLabel(blockName, edgeName, label) or setEdgeLabel(diagram, connectionIndex, label)",
      description:
        "Set the label of a block edge by name, or set the label of a diagram connection by index.",
      parameters: [
        "blockName | diagram: `identifier` - A block name, or the literal `diagram`",
        "edgeName | connectionIndex: `identifier | number` - Edge name for a block edge, or connection index for a diagram connection",
        "label: `string | null` - Label text to show. Use null to clear the label",
      ],
      example:
        'a.setEdgeLabel(Encoder, e3, "skip")\na.setEdgeLabel(diagram, 0, "residual")',
    },
  },

  setEdgeShape: {
    default: {
      signature:
        "setEdgeShape(blockName, edgeName, shape) or setEdgeShape(diagram, connectionIndex, shape)",
      description:
        "Set the shape of a block edge by name, or set the shape of a diagram connection by index.",
      parameters: [
        "blockName | diagram: `identifier` - A block name, or the literal `diagram`",
        "edgeName | connectionIndex: `identifier | number` - Edge name for a block edge, or connection index for a diagram connection",
        "shape: `bow | straight | arc` - Edge rendering shape",
      ],
      example:
        "a.setEdgeShape(Encoder, e1, bow)\na.setEdgeShape(diagram, 0, straight)",
    },
  },

  setEdgeColor: {
    default: {
      signature:
        "setEdgeColor(blockName, edgeName, color) or setEdgeColor(diagram, connectionIndex, color)",
      description:
        "Set the color of a block edge by name, or set the color of a diagram connection by index.",
      parameters: [
        "blockName | diagram: `identifier` - A block name, or the literal `diagram`",
        "edgeName | connectionIndex: `identifier | number` - Edge name for a block edge, or connection index for a diagram connection",
        "color: `string | null` - Color name or hex value. Use null to clear the custom color",
      ],
      example:
        'a.setEdgeColor(Encoder, e3, "blue")\na.setEdgeColor(diagram, 1, "red")',
    },
  },

  removeBlock: {
    default: {
      signature: "removeBlock(blockName)",
      description:
        "Remove a block from the architecture. Also removes diagram uses aliases that point to that block and removes diagram connections that reference those aliases.",
      parameters: ["blockName: `identifier` - Block name to remove"],
      example: "a.removeBlock(Encoder)",
    },
  },
  removeGroup: {
    default: {
      signature: "removeGroup(blockName, groupName)",
      description: "Remove a group from a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "groupName: `identifier` - Group name to remove",
      ],
      example: "a.removeGroup(Encoder, row1)",
    },
  },
  removeEdge: (varType) =>
    varType === "architecture"
      ? {
          signature:
            "removeEdge(blockName, edgeName) or removeEdge(diagram, connectionIndex)",
          description:
            "Remove a block edge by its name, or remove a diagram connection by its index.",
          parameters: [
            "blockName | diagram: `identifier` - A block name, or the literal `diagram`",
            "edgeName | connectionIndex: `identifier | number` - Edge name when removing from a block, or connection index when removing from `diagram`",
          ],
          example: "a.removeEdge(Encoder, e3)\na.removeEdge(diagram, 0)",
        }
      : {
          description: "Remove edge between nodes",
          signature: "removeEdge(nodeA-nodeB)",
          parameters: ['edge: `id-id` - Edge in format "nodeA-nodeB"'],
          example: "myGraph.removeEdge(client-router)",
        },

  removeEdges: {
    architecture: {
      signature: "removeEdges(blockName|diagram, edgeNamesOrIndexes)",
      description:
        "Remove multiple edges from a specific block by edge names, or from diagram connections by indexes.",
      parameters: [
        "blockName|diagram: `identifier` - Block name or the literal diagram",
        "edgeNamesOrIndexes: `Array<identifier|number>` - Edge names for block edges, or indexes for diagram connections",
      ],
      example: "a.removeEdges(diagram, [0, 2])",
    },
    default: {
      signature: "removeEdges(blockName, edgeNames)",
      description: "Remove multiple edges from a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "edgeNames: `Array<identifier>` - List of edge names to remove",
      ],
      example: "a.removeEdges(Stem, [e3, e1])",
    },
  },
  hideEdge: {
    default: {
      signature: "hideEdge(blockName, edgeName)",
      description: "Hide an edge inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "edgeName: `identifier` - Edge name to hide",
      ],
      example: "a.hideEdge(Encoder, e1)",
    },
  },

  showEdge: {
    default: {
      signature: "showEdge(blockName, edgeName)",
      description: "Show an edge inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "edgeName: `identifier` - Edge name to show",
      ],
      example: "a.showEdge(Encoder, e1)",
    },
  },

  setBlockLayout: {
    default: {
      signature: "setBlockLayout(blockName, layout)",
      description: "Set the layout of a block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "layout: `horizontal|vertical|grid` - Block layout",
      ],
      example: "a.setBlockLayout(Encoder, vertical)",
    },
  },

  setBlockColor: {
    default: {
      signature: "setBlockColor(blockName, color)",
      description: "Set the color of a block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "color: `string|null` - Color name or hex code (null clears the color)",
      ],
      example: 'a.setBlockColor(Stem, "blue")',
    },
  },

  setBlockAnnotation: {
    default: {
      signature: "setBlockAnnotation(blockName, position, value)",
      description: "Set an annotation for a block at a specific position.",
      parameters: [
        "blockName: `identifier` - Block name",
        "position: `left|right|above|below` - Annotation position relative to the block",
        "value: `string|null` - Annotation text (null clears the annotation)",
      ],
      example: 'a.setBlockAnnotation(Stem, left, "VALUE")',
    },
  },

  hideBlock: {
    default: {
      signature: "hideBlock(blockName)",
      description: "Hide a block.",
      parameters: ["blockName: `identifier` - Block name to hide"],
      example: "a.hideBlock(Stem)",
    },
  },

  showBlock: {
    default: {
      signature: "showBlock(blockName)",
      description: "Show a block.",
      parameters: ["blockName: `identifier` - Block name to show"],
      example: "a.showBlock(Stem)",
    },
  },

  setGroupColor: {
    default: {
      signature: "setGroupColor(blockName, groupName, color)",
      description: "Set the color of a group inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "groupName: `identifier` - Group name",
        "color: `string|null` - Color name or hex code (null clears the color)",
      ],
      example: 'a.setGroupColor(Stem, row1, "red")',
    },
  },

  setGroupLayout: {
    default: {
      signature: "setGroupLayout(blockName, groupName, layout)",
      description: "Set the layout of a group inside a specific block.",
      parameters: [
        "blockName: `identifier` - Block name",
        "groupName: `identifier` - Group name",
        "layout: `horizontal|vertical|grid` - Group layout",
      ],
      example: "a.setGroupLayout(Encoder, row1, vertical)",
    },
  },

  setGroupAnnotation: {
    default: {
      signature: "setGroupAnnotation(blockName, groupName, position, value)",
      description: "Set an annotation for a group at a specific position.",
      parameters: [
        "blockName: `identifier` - Block name",
        "groupName: `identifier` - Group name",
        "position: `left|right|above|below` - Annotation position relative to the group",
        "value: `string|null` - Annotation text (null clears the annotation)",
      ],
      example: 'a.setGroupAnnotation(Stem, conv1, left, "VALUE")',
    },
  },
  setNeuronColor: {
    neuralnetwork: {
      signature: "setNeuronColor(layerIndex, neuronIndex, color)",
      description:
        "Set the color of a neuron at a specific layer and neuron index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "neuronIndex: `number` - Neuron index within the layer (0-based)",
        "color: `string|null` - Color name or hex code (null clears the color)",
      ],
      example: 'nn.setNeuronColor(0, 0, "blue")',
    },
    default: {
      signature: "setNeuronColor(layerIndex, neuronIndex, color)",
      description:
        "Set the color of a neuron at a specific layer and neuron index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "neuronIndex: `number` - Neuron index within the layer (0-based)",
        "color: `string|null` - Color name or hex code (null clears the color)",
      ],
      example: 'nn.setNeuronColor(0, 0, "blue")',
    },
  },

  setNeuron: {
    neuralnetwork: {
      signature: "setNeuron(layerIndex, neuronIndex, value)",
      description:
        "Set the displayed value/label of a neuron at a specific layer and neuron index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "neuronIndex: `number` - Neuron index within the layer (0-based)",
        "value: `number|string|null` - Value/label to display (null clears the value)",
      ],
      example: 'nn.setNeuron(0, 0, "x")',
    },
    default: {
      signature: "setNeuron(layerIndex, neuronIndex, value)",
      description:
        "Set the displayed value/label of a neuron at a specific layer and neuron index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "neuronIndex: `number` - Neuron index within the layer (0-based)",
        "value: `number|string|null` - Value/label to display (null clears the value)",
      ],
      example: 'nn.setNeuron(0, 0, "x")',
    },
  },

  setLayer: {
    neuralnetwork: {
      signature: "setLayer(layerIndex, value)",
      description: "Set the label/value of a layer at a specific layer index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "value: `number|string|null` - Layer label/value (null clears the value)",
      ],
      example: 'nn.setLayer(0, "layerNEW")',
    },
    default: {
      signature: "setLayer(layerIndex, value)",
      description: "Set the label/value of a layer at a specific layer index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "value: `number|string|null` - Layer label/value (null clears the value)",
      ],
      example: 'nn.setLayer(0, "layerNEW")',
    },
  },

  setLayerColor: {
    neuralnetwork: {
      signature: "setLayerColor(layerIndex, color)",
      description: "Set the color of a layer at a specific layer index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "color: `string|null` - Color name or hex code (null clears the color)",
      ],
      example: 'nn.setLayerColor(0, "blue")',
    },
    default: {
      signature: "setLayerColor(layerIndex, color)",
      description: "Set the color of a layer at a specific layer index.",
      parameters: [
        "layerIndex: `number` - Layer index (0-based)",
        "color: `string|null` - Color name or hex code (null clears the color)",
      ],
      example: 'nn.setLayerColor(0, "blue")',
    },
  },

  setNeurons: {
    neuralnetwork: {
      signature: "setNeurons(neurons)",
      description:
        "Set neuron values for all layers using a 2D array (layer-by-layer). Use _ to keep an existing neuron value. Use null to clear neuron value",
      parameters: [
        "neurons: `Array<Array<number|string|null|_>>` - 2D list of neuron values per layer",
      ],
      example: 'nn.setNeurons([["x1", "x2"], [_, "x3"], ["x4", "x3x"]])',
    },
    default: {
      signature: "setNeurons(neurons)",
      description:
        "Set neuron values for all layers using a 2D array (layer-by-layer). Use _ to keep an existing neuron value. Use null to clear neuron value",
      parameters: [
        "neurons: `Array<Array<number|string|null|_>>` - 2D list of neuron values per layer",
      ],
      example: 'nn.setNeurons([["x1", "x2"], [_, "x3"], ["x4", "x3x"]])',
    },
  },

  setNeuronColors: {
    neuralnetwork: {
      signature: "setNeuronColors(colors)",
      description:
        "Set neuron colors for all layers using a 2D array (layer-by-layer). Use _ to keep an existing color. Use null to clear neuron color",
      parameters: [
        "colors: `Array<Array<string|null|_>>` - 2D list of colors per layer",
      ],
      example:
        'nn.setNeuronColors([["blue", null], [null, null], [null, "red"]])',
    },
    default: {
      signature: "setNeuronColors(colors)",
      description:
        "Set neuron colors for all layers using a 2D array (layer-by-layer). Use _ to keep an existing color. Use null to clear neuron color",
      parameters: [
        "colors: `Array<Array<string|null|_>>` - 2D list of colors per layer",
      ],
      example:
        'nn.setNeuronColors([["blue", null], [null, null], [null, "red"]])',
    },
  },

  setLayers: {
    neuralnetwork: {
      signature: "setLayers(layers)",
      description:
        "Set all layer labels/values using an array. Use _ to keep an existing layer value. Use null to clear layer value",
      parameters: [
        "layers: `Array<number|string|null|_>` - List of layer labels/values",
      ],
      example: "nn.setLayers([1, 2, 3])",
    },
    default: {
      signature: "setLayers(layers)",
      description:
        "Set all layer labels/values using an array. Use _ to keep an existing layer value. Use null to clear layer value",
      parameters: [
        "layers: `Array<number|string|null|_>` - List of layer labels/values",
      ],
      example: "nn.setLayers([1, 2, 3])",
    },
  },

  setLayerColors: {
    neuralnetwork: {
      signature: "setLayerColors(colors)",
      description:
        "Set all layer colors using an array. Use _ to keep an existing layer color. Use null to clear layer color",
      parameters: ["colors: `Array<string|null|_>` - List of layer colors"],
      example: 'nn.setLayerColors(["blue", "red", "red"])',
    },
    default: {
      signature: "setLayerColors(colors)",
      description:
        "Set all layer colors using an array. Use _ to keep an existing layer color. Use null to clear layer color",
      parameters: ["colors: `Array<string|null|_>` - List of layer colors"],
      example: 'nn.setLayerColors(["blue", "red", "red"])',
    },
  },

  addNeurons: {
    neuralnetwork: {
      signature: "addNeurons(layerIndex, neurons)",
      description:
        "Add one or more neurons to the end of a specific layer. Use null to clear neuron value",
      parameters: [
        "layerIndex: `number` - Layer index to add neurons to (0-based)",
        "neurons: `Array<number|string|null>` - List of neuron values to add (use null for empty neurons)",
      ],
      example: 'nn.addNeurons(0, ["x", "y"])',
    },
    default: {
      signature: "addNeurons(layerIndex, neurons)",
      description:
        "Add one or more neurons to the end of a specific layer. Use null to clear neuron value",
      parameters: [
        "layerIndex: `number` - Layer index to add neurons to (0-based)",
        "neurons: `Array<number|string|null>` - List of neuron values to add (use null for empty neurons)",
      ],
      example: 'nn.addNeurons(0, ["x", "y"])',
    },
  },

  addLayer: {
    neuralnetwork: {
      signature: "addLayer(layerValue, neurons)",
      description:
        "Add a new layer at the end of the network with the given layer label/value and initial neurons.",
      parameters: [
        "layerValue: `number|string|null` - Label/value of the new layer (use null for an unlabeled layer)",
        "neurons: `Array<number|string|null>` - Initial neuron values for the new layer (use null for empty neurons)",
      ],
      example: 'nn.addLayer("LayerName", ["x", "x", "y", "neuron"])',
    },
    default: {
      signature: "addLayer(layerValue, neurons)",
      description:
        "Add a new layer at the end of the network with the given layer label/value and initial neurons.",
      parameters: [
        "layerValue: `number|string|null` - Label/value of the new layer (use null for an unlabeled layer)",
        "neurons: `Array<number|string|null>` - Initial neuron values for the new layer (use null for empty neurons)",
      ],
      example: 'nn.addLayer("LayerName", ["x", "x", "y", "neuron"])',
    },
  },

  removeLayerAt: {
    neuralnetwork: {
      signature: "removeLayerAt(layerIndex)",
      description:
        "Remove an entire layer at the specified index (including its neurons, neuron colors and layer color).",
      parameters: ["layerIndex: `number` - Layer index to remove (0-based)"],
      example: "nn.removeLayerAt(1)",
    },
    default: {
      signature: "removeLayerAt(layerIndex)",
      description:
        "Remove an entire layer at the specified index (including its neurons and neuron colors).",
      parameters: ["layerIndex: `number` - Layer index to remove (0-based)"],
      example: "nn.removeLayerAt(1)",
    },
  },

  removeNeuronsFromLayer: {
    neuralnetwork: {
      signature: "removeNeuronsFromLayer(layerIndex, valuesToRemove)",
      description:
        "Remove all neurons in a layer whose value matches any entry in valuesToRemove. The corresponding neuron colors are removed at the same indexes.",
      parameters: [
        "layerIndex: `number` - Layer index to remove neurons from (0-based)",
        "valuesToRemove: `Array<number|string|null>` - Values to remove (all occurrences)",
      ],
      example: 'nn.removeNeuronsFromLayer(0, ["x1", null])',
      note: "If you want to remove a literal null, use null.",
    },
    default: {
      signature: "removeNeuronsFromLayer(layerIndex, valuesToRemove)",
      description:
        "Remove all neurons in a layer whose value matches any entry in valuesToRemove. The corresponding neuron colors are removed at the same indexes.",
      parameters: [
        "layerIndex: `number` - Layer index to remove neurons from (0-based)",
        "valuesToRemove: `Array<number|string|null>` - Values to remove (all occurrences)",
      ],
      example: 'nn.removeNeuronsFromLayer(0, ["x1", null])',
      note: "If you want to remove a literal null, use null.",
    },
  },

  // Single Element Methods
  setValue: {
    array: {
      signature: "setValue(index, value)",
      description: "Set value at specific index",
      parameters: [
        "index: `number` - The array index",
        "value: `number|string|null` - The new value",
      ],
      example: "myArray.setValue(0, 42)",
    },
    matrix: {
      signature: "setValue(row, col, value)",
      description: "Set value at specific matrix position",
      parameters: [
        "row: `number` - The row index",
        "col: `number` - The column index",
        "value: `number|string|null` - The new value",
      ],
      example: "myMatrix.setValue(1, 2, 42)",
    },
    text: {
      signature: "setValue(line, value)",
      description: "Set text content for specific line",
      parameters: [
        "line: `number` - The line index",
        "value: `string` - The new text content",
      ],
      example: 'myText.setValue(0, "New title")',
    },
    default: {
      signature: "setValue(index, value)",
      description: "Set value at specific index/position",
      parameters: [
        "index: `number` - The element index",
        "value: `number|string|null` - The new value",
      ],
      example: "element.setValue(0, 42)",
    },
  },

  setColor: {
    array: {
      signature: "setColor(index, color)",
      description: "Set color at specific index",
      parameters: [
        "index: `number` - The array index",
        "color: `string|null` - Color name or hex code",
      ],
      example: 'myArray.setColor(0, "red")',
    },
    matrix: {
      signature: "setColor(row, col, color)",
      description: "Set color at specific matrix position",
      parameters: [
        "row: `number` - The row index",
        "col: `number` - The column index",
        "color: `string|null` - Color name or hex code",
      ],
      example: 'myMatrix.setColor(1, 2, "#ff0000")',
    },
    text: {
      signature: "setColor(line, color)",
      description: "Set color for specific text line",
      parameters: [
        "line: `number` - The line index",
        "color: `string` - Color name or hex code",
      ],
      example: 'myText.setColor(0, "blue")',
    },
    default: {
      signature: "setColor(index, color)",
      description: "Set color at specific index/position",
      parameters: [
        "index: `number` - The element index",
        "color: `string|null` - Color name or hex code",
      ],
      example: 'element.setColor(0, "green")',
    },
  },
  setArrow: {
    array: {
      signature: "setArrow(index, arrow)",
      description: "Set arrow/label at specific index",
      parameters: [
        "index: `number` - The array index",
        "arrow: `string|number|null` - Arrow label or value",
      ],
      example: 'myArray.setArrow(0, "start")',
    },
    matrix: {
      signature: "setArrow(row, col, arrow)",
      description: "Set arrow/label at specific matrix position",
      parameters: [
        "row: `number` - The row index",
        "col: `number` - The column index",
        "arrow: `string|number|null` - Arrow label or value",
      ],
      example: 'myMatrix.setArrow(1, 2, "pivot")',
    },
    default: {
      signature: "setArrow(index, arrow)",
      description: "Set arrow/label at specific index/position",
      parameters: [
        "index: `number` - The element index",
        "arrow: `string|number|null` - Arrow label or value",
      ],
      example: 'element.setArrow(0, "marker")',
    },
  },

  // Multiple Element Methods
  setValues: {
    description: "Set multiple values at once (use _ to keep existing)",
    signature: "setValues([values])",
    parameters: [
      "values: `array` - Array of values (use _ to keep existing values)",
    ],
    example: "myArray.setValues([1, _, 3, 4]) // keeps index 1 unchanged",
  },
  setColors: {
    description: "Set multiple colors at once",
    signature: "setColors([colors])",
    parameters: ["colors: `array` - Array of color values"],
    example: 'myArray.setColors(["red", "green", null, "blue"])',
  },
  setArrows: {
    description: "Set multiple arrows at once",
    signature: "setArrows([arrows])",
    parameters: ["arrows: `array` - Array of arrow values"],
    example: 'myArray.setArrows(["start", null, "pivot", "end"])',
  },

  // Add/Insert Methods
  addValue: {
    description: "Add value to end of structure",
    signature: "addValue(value)",
    parameters: ["value: `number|string|null` - The value to add"],
    example: "myArray.addValue(42)",
  },
  insertValue: {
    description: "Insert value at specific index",
    signature: "insertValue(index, value)",
    parameters: [
      "index: `number` - Position to insert at",
      "value: `number|string|null` - The value to insert",
    ],
    example: "myArray.insertValue(2, 42)",
  },
  insertRow: {
    description: "Insert row at specific index with optional values",
    signature: "insertRow(index, [values])",
    parameters: [
      "index: `number` - Position to insert at",
      "values: `array` - (optional) Array of values for the new row",
    ],
    example: "myMatrix.insertRow(1, [4, 5, 6])",
  },
  insertColumn: {
    description: "Insert column at specific index with optional values",
    signature: "insertColumn(index, [values])",
    parameters: [
      "index: `number` - Position to insert at",
      "values: `array` - (optional) Array of values for the new column",
    ],
    example: "myMatrix.insertColumn(1, [4, 5, 6])",
  },

  // Remove Methods
  removeValue: {
    description: "Remove first occurrence of value",
    signature: "removeValue(value)",
    parameters: ["value: `number|string|null` - The value to remove"],
    example: "myArray.removeValue(42)",
  },
  removeAt: {
    description: "Remove element at specific index",
    signature: "removeAt(index)",
    parameters: ["index: `number` - The index to remove"],
    example: "myArray.removeAt(2)",
  },

  // Graph-specific Methods
  addNode: {
    description: "Add node to graph structure",
    signature: "addNode(name, value)",
    parameters: [
      "name: `id` - The node identifier",
      "value: `number|string` - The node value",
    ],
    example: "myGraph.addNode(client, 42)",
  },
  insertNode: {
    description: "Insert node at specific index/position with optional value",
    signature: "insertNode(index|id, name, value?)",
    parameters: [
      "index: `number|id` - Position to insert at (numeric index or node id)",
      "name: `string` - The node identifier",
      "value: `number|string` - (optional) The node value",
    ],
    example:
      "myLinkedList.insertNode(2, newNode, 42) or myGraph.insertNode(router, newNode, 42)",
  },

  addEdge: {
    description: "Add edge between two nodes",
    signature: "addEdge(nodeA-nodeB)",
    parameters: ['edge: `id-id` - Edge in format "nodeA-nodeB"'],
    example: "myGraph.addEdge(client-router)",
  },

  setEdges: {
    description: "Set all edges at once",
    signature: "setEdges([edges])",
    parameters: [
      "edges: `array` - Array of edges in format [nodeA-nodeB, ...]",
    ],
    example: "myGraph.setEdges([client-router, router-server])",
  },
  setHidden: {
    description: "Set visibility of graph element",
    signature: "setHidden(index, hidden)",
    parameters: [
      "index: `number` - The element index",
      "hidden: `boolean` - Whether to hide the element",
    ],
    example: "myGraph.setHidden(2, true)",
  },

  // Tree-specific Methods
  addChild: {
    description: "Add child to tree node",
    signature: "addChild(parent-child, value)",
    parameters: [
      'relationship: `string` - Parent-child in format "parent-child"',
      "value: `number|string` - The child value",
    ],
    example: "myTree.addChild(root-newChild, 42)",
  },
  setChild: {
    description: "Set child relationship in tree",
    signature: "setChild(parent-child)",
    parameters: [
      'relationship: `id-id` - Parent-child in format "parent-child"',
    ],
    example: "myTree.setChild(root-leftChild)",
  },
  removeSubtree: {
    description: "Remove entire subtree starting from node",
    signature: "removeSubtree(node)",
    parameters: ["node: `id` - The root node of subtree to remove"],
    example: "myTree.removeSubtree(leftBranch)",
  },

  // Matrix-specific Methods
  addRow: {
    description: "Add row at end of matrix",
    signature: "addRow([values]?)",
    parameters: [
      "values?: `array` - (optional) Array of values for the new row",
    ],
    example: "myMatrix.addRow([1, 2, 3])",
  },
  addColumn: {
    description: "Add column at end of matrix",
    signature: "addColumn([values]?)",
    parameters: ["values?: `array` - Array of values for the new column"],
    example: "myMatrix.addColumn([4, 5, 6])",
  },
  removeRow: {
    description: "Remove row from matrix",
    signature: "removeRow(index)",
    parameters: ["index: `number` - The row index to remove"],
    example: "myMatrix.removeRow(2)",
  },
  removeColumn: {
    description: "Remove column from matrix",
    signature: "removeColumn(index)",
    parameters: ["index: `number` - The column index to remove"],
    example: "myMatrix.removeColumn(1)",
  },
  insertRow: {
    description: "Insert row at specific index with optional values",
    signature: "insertRow(index, [values]?)",
    parameters: [
      "index: `number` - Position to insert at",
      "values: `array` - (optional) Array of values for the new row",
    ],
    example: "myMatrix.insertRow(1, [4, 5, 6])",
  },
  insertColumn: {
    description: "Insert column at specific index with optional values",
    signature: "insertColumn(index, [values]?)",
    parameters: [
      "index: `number` - Position to insert at",
      "values: `array` - (optional) Array of values for the new column",
    ],
    example: "myMatrix.insertColumn(1, [4, 5, 6])",
  },
  addBorder: {
    description: "Add border to matrix with value and color",
    signature: "addBorder(value, color)",
    parameters: [
      "value: `number|string` - Border value",
      "color: `string` - Border color",
    ],
    example: 'myMatrix.addBorder(0, "gray")',
  },

  // Text-specific Methods
  setFontSize: {
    text: {
      signature: "setFontSize(size) or setFontSize(line, size)",
      description: "Set font size for all text or specific line",
      parameters: [
        "size: `number` - Font size in pixels",
        "line: `number` - (optional) Specific line index",
      ],
      example: "myText.setFontSize(16) or myText.setFontSize(0, 20)",
    },
    default: {
      signature: "setFontSize(size)",
      description: "Set font size for text element",
      parameters: ["size: `number` - Font size in pixels"],
      example: "myText.setFontSize(16)",
    },
  },
  setFontWeight: {
    text: {
      signature: "setFontWeight(weight) or setFontWeight(line, weight)",
      description: "Set font weight for all text or specific line",
      parameters: [
        "weight: `string` - Font weight (normal, bold, etc.)",
        "line: `number` - (optional) Specific line index",
      ],
      example:
        'myText.setFontWeight("bold") or myText.setFontWeight(0, "normal")',
    },
    default: {
      signature: "setFontWeight(weight)",
      description: "Set font weight for text element",
      parameters: ["weight: `string` - Font weight (normal, bold, etc.)"],
      example: 'myText.setFontWeight("bold")',
    },
  },
  setFontFamily: {
    text: {
      signature: "setFontFamily(family) or setFontFamily(line, family)",
      description: "Set font family for all text or specific line",
      parameters: [
        "family: `string` - Font family name",
        "line: `number` - (optional) Specific line index",
      ],
      example:
        'myText.setFontFamily("Arial") or myText.setFontFamily(0, "Georgia")',
    },
    default: {
      signature: "setFontFamily(family)",
      description: "Set font family for text element",
      parameters: ["family: `string` - Font family name"],
      example: 'myText.setFontFamily("Arial")',
    },
  },
  setAlign: {
    text: {
      signature: "setAlign(alignment) or setAlign(line, alignment)",
      description: "Set text alignment for all text or specific line",
      parameters: [
        "alignment: `string` - Text alignment (left, center, right)",
        "line: `number` - (optional) Specific line index",
      ],
      example: 'myText.setAlign("center") or myText.setAlign(0, "left")',
    },
    default: {
      signature: "setAlign(alignment)",
      description: "Set text alignment",
      parameters: [
        "alignment: `string` - Text alignment (left, center, right)",
      ],
      example: 'myText.setAlign("center")',
    },
  },
  setFontSizes: {
    description: "Set font sizes for multiple text lines",
    signature: "setFontSizes([sizes])",
    parameters: ["sizes: `array` - Array of font sizes for each line"],
    example: "myText.setFontSizes([20, 16, 12])",
  },
  setFontWeights: {
    description: "Set font weights for multiple text lines",
    signature: "setFontWeights([weights])",
    parameters: ["weights: `array` - Array of font weights for each line"],
    example: 'myText.setFontWeights(["bold", "normal", "normal"])',
  },
  setFontFamilies: {
    description: "Set font families for multiple text lines",
    signature: "setFontFamilies([families])",
    parameters: ["families: `array` - Array of font families for each line"],
    example: 'myText.setFontFamilies(["Arial", "Georgia", "Times"])',
  },
  setAligns: {
    description: "Set alignments for multiple text lines",
    signature: "setAligns([alignments])",
    parameters: ["alignments: `array` - Array of alignments for each line"],
    example: 'myText.setAligns(["center", "left", "right"])',
  },
  setLineSpacing: {
    description: "Set spacing between text lines",
    signature: "setLineSpacing(spacing)",
    parameters: ["spacing: `number` - Spacing between lines in pixels"],
    example: "myText.setLineSpacing(20)",
  },
  setWidth: {
    description: "Set text box width",
    signature: "setWidth(width)",
    parameters: ["width: `number` - Text box width in pixels"],
    example: "myText.setWidth(300)",
  },
  setHeight: {
    description: "Set text box height",
    signature: "setHeight(height)",
    parameters: ["height: `number` - Text box height in pixels"],
    example: "myText.setHeight(100)",
  },

  // Text positioning method for non-text objects
  setText: {
    description:
      "Set or remove text at a specific position around the component",
    signature: "setText(text, position)",
    parameters: [
      "text: `string|null` - Text to display or null to remove",
      'position: `string` - Position around the object ("above", "below", "left", "right")',
    ],
    example:
      'myArray.setText("Label", "above") or myArray.setText(null, "above")',
    note: "Creates or modifies placement text objects. Use null to remove text. If text object already exists at position, updates it directly.",
  },
};

// Simple method descriptions for autocomplete (fallback)
export const methodDescriptions = {
  setValue: "Set value at specific index/position",
  setColor: "Set color at specific index/position",
  setArrow: "Set arrow/label at specific index/position",
  setValues: "Set multiple values at once",
  setColors: "Set multiple colors at once",
  setArrows: "Set multiple arrows at once",
  addValue: "Add value to end of structure",
  insertValue: "Insert value at specific index",
  removeValue: "Remove first occurrence of value",
  removeAt: "Remove element at specific index",
  addNode: "Add new node to structure",
  insertNode: "Insert node at specific index",
  removeNode: "Remove specific node",
  addEdge: "Add edge between nodes",
  removeEdge: "Remove specific edge",
  setEdges: "Set all edges at once",
  setHidden: "Set visibility of elements",
  addChild: "Add child to parent node",
  setChild: "Change parent-child relationship",
  removeSubtree: "Remove node and its subtree",
  addRow: "Add new row to matrix",
  addColumn: "Add new column to matrix",
  removeRow: "Remove row from matrix",
  removeColumn: "Remove column from matrix",
  addBorder: "Add border around matrix",
  insertRow: "Insert row at specific index with optional values",
  insertColumn: "Insert column at specific index with optional values",
  setFontSize: "Set font size",
  setFontWeight: "Set font weight",
  setFontFamily: "Set font family",
  setAlign: "Set text alignment",
  setFontSizes: "Set multiple font sizes",
  setFontWeights: "Set multiple font weights",
  setFontFamilies: "Set multiple font families",
  setAligns: "Set multiple text alignments",
  setLineSpacing: "Set spacing between lines",
  setWidth: "Set text box width",
  setHeight: "Set text box height",
  setText: "Set or remove text at a specific position around the component",
  setNeuronColor: "Set neuron color at a specific layer and neuron index",
  setNeuron: "Set neuron value at a specific layer and neuron index",
  setLayer: "Set layer value at a specific layer index",
  setLayerColor: "Set layer color at a specific layer index",
  setNeurons: "Set all neuron values using a 2D array (layer-by-layer)",
  setNeuronColors: "Set all neuron colors using a 2D array (layer-by-layer)",
  setLayers: "Set all layer values using an array",
  setLayerColors: "Set all layer colors using an array",
  addNeurons: "Add one or more neurons to a specific layer",
  addLayer: "Insert a new layer with specified neurons at a given index",
  removeLayerAt: "Remove an entire layer at a specific index",
  removeNeuronsFromLayer:
    "Remove one or more neurons from a specific layer by value",
  removeNodes: "Remove multiple nodes from a specific block",
  setNodeLabel: "Set the label of a node inside a specific block",
  setNodeColor: "Set the fill color of a node inside a specific block",
  setNodeShape: "Set the shape of a node inside a specific block",
  setNodeStroke:
    "Set the stroke/border color of a node inside a specific block",
  setNodeAnnotation: "Set an annotation for a node at a specific position",
  hideNode: "Hide a node inside a specific block",
  showNode: "Show a node inside a specific block",

  setEdgeLabel:
    "Set a block edge label by edge name, or a diagram connection label by index",
  setEdgeColor:
    "Set a block edge color by edge name, or a diagram connection color by index",
  setEdgeShape:
    "Set a block edge shape by edge name, or a diagram connection shape by index",
  removeEdges: "Remove multiple edges from a specific block",
  hideEdge: "Hide an edge inside a specific block",
  showEdge: "Show an edge inside a specific block",

  setBlockColor: "Set the color of a block",
  setBlockAnnotation: "Set an annotation for a block at a specific position",
  setBlockLayout: "Set the layout of a block",
  hideBlock: "Hide a block",
  showBlock: "Show a block",

  setGroupColor: "Set the color of a group inside a specific block",
  setGroupAnnotation: "Set an annotation for a group at a specific position",
  setGroupLayout: "Set the layout of a group inside a specific block",
  removeGroup: "Remove a group from a specific block",
  removeBlock:
    "Remove a block and clean related diagram uses/connects references",
};

// Theme configuration for syntax highlighting
export const themeConfig = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "custom-error", foreground: "ff0000", fontStyle: "bold" },
    { token: "custom-warning", foreground: "FFA500", fontStyle: "italic" },
    { token: "custom-info", foreground: "0000ff" },
    { token: "custom-debug", foreground: "008800" },
    { token: "custom-number", foreground: "800080" },

    { token: "comment", foreground: "6a9955" },
    { token: "inlinecomment", foreground: "6a9955" },

    { token: "variable", foreground: "50C1F9" },
    { token: "number", foreground: "b5cea8" },
    { token: "keyword", foreground: "8477FD" },
    { token: "symbol", foreground: "ffffff" },
    { token: "string", foreground: "3AE1FF", fontStyle: "bold" },

    { token: "component", foreground: "21FFD6" },
    { token: "attribute", foreground: "21FFD6" },
    { token: "positional", foreground: "21FFD6" },
    { token: "dot-command", foreground: "21FFD6" },

    { token: "arch-header", foreground: "21FFD6" },
    { token: "arch-section", foreground: "7CDCF9" },
    { token: "arch-inline-prop", foreground: "C792EA" },
    { token: "external-method-call", foreground: "21FFD6" },

    // ids before "=" like add_norm1, feed_forward
    { token: "arch-item-name", foreground: "50C1F9" },
  ],
  colors: {
    "editor.background": "#1E1E1E",
    "editor.foreground": "#FFFFFF",
    "editorCursor.foreground": "#A7A7A7",
    "editor.lineHighlightBackground": "#333333",
    "editorLineNumber.foreground": "#858585",
    "editor.selectionBackground": "#264F78",
    "editor.inactiveSelectionBackground": "#3A3D41",
  },
};
// Language configuration for Monaco editor
export const monacoLanguageConfig = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"],
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

// Error state management for Monaco editor
export class ErrorStateManager {
  constructor() {
    this.monaco = null;
    this.editor = null;
    this.currentMarkers = [];
  }

  init(monaco, editor) {
    this.monaco = monaco;
    this.editor = editor;
  }

  /**
   * Create a structured error object
   * @param {string} message - Error message
   * @param {number} line - Line number (1-based)
   * @param {number} col - Column number (1-based)
   * @returns {Object} Structured error object
   */
  static createError(message, line = 1, col = 1) {
    return {
      message,
      line: Math.max(1, line),
      col: Math.max(1, col),
    };
  }

  /**
   * Set error with structured error object or individual parameters
   * @param {Object|string} error - Error object with {line, col, message} or error message string
   * @param {number} [lineNumber] - Line number (1-based) if error is a string
   * @param {number} [columnNumber] - Column number (1-based) if error is a string
   */
  setError(error, lineNumber = null, columnNumber = null) {
    if (!this.monaco || !this.editor) return;

    // Clear existing markers
    this.clearErrors();

    if (!error) return;

    let errorObj;

    // Handle structured error object
    if (typeof error === "object" && error !== null) {
      errorObj = {
        line: error.line || 1,
        col: error.col || 1,
        message: error.message || "Unknown error",
      };
    } else {
      // Handle legacy string error message with optional line/col parameters
      errorObj = {
        line: lineNumber || 1,
        col: columnNumber || 1,
        message: error.toString(),
      };
    }

    // Create marker for the error
    const model = this.editor.getModel();
    if (!model) return;

    // Validate line number - must be between 1 and the total number of lines
    const totalLines = model.getLineCount();
    const validLine = Math.max(1, Math.min(errorObj.line, totalLines));
    const validCol = Math.max(1, errorObj.col);

    // Get line content safely
    let endColumn = validCol + 1;
    try {
      const lineContent = model.getLineContent(validLine);
      if (lineContent) {
        endColumn = Math.max(
          validCol + 1,
          Math.min(lineContent.length + 1, validCol + 50),
        );
      }
    } catch (e) {
      console.warn("Error getting line content:", e);
      endColumn = validCol + 10;
    }

    // Only show first 10 lines of the error message, if so add ...$
    const errorMessage =
      errorObj.message.split("\n").slice(0, 10).join("\n") +
      (errorObj.message.split("\n").length > 10 ? "\n..." : "");

    const marker = {
      startLineNumber: validLine,
      startColumn: validCol,
      endLineNumber: validLine,
      endColumn: endColumn,
      message: errorMessage,
      severity: this.monaco.MarkerSeverity.Error,
    };

    this.currentMarkers = [marker];

    try {
      this.monaco.editor.setModelMarkers(
        model,
        "merlin-errors",
        this.currentMarkers,
      );
    } catch (e) {
      console.warn("Error setting markers:", e);
    }
  }

  clearErrors() {
    if (!this.monaco || !this.editor) return;

    const model = this.editor.getModel();
    if (model) {
      try {
        this.monaco.editor.setModelMarkers(model, "merlin-errors", []);
      } catch (e) {
        console.warn("Error clearing markers:", e);
      }
    }
    this.currentMarkers = [];
  }
}

// Create a singleton instance
export const errorStateManager = new ErrorStateManager();
