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
    const [error, setError] = useState(null);

    // Parse and compile whenever unparsedCode changes
    const parseAndCompile = useCallback((code) => {
        setError(null);
        let parsed = null;
        try {
            parsed = parseText(code);
            setParsedCode(parsed);
        } catch (e) {
            setParsedCode(null);
            setError(`Parse error: ` + (e.message || e));
            return;
        }

        try {
            const { mermaidString, compiled_pages } = compiler(parsed);
            setCompiledMerlin(mermaidString);
            setPages(compiled_pages);
        } catch (e) {
            if (e.line && e.col) {
                setError(`Compile error on line ${e.line}, col ${e.col}:\n${e.message || e}`);
            } else {
                setError(`Compile error:\n${e.message || e}`);
            }
        }
    }, []);

    // Update unparsed code and trigger parse/compile
    const updateUnparsedCode = useCallback(
        (newCode) => {
            setUnparsedCode(newCode);
            parseAndCompile(newCode);
        },
        [parseAndCompile]
    );

    // Reconstruct MerlinLite code from parsed version
    const reconstructMerlinLite = useCallback(() => {
        if (!parsedCode) return null;
        try {
            const reconstructed = reconstructor(parsedCode);
            setUnparsedCode(reconstructed);
            parseAndCompile(reconstructed);
            return reconstructed;
        } catch (e) {
            setError("Reconstruction error: " + (e.message || e));
            return null;
        }
    }, [parsedCode, parseAndCompile]);  

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
            
            // Find the start and end indices of the specified page
            let pageStartIndex = -1;
            let pageEndIndex = parsedCode.cmds.length;
            let currentPage = 0;
            
            for (let i = 0; i < parsedCode.cmds.length; i++) {
                if (parsedCode.cmds[i].type === "page") {
                    if (currentPage === page) {
                        pageStartIndex = i + 1;
                    } else if (currentPage === page + 1) {
                        pageEndIndex = i;
                        break;
                    }
                    currentPage++;
                }
            }
            
            if (pageStartIndex === -1) {
                console.error(`Page ${page} not found`);
                return;
            }
             // Use unified command optimization for arrays, matrices, and position fields
            const { relevantCommands, commandsToRemove } = findRelevantCommands(
                parsedCode.cmds, 
                pageStartIndex, 
                pageEndIndex, 
                componentName, 
                fieldKey,
                coordinates?.isMatrix || false,
                coordinates  // Pass coordinates to distinguish global vs per-element properties
            );

            const newCommand = createOptimizedCommand(
                relevantCommands, 
                componentName, 
                fieldKey, 
                coordinates, 
                value
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

    const addPage = useCallback((currentPage) => {
        console.log(currentPage);
        if (currentPage == pages.length){
            parsedCode?.cmds.push({ type: "page" });
        }
        else {
            let count = pages.length;
            for (var i = parsedCode?.cmds.length - 1; i >= 0; i--) {
                const currentCommand = parsedCode.cmds[i];
                if (currentCommand.type === "page") {
                    count--;
                }
                if (count == currentPage){
                    parsedCode.cmds.splice(i, 0, { type: "page" });
                    break;
                }
            }
        }
        reconstructMerlinLite();
    }, [parsedCode]);

    const removePage = useCallback(() => {
        while (parsedCode?.cmds.length > 0) {
            const lastCommand = parsedCode.cmds[parsedCode.cmds.length - 1];
            if (lastCommand.type === "page") {
                parsedCode.cmds.pop();
                break;
            }
            parsedCode.cmds.pop();
        }
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
            updateUnparsedCode,
            reconstructMerlinLite,
            updateValue,
            addPage,
            removePage,
        }),
        [
            unparsedCode,
            parsedCode,
            compiledMerlin,
            error,
            pages,
            updateUnparsedCode,
            reconstructMerlinLite,
            updateValue,
            addPage,
            removePage,
        ]
    );

    // Initial parse/compile on mount
    React.useEffect(() => {
        parseAndCompile(unparsedCode);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
