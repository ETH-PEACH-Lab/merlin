import { type } from 'os';
import { 
  languageConfig,
  typeDocumentation,
  typeMethodsMap,
  methodSignatures,
  methodDocumentation,
  methodDescriptions,
  themeConfig,
  monacoLanguageConfig,
  errorStateManager
} from './languageConfig.js';

export function registerCustomLanguage(monaco) {
  // Helper: check if the entire model already contains any 'page' or 'show' at line start
  function modelHasPageOrShow(model) {
    if (!model) return false;
    const text = model.getValue();
    // Check per line to ensure we only match commands starting a line (ignoring leading spaces)
    return text.split('\n').some(line => /^\s*(page|show)\b/.test(line));
  }

  // Helper: build insert text with optional page/show trailer based on typeDocumentation.insertTextName
  function buildInsertTextWithPageShow(baseInsertText, componentType, model) {
    try {
      if (!model || modelHasPageOrShow(model)) {
        return baseInsertText;
      }
      const nameHint = typeDocumentation?.[componentType]?.insertTextName || 'item';

      // Determine if baseInsertText ends with a closing brace at end of string (possibly with whitespace)
      const trimmed = baseInsertText.trimEnd();
      const endsWithBrace = /\}\s*$/.test(trimmed);

      // Ensure a single trailing newline after the definition, then add page and show lines
      const newline = '\n';
      const suffix = `${newline}${newline}page${newline}show ${nameHint}`;

      if (endsWithBrace) {
        // If base already places cursor markers like $0 after brace, preserve them by appending after
        return `${baseInsertText}${suffix}`;
      }
      return `${baseInsertText}${suffix}`;
    } catch (_) {
      return baseInsertText;
    }
  }
  // Prevent multiple registrations
  if (window.customLangRegistered) {
    return;
  }
  window.customLangRegistered = true;
  
  // Initialize error state manager
  window.errorStateManager = errorStateManager;
  errorStateManager.monaco = monaco;

  // Performance cache for expensive parsing operations
  const parseCache = {
    variableTypes: null,
    nodeData: null,
    gridLayout: null,
    lastLineNumber: -1,
    lastModelVersion: -1,
    
    // Clear cache when we move to a different line or model changes
    shouldRefresh: function(lineNumber, modelVersion) {
      return this.lastLineNumber !== lineNumber || this.lastModelVersion !== modelVersion;
    },
    
    // Update cache metadata
    updateCache: function(lineNumber, modelVersion, variableTypes, nodeData, gridLayout) {
      this.lastLineNumber = lineNumber;
      this.lastModelVersion = modelVersion;
      this.variableTypes = variableTypes;
      this.nodeData = nodeData;
      this.gridLayout = gridLayout;
    },
    
    // Get cached data or compute if needed
    getCachedData: function(model, position) {
      const currentModelVersion = model.getVersionId();
      
      if (this.shouldRefresh(position.lineNumber, currentModelVersion)) {
        const variableTypes = parseContextForTypes(model, position);
        const nodeData = parseNodesFromContext(model, position);
        const gridLayout = detectGridLayout(model, position);
        this.updateCache(position.lineNumber, currentModelVersion, variableTypes, nodeData, gridLayout);
      }
      
      return {
        variableTypes: this.variableTypes,
        nodeData: this.nodeData,
        gridLayout: this.gridLayout
      };
    }
  };

  // Cache frequently used static data to avoid recomputation
  const staticCache = {
    allMethods: null,
    methodSignatureCache: new Map(),
    
    getAllMethods: function() {
      if (!this.allMethods) {
        this.allMethods = [...new Set(Object.values(typeMethodsMap).flatMap(type => 
          Object.values(type).flatMap(methods => Array.isArray(methods) ? methods : [])
        ))];
      }
      return this.allMethods;
    },
    
    getMethodSignature: function(methodName, varType) {
      const cacheKey = `${methodName}:${varType}`;
      if (!this.methodSignatureCache.has(cacheKey)) {
        const signature = getMethodSignature(methodName, varType);
        this.methodSignatureCache.set(cacheKey, signature);
      }
      return this.methodSignatureCache.get(cacheKey);
    }
  };
  
  // Register a new language
  monaco.languages.register({ id: "customLang" });
  
  // Create regex patterns from config
  const keywordPattern = new RegExp(`\\b(${languageConfig.keywords.join('|')})\\b`);
  
  // Escape special characters for regular expression
  const escapedSymbols = languageConfig.symbols.map(symbol => symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const symbolPattern = new RegExp(`(${escapedSymbols.join('|')})`, 'g');

  const componentPattern = new RegExp(`\\b(${languageConfig.components.join('|')})\\b`);
  const attributePattern = new RegExp(`\\b(${languageConfig.attributes.join('|')})\\b`);
  const positionPattern = new RegExp(`\\b(${languageConfig.positionKeywords.join('|')})\\b`);

  const setCommand = new RegExp(`\\b(set)\\w*\\b`);
  const addCommand = new RegExp(`\\b(add)\\w*\\b`);
  const removeCommand = new RegExp(`\\b(remove)\\w*\\b`);
  const insertCommand = new RegExp(`\\b(insert)\\w*\\b`);

  // Enhanced patterns for better syntax highlighting
  const edgePattern = /([a-zA-Z_][a-zA-Z0-9_]*)-([a-zA-Z_][a-zA-Z0-9_]*)/;
  const layoutPattern = /\b\d+x\d+\b/;
  
  // Create method pattern from all available methods (cached)
  const allMethods = staticCache.getAllMethods();

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
    
    // Create regex from languageConfig components
    const componentsPattern = languageConfig.components.join('|');
    
    // Enhanced regex patterns for different declaration styles
    const declarationRegex = new RegExp(`^\\s*(${componentsPattern})\\s+(\\w+)\\s*(:?=)\\s*\\{`);
    const shortDeclarationRegex = new RegExp(`^\\s*(\\w+)\\s*=\\s*(${componentsPattern})\\s*\\{`);
    
    // Parse variable declarations with improved regex
    for (const line of lines) {
      // Standard declaration: stack myStack = {
      const match = line.match(declarationRegex);
      if (match) {
        const [, type, varName] = match;
        variableTypes[varName] = type;
        continue;
      }
      
      // Short declaration: myStack = stack {
      const shortMatch = line.match(shortDeclarationRegex);
      if (shortMatch) {
        const [, varName, type] = shortMatch;
        variableTypes[varName] = type;
        continue;
      }
    }

    return variableTypes;
  }

  // Function to parse nodes from variable declarations
  function parseNodesFromContext(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });

    const nodesByVariable = {};
    const allNodes = new Set();
    const lines = textUntilPosition.split('\n');
    
    let currentVariable = null;
    let insideDeclaration = false;
    
    for (const line of lines) {
      // Check if we're starting a variable declaration
      const declarationMatch = line.match(/^\s*(?:graph|tree|linkedlist)\s+(\w+)\s*=\s*\{/);
      if (declarationMatch) {
        currentVariable = declarationMatch[1];
        nodesByVariable[currentVariable] = new Set();
        insideDeclaration = true;
        continue;
      }
      
      // Check if we're ending a declaration
      if (insideDeclaration && line.includes('}')) {
        insideDeclaration = false;
        currentVariable = null;
        continue;
      }
      
      // Parse nodes if we're inside a declaration
      if (insideDeclaration && currentVariable) {
        // Look for nodes arrays: nodes: [A, B, C] or nodes: ["A", "B", "C"]
        const nodesMatch = line.match(/nodes:\s*\[(.*?)\]/);
        if (nodesMatch) {
          const nodesList = nodesMatch[1];
          // Extract node names (with or without quotes)
          const nodeMatches = nodesList.match(/(?:"([^"]+)"|([a-zA-Z_][a-zA-Z0-9_]*))/g);
          if (nodeMatches) {
            nodeMatches.forEach(node => {
              const cleanNode = node.replace(/['"]/g, '');
              nodesByVariable[currentVariable].add(cleanNode);
              allNodes.add(cleanNode);
            });
          }
        }
        
        // Look for edges to extract additional nodes: edges: [A-B, B-C]
        const edgesMatch = line.match(/edges:\s*\[(.*?)\]/);
        if (edgesMatch) {
          const edgesList = edgesMatch[1];
          const edgeMatches = edgesList.match(/(?:"([^"]+)"|([a-zA-Z_][a-zA-Z0-9_]*-[a-zA-Z_][a-zA-Z0-9_]*))/g);
          if (edgeMatches) {
            edgeMatches.forEach(edge => {
              const cleanEdge = edge.replace(/['"]/g, '');
              const [nodeA, nodeB] = cleanEdge.split('-');
              if (nodeA && nodeB) {
                nodesByVariable[currentVariable].add(nodeA);
                nodesByVariable[currentVariable].add(nodeB);
                allNodes.add(nodeA);
                allNodes.add(nodeB);
              }
            });
          }
        }
      }
      
      // Also parse nodes from method calls like variable.addNode("nodeName", value)
      const addNodeMatch = line.match(/(\w+)\.addNode\s*\(\s*"([^"]+)"/);
      if (addNodeMatch) {
        const [, varName, nodeName] = addNodeMatch;
        if (!nodesByVariable[varName]) {
          nodesByVariable[varName] = new Set();
        }
        nodesByVariable[varName].add(nodeName);
        allNodes.add(nodeName);
      }
      
      // Parse nodes from addEdge calls like variable.addEdge("nodeA-nodeB")
      const addEdgeMatch = line.match(/(\w+)\.addEdge\s*\(\s*"([^"]+)"/);
      if (addEdgeMatch) {
        const [, varName, edge] = addEdgeMatch;
        const [nodeA, nodeB] = edge.split('-');
        if (nodeA && nodeB) {
          if (!nodesByVariable[varName]) {
            nodesByVariable[varName] = new Set();
          }
          nodesByVariable[varName].add(nodeA);
          nodesByVariable[varName].add(nodeB);
          allNodes.add(nodeA);
          allNodes.add(nodeB);
        }
      }
    }
    
    // Convert Sets to Arrays
    Object.keys(nodesByVariable).forEach(varName => {
      nodesByVariable[varName] = Array.from(nodesByVariable[varName]);
    });
    
    return {
      nodesByVariable,
      allNodes: Array.from(allNodes)
    };
  }

  // Function to detect if we're hovering over a method name (different from method call context)
  function isHoveringOverMethod(model, position, word) {
    const line = model.getLineContent(position.lineNumber);
    const beforeWord = line.substring(0, word.startColumn - 1);
    const afterWord = line.substring(word.endColumn - 1);
    
    // Check if there's a dot before the word: variable.methodName
    const dotBeforeMatch = beforeWord.match(/(\w+)\.$/);
    if (dotBeforeMatch) {
      const variableName = dotBeforeMatch[1];
      // Check if there are parentheses after the method name (indicating it's a method)
      const methodCallPattern = /^\s*\(/;
      const isMethodCall = methodCallPattern.test(afterWord);
      
      return {
        variableName,
        methodName: word.word,
        isMethod: isMethodCall || staticCache.getAllMethods().includes(word.word)
      };
    }
    
    return null;
  }

  // Function to detect method call context and parameter position
  function getMethodCallContext(model, position) {
    const line = model.getLineContent(position.lineNumber);
    const beforeCursor = line.substring(0, position.column - 1);
    
    // Look for method call pattern: variable.method(param1, param2, ...
    // Make it more flexible to catch incomplete calls
    const methodCallMatch = beforeCursor.match(/(\w+)\.(\w+)\s*\(([^)]*)$/);
    if (!methodCallMatch) return null;
    
    const [, variableName, methodName, paramsText] = methodCallMatch;
    
    // Count parameters to determine current parameter position
    let parameterIndex = 0;
    let depth = 0;
    let inQuotes = false;
    let quoteChar = '';
    
    // If paramsText is empty, we're at the first parameter
    if (paramsText.trim() === '') {
      return {
        variableName,
        methodName,
        parameterIndex: 0,
        paramsText,
        isMethodCall: true
      };
    }
    
    for (let i = 0; i < paramsText.length; i++) {
      const char = paramsText[i];
      if (!inQuotes) {
        if (char === '"' || char === "'") {
          inQuotes = true;
          quoteChar = char;
        } else if (char === '(' || char === '[' || char === '{') {
          depth++;
        } else if (char === ')' || char === ']' || char === '}') {
          depth--;
        } else if (char === ',' && depth === 0) {
          parameterIndex++;
        }
      } else {
        if (char === quoteChar && (i === 0 || paramsText[i - 1] !== '\\')) {
          inQuotes = false;
        }
      }
    }
    
    return {
      variableName,
      methodName,
      parameterIndex,
      paramsText,
      isMethodCall: true
    };
  }

  // Function to get variable name from current line
  function getVariableNameAtPosition(model, position) {
    const line = model.getLineContent(position.lineNumber);
    const beforeCursor = line.substring(0, position.column - 1);
    
    // Check for chained placement notation: variableName.above., variableName.below., etc.
    const chainedMatch = beforeCursor.match(/(\w+)\.(above|below|left|right)\.$/);
    if (chainedMatch) {
      // Return special marker to indicate this is a chained text object access
      return `${chainedMatch[1]}._text_placement_${chainedMatch[2]}`;
    }
    
    // Check for partial chained notation: variableName.above.methodName
    const partialChainedMatch = beforeCursor.match(/(\w+)\.(above|below|left|right)\.(\w*)$/);
    if (partialChainedMatch) {
      // Return special marker to indicate this is a chained text object access
      return `${partialChainedMatch[1]}._text_placement_${partialChainedMatch[2]}`;
    }
    
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
    
    // Collect all methods from all categories
    Object.values(methods).forEach(categoryMethods => {
      if (Array.isArray(categoryMethods)) {
        allMethods.push(...categoryMethods);
      }
    });
    
    // Remove duplicates using Set
    const uniqueMethods = [...new Set(allMethods)];
    
    return uniqueMethods;
  }

  // Function to get template suggestions for common patterns
  function getTemplateSuggestions(componentType) {
    const templates = {
      stack: {
        label: 'Stack with values and colors',
        insertText: `stack \${1:callStack} = {\n\tvalue: [\${2:"main", "process", "calculate"}]\n\tcolor: [\${3:null, "blue", null}]\n\tarrow: [\${4:null, null, "top"}]\n}`,
        documentation: 'Complete stack declaration with value, color, and arrow arrays'
      },
      array: {
        label: 'Array with values and colors',
        insertText: `array \${1:myArray} = {\n\tvalue: [\${2:1, 2, 3, 4, 5}]\n\tcolor: [\${3:"red", null, "blue", null, "green"}]\n\tarrow: [\${4:null, "start", null, "end", null}]\n}`,
        documentation: 'Complete array declaration with value, color, and arrow arrays'
      },
      matrix: {
        label: 'Matrix with 2D values',
        insertText: `matrix \${1:myMatrix} = {\n\tvalue: [\n\t\t[\${2:1, 2, 3}],\n\t\t[\${3:4, 5, 6}],\n\t\t[\${4:7, 8, 9}]\n\t]\n}`,
        documentation: 'Complete matrix declaration with 2D value array'
      },
      graph: {
        label: 'Graph with nodes and edges',
        insertText: `graph \${1:myGraph} = {\n\tnodes: [\${2: n1, n2, n3}]\n\tedges: [\${3:n1-n2, n2-n3}]\n\tvalue: [\${4:10, 20, 30}]\n}`,
        documentation: 'Complete graph declaration with nodes, edges, and values'
      },
      linkedlist: {
        label: 'Linked list with nodes',
        insertText: `linkedlist \${1:myList} = {\n\tnodes: [\${2:head, node1, node2, tail}]\n\tvalue: [\${3:1, 2, 3, 4}]\n\tcolor: [\${4:"green", null, null, "red"}]\n}`,
        documentation: 'Complete linked list declaration with nodes and values'
      },
      tree: {
        label: 'Tree with hierarchical structure',
        insertText: `tree \${1:myTree} = {\n\tnodes: [\${2:root, left, right}]\n\tchildren: [\${3:root-left, root-right}]\n\tvalue: [\${4:1, 2, 3}]\n}`,
        documentation: 'Complete tree declaration with nodes and parent-child relationships'
      },
      text: {
        label: 'Text with formatting',
        insertText: `text \${1:myText} = {\n\tvalue: [\${2:"Title", "Subtitle", "Content"}]\n\tfontSize: [\${3:24, 18, 14}]\n\tcolor: [\${4:"black", "gray", "black"}]\n\talign: [\${5:"center", "center", "left"}]\n}`,
        documentation: 'Complete text declaration with multiple lines and formatting'
      }
    };
    
    return templates[componentType] || null;
  }

  // Function to detect grid layout from context
  function detectGridLayout(model, position) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });

    // Look for page commands
    const pageMatch = textUntilPosition.match(/\bpage\s+(\d+)x(\d+)/);
    if (pageMatch) {
      const [, cols, rows] = pageMatch;
      return { cols: parseInt(cols), rows: parseInt(rows) };
    }
    
    return null;
  }

  // Function to get smart position suggestions based on grid layout
  function getSmartPositionSuggestions(gridLayout) {
    if (!gridLayout) {
      return [];
    }
    
    const suggestions = [];
    const { cols, rows } = gridLayout;
    
    // Generate coordinate suggestions based on actual grid size
    for (let row = 0; row < Math.min(rows, 4); row++) {
      for (let col = 0; col < Math.min(cols, 4); col++) {
        suggestions.push({
          coord: `(${col}, ${row})`,
          desc: `Column ${col}, Row ${row}`
        });
      }
    }
    
    // Add some range suggestions if grid is large enough
    if (cols > 1) {
      suggestions.push({
        coord: `(0..${Math.min(cols-1, 2)}, 0)`,
        desc: `Span first ${Math.min(cols, 3)} columns`
      });
    }
    
    if (rows > 1) {
      suggestions.push({
        coord: `(0, 0..${Math.min(rows-1, 2)})`,
        desc: `Span first ${Math.min(rows, 3)} rows`
      });
    }
    
    return suggestions;
  }

  // Function to get method signature for autocomplete with smart array handling
  function getMethodSignature(methodName, varType) {
    const signatureFunction = methodSignatures[methodName];
    if (typeof signatureFunction === 'function') {
      return signatureFunction(varType);
    }
    
    // Enhanced signatures for array methods with smart suggestions
    if (methodName === 'setValue') {
      return 'setValue(${1:index}, ${2:value})';
    } else if (methodName === 'setValues') {
      return 'setValues([${1:value1}, ${2:value2}, ${3:...}])';
    } else if (methodName === 'setColor') {
      // For graph and tree, first parameter is node name (no quotes), second is color (with quotes)
      if (varType === 'graph' || varType === 'tree') {
        return 'setColor(${1:node}, "${2:color}")';
      }
      return 'setColor(${1:index}, "${2:color}")';
    } else if (methodName === 'setColors') {
      return 'setColors(["${1:color1}", "${2:color2}", "${3:...}"])';
    }
    
    return signatureFunction || `${methodName}()`;
  }

  // Function to detect array vs single value usage and suggest fixes
  function getArrayMethodSuggestions(methodName, paramText) {
    const suggestions = [];
    
    // Check if setValue is used with array
    if (methodName === 'setValue' && paramText.includes('[')) {
      suggestions.push({
        title: `Change "setValue" to "setValues" for array input`,
        replacement: 'setValues'
      });
    }
    
    // Check if setValues is used with single value
    if (methodName === 'setValues' && !paramText.includes('[')) {
      suggestions.push({
        title: `Change "setValues" to "setValue" for single value`,
        replacement: 'setValue'
      });
    }
    
    // Same for color methods
    if (methodName === 'setColor' && paramText.includes('[')) {
      suggestions.push({
        title: `Change "setColor" to "setColors" for array input`,
        replacement: 'setColors'
      });
    }
    
    if (methodName === 'setColors' && !paramText.includes('[')) {
      suggestions.push({
        title: `Change "setColors" to "setColor" for single value`,
        replacement: 'setColor'
      });
    }
    
    return suggestions;
  }

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

  // Define a new theme using config
  monaco.editor.defineTheme("customTheme", themeConfig);

  monaco.languages.setLanguageConfiguration("customLang", monacoLanguageConfig); 
 
  // Helper function to analyze context once
  function analyzeContext(model, position) {
    const word = model.getWordUntilPosition(position);
    const line = model.getLineContent(position.lineNumber);
    const beforeCursor = line.substring(0, position.column - 1);
    const allLines = model.getValue().split('\n');
    const beforeLines = allLines.slice(0, position.lineNumber - 1).reverse();
    const afterLines = allLines.slice(position.lineNumber - 1);
    const currentLine = allLines[position.lineNumber - 1];

    // Get cached parsed data
    const { variableTypes, nodeData, gridLayout } = parseCache.getCachedData(model, position);
    const variableNames = Object.keys(variableTypes);

    // Analyze different contexts
    const context = {
      word,
      line,
      beforeCursor,
      currentLine,
      variableTypes,
      nodeData,
      gridLayout,
      variableNames,
      
      // Context flags
      isMethodCall: false,
      isAfterDot: false,
      isInComponentDefinition: false,
      isAtLineStart: false,
      isAfterShowHide: false,
      isAfterPage: false,
      isInsideParens: false,
      isInAttributeValue: false,
      
      // Extracted data
      methodCallContext: null,
      variableNameAtPosition: null,
      componentDefinitionType: null,
      showHideMatch: null,
      attributeValueMatch: null,
      insideParensMatch: null
    };

    // Check method call context
    context.methodCallContext = getMethodCallContext(model, position);
    context.isMethodCall = context.methodCallContext && context.methodCallContext.isMethodCall;

    // Check if after dot
    context.variableNameAtPosition = getVariableNameAtPosition(model, position);
    context.isAfterDot = !!context.variableNameAtPosition;

    // Check if inside component definition
    let defType = null;
    for (const l of beforeLines) {
      const m = l.match(/^\s*([a-zA-Z]+)\s+\w+\s*=\s*\{/);
      const afterMatch = afterLines.find(line => line.match(/^\s*}/));
      if (m && languageConfig.components.includes(m[1]) && afterMatch && !currentLine.includes(':')) {
        defType = m[1];
        break;
      }
    }
    context.isInComponentDefinition = !!defType;
    context.componentDefinitionType = defType;

    // Check other contexts
    context.isAtLineStart = beforeCursor.trim() === '' || beforeCursor.match(/^\s*$/);
    context.showHideMatch = beforeCursor.match(/\b(show|hide)\s+(\w+)?\s*$/);
    context.isAfterShowHide = !!context.showHideMatch;
    context.isAfterPage = beforeCursor.match(/\bpage\s+$/);
    context.attributeValueMatch = beforeCursor.match(/(\w+):\s*(?:\[([^\]]*))?\s*$/);
    context.isInAttributeValue = !!context.attributeValueMatch;
    context.insideParensMatch = beforeCursor.match(/\(\s*([^)]*?)$/);
    context.isInsideParens = !!context.insideParensMatch;

    return context;
  }

  // Register completion provider for comprehensive autocomplete
  monaco.languages.registerCompletionItemProvider("customLang", {
    triggerCharacters: ['.', ' ', ],
    provideCompletionItems: function(model, position) {
      try {
        const context = analyzeContext(model, position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: context.word.startColumn,
          endColumn: context.word.endColumn
        };

        // Skip general completion if we're inside a method call
        if (context.isMethodCall) {
          return { suggestions: [] }; // Let method argument provider handle it
        }

        const suggestions = [];

        // Method completion after dot
        if (context.isAfterDot) {
          // Check if this is a chained text object access
          if (context.variableNameAtPosition && context.variableNameAtPosition.includes('_text_placement_')) {
            // Extract the original variable name and placement direction
            const parts = context.variableNameAtPosition.split('._text_placement_');
            const originalVarName = parts[0];
            const placementDirection = parts[1];
            
            // Get text object methods since we're accessing a linked text object
            const textMethods = getMethodsForType('text');
            textMethods.forEach(method => {
              suggestions.push({
                label: method,
                kind: monaco.languages.CompletionItemKind.Method,
                insertText: getMethodSignature(method, 'text'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: `text method (${placementDirection} text)`,
                documentation: (methodDescriptions[method] || `Method for text object`) + ` - Applied to ${placementDirection} text of ${originalVarName}`,
                range: range,
                sortText: `0${method}`,
                command: {
                  id: 'editor.action.triggerParameterHints',
                  title: 'Trigger signature help'
                }
              });
            });
            return { suggestions };
          } else {
            // Regular variable method completion
            const varType = context.variableTypes[context.variableNameAtPosition];
            if (varType) {
              const methods = getMethodsForType(varType);
              methods.forEach(method => {
                suggestions.push({
                  label: method,
                  kind: monaco.languages.CompletionItemKind.Method,
                  insertText: getMethodSignature(method, varType),
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  detail: `${varType} method`,
                  documentation: methodDescriptions[method] || `Method for ${varType}`,
                  range: range,
                  sortText: `0${method}`,
                  command: {
                    id: 'editor.action.triggerParameterHints',
                    title: 'Trigger signature help'
                  }
                });
              });
              
              // Also add placement properties for accessing linked text objects
              if (varType !== 'text') { // Don't add placement properties to text objects themselves
                const placements = ['above', 'below', 'left', 'right'];
                placements.forEach(placement => {
                  suggestions.push({
                    label: placement,
                    kind: monaco.languages.CompletionItemKind.Property,
                    insertText: placement,
                    detail: `${placement} text object`,
                    documentation: `Access the text object positioned ${placement} relative to ${context.variableNameAtPosition}`,
                    range: range,
                    sortText: `1${placement}` // Sort after methods with '1' prefix
                  });
                });
              }
              
              return { suggestions };
            }
          }
        }

        // Component definition properties
        if (context.isInComponentDefinition) {
          const props = typeDocumentation[context.componentDefinitionType]?.supportedProperties || [];
          props.forEach(prop => {
            suggestions.push({
              label: prop,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: `${prop}: $0`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: `${context.componentDefinitionType} property`,
              documentation: typeDocumentation[context.componentDefinitionType]?.description || '',
              range: range,
              sortText: `0prop_${prop}`
            });
          });
          return { suggestions };
        }

        // At the beginning of a line - suggest components and keywords
        if (context.isAtLineStart) {
          languageConfig.keywords.forEach(keyword => {
            let insertText = keyword;
            let detail = 'Keyword';
            
            if (keyword === 'show') {
              insertText = `show \${1:variableName}`;
              detail = 'Display variable';
            } else if (keyword === 'hide') {
              insertText = `hide \${1:variableName}`;
              detail = 'Hide variable';
            } else if (keyword === 'page') {
              insertText = 'page';
              detail = 'Page break';
            }
            
            suggestions.push({
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: detail,
              documentation: `${keyword} command`,
              range: range,
              sortText: `2${keyword}`
            });
          });
        }
        
        // After 'show' or 'hide' keywords - suggest variable names
        if (context.isAfterShowHide && context.showHideMatch[2] === undefined) {
          context.variableNames.forEach(varName => {
            const varType = context.variableTypes[varName];
            suggestions.push({
              label: varName,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: varName,
              detail: `${varType} variable`,
              documentation: `Show/hide ${varName} (${varType})`,
              range: range,
              sortText: `0${varName}`
            });
          });
        }

        // After 'show variableName' - suggest positioning
        if (context.isAfterShowHide && context.showHideMatch[2] !== undefined) {
          const [, command, varName] = context.showHideMatch;
          
          // Add named positions
          languageConfig.positionKeywords.forEach(pos => {
            suggestions.push({
              label: pos,
              kind: monaco.languages.CompletionItemKind.Enum,
              insertText: pos,
              detail: 'Named position',
              documentation: `Position element at ${pos}`,
              range: range,
              sortText: `0${pos}`
            });
          });
          
          // Add smart coordinate suggestions based on grid layout
          if (context.gridLayout) {
            const smartSuggestions = getSmartPositionSuggestions(context.gridLayout);
            smartSuggestions.forEach(({ coord, desc }, index) => {
              suggestions.push({
                label: coord,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: coord,
                detail: 'Smart coordinate',
                documentation: `${desc} (based on ${context.gridLayout.cols}x${context.gridLayout.rows} grid)`,
                range: range,
                sortText: `0smart${index}`
              });
            });
          } else {
            // Fallback to generic coordinate examples
            const coordinateExamples = [
              '(0, 0)', '(1, 0)', '(0, 1)', '(1, 1)',
              '(0, 2)', '(2, 0)', '(2, 1)', '(1, 2)'
            ];
            
            coordinateExamples.forEach((coord, index) => {
              suggestions.push({
                label: coord,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: coord,
                detail: 'Coordinate position',
                documentation: `Position element at coordinates ${coord} (column, row)`,
                range: range,
                sortText: `1coord${index}`
              });
            });
          }
          
          // Add range position suggestions
          const rangeExamples = [
            '(0..1, 0)', '(0, 0..1)', '(0..2, 0)', '(0, 0..2)',
            '(1..2, 0)', '(0..1, 1)', '(1..3, 0..1)'
          ];
          
          rangeExamples.forEach((range_pos, index) => {
            suggestions.push({
              label: range_pos,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: range_pos,
              detail: 'Range position',
              documentation: `Position element spanning ${range_pos} (columns..columns, rows..rows)`,
              range: range,
              sortText: `2range${index}`
            });
          });
        }

        // After 'page' keyword - suggest grid layouts
        if (context.isAfterPage) {
          const gridExamples = [
            { grid: '2x1', desc: '2 columns, 1 row' },
            { grid: '1x2', desc: '1 column, 2 rows' },
            { grid: '2x2', desc: '2 columns, 2 rows' },
            { grid: '3x1', desc: '3 columns, 1 row' },
            { grid: '1x3', desc: '1 column, 3 rows' },
            { grid: '3x2', desc: '3 columns, 2 rows' },
            { grid: '2x3', desc: '2 columns, 3 rows' },
            { grid: '4x2', desc: '4 columns, 2 rows' },
            { grid: '3x3', desc: '3 columns, 3 rows' },
            { grid: '4x3', desc: '4 columns, 3 rows' }
          ];
          
          gridExamples.forEach(({ grid, desc }, index) => {
            suggestions.push({
              label: grid,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: grid,
              detail: 'Grid layout',
              documentation: `Create grid layout: ${desc}`,
              range: range,
              sortText: `0grid${index}`
            });
          });
          
          // Add auto layout option
          suggestions.push({
            label: '(auto layout)',
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: '',
            detail: 'Auto layout',
            documentation: 'Let Merlin automatically determine the optimal layout',
            range: range,
            sortText: '1auto'
          });
        }

        // Variable name suggestions in appropriate contexts
        if (!context.isAfterDot && !context.isAfterShowHide && !context.isAtLineStart && context.beforeCursor.length > 0) {
          const isInVariableContext = (
            context.beforeCursor.match(/^\s*\w*$/) || // Just typing a word at start of line
            context.beforeCursor.match(/\s+\w*$/) || // Typing a word after whitespace
            context.beforeCursor.match(/\(\w*$/) || // Inside function parentheses
            context.beforeCursor.match(/,\s*\w*$/) || // After comma in parameter list
            context.word.word.length > 0 // Currently typing a word
          );
          
          if (isInVariableContext) {
            context.variableNames.forEach(varName => {
              const varType = context.variableTypes[varName];
              
              // Calculate relevance score for better sorting
              let sortScore = 3;
              if (context.word.word && varName.toLowerCase().startsWith(context.word.word.toLowerCase())) {
                sortScore = 0; // Highest priority for prefix matches
              } else if (context.word.word && varName.toLowerCase().includes(context.word.word.toLowerCase())) {
                sortScore = 1; // High priority for substring matches
              }
              
              suggestions.push({
                label: varName,
                kind: monaco.languages.CompletionItemKind.Variable,
                insertText: varName,
                detail: `${varType} variable`,
                documentation: `Reference to ${varName} (${varType})\n\nAvailable methods: ${getMethodsForType(varType).slice(0, 5).join(', ')}${getMethodsForType(varType).length > 5 ? '...' : ''}`,
                range: range,
                sortText: `${sortScore}${varName}`,
                filterText: varName // Helps with fuzzy matching
              });
            });
          }
        }

        // Attribute suggestions when inside component declaration
        if (context.beforeCursor.includes('{') && !context.beforeCursor.includes('}')) {
          const openBraceIndex = context.beforeCursor.lastIndexOf('{');
          const textAfterBrace = context.beforeCursor.substring(openBraceIndex + 1);
          
          // Check if we're in a component declaration
          const componentMatch = context.beforeCursor.match(/(\w+)\s+\w+\s*=\s*\{[^}]*$/);
          if (componentMatch) {
            const componentType = componentMatch[1];
            if (languageConfig.components.includes(componentType)) {
              languageConfig.attributes.forEach(attr => {
                let insertText = `${attr}: `;
                let documentation = `${attr} attribute for ${componentType}`;
                
                // Provide smart defaults based on attribute type
                if (attr === 'value') {
                  insertText = `${attr}: [\${1:}]`;
                  documentation = 'Array of values for the data structure elements';
                } else if (attr === 'color') {
                  insertText = `${attr}: [\${1:}]`;
                  documentation = 'Array of colors for the data structure elements';
                } else if (attr === 'arrow') {
                  insertText = `${attr}: [\${1:}]`;
                  documentation = 'Array of arrows/labels for the data structure elements';
                } else if (attr === 'nodes') {
                  insertText = `${attr}: [\${1:}]`;
                  documentation = 'Array of node identifiers';
                } else if (attr === 'edges') {
                  insertText = `${attr}: [\${1:}]`;
                  documentation = 'Array of edges in format ["nodeA-nodeB", ...]';
                } else if (attr === 'id') {
                  insertText = `${attr}: "\${1:}"`;
                  documentation = 'Unique identifier for the data structure';
                } else if (attr.includes('Size') || attr.includes('Weight') || attr.includes('Spacing')) {
                  insertText = `${attr}: \${1:16}`;
                  documentation = `Numeric value for ${attr}`;
                } else if (attr.includes('Family') || attr.includes('align')) {
                  insertText = `${attr}: "\${1:}"`;
                  documentation = `String value for ${attr}`;
                }
                
                suggestions.push({
                  label: attr,
                  kind: monaco.languages.CompletionItemKind.Property,
                  insertText: insertText,
                  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                  detail: 'Attribute',
                  documentation: documentation,
                  range: range,
                  sortText: `4${attr}`
                });
              });
            }
          }
        }

        // Attribute value suggestions
        if (context.isInAttributeValue) {
          const [, attributeName, arrayContent] = context.attributeValueMatch;
          
          if (attributeName === 'color') {
            // Add null first
            suggestions.push({
              label: 'null',
              kind: monaco.languages.CompletionItemKind.Constant,
              insertText: 'null',
              detail: 'Default color',
              documentation: 'Use default color for this element',
              range: range,
              sortText: '0null'
            });
            
            // Add color suggestions
            languageConfig.namedColors.forEach((color, index) => {
              suggestions.push({
                label: color,
                kind: monaco.languages.CompletionItemKind.Color,
                insertText: `"${color}"`,
                detail: 'Named color',
                documentation: `Use ${color} color`,
                range: range,
                sortText: `1color${index.toString().padStart(3, '0')}`
              });
            });
          } else if (attributeName === 'nodes') {
            // Suggest common node names
            const commonNodes = ['root', 'node1', 'node2', 'node3', 'A', 'B', 'C', 'client', 'server', 'router'];
            commonNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: `"${nodeName}"`,
                detail: 'Node identifier',
                documentation: `Node named ${nodeName}`,
                range: range,
                sortText: `1node${index}`
              });
            });
          } else if (attributeName === 'edges') {
            // If we have nodes in context, suggest edge combinations
            if (context.nodeData.allNodes.length > 0) {
              const edgeSuggestions = [];
              for (let i = 0; i < Math.min(context.nodeData.allNodes.length, 5); i++) {
                for (let j = i + 1; j < Math.min(context.nodeData.allNodes.length, 5); j++) {
                  edgeSuggestions.push(`${context.nodeData.allNodes[i]}-${context.nodeData.allNodes[j]}`);
                }
              }
              edgeSuggestions.forEach((edge, index) => {
                suggestions.push({
                  label: edge,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: `"${edge}"`,
                  detail: 'Edge connection',
                  documentation: `Connect ${edge.replace('-', ' to ')}`,
                  range: range,
                  sortText: `1edge${index}`
                });
              });
            }
          } else if (attributeName === 'align') {
            languageConfig.alignValues.forEach((align, index) => {
              suggestions.push({
                label: align,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `"${align}"`,
                detail: 'Text alignment',
                documentation: `Align text to ${align}`,
                range: range,
                sortText: `1align${index}`
              });
            });
          } else if (attributeName === 'fontWeight') {
            languageConfig.fontWeights.forEach((weight, index) => {
              suggestions.push({
                label: weight,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `"${weight}"`,
                detail: 'Font weight',
                documentation: `Font weight: ${weight}`,
                range: range,
                sortText: `1weight${index}`
              });
            });
          } else if (attributeName === 'fontFamily') {
            languageConfig.fontFamilies.forEach((family, index) => {
              suggestions.push({
                label: family,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `"${family}"`,
                detail: 'Font family',
                documentation: `Font family: ${family}`,
                range: range,
                sortText: `1family${index}`
              });
            });
          }
        }

        // Position keywords when appropriate
        if (context.beforeCursor.match(/:\s*$/) || context.beforeCursor.match(/=\s*$/)) {
          languageConfig.positionKeywords.forEach(pos => {
            suggestions.push({
              label: pos,
              kind: monaco.languages.CompletionItemKind.Enum,
              insertText: `"${pos}"`,
              detail: 'Position',
              documentation: `Position keyword: ${pos}`,
              range: range,
              sortText: `5${pos}`
            });
          });
        }

        // Inside parentheses for positioning - suggest coordinate patterns
        if (context.isInsideParens) {
          const [, content] = context.insideParensMatch;
          
          // If no content yet, suggest common coordinates
          if (content.trim() === '') {
            if (context.gridLayout) {
              const smartSuggestions = getSmartPositionSuggestions(context.gridLayout);
              smartSuggestions.slice(0, 6).forEach(({ coord, desc }, index) => {
                // Remove parentheses since we're already inside them
                const coordContent = coord.replace(/[()]/g, '');
                suggestions.push({
                  label: coordContent,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: coordContent,
                  detail: 'Smart coordinate',
                  documentation: `${desc} (based on ${context.gridLayout.cols}x${context.gridLayout.rows} grid)`,
                  range: range,
                  sortText: `0smart${index}`
                });
              });
            } else {
              const coordSuggestions = [
                { coord: '0, 0', desc: 'Top-left position' },
                { coord: '1, 0', desc: 'Second column, first row' },
                { coord: '0, 1', desc: 'First column, second row' },
                { coord: '1, 1', desc: 'Second column, second row' },
                { coord: '0..1, 0', desc: 'Span first two columns, first row' },
                { coord: '0, 0..1', desc: 'First column, span first two rows' }
              ];
              
              coordSuggestions.forEach(({ coord, desc }, index) => {
                suggestions.push({
                  label: coord,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: coord,
                  detail: 'Coordinate',
                  documentation: desc,
                  range: range,
                  sortText: `0coord${index}`
                });
              });
            }
          }
          
          // If there's a comma, suggest row values
          if (content.includes(',') && !content.includes('..')) {
            const afterComma = content.split(',').pop().trim();
            if (afterComma === '') {
              let rowSuggestions = ['0', '1', '2', '3', '0..1', '0..2', '1..2'];
              
              // If we know the grid size, limit suggestions to valid rows
              if (context.gridLayout) {
                rowSuggestions = [];
                for (let row = 0; row < context.gridLayout.rows; row++) {
                  rowSuggestions.push(row.toString());
                }
                // Add some range suggestions
                if (context.gridLayout.rows > 1) {
                  rowSuggestions.push('0..1');
                  if (context.gridLayout.rows > 2) {
                    rowSuggestions.push(`0..${context.gridLayout.rows - 1}`);
                  }
                }
              }
              
              rowSuggestions.forEach((row, index) => {
                suggestions.push({
                  label: row,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: row,
                  detail: 'Row',
                  documentation: context.gridLayout ? 
                    `Row ${row} (grid has ${context.gridLayout.rows} rows)` : 
                    `Row ${row}`,
                  range: range,
                  sortText: `0row${index}`
                });
              });
            }
          }
        }

        return { suggestions };
      } catch (error) {
        console.error('Error in completion provider:', error);
        return { suggestions: [] };
      }
    }
  });

  // Register a secondary completion provider for general word suggestions (no trigger characters)
  monaco.languages.registerCompletionItemProvider("customLang", {
    provideCompletionItems: function(model, position) {
      try {
        const context = analyzeContext(model, position);
        if (!context.word || context.word.word.length < 2) return { suggestions: [] }; // Only show for 2+ characters
        
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: context.word.startColumn,
          endColumn: context.word.endColumn
        };

        const suggestions = [];

        // Filter variables by what's being typed
        const currentWord = context.word.word.toLowerCase();
        const matchingVariables = context.variableNames.filter(varName => 
          varName.toLowerCase().includes(currentWord)
        );

        // Add matching variables with high priority
        matchingVariables.forEach(varName => {
          const varType = context.variableTypes[varName];
          let sortScore = varName.toLowerCase().startsWith(currentWord) ? '0' : '1';
          
          suggestions.push({
            label: varName,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: varName,
            detail: `${varType} variable`,
            documentation: `${varName} is a ${varType} data structure`,
            range: range,
            sortText: `${sortScore}${varName}`,
            filterText: varName
          });
        });

        // Add matching keywords
        const matchingKeywords = languageConfig.keywords.filter(keyword =>
          keyword.toLowerCase().includes(currentWord)
        );
        
        matchingKeywords.forEach(keyword => {
          let sortScore = keyword.toLowerCase().startsWith(currentWord) ? '0' : '2';
          suggestions.push({
            label: keyword,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: keyword,
            detail: 'Keyword',
            documentation: `${keyword} command`,
            range: range,
            sortText: `${sortScore}${keyword}`
          });
        });

        // Add matching component types with basic templates
        const matchingComponents = languageConfig.components.filter(component =>
          component.toLowerCase().includes(currentWord)
        );
        
        matchingComponents.forEach(component => {
          let sortScore = component.toLowerCase().startsWith(currentWord) ? '0' : '2';

          // Add simple component declaration with suggestion
          const componentDocumentation = typeDocumentation[component];
          suggestions.push({
            label: component,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: buildInsertTextWithPageShow(
              componentDocumentation.insertText || `${component} \${1:variableName} = {\n\t\${2:}\n}`,
              component,
              model
            ),
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Data structure type',
            documentation: componentDocumentation.description || `${component} data structure`,
            range: range,
            sortText: `${sortScore}${component}`,
            filterText: component
          });
        });

        return { suggestions };
      } catch (error) {
        console.error('Error in secondary completion provider:', error);
        return { suggestions: [] };
      }
    }
  });

  // Register a completion provider specifically for method arguments
  monaco.languages.registerCompletionItemProvider("customLang", {
    triggerCharacters: ['(', ',', ' ', '"', '.', '-', ''],
    provideCompletionItems: function(model, position) {
      try {
        const context = analyzeContext(model, position);
        
        if (!context.methodCallContext) {
          return { suggestions: [] };
        }
        
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: context.word.startColumn,
          endColumn: context.word.endColumn
        };

        const { variableName, methodName, parameterIndex } = context.methodCallContext;
        
        // Safety checks to prevent undefined errors
        if (!variableName || !methodName || parameterIndex === undefined) {
          return { suggestions: [] };
        }
        
        const varType = context.variableTypes[variableName];
        const suggestions = [];

        // Add null suggestion for most parameters
        suggestions.push({
          label: 'null',
          kind: monaco.languages.CompletionItemKind.Constant,
          insertText: 'null',
          detail: 'Null value',
          documentation: 'Use default value or skip this element',
          range: range,
          sortText: '0null'
        });

        // Method-specific parameter suggestions
        if (methodName === 'setColor' || methodName === 'setColors') {
          // Detect if user already typed a quote
          let alreadyQuoted = false;
          if (context.word && context.word.word && (context.word.word.startsWith('"') || context.word.word.startsWith("'"))) {
            alreadyQuoted = true;
          } else if (context.beforeCursor.endsWith('"') || context.beforeCursor.endsWith("'")) {
            alreadyQuoted = true;
          }

          // Add color suggestions
          languageConfig.namedColors.forEach((color, index) => {
            suggestions.push({
              label: color,
              kind: monaco.languages.CompletionItemKind.Color,
              insertText: alreadyQuoted ? `${color}` : `"${color}"`,
              detail: 'Named color',
              documentation: `Use ${color} color`,
              range: range,
              sortText: `1color${index.toString().padStart(3, '0')}`
            });
          });
          // Add common hex colors
          const commonHexColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#000000', '#ffffff'];
          commonHexColors.forEach((hex, index) => {
            suggestions.push({
              label: hex,
              kind: monaco.languages.CompletionItemKind.Color,
              insertText: alreadyQuoted ? `${hex}` : `"${hex}"`,
              detail: 'Hex color',
              documentation: `Use ${hex} color`,
              range: range,
              sortText: `2hex${index}`
            });
          });
        }

        if (methodName === 'addNode' || methodName === 'insertNode') {
          if (parameterIndex === 0) {
            // First parameter is node name (no quotes)
            const existingNodes = context.nodeData.nodesByVariable[variableName] || [];
            const suggestedNodes = ['client', 'server', 'router', 'database', 'user', 'admin', 'offline', 'node1', 'node2', 'node3'];
            
            suggestedNodes.forEach((nodeName, index) => {
              if (!existingNodes.includes(nodeName)) {
                suggestions.push({
                  label: nodeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: nodeName, // No quotes
                  detail: 'Node name',
                  documentation: `Add node named ${nodeName}`,
                  range: range,
                  sortText: `1node${index}`
                });
              }
            });
          } else if (parameterIndex === 1) {
            // Second parameter is node value
            const numberSuggestions = ['0', '1', '10', '25', '50', '100'];
            numberSuggestions.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: 'Numeric value',
                documentation: `Set node value to ${num}`,
                range: range,
                sortText: `1num${index}`
              });
            });
          }
        }

        if (methodName === 'removeNode') {
          if (parameterIndex === 0) {
            // Suggest existing nodes for removal (no quotes)
            const existingNodes = context.nodeData.nodesByVariable[variableName] || [];
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName, // No quotes
                detail: 'Existing node',
                documentation: `Remove node ${nodeName}`,
                range: range,
                sortText: `1node${index}`
              });
            });
          }
        }

        if (methodName === 'setColor' && (varType === 'graph' || varType === 'tree')) {
          if (parameterIndex === 0) {
            // First parameter is node name for graph/tree setColor (no quotes)
            const existingNodes = context.nodeData.nodesByVariable[variableName] || context.nodeData.allNodes;
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName, // No quotes
                detail: 'Node name',
                documentation: `Set color for node ${nodeName}`,
                range: range,
                sortText: `1node${index}`
              });
            });
          }
          if (parameterIndex === 0) {
            // First parameter is node name for graph/tree setArrow (no quotes)
            const existingNodes = context.nodeData.nodesByVariable[variableName] || context.nodeData.allNodes;
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName, // No quotes
                detail: 'Node name',
                documentation: `Set arrow for node ${nodeName}`,
                range: range,
                sortText: `1node${index}`
              });
            });
          }
        }

        if (methodName === 'addEdge' || methodName === 'removeEdge') {
          // Smart edge parameter suggestions - progressive completion
          const existingNodes = context.nodeData.nodesByVariable[variableName] || context.nodeData.allNodes || ['n1', 'n2', 'n3']; // fallback nodes

          // Get the current line to better understand context
          const line = model.getLineContent(position.lineNumber);
          const beforeCursor = line.substring(0, position.column - 1);
          
          // Find what's being typed in the current parameter
          const methodStart = beforeCursor.lastIndexOf('(');
          const paramStart = Math.max(
            beforeCursor.lastIndexOf(',', methodStart) + 1,
            methodStart + 1
          );
          const currentParamText = beforeCursor.substring(paramStart).trim();
          
          // Check if we're in the middle of typing an edge (contains -)
          // Use regex to detect if cursor is after a dash (e.g., parent-)
          const dashMatch = currentParamText.match(/([A-Za-z0-9_]+)-$/);
          if (dashMatch) {
            const beforeDash = dashMatch[1];
            const secondNodeOptions = existingNodes.filter(node => node !== beforeDash);
            secondNodeOptions.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName,
                detail: 'Target node',
                documentation: `Connect ${beforeDash} to ${nodeName}`,
                range: range,
                sortText: `0node${index}`
              });
            });
          } else {
            // Suggest node names only (no dash)
            existingNodes.forEach((nodeName, index) => {
              suggestions.push({
                label: nodeName,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: nodeName,
                detail: 'Source node',
                documentation: `Start edge from ${nodeName} (type '-' to select target)`,
                range: range,
                sortText: `0edge${index}`
              });
            });
          }
        }

          // Progressive completion for setChild/addChild (tree edge methods)
          if (methodName === 'setChild' || methodName === 'addChild') {
            const existingNodes = context.nodeData.nodesByVariable[variableName] || context.nodeData.allNodes || ['CEO', 'CTO', 'CFO', 'LeadDev', 'Intern'];
            const line = model.getLineContent(position.lineNumber);
            const beforeCursor = line.substring(0, position.column - 1);
            const methodStart = beforeCursor.lastIndexOf('(');
            const paramStart = Math.max(
              beforeCursor.lastIndexOf(',', methodStart) + 1,
              methodStart + 1
            );
            const currentParamText = beforeCursor.substring(paramStart).trim();
            // Use regex to detect if cursor is after a dash (e.g., parent-)
            const dashMatch = beforeCursor.match(/([A-Za-z0-9_]+)-$/);
            if (dashMatch) {
              const beforeDash = dashMatch[1];
              const secondNodeOptions = existingNodes.filter(node => node !== beforeDash);
              secondNodeOptions.forEach((nodeName, index) => {
                suggestions.push({
                  label: nodeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: nodeName,
                  detail: 'Child node',
                  documentation: `Set child from ${beforeDash} to ${nodeName}`,
                  range: range,
                  sortText: `0child${index}`
                });
              });
            } else {
              // Suggest node names only (no dash)
              existingNodes.forEach((nodeName, index) => {
                suggestions.push({
                  label: nodeName,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: nodeName,
                  detail: 'Parent node',
                  documentation: `Set child from ${nodeName} (type '-' to select child)`,
                  range: range,
                  sortText: `0parent${index}`
                });
              });
            }
          }

        if (methodName === 'setValue' || methodName === 'setValues') {
          // Value suggestions
          if (varType === 'array' || varType === 'stack') {
            const numberSuggestions = ['0', '1', '2', '3', '4', '5', '10', '20', '50', '100'];
            const stringSuggestions = ['"hello"', '"world"', '"data"', '"item"', '"element"'];
            
            numberSuggestions.forEach((num, index) => {
              suggestions.push({
                label: num,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: num,
                detail: 'Number',
                documentation: `Set value to ${num}`,
                range: range,
                sortText: `1num${index}`
              });
            });
            
            stringSuggestions.forEach((str, index) => {
              suggestions.push({
                label: str.replace(/"/g, ''),
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: str,
                detail: 'String',
                documentation: `Set value to ${str}`,
                range: range,
                sortText: `2str${index}`
              });
            });
          }
        }

        if (methodName.includes && methodName.includes('FontWeight')) {
          languageConfig.fontWeights.forEach((weight, index) => {
            suggestions.push({
              label: weight,
              kind: monaco.languages.CompletionItemKind.EnumMember,
              insertText: `"${weight}"`,
              detail: 'Font weight',
              documentation: `Set font weight to ${weight}`,
              range: range,
              sortText: `1weight${index}`
            });
          });
        }

        if (methodName.includes && methodName.includes('FontFamily')) {
          languageConfig.fontFamilies.forEach((family, index) => {
            suggestions.push({
              label: family,
              kind: monaco.languages.CompletionItemKind.EnumMember,
              insertText: `"${family}"`,
              detail: 'Font family',
              documentation: `Set font family to ${family}`,
              range: range,
              sortText: `1family${index}`
            });
          });
        }

        if (methodName.includes && methodName.includes('Align')) {
        }

        // Show alignment suggestions for setAlign and setAligns
          if (methodName === 'setAlign' || methodName === 'setAligns') {
            languageConfig.alignValues.forEach((align, index) => {
              suggestions.push({
                label: align,
                kind: monaco.languages.CompletionItemKind.EnumMember,
                insertText: `"${align}"`,
                detail: 'Text alignment',
                documentation: `Align text to ${align}`,
                range: range,
                sortText: `1align${index}`
              });
            });
          }

          if (methodName === 'setText') {
            if (parameterIndex === 0) {
              // First parameter is text content (string or null)
              suggestions.push({
                label: '"text content"',
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: '"${1:text content}"',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: 'Text to display',
                documentation: 'Text content to display at the position',
                range: range,
                sortText: '1text'
              });
            } else if (parameterIndex === 1) {
              // Second parameter is position ("above", "below", "left", "right")
              const positions = ['above', 'below', 'left', 'right'];
              positions.forEach((pos, index) => {
                suggestions.push({
                  label: pos,
                  kind: monaco.languages.CompletionItemKind.EnumMember,
                  insertText: `"${pos}"`,
                  detail: 'Text position',
                  documentation: `Position text ${pos} the component`,
                  range: range,
                  sortText: `1pos${index}`
                });
              });
            }
          }        return { suggestions };
      } catch (error) {
        console.error('Error in method argument completion provider:', error);
        return { suggestions: [] };
      }
    }
  });

  // Function to get method documentation based on type
  function getMethodDocumentation(methodName, varType) {
    const methodDoc = methodDocumentation[methodName];
    if (!methodDoc) return null;

    // If method has type-specific documentation
    if (typeof methodDoc === 'object' && methodDoc[varType]) {
      return methodDoc[varType];
    }
    
    // If method has default documentation
    if (typeof methodDoc === 'object' && methodDoc.default) {
      return methodDoc.default;
    }
    
    // If method has single documentation object
    if (methodDoc.signature && methodDoc.description) {
      return methodDoc;
    }
    
    return null;
  }

  // Function to check if current position is on a method call
  // This function is now defined earlier in the file (around line 227)
  // Keeping this comment for reference but the actual function is above

  // Register signature help provider for method parameters
  monaco.languages.registerSignatureHelpProvider("customLang", {
    signatureHelpTriggerCharacters: ['(', ','],
    signatureHelpRetriggerCharacters: [')'],
    provideSignatureHelp: (model, position, token) => {
      const lineContent = model.getLineContent(position.lineNumber);
      const beforeCursor = lineContent.substring(0, position.column - 1);
      
      // Find method call pattern: variable.method(
      const methodCallMatch = beforeCursor.match(/(\w+)\.(\w+)\s*\([^)]*$/);
      if (!methodCallMatch) return null;
      
      const [, variableName, methodName] = methodCallMatch;
      // Get cached parsed data
      const { variableTypes } = parseCache.getCachedData(model, position);
      const varType = variableTypes[variableName];
      
      if (!varType) return null;
      
      const methodDoc = getMethodDocumentation(methodName, varType);
      if (!methodDoc) return null;
      
      // Count current parameter by counting commas (but ignore commas inside quotes or brackets)
      const methodStart = beforeCursor.lastIndexOf('(');
      const paramsPart = beforeCursor.substring(methodStart + 1);
      let currentParam = 0;
      let depth = 0;
      let inQuotes = false;
      let quoteChar = '';
      
      for (let i = 0; i < paramsPart.length; i++) {
        const char = paramsPart[i];
        if (!inQuotes) {
          if (char === '"' || char === "'") {
            inQuotes = true;
            quoteChar = char;
          } else if (char === '(' || char === '[' || char === '{') {
            depth++;
          } else if (char === ')' || char === ']' || char === '}') {
            depth--;
          } else if (char === ',' && depth === 0) {
            currentParam++;
          }
        } else {
          if (char === quoteChar && (i === 0 || paramsPart[i - 1] !== '\\')) {
            inQuotes = false;
          }
        }
      }
      
      // Create parameter list with current parameter highlighted
      let parametersText = '';
      if (methodDoc.parameters && methodDoc.parameters.length > 0) {
        parametersText = '**Parameters:**\n\n' + methodDoc.parameters.map((param, index) => {
          const isCurrentParam = index === currentParam;
          const parts = param.split(' - ');
          const paramName = parts[0].trim();
          const paramDesc = parts[1] ? ` - ${parts[1].trim()}` : '';
          
          if (isCurrentParam) {
            return `• **${paramName}**${paramDesc}`;
          } else {
            return `• ${paramName}${paramDesc}`;
          }
        }).join('\n\n');
      }

      const signature = {
        label: methodDoc.signature,
        documentation: {
          value: `${methodDoc.description}\n\n${parametersText}\n\n**Example:**\n\`\`\`merlin\n${methodDoc.example}\n\`\`\``
        },
        parameters: methodDoc.parameters ? methodDoc.parameters.map(param => {
          const parts = param.split(' - ');
          return {
            label: parts[0].trim(),
            documentation: `Current Parameter: ${parts[1] ? parts[1].trim() : ''}`
          };
        }) : []
      };
      
      return {
        dispose: () => {},
        value: {
          activeSignature: 0,
          activeParameter: Math.min(currentParam, Math.max(0, signature.parameters.length - 1)),
          signatures: [signature]
        }
      };
    }
  });

  // Register a single hover provider for both method and variable documentation
  monaco.languages.registerHoverProvider("customLang", {
    provideHover: function(model, position) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      // Check if there's an error on the same line - if so, don't show hover info
      if (errorStateManager && errorStateManager.currentMarkers) {
        const hasErrorOnLine = errorStateManager.currentMarkers.some(marker => 
          marker.startLineNumber === position.lineNumber
        );
        if (hasErrorOnLine) {
          return null;
        }
      }

      // Get cached parsed data
      const { variableTypes } = parseCache.getCachedData(model, position);
      const varName = word.word;

      // Check if hovering over a component type keyword
      if (languageConfig.components.includes(varName)) {
        const typeDoc = typeDocumentation[varName];
        if (typeDoc) {
          const featuresList = typeDoc.features.map(feature => `• ${feature}`).join('\n');
          return {
            range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
            contents: [
              { value: `**${varName}** data structure` },
              { value: typeDoc.description },
              { value: `**Features:**\n${featuresList}` },
              { 
                value: `[See documentation](${typeDoc.url})`,
                isTrusted: true
              }
            ]
          };
        }
      }

      // Check if we're hovering over a method call
      const methodContext = getMethodCallContext(model, position);
      if (methodContext && methodContext.isMethodCall && methodContext.methodName === varName) {
        const callerType = variableTypes[methodContext.variableName];
        if (callerType) {
          const methodDoc = getMethodDocumentation(varName, callerType);
          if (methodDoc) {
            const paramsList = methodDoc.parameters ? 
              methodDoc.parameters.map(param => `• ${param}`).join('\n\n') : 
              'No parameters documented';
            const typeDoc = typeDocumentation[callerType];
            const docLink = typeDoc ? `[See ${callerType} documentation](${typeDoc.url})` : '';
            return {
              range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
              contents: [
                { value: `**${methodDoc.signature}**` },
                { value: methodDoc.description },
                { value: `**Parameters:**\n\n${paramsList}` },
                { value: `**Example:**\n\`\`\`merlin\n${methodDoc.example}\n\`\`\`` },
                ...(docLink ? [{ value: docLink, isTrusted: true }] : [])
              ]
            };
          }
        }
      }

      // Check if we're hovering over a method name (even without parentheses)
      const methodHover = isHoveringOverMethod(model, position, word);
      if (methodHover && methodHover.isMethod) {
        const callerType = variableTypes[methodHover.variableName];
        if (callerType) {
          const methodDoc = getMethodDocumentation(methodHover.methodName, callerType);
          if (methodDoc) {
            const paramsList = methodDoc.parameters ? 
              methodDoc.parameters.map(param => `• ${param}`).join('\n\n') : 
              'No parameters documented';
            const typeDoc = typeDocumentation[callerType];
            const docLink = typeDoc ? `[See ${callerType} documentation](${typeDoc.url})` : '';
            return {
              range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
              contents: [
                { value: `**${methodHover.methodName}()** method` },
                { value: methodDoc.description },
                { value: `**Parameters:**\n\n${paramsList}` },
                { value: `**Example:**\n\`\`\`merlin\n${methodDoc.example}\n\`\`\`` },
                ...(docLink ? [{ value: docLink, isTrusted: true }] : [])
              ]
            };
          } else {
            // Fallback: show basic method info even without detailed documentation
            const availableMethods = getMethodsForType(callerType);
            if (availableMethods.includes(methodHover.methodName)) {
              return {
                range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                contents: [
                  { value: `**${methodHover.methodName}()** method` },
                  { value: `Method available for ${callerType} variables` },
                  { value: `Call as: ${methodHover.variableName}.${methodHover.methodName}()` }
                ]
              };
            }
          }
        }
      }

      // Otherwise, check if it's a variable for type documentation
      const varType = variableTypes[varName];
      if (varType) {
        const availableMethods = getMethodsForType(varType);
        const methodsList = availableMethods.map(method => `• \`${method}()\`: ${methodDescriptions[method] || 'Method for ' + varType}`).join('\n\n');
        const typeDoc = typeDocumentation[varType];
        const docLink = typeDoc ? `[See ${varType} documentation](${typeDoc.url})` : '';
        return {
          range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
          contents: [
            { value: `**${varName}** (${varType})` },
            { value: typeDoc ? typeDoc.description : `Variable of type ${varType}` },
            { value: `**Available methods:**\n\n${methodsList}` },
            ...(docLink ? [{ value: docLink, isTrusted: true }] : [])
          ]
        };
           }

      return null;
    }
  });

  monaco.languages.registerInlineCompletionsProvider('customLang', {
    provideInlineCompletions(model, position, context, token) {
      // Simple inline suggestions for page and show commands
      const inlineItems = [];
      
      const nothingToShowFixes = getNothingToShowQuickFixes(model, true);
      inlineItems.push(...nothingToShowFixes);

      return { items: inlineItems, dispose: () => {} };
    },
    handleItemDidShow: () => {},
    freeInlineCompletions: () => {},
  });
 
  // Register code action provider for Quick Fixes
  monaco.languages.registerCodeActionProvider("customLang", {
    provideCodeActions: function(model, range, context, token) {
      const actions = [];
      const line = model.getLineContent(range.startLineNumber);
      const word = model.getWordAtPosition({ lineNumber: range.startLineNumber, column: range.startColumn });
      
      // Quick fix for "Nothing to show" error - always check this one
      const nothingToShowFixes = getNothingToShowQuickFixes(model);
      actions.push(...nothingToShowFixes);
      
      // For other fixes, we need a word
      if (!word) return { actions, dispose: () => {} };

      // Quick fix for misspelled attributes
      const attributeFixes = getAttributeQuickFixes(line, word, range, model);
      actions.push(...attributeFixes);

      // Quick fix for misspelled methods
      const methodFixes = getMethodQuickFixes(line, word, range, model);
      actions.push(...methodFixes);

      // Quick fix for misspelled components
      const componentFixes = getComponentQuickFixes(line, word, range, model);
      actions.push(...componentFixes);

      // Quick fix for common syntax errors
      const syntaxFixes = getSyntaxQuickFixes(line, word, range, model);
      actions.push(...syntaxFixes);

      // Quick fix for array method misuse
      const arrayMethodFixes = getArrayMethodQuickFixes(line, word, range, model);
      actions.push(...arrayMethodFixes);

      // Collect candidate quick fix edits for logging (instrumentation)
      try {
        if (!window.__pendingQuickFixes) window.__pendingQuickFixes = {};
        const uriKey = model.uri.toString();
        const candidates = [];
        const normalizeEdits = (action) => {
          const editsArr = action?.edit?.edits || [];
          const textEdits = [];
          editsArr.forEach(e => {
            // Monaco sometimes nests edit under textEdit or edit
            if (e.textEdit) {
              textEdits.push(e.textEdit);
            } else if (e.edit && e.edit.range) {
              textEdits.push(e.edit);
            } else if (e.textEdits) { // fallback
              textEdits.push(...e.textEdits);
            }
          });
          return textEdits.map(te => ({
            range: {
              startLineNumber: te.range.startLineNumber,
              startColumn: te.range.startColumn,
              endLineNumber: te.range.endLineNumber,
              endColumn: te.range.endColumn,
            },
            text: te.text
          }));
        };
        actions.forEach(a => {
          if (a.edit) {
            candidates.push({
              title: a.title,
              kind: a.kind || 'quickfix',
              edits: normalizeEdits(a)
            });
          }
        });
        window.__pendingQuickFixes[uriKey] = {
          ts: Date.now(),
            actions: candidates.slice(0, 100) // cap to avoid memory growth
        };
      } catch {}

      return {
        actions: actions,
        dispose: () => {}
      };
    }
  });

  // Helper function to calculate Levenshtein distance
  function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Find closest matches using Levenshtein distance
  function findClosestMatches(word, candidates, maxDistance = 2, maxSuggestions = 3) {
    return candidates
      .map(candidate => ({
        word: candidate,
        distance: levenshteinDistance(word.toLowerCase(), candidate.toLowerCase())
      }))
      .filter(item => item.distance <= maxDistance && item.distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxSuggestions)
      .map(item => item.word);
  }

  // Quick fixes for misspelled attributes
  function getAttributeQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;
    
    // Check if this looks like an attribute (followed by colon)
    if (line.includes(`${currentWord}:`)) {
      const suggestions = findClosestMatches(currentWord, languageConfig.attributes);
      
      suggestions.forEach(suggestion => {
        actions.push({
          title: `Change "${currentWord}" to "${suggestion}"`,
          kind: 'quickfix',
          diagnostics: [],
          edit: {
            edits: [{
              resource: model.uri,
              versionId: model.getVersionId(),
              textEdits: [{
                range: new monaco.Range(
                  range.startLineNumber, word.startColumn,
                  range.startLineNumber, word.endColumn
                ),
                text: suggestion
              }]
            }]
          }
        });
      });
    }
    
    return actions;
  }

  // Quick fixes for misspelled methods
  function getMethodQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;
    
    // Check if this looks like a method call (preceded by dot)
    const beforeWord = line.substring(0, word.startColumn - 1);
    const methodCallMatch = beforeWord.match(/(\w+)\.$/);
    
    if (methodCallMatch) {
      const variableName = methodCallMatch[1];
      const { variableTypes } = parseCache.getCachedData(model, { 
        lineNumber: range.startLineNumber, 
        column: word.startColumn 
      });
      const varType = variableTypes[variableName];
      
      if (varType) {
        const availableMethods = getMethodsForType(varType);
        const suggestions = findClosestMatches(currentWord, availableMethods);
        
        suggestions.forEach(suggestion => {
          actions.push({
            title: `Change "${currentWord}" to "${suggestion}"`,
            kind: 'quickfix',
            diagnostics: [],
            edit: {
              edits: [{
                resource: model.uri,
                textEdit: {
                  range: new monaco.Range(
                    range.startLineNumber, word.startColumn,
                    range.startLineNumber, word.endColumn
                  ),
                  text: suggestion
                }
              }]
            }
          });
        });
      }
    }
    
    return actions;
  }

  // Quick fixes for misspelled components - FIXED VERSION
  function getComponentQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;
    
    // Check if this looks like a component declaration
    if (line.match(new RegExp(`^\\s*\\w+\\s+\\w+\\s*=\\s*\\{`)) || 
        line.includes(`${currentWord} `) && !languageConfig.components.includes(currentWord)) {
      
      const suggestions = findClosestMatches(currentWord, languageConfig.components);
      
      suggestions.forEach(suggestion => {
        actions.push({
          title: `Change "${currentWord}" to "${suggestion}"`,
          kind: 'quickfix',
          diagnostics: [],
          edit: {
            edits: [{
              resource: model.uri,
              edit: {
                range: new monaco.Range(
                  range.startLineNumber, word.startColumn,
                  range.startLineNumber, word.endColumn
                ),
                text: suggestion
              }
            }]
          }
        });
      });
    }
    
    return actions;
  }

  // Quick fixes for common syntax errors
  function getSyntaxQuickFixes(line, word, range, model) {
    const actions = [];
    const trimmedLine = line.trim();
    
    // Fix missing colon after attribute
    if (trimmedLine.match(/^\s*\w+\s+[^:=]/) && languageConfig.attributes.includes(word.word)) {
      actions.push({
        title: `Add colon after "${word.word}"`,
        kind: 'quickfix',
        diagnostics: [],
        edit: {
          edits: [{
            resource: model.uri,
            edit: {
              range: new monaco.Range(
                range.startLineNumber, word.endColumn,
                range.startLineNumber, word.endColumn
              ),
              text: ':'
            }
          }]
        }
      });
    }

    // Fix missing equals sign in component declaration
    if (trimmedLine.match(/^\s*\w+\s+\w+\s*\{/) && languageConfig.components.includes(word.word)) {
      const braceIndex = line.indexOf('{');
      if (braceIndex > 0) {
        actions.push({
          title: `Add "= " before "{"`,
          kind: 'quickfix',
          diagnostics: [],
          edit: {
            edits: [{
              resource: model.uri,
              edit: {
                range: new monaco.Range(
                  range.startLineNumber, braceIndex,
                  range.startLineNumber, braceIndex
                ),
                text: '= '
              }
            }]
          }
        });
      }
    }

    // Fix missing parentheses in method calls
    if (line.includes(`${word.word}.`) || line.includes(`.${word.word}`)) {
      const allMethods = staticCache.getAllMethods();
      
      if (allMethods.includes(word.word) && !line.includes(`${word.word}(`)) {
        actions.push({
          title: `Add parentheses to "${word.word}" method call`,
          kind: 'quickfix',
          diagnostics: [],
          edit: {
            edits: [{
              resource: model.uri,
              edit: {
                range: new monaco.Range(
                  range.startLineNumber, word.endColumn,
                  range.startLineNumber, word.endColumn
                ),
                text: '()'
              }
            }]
          }
        });
      }
    }

    // Fix common typos in keywords
    const keywordSuggestions = findClosestMatches(word.word, languageConfig.keywords);
    if (keywordSuggestions.length > 0 && !languageConfig.keywords.includes(word.word)) {
      keywordSuggestions.forEach(suggestion => {
        actions.push({
          title: `Change "${word.word}" to "${suggestion}"`,
          kind: 'quickfix',
          diagnostics: [],
          edit: {
            edits: [{
              resource: model.uri,
              edit: {
                range: new monaco.Range(
                  range.startLineNumber, word.startColumn,
                  range.startLineNumber, word.endColumn
                ),
                text: suggestion
              }
            }]
          }
        });
      });
    }

    return actions;
  }

  // NEW: Quick fixes for array method misuse
  function getArrayMethodQuickFixes(line, word, range, model) {
    const actions = [];
    const currentWord = word.word;
    
    // Check if this is a method call with parameters
    const methodCallMatch = line.match(new RegExp(`(\\w+)\\.(${currentWord})\\s*\\(([^)]*)\\)`));
    if (methodCallMatch) {
      const [, variableName, methodName, params] = methodCallMatch;
      const suggestions = getArrayMethodSuggestions(methodName, params);
      
      suggestions.forEach(suggestion => {
        actions.push({
          title: suggestion.title,
          kind: 'quickfix',
          diagnostics: [],
          edit: {
            edits: [{
              resource: model.uri,
              edit: {
                range: new monaco.Range(
                  range.startLineNumber, word.startColumn,
                  range.startLineNumber, word.endColumn
                ),
                text: suggestion.replacement
              }
            }]
          }
        });
      });
    }
    
    return actions;
  }

  // Quick fix for "Nothing to show" compile error
  function getNothingToShowQuickFixes(model, isInline = false) {
    // If isInline, we need to provide data in form of { label, insertText, range, sortText }
    const actions = [];
    const inlineItems = [];

    // Get all the text in the model
    const fullText = model.getValue();
    
    // Check if this might be a "Nothing to show" error scenario
    // Look for component declarations but no page/show commands
    const hasComponents = languageConfig.components.some(component => 
      fullText.match(new RegExp(`\\b${component}\\s+\\w+\\s*=\\s*\\{`, 'm'))
    );
    
    const hasPage = /\bpage\b/.test(fullText);
    const hasShow = /\bshow\b/.test(fullText);
    
    // If we have components but no page or show commands, offer the fix
    if (hasComponents && (!hasPage || !hasShow)) {
      // Extract component variable names
      const componentVariables = [];
      languageConfig.components.forEach(component => {
        const regex = new RegExp(`\\b${component}\\s+(\\w+)\\s*=\\s*\\{`, 'gm');
        let match;
        while ((match = regex.exec(fullText)) !== null) {
          componentVariables.push(match[1]);
        }
      });
      
      if (componentVariables.length > 0) {
        // Create the fix text
        let fixText = '\n\npage';
        componentVariables.forEach(varName => {
          fixText += `\nshow ${varName}`;
        });
        
        // Get the last line of the model to append the fix
        const lastLine = model.getLineCount();
        const lastLineContent = model.getLineContent(lastLine);
        const lastColumn = lastLineContent.length + 1;
        
        const action = {
          title: `Add page and show commands for defined components`,
          kind: 'quickfix',
          diagnostics: [],
          edit: {
            edits: [{
              resource: model.uri,
              textEdit: {
                range: new monaco.Range(
                  lastLine, lastColumn,
                  lastLine, lastColumn
                ),
                text: fixText
              }
            }]
          }
        };
        if (isInline) {
          // For inline completions, we need to return { label, insertText, range, sortText }
          inlineItems.push({
            label: 'Add page and show commands',
            insertText: fixText,
            range: new monaco.Range(
              lastLine, lastColumn,
              lastLine, lastColumn
            ),
            sortText: '0fix'
          });
        } else {
          // For code actions, we return the full action object
          actions.push(action);
        }
      }
    }
    
    if (isInline) {
      return inlineItems;
    } else {
      return actions;
    }
  }

}