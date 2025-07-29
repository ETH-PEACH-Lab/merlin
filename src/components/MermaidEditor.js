// MermaidEditor.js
import React from 'react';
import MonacoEditor from '@monaco-editor/react';
import { registerCustomLanguage } from './customLang';
import { loader } from "@monaco-editor/react"


const MermaidEditor = ({value = '', onChange= ()=>{}}) => {
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
        fontSize: 14, 
        lineNumbers: "on",
        minimap: { enabled: false },
        readOnly: true,
        inlineSuggest: {
          enabled: true
        }
      }}
    />

  );
};

export default MermaidEditor;
