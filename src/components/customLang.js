export function registerCustomLanguage(monaco) {
  // Prevent multiple registrations
  if (window.customLangRegistered) {
    console.log('Custom language already registered, skipping...');
    return;
  }
  window.customLangRegistered = true;
  
  // Register a new language
  monaco.languages.register({ id: "customLang" });
  const keywords = ['page', 'show', "hide", 'visslides', 'data', 'draw'];
  const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`);

  const symbols = [':', ':=', '=', '*', ',', '@', '&', '(', ')', '[', ']', '{', '}'];
  // Escape special characters for regular expression
  const escapedSymbols = symbols.map(symbol => symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Create a regular expression pattern without word boundaries
  const symbolPattern = new RegExp(`(${escapedSymbols.join('|')})`, 'g');

  const component = ['array', 'matrix', 'linkedlist', 'stack', 'tree', 'graph', 'text'];
  const componentPattern = new RegExp(`\\b(${component.join('|')})\\b`);

  const attribute = ['id', 'value', 'color', 'arrow', 'nodes', 'edges', 'hidden', 'above', 'below', 'left', 'right', 'fontSize', 'fontWeight', 'fontFamily', 'align', 'lineSpacing', 'width', 'height', 'children'];
  const attributePattern = new RegExp(`\\b(${attribute.join('|')})\\b`);

  // Type-specific methods mapping
  const typeMethodsMap = {
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

  // Method descriptions for better autocomplete
  const methodDescriptions = {
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

  // Function to parse current context and get variable types
  function parseContextForTypes(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });

    const variableTypes = {};
    const lines = textUntilPosition.split('\n');
    
    // Parse variable declarations with improved regex
    for (const line of lines) {
      // Support both = and := assignment operators
      const match = line.match(/^\s*(array|matrix|linkedlist|stack|tree|graph|text)\s+(\w+)\s*(:?=)\s*{/);
      if (match) {
        const [, type, varName] = match;
        variableTypes[varName] = type;
      }
    }

    console.log('Parsed text until position:', textUntilPosition);
    console.log('Lines processed:', lines);
    console.log('Variable types found:', variableTypes);
    return variableTypes;
  }

  // Function to get variable name from current line
  function getVariableNameAtPosition(model, position) {
    const line = model.getLineContent(position.lineNumber);
    const beforeCursor = line.substring(0, position.column - 1);
    
    // Look for pattern: variableName. (at the end of the line before cursor)
    const match = beforeCursor.match(/(\w+)\.$/);
    if (match) {
      return match[1];
    }
    
    // Also check if we're typing after a dot with partial method name
    const partialMatch = beforeCursor.match(/(\w+)\.(\w*)$/);
    if (partialMatch) {
      return partialMatch[1];
    }
    
    return null;
  }

  // Function to get all methods for a type
  function getMethodsForType(type) {
    if (!type || !typeMethodsMap[type]) return [];
    
    const methods = typeMethodsMap[type];
    const allMethods = [];

    console.log('Methods for type', type, ':', methods);
    
    // Collect all methods from all categories
    Object.values(methods).forEach(categoryMethods => {
      if (Array.isArray(categoryMethods)) {
        allMethods.push(...categoryMethods);
      }
    });
    
    // Remove duplicates using Set
    const uniqueMethods = [...new Set(allMethods)];
    console.log('Unique methods:', uniqueMethods);
    
    return uniqueMethods;
  }

  // Position keywords - support all current position keywords
  const positionKeywords = [
    // Corner positions
    'tl', 'tr', 'bl', 'br', 'top-left', 'top-right', 'bottom-left', 'bottom-right',
    // Edge positions  
    'top', 'bottom', 'left', 'right',
    // Center positions
    'center', 'centre'
  ];
  const positionPattern = new RegExp(`\\b(${positionKeywords.join('|')})\\b`);

  const setCommand = new RegExp(`\\b(set)\\w*\\b`);
  const addCommand = new RegExp(`\\b(add)\\w*\\b`);
  const removeCommand = new RegExp(`\\b(remove)\\w*\\b`);
  const insertCommand = new RegExp(`\\b(insert)\\w*\\b`);

  // EExample of edge: n1-n2
  const edgePattern = /([a-zA-Z_][a-zA-Z0-9_]*)-([a-zA-Z_][a-zA-Z0-9_]*)/;

  // Layout pattern: 2x3
  const layoutPattern = /\b\d+x\d+\b/;

  // Enhanced patterns for better syntax highlighting
  const methodPattern = /\b(setValue|setColor|setArrow|setValues|setColors|setArrows|addValue|insertValue|removeValue|removeAt|addNode|insertNode|removeNode|addEdge|insertEdge|removeEdge|setEdges|setHidden|addChild|setChild|removeSubtree|addRow|addColumn|removeRow|removeColumn|addBorder|setFontSize|setFontWeight|setFontFamily|setAlign|setFontSizes|setFontWeights|setFontFamilies|setAligns|setLineSpacing|setWidth|setHeight)\b/;
  const dotNotationPattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*\b/;

  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider("customLang", {
    tokenizer: {
      root: [
        [/\[error\].*/, 'custom-error'],
        [/\[warning\].*/, 'custom-warning'],
        [/\[info\].*/, 'custom-info'],
        [/\[debug\].*/, 'custom-debug'],
        [/\b(digit|number)\b/, 'custom-number'],
        [/\/\/.*$/, 'comment'],
        [/$[ \t]*.*/, 'inlinecomment'],
        [keywordPattern, 'keyword'],
        [setCommand, 'dot-command'],
        [addCommand, 'dot-command'],
        [insertCommand, 'dot-command'],
        [removeCommand, 'dot-command'],
        [componentPattern, 'component'],
        [attributePattern, 'attribute'],
        [positionPattern, 'positional'],
        [layoutPattern, 'positional'],
        [edgePattern, 'variable'],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, 'variable'],
        [/\b\d+(\.\d+)?\b/, 'number'],
        [/("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/, 'string'],
        [symbolPattern, 'symbol'],
      ]
    }
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme("customTheme", {
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
      { token: 'variable',  foreground: '50C1F9'}, 
      { token: 'number', foreground: 'b5cea8' }, // Light green for numbers
      { token: 'keyword', foreground: '8477FD' },  // Changed to a blue color
      { token: 'symbol', foreground: 'ffffff' },
      { token: 'string', foreground: '3AE1FF', fontStyle: 'bold' }, // Changed to a nice green color
      { token: 'component', foreground: '21FFD6' },
      { token: 'attribute', foreground: '21FFD6' },
      { token: 'positional', foreground: '21FFD6' }, // Orange color for position keywords
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
  });

  monaco.languages.setLanguageConfiguration("customLang", {
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
  });

  // Function to get method signature with placeholder parameters
  function getMethodSignature(method, varType) {
    const signatures = {
      setValue: varType === 'matrix' ? 'setValue(${1:row}, ${2:col}, ${3:value})' : 'setValue(${1:index}, ${2:value})',
      setColor: varType === 'matrix' ? 'setColor(${1:row}, ${2:col}, ${3:color})' : 'setColor(${1:index}, ${2:color})',
      setArrow: varType === 'matrix' ? 'setArrow(${1:row}, ${2:col}, ${3:arrow})' : 'setArrow(${1:index}, ${2:arrow})',
      setValues: 'setValues([${1:values}])',
      setColors: 'setColors([${1:colors}])',
      setArrows: 'setArrows([${1:arrows}])',
      addValue: 'addValue(${1:value})',
      insertValue: 'insertValue(${1:index}, ${2:value})',
      removeValue: 'removeValue(${1:value})',
      removeAt: 'removeAt(${1:index})',
      addNode: 'addNode(${1:name}, ${2:value})',
      insertNode: 'insertNode(${1:index}, ${2:name})',
      removeNode: 'removeNode(${1:name})',
      addEdge: 'addEdge(${1:nodeA}-${2:nodeB})',
      insertEdge: 'insertEdge(${1:index}, ${2:nodeA}-${3:nodeB})',
      removeEdge: 'removeEdge(${1:nodeA}-${2:nodeB})',
      setEdges: 'setEdges([${1:edges}])',
      setHidden: 'setHidden(${1:index}, ${2:hidden})',
      addChild: 'addChild(${1:parent}-${2:child}, ${3:value})',
      setChild: 'setChild(${1:parent}-${2:child})',
      removeSubtree: 'removeSubtree(${1:node})',
      addRow: 'addRow([${1:values}])',
      addColumn: 'addColumn(${1:position}, [${2:values}])',
      removeRow: 'removeRow(${1:index})',
      removeColumn: 'removeColumn(${1:index})',
      addBorder: 'addBorder(${1:value}, ${2:color})',
      setFontSize: 'setFontSize(${1:size})',
      setFontWeight: 'setFontWeight(${1:weight})',
      setFontFamily: 'setFontFamily(${1:family})',
      setAlign: 'setAlign(${1:alignment})',
      setFontSizes: 'setFontSizes([${1:sizes}])',
      setFontWeights: 'setFontWeights([${1:weights}])',
      setFontFamilies: 'setFontFamilies([${1:families}])',
      setAligns: 'setAligns([${1:alignments}])',
      setLineSpacing: 'setLineSpacing(${1:spacing})',
      setWidth: 'setWidth(${1:width})',
      setHeight: 'setHeight(${1:height})'
    };

    return signatures[method] || `${method}($1)`;
  }

  // Register completion provider for type-based method suggestions
  monaco.languages.registerCompletionItemProvider("customLang", {
    triggerCharacters: ['.'],
    provideCompletionItems: function(model, position) {
      console.log('Completion provider called!', position);
      
      try {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        // Get variable name if we're after a dot
        const varName = getVariableNameAtPosition(model, position);
        console.log('Variable name detected:', varName);
        
        if (!varName) {
          console.log('No variable name found, returning empty suggestions');
          // Return test suggestions to verify provider is working
          return { 
            suggestions: [
              {
                label: 'test',
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: 'test()',
                detail: 'Test method',
                documentation: 'Test method to verify completion provider',
                range: range
              }
            ]
          };
        }

        // Parse context to get variable types
        const variableTypes = parseContextForTypes(model, position);
        const varType = variableTypes[varName];
        console.log('Variable types found:', variableTypes);
        console.log('Type for', varName, ':', varType);

        if (!varType) {
          console.log('No type found for variable', varName);
          return { suggestions: [] };
        }

        // Get methods for this type
        const methods = getMethodsForType(varType);
        console.log('Methods for', varType, ':', methods);
        
        const suggestions = methods.map(method => ({
          label: method,
          kind: monaco.languages.CompletionItemKind.Method,
          insertText: getMethodSignature(method, varType),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: `${varType} method`,
          documentation: methodDescriptions[method] || `Method for ${varType}`,
          range: range,
          sortText: `0${method}` // Ensure our suggestions appear first
        }));

        console.log('Final suggestions:', suggestions);
        return { suggestions };
      } catch (error) {
        console.error('Error in completion provider:', error);
        return { suggestions: [] };
      }
    }
  });

  // Register hover provider for better documentation
  monaco.languages.registerHoverProvider("customLang", {
    provideHover: function(model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const variableTypes = parseContextForTypes(model, position);
      const varName = word.word;
      const varType = variableTypes[varName];

      if (varType) {
        const availableMethods = getMethodsForType(varType);
        const methodsList = availableMethods.map(method => `• \`${method}()\`: ${methodDescriptions[method] || 'Method for ' + varType}`).join('\n\n');
        
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: [
            { value: `**${varName}** (${varType})` },
            { value: `Available methods:\n\n${methodsList}` }
          ]
        };
      }

      return null;
    }
  });

}
