// DslEditor.js
import React, { useRef, useEffect, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import { registerCustomLanguage } from "./customLang";
import { loader } from "@monaco-editor/react";
import { useParseCompile } from "../context/ParseCompileContext";


const DslEditor = ({ value = "", onChange = () => {}, readOnly = false, setCurrentPage, currentPage, pages}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const { updateCursorLine } = useParseCompile();
  
  loader.init().then((monaco) => {
    registerCustomLanguage(monaco);
    monacoRef.current = monaco;
  });

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    // Handle clicks on "page" commands to change current page
    editor.onMouseDown((e) => {
      const pos = e.target.position;
      if (!pos) return;
      const model = editor.getModel();
      const lineNum = pos.lineNumber;
      const lineText = model.getLineContent(lineNum);
      if (/^\s*page\b/.test(lineText)) {
        const lines = model.getValue().split("\n");
        let pageCount = 0;
        for (let i = 0; i < lineNum; i++) {
          if (/^\s*page\b/.test(lines[i])) pageCount++;
        }
        setCurrentPage(pageCount);
      }
    });
    
    // Initialize error state manager with this editor instance
    if (window.errorStateManager) {
      window.errorStateManager.init(monaco, editor);
    }
    
    // Track cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      updateCursorLine(e.position.lineNumber);
    });

    // Replace Enter/Tab overrides with a keydown listener that preserves default actions
    editor.onKeyDown((e) => {
      if (e.keyCode === monaco.KeyCode.Enter || e.keyCode === monaco.KeyCode.Tab || e.keyCode === monaco.KeyCode.Backspace) {
        setTimeout(() => {
          const model = editor.getModel();
          const position = editor.getPosition();
          if (!model || !position) return;
          const offset = model.getOffsetAt(position);
          const text = model.getValue().substring(0, offset);
          let curlDepth = 0;
          let bracketsDepth = 0;
          let beforeCursor = text.slice(0, offset).trim();
          for (let i = 0; i < beforeCursor.length; i++) {
            if (beforeCursor[i] === '{') curlDepth++;
            else if (beforeCursor[i] === '}') curlDepth--;
            else if (beforeCursor[i] === '(') bracketsDepth++;
            else if (beforeCursor[i] === ')') bracketsDepth--;
          }
          if (curlDepth > 0 && e.keyCode === monaco.KeyCode.Enter) {
            // Trigger in definition body on enter
            editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
          } else if (bracketsDepth > 0 && (e.keyCode === monaco.KeyCode.Tab || e.keyCode === monaco.KeyCode.Backspace)) {
            // Trigger in methods completion on tab
            editor.trigger('keyboard', 'editor.action.triggerSuggest', {});
          }
        }, 0);
      }
    });

    // Track cursor position on initial load
    const position = editor.getPosition();
    if (position) {
      updateCursorLine(position.lineNumber);
    }
  }, [updateCursorLine]);

  // Decorate page commands, highlighting current page in bold
  const decorationIds = useRef([]);
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    const model = editor.getModel();
    const lines = model.getValue().split("\n");
    let pageCount = 0;
    const newDecorations = [];
    lines.forEach((line, idx) => {
      if (/^\s*page\b/.test(line)) {
        pageCount += 1;
        const col = line.indexOf('page') + 1;
        const isCurrent = pageCount === currentPage;
        newDecorations.push({
          range: new monaco.Range(idx+1, col, idx+1, col+4),
          options: { inlineClassName: isCurrent ? 'currentPageKeyword' : 'pageKeyword' }
        });
      }
    });
    decorationIds.current = editor.deltaDecorations(decorationIds.current, newDecorations);
  }, [value, currentPage, pages]);

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
