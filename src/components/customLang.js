export function registerCustomLanguage(monaco) {
  // Register a new language
  monaco.languages.register({ id: "customLang" });
  const keywords = ['page', 'show', 'visslides', 'data', 'draw'];
  const keywordPattern = new RegExp(`\\b(${keywords.join('|')})\\b`);

  const symbols = [':', ':=', '=', '*', ',', '@', '&', '(', ')', '[', ']', '{', '}'];
  // Escape special characters for regular expression
  const escapedSymbols = symbols.map(symbol => symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Create a regular expression pattern without word boundaries
  const symbolPattern = new RegExp(`(${escapedSymbols.join('|')})`, 'g');

  const component = ['array', 'matrix', 'linkedlist', 'stack', 'tree', 'graph', 'text'];
  const componentPattern = new RegExp(`\\b(${component.join('|')})\\b`);

  const attribute = ['id', 'value', 'color', 'arrow', 'hidden', 'structure'];
  const attributePattern = new RegExp(`\\b(${attribute.join('|')})\\b`);

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
        [componentPattern, 'component'],
        [attributePattern, 'attribute'],
        [/\b[a-zA-Z_][a-zA-Z0-9_]*\b/, 'variable'],
        [/\b\d+(\.\d+)?\b/, 'number'],
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
      { token: 'variable',  foreground: 'dcdcaa'}, 
      { token: 'number', foreground: 'b5cea8' }, // Light green for numbers
      { token: 'keyword', foreground: '569cd6' },  // Changed to a blue color
      { token: 'symbol', foreground: 'ffcc00' },
      { token: 'component', foreground: '4ec9b0' },
      { token: 'attribute', foreground: 'd19a66' }

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
}
