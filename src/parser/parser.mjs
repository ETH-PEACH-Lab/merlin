import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

export function parserMyDSL (input) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(input);
    const parsedData = parser.results[0];  // Parsed output
    return parsedData;
}