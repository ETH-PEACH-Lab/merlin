// myCompiler to convert myDSL into mermaid code

import { expandPositionWithLayout, inferLayoutFromKeywords } from './positionUtils.mjs';

import { generateArray } from "./types/generateArray.mjs"
import { generateLinkedlist } from "./types/generateLinkedlist.mjs";
import { generateStack } from "./types/generateStack.mjs";
import { generateTree } from "./types/generateTree.mjs";
import { generateMatrix } from "./types/generateMatrix.mjs";
import { generateGraph } from "./types/generateGraph.mjs";
import { generateText } from "./types/generateText.mjs";
import { getMermaidContainerSize } from "./cssUtils.mjs";

// Helper function to maintain consistency across array properties when modifying arrays
function maintainArrayPropertyConsistency(body, modifiedProperty, index, operation) {
    // Define the properties that should be kept in sync for different component types
    let arrayProperties = ["arrow", "color", "value", "hidden"];
    
    // First, find the target length based on the modified property
    const targetLength = body[modifiedProperty] ? body[modifiedProperty].length : 0;
    
    arrayProperties.forEach(property => {
        if (property !== modifiedProperty && body[property]) {
            const currentLength = body[property].length;
            
            switch (operation) {
                case "insert":
                    // Ensure the array is long enough before inserting
                    while (body[property].length < index) {
                        body[property].push(null);
                    }
                    // Insert null at the same index to maintain alignment
                    body[property].splice(index, 0, null);
                    break;
                case "add":
                    // Ensure the array has the same length as the target (minus 1 since we just added)
                    while (body[property].length < targetLength - 1) {
                        body[property].push(null);
                    }
                    // Add null to maintain alignment
                    body[property].push(null);
                    break;
                case "remove":
                    // Remove element at the same index to maintain alignment
                    if (index < body[property].length) {
                        body[property].splice(index, 1);
                    }
                    break;
            }
        } else if (property !== modifiedProperty && !body[property]) {
            // If the property doesn't exist, create it with the appropriate length
            switch (operation) {
                case "insert":
                case "add":
                    body[property] = Array(targetLength).fill(null);
                    break;
                // For remove, we don't need to create new arrays
            }
        }
    });
}

// Helper function to expand ranged positions into shape dimensions
function expandRangedPosition(position) {
    if (!position || !Array.isArray(position)) {
        return position; // Return as-is if not a position array
    }
    
    const [xPos, yPos] = position;
    
    // Helper function to get range dimensions
    function getRangeDimensions(pos) {
        if (pos && typeof pos === 'object' && pos.type === 'range') {
            return {
                start: pos.start,
                end: pos.end,
                size: pos.end - pos.start + 1
            };
        }
        return {
            start: pos,
            end: pos,
            size: 1
        };
    }
    
    const xDim = getRangeDimensions(xPos);
    const yDim = getRangeDimensions(yPos);
    
    // Return the shape information
    return {
        x: xDim.start,
        y: yDim.start,
        width: xDim.size,
        height: yDim.size,
        originalPosition: position
    };
}

