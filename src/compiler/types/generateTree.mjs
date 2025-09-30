import { formatNodeName, formatNullValue } from '../compiler.mjs';
import { formatPositionForOutput } from '../positionUtils.mjs';

export function generateTree(treeComponent, layout = [3, 3]) {
    let result = "tree\n";
    
    // Add position information if available
    result += formatPositionForOutput(treeComponent.position, layout);
    
    result += "@";

    const nodes = treeComponent.body.nodes || [];
    const value = treeComponent.body.value || [];
    const color = treeComponent.body.color || [];
    const arrow = treeComponent.body.arrow || [];
    const children = treeComponent.body.children || [];

    // Check if this is the new format with explicit children or old binary tree format
    if (children.length > 0) {
        result += convertToNewTreeFormat(nodes, value, color, arrow, children);
    } else {
        // Fallback to old binary tree format for backward compatibility
        result += convertArrayToBinaryTree(nodes, value, color, arrow);
    }

    result += "\n@\n";
    return result;
}

function convertArrayToBinaryTree(nodes, value, color, arrow) {
    const isValidNode = (node) => node && node !== 'none';

    if (!nodes || nodes.length === 0 || !nodes.some(isValidNode)) {
        return `\nnode:${formatNodeName('__empty_tree__')} {value:"", color:"", arrow:"", hidden:"true"}`;
    }

    let result = "";

    const getNodeName = (node) => formatNodeName(node?.name || node);

    for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        if (!isValidNode(node)) {
            continue;
        }

        const nodeName = getNodeName(node);
        const nodeValue = index < value.length ? value[index] : null;
        const nodeColor = index < color.length ? color[index] : null;
        const nodeArrow = index < arrow.length ? arrow[index] : null;

        result += `\nnode:${nodeName} {value:"${formatNullValue(nodeValue) ?? nodeName}"`;
        result += `, color:"${formatNullValue(nodeColor)}"`;
        result += `, arrow:"${nodeArrow === 'empty' ? "" : formatNullValue(nodeArrow)}"`;
        result += `, hidden:"false"}`;
    }

    for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index];
        if (!isValidNode(node)) {
            continue;
        }

        const parentName = getNodeName(node);
        const leftIndex = 2 * index + 1;
        const rightIndex = 2 * index + 2;

        if (leftIndex < nodes.length && isValidNode(nodes[leftIndex])) {
            const leftChildName = getNodeName(nodes[leftIndex]);
            result += `\nchild:(${parentName},${leftChildName})`;
        }

        if (rightIndex < nodes.length && isValidNode(nodes[rightIndex])) {
            const rightChildName = getNodeName(nodes[rightIndex]);
            result += `\nchild:(${parentName},${rightChildName})`;
        }
    }

    return result || `\nnode:${formatNodeName('__empty_tree__')} {value:"", color:"", arrow:"", hidden:"true"}`;
}

function convertToNewTreeFormat(nodes, value, color, arrow, children) {
    if (!nodes || nodes.length === 0) return '';
    
    let result = "";

    // Generate all nodes first
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node && node !== 'none') {
            const nodeName = formatNodeName(node);
            const nodeValue = i < value.length ? value[i] : null;
            const nodeColor = i < color.length ? color[i] : null;
            const nodeArrow = i < arrow.length ? arrow[i] : null;
            
            result += `\nnode:${nodeName} {value:"${formatNullValue(nodeValue) ?? nodeName}"`;
            result += `, color:"${formatNullValue(nodeColor)}"`;
            result += `, arrow:"${nodeArrow === 'empty' ? "" : formatNullValue(nodeArrow)}"`;
            result += `, hidden:"false"}`;
        }
    }

    // Generate children relationships
    for (const child of children) {
        if (child && child.start && child.end) {
            const parentName = formatNodeName(child.start);
            const childName = formatNodeName(child.end);
            result += `\nchild:(${parentName},${childName})`;
        }
    }
    
    return result;
}