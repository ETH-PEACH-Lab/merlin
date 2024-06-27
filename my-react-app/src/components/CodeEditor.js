// CodeEditor.js
import React, { useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { registerCustomLanguage } from './customLang';

const CodeEditor = ({ value = '', onChange = () => {} }) => {
  useEffect(() => {
    registerCustomLanguage();
  }, []);

  return (
    <MonacoEditor
      height="100%"
      language="customLang"
      value={value}
      onChange={(newValue) => onChange(newValue)}
      theme="vs-dark"
      options={{
        automaticLayout: true,
        fontFamily: 'Consolas',
        fontSize: 14, 
        lineNumbers: "on",
        minimap: { enabled: false },
      }}
    />
  );
};

export default CodeEditor;