export default function convertParsedDSLtoMermaid(parsedDSLOriginal) {
    // Deep copy to avoid mutating the original parsed DSL
    const parsedDSL = parsedDSLOriginal ? JSON.parse(JSON.stringify(parsedDSLOriginal)) : {};
    
    // Pre-checks to ensure the parsed DSL is valid
    preCheck(parsedDSL);

    const definitions = parsedDSL.defs; 
    const commands = parsedDSL.cmds;

    // Helper function to find a component definition by its name
    function findComponentDefinitionByName(defs, name) {
        return defs.find(def => def.name === name);
    }

    function causeCompileError(message, command) {
        const err = new Error(message);
        Object.assign(err, { line: command.line, col: command.col });
        throw err;
    }

    const pages = [];

    // Smart layout inference: collect position keywords to infer minimum layouts
    function inferSmartLayouts() {
        let currentPageIndex = -1;
        const pageKeywords = []; // Array of arrays - one per page
        
        // First pass: collect all position keywords per page
        commands.forEach((command) => {
            if (command.type === "page") {
                currentPageIndex++;
                pageKeywords[currentPageIndex] = [];
            } else if (command.type === "show" && command.position && command.position.type === 'keyword') {
                if (currentPageIndex >= 0) {
                    pageKeywords[currentPageIndex].push(command.position);
                }
            }
        });
        
        return pageKeywords.map(keywords => inferLayoutFromKeywords(keywords));
    }
    
    const inferredLayouts = inferSmartLayouts();
    let currentInferredLayoutIndex = -1;

    commands.forEach((command) => {
        switch (command.type) {
            case "page":
                currentInferredLayoutIndex++;
                
                // Keep previous page if exists
                if (pages.length > 0) {
                    const lastPage = JSON.parse(JSON.stringify(pages[pages.length - 1]));
                    pages.push(lastPage);
                } else {
                    pages.push([]);
                }
                
                // Store layout information on the page
                const currentPage = pages[pages.length - 1];
                if (command.layout) {
                    // Explicit layout provided
                    currentPage._layout = command.layout; // [cols, rows]
                } else if (inferredLayouts[currentInferredLayoutIndex]) {
                    // Use inferred layout based on position keywords
                    currentPage._layout = inferredLayouts[currentInferredLayoutIndex];
                }
                break;
            case "show":
                const componentNameToShow = command.value;
                const componentData = findComponentDefinitionByName(definitions, componentNameToShow);

                if (componentData) {
                    // Get current page layout for keyword translation
                    const currentPage = pages[pages.length - 1];
                    const currentLayout = currentPage._layout || [2, 2]; // Default to 2x2
                    
                    // First expand keywords with layout context, then expand ranged positions
                    let expandedPosition = null;
                    if (command.position) {
                        const keywordExpanded = expandPositionWithLayout(command.position, currentLayout);
                        expandedPosition = keywordExpanded.type === 'keyword' ? 
                            keywordExpanded : expandRangedPosition(keywordExpanded);
                    }
                    
                    const component = {
                        type: componentData.type,
                        name: componentData.name,
                        body: componentData.body,
                    };
                    
                    // Add position information if provided
                    if (expandedPosition) {
                        component.position = expandedPosition;
                    }
                    
                    pages[pages.length - 1].push(component);
                    
                    // Handle placement text components (above, below, left, right)
                    const placementDirections = ['above', 'below', 'left', 'right'];
                    placementDirections.forEach(direction => {
                        if (componentData.body[direction]) {
                            const placementValue = componentData.body[direction];
                            let textComponent;
                            
                            // First, try to find a referenced component by name
                            const referencedComponent = findComponentDefinitionByName(definitions, placementValue);
                            if (referencedComponent && referencedComponent.type === 'text') {
                                // It's a reference to another text object
                                textComponent = {
                                    type: 'text',
                                    name: referencedComponent.name,
                                    body: referencedComponent.body,
                                    position: 'previous',
                                    placement: direction
                                };
                            } else {
                                // It's a direct string (no matching component found)
                                textComponent = {
                                    type: 'text',
                                    name: `${componentData.name}_${direction}`, // Generate a unique name
                                    body: { value: placementValue },
                                    position: 'previous',
                                    placement: direction
                                };
                            }
                            
                            if (textComponent) {
                                pages[pages.length - 1].push(textComponent);
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component definition not found for name: ${componentNameToShow}`, command);
                }
                break;
            case "hide":
                const componentNameToHide = command.value;
                const componentToHide = pages[pages.length - 1].find(comp => comp.name === componentNameToHide);

                if (componentToHide) {
                    const index = pages[pages.length - 1].indexOf(componentToHide);
                    if (index > -1) {
                        pages[pages.length - 1].splice(index, 1);
                    }
                } else {
                    causeCompileError(`Component "${componentNameToHide}" not found on the current page.`, command);
                }
                break;
            case "set": {
                const name = command.name;
                const property = command.target;
                const index = command.args.index;
                const newValue = command.args.value;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);
                const isValidIndex = Number.isInteger(index) && index >= 0;

                // Check if in bounds
                if (targetObject) {
                    const body = targetObject.body;
                    
                    // Special handling for text components which don't use arrays
                    if (targetObject.type === "text") {
                        // For text components, set properties directly
                        if (property === "value") {
                            body[property] = newValue;
                        } else {
                            causeCompileError(`Invalid property for text component\n\nProperty: ${property}\nComponent: ${name}`, command);
                        }
                    } else {
                        // Original array-based handling for other components
                        const currentArray = body[property]
                        
                        // If property does not exist, create array of null of length property "value"
                        if (!currentArray) {
                            body[property] = Array(newValue.length).fill(null);
                            body[property][index] = newValue;
                        } else if (isValidIndex) {
                            currentArray[index] = newValue;
                        } else {
                            causeCompileError(`Index out of bounds\n\nIndex: ${index}\nProperty: ${property}\nComponent: ${name}`, command);
                        }
                    }
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            case "set_multiple": {
                // command.args is an array e.g. [1,2,3,"_",2]
                // [1,2,3,"_",2] should set any array to [1,2,3,<prev_val_at_i=3>,2]
                // ["_","_","_",2] should keep the first 3 elements replace the 4th with 2 and cut off the rest (if exists)
                // ["_","_","_",2,"_"] should keep the whole array also all "overflowing elements" but replace the 4th value with 2
                const name = command.name;
                const property = command.target;
                const args = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);
                // Check if in bounds

                if (targetObject) {
                    const body = targetObject.body;
                    const currentArray = body[property];
                    // If property does not exist, create array of null of length args
                    if (!currentArray) {
                        body[property] = Array(args.length).fill(null);
                    }
                    // Iterate over args and set the values
                    for (let i = 0; i < args.length; i++) {
                        const value = args[i];
                        const isValidIndex = Number.isInteger(i) && i >= 0;
                        if (value !== "_") {
                            if (isValidIndex) {
                                body[property][i] = value;
                            } else {
                                causeCompileError(`Index ${i} out of bounds for property "${property}" on component "${name}".`, command);
                            }
                        }
                    }
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            case "set_matrix": {
                const name = command.name;
                const property = command.target;
                const row = command.args.row;
                const col = command.args.col;
                const newValue = command.args.value;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const currentMatrix = body[property];
                    
                    // If property does not exist, create 2D array
                    if (!currentMatrix) {
                        body[property] = [];
                    }
                    
                    // Ensure the row exists
                    if (!body[property][row]) {
                        body[property][row] = [];
                    }
                    
                    // Set the value
                    body[property][row][col] = newValue;
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            case "set_matrix_multiple": {
                const name = command.name;
                const property = command.target;
                const newMatrix = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const currentMatrix = body[property];
                    
                    // If property does not exist, create 2D array filled with null
                    if (!currentMatrix) {
                        body[property] = Array(newMatrix.length).fill(null).map(() => 
                            Array(newMatrix[0] ? newMatrix[0].length : 0).fill(null)
                        );
                    }
                    
                    // Iterate over the matrix and set values, preserving "_" placeholders
                    for (let row = 0; row < newMatrix.length; row++) {
                        if (!body[property][row]) {
                            body[property][row] = Array(newMatrix[row] ? newMatrix[row].length : 0).fill(null);
                        }
                        
                        if (newMatrix[row]) {
                            for (let col = 0; col < newMatrix[row].length; col++) {
                                const value = newMatrix[row][col];
                                if (value !== "_") {
                                    body[property][row][col] = value;
                                }
                            }
                        }
                    }
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            case "add": {
                const name = command.name;
                const target = command.target;
                const args = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (!body[target]) {
                        body[target] = [];
                    }
                    const insertIndex = body[target].length;
                    
                    // Handle different argument structures
                    if (target === "nodes" && args && typeof args === 'object' && args.index !== undefined) {
                        // New format: addNode(nodeName, nodeValue)
                        const nodeName = args.index; // For nodes, 'index' contains the node name
                        const nodeValue = args.value;
                        
                        body[target].push(nodeName);
                        
                        // If a value is provided, add it to the value array
                        if (nodeValue !== undefined) {
                            if (!body.value) {
                                body.value = [];
                            }
                            // Ensure value array is same length as nodes array
                            while (body.value.length < body[target].length - 1) {
                                body.value.push(null);
                            }
                            body.value.push(nodeValue);
                        }
                    } else {
                        // Original format: just add the value directly
                        body[target].push(args);
                    }
                    
                    // Maintain consistency across all array properties for all component types
                    maintainArrayPropertyConsistency(body, target, insertIndex, "add");
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }

                break;
            }
            case "insert": {
                const name = command.name;
                const target = command.target;
                const index = command.args.index;
                const value = command.args.value;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (!body[target]) {
                        body[target] = [];
                    }
                    const isValidIndex = Number.isInteger(index) && index >= 0 && index <= body[target].length;
                    if (isValidIndex) {
                        body[target].splice(index, 0, value);
                        
                        // Maintain consistency across all array properties for all component types
                        maintainArrayPropertyConsistency(body, target, index, "insert");
                    } else {
                        causeCompileError(`Index ${index} out of bounds for insertion in property "${target}" on component "${name}".`, command);
                    }
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            case "remove": {
                const name = command.name;
                const target = command.target;
                const value = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (body[target]) {
                        let removedIndex = -1;
                        
                        // Special handling for graph edges which are objects with start and end properties
                        if (target === "edges" && targetObject.type === "graph" && typeof value === 'object' && value.start && value.end) {
                            // Find the edge with matching start and end nodes
                            const edgeIndex = body[target].findIndex(edge => 
                                edge.start === value.start && edge.end === value.end
                            );
                            
                            if (edgeIndex > -1) {
                                body[target].splice(edgeIndex, 1);
                                removedIndex = edgeIndex;
                            } else {
                                causeCompileError(`Edge from "${value.start}" to "${value.end}" not found in property "${target}" on component "${name}".`, command);
                            }
                        } else {
                            const index = body[target].indexOf(value);
                            if (index > -1) {
                                body[target].splice(index, 1);
                                removedIndex = index;
                            } else {
                                causeCompileError(`Value "${value}" not found in property "${target}" on component "${name}".`, command);
                            }
                        }
                        
                        // Maintain consistency across all array properties for all component types
                        if (removedIndex > -1) {
                            maintainArrayPropertyConsistency(body, target, removedIndex, "remove");
                        }
                    } else {
                        causeCompileError(`Property "${target}" not found on component "${name}".`, command);
                    }
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            case "remove_at": {
                const name = command.name;
                const index = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const arrayProperties = ["arrow", "color", "value", "nodes"];
                    
                    // Check if the index is valid for at least one property
                    let hasValidIndex = false;
                    arrayProperties.forEach(property => {
                        if (body[property] && Array.isArray(body[property]) && 
                            index >= 0 && index < body[property].length) {
                            hasValidIndex = true;
                        }
                    });
                    
                    if (!hasValidIndex) {
                        causeCompileError(`Index ${index} is out of bounds for all array properties on component "${name}".`, command);
                    }
                    
                    // Remove element at the specified index from all array properties
                    arrayProperties.forEach(property => {
                        if (body[property] && Array.isArray(body[property]) && 
                            index >= 0 && index < body[property].length) {
                            body[property].splice(index, 1);
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }

        }
    });

    postCheck(pages);

    // Generate the mermaid string with dynamic sizing
    const { width, height } = getMermaidContainerSize();
    let mermaidString = "visual\n";
    mermaidString += `size: (${width},${height})\n`;
    for (const page of pages) {
        mermaidString += "page\n"
        
        // Add layout information if available
        if (page._layout) {
            mermaidString += `layout: (${page._layout[0]},${page._layout[1]})\n`;
        }
        
        for (const component of page) {
            // Skip internal page properties
            if (component.type) {
                const currentLayout = page._layout || [3, 3]; // Default to 3x3
                
                switch (component.type) {
                    case "array":
                        mermaidString += generateArray(component, currentLayout);
                        break;
                    case "linkedlist":
                        mermaidString += generateLinkedlist(component, currentLayout);
                        break;
                    case "stack":
                        mermaidString += generateStack(component, currentLayout);
                        break;
                    case "tree":
                        mermaidString += generateTree(component, currentLayout);
                        break;
                    case "matrix":
                        mermaidString += generateMatrix(component, currentLayout);
                        break;
                    case "graph":
                        mermaidString += generateGraph(component, currentLayout);
                        break;
                    case "text":
                        mermaidString += generateText(component, currentLayout);
                        break;
                    default:
                        console.log(`Compile Error! No matching component type: ${component.type}!`)
                        break;
                }
            }
        }
    }

    return {
        mermaidString,
        compiled_pages: pages,
    }
}

function preCheck(parsedDSL) {
    if (!parsedDSL || !parsedDSL.defs || !parsedDSL.cmds) {
        throw new Error("Nothing to show\nPlease define an object and a page, then show it using the 'show' command");
    }

    // Check for duplicate component names
    const names = new Set();
    parsedDSL.defs.forEach(def => {
        if (names.has(def.name)) {
            throw new Error(`Duplicate component name found: ${def.name}`);
        }
        names.add(def.name);
    });

    // Check for valid command types
    parsedDSL.cmds.forEach(cmd => {
        if (!["page", "show", "hide", "set", "set_multiple", "set_matrix", "set_matrix_multiple", "add", "insert", "remove", "remove_at", "comment"].includes(cmd.type)) {
            throw new Error(`Unknown command type: ${cmd.type}`);
        }
    });

    // Check if the first command is a page
    if (parsedDSL.cmds[0].type !== "page") {
        setError("No page command found\nPlease start a page using the 'page' command before using any other commands.");
        return;
    }
}

function postCheck(pages) {
    // Check if there is at least one page
    if (pages.length === 0) {
        throw new Error("No pages found. Please define at least one page with components.");
    }

    // For each page, check if it has at least one component
    pages.forEach((page, index) => {
        if (page.length === 0) {
            throw new Error(`Page ${index + 1} is empty. \nPlease add at least one component to the page using the 'show' command.`);
        }
    });
}