// Language configuration for Merlin custom language support
// This file contains all the definitions for syntax highlighting, autocomplete, and documentation

export const languageConfig = {
  // Basic language tokens
  keywords: ['page', 'show', 'hide', 'visslides', 'data', 'draw'],
  
  symbols: [':', ':=', '=', '*', ',', '@', '&', '(', ')', '[', ']', '{', '}'],
  
  components: ['array', 'matrix', 'linkedlist', 'stack', 'tree', 'graph', 'text'],
  
  attributes: [
    'id', 'value', 'color', 'arrow', 'nodes', 'edges', 'hidden', 
    'above', 'below', 'left', 'right', 'fontSize', 'fontWeight', 
    'fontFamily', 'align', 'lineSpacing', 'width', 'height', 'children'
  ],

  // Position keywords for syntax highlighting
  positionKeywords: [
    // Corner positions
    'tl', 'tr', 'bl', 'br', 'top-left', 'top-right', 'bottom-left', 'bottom-right',
    // Edge positions  
    'top', 'bottom', 'left', 'right',
    // Center positions
    'center', 'centre'
  ],

  namedColors: [
    // Basic colors
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown',
    'black', 'white', 'gray', 'grey', 'navy', 'maroon', 'olive', 'teal',
    'cyan', 'magenta', 'lime', 'aqua', 'silver', 'gold', 'coral', 'salmon',
    // Light colors
    'lightblue', 'lightgreen', 'lightcoral', 'lightgray', 'lightpink', 'lightyellow',
    // Dark colors  
    'darkblue', 'darkgreen', 'darkred', 'darkgray', 'darkviolet',
    // Named colors
    'cornflowerblue', 'crimson', 'indigo', 'turquoise', 'violet', 'tomato'
  ],
  fontWeights: ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
  fontFamilies: ['Arial', 'Helvetica', 'Times New Roman', 'Times', 'Courier New', 'Courier', 'Georgia', 'Verdana', 'sans-serif', 'serif', 'monospace'],
  alignValues: ['left', 'center', 'right'],
};

// Data structure type documentation with features and documentation links
export const typeDocumentation = {
  array: {
    description: 'Arrays represent ordered collections of elements with indexed access.',
    features: ['Fixed or dynamic size', 'Index-based element access', 'Support for colors and arrows'],
    url: 'https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/array'
  },
  matrix: {
    description: 'Matrices represent 2D grids of elements with row-column access.',
    features: ['2D grid structure', 'Row and column operations', 'Border support'],
    url: 'https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/matrix'
  },
  linkedlist: {
    description: 'Linked lists represent sequences of connected nodes.',
    features: ['Node-based structure', 'Dynamic size', 'Sequential access'],
    url: 'https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/linkedlist'
  },
  stack: {
    description: 'Stacks implement Last-In-First-Out (LIFO) data structure.',
    features: ['LIFO operations', 'Push/pop semantics', 'Visual stack representation'],
    url: 'https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/stack'
  },
  tree: {
    description: 'Trees represent hierarchical data structures with parent-child relationships.',
    features: ['Hierarchical structure', 'Parent-child relationships', 'Subtree operations'],
    url: 'https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/tree'
  },
  graph: {
    description: 'Graphs represent networks of interconnected nodes and edges.',
    features: ['Node and edge operations', 'Flexible connections', 'Visibility control'],
    url: 'https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/graph'
  },
  text: {
    description: 'Text elements for displaying formatted text content.',
    features: ['Multi-line support', 'Font customization', 'Alignment options'],
    url: 'https://eth-peach-lab.github.io/merlin-docs/docs/data-structures/text'
  }
};

