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
      { token: 'keyword', foreground: 'd73a49' },
      { token: 'number', foreground: 'b5cea8' },
      { token: 'string', foreground: '6a8759' },
      { token: 'comment', foreground: '999999' },
      { token: 'identifier', foreground: '9cdcfe' }
    ],
    colors: {}
  });
}
