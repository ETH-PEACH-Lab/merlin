// Shared utility functions for handling position formatting in generators

/**
 * Infers the minimum layout needed based on position keywords used
 * @param {Array} positions - Array of position objects from all show commands
 * @returns {Array} - Inferred layout [cols, rows]
 */
function inferLayoutFromKeywords(positions) {
    let needsCols = 1;
    let needsRows = 1;
    let hasKeywords = false;
    
    for (const position of positions) {
        if (position && position.type === 'keyword') {
            hasKeywords = true;
            const keyword = position.value.toLowerCase().replace(/[_\s]/g, '-');
            
            // Check if we need 2 columns
            if (['left', 'right', 'tl', 'top-left', 'tr', 'top-right', 
                 'bl', 'bottom-left', 'br', 'bottom-right'].includes(keyword)) {
                needsCols = Math.max(needsCols, 2);
            }
            
            // Check if we need 2 rows  
            if (['top', 'bottom', 'tl', 'top-left', 'tr', 'top-right',
                 'bl', 'bottom-left', 'br', 'bottom-right'].includes(keyword)) {
                needsRows = Math.max(needsRows, 2);
            }
        }
    }
    
    // Only return a layout if keywords were actually used
    return hasKeywords ? [needsCols, needsRows] : null;
}

/**
 * Translates position keywords to ranged positions based on layout
 * @param {string} keyword - The position keyword (e.g., "top", "tl", "center")
 * @param {Array} layout - The layout dimensions [cols, rows]
 * @returns {Array} - Ranged position format [xPos, yPos]
 */
function translateKeywordToRange(keyword, layout) {
    if (!layout || layout.length !== 2) {
        // Default to 2x2 if no layout specified (most keywords need at least 2x2)
        layout = [2, 2];
    }
    
    if (!keyword) {
        return [0, 0];
    }
    
    const [cols, rows] = layout;
    const midCol = Math.floor(cols / 2);
    const midRow = Math.floor(rows / 2);
    
    // Define keyword mappings - simplified to behave like quarters/halves
    const keywordMap = {
        // Corner positions (behave like quarters)
        "tl": [{ type: "range", start: 0, end: midCol - 1 }, { type: "range", start: 0, end: midRow - 1 }],
        "top-left": [{ type: "range", start: 0, end: midCol - 1 }, { type: "range", start: 0, end: midRow - 1 }],
        "tr": [{ type: "range", start: midCol, end: cols - 1 }, { type: "range", start: 0, end: midRow - 1 }],
        "top-right": [{ type: "range", start: midCol, end: cols - 1 }, { type: "range", start: 0, end: midRow - 1 }],
        "bl": [{ type: "range", start: 0, end: midCol - 1 }, { type: "range", start: midRow, end: rows - 1 }],
        "bottom-left": [{ type: "range", start: 0, end: midCol - 1 }, { type: "range", start: midRow, end: rows - 1 }],
        "br": [{ type: "range", start: midCol, end: cols - 1 }, { type: "range", start: midRow, end: rows - 1 }],
        "bottom-right": [{ type: "range", start: midCol, end: cols - 1 }, { type: "range", start: midRow, end: rows - 1 }],
        
        // Edge positions (single edge lines, not halves)
        "top": [{ type: "range", start: 0, end: cols - 1 }, 0],
        "bottom": [{ type: "range", start: 0, end: cols - 1 }, rows - 1],
        "left": [0, { type: "range", start: 0, end: rows - 1 }],
        "right": [cols - 1, { type: "range", start: 0, end: rows - 1 }],
        
        // Center position
        "center": [midCol, midRow],
        "centre": [midCol, midRow],
    };
    
    const normalized = keyword.toLowerCase().replace(/[_\s]/g, '-');
    return keywordMap[normalized] || [0, 0]; // Default to top-left if keyword not found
}

/**
 * Formats position information for component output
 * Handles both regular positions [x, y] and ranged positions with originalPosition
 * Always outputs tuple format, never keywords
 * @param {*} position - The position object/array to format
 * @param {Array} layout - The layout dimensions [cols, rows] (needed for keyword translation)
 * @returns {string} - Formatted position string or empty string if no position
 */
export function formatPositionForOutput(position, layout = [3, 3]) {
    if (!position) {
        return "";
    }
    
    if (Array.isArray(position)) {
        // Regular position format: [x, y]
        return `position: (${position[0]},${position[1]})\n`;
    } else if (position.originalPosition) {
        // Ranged position format: use originalPosition to reconstruct the range syntax
        // Check if originalPosition is a keyword - convert to tuple format
        if (position.originalPosition.type === 'keyword') {
            // For keyword positions that have already been expanded, use the expanded position
            // instead of re-translating with the current layout to maintain consistency
            const xPos = position.x;
            const yPos = position.y;
            const width = position.width || 1;
            const height = position.height || 1;
            
            function formatPositionValue(start, size) {
                if (size === 1) {
                    return start;
                }
                return `${start}..${start + size - 1}`;
            }
            
            const xFormatted = formatPositionValue(xPos, width);
            const yFormatted = formatPositionValue(yPos, height);
            return `position: (${xFormatted},${yFormatted})\n`;
        }
        
        const [xPos, yPos] = position.originalPosition;
        
        function formatPositionValue(pos) {
            if (pos && typeof pos === 'object' && pos.type === 'range') {
                // If start and end are the same, just return the single value
                if (pos.start === pos.end) {
                    return pos.start;
                }
                return `${pos.start}..${pos.end}`;
            }
            return pos;
        }
        
        const xFormatted = formatPositionValue(xPos);
        const yFormatted = formatPositionValue(yPos);
        return `position: (${xFormatted},${yFormatted})\n`;
    } else if (position.type === 'keyword') {
        // Keyword position: translate to tuple format
        const translatedRange = translateKeywordToRange(position.value, layout);
        const [xPos, yPos] = translatedRange;
        
        function formatPositionValue(pos) {
            if (pos && typeof pos === 'object' && pos.type === 'range') {
                // If start and end are the same, just return the single value
                if (pos.start === pos.end) {
                    return pos.start;
                }
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

/**
 * Translates position keywords to expanded position format for compilation
 * @param {*} position - The position object (keyword, array, or ranged position)
 * @param {Array} layout - The current page layout [cols, rows]
 * @returns {*} - Expanded position object or original position
 */
export function expandPositionWithLayout(position, layout) {
    if (!position) {
        return position;
    }
    
    if (position.type === 'keyword') {
        // Translate keyword to ranged position
        const translatedRange = translateKeywordToRange(position.value, layout);
        
        // Create expanded position object similar to expandRangedPosition
        const [xPos, yPos] = translatedRange;
        
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
        
        return {
            x: xDim.start,
            y: yDim.start,
            width: xDim.size,
            height: yDim.size,
            originalPosition: position // Keep the original keyword for output formatting
        };
    }
    
    // For non-keyword positions, return as-is (will be handled by existing expandRangedPosition)
    return position;
}

// Export the layout inference function for use in the compiler
export { inferLayoutFromKeywords };