// Method availability by data structure type
export const typeMethodsMap = {
  array: {
    single: ['setValue', 'setColor', 'setArrow'],
    multiple: ['setValues', 'setColors', 'setArrows'],
    addInsert: ['addValue', 'insertValue'],
    remove: ['removeValue', 'removeAt']
  },
  stack: {
    single: ['setValue', 'setColor', 'setArrow'],
    multiple: ['setValues', 'setColors', 'setArrows'],
    addInsert: ['addValue', 'insertValue'],
    remove: ['removeValue', 'removeAt']
  },
  matrix: {
    single: ['setValue', 'setColor', 'setArrow'],
    multiple: ['setValues', 'setColors', 'setArrows'],
    matrixSpecific: ['addRow', 'addColumn', 'removeRow', 'removeColumn', 'addBorder']
  },
  linkedlist: {
    single: ['setValue', 'setColor', 'setArrow'],
    multiple: ['setValues', 'setColors', 'setArrows'],
    addInsert: ['addValue', 'insertValue', 'addNode', 'insertNode'],
    remove: ['removeValue', 'removeAt', 'removeNode']
  },
  graph: {
    single: ['setValue', 'setColor', 'setArrow', 'setHidden'],
    multiple: ['setValues', 'setColors', 'setArrows', 'setHidden'],
    addInsert: ['addNode', 'addEdge', 'insertEdge'],
    remove: ['removeNode', 'removeEdge'],
    graphSpecific: ['setEdges']
  },
  tree: {
    single: ['setValue', 'setColor', 'setArrow'],
    multiple: ['setValues', 'setColors', 'setArrows'],
    addInsert: ['addNode', 'addChild'],
    remove: ['removeNode', 'removeSubtree'],
    treeSpecific: ['setChild']
  },
  text: {
    single: ['setFontSize', 'setColor', 'setFontWeight', 'setFontFamily', 'setAlign'],
    multiple: ['setFontSizes', 'setColors', 'setFontWeights', 'setFontFamilies', 'setAligns'],
    textSpecific: ['setLineSpacing', 'setWidth', 'setHeight']
  }
};

// Method signatures for autocomplete snippets
export const methodSignatures = {
  setValue: (varType) => varType === 'matrix' ? 'setValue(${1:row}, ${2:col}, ${3:value})' : 'setValue(${1:index}, ${2:value})',
  setColor: (varType) => varType === 'matrix' ? 'setColor(${1:row}, ${2:col}, ${3:color})' : 'setColor(${1:index}, ${2:color})',
  setArrow: (varType) => varType === 'matrix' ? 'setArrow(${1:row}, ${2:col}, ${3:arrow})' : 'setArrow(${1:index}, ${2:arrow})',
  setValues: () => 'setValues([${1:values}])',
  setColors: () => 'setColors([${1:colors}])',
  setArrows: () => 'setArrows([${1:arrows}])',
  addValue: () => 'addValue(${1:value})',
  insertValue: () => 'insertValue(${1:index}, ${2:value})',
  removeValue: () => 'removeValue(${1:value})',
  removeAt: () => 'removeAt(${1:index})',
  addNode: () => 'addNode(${1:name}, ${2:value})',
  insertNode: () => 'insertNode(${1:index}, ${2:name})',
  removeNode: () => 'removeNode(${1:name})',
  addEdge: () => 'addEdge(${1:nodeA}-${2:nodeB})',
  insertEdge: () => 'insertEdge(${1:index}, ${2:nodeA}-${3:nodeB})',
  removeEdge: () => 'removeEdge(${1:nodeA}-${2:nodeB})',
  setEdges: () => 'setEdges([${1:edges}])',
  setHidden: () => 'setHidden(${1:index}, ${2:hidden})',
  addChild: () => 'addChild(${1:parent}-${2:child}, ${3:value})',
  setChild: () => 'setChild(${1:parent}-${2:child})',
  removeSubtree: () => 'removeSubtree(${1:node})',
  addRow: () => 'addRow([${1:values}])',
  addColumn: () => 'addColumn(${1:position}, [${2:values}])',
  removeRow: () => 'removeRow(${1:index})',
  removeColumn: () => 'removeColumn(${1:index})',
  addBorder: () => 'addBorder(${1:value}, ${2:color})',
  setFontSize: () => 'setFontSize(${1:size})',
  setFontWeight: () => 'setFontWeight(${1:weight})',
  setFontFamily: () => 'setFontFamily(${1:family})',
  setAlign: () => 'setAlign(${1:alignment})',
  setFontSizes: () => 'setFontSizes([${1:sizes}])',
  setFontWeights: () => 'setFontWeights([${1:weights}])',
  setFontFamilies: () => 'setFontFamilies([${1:families}])',
  setAligns: () => 'setAligns([${1:alignments}])',
  setLineSpacing: () => 'setLineSpacing(${1:spacing})',
  setWidth: () => 'setWidth(${1:width})',
  setHeight: () => 'setHeight(${1:height})'
};

