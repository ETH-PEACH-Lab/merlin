// myCompiler to convert myDSL into mermaid code

import { parserMyDSL } from "../parser/test.mjs";
import { generateArray } from "./generateArray.mjs";
import { generateLinkedlist } from "./generateLinkedlist.mjs";
import { generateStack } from "./generateStack.mjs";
import { generateTree } from "./generateTree.mjs";
import { generateMatrix } from "./generateMatrix.mjs";
import { generateGraph } from "./generateGraph.mjs";

export function convertDSLtoMermaid (input) { //input is user's myDSL string 
    const parsedDSL = parserMyDSL(input);
    // console.log(JSON.stringify(parsedData["draw"], null, 1));
    const data_commands = parsedDSL["data"];
    const draw_commands = parsedDSL["draw"];
    // draw_commands.forEach(element => {
    //     console.log(element);
    // });

    // create the showTable from parsedDSL
    let showTable = {}; // store all shown unit

    // generate showTable from draw commands
    draw_commands.forEach((draw_command) => {
        const page_index = draw_command["page_index"];
        const startPage = draw_command["range"]["start"];
        const endPage = draw_command["range"]["end"];
        const components_show = draw_command["show"];

        // console.log(page_index, "\n", startPage, "\n", endPage, "\n", components_show);
        // console.log("components_show: ", components_show);

        for (let p = startPage; p < endPage + 1; p ++) { // generate for each page
            showTable[`page${p}`] = {}
            let component_counter = 0; // used for generate component_id

            components_show.forEach((component_show) => {

                let component_index_expression = component_show.component_index;
                let component_name =component_show.component_name;
                let component_data_index = cacalculateIndex(page_index, p, component_index_expression); // index in data part, to retrive data from parsedData
                let component_data = findItemByComponentNameAndIndex(data_commands, component_name, component_data_index);

                showTable[`page${p}`][`component_${component_counter}`] = {
                    type: component_data.type,
                    name: component_name,
                    index: component_data_index, 
                    attributes: component_data.attributes,
                }

                component_counter += 1;
                }
            )
        };
    });
    console.log("showTable:\n", JSON.stringify(showTable, null, 1));
    // console.log(JSON.stringify(data_commands));

    // use showTable generate mermaid code
    let mermaidString = "visual\n";
    const pageKeys = Object.keys(showTable);
    for (const pageKey of pageKeys) {
        mermaidString += "page\n"
        const componentKeys = Object.keys(showTable[pageKey]);
        for (const componentKey of componentKeys) {
            const component = showTable[pageKey][componentKey];
            // mermaidString += `${component.type}\n`
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
                    console.log(`compiler error! no matching componenet type: ${component.type}!`)
                    break;
            }
        }
    }

    // console.log("mermaidString:", "\n", mermaidString);
    return mermaidString;
}

function cacalculateIndex(variableName, variableValue, expression) {
    // Create a regular expression to find the variable in the expression
    const regex = new RegExp(`\\b${variableName}\\b`, 'g');
    
    // Replace the variable in the expression with its value
    const replacedExpression = expression.replace(regex, variableValue);
    
    // Evaluate the resulting expression
    try {
        const result = eval(replacedExpression);
        return result;
    } catch (error) {
        console.error("Error evaluating expression:", error);
        return null;
    }
}

function findItemByComponentNameAndIndex(data_commands, componentName, componentIndex) {
    // Loop through the "data" array to find the object with the matching componentName
    for (const component of data_commands) {
        if (component.name === componentName) {
            // Extract the attributes and select only the specified componentIndex element
            const filteredAttributes = {};
            for (const [key, value] of Object.entries(component.attributes)) {
                if (Array.isArray(value)) {
                    filteredAttributes[key] = value[componentIndex] || null;
                } else {
                    filteredAttributes[key] = value; // Handle non-array values if any
                }
            }
            // Return the type and filtered attributes of the matching item
            return {
                type: component.type,
                attributes: filteredAttributes
            };
        }
    }
    // If no matching item is found, return null
    console.log(`name: ${componentName} matches no entries!`);
    return null;
}
