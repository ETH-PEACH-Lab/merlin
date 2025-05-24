// myCompiler to convert myDSL into mermaid code

import { generateArray } from "./types/generateArray.mjs"
import { generateLinkedlist } from "./types/generateLinkedlist.mjs";
import { generateStack } from "./types/generateStack.mjs";
import { generateTree } from "./types/generateTree.mjs";
import { generateMatrix } from "./types/generateMatrix.mjs";
import { generateGraph } from "./types/generateGraph.mjs";

export default function convertParsedDSLtoMermaid(parsedDSL) {
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

                // Check if in bounds
                if (targetObject) {
                    const body = targetObject.body;
                    const currentArray = body[property]
                    
                    // If property does not exist, create array of null of length property "value"
                    if (!currentArray) {
                        body[property] = Array(newValue.length).fill(null);
                        body[property][index] = newValue;
                    } else if (index < currentArray.length) {
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
                    if (currentArray) {
                        // Check if args is an array
                        if (Array.isArray(args)) {
                            for (let i = 0; i < args.length; i++) {
                                if (args[i] !== "_") {
                                    currentArray[i] = args[i];
                                }
                            }
                        } else {
                            causeCompileError(`Expected an array for property "${property}" on component "${name}".`, command);
                        }
                    } else {
                        causeCompileError(`Property "${property}" not found on component "${name}".`, command);
                    }
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
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
        if (!["page", "show", "hide", "set", "set_multiple"].includes(cmd.type)) {
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