// Comprehensive method documentation with type-specific variations
export const methodDocumentation = {
  // Single Element Methods
  setValue: {
    array: {
      signature: 'setValue(index, value)',
      description: 'Set value at specific index',
      parameters: ['index: `number` - The array index', 'value: `number|string|null` - The new value'],
      example: 'myArray.setValue(0, 42)'
    },
    matrix: {
      signature: 'setValue(row, col, value)',
      description: 'Set value at specific matrix position',
      parameters: ['row: `number` - The row index', 'col: `number` - The column index', 'value: `number|string|null` - The new value'],
      example: 'myMatrix.setValue(1, 2, 42)'
    },
    text: {
      signature: 'setValue(line, value)',
      description: 'Set text content for specific line',
      parameters: ['line: `number` - The line index', 'value: `string` - The new text content'],
      example: 'myText.setValue(0, "New title")'
    },
    default: {
      signature: 'setValue(index, value)',
      description: 'Set value at specific index/position',
      parameters: ['index: `number` - The element index', 'value: `number|string|null` - The new value'],
      example: 'element.setValue(0, 42)'
    }
  },
  setColor: {
    array: {
      signature: 'setColor(index, color)',
      description: 'Set color at specific index',
      parameters: ['index: `number` - The array index', 'color: `string|null` - Color name or hex code'],
      example: 'myArray.setColor(0, "red")'
    },
    matrix: {
      signature: 'setColor(row, col, color)',
      description: 'Set color at specific matrix position',
      parameters: ['row: `number` - The row index', 'col: `number` - The column index', 'color: `string|null` - Color name or hex code'],
      example: 'myMatrix.setColor(1, 2, "#ff0000")'
    },
    text: {
      signature: 'setColor(line, color)',
      description: 'Set color for specific text line',
      parameters: ['line: `number` - The line index', 'color: `string` - Color name or hex code'],
      example: 'myText.setColor(0, "blue")'
    },
    default: {
      signature: 'setColor(index, color)',
      description: 'Set color at specific index/position',
      parameters: ['index: `number` - The element index', 'color: `string|null` - Color name or hex code'],
      example: 'element.setColor(0, "green")'
    }
  },
  setArrow: {
    array: {
      signature: 'setArrow(index, arrow)',
      description: 'Set arrow/label at specific index',
      parameters: ['index: `number` - The array index', 'arrow: `string|number|null` - Arrow label or value'],
      example: 'myArray.setArrow(0, "start")'
    },
    matrix: {
      signature: 'setArrow(row, col, arrow)',
      description: 'Set arrow/label at specific matrix position',
      parameters: ['row: `number` - The row index', 'col: `number` - The column index', 'arrow: `string|number|null` - Arrow label or value'],
      example: 'myMatrix.setArrow(1, 2, "pivot")'
    },
    default: {
      signature: 'setArrow(index, arrow)',
      description: 'Set arrow/label at specific index/position',
      parameters: ['index: `number` - The element index', 'arrow: `string|number|null` - Arrow label or value'],
      example: 'element.setArrow(0, "marker")'
    }
  },

  // Multiple Element Methods
  setValues: {
    description: 'Set multiple values at once (use _ to keep existing)',
    signature: 'setValues([values])',
    parameters: ['values: `array` - Array of values (use _ to keep existing values)'],
    example: 'myArray.setValues([1, _, 3, 4]) // keeps index 1 unchanged'
  },
  setColors: {
    description: 'Set multiple colors at once',
    signature: 'setColors([colors])',
    parameters: ['colors: `array` - Array of color values'],
    example: 'myArray.setColors(["red", "green", null, "blue"])'
  },
  setArrows: {
    description: 'Set multiple arrows at once',
    signature: 'setArrows([arrows])',
    parameters: ['arrows: `array` - Array of arrow values'],
    example: 'myArray.setArrows(["start", null, "pivot", "end"])'
  },

  // Add/Insert Methods
  addValue: {
    description: 'Add value to end of structure',
    signature: 'addValue(value)',
    parameters: ['value: `number|string|null` - The value to add'],
    example: 'myArray.addValue(42)'
  },
  insertValue: {
    description: 'Insert value at specific index',
    signature: 'insertValue(index, value)',
    parameters: ['index: `number` - Position to insert at', 'value: `number|string|null` - The value to insert'],
    example: 'myArray.insertValue(2, 42)'
  },

  // Remove Methods
  removeValue: {
    description: 'Remove first occurrence of value',
    signature: 'removeValue(value)',
    parameters: ['value: `number|string|null` - The value to remove'],
    example: 'myArray.removeValue(42)'
  },
  removeAt: {
    description: 'Remove element at specific index',
    signature: 'removeAt(index)',
    parameters: ['index: `number` - The index to remove'],
    example: 'myArray.removeAt(2)'
  },

  // Graph-specific Methods
  addNode: {
    description: 'Add node to graph structure',
    signature: 'addNode(name, value)',
    parameters: ['name: `string` - The node identifier', 'value: `number|string` - The node value'],
    example: 'myGraph.addNode("n4", 42)'
  },
  insertNode: {
    description: 'Insert node at specific index',
    signature: 'insertNode(index, name)',
    parameters: ['index: `number` - Position to insert at', 'name: `string` - The node identifier'],
    example: 'myLinkedList.insertNode(2, "newNode")'
  },
  removeNode: {
    description: 'Remove node from structure',
    signature: 'removeNode(name)',
    parameters: ['name: `string` - The node identifier to remove'],
    example: 'myGraph.removeNode("n3")'
  },
  addEdge: {
    description: 'Add edge between two nodes',
    signature: 'addEdge(nodeA-nodeB)',
    parameters: ['edge: `string` - Edge in format "nodeA-nodeB"'],
    example: 'myGraph.addEdge("n1-n4")'
  },
  insertEdge: {
    description: 'Insert edge at specific index',
    signature: 'insertEdge(index, nodeA-nodeB)',
    parameters: ['index: `number` - Position to insert at', 'edge: `string` - Edge in format "nodeA-nodeB"'],
    example: 'myGraph.insertEdge(1, "n2-n4")'
  },
  removeEdge: {
    description: 'Remove edge between nodes',
    signature: 'removeEdge(nodeA-nodeB)',
    parameters: ['edge: `string` - Edge in format "nodeA-nodeB"'],
    example: 'myGraph.removeEdge("n1-n3")'
  },
  setEdges: {
    description: 'Set all edges at once',
    signature: 'setEdges([edges])',
    parameters: ['edges: `array` - Array of edges in format ["nodeA-nodeB", ...]'],
    example: 'myGraph.setEdges(["n1-n2", "n2-n3"])'
  },
  setHidden: {
    description: 'Set visibility of graph element',
    signature: 'setHidden(index, hidden)',
    parameters: ['index: `number` - The element index', 'hidden: `boolean` - Whether to hide the element'],
    example: 'myGraph.setHidden(2, true)'
  },

  // Tree-specific Methods
  addChild: {
    description: 'Add child to tree node',
    signature: 'addChild(parent-child, value)',
    parameters: ['relationship: `string` - Parent-child in format "parent-child"', 'value: `number|string` - The child value'],
    example: 'myTree.addChild("root-newChild", 42)'
  },
  setChild: {
    description: 'Set child relationship in tree',
    signature: 'setChild(parent-child)',
    parameters: ['relationship: `string` - Parent-child in format "parent-child"'],
    example: 'myTree.setChild("n1-n4")'
  },
  removeSubtree: {
    description: 'Remove entire subtree starting from node',
    signature: 'removeSubtree(node)',
    parameters: ['node: `string` - The root node of subtree to remove'],
    example: 'myTree.removeSubtree("n3")'
  },

  // Matrix-specific Methods
  addRow: {
    description: 'Add row to matrix',
    signature: 'addRow([values])',
    parameters: ['values: `array` - Array of values for the new row'],
    example: 'myMatrix.addRow([1, 2, 3])'
  },
  addColumn: {
    description: 'Add column to matrix at specified position',
    signature: 'addColumn(position, [values])',
    parameters: ['position: `number` - Column position to insert at', 'values: `array` - Array of values for the new column'],
    example: 'myMatrix.addColumn(1, [4, 5, 6])'
  },
  removeRow: {
    description: 'Remove row from matrix',
    signature: 'removeRow(index)',
    parameters: ['index: `number` - The row index to remove'],
    example: 'myMatrix.removeRow(2)'
  },
  removeColumn: {
    description: 'Remove column from matrix',
    signature: 'removeColumn(index)',
    parameters: ['index: `number` - The column index to remove'],
    example: 'myMatrix.removeColumn(1)'
  },
  addBorder: {
    description: 'Add border to matrix with value and color',
    signature: 'addBorder(value, color)',
    parameters: ['value: `number|string` - Border value', 'color: `string` - Border color'],
    example: 'myMatrix.addBorder(0, "gray")'
  },

  // Text-specific Methods
  setFontSize: {
    text: {
      signature: 'setFontSize(size) or setFontSize(line, size)',
      description: 'Set font size for all text or specific line',
      parameters: ['size: `number` - Font size in pixels', 'line: `number` - (optional) Specific line index'],
      example: 'myText.setFontSize(16) or myText.setFontSize(0, 20)'
    },
    default: {
      signature: 'setFontSize(size)',
      description: 'Set font size for text element',
      parameters: ['size: `number` - Font size in pixels'],
      example: 'myText.setFontSize(16)'
    }
  },
  setFontWeight: {
    text: {
      signature: 'setFontWeight(weight) or setFontWeight(line, weight)',
      description: 'Set font weight for all text or specific line',
      parameters: ['weight: `string` - Font weight (normal, bold, etc.)', 'line: `number` - (optional) Specific line index'],
      example: 'myText.setFontWeight("bold") or myText.setFontWeight(0, "normal")'
    },
    default: {
      signature: 'setFontWeight(weight)',
      description: 'Set font weight for text element',
      parameters: ['weight: `string` - Font weight (normal, bold, etc.)'],
      example: 'myText.setFontWeight("bold")'
    }
  },
  setFontFamily: {
    text: {
      signature: 'setFontFamily(family) or setFontFamily(line, family)',
      description: 'Set font family for all text or specific line',
      parameters: ['family: `string` - Font family name', 'line: `number` - (optional) Specific line index'],
      example: 'myText.setFontFamily("Arial") or myText.setFontFamily(0, "Georgia")'
    },
    default: {
      signature: 'setFontFamily(family)',
      description: 'Set font family for text element',
      parameters: ['family: `string` - Font family name'],
      example: 'myText.setFontFamily("Arial")'
    }
  },
  setAlign: {
    text: {
      signature: 'setAlign(alignment) or setAlign(line, alignment)',
      description: 'Set text alignment for all text or specific line',
      parameters: ['alignment: `string` - Text alignment (left, center, right)', 'line: `number` - (optional) Specific line index'],
      example: 'myText.setAlign("center") or myText.setAlign(0, "left")'
    },
    default: {
      signature: 'setAlign(alignment)',
      description: 'Set text alignment',
      parameters: ['alignment: `string` - Text alignment (left, center, right)'],
      example: 'myText.setAlign("center")'
    }
  },
  setFontSizes: {
    description: 'Set font sizes for multiple text lines',
    signature: 'setFontSizes([sizes])',
    parameters: ['sizes: `array` - Array of font sizes for each line'],
    example: 'myText.setFontSizes([20, 16, 12])'
  },
  setFontWeights: {
    description: 'Set font weights for multiple text lines',
    signature: 'setFontWeights([weights])',
    parameters: ['weights: `array` - Array of font weights for each line'],
    example: 'myText.setFontWeights(["bold", "normal", "normal"])'
  },
  setFontFamilies: {
    description: 'Set font families for multiple text lines',
    signature: 'setFontFamilies([families])',
    parameters: ['families: `array` - Array of font families for each line'],
    example: 'myText.setFontFamilies(["Arial", "Georgia", "Times"])'
  },
  setAligns: {
    description: 'Set alignments for multiple text lines',
    signature: 'setAligns([alignments])',
    parameters: ['alignments: `array` - Array of alignments for each line'],
    example: 'myText.setAligns(["center", "left", "right"])'
  },
  setLineSpacing: {
    description: 'Set spacing between text lines',
    signature: 'setLineSpacing(spacing)',
    parameters: ['spacing: `number` - Spacing between lines in pixels'],
    example: 'myText.setLineSpacing(20)'
  },
  setWidth: {
    description: 'Set text box width',
    signature: 'setWidth(width)',
    parameters: ['width: `number` - Text box width in pixels'],
    example: 'myText.setWidth(300)'
  },
  setHeight: {
    description: 'Set text box height',
    signature: 'setHeight(height)',
    parameters: ['height: `number` - Text box height in pixels'],
    example: 'myText.setHeight(100)'
  }
};

