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
  pages = [],
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
    return lines.filter((line) => /^\s*page\b/.test(line)).length;
  }, []);

  useEffect(() => {
    let mounted = true;

    loader.init().then((monaco) => {
      if (!mounted) return;
      registerCustomLanguage(monaco);
      monacoRef.current = monaco;
    });

    return () => {
      mounted = false;
    };
  }, []);

  const handleEditorDidMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

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

      editor.onDidChangeCursorPosition((e) => {
        updateCursorLine(e.position.lineNumber);

        const model = editor.getModel();

        if (model) {
          // Show suggestions after comma + Enter
          const lineNumber = e.position.lineNumber;
          if (lineNumber > 1) {
            const currentLine = model.getLineContent(lineNumber);
            const prevLine = model.getLineContent(lineNumber - 1);

            const isCurrentLineBlank = /^\s*$/.test(currentLine);
            const prevEndsWithComma = /,\s*$/.test(prevLine);

            if (isCurrentLineBlank && prevEndsWithComma) {
              editor.trigger("merlin", "editor.action.triggerSuggest", {});
            }
          }
        }

        // Only auto-navigate if the user is actively typing, not just clicking/navigating
        if (isTypingRef.current) {
          // Auto-navigate to the page containing the cursor
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
      editor.onDidChangeModelContent((event) => {
        const model = editor.getModel();
        const position = editor.getPosition();
        if (!model || !position) return;

        const newValue = model.getValue();

        lastChangeFromEditorRef.current = true;
        onChange(newValue);

        const linePrefix = model
          .getLineContent(position.lineNumber)
          .slice(0, position.column - 1);
      });
      editor.onDidChangeModelContent((event) => {
        const model = editor.getModel();
        const position = editor.getPosition();
        if (!model || !position) return;

        const linePrefix = model
          .getLineContent(position.lineNumber)
          .slice(0, position.column - 1);

        const prevLine =
          position.lineNumber > 1
            ? model.getLineContent(position.lineNumber - 1)
            : "";

        const insertedCommaSameLine = event.changes.some(
          (change) =>
            change.text === "," &&
            /^[ \t]*[a-zA-Z_][a-zA-Z0-9_.]*\s*:\s*.+,$/.test(linePrefix),
        );

        if (insertedCommaSameLine) {
          setTimeout(() => {
            editor.trigger("merlin", "hideSuggestWidget", {});
          }, 0);
          return;
        }

        const deletedSomething = event.changes.some(
          (change) => change.text === "" && change.rangeLength > 0,
        );

        const insertedSpaceAfterComma = event.changes.some(
          (change) => change.text === " " && /,\s*$/.test(linePrefix),
        );

        const insertedNewlineAfterComma = event.changes.some((change) => {
          const insertedNewLine = change.text.includes("\n");
          const currentLineBlank = /^\s*$/.test(linePrefix);
          const prevEndedWithComma = /,\s*$/.test(prevLine);
          return insertedNewLine && currentLineBlank && prevEndedWithComma;
        });

        const shouldTriggerSuggestForProps =
          /\b(label\.orientation|type|style|layout|stroke|color|arrowheads)\s*:\s*$/.test(
            linePrefix,
          ) ||
          /\bmembers\s*:\s*\[\s*$/.test(linePrefix) ||
          /\banchor\s*:\s*$/.test(linePrefix);

        const shouldTriggerSuggestForGroupMembers =
          /\bmembers\s*:\s*\[\s*$/.test(linePrefix);

        const shouldTriggerSuggestForGroupAnchor =
          /\banchor\s*:\s*[a-zA-Z_0-9]*$/.test(linePrefix);

        const shouldTriggerSuggestAfterArchitectureComma =
          insertedSpaceAfterComma || insertedNewlineAfterComma;

        if (
          shouldTriggerSuggestForProps ||
          shouldTriggerSuggestAfterArchitectureComma ||
          (deletedSomething &&
            (shouldTriggerSuggestForGroupMembers ||
              shouldTriggerSuggestForGroupAnchor))
        ) {
          setTimeout(() => {
            editor.trigger("merlin", "editor.action.triggerSuggest", {});
          }, 0);
        }
      });
      // Detect when user is actually typing (not just navigating)
      editor.onKeyDown((e) => {
        // Mark as typing for keys that actually modify content or move cursor due to typing
        const isContentKey =
          (e.keyCode >= 48 && e.keyCode <= 57) || // Numbers
          (e.keyCode >= 65 && e.keyCode <= 90) || // Letters
          e.keyCode === monaco.KeyCode.Space ||
          e.keyCode === monaco.KeyCode.Enter ||
          e.keyCode === monaco.KeyCode.Backspace ||
          e.keyCode === monaco.KeyCode.Delete ||
          (e.keyCode >= 186 && e.keyCode <= 222); // Symbols/punctuation

        if (isContentKey) {
          isTypingRef.current = true;
        }

        // Handle autocomplete triggers
        if (
          e.keyCode === monaco.KeyCode.Enter ||
          e.keyCode === monaco.KeyCode.Tab ||
          e.keyCode === monaco.KeyCode.Backspace ||
          e.keyCode === monaco.KeyCode.Delete
        ) {
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
              if (beforeCursor[i] === "{") curlDepth++;
              else if (beforeCursor[i] === "}") curlDepth--;
              else if (beforeCursor[i] === "(") bracketsDepth++;
              else if (beforeCursor[i] === ")") bracketsDepth--;
            }
            if (curlDepth > 0 && e.keyCode === monaco.KeyCode.Enter) {
              // Trigger in definition body on enter
              editor.trigger("keyboard", "editor.action.triggerSuggest", {});
            } else if (
              bracketsDepth > 0 &&
              (e.keyCode === monaco.KeyCode.Tab ||
                e.keyCode === monaco.KeyCode.Backspace)
            ) {
              // Trigger in methods completion on tab
              editor.trigger("keyboard", "editor.action.triggerSuggest", {});
            }

            const linePrefix = model
              .getLineContent(position.lineNumber)
              .slice(0, position.column - 1);

            if (/\bmembers\s*:\s*\[\s*$/.test(linePrefix)) {
              editor.trigger("keyboard", "editor.action.triggerSuggest", {});
              return;
            }

            if (/\banchor\s*:\s*[a-zA-Z_0-9]*$/.test(linePrefix)) {
              editor.trigger("keyboard", "editor.action.triggerSuggest", {});
              return;
            }
          }, 0);
        }
      });

      // Track cursor position on initial load
      const position = editor.getPosition();
      if (position) {
        updateCursorLine(position.lineNumber);
      }
    },
    [updateCursorLine, setCurrentPage],
  );

  // Decorate page commands, highlighting current page in bold
  const decorationIds = useRef([]);
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.getModel();
    if (!model) return;

    const editorValue = model.getValue();

    // do nothing if the editor already has this text
    if (editorValue === value) return;

    // if this change came from typing inside Monaco, don't push it back in
    if (lastChangeFromEditorRef.current) {
      lastChangeFromEditorRef.current = false;
      return;
    }

    const selection = editor.getSelection();
    const scrollTop = editor.getScrollTop();
    const scrollLeft = editor.getScrollLeft();

    editor.executeEdits("external-update", [
      {
        range: model.getFullModelRange(),
        text: value ?? "",
      },
    ]);

    if (selection) editor.setSelection(selection);
    editor.setScrollTop(scrollTop);
    editor.setScrollLeft(scrollLeft);
  }, [value]);

  // Effect to detect when new page commands are added and auto-navigate
  useEffect(() => {
    const currentPageCount = countPageCommands(value);

    // Only auto-navigate if the change came from the editor and a new page was added
    if (
      currentPageCount > previousPageCountRef.current &&
      lastChangeFromEditorRef.current
    ) {
      // Find where the new page command was added by comparing with previous value
      const currentLines = value.split("\n");
      const previousLines = previousValueRef.current.split("\n");

      let targetPage = 1;
      let pageCount = 0;

      // Find the first line where a new page command appeared
      for (let i = 0; i < currentLines.length; i++) {
        const currentLineIsPage = /^\s*page\b/.test(currentLines[i]);
        const previousLineIsPage =
          i < previousLines.length && /^\s*page\b/.test(previousLines[i]);

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
    if (
      value !== previousValueRef.current &&
      !lastChangeFromEditorRef.current
    ) {
      lastChangeFromEditorRef.current = false;
    }
  }, [value]);

  return (
    <MonacoEditor
      height="100%"
      language="customLang"
      defaultValue={value}
      onMount={handleEditorDidMount}
      theme="customTheme"
      options={{
        automaticLayout: true,
        fontFamily: "Consolas",
        fontSize: 15,
        lineNumbers: "on",
        minimap: { enabled: false },
        readOnly,
        suggest: {
          snippetsPreventQuickSuggestions: false,
          localityBonus: true,
          showWords: false,
          showSnippets: true,
          showStatusBar: true,
          showInlineDetails: true,
          shareSuggestSelections: false,
          filterGraceful: true,
          placement: "top",
        },
      }}
    />
  );
};

export default DslEditor;
