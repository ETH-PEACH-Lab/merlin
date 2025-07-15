
import nearley from 'nearley';
import grammar from '../parser.js'; // Compiled from merlinLite.ne
import { examples } from '../../examples.js';

function testAmbiguityForExamples() {
  let ambiguousCount = 0;
  let total = 0;
  for (const [name, input] of Object.entries(examples)) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
      parser.feed(input.userCode);
      const results = parser.results;
      total++;
      if (results.length > 1) {
        ambiguousCount++;
        console.log(`Ambiguity detected in example: ${name} (${results.length} parses)`);
      } else {
        console.log(`No ambiguity in example: ${name}`);
      }
    } catch (e) {
      console.error(`Parsing error in example ${name}:`, e.message);
    }
  }
  console.log(`\nSummary: ${ambiguousCount} ambiguous out of ${total} examples.`);
}

testAmbiguityForExamples();
