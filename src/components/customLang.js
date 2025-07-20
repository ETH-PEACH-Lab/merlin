import { 
  languageConfig,
  typeDocumentation,
  typeMethodsMap,
  methodSignatures,
  methodDocumentation,
  methodDescriptions,
  themeConfig,
  monacoLanguageConfig
} from './languageConfig.js';

export function registerCustomLanguage(monaco) {
  // Prevent multiple registrations
  if (window.customLangRegistered) {
    console.log('Custom language already registered, skipping...');
    return;
  }
  window.customLangRegistered = true;
  
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
    const declarationRegex = new RegExp(`^\\s*(${componentsPattern})\\s+(\\w+)\\s*(:?=)\\s*\\{`);
    
    // Parse variable declarations with improved regex
    for (const line of lines) {
      const match = line.match(declarationRegex);
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

  // Function to get method signature for autocomplete
  function getMethodSignature(methodName, varType) {
    const signatureFunction = methodSignatures[methodName];
    if (typeof signatureFunction === 'function') {
      return signatureFunction(varType);
    }
    return signatureFunction || `${methodName}()`;
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
          sortText: `0${method}`,
          command: {
            id: 'editor.action.triggerParameterHints',
            title: 'Trigger signature help'
          }
        }));

        console.log('Final suggestions:', suggestions);
        return { suggestions };
      } catch (error) {
        console.error('Error in completion provider:', error);
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
      
      const signature = {
        label: methodDoc.signature,
        documentation: {
          value: `${methodDoc.description}\n\n**Example:**\n\`\`\`merlin\n${methodDoc.example}\n\`\`\``
        },
        parameters: methodDoc.parameters ? methodDoc.parameters.map(param => {
          const parts = param.split(' - ');
          return {
            label: parts[0].trim(),
            documentation: parts[1] ? parts[1].trim() : ''
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

}
