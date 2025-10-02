import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useRef,
    useEffect,
} from "react";
import { usePostHog } from "posthog-js/react";
import { useStudy } from "../study/StudyContext";
import parseText from "../parser/parseText.mjs";
import reconstructor from "../parser/reconstructor.mjs";
import compiler from "../compiler/compiler.mjs";
import { createOptimizedCommand, findRelevantCommands } from "../parser/commandUtils.mjs";

const ParseCompileContext = createContext();

export function ParseCompileProvider({ children, initialCode = "" }) {
    const posthog = usePostHog();
    const study = useStudy();
    const [unparsedCode, setUnparsedCode] = useState(initialCode);
    const [parsedCode, setParsedCode] = useState(null);
    const [pastActions, setPastActions] = useState([]);
    const [undoneActions, setUndoneActions] = useState([]);
    const [compiledMerlin, setCompiledMerlin] = useState(null);
    const [pages, setPages] = useState([]);
    const [componentCount, setcomponentCount] = useState(1);
    const [nodeCount, setNodeCount] = useState(1);
    const [error, setError] = useState(null);
    // Error logging cooldown (avoid noisy logs while typing)
    const lastErrorLogRef = React.useRef({ ts: 0, hash: "" });
    const [currentCursorLine, setCurrentCursorLine] = useState(1);
    const [errorTimeoutId, setErrorTimeoutId] = useState(null);
    // Persist desired visual size (set by layout resize) so recompiles keep it
    const [desiredSize, setDesiredSize] = useState(null); // { width, height }
    const [lastCompileTime, setLastCompileTime] = useState(0);
    // Track last size that we actually patched into compiled text to add hysteresis
    const lastPatchedSizeRef = React.useRef(null); // { width, height }
    const lastSizeUpdateTsRef = React.useRef(0);
    const pendingSizeRef = React.useRef(null); // { width, height }
    const pendingTimerRef = React.useRef(null);
    
    // Add debounce for error logging to avoid immediate logging while typing
    const errorLogDebounceRef = React.useRef(null);
    const pendingErrorsRef = React.useRef([]);

    // Set a delay, will wait specified milliseconds before showing an error on current line
    const DELAY = 1000;
    const DELAY_CURRENT_LINE = 3000;

    // Debounced error logging - only log after user stops typing
    const debouncedLogError = (type, errorObj, code, isImmediate = false) => {
        // Coordinate immediately with centralized study error handler
        const payload = {
            error: { line: errorObj?.line, col: errorObj?.col, message: errorObj?.message },
            codeContext: (code || '').split('\n').slice(Math.max(0, (errorObj?.line || 1) - 3), (errorObj?.line || 1) + 2).join('\n'),
            codeLen: (code || '').length,
        };
        study?.rememberError && study.rememberError('merlin', type, payload);
    };

    // Parse and compile with smart error handling
    const parseAndCompile = useCallback((code, skipCurrentLine = false, currentLine = 1) => {
        // Clear any existing error timeout
        if (errorTimeoutId) {
            clearTimeout(errorTimeoutId);
            setErrorTimeoutId(null);
        }

        // Skip processing if code is only empty lines or whitespace
        if (!code || code.trim() === '') {
            setError(null);
            setParsedCode(null);
            setCompiledMerlin(null);
            setPages([]);
            return;
        }

        let codeToProcess = code;
        const codeLines = code.split('\n');
        const totalLines = codeLines.length;
        const validCurrentLine = Math.max(1, Math.min(currentLine, totalLines));

        // Check if all lines are empty or whitespaces, if so don't compile or parse (no error)
        const allEmpty = codeLines.every(line => line.trim() === '');
        if (allEmpty) {
            setError(null);

            // Clear Merlin Renderer
            setParsedCode(null);
            setCompiledMerlin(null);
            setPages([]);
            return;
        }

        
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
            study?.notifySuccess && study.notifySuccess('merlin');
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

            debouncedLogError('merlin_parse_error', errorObj, codeToProcess, false);
            
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
            // Derive previous size if we don't have a desired size (carry forward)
            let patched;
            if (desiredSize) {
                patched = patchSizeLine(mermaidString, desiredSize.width, desiredSize.height);
            } else {
                const prevSize = extractSizeFromCompiled(compiledMerlin);
                patched = prevSize ? patchSizeLine(mermaidString, prevSize.width, prevSize.height) : mermaidString;
            }
            // Avoid no-op updates that cause redundant re-render/flicker
            if (compiledMerlin !== null && compiledMerlin === patched) {
                // Still update pages if they changed
                setPages(compiled_pages);

                return;
            }
            setCompiledMerlin(patched);
            setPages(compiled_pages);
            setLastCompileTime(Date.now());
            // Update last patched size from the compiled text
            const s = extractSizeFromCompiled(patched);
            if (s) lastPatchedSizeRef.current = s;
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
            
            debouncedLogError('merlin_compile_error', errorObj, code, false);
            
            // Apply same logic for compile errors
            if (!skipCurrentLine && errorLine === validCurrentLine) {
                let testCompiled = null;
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
                    let patched;
            if (desiredSize) {
                        patched = patchSizeLine(testCompiled.mermaidString, desiredSize.width, desiredSize.height);
                    } else {
                        const prevSize = extractSizeFromCompiled(compiledMerlin);
                        patched = prevSize ? patchSizeLine(testCompiled.mermaidString, prevSize.width, prevSize.height) : testCompiled.mermaidString;
                    }
                    if (!(compiledMerlin !== null && compiledMerlin === patched)) {
                        setCompiledMerlin(patched);
                        setLastCompileTime(Date.now());
                const s = extractSizeFromCompiled(patched);
                if (s) lastPatchedSizeRef.current = s;
                    }
                    setPages(testCompiled.compiled_pages);
                } catch (secondError) {
                    // Do nothing here, we handle the error below
                }

                // Always delay the error if it's on current line
                const timeoutId = setTimeout(() => {
                    setError(errorMessage);
                    if (window.errorStateManager) {
                        window.errorStateManager.setError(errorObj);
                    }
                    setErrorTimeoutId(null);
                }, DELAY_CURRENT_LINE);
                setErrorTimeoutId(timeoutId);
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
            // notify study env of editor activity
            study?.notifyEditorChange && study.notifyEditorChange('merlin');
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
        
        for (let i = 0; i < parsedCode.cmds.length; i++) {
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
    const addUnit = useCallback((page, componentName, componentType, val, coordinates=null, parent=null, nodeName=null, addCommand="") => {
        pastActions.push(structuredClone(unparsedCode));
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
        // In case node name is needed and not defined or not valid, change node name
        if (["tree", "graph", "linkedlist"].includes(componentType) && (nodeName === null || nodeName.toUpperCase() === nodeName.toLowerCase())){
            nodeName = "n" + `${ nodeCount }`;
            setNodeCount(nodeCount + 1);
        }
        // For new tree nodes, we can directly add them as a child
        if (componentType === "tree" && addCommand === "addChild"){
            const args = {index: {start: parent, end: nodeName}, value: val}
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "nodes", type: "add_child", args: args});
        } 
        // For graphs and trees, we can add a new node
        else if (componentType === "graph" || componentType === "tree"){
            const args = {index: nodeName, value: val}
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "nodes", type: "add", args: args});
        }
        // For linked lists insert a new node at a given position
        else if (componentType === "linkedlist"){
            const args = {index: coordinates.index + 1, value: nodeName, nodeValue: val}
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "nodes", type: "insert", args: args});
        }
        // For matrices 
        else if (componentType === "matrix"){
            const addType = addCommand === "addRow" ? "insert_matrix_row" : "insert_matrix_column";
            const coord = addCommand === "addRow" ? coordinates.row + 1 : coordinates.col + 1;
            const values = val === null ? [null] : val.split(',').map(( value ) => value.trim());
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "value", type: addType, args: {index: coord, value: values} });
        }
        // For stacks and arrays insert a new value
        else {
            const idx = (componentType === "stack") ? coordinates.index : coordinates.index + 1;
            const args = {index: idx, value: val};
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "value", type: "insert", args: args});
        }
        reconstructMerlinLite();
    }, [parsedCode]);


    // Add an edge to a graph or tree
    const addEdge = useCallback((page, componentName, componentType, node0, node1) => {
        pastActions.push(structuredClone(unparsedCode));
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
        if (componentType === "tree"){
			parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, type: "set_child", args: { start: node0, end: node1 } }); 
		}
		else{
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "edges", type: "add", args: { start: node0, end: node1 } }); 
        }       
        reconstructMerlinLite();
    }, [parsedCode]);

    const editEdge = useCallback((data, secondNodeIdx) => {
        pastActions.push(structuredClone(unparsedCode));
        const nodeArray = data.nodes.split(",");

        if (data.command === "addEdge"){
            addEdge(parseInt(data.page, 10), data.name, "graph", data.firstNode, nodeArray[secondNodeIdx]);
        }
        else{
            removeEdge(parseInt(data.page, 10), data.name, "graph", data.firstNode, nodeArray[secondNodeIdx]);
        }
        reconstructMerlinLite();
    }, [parsedCode]);


    // Remove the selected unit
    const removeUnit = useCallback((page, componentName, componentType, coordinates=null, nodeName=null, removeCommand="") => {
        pastActions.push(structuredClone(unparsedCode));
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);

        if (componentType === "tree" || componentType === "graph"){
            const removeType = removeCommand === "removeSubtree" ? "remove_subtree" : "remove";
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "nodes", type: removeType, args: nodeName });
        } 

        else if (componentType === "matrix"){
            const removeType = removeCommand === "removeRow" ? "remove_matrix_row" : "remove_matrix_column";
            const coord = removeCommand === "removeRow" ? coordinates.row : coordinates.col
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "value", type: removeType, args: coord });
        } 

        else {
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "all", type: "remove_at", args: coordinates.index });
        }
        reconstructMerlinLite();
    }, [parsedCode]);


    // Remove an edge from the graph. In case of tree, remove entire subtree below the edge.
    const removeEdge = useCallback((page, componentName, componentType, node0, node1) => {
        pastActions.push(structuredClone(unparsedCode));
		if (componentType === "tree"){
			removeUnit(page, componentName, componentType, null, node1, "removeSubtree");
		}
		else{
			const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
			parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: "edges", type: "remove", args: { start: node0, end:node1 } });
			reconstructMerlinLite();
		}
    }, [parsedCode]);


    const updateValue = useCallback((page, componentName, coordinates, fieldKey, value) => {
        if (!parsedCode) return;
        pastActions.push(structuredClone(unparsedCode));
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
    [parsedCode, pages, reconstructMerlinLite]);

    const updateValues = useCallback((page, componentName, componentType, fieldKey, prevValues, newValues, prevEdges, newEdges) => {
        pastActions.push(structuredClone(unparsedCode));
        let updateValues = false;
        if (["graph", "tree"].includes(componentType)){
			let nodes = new Array();
            if (typeof newValues === "string"){
				newValues = newValues.split(',').map(( value ) => value.trim());
                const values = new Array();
                for (let i = 0; i<newValues.length; i++){
                    if (newValues[i].split(':').length === 2){
                        nodes.push(newValues[i].split(':')[0]);
                        values.push(newValues[i].split(':')[1]);
                    }
                }
                newValues = new Array();

                // Check for all previous nodes if they were deleted, if yes, delete them and if no, update their values
                for (let i = 0; i < prevValues.length; i++) { 
                    if (nodes.indexOf(prevValues[i]) === -1){
                        removeUnit(page, componentName, componentType, null, prevValues[i], null);
                    }
                    else {
						updateValues = true;
                        newValues.push(values[nodes.indexOf(prevValues[i])]);
                    }
                }  
                // Add the nodes that user created
                for (let i = 0; i < nodes.length; i++) { 
                    if (prevValues.indexOf(nodes[i]) === -1){
                        addUnit(page, componentName, componentType, values[i], null, null, nodes[i]);                
                    }
                } 
            }
            else {
                nodes = newValues;
            }
            
            if (newEdges !== null){
				// Remove the edges that the user deleted
                for (let i = 0; i<prevEdges.length; i++){
                    if (newEdges.indexOf(prevEdges[i]) === -1 && nodes.indexOf(prevEdges[i].split("-")[0]) !== -1 && nodes.indexOf(prevEdges[i].split("-")[1]) !== -1){
                        removeEdge(page, componentName, componentType, prevEdges[i].split("-")[0], prevEdges[i].split("-")[1]);
                    }
                }
				// Add the edges that the user created
                for (let i = 0; i<newEdges.length; i++){
                    if (newEdges[i].split("-").length === 2){
                        let [n0, n1] = newEdges[i].split("-");
                        if (nodes.indexOf(n0.trim()) !== -1 && nodes.indexOf(n1.trim()) !== -1){
                            addEdge(page, componentName, componentType, n0, n1);
                        }
                    }
                }
            }
        }
        else if (["array", "stack", "linkedlist"].includes(componentType)){
			updateValues = true;
            for (let i = newValues.length; i < prevValues.length; i++) { 
                removeUnit(page, componentName, componentType, {index: 1});
            }      
            if (["linkedlist"].includes(componentType)){
                for (let i = prevValues.length; i < newValues.length; i++) { 
                    addUnit(page, componentName, componentType, {index: 1}, null);
                }
            }  
        }
        else if (["matrix"].includes(componentType)){
            updateValues = true;
            const newRows = newValues.length;
            const newColumns = newValues[0].length;
            for (let i = prevValues.length; i < newRows; i++) { 
                addUnit(page, componentName, componentType, null, {row: 1, col: 1}, null, null, "addRow");
            }
            for (let i = prevValues[0].length; i < newColumns; i++) { 
                addUnit(page, componentName, componentType, null, {row: 1, col: 1}, null, null, "addColumn");
            }
            for (let i = newRows; i < prevValues.length; i++) { 
                removeUnit(page, componentName, componentType, {row: 1, col: 1}, null, "removeRow");
            }
            for (let i = newColumns; i < prevValues[0].length; i++) { 
                removeUnit(page, componentName, componentType, {row: 1, col: 1}, null, "removeColumn");
            }
        }

        if (updateValues){
            const [newPageStartIndex, newPageEndIndex] = findPageBeginningAndEnd(page);
            parsedCode.cmds.splice(newPageEndIndex, 0, { name: componentName, target: "value", type: "set_multiple", args: newValues}); 
            reconstructMerlinLite();
        }
    }, [parsedCode]);

    // Update the colors and arrows multiple units
    const updateUnitStyles = useCallback((page, componentName, fieldKey, newValues) => {
        pastActions.push(structuredClone(unparsedCode));
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
        parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, target: fieldKey, type: "set_multiple", args: newValues});
        reconstructMerlinLite();
    }, [parsedCode]);

    // Update the component texts
    const updateText = useCallback((page, componentName, componentType, index, fieldKey, newValue) => {
        pastActions.push(structuredClone(unparsedCode));
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
        if (componentType !== "text"){
            parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, type: "set_text", args: {index: newValue, value: {value: fieldKey.split("_")[1]}}});
        }
        else {
            if (["height", "width", "lineSpacing"].includes(fieldKey)){
                parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, type: "set", target: fieldKey, args: parseInt(newValue)});
            }
            else {
                const valueParsed = (fieldKey === "fontSize") ? parseInt(newValue, 10) : newValue;
                parsedCode.cmds.splice(pageEndIndex, 0, { name: componentName, type: "set", target: fieldKey, args: {index: index, value: valueParsed }});
            }
        }
        reconstructMerlinLite();
    }, [parsedCode]);

    // Update the position of the component
    const updatePosition = useCallback((page, componentName, newValue) => {
        pastActions.push(structuredClone(unparsedCode));
        let len = parsedCode.cmds.length;    
        for (let i = len - 1; i >= 0; i--){
            if ((parsedCode.cmds[i].type === "show" && parsedCode.cmds[i].value === componentName)) {
                parsedCode.cmds.splice(i, 1);
            }
        }
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);

        parsedCode.cmds.splice(pageStartIndex, 0, { type: "show", value: componentName, position: newValue.split(",")});
        reconstructMerlinLite();
    }, [parsedCode]);

    // Create a new component and show it
    const createComponent = useCallback((componentType, componentBody, page) => {
        if (!parsedCode) return;
        pastActions.push(structuredClone(unparsedCode));

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

    // Remove a component
    const removeComponent = useCallback((page, componentName) => {  
        pastActions.push(structuredClone(unparsedCode));  
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(page);
        // Insert a hide command
        parsedCode.cmds.splice(pageEndIndex, 0, { type: "hide", value: componentName });
        // Find the next show command
        let nextShow = pageEndIndex;
        while (nextShow < parsedCode.cmds.length){
            if (parsedCode.cmds[nextShow].type === "show" && parsedCode.cmds[nextShow].value === componentName){
                break;
            }
            nextShow++;
        }
        // Remove all commands that affect the component between the hide and the next show
        for (let j = nextShow - 1; j > pageEndIndex; j--){
            if (parsedCode.cmds[j].name === componentName) {
                parsedCode.cmds.splice(j, 1);
            }
        }

        reconstructMerlinLite();
    }, [parsedCode]);

    const undo = useCallback(() => {
        const prevState = pastActions.pop();
        undoneActions.push(prevState);
        updateUnparsedCode(prevState);

    }, [parsedCode]); 

    const redo = useCallback(() => {
        const prevState = undoneActions.pop();
        pastActions.push(prevState);
        updateUnparsedCode(prevState);

    }, [parsedCode]);

    // Add a page after the current page
    const addPage = useCallback((currentPage) => {
        if (currentPage == 0){
            updateUnparsedCode("page");
        }
        else {
            const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(currentPage - 1);
            pastActions.push(structuredClone(unparsedCode));
            parsedCode?.cmds.splice(pageEndIndex, 0, { type: "page" });
            reconstructMerlinLite();
        }
    }, [parsedCode]);

    // Remove the current page
    const removePage = useCallback((currentPage) => {
        pastActions.push(structuredClone(unparsedCode));
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(currentPage - 1);
        parsedCode?.cmds.splice(pageStartIndex - 1, pageEndIndex - pageStartIndex + 1);
        reconstructMerlinLite();
    }, [parsedCode]);

    // Set the positioning grid for the current page
    const setPageGrid = useCallback((currentPage, gridSize) => {
        pastActions.push(structuredClone(unparsedCode));
        const [pageStartIndex, pageEndIndex] = findPageBeginningAndEnd(currentPage - 1);
        parsedCode?.cmds.splice(pageStartIndex - 1, 1, { type: "page", layout: gridSize.split("x")});
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
            pastActions,
            undoneActions,
            updateUnparsedCode,
            updateCursorLine,
            reconstructMerlinLite,
            createComponent,
            updateValue,
            updateValues,
            updateUnitStyles,
            addUnit,
            removeUnit,
            addEdge,
            editEdge,
            removeEdge,
            addPage,
            removePage,
            setPageGrid,
            updateText,
            updatePosition,
            removeComponent,
            undo,
            redo,
            // Update compiled diagram size with rounding, hysteresis, and optional force
            updateCompiledSize: (width, height, force = false) => {
                if (!width || !height) return;
                const wNum = typeof width === 'number' ? width : parseFloat(width);
                const hNum = typeof height === 'number' ? height : parseFloat(height);
                if (Number.isNaN(wNum) || Number.isNaN(hNum)) return;
                // Quantize to a small grid to avoid ping-pong around single px thresholds
                const quantize = (v) => Math.max(1, Math.round(v / 2) * 2); // nearest 2 px
                const roundedWidth = quantize(wNum);
                const roundedHeight = quantize(hNum);
                // Also publish CSS custom properties so compiler's getMermaidContainerSize uses the same values immediately
                try {
                    if (typeof document !== 'undefined' && document.documentElement && document.documentElement.style) {
                        document.documentElement.style.setProperty('--mermaid-container-width', `${roundedWidth}px`);
                        document.documentElement.style.setProperty('--mermaid-container-height', `${roundedHeight}px`);
                    }
                } catch {}
                // If forced, clear any pending and patch immediately
                if (force) {
                    if (pendingTimerRef.current) { clearTimeout(pendingTimerRef.current); pendingTimerRef.current = null; }
                    pendingSizeRef.current = null;
                    setDesiredSize({ width: roundedWidth, height: roundedHeight });
                    if (compiledMerlin) {
                        setCompiledMerlin(prev => {
                            if (!prev) return prev;
                            const next = patchSizeLine(prev, roundedWidth, roundedHeight);
                            if (next !== prev) {
                                lastPatchedSizeRef.current = { width: roundedWidth, height: roundedHeight };
                                lastSizeUpdateTsRef.current = Date.now();
                            }
                            return next;
                        });
                    }
                    return;
                }
                // Read current size line to avoid unnecessary re-renders (flicker)
                if (compiledMerlin) {
                    const current = lastPatchedSizeRef.current || extractSizeFromCompiled(compiledMerlin);
                    const tolerance = 4; // base px threshold
                    const recentCompile = Date.now() - lastCompileTime < 150;
                    const dynamicTolerance = recentCompile ? tolerance * 2 : tolerance;
                    if (current) {
                        const dw = Math.abs(current.width - roundedWidth);
                        const dh = Math.abs(current.height - roundedHeight);
                        // If both deltas are at or below tolerance, do not patch text; just remember desired
                        if (dw <= dynamicTolerance && dh <= dynamicTolerance) {
                            setDesiredSize({ width: roundedWidth, height: roundedHeight });
                            return;
                        }
                        // Debounce: require stability window before patching
                        setDesiredSize({ width: roundedWidth, height: roundedHeight });
                        const candidate = { width: roundedWidth, height: roundedHeight };
                        pendingSizeRef.current = candidate;
                        if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
                        pendingTimerRef.current = setTimeout(() => {
                            // Only patch if candidate did not change during debounce window
                            if (!pendingSizeRef.current) return;
                            const { width: cw, height: ch } = pendingSizeRef.current;
                            pendingTimerRef.current = null;
                            setCompiledMerlin(prev => {
                                if (!prev) return prev;
                                const next = patchSizeLine(prev, cw, ch);
                                if (next !== prev) {
                                    lastPatchedSizeRef.current = { width: cw, height: ch };
                                    lastSizeUpdateTsRef.current = Date.now();
                                }
                                return next;
                            });
                        }, 160); // patch only if stable for 160ms
                        return;
                    }
                }
                setDesiredSize({ width: roundedWidth, height: roundedHeight });
                if (compiledMerlin) {
                    setCompiledMerlin(prev => {
                        if (!prev) return prev;
                        const next = patchSizeLine(prev, roundedWidth, roundedHeight);
                        if (next !== prev) {
                            lastPatchedSizeRef.current = { width: roundedWidth, height: roundedHeight };
                            lastSizeUpdateTsRef.current = Date.now();
                        }
                        return next;
                    });
                }
            }
        }),
        [
            unparsedCode,
            parsedCode,
            compiledMerlin,
            error,
            pages,
            currentCursorLine,
            pastActions,
            undoneActions,
            updateUnparsedCode,
            updateCursorLine,
            reconstructMerlinLite,
            createComponent,
            updateValue,
            updateValues,
            updateUnitStyles,
            addUnit,
            removeUnit,
            addEdge,
            editEdge,
            removeEdge,
            addPage,
            removePage,
            setPageGrid,
            updateText,
            updatePosition,
            removeComponent,
            undo,
            redo,
            desiredSize,
            lastCompileTime,
        ]
    );

    // Helper to patch size line (defined after useMemo so referenced above)
    function patchSizeLine(mermaidString, width, height) {
        if (!mermaidString) return mermaidString;
        const w = typeof width === 'number' ? width.toFixed(1) : width;
        const h = typeof height === 'number' ? height.toFixed(1) : height;
        const lines = mermaidString.split('\n');
        const visualIdx = lines.findIndex(l => l.trim() === 'visual');
        if (visualIdx === -1) return mermaidString; // nothing to do
        let sizeIdx = -1;
        for (let i = visualIdx + 1; i < Math.min(lines.length, visualIdx + 6); i++) {
            const t = lines[i]?.trim();
            if (!t) break;
            if (t.startsWith('size:')) { sizeIdx = i; break; }
            if (t === 'page') break;
        }
        const sizeLine = `size: (${w},${h})`;
        if (sizeIdx !== -1) lines[sizeIdx] = sizeLine; else lines.splice(visualIdx + 1, 0, sizeLine);
        return lines.join('\n');
    }

    function extractSizeFromCompiled(merlinString) {
        if (!merlinString) return null;
        const lines = merlinString.split('\n');
        const visualIdx = lines.findIndex(l => l.trim() === 'visual');
        if (visualIdx === -1) return null;
        for (let i = visualIdx + 1; i < Math.min(lines.length, visualIdx + 6); i++) {
            const t = lines[i]?.trim();
            if (!t) break;
            if (t.startsWith('size:')) {
                const m = t.match(/size:\s*\(([^,]+),([^\)]+)\)/);
                if (m) {
                    const w = parseFloat(m[1]);
                    const h = parseFloat(m[2]);
                    if (!Number.isNaN(w) && !Number.isNaN(h)) return { width: w, height: h };
                }
                break;
            }
            if (t === 'page') break;
        }
        return null;
    }

    // Initial parse/compile on mount
    React.useEffect(() => {
        parseAndCompile(unparsedCode, false, 1);
        
        // Track user typing activity for error logging debouncing
        const handleKeyPress = () => {
            if (!window.__lastErrorLog) window.__lastErrorLog = {};
            window.__lastErrorLog.lastKeyPress = Date.now();
        };
        
        document.addEventListener('keydown', handleKeyPress);
        
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Cleanup timeout on unmount
    React.useEffect(() => {
        return () => {
            if (errorTimeoutId) {
                clearTimeout(errorTimeoutId);
            }
            
            // Clean up error logging debounce timer
            if (errorLogDebounceRef.current) {
                clearTimeout(errorLogDebounceRef.current);
                errorLogDebounceRef.current = null;
            }
            
            // Log any pending errors before unmounting
            if (pendingErrorsRef.current.length > 0) {
                pendingErrorsRef.current.forEach(({ type, errorObj, code }) => {
                    safeLogError(type, errorObj, code, false);
                });
                pendingErrorsRef.current = [];
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

// Helper: structured error logging with debounce/cooldown and payload trimming
function computeHash(s) {
    try {
        let h = 0;
        for (let i = 0; i < s.length; i++) {
            h = ((h << 5) - h) + s.charCodeAt(i);
            h |= 0;
        }
        return String(h);
    } catch { return "0"; }
}

function safeLogError(type, errorObj, code, isImmediate = false) {
    try {
        const study = require('../study/StudyContext');
    } catch {}
    try {
        // Access global logEvent via window from StudyProvider (in React tree)
        const logEvent = window.__studyLogEvent;
        if (!logEvent) return;
        const now = Date.now();
        const signature = `${type}:${errorObj?.line || 0}:${errorObj?.col || 0}:${(errorObj?.message || '').split('\n')[0]}`;
        const sigHash = computeHash(signature);
        if (!window.__lastErrorLog) window.__lastErrorLog = { ts: 0, hash: '' };
        const { ts, hash } = window.__lastErrorLog;
        
        // For non-immediate errors, use a longer debounce period
        if (!isImmediate) {
            // Check if user is actively typing by looking at last key press
            if (!window.__lastErrorLog.lastKeyPress) window.__lastErrorLog.lastKeyPress = 0;
            const timeSinceLastKey = now - window.__lastErrorLog.lastKeyPress;
            // If user typed in last 3s, don't log non-immediate errors (increased from 1.5s)
            if (timeSinceLastKey < 3000) return;
        }
        
        // 3s cooldown per identical signature for all errors (increased from 2s)
        if (hash === sigHash && now - ts < 3000) return;
        window.__lastErrorLog = { ts: now, hash: sigHash };
        const snippet = (code || '').split('\n').slice(Math.max(0, (errorObj?.line || 1) - 3), (errorObj?.line || 1) + 2).join('\n');
        
        // Also log via study context
        logEvent(type, {
            error: {
                line: errorObj?.line,
                col: errorObj?.col,
                message: errorObj?.message,
            },
            codeContext: snippet,
            codeLen: (code || '').length,
        });
    } catch {}
}
