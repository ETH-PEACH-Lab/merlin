// generateText.mjs - Generate text output for visual diagrams

import { formatPositionForOutput } from '../positionUtils.mjs';

export function generateText(component, layout = [3, 3]) {
    const { name, body } = component;
    let result = "text\n";
    
    // Add position information if available
    if (component.position) {
        if (component.position === 'previous') {
            result += "position: previous\n";
            if (component.placement) {
                result += `placement: ${component.placement}\n`;
            }
        } else {
            // Handle regular and ranged positions
            result += formatPositionForOutput(component.position, layout);
        }
    }
    
    // Handle global properties in the correct order according to grammar
    // Order: fontSize, color, fontWeight, fontFamily, align, lineSpacing, width, height
    // Only output as global if they are NOT arrays (single values that apply to all lines)
    const orderedGlobalProperties = ['fontSize', 'color', 'fontWeight', 'fontFamily', 'align', 'lineSpacing', 'width', 'height'];
    const textValue = body.value;
    const isSingleLine = !Array.isArray(textValue);
    
    // For single line text, output all properties globally
    // For multi-line text, only output lineSpacing, width, height globally
    orderedGlobalProperties.forEach(prop => {
        if (body[prop] !== undefined && body[prop] !== null) {
            let propValue = body[prop];
            let shouldOutputGlobally = false;
            
            if (isSingleLine) {
                // Single line: output all properties globally
                if (Array.isArray(propValue)) {
                    propValue = propValue[0]; // Take first element if array
                }
                shouldOutputGlobally = true;
            } else {
                // Multi-line: only output non-array properties globally (like lineSpacing, width, height)
                if (!Array.isArray(propValue)) {
                    shouldOutputGlobally = true;
                }
            }
            
            if (shouldOutputGlobally && propValue !== null && propValue !== undefined) {
                if (typeof propValue === 'string') {
                    result += `${prop}: "${propValue}"\n`;
                } else {
                    result += `${prop}: ${propValue}\n`;
                }
            }
        }
    });
    
    // Handle the value property which can be a string or array of strings
    const value = body.value;
    if (value) {
        if (Array.isArray(value)) {
            // Multi-line text
            value.forEach((line, index) => {
                if (line !== null && line !== undefined) {
                    let lineOutput = `"${line}"`;
                    
                    // Collect properties for this line
                    const lineProperties = [];
                    const propertyNames = ['fontSize', 'color', 'fontWeight', 'fontFamily', 'align'];
                    
                    propertyNames.forEach(prop => {
                        let propValue = null;
                        
                        if (body[prop] !== undefined && body[prop] !== null) {
                            if (Array.isArray(body[prop])) {
                                // Array property - get value for this line index
                                propValue = body[prop][index];
                            } else {
                                // Single value property - applies to all lines
                                propValue = body[prop];
                            }
                        }
                        
                        if (propValue !== null && propValue !== undefined) {
                            if (typeof propValue === 'string') {
                                lineProperties.push(`${prop}: "${propValue}"`);
                            } else {
                                lineProperties.push(`${prop}: ${propValue}`);
                            }
                        }
                    });
                    
                    // Add properties if any exist for this line
                    if (lineProperties.length > 0) {
                        lineOutput += ` {${lineProperties.join(', ')}}`;
                    }
                    
                    result += lineOutput + '\n';
                }
            });
        } else {
            // Single line text - properties already output globally above
            result += `"${value}"\n`;
        }
    }
    
    return result;
}
