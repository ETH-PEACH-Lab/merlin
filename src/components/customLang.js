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

        if (!varName) {
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

        if (!varType) {
          return { suggestions: [] };
        }

        // Get methods for this type
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