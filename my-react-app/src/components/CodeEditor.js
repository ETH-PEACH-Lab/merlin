// src/components/CodeEditor.js
import React from 'react';
import MonacoEditor from '@monaco-editor/react';

const CodeEditor = ({ value = '', onChange = () => {} }) => {
  return (
    <MonacoEditor
      height="100%"
      language="javascript"
      value={value}
      onChange={(newValue) => onChange(newValue)}
      theme="vs-dark"
      options={{ automaticLayout: true }}
    />
  );
};

export default CodeEditor;
