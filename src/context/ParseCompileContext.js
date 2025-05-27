import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";
import parseText from "../parser/parseText.mjs";
import reconstructor from "../parser/reconstructor.js";
import compiler from "../compiler/compiler.mjs";

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
                setError(`[${e.line}:${e.col}] Compile error: ${e.message || e}`);
            } else {
                setError(`Compile error: ${e.message || e}`);
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
        (page, component, id, fieldKey, value) => {
            if (!parsedCode) return;
            // TODO: implement partial AST update logic
            console.log(
                `Update value at page ${page}, component ${component}, id ${id}, field ${fieldKey} to ${value}`
            )
        },
        [parsedCode]
    );

    const addPage = useCallback(() => {
        parsedCode?.cmds.push({ type: "page" });
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
