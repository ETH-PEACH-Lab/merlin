// src/customLanguage.js
import * as monaco from 'monaco-editor';

export function registerCustomLanguage() {
  monaco.languages.register({ id: 'customLang' });

  monaco.languages.setMonarchTokensProvider('customLang', {
    tokenizer: {
      root: [
        [/\b(if|else|for|while|function)\b/, 'keyword'],
        [/[+-]?\d+/, 'number'],
        [/".*?"/, 'string'],
        [/\/\/.*$/, 'comment'],
        [/[a-zA-Z_$][\w$]*/, 'identifier']
      ]
    }
  });

  monaco.languages.setLanguageConfiguration('customLang', {
    comments: {
      lineComment: '//'
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"', notIn: ['string'] }
    ]
  });

  monaco.editor.defineTheme('customTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569cd6' },  // Changed to a blue color
      { token: 'number', foreground: 'b5cea8' },
      { token: 'string', foreground: 'd69d85' },
      { token: 'comment', foreground: '6a9955' },
      { token: 'identifier', foreground: '9cdcfe' }
    ],
    colors: {
      'editor.foreground': '#FFFFFF',
      'editor.background': '#1E1E1E',  // Ensure background is set to dark
      'editorCursor.foreground': '#A7A7A7',
      'editor.lineHighlightBackground': '#333333',
      'editorLineNumber.foreground': '#858585',
      'editor.selectionBackground': '#264F78',
      'editor.inactiveSelectionBackground': '#3A3D41'
    }
  });
}
