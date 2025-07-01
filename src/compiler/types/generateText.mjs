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
    
    // Only output the value
    const value = body.value || "";
    result += `"${value}"\n`;
    return result;
}
