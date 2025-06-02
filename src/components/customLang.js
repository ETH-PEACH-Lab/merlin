export function registerCustomLanguage(monaco) {
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

  const attribute = ['id', 'value', 'color', 'arrow', 'nodes', 'edges', 'hidden'];
  const attributePattern = new RegExp(`\\b(${attribute.join('|')})\\b`);

  const setCommand = new RegExp(`\\b(set)\\w*\\b`);
  const addCommand = new RegExp(`\\b(add)\\w*\\b`);
  const removeCommand = new RegExp(`\\b(remove)\\w*\\b`);
  const insertCommand = new RegExp(`\\b(insert)\\w*\\b`);

  // EExample of edge: n1-n2
  const edgePattern = /([a-zA-Z_][a-zA-Z0-9_]*)-([a-zA-Z_][a-zA-Z0-9_]*)/;

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

}
