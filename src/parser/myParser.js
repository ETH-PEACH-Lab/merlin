import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from myDSL.ne

export function myParser(input) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    // console.log("myParser input:\n", input);
    try {
        parser.feed(input);
        const parsedData = parser.results[0];  // Assuming the first result is what you want
        return parsedData;
    } catch (err) {
        console.error("Error parsing input:", err);
        return null;  // Handle parsing error
    }
}