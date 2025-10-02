import React from 'react';
import { useStudy } from './StudyContext';
import MonacoEditor from '@monaco-editor/react';


// Lightweight LaTeX-ish syntax highlighting registration (only once)
let registered = false;
function ensureLatex(monaco) {
  if (registered) return;
  registered = true;
  monaco.languages.register({ id: 'latex' });
  monaco.languages.setMonarchTokensProvider('latex', {
    tokenizer: {
      root: [
        [/\\\[[^\]]*\]/, 'keyword'],
        [/\\[a-zA-Z]+/, 'keyword'],
        [/%.*/, 'comment'],
        [/\$[^$]*\$/,'string'],
        [/\{[^}]*\}/,'delimiter']
      ]
    }
  });
  monaco.editor.defineTheme('latexTheme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'C586C0' },
      { token: 'comment', foreground: '6A9955' },
      { token: 'string', foreground: 'CE9178' }
    ],
    colors: {}
  });
}

export default function TikzEditor({ value, onChange }) {
  const { phase, currentKind, logEvent } = useStudy();
  const inStudyTask = phase === 'task' && currentKind === 'tikz';
  const handleMount = (editor, monaco) => {
    const model = editor.getModel();
    // Clear all markers on empty or any marker changes
    const clearMarkers = () => {
      if (model) {
        monaco.editor.setModelMarkers(model, null, []);
      }
    };
    // Initial clear if empty
    if (model && model.getValue().trim() === '') clearMarkers();
    // Clear after content changes when empty
    model && model.onDidChangeContent(() => {
      if (model.getValue().trim() === '') clearMarkers();
    });
    // Also clear whenever markers change
    monaco.editor.onDidChangeMarkers(e => {
      if (model && e.includes(model.uri)) clearMarkers();
    });

    // Copy & paste logging (only during study)
    editor.onKeyDown((e) => {
      if (!inStudyTask || !logEvent) return;
      
      // Detect copy/paste
      if (e.ctrlKey || e.metaKey) {
        if (e.keyCode === 67) { // Ctrl+C
          logEvent('copy_code', { editor: 'tikz' });

        } else if (e.keyCode === 86) { // Ctrl+V
          logEvent('paste_code', { editor: 'tikz' });

        }
      }
    });
  };
  return (
    <MonacoEditor
      height="100%"
      language="latex"
      value={value}
      theme="latexTheme"
      onChange={(v)=>onChange(v||'')}
      options={{
        fontFamily: 'Consolas, monospace',
        fontSize: 15,
        minimap: { enabled: false },
        automaticLayout: true,
        wordWrap: 'on',
        renderValidationDecorations: 'off'
      }}
      beforeMount={(monaco)=>ensureLatex(monaco)}
      onMount={handleMount}
    />
  );
}