// Simple method descriptions for autocomplete (fallback)
export const methodDescriptions = {
  setValue: 'Set value at specific index/position',
  setColor: 'Set color at specific index/position',
  setArrow: 'Set arrow/label at specific index/position',
  setValues: 'Set multiple values at once',
  setColors: 'Set multiple colors at once',
  setArrows: 'Set multiple arrows at once',
  addValue: 'Add value to end of structure',
  insertValue: 'Insert value at specific index',
  removeValue: 'Remove first occurrence of value',
  removeAt: 'Remove element at specific index',
  addNode: 'Add new node to structure',
  insertNode: 'Insert node at specific index',
  removeNode: 'Remove specific node',
  addEdge: 'Add edge between nodes',
  insertEdge: 'Insert edge at specific index',
  removeEdge: 'Remove specific edge',
  setEdges: 'Set all edges at once',
  setHidden: 'Set visibility of elements',
  addChild: 'Add child to parent node',
  setChild: 'Change parent-child relationship',
  removeSubtree: 'Remove node and its subtree',
  addRow: 'Add new row to matrix',
  addColumn: 'Add new column to matrix',
  removeRow: 'Remove row from matrix',
  removeColumn: 'Remove column from matrix',
  addBorder: 'Add border around matrix',
  setFontSize: 'Set font size',
  setFontWeight: 'Set font weight',
  setFontFamily: 'Set font family',
  setAlign: 'Set text alignment',
  setFontSizes: 'Set multiple font sizes',
  setFontWeights: 'Set multiple font weights',
  setFontFamilies: 'Set multiple font families',
  setAligns: 'Set multiple text alignments',
  setLineSpacing: 'Set spacing between lines',
  setWidth: 'Set text box width',
  setHeight: 'Set text box height'
};

