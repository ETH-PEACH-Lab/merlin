import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const PythonCodeEditor = ({ value = '', onChange = () => { } }) => {

  const handleMount = (editor, monaco) => {
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
