import { expandPositionWithLayout, inferLayoutFromKeywords } from '../utils/positionUtils.mjs';
import { isMethodSupported } from '../components/languageConfig.js';
import { getMethodNameFromCommand } from '../parser/reconstructor.mjs';

import { generateArray } from "./types/generateArray.mjs"
import { generateLinkedlist } from "./types/generateLinkedlist.mjs";
import { generateStack } from "./types/generateStack.mjs";
import { generateTree } from "./types/generateTree.mjs";
import { generateMatrix } from "./types/generateMatrix.mjs";
import { generateGraph } from "./types/generateGraph.mjs";
import { generateText } from "./types/generateText.mjs";
import { getMermaidContainerSize } from "../utils/positionUtils.mjs";
import { generateNodeName } from '../utils/dslUtils.mjs';

// Helper function to maintain consistency across array properties when modifying arrays
function maintainArrayPropertyConsistency(body, modifiedProperty, index, operation, componentType = null) {
    maintainArrayPropertyConsistencyExcept(body, modifiedProperty, index, operation, componentType, null);
}

// Helper function to maintain consistency across array properties when modifying arrays, with exception for specific properties
function maintainArrayPropertyConsistencyExcept(body, modifiedProperty, index, operation, componentType = null, exceptProperty = null) {
    maintainArrayPropertyConsistencyExceptMultiple(body, modifiedProperty, index, operation, componentType, exceptProperty ? [exceptProperty] : []);
}

