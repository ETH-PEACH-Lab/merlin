export function findLastDrawCoveringIndex(parsedDsl, page_index) {
    const drawArray = parsedDsl.draw;
    let lastDraw = null;
    if (!drawArray) {
        console.log("draw command is null!")
        return null;
    }
    for (let i = 0; i < drawArray.length; i++) {
        const range = drawArray[i].range;
        if (page_index >= range.start && page_index <= range.end) {
            lastDraw = drawArray[i];
        }
    }
    return lastDraw;
}

export function evaluateExpression(string1, string2, number) {
    // Replace all occurrences of string2 in string1 with the provided number
    const replacedString = string1.replace(new RegExp(string2, 'g'), number);
    
    // Evaluate the expression and return the result
    return eval(replacedString);
}

export function findComponentIdxByName(parsedDsl, targetName) {
    // Access the data array from the object
    const dataArray = parsedDsl.data;

    // Iterate through the data array to find the first element with the matching name
    for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i].name === targetName) {
            return i;
        }
    }

    // If no matching element is found, return null
    return -1;
}