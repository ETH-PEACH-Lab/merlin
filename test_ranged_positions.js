// Test script for ranged position parsing
const nearley = require("nearley");
const grammar = require("./src/parser/parser.js");

function testParse(input) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    try {
        parser.feed(input);
        if (parser.results.length > 0) {
            console.log("✅ Parsed successfully:");
            console.log(JSON.stringify(parser.results[0], null, 2));
            return parser.results[0];
        } else {
            console.log("❌ No parse results");
            return null;
        }
    } catch (error) {
        console.log("❌ Parse error:", error.message);
        return null;
    }
}

console.log("Testing ranged position parsing...\n");

// Test 1: Regular tuple position (should still work)
console.log("Test 1: Regular tuple position");
const test1 = `array arr1 = {
    value: [1, 2, 3]
}

page
show arr1 (0, 1)`;
testParse(test1);

console.log("\n" + "=".repeat(50) + "\n");

// Test 2: Ranged position - single range in x
console.log("Test 2: Ranged position - x range");
const test2 = `array arr1 = {
    value: [1, 2, 3]
}

page
show arr1 (0..1, 0)`;
testParse(test2);

console.log("\n" + "=".repeat(50) + "\n");

// Test 3: Ranged position - both x and y ranges
console.log("Test 3: Ranged position - both x and y ranges");
const test3 = `array arr1 = {
    value: [1, 2, 3]
}

page
show arr1 (0..1, 0..1)`;
testParse(test3);

console.log("\n" + "=".repeat(50) + "\n");

// Test 4: Ranged position - single range in y
console.log("Test 4: Ranged position - y range");
const test4 = `array arr1 = {
    value: [1, 2, 3]
}

page
show arr1 (1, 0..2)`;
testParse(test4);
