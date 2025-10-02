// DslEditor.js
import React, { useRef, useEffect, useCallback } from "react";
import MonacoEditor from "@monaco-editor/react";
import { registerCustomLanguage } from "./customLang";
import { loader } from "@monaco-editor/react";
import { useParseCompile } from "../context/ParseCompileContext";


const DslEditor = ({
  value = "",
  onChange = () => {},
  readOnly = false,
  currentPage = 0,
  setCurrentPage = () => {},
  pages = []
}) => {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const previousPageCountRef = useRef(0);
  const previousValueRef = useRef("");
  const lastChangeFromEditorRef = useRef(false);
  const isTypingRef = useRef(false);
  const currentPageRef = useRef(currentPage);
  const { updateCursorLine } = useParseCompile();
  
  // Keep currentPageRef in sync with currentPage prop
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  
  // Utility function to count page commands in text
  const countPageCommands = useCallback((text) => {
    if (!text) return 0;
    const lines = text.split("\n");
    return lines.filter(line => /^\s*page\b/.test(line)).length;
  }, []);
  
  loader.init().then((monaco) => {
    registerCustomLanguage(monaco);
    monacoRef.current = monaco;
  });

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    const study = (function(){ try { return require('../study/StudyContext'); } catch { return null; } })();
    
    // Handle clicks on "page" commands specifically to change current page
    editor.onMouseDown((e) => {
      const pos = e.target.position;
      if (!pos) return;
      
      const model = editor.getModel();
      const lineNum = pos.lineNumber;
      const lineText = model.getLineContent(lineNum);
      
      // Only handle clicks specifically on "page" commands
      if (/^\s*page\b/.test(lineText)) {
        const lines = model.getValue().split("\n");
        let pageCount = 0;
        for (let i = 0; i < lineNum; i++) {
          if (/^\s*page\b/.test(lines[i])) pageCount++;
        }
        // If clicking on a page command, navigate to that page
        setCurrentPage(pageCount);
      }
    });
    
    // Initialize error state manager with this editor instance
    if (window.errorStateManager) {
      window.errorStateManager.init(monaco, editor);
    }

    // Detect application of quick fixes by comparing model changes with pending quick fix edits
    editor.onDidChangeModelContent((e) => {
      try {
        const logEvent = getLogEvent && getLogEvent();
        if (!logEvent || !window.__pendingQuickFixes) return;
        const model = editor.getModel();
        if (!model) return;
        const uriKey = model.uri.toString();
        const pending = window.__pendingQuickFixes[uriKey];
        if (!pending || !pending.actions || !pending.actions.length) return;
        // Build a simplified change signature
        const changes = e.changes.map(c => ({
          range: {
            startLineNumber: c.range.startLineNumber,
            startColumn: c.range.startColumn,
            endLineNumber: c.range.endLineNumber,
            endColumn: c.range.endColumn,
          },
          text: c.text
        }));
        const matchIdx = pending.actions.findIndex(act => {
          if (!act.edits || act.edits.length !== changes.length) return false;
          // Every edit must match a change 1:1 ignoring order (usually length 1)
          return act.edits.every(ed => changes.some(ch =>
            ch.text === ed.text &&
            ch.range.startLineNumber === ed.range.startLineNumber &&
            ch.range.startColumn === ed.range.startColumn &&
            ch.range.endLineNumber === ed.range.endLineNumber &&
            ch.range.endColumn === ed.range.endColumn
          ));
        });
        if (matchIdx >= 0) {
          const applied = pending.actions[matchIdx];
          logEvent('quickfix_applied', {
            editor: 'merlin',
            title: applied.title,
            fixKind: applied.kind,
            editCount: applied.edits.length,
          });
          // Remove matched action to avoid duplicate logs
          pending.actions.splice(matchIdx, 1);
        }
      } catch {}
    });

    // Copy & paste logging and suggestion/hover/quick-fix usage (study only)
    const isInStudy = () => {
      try {
        const ctx = require('../study/StudyContext');
        return true;
      } catch { return false; }
    };
    const getLogEvent = () => window.__studyLogEvent;

    editor.onKeyDown((e) => {
      const logEvent = getLogEvent();
      if (!logEvent) return;
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (mod && e.keyCode === monaco.KeyCode.KeyC) {
        const selLen = editor.getModel()?.getValueInRange(editor.getSelection()).length || 0;
        logEvent('editor_copy', { editor: 'merlin', selectionLen: selLen });
      }
      if (mod && e.keyCode === monaco.KeyCode.KeyV) {
        logEvent('editor_paste', { editor: 'merlin' });
      }
    });

    // Suggest acceptance logging without intercepting default behavior
    const logSuggestIfVisible = (method) => {
      const logEvent = getLogEvent();
      if (!logEvent) return;
      
      // Check if suggest widget is visible
      const suggestWidget = editor.getContribution('editor.contrib.suggestController');
      if (suggestWidget && suggestWidget.model && suggestWidget.model.state === 2) {
        logEvent('suggest_accept', { editor: 'merlin', method });

      }
    };
    // Quick fix execution
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.F8, () => {
      const logEvent = getLogEvent();
      if (!logEvent) return;
      logEvent('quickfix_invoked', { editor: 'merlin' });
      
    });

    // Hover link clicks
    editor.onMouseDown((e) => {
      if (!e.target || !e.target.element) return;
      const a = e.target.element.querySelector('a');
      if (!a || !a.href) return;
      const logEvent = getLogEvent();
      if (!logEvent) return;
      logEvent('hover_link_open', { editor: 'merlin', href: a.href });
      
    });
    // Hover link click logging via DOM capture (monaco renders markdown links)
    const hoverListener = (ev) => {
      const logEvent = getLogEvent();
      if (!logEvent) return;
      const target = ev.target;
      if (target && target.closest && target.closest('.monaco-hover')) {
        const a = target.closest('a');
        if (a && a.href) {
          logEvent('hover_link_open', { editor: 'merlin', href: a.href });
        }
      }
    };
    window.addEventListener('click', hoverListener, true);
    editor.onDidDispose(() => window.removeEventListener('click', hoverListener, true));
    
    // Track cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      updateCursorLine(e.position.lineNumber);
      
      // Only auto-navigate if the user is actively typing, not just clicking/navigating
      if (isTypingRef.current) {
        // Auto-navigate to the page containing the cursor
        const model = editor.getModel();
        if (model) {
          const lines = model.getValue().split("\n");
          let pageCount = 0;
          
          // Count pages up to (but not including) the cursor position
          for (let i = 0; i < e.position.lineNumber - 1; i++) {
            if (/^\s*page\b/.test(lines[i])) {
              pageCount++;
            }
          }

          // The current page is the number of pages before the cursor (0-indexed)
          const currentPageForCursor = pageCount;
          
          // Only update if it's different from current page to avoid unnecessary updates
          if (currentPageForCursor !== currentPageRef.current) {
            setCurrentPage(currentPageForCursor);
          }
        }
        
        // Reset the typing flag after processing
        isTypingRef.current = false;
      }
    });

    // Detect when user is actually typing (not just navigating)
    editor.onKeyDown((e) => {
      // Mark as typing for keys that actually modify content or move cursor due to typing
      const isContentKey = 
        (e.keyCode >= 48 && e.keyCode <= 57) ||  // Numbers
        (e.keyCode >= 65 && e.keyCode <= 90) ||  // Letters
        e.keyCode === monaco.KeyCode.Space ||
        e.keyCode === monaco.KeyCode.Enter ||
        e.keyCode === monaco.KeyCode.Backspace ||
        e.keyCode === monaco.KeyCode.Delete ||
        (e.keyCode >= 186 && e.keyCode <= 222); // Symbols/punctuation
      
      if (isContentKey) {
        isTypingRef.current = true;
        // Update global typing timestamp for error logging
        window.__lastKeyPress = Date.now();
      }

      // Log suggestion acceptance without intercepting default behavior
      if (e.keyCode === monaco.KeyCode.Enter) {
        logSuggestIfVisible('Enter');
      } else if (e.keyCode === monaco.KeyCode.Tab) {
        logSuggestIfVisible('Tab');
      }
      
      // Detect copy/paste
      if (e.ctrlKey || e.metaKey) {
        if (e.keyCode === 67) { // Ctrl+C
          const logEvent = getLogEvent();
          if (logEvent) {
            logEvent('copy_code', { editor: 'merlin' });
            
          }
        } else if (e.keyCode === 86) { // Ctrl+V
          const logEvent = getLogEvent();
          if (logEvent) {
            logEvent('paste_code', { editor: 'merlin' });
            
          }
        }
      }

      // Handle autocomplete triggers
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
  }, [updateCursorLine, setCurrentPage]);

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

  // Effect to detect when new page commands are added and auto-navigate
  useEffect(() => {
    const currentPageCount = countPageCommands(value);
    
    // Only auto-navigate if the change came from the editor and a new page was added
    if (currentPageCount > previousPageCountRef.current && lastChangeFromEditorRef.current) {
      // Find where the new page command was added by comparing with previous value
      const currentLines = value.split("\n");
      const previousLines = previousValueRef.current.split("\n");
      
      let targetPage = 1;
      let pageCount = 0;
      
      // Find the first line where a new page command appeared
      for (let i = 0; i < currentLines.length; i++) {
        const currentLineIsPage = /^\s*page\b/.test(currentLines[i]);
        const previousLineIsPage = i < previousLines.length && /^\s*page\b/.test(previousLines[i]);
        
        // If this line has a page command
        if (currentLineIsPage) {
          pageCount++;
          
          // If this is a new page command (either new line or line changed to page)
          if (!previousLineIsPage || i >= previousLines.length) {
            targetPage = pageCount;
            break;
          }
        }
      }
      
      setCurrentPage(targetPage);
    }
    
    // Reset the flag and update the previous values
    lastChangeFromEditorRef.current = false;
    previousPageCountRef.current = currentPageCount;
    previousValueRef.current = value;
  }, [value, countPageCommands, setCurrentPage]);

  // Reset the editor change flag when value changes from external sources
  useEffect(() => {
    // If the value changed but we didn't mark it as from editor, 
    // ensure the flag is reset for the next change
    if (value !== previousValueRef.current && !lastChangeFromEditorRef.current) {
      lastChangeFromEditorRef.current = false;
    }
  }, [value]);

  return (
  <MonacoEditor
      height="100%"
      language="customLang"
      value={value}
      onChange={(newValue) => {
        // Mark that this change came from the editor
        lastChangeFromEditorRef.current = true;
        onChange(newValue);
      }}
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
