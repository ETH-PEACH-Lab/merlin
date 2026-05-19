import React, { useRef, useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

const PythonCodeEditor = ({ value = '', onChange = () => { }, currentLineNumber = null }) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationIdsRef = useRef([]);
  const [editorReady, setEditorReady] = useState(false); 

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorReady(true);

    monaco.languages.registerCompletionItemProvider('python', {
      provideCompletionItems: () => ({
        suggestions: [
          {
            label: 'def',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'def ${1:name}(${2:args}):\n\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Function definition',
          },
          {
            label: 'class',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'class ${1:Name}:\n\tdef __init__(self):\n\t\t${2:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Class definition',
          },
          {
            label: 'for',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'For loop',
          },
          {
            label: 'while',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'while ${1:condition}:\n\t${2:pass}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'While loop',
          },
        ]
      })
    });
  };

  useEffect(() => {
    console.log('Decoration effect triggered, currentLineNumber:', currentLineNumber);
    
    if (!editorRef.current || currentLineNumber === null) {
      
      if (decorationIdsRef.current.length > 0) {
        console.log('Clearing decorations');
        decorationIdsRef.current = editorRef.current?.deltaDecorations(decorationIdsRef.current, []) || [];
      }
      return;
    }

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    
    if (!editor || !monaco) {
      console.warn('Editor or Monaco not available', { editor: !!editor, monaco: !!monaco });
      return;
    }

    try {
      console.log('Setting decoration for line:', currentLineNumber);
      const newDecorations = [
        {
          range: new monaco.Range(currentLineNumber, 1, currentLineNumber, 999999),
          options: {
            isWholeLine: true,
            className: 'highlighted-line',
            glyphMarginClassName: 'codicon codicon-debug-breakpoint',
            glyphMarginHoverMessage: { value: 'Current snapshot line' },
          },
        },
      ];

      const oldIds = decorationIdsRef.current;
      decorationIdsRef.current = editor.deltaDecorations(oldIds, newDecorations);
      console.log('Decorations updated, old IDs:', oldIds, 'new IDs:', decorationIdsRef.current);
    } catch (e) {
      console.error('Error setting line decoration:', e);
    }
  }, [currentLineNumber, editorReady]);

  return (
    <MonacoEditor
      height="100%"
      language="python"
      value={value}
      onChange={(newValue) => onChange(newValue || '')}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        automaticLayout: true,
        fontFamily: 'Consolas, Monaco, "Courier New"',
        fontSize: 14,
        lineNumbers: "on",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        tabSize: 4,
        insertSpaces: true,
        quickSuggestions: { other: true, comments: false, strings: true},
        suggestOnTriggerCharacters: true,
        acceptSuggestionOnEnter: "on",
        tabCompletion: "on",
        parameterHints: { enabled: true},
        suggest: {
          showKeywords: true,
          showSnippets: true,
          showClasses: true,
          showFunctions: true,
          showVariables: true,
          showModules: true,
        },
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        autoIndent: "full",
        formatOnType: true,
        renderLineHighlight: "all",
      }}
    />
  );
};

export default PythonCodeEditor;
