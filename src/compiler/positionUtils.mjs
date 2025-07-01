// Shared utility functions for handling position formatting in generators

/**
 * Formats position information for component output
 * Handles both regular positions [x, y] and ranged positions with originalPosition
 * @param {*} position - The position object/array to format
 * @returns {string} - Formatted position string or empty string if no position
 */
export function formatPositionForOutput(position) {
    if (!position) {
        return "";
    }
    
    if (Array.isArray(position)) {
        // Regular position format: [x, y]
        return `position: (${position[0]},${position[1]})\n`;
    } else if (position.originalPosition) {
        // Ranged position format: use originalPosition to reconstruct the range syntax
        const [xPos, yPos] = position.originalPosition;
        
        function formatPositionValue(pos) {
            if (pos && typeof pos === 'object' && pos.type === 'range') {
                return `${pos.start}..${pos.end}`;
            }
            return pos;
        }
        
        const xFormatted = formatPositionValue(xPos);
        const yFormatted = formatPositionValue(yPos);
        return `position: (${xFormatted},${yFormatted})\n`;
    }
    
    return "";
}
