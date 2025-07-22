// DslEditor.js
import React, { useRef, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import { registerCustomLanguage } from "./customLang";
import { loader } from "@monaco-editor/react";
import { useParseCompile } from "../context/ParseCompileContext";

const DslEditor = ({ value = "", onChange = () => {}, readOnly = false }) => {
  const editorRef = useRef(null);
  const { updateCursorLine } = useParseCompile();
  
  loader.init().then((monaco) => {
    registerCustomLanguage(monaco);
  });

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    
    // Initialize error state manager with this editor instance
    if (window.errorStateManager) {
      window.errorStateManager.init(monaco, editor);
    }
    
    // Track cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      updateCursorLine(e.position.lineNumber);
    });
    
    // Track cursor position on initial load
    const position = editor.getPosition();
    if (position) {
      updateCursorLine(position.lineNumber);
    }
  }, [updateCursorLine]);

  return (
    <MonacoEditor
      height="100%"
      language="customLang"
      value={value}
      onChange={(newValue) => onChange(newValue)}
      onMount={handleEditorDidMount}
      theme="customTheme"
      options={{
        automaticLayout: true,
        fontFamily: "Consolas",
        fontSize: 15,
        lineNumbers: "on",
        minimap: { enabled: false },
        readOnly: readOnly,
        suggest: {
          snippetsPreventQuickSuggestions: false,
          localityBonus: true,
          showWords: true,
          showSnippets: true,
          showStatusBar: true,
          showInlineDetails: true,
          shareSuggestSelections: false,
          filterGraceful: true,
          placement: 'top'  // Force placement to top/bottom only, never left/right
        },
      }}
    />
  );
};

export default DslEditor;
