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
  // Prevent multiple registrations
  if (window.customLangRegistered) {
    return;
  }
  window.customLangRegistered = true;
  
  // Initialize error state manager
  window.errorStateManager = errorStateManager;
  errorStateManager.monaco = monaco;
  
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
  const coordinatePattern = /\(\s*\d+\s*,\s*\d+\s*\)/;
  const rangePattern = /\(\s*\d+\.\.\d+\s*,\s*\d+(\.\.\d+)?\s*\)|\(\s*\d+\s*,\s*\d+\.\.\d+\s*\)/;
  
  // Create method pattern from all available methods
  const allMethods = [...new Set(Object.values(typeMethodsMap).flatMap(type => 
    Object.values(type).flatMap(methods => Array.isArray(methods) ? methods : [])
  ))];
  const methodPattern = new RegExp(`\\b(${allMethods.join('|')})\\b`);
  const dotNotationPattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*\b/;

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
        insertText: `graph \${1:myGraph} = {\n\tnodes: [\${2:"n1", "n2", "n3"}]\n\tedges: [\${3:"n1-n2", "n2-n3"}]\n\tvalue: [\${4:10, 20, 30}]\n}`,
        documentation: 'Complete graph declaration with nodes, edges, and values'
      },
      linkedlist: {
        label: 'Linked list with nodes',
        insertText: `linkedlist \${1:myList} = {\n\tnodes: [\${2:"head", "node1", "node2", "tail"}]\n\tvalue: [\${3:1, 2, 3, 4}]\n\tcolor: [\${4:"green", null, null, "red"}]\n}`,
        documentation: 'Complete linked list declaration with nodes and values'
      },
      tree: {
        label: 'Tree with hierarchical structure',
        insertText: `tree \${1:myTree} = {\n\tnodes: [\${2:"root", "left", "right"}]\n\tchildren: [\${3:"root-left", "root-right"}]\n\tvalue: [\${4:1, 2, 3}]\n}`,
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

  // Function to get positioning template suggestions
  function getPositioningTemplates() {
    return [
      {
        label: 'Complete layout example',
        insertText: `\${1:// Data structures}\nstack callStack = {\n\tvalue: ["main", "process", "calculate"]\n\tcolor: [null, "blue", null]\n\tarrow: [null, null, "top"]\n}\n\narray numbers = {\n\tvalue: [1, 2, 3, 4, 5]\n\tcolor: ["red", "green", "blue", "orange", "purple"]\n}\n\n\${2:// Layout and display}\npage 2x2\nshow callStack top-left\nshow numbers (1, 0)\n\n\${3:// Method calls}\ncallStack.setColor(0, "green")\nnumbers.setValue(0, 42)`,
        documentation: 'Complete example with data structures, positioning, and method calls'
      },
      {
        label: 'Grid layout with positioning',
        insertText: `page \${1:2x2}\nshow \${2:variable1} \${3:top-left}\nshow \${4:variable2} \${5:(1, 0)}\nshow \${6:variable3} \${7:bottom-right}`,
        documentation: 'Grid layout with multiple positioning styles'
      },
      {
        label: 'Range positioning example',
        insertText: `page \${1:4x3}\nshow \${2:variable1} \${3:(0..2, 0)}\nshow \${4:variable2} \${5:(0, 1..2)}\nshow \${6:variable3} \${7:bottom-right}`,
        documentation: 'Example using range positioning to span multiple cells'
      }
    ];
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
        [coordinatePattern, 'positional'],
        [rangePattern, 'positional'],
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
 
  // Register completion provider for comprehensive autocomplete
  monaco.languages.registerCompletionItemProvider("customLang", {
    triggerCharacters: ['.', ' '],
    provideCompletionItems: function(model, position) {
      try {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const line = model.getLineContent(position.lineNumber);
        const beforeCursor = line.substring(0, position.column - 1);
        const afterCursor = line.substring(position.column - 1);
        
        // Parse context to get variable types and names
        const variableTypes = parseContextForTypes(model, position);
        const variableNames = Object.keys(variableTypes);

        // Check if we're after a dot (method completion)
        const varName = getVariableNameAtPosition(model, position);
        if (varName) {
          const varType = variableTypes[varName];
          if (varType) {
            const methods = getMethodsForType(varType);
            const suggestions = methods.map(method => ({
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
            }));
            return { suggestions };
          }
        }

        // Context-aware suggestions based on line content and position
        const suggestions = [];

        // At the beginning of a line - suggest components and keywords
        if (beforeCursor.trim() === '' || beforeCursor.match(/^\s*$/)) {
          // Add component types with simple declaration
          languageConfig.components.forEach(component => {
            suggestions.push({
              label: component,
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: `${component} \${1:variableName} = {\n\t\${2:}\n}`,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Data structure',
              documentation: typeDocumentation[component]?.description || `Create a new ${component}`,
              range: range,
              sortText: `1${component}`
            });
            
            // Add template suggestions for each component type
            const template = getTemplateSuggestions(component);
            if (template) {
              suggestions.push({
                label: `${component} (template)`,
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: template.insertText,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                detail: 'Template',
                documentation: template.documentation,
                range: range,
                sortText: `0${component}` // Higher priority for templates
              });
            }
          });

          // Add keywords
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
          
          // Add positioning templates at the beginning of lines
          const positioningTemplates = getPositioningTemplates();
          positioningTemplates.forEach((template, index) => {
            suggestions.push({
              label: template.label,
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: template.insertText,
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              detail: 'Template',
              documentation: template.documentation,
              range: range,
              sortText: `0template${index}`
            });
          });
        }
        
        // After 'show' or 'hide' keywords - suggest variable names
        if (beforeCursor.match(/\b(show|hide)\s+$/)) {
          variableNames.forEach(varName => {
            const varType = variableTypes[varName];
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
        const showVariableMatch = beforeCursor.match(/\b(show|hide)\s+(\w+)\s+$/);
        if (showVariableMatch) {
          const [, command, varName] = showVariableMatch;
          
          // Detect current grid layout for smart suggestions
          const gridLayout = detectGridLayout(model, position);
          
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
          if (gridLayout) {
            const smartSuggestions = getSmartPositionSuggestions(gridLayout);
            smartSuggestions.forEach(({ coord, desc }, index) => {
              suggestions.push({
                label: coord,
                kind: monaco.languages.CompletionItemKind.Value,
                insertText: coord,
                detail: 'Smart coordinate',
                documentation: `${desc} (based on ${gridLayout.cols}x${gridLayout.rows} grid)`,
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
        if (beforeCursor.match(/\bpage\s+$/)) {
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

        // When typing variable names in method calls or assignments
        if (beforeCursor.match(/\w+\.\w*$/) === null && // Not after a dot
            !beforeCursor.match(/^\s*(show|hide)\s+$/) && // Not after show/hide
            !beforeCursor.match(/^\s*$/) && // Not at beginning of line
            beforeCursor.length > 0) { // Not empty
          
          // Check if we're in a context where variable names make sense
          const isInVariableContext = (
            beforeCursor.match(/^\s*\w*$/) || // Just typing a word at start of line
            beforeCursor.match(/\s+\w*$/) || // Typing a word after whitespace
            beforeCursor.match(/\(\w*$/) || // Inside function parentheses
            beforeCursor.match(/,\s*\w*$/) || // After comma in parameter list
            word.word.length > 0 // Currently typing a word
          );
          
          if (isInVariableContext) {
            variableNames.forEach(varName => {
              const varType = variableTypes[varName];
              
              // Calculate relevance score for better sorting
              let sortScore = 3;
              if (word.word && varName.toLowerCase().startsWith(word.word.toLowerCase())) {
                sortScore = 0; // Highest priority for prefix matches
              } else if (word.word && varName.toLowerCase().includes(word.word.toLowerCase())) {
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

        // Suggest attributes when inside component declaration
        if (beforeCursor.includes('{') && !beforeCursor.includes('}')) {
          const openBraceIndex = beforeCursor.lastIndexOf('{');
          const textAfterBrace = beforeCursor.substring(openBraceIndex + 1);
          
          // Check if we're in a component declaration
          const componentMatch = beforeCursor.match(/(\w+)\s+\w+\s*=\s*\{[^}]*$/);
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

        // Add position keywords when appropriate
        if (beforeCursor.match(/:\s*$/) || beforeCursor.match(/=\s*$/)) {
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
        const insideParensMatch = beforeCursor.match(/\(\s*([^)]*?)$/);
        if (insideParensMatch) {
          const [, content] = insideParensMatch;
          const gridLayout = detectGridLayout(model, position);
          
          // If no content yet, suggest common coordinates
          if (content.trim() === '') {
            if (gridLayout) {
              const smartSuggestions = getSmartPositionSuggestions(gridLayout);
              smartSuggestions.slice(0, 6).forEach(({ coord, desc }, index) => {
                // Remove parentheses since we're already inside them
                const coordContent = coord.replace(/[()]/g, '');
                suggestions.push({
                  label: coordContent,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: coordContent,
                  detail: 'Smart coordinate',
                  documentation: `${desc} (based on ${gridLayout.cols}x${gridLayout.rows} grid)`,
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
              if (gridLayout) {
                rowSuggestions = [];
                for (let row = 0; row < gridLayout.rows; row++) {
                  rowSuggestions.push(row.toString());
                }
                // Add some range suggestions
                if (gridLayout.rows > 1) {
                  rowSuggestions.push('0..1');
                  if (gridLayout.rows > 2) {
                    rowSuggestions.push(`0..${gridLayout.rows - 1}`);
                  }
                }
              }
              
              rowSuggestions.forEach((row, index) => {
                suggestions.push({
                  label: row,
                  kind: monaco.languages.CompletionItemKind.Value,
                  insertText: row,
                  detail: 'Row',
                  documentation: gridLayout ? 
                    `Row ${row} (grid has ${gridLayout.rows} rows)` : 
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
        const word = model.getWordUntilPosition(position);
        if (!word || word.word.length < 2) return { suggestions: [] }; // Only show for 2+ characters
        
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const line = model.getLineContent(position.lineNumber);
        const beforeCursor = line.substring(0, position.column - 1);
        
        // Parse context to get variable types and names
        const variableTypes = parseContextForTypes(model, position);
        const variableNames = Object.keys(variableTypes);
        const suggestions = [];

        // Filter variables by what's being typed
        const currentWord = word.word.toLowerCase();
        const matchingVariables = variableNames.filter(varName => 
          varName.toLowerCase().includes(currentWord)
        );

        // Add matching variables with high priority
        matchingVariables.forEach(varName => {
          const varType = variableTypes[varName];
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

        // Add matching component types
        const matchingComponents = languageConfig.components.filter(component =>
          component.toLowerCase().includes(currentWord)
        );
        
        matchingComponents.forEach(component => {
          let sortScore = component.toLowerCase().startsWith(currentWord) ? '0' : '2';
          suggestions.push({
            label: component,
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: component,
            detail: 'Data structure type',
            documentation: typeDocumentation[component]?.description || `${component} data structure`,
            range: range,
            sortText: `${sortScore}${component}`
          });
        });

        return { suggestions };
      } catch (error) {
        console.error('Error in secondary completion provider:', error);
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
  function getMethodCallContext(model, position) {
    const lineContent = model.getLineContent(position.lineNumber);
    const word = model.getWordAtPosition(position);
    if (!word) return { isMethodCall: false };

    // Get the text before the current word
    const beforeWord = lineContent.substring(0, word.startColumn - 1);
    // Check for method call pattern: variable.methodName (where methodName is the current word)
    const methodCallMatch = beforeWord.match(/(\w+)\.$/);
    if (methodCallMatch) {
      return {
        variableName: methodCallMatch[1],
        methodName: word.word,
        isMethodCall: true
      };
    }

    return { isMethodCall: false };
  }

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
      const variableTypes = parseContextForTypes(model, position);
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

      const variableTypes = parseContextForTypes(model, position);
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
      if (methodContext.isMethodCall && methodContext.methodName === varName) {
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
 
 // Register code action provider for Quick Fixes
  monaco.languages.registerCodeActionProvider("customLang", {
    provideCodeActions: function(model, range, context, token) {
      const actions = [];
      const line = model.getLineContent(range.startLineNumber);
      const word = model.getWordAtPosition({ lineNumber: range.startLineNumber, column: range.startColumn });
      
      if (!word) return { actions: [], dispose: () => {} };

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
      const variableTypes = parseContextForTypes(model, { 
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
      const allMethods = [...new Set(Object.values(typeMethodsMap).flatMap(type => 
        Object.values(type).flatMap(methods => Array.isArray(methods) ? methods : [])
      ))];
      
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

}