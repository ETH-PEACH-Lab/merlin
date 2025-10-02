// CodeEditor.js
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { registerCustomLanguage } from './customLang';
import { loader } from "@monaco-editor/react"


const CodeEditor = ({value = '', onChange= ()=>{}, fontSize = 18}) => {
  loader.init().then((monaco) => {
    registerCustomLanguage(monaco)
  })

  return (
    <MonacoEditor
      height="100%"
      language="customLang"
      value={value}
      onChange={(newValue) => onChange(newValue)}
      theme="customTheme"
      options={{
        automaticLayout: true,
        fontFamily: 'Consolas',
        fontSize: fontSize,
        lineNumbers: "on",
        minimap: { enabled: false },
      }}
    />

  );
};

export default CodeEditor;