// Helper function to maintain consistency across array properties when modifying arrays, with exceptions for multiple properties
function maintainArrayPropertyConsistencyExceptMultiple(body, modifiedProperty, index, operation, componentType = null, exceptProperties = []) {
    // Define the properties that should be kept in sync for different component types
    let arrayProperties = ["arrow", "color", "value", "hidden"];
    
    // Include "nodes" for component types that use nodes
    if (componentType === "linkedlist" || componentType === "tree" || componentType === "graph") {
        arrayProperties.push("nodes");
    }
    
    // Note: "children" property is NOT included because it contains relationship objects,
    // not values indexed by node position, so it should be handled separately
    
    // First, find the target length based on the modified property
    const targetLength = body[modifiedProperty] ? body[modifiedProperty].length : 0;
    
    arrayProperties.forEach(property => {
        // Skip the exception properties if specified
        if (exceptProperties.includes(property)) {
            return;
        }
        
        if (property !== modifiedProperty && body[property]) {
            const currentLength = body[property].length;
            
            switch (operation) {
                case "insert":
                    // Ensure the array is long enough before inserting
                    while (body[property].length < index) {
                        body[property].push(null);
                    }
                    // Insert appropriate value at the same index to maintain alignment
                    if (property === "nodes" && (componentType === "linkedlist" || componentType === "tree" || componentType === "graph")) {
                        // For nodes, generate a new node name instead of inserting null
                        const newNodeName = generateNodeName(body.nodes, componentType);
                        body[property].splice(index, 0, newNodeName);
                    } else {
                        // For other properties, insert null
                        body[property].splice(index, 0, null);
                    }
                    break;
                case "add":
                    // Ensure the array has the same length as the target (minus 1 since we just added)
                    while (body[property].length < targetLength - 1) {
                        body[property].push(null);
                    }
                    // Add appropriate value to maintain alignment
                    if (property === "nodes" && (componentType === "linkedlist" || componentType === "tree" || componentType === "graph")) {
                        // For nodes, generate a new node name instead of adding null
                        const newNodeName = generateNodeName(body.nodes, componentType);
                        body[property].push(newNodeName);
                    } else {
                        // For other properties, add null
                        body[property].push(null);
                    }
                    break;
                case "remove":
                    // Remove element at the same index to maintain alignment
                    if (index < body[property].length) {
                        body[property].splice(index, 1);
                    }
                    break;
            }
        } else if (property !== modifiedProperty && !body[property] && !exceptProperties.includes(property)) {
            // If the property doesn't exist, create it with the appropriate length
            switch (operation) {
                case "insert":
                case "add":
                    if (property === "nodes" && (componentType === "linkedlist" || componentType === "tree" || componentType === "graph")) {
                        // For nodes, generate appropriate node names
                        body[property] = [];
                        for (let i = 0; i < targetLength; i++) {
                            const newNodeName = generateNodeName(body.nodes, componentType);
                            body[property].push(newNodeName);
                        }
                    } else {
                        // For other properties, fill with nulls
                        body[property] = Array(targetLength).fill(null);
                    }
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

// Helper function to properly quote node names when necessary
function formatNodeName(nodeName) {
    // If nodeName is null, undefined, or empty, return as is
    if (nodeName == null || nodeName === "") {
        return nodeName;
    }
    
    // Convert to string for processing
    const nodeStr = String(nodeName);
    
    // If it's a number (including negative numbers and decimals), don't quote
    if (/^-?\d+(\.\d+)?$/.test(nodeStr)) {
        return nodeStr;
    }
    
    // If it contains any non-alphanumeric characters (excluding underscores), wrap in quotes
    if (/[^a-zA-Z0-9_]/.test(nodeStr) || nodeStr !== nodeStr.trim()) {
        return `"${nodeStr.replace(/"/g, '\\"')}"`;
    }
    
    // For simple alphanumeric strings with underscores only, return as is
    return nodeStr;
}

// Helper function to handle null values vs "null" strings
function formatNullValue(value) {
    if (value === null || value === undefined) {
        return "null";
    }
    if (value === "null") {
        return "\\\\null";
    }
    return value;
}

// Helper function to recursively find all descendant nodes of a given parent node in a tree
function findAllDescendants(parentNode, children) {
    const descendants = new Set();
    
    function findDirectChildren(parent) {
        if (!children || !Array.isArray(children)) return [];
        return children.filter(child => child && child.start === parent).map(child => child.end);
    }
    
    function collectDescendants(node) {
        const directChildren = findDirectChildren(node);
        for (const child of directChildren) {
            if (!descendants.has(child)) {
                descendants.add(child);
                collectDescendants(child); // Recursively collect descendants
            }
        }
    }
    
    collectDescendants(parentNode);
    return Array.from(descendants);
}

// Helper function to remove a single node and all edges/relationships involving it
function removeNodeAndRelatedElements(body, nodeName, targetObject) {
    let removedIndex = -1;
    
    // Remove the node from nodes array
    if (body.nodes && Array.isArray(body.nodes)) {
        const index = body.nodes.indexOf(nodeName);
        if (index > -1) {
            body.nodes.splice(index, 1);
            removedIndex = index;
        }
    }
    
    // Handle different component types differently
    if (targetObject.type === "linkedlist") {
        // For linked lists: reconnect the previous and next nodes
        if (body.edges && Array.isArray(body.edges)) {
            let prevNode = null;
            let nextNode = null;
            
            // Find connections involving the removed node
            body.edges.forEach(edge => {
                if (edge.end === nodeName) {
                    prevNode = edge.start;
                } else if (edge.start === nodeName) {
                    nextNode = edge.end;
                }
            });
            
            // Remove all edges involving the deleted node
            body.edges = body.edges.filter(edge => {
                return edge.start !== nodeName && edge.end !== nodeName;
            });
            
            // If both previous and next nodes exist, connect them
            if (prevNode && nextNode) {
                body.edges.push({ start: prevNode, end: nextNode });
            }
        }
    } else if (targetObject.type === "tree") {
        // For trees: reconnect children to parent
        if (body.children && Array.isArray(body.children)) {
            let parentNode = null;
            const childNodes = [];
            
            // Find parent and children of the removed node
            body.children.forEach(child => {
                if (child.end === nodeName) {
                    parentNode = child.start;
                } else if (child.start === nodeName) {
                    childNodes.push(child.end);
                }
            });
            
            // Remove all children relationships involving the deleted node
            body.children = body.children.filter(child => {
                return child.start !== nodeName && child.end !== nodeName;
            });
            
            // If there's a parent, connect all children to the parent
            if (parentNode && childNodes.length > 0) {
                childNodes.forEach(childNode => {
                    body.children.push({ start: parentNode, end: childNode });
                });
            }
        }
    } else if (targetObject.type === "graph") {
        // For graphs: smart reconnection - connect neighbors to the first neighbor with lowest index
        if (body.edges && Array.isArray(body.edges)) {
            const connectedNodes = new Set();
            
            // Find all nodes connected to the removed node
            body.edges.forEach(edge => {
                if (edge.start === nodeName) {
                    connectedNodes.add(edge.end);
                } else if (edge.end === nodeName) {
                    connectedNodes.add(edge.start);
                }
            });
            
            // Remove all edges involving the deleted node
            body.edges = body.edges.filter(edge => {
                return edge.start !== nodeName && edge.end !== nodeName;
            });
            
            // If there are connected nodes, find the one with the lowest index and connect others to it
            if (connectedNodes.size > 1) {
                const connectedNodesList = Array.from(connectedNodes);
                
                // Find the node with the lowest index (or first alphabetically if no indices)
                let hubNode = connectedNodesList[0];
                let lowestIndex = body.nodes ? body.nodes.indexOf(hubNode) : -1;
                
                connectedNodesList.forEach(node => {
                    const nodeIndex = body.nodes ? body.nodes.indexOf(node) : -1;
                    if (nodeIndex !== -1 && (lowestIndex === -1 || nodeIndex < lowestIndex)) {
                        hubNode = node;
                        lowestIndex = nodeIndex;
                    }
                });
                
                // Connect all other nodes to the hub node
                connectedNodesList.forEach(node => {
                    if (node !== hubNode) {
                        // Check if edge already exists to avoid duplicates
                        const edgeExists = body.edges.some(edge => 
                            (edge.start === hubNode && edge.end === node) || 
                            (edge.start === node && edge.end === hubNode)
                        );
                        
                        if (!edgeExists) {
                            body.edges.push({ start: hubNode, end: node });
                        }
                    }
                });
            }
        }
    } else {
        // For other component types: just remove all edges/relationships (original behavior)
        if (body.edges && Array.isArray(body.edges)) {
            body.edges = body.edges.filter(edge => {
                if (!edge || typeof edge !== 'object') return false;
                return edge.start !== nodeName && edge.end !== nodeName;
            });
        }
        
        if (body.children && Array.isArray(body.children)) {
            body.children = body.children.filter(child => {
                if (!child || typeof child !== 'object') return false;
                return child.start !== nodeName && child.end !== nodeName;
            });
        }
    }
    
    return removedIndex;
}

// Helper function to convert node name to index for trees and graphs
function getNodeIndex(targetObject, nodeNameOrIndex) {
    // If it's already a number, return it
    if (typeof nodeNameOrIndex === 'number') {
        return nodeNameOrIndex;
    }
    
    // If it's a string (node name), find its index
    if (typeof nodeNameOrIndex === 'string' && targetObject.body.nodes) {
        const index = targetObject.body.nodes.indexOf(nodeNameOrIndex);
        if (index === -1) {
            return null; // Node not found
        }
        return index;
    }
    
    return null; // Invalid input
}

// Helper function to initialize value array with node names if no value array exists
function initializeValueArrayWithNodeNames(body) {
    if (!body.value && body.nodes && Array.isArray(body.nodes)) {
        // Only initialize if value is completely missing (not if it's an array of nulls)
        body.value = [...body.nodes]; // Copy node names as values
        return true;
    }
    return false;
}

// Helper function to detect cycles in a tree
function hasTreeCycle(nodes, children) {
    if (!Array.isArray(nodes) || !Array.isArray(children)) return false;
    // Build adjacency list
    const adj = {};
    nodes.forEach(n => { adj[n] = []; });
    children.forEach(edge => {
        if (edge && edge.start && edge.end) {
            adj[edge.start].push(edge.end);
        }
    });
    // DFS to detect cycle
    const visited = new Set();
    const recStack = new Set();
    function dfs(node) {
        if (!adj[node]) return false;
        if (recStack.has(node)) return true;
        if (visited.has(node)) return false;
        visited.add(node);
        recStack.add(node);
        for (const child of adj[node]) {
            if (dfs(child)) return true;
        }
        recStack.delete(node);
        return false;
    }
    // Check all roots (nodes not listed as any child)
    const allChildren = new Set(children.map(e => e && e.end).filter(Boolean));
    const roots = nodes.filter(n => !allChildren.has(n));
    // If no root, just check all nodes
    const startNodes = roots.length ? roots : nodes;
    for (const node of startNodes) {
        if (dfs(node)) return true;
    }
    return false;
}

export { formatNodeName, formatNullValue };

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

    // Helper function to check if a position/slot is already occupied
    function checkSlotOccupancy(currentPage, layout, position, excludeComponentName = null) {
        if (!position || !currentPage._layout) return;
        
        const occupiedSlots = new Set();
        
        // Track occupied positions for all existing components on the page
        currentPage.forEach(component => {
            // Skip the component that's being updated
            if (excludeComponentName && component.name === excludeComponentName) {
                return;
            }
            
            if (component.position && component.position.x !== undefined && component.position.y !== undefined) {
                // Handle ranged positions
                for (let x = component.position.x; x < component.position.x + (component.position.width || 1); x++) {
                    for (let y = component.position.y; y < component.position.y + (component.position.height || 1); y++) {
                        occupiedSlots.add(`${x},${y}`);
                    }
                }
            }
        });
        
        // Check if the new position conflicts
        if (position.x !== undefined && position.y !== undefined) {
            for (let x = position.x; x < position.x + (position.width || 1); x++) {
                for (let y = position.y; y < position.y + (position.height || 1); y++) {
                    const slotKey = `${x},${y}`;
                    if (occupiedSlots.has(slotKey)) {
                        return `Slot already occupied\n\nPosition: (${x},${y})`;
                    }
                }
            }
        }
        
        return null; // No conflict
    }

    commands.forEach((command) => {
        // Add method validation for component operations
        if (command.name && [
            'set', 'set_multiple', 'set_matrix', 'set_matrix_multiple',
            'add', 'insert', 'remove', 'remove_at', 'remove_subtree',
            'add_child', 'set_child', 'add_matrix_row', 'add_matrix_column',
            'remove_matrix_row', 'remove_matrix_column', 'add_matrix_border', 'insert_matrix_row', 'insert_matrix_column', 'set_text', 'set_chained'
        ].includes(command.type)) {
            const targetObject = pages.length > 0 ? pages[pages.length - 1]?.find(comp => comp.name === command.name) : null;
            if (targetObject) {
                const methodName = getMethodNameFromCommand(command);
                if (methodName) {
                    // For chained commands, validate against text object methods instead
                    if (command.type === 'set_chained') {
                        if (!isMethodSupported('text', methodName)) {
                            causeCompileError(`Method not supported on linked text object\n\nMethod: ${methodName}\nComponent type: text\nParent component: ${command.name}`, command);
                        }
                    } else if (!isMethodSupported(targetObject.type, methodName)) {
                        causeCompileError(`Method not supported\n\nMethod: ${methodName}\nComponent type: ${targetObject.type}\nComponent: ${command.name}`, command);
                    } else if (targetObject.type === 'text' && command.type === 'set_multiple') {
                        // Special check for multi-line methods on single-line text objects
                        const body = targetObject.body;
                        const isMultiLineMethod = methodName && (methodName.endsWith('s') || methodName.includes('Multiple'));
                        const hasArrayValue = Array.isArray(body.value);
                        
                        if (isMultiLineMethod && !hasArrayValue) {
                            causeCompileError(`Cannot use multi-line method on single-line text\n\nMethod: ${methodName}\nText type: Single-line\nSuggestion: Use ${methodName.replace(/s$/, '')} instead, or convert to multi-line text with setValue([...])`, command);
                        }
                    }
                }
            }
        }
        
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
                    
                    // Check if component is already present on current page
                    const existingComponentIndex = currentPage.findIndex(comp => comp.name === componentNameToShow);
                    
                    // First expand keywords with layout context, then expand ranged positions
                    let expandedPosition = null;
                    if (command.position) {
                        const keywordExpanded = expandPositionWithLayout(command.position, currentLayout);
                        expandedPosition = keywordExpanded.type === 'keyword' ? 
                            keywordExpanded : expandRangedPosition(keywordExpanded);
                        
                        // Check for slot occupancy only if it's a new component or position is changing
                        let shouldCheckOccupancy = true;
                        if (existingComponentIndex !== -1) {
                            const existingComponent = currentPage[existingComponentIndex];
                            // If position is the same, no need to check occupancy
                            if (JSON.stringify(existingComponent.position) === JSON.stringify(expandedPosition)) {
                                shouldCheckOccupancy = false;
                            }
                        }
                        
                        if (shouldCheckOccupancy) {
                            const excludeComponent = existingComponentIndex !== -1 ? componentNameToShow : null;
                            const occupancyError = checkSlotOccupancy(currentPage, currentLayout, expandedPosition, excludeComponent);
                            if (occupancyError) {
                                causeCompileError(occupancyError, command);
                            }
                        }
                    }
                    
                    if (existingComponentIndex !== -1) {
                        // Component already exists on page - only update position
                        if (expandedPosition) {
                            currentPage[existingComponentIndex].position = expandedPosition;
                        } else {
                            // Remove position if no position specified
                            delete currentPage[existingComponentIndex].position;
                        }
                    } else {
                        // Component doesn't exist - add new component
                        const component = {
                            type: componentData.type,
                            name: componentData.name,
                            body: { ...componentData.body }, // Make a copy to avoid mutating the original
                        };
                        
                        // Initialize value array with node names if needed for trees, graphs, and linkedlists
                        if ((component.type === "tree" || component.type === "graph" || component.type === "linkedlist")) {
                            initializeValueArrayWithNodeNames(component.body);
                        }
                        
                        // Add position information if provided
                        if (expandedPosition) {
                            component.position = expandedPosition;
                        }
                        
                        pages[pages.length - 1].push(component);
                    }
                    
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
                    causeCompileError(`Component not found\n\nName: ${componentNameToShow}`, command);
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
                    causeCompileError(`Component not on page\n\nName: ${componentNameToHide}`, command);
                }
                break;
            case "set": {
                const name = command.name;
                const property = command.target;
                const indexOrNodeName = command.args.index;
                const newValue = command.args.value;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                // Check if in bounds
                if (targetObject) {
                    const body = targetObject.body;

                    // Initialize value array with node names if needed for trees, graphs, and linkedlists
                    if ((targetObject.type === "tree" || targetObject.type === "graph" || targetObject.type === "linkedlist") && property === "value") {
                        initializeValueArrayWithNodeNames(body);
                    }
                    
                    // Handle node name to index conversion for trees, graphs, and linkedlists
                    let index = indexOrNodeName;
                    if (targetObject.type === "tree" || targetObject.type === "graph" || targetObject.type === "linkedlist") {
                        // If it's already a number, use it directly
                        if (typeof indexOrNodeName === 'number') {
                            index = indexOrNodeName;
                        } else if (typeof indexOrNodeName === 'string') {
                            const nodeIndex = getNodeIndex(targetObject, indexOrNodeName);
                            if (nodeIndex !== null) {
                                index = nodeIndex;
                            } else {
                                causeCompileError(`Node not found\n\nNode: ${indexOrNodeName}\nComponent: ${name}`, command);
                                break;
                            }
                        } else {
                            // Handle case where indexOrNodeName might be an object or other type
                            causeCompileError(`Invalid index type\n\nExpected number or node name, got: ${typeof indexOrNodeName}\nIndex: ${indexOrNodeName}\nProperty: ${property}\nComponent: ${name}`, command);
                            break;
                        }
                    } else {
                        // For non-node components, ensure index is a number or undefined (for text objects)
                        if (targetObject.type === "text" && indexOrNodeName === undefined) {
                            // Allow undefined index for text objects (means replace entire value)
                            index = undefined;
                        } else if (typeof indexOrNodeName !== 'number') {
                            causeCompileError(`Invalid index type\n\nExpected number, got: ${typeof indexOrNodeName}\nIndex: ${indexOrNodeName}\nProperty: ${property}\nComponent: ${name}`, command);
                            break;
                        }
                    }
                    
                    const isValidIndex = Number.isInteger(index) && index >= 0;
                    
                    // Special handling for text components
                    if (targetObject.type === "text") {
                        if (property === "value") {
                            // For text components, check if we're setting an array element or the whole value
                            if (index === undefined) {
                                // No index provided - replace entire value
                                // If current value is array and new value is string, replace with string
                                // If current value is string and new value is string, replace with string
                                body[property] = newValue;
                            } else if (isValidIndex) {
                                // Setting a specific line in a multi-line text
                                if (!Array.isArray(body[property])) {
                                    // Convert single string to array if needed
                                    body[property] = [body[property] || ""];
                                }
                                // Ensure array is long enough
                                while (body[property].length <= index) {
                                    body[property].push("");
                                }
                                body[property][index] = newValue;
                            } else {
                                // Setting the entire value (could be string or array)
                                body[property] = newValue;
                            }
                        } else {
                            // For other text properties (fontSize, color, etc.)
                            if (index === undefined) {
                                // No index provided - replace entire property value
                                body[property] = newValue;
                            } else if (isValidIndex) {
                                // Setting array-based property
                                if (!Array.isArray(body[property])) {
                                    // Convert single value to array, preserving existing value
                                    const existingValue = body[property];
                                    body[property] = [];
                                    if (existingValue !== undefined && existingValue !== null) {
                                        body[property][0] = existingValue;
                                    }
                                }
                                // Ensure array is long enough
                                while (body[property].length <= index) {
                                    body[property].push(null);
                                }
                                body[property][index] = newValue;
                            } else {
                                // Setting single value property
                                body[property] = newValue;
                            }
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
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
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
                    
                    // Special handling for text components
                    if (targetObject.type === "text") {
                        // If property does not exist, create array of null of length args
                        if (!body[property]) {
                            body[property] = Array(args.length).fill(null);
                        }
                        // Iterate over args and set the values
                        for (let i = 0; i < args.length; i++) {
                            const value = args[i];
                            const isValidIndex = Number.isInteger(i) && i >= 0;
                            if (value !== "_") {
                                if (isValidIndex) {
                                    // Ensure array is long enough
                                    while (body[property].length <= i) {
                                        body[property].push(null);
                                    }
                                    body[property][i] = value;
                                } else {
                                    causeCompileError(`Index out of bounds\n\nIndex: ${i}\nProperty: ${property}\nComponent: ${name}`, command);
                                }
                            }
                        }
                    } else {
                        // Original handling for other components
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
                                    causeCompileError(`Index out of bounds\n\nIndex: ${i}\nProperty: ${property}\nComponent: ${name}`, command);
                                }
                            }
                        }
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
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
                    
                    // Ensure the matrix has enough rows
                    while (body[property].length <= row) {
                        body[property].push([]);
                    }
                    
                    // Ensure the row has enough columns
                    while (body[property][row].length <= col) {
                        body[property][row].push(null);
                    }
                    
                    // Set the value
                    body[property][row][col] = newValue;
                    
                    // Ensure all rows have the same number of columns
                    const maxColumns = Math.max(...body[property].map(row => row.length));
                    for (let r = 0; r < body[property].length; r++) {
                        while (body[property][r].length < maxColumns) {
                            body[property][r].push(null);
                        }
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
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
                    
                    // If property does not exist, create 2D array
                    if (!currentMatrix) {
                        body[property] = [];
                    }
                    
                    // Calculate dimensions needed
                    const numRows = newMatrix.length;
                    const numCols = Math.max(...newMatrix.map(row => row ? row.length : 0));
                    
                    // Ensure the matrix has enough rows
                    while (body[property].length < numRows) {
                        body[property].push([]);
                    }
                    
                    // Iterate over the matrix and set values, preserving "_" placeholders
                    for (let row = 0; row < newMatrix.length; row++) {
                        // Ensure the row has enough columns
                        while (body[property][row].length < numCols) {
                            body[property][row].push(null);
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
                    
                    // Ensure all rows have the same number of columns
                    const maxColumns = Math.max(...body[property].map(row => row.length));
                    for (let r = 0; r < body[property].length; r++) {
                        while (body[property][r].length < maxColumns) {
                            body[property][r].push(null);
                        }
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
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
                            
                            // Maintain consistency across all array properties EXCEPT value (since we just set it)
                            maintainArrayPropertyConsistencyExcept(body, target, insertIndex, "add", targetObject.type, "value");
                        } else {
                            // Maintain consistency across all array properties for all component types
                            maintainArrayPropertyConsistency(body, target, insertIndex, "add", targetObject.type);
                        }
                    } else {
                        // Original format: just add the value directly
                        body[target].push(args);
                        
                        // Maintain consistency across all array properties for all component types
                        maintainArrayPropertyConsistency(body, target, insertIndex, "add", targetObject.type);
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }

                break;
            }
            case "insert": {
                const name = command.name;
                const target = command.target;
                const indexOrNodeName = command.args.index;
                const value = command.args.value;
                const nodeValue = command.args.nodeValue; // Optional third parameter for insertNode
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    if (!body[target]) {
                        body[target] = [];
                    }
                    
                    // Handle node name to index conversion for trees, graphs, and linkedlists
                    let index = indexOrNodeName;
                    
                    // Handle structured argument case (when parser creates {index: X, value: Y})
                    if (indexOrNodeName && typeof indexOrNodeName === 'object' && indexOrNodeName.index !== undefined) {
                        // Extract the actual index from the structured argument
                        index = indexOrNodeName.index;
                    } else {
                        index = indexOrNodeName;
                    }
                    
                    if (targetObject.type === "tree" || targetObject.type === "graph" || targetObject.type === "linkedlist") {
                        // If it's already a number, use it directly
                        if (typeof index === 'number') {
                            // index is already set correctly above
                        } else if (typeof index === 'string') {
                            const nodeIndex = getNodeIndex(targetObject, index);
                            if (nodeIndex !== null) {
                                index = nodeIndex;
                            } else {
                                causeCompileError(`Node not found\n\nNode: ${index}\nComponent: ${name}`, command);
                                break;
                            }
                        } else {
                            // Handle case where index might be an unexpected type
                            causeCompileError(`Invalid index type\n\nExpected number or node name, got: ${typeof index}\nIndex: ${index}\nProperty: ${target}\nComponent: ${name}`, command);
                            break;
                        }
                    } else {
                        // For non-node components, ensure index is a number
                        if (typeof index !== 'number') {
                            causeCompileError(`Invalid index type\n\nExpected number, got: ${typeof index}\nIndex: ${index}\nProperty: ${target}\nComponent: ${name}`, command);
                            break;
                        }
                    }
                    
                    // Validate index bounds (trees and graphs are more flexible since they append)
                    let isValidIndex;
                    if ((targetObject.type === "tree" || targetObject.type === "graph") && target === "nodes") {
                        // For trees and graphs, just ensure the parent/attachment node exists (if using node name) or index is reasonable
                        isValidIndex = (typeof indexOrNodeName === 'string') || 
                                      (Number.isInteger(index) && index >= 0 && index < body[target].length);
                    } else {
                        // For other types, use strict bounds checking
                        isValidIndex = Number.isInteger(index) && index >= 0 && index <= body[target].length;
                    }
                    if (isValidIndex) {
                        // Special handling for trees and graphs: always append to end, use index/name for relationship
                        if ((targetObject.type === "tree" || targetObject.type === "graph") && target === "nodes") {
                            // For trees and graphs, add node at the end instead of at index position to preserve structure
                            body[target].push(value);
                            const insertionIndex = body[target].length - 1; // Index where we actually inserted
                            
                            // If a third parameter (nodeValue) is provided for insertNode, update the value array
                            if (nodeValue !== undefined) {
                                if (!body.value) {
                                    body.value = [];
                                }
                                // Ensure value array is same length as nodes array before inserting
                                while (body.value.length < body[target].length - 1) {
                                    body.value.push(null);
                                }
                                body.value.push(nodeValue);
                                
                                // Maintain consistency across all array properties EXCEPT value and the target itself (since we just set them)
                                maintainArrayPropertyConsistencyExceptMultiple(body, target, insertionIndex, "add", targetObject.type, ["value", target]);
                            } else {
                                // Maintain consistency across all array properties EXCEPT the target itself (since we just set it)
                                maintainArrayPropertyConsistencyExcept(body, target, insertionIndex, "add", targetObject.type, target);
                            }
                        } else {
                            // For linkedlists and other types: use normal splice insertion at specified index
                            body[target].splice(index, 0, value);
                            
                            // If a third parameter (nodeValue) is provided for insertNode, update the value array
                            if (target === "nodes" && nodeValue !== undefined) {
                                if (!body.value) {
                                    body.value = [];
                                }
                                // Ensure value array is same length as nodes array before inserting
                                while (body.value.length < body[target].length - 1) {
                                    body.value.push(null);
                                }
                                body.value.splice(index, 0, nodeValue);
                                
                                // Maintain consistency across all array properties EXCEPT value and the target itself (since we just set them)
                                maintainArrayPropertyConsistencyExceptMultiple(body, target, index, "insert", targetObject.type, ["value", target]);
                            } else {
                                // Maintain consistency across all array properties EXCEPT the target itself (since we just set it)
                                maintainArrayPropertyConsistencyExcept(body, target, index, "insert", targetObject.type, target);
                            }
                        }
                        
                        // Handle automatic edge/relationship creation for node insertion
                        if (target === "nodes") {
                            const newNodeName = value; // The name of the newly inserted node
                            
                            if (targetObject.type === "graph") {
                                // For graphs: create edge from the specified node to the new node
                                if (body.nodes.length > 1) {
                                    let attachmentNode = null;
                                    
                                    // If the original indexOrNodeName was a string (node name), use it as attachment point
                                    if (typeof indexOrNodeName === 'string') {
                                        attachmentNode = indexOrNodeName;
                                    } else if (typeof indexOrNodeName === 'number') {
                                        // If index was a number, get the node at that index position
                                        if (indexOrNodeName >= 0 && indexOrNodeName < body.nodes.length - 1) {
                                            // -1 because we just added the new node at the end
                                            attachmentNode = body.nodes[indexOrNodeName];
                                        }
                                    }
                                    
                                    // Create the edge if we have an attachment node
                                    if (attachmentNode) {
                                        if (!body.edges) {
                                            body.edges = [];
                                        }
                                        body.edges.push({ start: attachmentNode, end: newNodeName });
                                    }
                                } else if (body.nodes.length > 1) {
                                    // If no edges exist yet, create edges array and connect to specified node
                                    if (!body.edges) {
                                        body.edges = [];
                                    }
                                    
                                    let attachmentNode = null;
                                    
                                    // If the original indexOrNodeName was a string (node name), use it as attachment point
                                    if (typeof indexOrNodeName === 'string') {
                                        attachmentNode = indexOrNodeName;
                                    } else if (typeof indexOrNodeName === 'number') {
                                        // If index was a number, get the node at that index position
                                        if (indexOrNodeName >= 0 && indexOrNodeName < body.nodes.length - 1) {
                                            // -1 because we just added the new node at the end
                                            attachmentNode = body.nodes[indexOrNodeName];
                                        }
                                    }
                                    
                                    if (attachmentNode) {
                                        body.edges.push({ start: attachmentNode, end: newNodeName });
                                    }
                                }
                            } else if (targetObject.type === "tree") {
                                // For trees: create parent-child relationship with specified or appropriate parent
                                if (body.nodes.length > 1) {
                                    let parentNode = null;
                                    
                                    // If the original indexOrNodeName was a string (node name), use it as parent
                                    if (typeof indexOrNodeName === 'string') {
                                        parentNode = indexOrNodeName;
                                    } else if (typeof indexOrNodeName === 'number') {
                                        // If index was a number, get the node at that index position
                                        if (indexOrNodeName >= 0 && indexOrNodeName < body.nodes.length - 1) {
                                            // -1 because we just added the new node at the end
                                            parentNode = body.nodes[indexOrNodeName];
                                        }
                                    }
                                    
                                    // Create the parent-child relationship
                                    if (parentNode) {
                                        if (!body.children) {
                                            body.children = [];
                                        }
                                        body.children.push({ start: parentNode, end: newNodeName });
                                    }
                                }
                            }
                            // For linkedlists: no automatic edge creation needed
                        }
                    } else {
                        causeCompileError(`Insert index out of bounds\n\nIndex: ${index}\nProperty: ${target}\nComponent: ${name}`, command);
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
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
                                causeCompileError(`Edge not found\n\nFrom: ${value.start}\nTo: ${value.end}\nProperty: ${target}\nComponent: ${name}`, command);
                            }
                        } 
                        // Special handling for tree children which are objects with start (parent) and end (child) properties
                        else if (target === "children" && targetObject.type === "tree" && typeof value === 'object' && value.start && value.end) {
                            // Find the child relationship with matching parent and child nodes
                            const childIndex = body[target].findIndex(child => 
                                child.start === value.start && child.end === value.end
                            );
                            
                            if (childIndex > -1) {
                                body[target].splice(childIndex, 1);
                                removedIndex = childIndex;
                            } else {
                                causeCompileError(`Child relationship not found\n\nParent: ${value.start}\nChild: ${value.end}\nProperty: ${target}\nComponent: ${name}`, command);
                            }
                        } 
                        // Special handling for removing a node from a tree: also remove all children relations involving that node
                        else if (target === "nodes" && targetObject.type === "tree") {
                            removedIndex = removeNodeAndRelatedElements(body, value, targetObject);
                            if (removedIndex === -1) {
                                causeCompileError(`Value not found\n\nValue: ${value}\nProperty: ${target}\nComponent: ${name}`, command);
                            }
                        } else {
                            // Special handling for removing a node from a graph: also remove all edges involving that node
                            if (target === "nodes" && targetObject.type === "graph") {
                                removedIndex = removeNodeAndRelatedElements(body, value, targetObject);
                                if (removedIndex === -1) {
                                    causeCompileError(`Value not found\n\nValue: ${value}\nProperty: ${target}\nComponent: ${name}`, command);
                                }
                            } else {
                                const index = body[target].indexOf(value);
                                if (index > -1) {
                                    body[target].splice(index, 1);
                                    removedIndex = index;
                                } else {
                                    causeCompileError(`Value not found\n\nValue: ${value}\nProperty: ${target}\nComponent: ${name}`, command);
                                }
                            }
                        }

                        // Maintain consistency across all array properties for all component types
                        if (removedIndex > -1) {
                            maintainArrayPropertyConsistency(body, target, removedIndex, "remove", targetObject.type);
                        }
                    } else {
                        causeCompileError(`Property not found\n\nProperty: ${target}\nComponent: ${name}`, command);
                    }
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
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
                        causeCompileError(`Index out of bounds\n\nIndex: ${index}\nComponent: ${name}`, command);
                    }
                    
                    // Remove element at the specified index from all array properties
                    arrayProperties.forEach(property => {
                        if (body[property] && Array.isArray(body[property]) && 
                            index >= 0 && index < body[property].length) {
                            body[property].splice(index, 1);
                        }
                    });
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}\nPage: ${pages.length - 1}`, command);
                }
                break;
            }
            case "remove_subtree": {
                const name = command.name;
                const nodeName = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    if (targetObject.type !== "tree") {
                        causeCompileError(`removeSubtree can only be used on tree components\n\nComponent: ${name}\nType: ${targetObject.type}`, command);
                    }
                    
                    const body = targetObject.body;
                    
                    // Check if the node exists
                    if (!body.nodes || !body.nodes.includes(nodeName)) {
                        causeCompileError(`Node not found\n\nNode: ${nodeName}\nComponent: ${name}`, command);
                    }
                    
                    // Find all descendants of the node
                    const descendants = findAllDescendants(nodeName, body.children);
                    const nodesToRemove = [nodeName, ...descendants];
                    
                    // Get indices of all nodes to remove (before removing any)
                    const indicesToRemove = [];
                    nodesToRemove.forEach(nodeToRemove => {
                        const index = body.nodes ? body.nodes.indexOf(nodeToRemove) : -1;
                        if (index > -1) {
                            indicesToRemove.push(index);
                        }
                    });
                    
                    // Remove children relationships involving any of the nodes to remove
                    // Remove relationships where either parent or child is being removed
                    if (body.children && Array.isArray(body.children)) {
                        body.children = body.children.filter(child => {
                            if (!child || typeof child !== 'object') return false;
                            // Keep the relationship only if both parent and child are NOT being removed
                            return !nodesToRemove.includes(child.start) && !nodesToRemove.includes(child.end);
                        });
                    }
                    
                    // Remove all edges involving any of the nodes to remove (for trees that might have edges)
                    if (body.edges && Array.isArray(body.edges)) {
                        body.edges = body.edges.filter(edge => {
                            if (!edge || typeof edge !== 'object') return false;
                            return !nodesToRemove.includes(edge.start) && !nodesToRemove.includes(edge.end);
                        });
                    }
                    
                    // Sort indices in descending order and remove nodes from end to beginning
                    indicesToRemove.sort((a, b) => b - a);
                    indicesToRemove.forEach(index => {
                        if (body.nodes && index >= 0 && index < body.nodes.length) {
                            body.nodes.splice(index, 1);
                            // Maintain consistency across all array properties
                            maintainArrayPropertyConsistency(body, "nodes", index, "remove", targetObject.type);
                        }
                    });
                } else {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                }
                break;
            }
            case "add_matrix_row":
            case "insert_matrix_row": {
                const name = command.name;
                const args = command.args; // Can be null, number, or array
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    // First, determine the current matrix dimensions
                    let numCols = 0;
                    let numRows = 0;
                    matrixProperties.forEach(property => {
                        if (body[property] && body[property].length > 0) {
                            numRows = Math.max(numRows, body[property].length);
                            numCols = Math.max(numCols, ...body[property].map(row => row.length));
                        }
                    });
                    
                    matrixProperties.forEach(property => {
                        // Create the property if it doesn't exist
                        if (!body[property]) {
                            body[property] = [];
                        }
                        
                        const currentMatrix = body[property];
                        
                        // Ensure the matrix has the right dimensions before adding
                        while (currentMatrix.length < numRows) {
                            currentMatrix.push(Array(numCols).fill(null));
                        }
                        currentMatrix.forEach(row => {
                            while (row.length < numCols) {
                                row.push(null);
                            }
                        });
                        
                        let newRow;
                        let insertIndex;
                        
                        if (args && typeof args === 'object' && 'index' in args && 'value' in args) {
                            // Two-argument form: insertRow(index, [values])
                            insertIndex = Math.max(0, Math.min(args.index, currentMatrix.length));
                            if (property === "value") {
                                newRow = [...args.value];
                            } else if (property === "color" || property === "arrow") {
                                // For color and arrow, use null for all values
                                newRow = Array(args.value.length).fill(null);
                            }
                            // Pad with null if the array is shorter than existing columns
                            while (newRow.length < numCols) {
                                newRow.push(null);
                            }
                        } else if (Array.isArray(args)) {
                            // If args is an array, use it as the new row values and add at the end
                            if (property === "value") {
                                newRow = [...args];
                            } else if (property === "color" || property === "arrow") {
                                // For color and arrow, use null for all values
                                newRow = Array(args.length).fill(null);
                            }
                            // Pad with null if the array is shorter than existing columns
                            while (newRow.length < numCols) {
                                newRow.push(null);
                            }
                            insertIndex = currentMatrix.length; // Add at the end
                        } else if (typeof args === 'number') {
                            // If args is a number, use it as the index position and fill with null
                            newRow = Array(numCols).fill(null);
                            insertIndex = Math.max(0, Math.min(args, currentMatrix.length)); // Clamp to valid range
                        } else {
                            // If args is null or undefined, add at the end filled with null
                            newRow = Array(numCols).fill(null);
                            insertIndex = currentMatrix.length; // Add at the end
                        }
                        
                        // Insert the row at the specified index
                        currentMatrix.splice(insertIndex, 0, newRow);
                        
                        // Ensure all existing rows have the same number of columns as the new row
                        const maxCols = Math.max(numCols, newRow.length);
                        currentMatrix.forEach(row => {
                            while (row.length < maxCols) {
                                row.push(null);
                            }
                        });
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "add_matrix_column": {
                const name = command.name;
                const args = command.args; // Can be null, number, or array
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    // First, determine the current matrix dimensions
                    let numCols = 0;
                    let numRows = 0;
                    matrixProperties.forEach(property => {
                        if (body[property] && body[property].length > 0) {
                            numRows = Math.max(numRows, body[property].length);
                            numCols = Math.max(numCols, ...body[property].map(row => row.length));
                        }
                    });
                    
                    matrixProperties.forEach(property => {
                        // Create the property if it doesn't exist
                        if (!body[property]) {
                            body[property] = [];
                        }
                        
                        const currentMatrix = body[property];
                        
                        // Ensure the matrix has the right dimensions before adding
                        while (currentMatrix.length < numRows) {
                            currentMatrix.push(Array(numCols).fill(null));
                        }
                        currentMatrix.forEach(row => {
                            while (row.length < numCols) {
                                row.push(null);
                            }
                        });
                        
                        if (Array.isArray(args)) {
                            // If args is an array, use it as the new column values and add at the end
                            const targetNumRows = Math.max(numRows, args.length);
                            
                            for (let i = 0; i < targetNumRows; i++) {
                                // Ensure we have enough rows
                                if (i >= currentMatrix.length) {
                                    currentMatrix.push(Array(numCols).fill(null));
                                }
                                
                                const row = currentMatrix[i] || [];
                                let valueToAdd;
                                
                                if (property === "value") {
                                    // For value, use the actual values from the array
                                    valueToAdd = i < args.length ? args[i] : null;
                                } else if (property === "color" || property === "arrow") {
                                    // For color and arrow, use null for all values
                                    valueToAdd = null;
                                }
                                
                                row.push(valueToAdd);
                                currentMatrix[i] = row;
                            }
                        } else if (typeof args === 'number') {
                            // If args is a number, use it as the index position and fill with null
                            const insertIndex = Math.max(0, Math.min(args, numCols)); // Clamp to valid range
                            
                            for (let i = 0; i < currentMatrix.length; i++) {
                                const row = currentMatrix[i] || [];
                                // Ensure row has enough columns before inserting
                                while (row.length < insertIndex) {
                                    row.push(null);
                                }
                                // Insert null at the specified index
                                row.splice(insertIndex, 0, null);
                                currentMatrix[i] = row;
                            }
                        } else {
                            // If args is null or undefined, add at the end filled with null
                            for (let i = 0; i < currentMatrix.length; i++) {
                                const row = currentMatrix[i] || [];
                                row.push(null);
                                currentMatrix[i] = row;
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "insert_matrix_column": {
                const name = command.name;
                const args = command.args; // Can be null, number, or object with index and value
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    // First, determine the current matrix dimensions
                    let numCols = 0;
                    let numRows = 0;
                    matrixProperties.forEach(property => {
                        if (body[property] && body[property].length > 0) {
                            numRows = Math.max(numRows, body[property].length);
                            numCols = Math.max(numCols, ...body[property].map(row => row.length));
                        }
                    });
                    
                    matrixProperties.forEach(property => {
                        // Create the property if it doesn't exist
                        if (!body[property]) {
                            body[property] = [];
                        }
                        
                        const currentMatrix = body[property];
                        
                        // Ensure the matrix has the right dimensions before adding
                        while (currentMatrix.length < numRows) {
                            currentMatrix.push(Array(numCols).fill(null));
                        }
                        currentMatrix.forEach(row => {
                            while (row.length < numCols) {
                                row.push(null);
                            }
                        });
                        
                        let insertIndex;
                        let valuesToInsert;
                        
                        if (args && typeof args === 'object' && 'index' in args && 'value' in args) {
                            // Two-argument form: insertColumn(index, [values])
                            insertIndex = Math.max(0, Math.min(args.index, numCols));
                            if (property === "value") {
                                valuesToInsert = args.value;
                            } else {
                                valuesToInsert = Array(args.value.length).fill(null);
                            }
                        } else if (typeof args === 'number') {
                            // Single-argument form: insertColumn(index)
                            insertIndex = Math.max(0, Math.min(args, numCols));
                            valuesToInsert = Array(numRows).fill(null);
                        } else {
                            // No arguments or null: insert at end
                            insertIndex = numCols;
                            valuesToInsert = Array(numRows).fill(null);
                        }
                        
                        // Insert the column values at the specified index
                        for (let i = 0; i < currentMatrix.length; i++) {
                            const row = currentMatrix[i] || [];
                            // Ensure row has enough columns before inserting
                            while (row.length < insertIndex) {
                                row.push(null);
                            }
                            // Insert the value at the specified index
                            const valueToInsert = i < valuesToInsert.length ? valuesToInsert[i] : null;
                            row.splice(insertIndex, 0, valueToInsert);
                            currentMatrix[i] = row;
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "remove_matrix_row": {
                const name = command.name;
                const rowIndex = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    matrixProperties.forEach(property => {
                        if (body[property]) {
                            const currentMatrix = body[property];
                            
                            if (rowIndex >= 0 && rowIndex < currentMatrix.length) {
                                currentMatrix.splice(rowIndex, 1);
                            } else {
                                causeCompileError(`Row index ${rowIndex} out of bounds for matrix in component "${name}".`, command);
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "remove_matrix_column": {
                const name = command.name;
                const colIndex = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProperties = ["value", "color", "arrow"];
                    
                    matrixProperties.forEach(property => {
                        if (body[property]) {
                            const currentMatrix = body[property];
                            let isValidIndex = false;
                            
                            for (let i = 0; i < currentMatrix.length; i++) {
                                const row = currentMatrix[i] || [];
                                
                                if (colIndex >= 0 && colIndex < row.length) {
                                    row.splice(colIndex, 1);
                                    isValidIndex = true;
                                }
                            }
                            
                            if (!isValidIndex && currentMatrix.length > 0) {
                                causeCompileError(`Column index ${colIndex} out of bounds for matrix in component "${name}".`, command);
                            }
                        }
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }
            
            case "add_matrix_border": {
                const name = command.name;
                const args = command.args;
                const borderValue = args.index !== undefined ? args.index : null;
                const borderColor = args.value !== undefined ? args.value : null;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);

                if (targetObject) {
                    const body = targetObject.body;
                    const matrixProps = ["value", "color", "arrow"];
                    
                    // Get the dimensions from value matrix
                    const valueMatrix = body.value || [];
                    const isEmpty = valueMatrix.length === 0;
                    const rows = isEmpty ? 1 : valueMatrix.length;
                    const cols = isEmpty ? 1 : Math.max(...valueMatrix.map(row => row.length || 0));
                    
                    // For each matrix property (value, color, arrow)
                    matrixProps.forEach(prop => {
                        // Always process all matrix properties, creating them if they don't exist
                        const borderVal = prop === "value" ? borderValue : 
                                         prop === "color" ? borderColor : null;
                        
                        // Create new matrix with border
                        const newMatrix = [];
                        
                        // Add top border row
                        newMatrix.push(Array(cols + 2).fill(borderVal));
                        
                        // Add middle rows with side borders
                        for (let i = 0; i < rows; i++) {
                            const origRow = body[prop] && body[prop][i] ? body[prop][i] : Array(cols).fill(null);
                            const paddedRow = [...origRow];
                            while (paddedRow.length < cols) paddedRow.push(null);
                            newMatrix.push([borderVal, ...paddedRow, borderVal]);
                        }
                        
                        // Add bottom border row
                        newMatrix.push(Array(cols + 2).fill(borderVal));
                        
                        // Update the matrix
                        body[prop] = newMatrix;
                    });
                } else {
                    causeCompileError(`Component "${name}" not found on the current page.`, command);
                }
                break;
            }

                        case "add_child":
                // args can be: {start, end} or {index: {start, end}, value: ...}
                const name = command.name;
                const args = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);
                if (!targetObject) {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                    break;
                }
                const body = targetObject.body;
                if (!body.nodes) body.nodes = [];
                if (!body.children) body.children = [];
                let parent, child, value;
                if (args.start && args.end) {
                    parent = args.start;
                    child = args.end;
                } else if (args.index && args.value !== undefined && args.index.start && args.index.end) {
                    parent = args.index.start;
                    child = args.index.end;
                    value = args.value;
                }
                // Add child node if not present
                if (!body.nodes.includes(child)) {
                    body.nodes.push(child);
                    if (value !== undefined) {
                        if (!body.value) body.value = [];
                        while (body.value.length < body.nodes.length - 1) body.value.push(null);
                        body.value.push(value);
                    }
                }
                // Add parent node if not present
                if (!body.nodes.includes(parent)) {
                    body.nodes.push(parent);
                }
                // Add child edge if not present
                if (!body.children.some(e => e.start === parent && e.end === child)) {
                    body.children.push({start: parent, end: child});
                }
                break;

            case "set_child":
                // args: {start: parent, end: child}
                const name2 = command.name;
                const edge = command.args;
                const targetObject2 = pages[pages.length - 1].find(comp => comp.name === name2);
                if (!targetObject2) {
                    causeCompileError(`Component not on page\n\nName: ${name2}`, command);
                    break;
                }
                const body2 = targetObject2.body;
                if (!body2.children) body2.children = [];
                const parent2 = edge.start;
                const child2 = edge.end;
                // Remove all previous parent edges for this child
                body2.children = body2.children.filter(e => !(e.end === child2));
                // Add new edge
                body2.children.push({start: parent2, end: child2});
                // Optionally: ensure both nodes exist
                if (!body2.nodes) body2.nodes = [];
                if (!body2.nodes.includes(child2)) body2.nodes.push(child2);
                if (!body2.nodes.includes(parent2)) body2.nodes.push(parent2);
                break;

            case "set_text": {
                const name = command.name;
                const text = command.args.index; // text value comes from index field
                const position = command.args.value.value; // position comes from token's value field
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);
                
                if (!targetObject) {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                    break;
                }
                
                // setText is not allowed on text objects themselves
                if (targetObject.type === "text") {
                    causeCompileError(`setText cannot be used on text objects\n\nUse setValue, setFontSize, etc. instead.\nComponent: ${name}`, command);
                    break;
                }
                
                // Find the placement text component for this position
                const textComponentName = `${name}_${position}`;
                let textComponent = pages[pages.length - 1].find(comp => comp.name === textComponentName);
                
                if (text === null || text === undefined) {
                    // Remove the text object if it exists
                    if (textComponent) {
                        const index = pages[pages.length - 1].indexOf(textComponent);
                        if (index > -1) {
                            pages[pages.length - 1].splice(index, 1);
                        }
                    }
                    // Also remove from the component definition if it was set as a property
                    if (targetObject.body[position]) {
                        delete targetObject.body[position];
                    }
                } else {
                    // Set or update the text
                    if (textComponent) {
                        // Update existing text component
                        if (Array.isArray(text)) {
                            // Convert array to single line string
                            textComponent.body.value = text.join(' ');
                        } else {
                            textComponent.body.value = text;
                        }
                    } else {
                        // Check if there's a reference to another text object in the definition
                        const referencedTextName = targetObject.body[position];
                        if (referencedTextName && typeof referencedTextName === 'string') {
                            // Find if this references an existing text component
                            const referencedComponent = findComponentDefinitionByName(definitions, referencedTextName);
                            if (referencedComponent && referencedComponent.type === 'text') {
                                // Update the referenced text object directly
                                if (Array.isArray(text)) {
                                    referencedComponent.body.value = text.join(' ');
                                } else {
                                    referencedComponent.body.value = text;
                                }
                                // Find the text component on the current page and update it
                                textComponent = pages[pages.length - 1].find(comp => comp.name === referencedTextName);
                                if (textComponent) {
                                    if (Array.isArray(text)) {
                                        textComponent.body.value = text.join(' ');
                                    } else {
                                        textComponent.body.value = text;
                                    }
                                }
                                break;
                            }
                        }
                        
                        // Create new text component
                        const newTextComponent = {
                            type: 'text',
                            name: textComponentName,
                            body: { value: Array.isArray(text) ? text.join(' ') : text },
                            position: 'previous',
                            placement: position
                        };
                        pages[pages.length - 1].push(newTextComponent);
                        
                        // Also update the main component's definition to reference this text
                        targetObject.body[position] = textComponentName;
                        targetObject.body["text_" + position] = text;
                    }
                }
                break;
            }

            case "set_chained": {
                const name = command.name;
                const placement = Array.isArray(command.placement) ? command.placement[0].value : command.placement;
                const property = command.target;
                const args = command.args;
                const targetObject = pages[pages.length - 1].find(comp => comp.name === name);
                
                if (!targetObject) {
                    causeCompileError(`Component not on page\n\nName: ${name}`, command);
                    break;
                }
                
                // Find the text component for this placement
                const textComponentName = `${name}_${placement}`;
                let textComponent = pages[pages.length - 1].find(comp => comp.name === textComponentName);
                
                // Check if the placement refers to a referenced text object
                if (!textComponent && targetObject.body[placement]) {
                    const referencedTextName = targetObject.body[placement];
                    if (typeof referencedTextName === 'string') {
                        textComponent = pages[pages.length - 1].find(comp => comp.name === referencedTextName);
                    }
                }
                
                if (!textComponent) {
                    // Create a new text component if it doesn't exist
                    textComponent = {
                        type: 'text',
                        name: textComponentName,
                        body: { value: "" },
                        position: 'previous',
                        placement: placement
                    };
                    pages[pages.length - 1].push(textComponent);
                    targetObject.body[placement] = textComponentName;
                }
                
                if (textComponent.type !== "text") {
                    causeCompileError(`Chained method can only be used on text objects\n\nComponent: ${textComponent.name} is not a text object`, command);
                    break;
                }
                
                // Apply the method to the text component using the same logic as regular text commands
                if (property === "value") {
                    // Handle setValue for text - check if args has index or is direct value
                    if (typeof args === 'object' && args.index !== undefined) {
                        // Array-style operation with index: setValue(index, value)
                        if (!Array.isArray(textComponent.body[property])) {
                            textComponent.body[property] = [textComponent.body[property] || ""];
                        }
                        // Ensure array is long enough
                        while (textComponent.body[property].length <= args.index) {
                            textComponent.body[property].push("");
                        }
                        textComponent.body[property][args.index] = args.value;
                    } else {
                        // Direct value setting: setValue("text") or setValue(["line1", "line2"])
                        textComponent.body[property] = args;
                    }
                } else {
                    // Handle other properties (fontSize, color, etc.)
                    if (typeof args === 'object' && args.index !== undefined) {
                        // Array-style operation with index
                        if (!Array.isArray(textComponent.body[property])) {
                            const existingValue = textComponent.body[property];
                            textComponent.body[property] = [];
                            if (existingValue !== undefined && existingValue !== null) {
                                textComponent.body[property][0] = existingValue;
                            }
                        }
                        // Ensure array is long enough
                        while (textComponent.body[property].length <= args.index) {
                            textComponent.body[property].push(null);
                        }
                        textComponent.body[property][args.index] = args.value;
                    } else {
                        // Direct property setting
                        textComponent.body[property] = args;
                    }
                }
                break;
            }

        }
    });

    postCheck(pages, parsedDSL);

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
                        console.log(`No matching component type:\n${component.type}!`)
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
    if (!parsedDSL || !parsedDSL.defs || !parsedDSL.cmds || 
        (Array.isArray(parsedDSL.defs) && Array.isArray(parsedDSL.cmds) && 
         parsedDSL.defs.length !== 0 && parsedDSL.cmds.length === 0)) {
        throw new Error("Nothing to show\n\nPlease define an object and a page.\nThen show it using the 'show' command");
    }

    // Helper function to create error with line/col info
    function createPreCheckError(message, sourceItem = null) {
        const err = new Error(message);
        if (sourceItem && sourceItem.line !== undefined && sourceItem.col !== undefined) {
            Object.assign(err, { line: sourceItem.line, col: sourceItem.col });
        }
        return err;
    }

    // Check for duplicate component names
    const names = new Set();
    parsedDSL.defs.forEach(def => {
        if (def.type === "comment") return;
        if (names.has(def.name)) {
            throw createPreCheckError(`Duplicate component\n\nAffected: ${def.name} of type ${def.type}`, def);
        }
        names.add(def.name);
        // Tree cycle check
        if (def.type === "tree" && def.body && def.body.nodes && def.body.children) {
            if (hasTreeCycle(def.body.nodes, def.body.children)) {
                throw createPreCheckError(`Cycle detected in tree '${def.name}'.\nThe structure is not a valid tree.`, def);
            }
        }
    });

    // Check for valid command types
    parsedDSL.cmds.forEach(cmd => {
        if (![
            "page", "show", "hide", "set", "set_multiple", "set_matrix", "set_matrix_multiple",
            "add", "insert", "remove", "remove_subtree", "remove_at", "comment",
            "add_matrix_row", "add_matrix_column", "remove_matrix_row", "remove_matrix_column", "insert_matrix_row", "insert_matrix_column", "add_matrix_border", "add_child", "set_child", "set_text", "set_chained"
        ].includes(cmd.type)) {
            throw createPreCheckError(
                `Unknown command\n\nType: ${cmd.type}`,
                cmd
            );
        }
    });


    // Check if the first command is a page (only if there are commands)
    if (parsedDSL.cmds.length > 0 && parsedDSL.cmds[0].type !== "page" && parsedDSL.cmds[0].type !== "comment") {
        throw createPreCheckError("Command before page\n\nPlease start a page using 'page'.\nThen use any other commands.", parsedDSL.cmds[0]);
    }
}

function postCheck(pages, parsedDSL = null) {
    // Helper function to create error with line/col info
    function createPostCheckError(message, sourceItem = null) {
        const err = new Error(message);
        if (sourceItem && sourceItem.line !== undefined && sourceItem.col !== undefined) {
            Object.assign(err, { line: sourceItem.line, col: sourceItem.col });
        }
        return err;
    }

    // Check if there is at least one page
    if (pages.length === 0) {
        // Try to find the first page command for better error context
        let firstPageCmd = null;
        if (parsedDSL && parsedDSL.cmds) {
            firstPageCmd = parsedDSL.cmds.find(cmd => cmd.type === "page");
        }
        throw createPostCheckError("No pages found\n\nPlease define at least one page\nwith components.", firstPageCmd);
    }
}