// Theme configuration for syntax highlighting
export const themeConfig = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
    { token: 'custom-warning', foreground: 'FFA500', fontStyle: 'italic' },
    { token: 'custom-info', foreground: '0000ff' },
    { token: 'custom-debug', foreground: '008800' },
    { token: 'custom-number', foreground: '800080' },
    { token: 'comment', foreground: '6a9955' },
    { token: 'inlinecomment', foreground: '6a9955' },
    { token: 'variable', foreground: '50C1F9' }, 
    { token: 'number', foreground: 'b5cea8' },
    { token: 'keyword', foreground: '8477FD' },
    { token: 'symbol', foreground: 'ffffff' },
    { token: 'string', foreground: '3AE1FF', fontStyle: 'bold' },
    { token: 'component', foreground: '21FFD6' },
    { token: 'attribute', foreground: '21FFD6' },
    { token: 'positional', foreground: '21FFD6' },
    { token: 'dot-command', foreground: '21FFD6' }
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#FFFFFF',
    'editorCursor.foreground': '#A7A7A7',
    'editor.lineHighlightBackground': '#333333',
    'editorLineNumber.foreground': '#858585',
    'editor.selectionBackground': '#264F78',
    'editor.inactiveSelectionBackground': '#3A3D41'
  }
};

// Language configuration for Monaco editor
export const monacoLanguageConfig = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ]
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
      col: Math.max(1, col)
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
    if (typeof error === 'object' && error !== null) {
      errorObj = {
        line: error.line || 1,
        col: error.col || 1,
        message: error.message || 'Unknown error'
      };
    } else {
      // Handle legacy string error message with optional line/col parameters
      errorObj = {
        line: lineNumber || 1,
        col: columnNumber || 1,
        message: error.toString()
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
        endColumn = Math.max(validCol + 1, Math.min(lineContent.length + 1, validCol + 50));
      }
    } catch (e) {
      console.warn('Error getting line content:', e);
      endColumn = validCol + 10;
    }

    // Only show first 10 lines of the error message, if so add ...$
    const errorMessage = errorObj.message.split('\n').slice(0, 10).join('\n') + (errorObj.message.split('\n').length > 10 ? '\n...' : '');

    const marker = {
      startLineNumber: validLine,
      startColumn: validCol,
      endLineNumber: validLine,
      endColumn: endColumn,
      message: errorMessage,
      severity: this.monaco.MarkerSeverity.Error
    };

    this.currentMarkers = [marker];
    
    try {
      this.monaco.editor.setModelMarkers(model, 'merlin-errors', this.currentMarkers);
    } catch (e) {
      console.warn('Error setting markers:', e);
    }
  }

  clearErrors() {
    if (!this.monaco || !this.editor) return;
    
    const model = this.editor.getModel();
    if (model) {
      try {
        this.monaco.editor.setModelMarkers(model, 'merlin-errors', []);
      } catch (e) {
        console.warn('Error clearing markers:', e);
      }
    }
    this.currentMarkers = [];
  }
}

// Create a singleton instance
export const errorStateManager = new ErrorStateManager();
