// Used to figure out current size of the mermaid container
// NOTE: Might me removed later if we decide to use fixed sizes for diagram output

export function getMermaidContainerSize() {
    // Default fallback size based on CSS values we found
    const defaultSize = { width: 800, height: 400 };
    
    // In browser environment, try to read from DOM or use defaults
    if (typeof document !== 'undefined') {
        // Try to get CSS custom properties if they exist
        const style = getComputedStyle(document.documentElement);
        const width = style.getPropertyValue('--mermaid-container-width');
        const height = style.getPropertyValue('--mermaid-container-height');
        
        if (width && height) {
            return {
                width: parseInt(width),
                height: parseInt(height)
            };
        }
        
        // Try to find existing mermaid container and get its computed styles
        const container = document.querySelector('.mermaid-container');
        if (container) {
            const containerStyle = getComputedStyle(container);
            const containerHeight = parseInt(containerStyle.height);
            const containerWidth = parseInt(containerStyle.width) || 800; // fallback for 100% width
            
            if (!isNaN(containerHeight)) {
                return {
                    width: containerWidth > 0 ? containerWidth : 800,
                    height: containerHeight
                };
            }
        }
        
        // Try to create a temporary element to measure the CSS
        try {
            const tempDiv = document.createElement('div');
            tempDiv.className = 'mermaid-container';
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.position = 'absolute';
            tempDiv.style.top = '-9999px';
            document.body.appendChild(tempDiv);
            
            const tempStyle = getComputedStyle(tempDiv);
            const tempHeight = parseInt(tempStyle.height);
            const tempWidth = parseInt(tempStyle.width) || 800;
            
            document.body.removeChild(tempDiv);
            
            if (!isNaN(tempHeight)) {
                return {
                    width: tempWidth > 0 ? tempWidth : 800,
                    height: tempHeight
                };
            }
        } catch (error) {
            // Silently fall back to default if DOM manipulation fails
        }
    }
    
    return defaultSize;
}
