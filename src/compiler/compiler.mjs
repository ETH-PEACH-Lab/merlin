// myCompiler to convert myDSL into mermaid code

import { generateArray } from "./types/generateArray.mjs"
import { generateLinkedlist } from "./types/generateLinkedlist.mjs";
import { generateStack } from "./types/generateStack.mjs";
import { generateTree } from "./types/generateTree.mjs";
import { generateMatrix } from "./types/generateMatrix.mjs";
import { generateGraph } from "./types/generateGraph.mjs";

export default function convertParsedDSLtoMermaid(parsedDSLOriginal) {
    // Deep copy to avoid mutating the original parsed DSL
    const parsedDSL = JSON.parse(JSON.stringify(parsedDSLOriginal));
    
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

    commands.forEach((command) => {
        switch (command.type) {
            case "page":
                // Keep previous page if exists
                if (pages.length > 0) {
                    const lastPage = JSON.parse(JSON.stringify(pages[pages.length - 1]));
                    pages.push(lastPage);
                } else {
                    pages.push([]);
                }
                break;
            case "show":
                const componentNameToShow = command.value;
                const componentData = findComponentDefinitionByName(definitions, componentNameToShow);

                if (componentData) {
                    pages[pages.length - 1].push({
                        type: componentData.type,
                        name: componentData.name,
                        body: componentData.body,
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
                    const currentArray = body[property]
                    
                    // If property does not exist, create array of null of length property "value"
                    if (!currentArray) {
                        body[property] = Array(newValue.length).fill(null);
                        body[property][index] = newValue;
                    } else if (isValidIndex) {
                        currentArray[index] = newValue;
                    } else {
                        causeCompileError(`Index ${index} out of bounds for property "${property}" on component "${name}".`, command);
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
                const value = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (!body[target]) {
                        body[target] = [];
                    }
                    body[target].push(value);
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
                        // For arrays with primitive values, find by value
                        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
                            const index = body[target].indexOf(value);
                            if (index > -1) {
                                body[target].splice(index, 1);
                            } else {
                                causeCompileError(`Value "${value}" not found in property "${target}" on component "${name}".`, command);
                            }
                        } 
                        // For objects (nodes, edges), find by matching properties
                        else if (typeof value === 'object' && value !== null) {
                            let found = false;
                            for (let i = body[target].length - 1; i >= 0; i--) {
                                const item = body[target][i];
                                // For nodes, compare by name
                                if (value.name && item.name === value.name) {
                                    body[target].splice(i, 1);
                                    found = true;
                                    break;
                                }
                                // For edges, compare by start and end
                                else if (value.start && value.end && item.start === value.start && item.end === value.end) {
                                    body[target].splice(i, 1);
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                causeCompileError(`Object not found in property "${target}" on component "${name}".`, command);
                            }
                        }
                    } else {
                        causeCompileError(`Property "${target}" not found on component "${name}".`, command);
                    }
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }

        }
    });

    postCheck(pages);

    // Generate the mermaid string
    let mermaidString = "visual\n";
    for (const page of pages) {
        mermaidString += "page\n"
        for (const component of page) {
            switch (component.type) {
                case "array":
                    mermaidString += generateArray(component);
                    break;
                case "linkedlist":
                    mermaidString += generateLinkedlist(component);
                    break;
                case "stack":
                    mermaidString += generateStack(component);
                    break;
                case "tree":
                    mermaidString += generateTree(component);
                    break;
                case "matrix":
                    mermaidString += generateMatrix(component);
                    break;
                case "graph":
                    mermaidString += generateGraph(component);
                    break;
                default:
                    console.log(`Compile Error! No matching component type: ${component.type}!`)
                    break;
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
        if (!["page", "show", "hide", "set", "set_multiple", "set_matrix", "set_matrix_multiple", "add", "insert", "remove"].includes(cmd.type)) {
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