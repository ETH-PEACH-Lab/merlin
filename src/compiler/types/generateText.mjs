// generateText.mjs - Generate text output for visual diagrams

export function generateText(component) {
    const { name, body } = component;
    let result = "text\n";
    // Only output the value
    const value = body.value || "";

    result += `"${value}"`;
    return result;
}
