// generateText.mjs - Generate text output for visual diagrams

export function generateText(component) {
    const { name, body } = component;
    let result = "text\n";
    
    // Add position information if available
    if (component.position) {
        if (component.position === 'previous') {
            result += "position: previous\n";
            if (component.placement) {
                result += `placement: ${component.placement}\n`;
            }
        } else if (Array.isArray(component.position)) {
            result += `position: (${component.position[0]},${component.position[1]})\n`;
        }
    }
    
    // Only output the value
    const value = body.value || "";
    result += `"${value}"\n`;
    return result;
}
