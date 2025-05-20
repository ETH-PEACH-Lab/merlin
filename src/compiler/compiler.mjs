// myCompiler to convert myDSL into mermaid code

import { generateArray } from "./types/generateArray.mjs"
import { generateLinkedlist } from "./types/generateLinkedlist.mjs";
import { generateStack } from "./types/generateStack.mjs";
import { generateTree } from "./types/generateTree.mjs";
import { generateMatrix } from "./types/generateMatrix.mjs";
import { generateGraph } from "./types/generateGraph.mjs";

export default function convertParsedDSLtoMermaid (parsedDSL) {
    const definitions = parsedDSL.defs; 
    const commands = parsedDSL.cmds;

    // Helper function to find a component definition by its name
    function findComponentDefinitionByName(defs, name) {
        const definition = defs.find(def => def.name === name);
        if (definition) {
            return {
                type: definition.type,
                name: definition.name,
                body: definition.body, 
            };
        }
        console.error(`Component definition not found for name: ${name}`);
        return null;
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
                    console.warn(`Could not show component "${componentNameToShow}": definition not found.`);
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
                    console.warn(`Could not hide component "${componentNameToHide}": not found on the current page.`);
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
                    if (currentArray && index < currentArray.length) {
                        currentArray[index] = newValue;
                    } else {
                        console.error(`Index ${index} out of bounds for component "${name}".`);
                    }
                } else {
                    console.error(`Component "${name}" not found on the current page.`);
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
                            console.error(`Args is not an array for component "${name}".`);
                        }
                    } else {
                        console.error(`Property "${property}" not found on component "${name}".`);
                    }
                } else {
                    console.error(`Component "${name}" not found on the current page.`);
                }
            }
                
        }
    });

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
