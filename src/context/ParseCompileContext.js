import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";
import parseText from "../parser/parseText.mjs";
import reconstructor from "../parser/reconstructor.mjs";
import compiler from "../compiler/compiler.mjs";
import { createOptimizedCommand, findRelevantCommands } from "../parser/commandUtils.mjs";

const ParseCompileContext = createContext();

export function ParseCompileProvider({ children, initialCode = "" }) {
    const [unparsedCode, setUnparsedCode] = useState(initialCode);
    const [parsedCode, setParsedCode] = useState(null);
    const [compiledMerlin, setCompiledMerlin] = useState(null);
    const [pages, setPages] = useState([]);
    const [componentCount, setcomponentCount] = useState(1);
    const [nodeCount, setNodeCount] = useState(1);
    const [error, setError] = useState(null);
    const [currentCursorLine, setCurrentCursorLine] = useState(1);
    const [errorTimeoutId, setErrorTimeoutId] = useState(null);

    // Set a delay, will wait specified milliseconds before showing an error on current line
    const DELAY = 1000; 

    // Parse and compile with smart error handling
    const parseAndCompile = useCallback((code, skipCurrentLine = false, currentLine = 1) => {
        // Clear any existing error timeout
        if (errorTimeoutId) {
            clearTimeout(errorTimeoutId);
            setErrorTimeoutId(null);
        }

        let codeToProcess = code;
        const codeLines = code.split('\n');
        const totalLines = codeLines.length;
        const validCurrentLine = Math.max(1, Math.min(currentLine, totalLines));
        
        // If skipCurrentLine is true, remove the current line from processing
        if (skipCurrentLine && validCurrentLine <= totalLines) {
            codeLines[validCurrentLine - 1] = ''; // Replace current line with empty string
            codeToProcess = codeLines.join('\n');
        }

        setError(null);
        
        // Clear Monaco editor errors
        if (window.errorStateManager) {
            window.errorStateManager.clearErrors();
        }

        let parsed = null;
        try {
            parsed = parseText(codeToProcess);
            setParsedCode(parsed);
        } catch (e) {
            // Current workaround for parse errors
            // Due to lexer moo not correctly outputting line numbers
            // Instead of using e.line and e.col, we parse for:
            //  "Syntax error at line x col y"
            // See issue here: https://github.com/no-context/moo/issues/183
            const errorMessage = `Parse error: ` + (e.message || e);

            // Uncomment line if moo issue is fixed and updated, please verify if line numbers are correct
            // const errorLine = Math.max(1, Math.min(e.line || validCurrentLine, totalLines));
            
            // WORKAROUND: Get the line number from the error message
            // Example: "Syntax error at line 3 col 5"
            const match = errorMessage.match(/line (\d+)/);
            const errorLine = match ? parseInt(match[1], 10) : validCurrentLine;
            const errorColMatch = errorMessage.match(/col (\d+)/);
            const errorCol = errorColMatch ? parseInt(errorColMatch[1], 10) : 1;
            // End of workaround

            const errorObj = {
                line: errorLine,
                col: errorCol,
                message: errorMessage
            };
            
            // If this is the first attempt and error is on current line, try without current line
            if (!skipCurrentLine && errorLine === validCurrentLine) {
                try {
                    const testParsed = parseText(codeToProcess.split('\n').map((line, index) => 
                        index === validCurrentLine - 1 ? '' : line
                    ).join('\n'));
                    
                    // If it parses successfully without the current line, delay the error
                    const timeoutId = setTimeout(() => {
                        setError(errorMessage);
                        if (window.errorStateManager) {
                            window.errorStateManager.setError(errorObj);
                        }
                        setErrorTimeoutId(null);
                    }, DELAY);
                    setErrorTimeoutId(timeoutId);
                    
                    // Continue with the parsed version without current line for now
                    setParsedCode(testParsed);
                    parsed = testParsed;
                } catch (secondError) {
                    // If it still fails, show error immediately
                    setParsedCode(null);
                    setError(errorMessage);
                    if (window.errorStateManager) {
                        window.errorStateManager.setError(errorObj);
                    }
                    return;
                }
            } else {
                // Error is not on current line, show immediately
                setParsedCode(null);    
                setError(errorMessage);
                if (window.errorStateManager) {
                    window.errorStateManager.setError(errorObj);
                }
                return;
            }
        }

        try {
            const { mermaidString, compiled_pages } = compiler(parsed);
            setCompiledMerlin(mermaidString);
            setPages(compiled_pages);
        } catch (e) {
            const errorMessage = e.line && e.col ? 
                `Compile error on line ${e.line}, col ${e.col}:\n${e.message || e}` :
                `Compile error:\n${e.message || e}`;
            
            const errorLine = Math.max(1, Math.min(e.line || validCurrentLine, totalLines));
            
            const errorObj = {
                line: errorLine,
                col: e.col || 1,
                message: errorMessage
            };
            
            // Apply same logic for compile errors
            if (!skipCurrentLine && errorLine === validCurrentLine) {
                try {
                    // Test without current line
                    const testCode = code.split('\n').map((line, index) => 
                        index === validCurrentLine - 1 ? '' : line
                    ).join('\n');
                    
                    const testParsed = parseText(testCode);
                    const testCompiled = compiler(testParsed);
                    
                    // If it compiles successfully without the current line, delay the error
                    const timeoutId = setTimeout(() => {
                        setError(errorMessage);
                        if (window.errorStateManager) {
                            window.errorStateManager.setError(errorObj);
                        }
                        setErrorTimeoutId(null);
                    }, 3000);
                    setErrorTimeoutId(timeoutId);
                    
                    // Use the working version for now
                    setCompiledMerlin(testCompiled.mermaidString);
                    setPages(testCompiled.compiled_pages);
                } catch (secondError) {
                    // If it still fails, show error immediately
                    setError(errorMessage);
                    if (window.errorStateManager) {
                        window.errorStateManager.setError(errorObj);
                    }
                }
            } else {
                // Error is not on current line, show immediately
                setError(errorMessage);
                if (window.errorStateManager) {
                    window.errorStateManager.setError(errorObj);
                }
            }
        }
    }, [errorTimeoutId]);

    // Update unparsed code and trigger parse/compile
    const updateUnparsedCode = useCallback(
        (newCode) => {
            setUnparsedCode(newCode);
            parseAndCompile(newCode, false, currentCursorLine);
        },
        [parseAndCompile, currentCursorLine]
    );

    // Update cursor line (called from Monaco editor)
    const updateCursorLine = useCallback((line) => {
        setCurrentCursorLine(line);
    }, []);

    // Reconstruct MerlinLite code from parsed version
    const reconstructMerlinLite = useCallback(() => {
        if (!parsedCode) return null;
        try {
            const reconstructed = reconstructor(parsedCode);
            setUnparsedCode(reconstructed);
            parseAndCompile(reconstructed, false, currentCursorLine);
            return reconstructed;
        } catch (e) {
            setError("Reconstruction error: " + (e.message || e));
            return null;
        }
    }, [parsedCode, parseAndCompile, currentCursorLine]);  

    // Find the start and end indices of the specified page
    const findPageBeginningAndEnd = (pageNumber) => {
        if (!parsedCode) return;
        let pageStartIndex = -1;
        let pageEndIndex = parsedCode.cmds.length;
        let currentPage = 0;
        
        for (let i = 0; i < parsedCode?.cmds.length; i++) {
            if (parsedCode.cmds[i].type === "page") {
                if (currentPage === pageNumber) {
                    pageStartIndex = i + 1;
                } else if (currentPage === pageNumber + 1) {
                    pageEndIndex = i;
                    break;
                }
                currentPage++;
            }
        }
        
        if (pageStartIndex === -1) {
            console.error(`Page ${pageNumber} not found`);
            return;
        }
        return [pageStartIndex, pageEndIndex];
    };

    // Add a new unit
    const addUnit = useCallback((page, component, type, coordinates, node, val) => {
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
        // For new tree nodes, directly add them as a child
        if (type === "tree"){
            const nodeName = "n" + `${ nodeCount }`;
            setNodeCount(nodeCount + 1);
            const args = {index: {start: node, end: nodeName}, value: val}
            parsedCode.cmds.splice(pageEndIndex, 0, { name: component, target: "nodes", type: "add_child", args: args});
        } 
        // For graphs add a new node
        else if (type === "graph"){
            const nodeName = "n" + `${ nodeCount }`;
            setNodeCount(nodeCount + 1);
            const args = {index: nodeName, value: val}
            parsedCode.cmds.splice(pageEndIndex, 0, { name: component, target: "nodes", type: "add", args: args});
        }
        else if (type === "linkedlist"){
            const nodeName = "n" + `${ nodeCount }`;
            setNodeCount(nodeCount + 1);
            const args = {index: coordinates.index + 1, value: nodeName, nodeValue: val}
            parsedCode.cmds.splice(pageEndIndex, 0, { name: component, target: "nodes", type: "insert", args: args});
        }
        // For stacks and arrays insert a new value
        else {
            const idx = (type === "stack") ? coordinates.index : coordinates.index + 1;
            const args = {index: idx, value: val};
            parsedCode.cmds.splice(pageEndIndex, 0, { name: component, target: "value", type: "insert", args: args});
        }
        reconstructMerlinLite();
    }, [parsedCode]);

    // Remove the selected unit
    const removeUnit = useCallback((page, component, type, coordinates, node, isSubTree) => {
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
        // For trees, remove the entire subtree
        if (type === "tree"){
            const removeType = isSubTree ? "remove_subtree" : "remove";
            parsedCode.cmds.splice(pageEndIndex, 0, { name: component, target: "nodes", type: removeType, args: node });
        } 
        //For stacks, arrays, graphs and linkedlists remove the node
        else {
            parsedCode.cmds.splice(pageEndIndex, 0, { name: component, target: "all", type: "remove_at", args: coordinates.index });
        }
        reconstructMerlinLite();
    }, [parsedCode]);

    const updateValue = useCallback(
        (page, componentName, coordinates, fieldKey, value) => {
            if (!parsedCode) return;
            
            // Handle position field updates (no coordinates needed)
            if (fieldKey === "position") {
                // No need to check current value for position fields - they're simple replacements
            } else {
                // Check if the value is already set to the same value for array/matrix fields
                const currentComponent = pages[page]?.find(comp => comp.name === componentName);
                if (currentComponent) {
                    let currentValue;
                    if (coordinates?.isMatrix) {
                        const { row, col } = coordinates;
                        currentValue = currentComponent.body[fieldKey]?.[row]?.[col];
                    } else if (coordinates?.index !== undefined) {
                        const { index } = coordinates;
                        currentValue = currentComponent.body[fieldKey]?.[index];
                    }
                    
                    if (currentValue === value && value !== "_") {
                        return;
                    }
                }
            }

            const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
            
            
            // Use unified command optimization for both arrays and matrices
            const { relevantCommands, commandsToRemove } = findRelevantCommands(
                parsedCode.cmds, 
                pageStartIndex, 
                pageEndIndex, 
                componentName, 
                fieldKey,
                coordinates?.isMatrix || false,
                coordinates  // Pass coordinates to distinguish global vs per-element properties
            );

            const currentComponent = pages[page]?.find(comp => comp.name === componentName);
            
            const newCommand = createOptimizedCommand(
                relevantCommands, 
                componentName, 
                fieldKey, 
                coordinates, 
                value,
                currentComponent
            );
            
            // Remove old commands (in reverse order to maintain indices)
            commandsToRemove.reverse().forEach(index => {
                parsedCode.cmds.splice(index, 1);
            });
            
            // Add the new command at appropriate position
            if (newCommand) {
                let insertIndex;
                
                // For show commands, insert before any other commands 
                // that reference the same component to avoid "Component not on page" errors
                if (newCommand.type === "show") {
                    // Find the earliest command in the page that references this component
                    let earliestCommandIndex = pageEndIndex - commandsToRemove.length;
                    
                    for (let i = pageStartIndex; i < pageEndIndex - commandsToRemove.length; i++) {
                        const cmd = parsedCode.cmds[i];
                        if (cmd && cmd.name === componentName && cmd.type !== "show") {
                            earliestCommandIndex = i;
                            break;
                        }
                    }
                    
                    insertIndex = earliestCommandIndex;
                } else {
                    // For other commands, insert at the end of the page
                    insertIndex = pageEndIndex - commandsToRemove.length;
                }
                
                parsedCode.cmds.splice(insertIndex, 0, newCommand);
            }
            
            // Trigger reconstruction and recompilation
            reconstructMerlinLite();
        },
        [parsedCode, pages, reconstructMerlinLite]
    );

    // Create a new component and show it
    const createComponent = useCallback((componentType, componentBody, page) => {
        if (!parsedCode) return;

        if ("nodes" in componentBody){
            setNodeCount(nodeCount + componentBody.nodes.length);
        }

        const componentName = componentType + `${ componentCount }`;
        setcomponentCount(componentCount + 1);
        parsedCode.defs.push({ class: "def", type: componentType, 
            name: componentName, body: componentBody
        });

        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page - 1);
        parsedCode.cmds.splice(pageEndIndex, 0, { type: "show", value: componentName });

        reconstructMerlinLite();
    }, [parsedCode]);

    // Add a page after the current page
    const addPage = useCallback((currentPage) => {
        if (currentPage == 0){
            updateUnparsedCode("page");
        }
        else {
            const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(currentPage - 1);
            parsedCode?.cmds.splice(pageEndIndex, 0, { type: "page" });
            reconstructMerlinLite();
        }
    }, [parsedCode]);

    // Remove the current page
    const removePage = useCallback((currentPage) => {
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(currentPage - 1);
        parsedCode?.cmds.splice(pageStartIndex - 1, pageEndIndex - pageStartIndex + 1);
        reconstructMerlinLite();
    }, [parsedCode]);

    // Memoize context value
    const contextValue = useMemo(
        () => ({
            unparsedCode,
            parsedCode,
            compiledMerlin,
            error,
            pages,
            currentCursorLine,
            updateUnparsedCode,
            updateCursorLine,
            reconstructMerlinLite,
            createComponent,
            updateValue,
            addUnit,
            removeUnit,
            addPage,
            removePage,
        }),
        [
            unparsedCode,
            parsedCode,
            compiledMerlin,
            error,
            pages,
            currentCursorLine,
            updateUnparsedCode,
            updateCursorLine,
            reconstructMerlinLite,
            createComponent,
            updateValue,
            addUnit,
            removeUnit,
            addPage,
            removePage,
        ]
    );

    // Initial parse/compile on mount
    React.useEffect(() => {
        parseAndCompile(unparsedCode, false, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (errorTimeoutId) {
                clearTimeout(errorTimeoutId);
            }
        };
    }, [errorTimeoutId]);

    return (
        <ParseCompileContext.Provider value={contextValue}>
            {children}
        </ParseCompileContext.Provider>
    );
}

export function useParseCompile() {
    const ctx = useContext(ParseCompileContext);
    if (!ctx)
        throw new Error(
            "useParseCompile must be used within a ParseCompileProvider"
        );
    return ctx;
}
