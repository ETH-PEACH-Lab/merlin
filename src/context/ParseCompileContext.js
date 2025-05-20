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
        let compiled = null;
        try {
            parsed = parseText(code);
            setParsedCode(parsed);
        } catch (e) {
            setParsedCode(null);
            setError("Parse error: " + (e.message || e));
            return;
        }

        // User either didn't define an object or didn't show it
        if (parsed === null || !parsed?.defs || !parsed?.cmds) {
            setError("Parse error: Nothing to show\nPlease define an object and a page, then show it using the 'show' command.");
            return;
        }

        // Check if the first command is a page
        if (parsed.cmds[0].type !== "page") {
            setError("Parse error: No page command found\nPlease define a page using the 'page' command before using any other commands.");
            return;
        }

        try {
            const { mermaidString, compiled_pages } = compiler(parsed);
            setCompiledMerlin(mermaidString);
            setPages(compiled_pages);
        } catch (e) {
            setError("Compile error: " + (e.message || e));
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
            return reconstructor(parsedCode);
        } catch (e) {
            setError("Reconstruction error: " + (e.message || e));
            return null;
        }
    }, [parsedCode]);

    // Dummy: update part of the parsed code (to be implemented)
    const updateParsedCodePart = useCallback(
        (/* part, value */) => {
            // TODO: implement partial AST update logic
        },
        []
    );

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
            updateParsedCodePart,
        }),
        [
            unparsedCode,
            parsedCode,
            compiledMerlin,
            error,
            pages,
            updateUnparsedCode,
            reconstructMerlinLite,
            updateParsedCodePart,
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
