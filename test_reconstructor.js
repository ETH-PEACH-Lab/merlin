// Test script for ranged position reconstructor
const nearley = require("nearley");
const grammar = require("./src/parser/parser.js");

async function runTests() {
    const { default: reconstructor } = await import("./src/parser/reconstructor.mjs");

    function testReconstruct(input, testName) {
        console.log(`\n=== ${testName} ===`);
        
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        try {
            parser.feed(input);
            if (parser.results.length > 0) {
                const parsedDSL = parser.results[0];
                console.log("✅ Parsed successfully");
                
                try {
                    const reconstructed = reconstructor(parsedDSL);
                    console.log("✅ Reconstructed successfully");
                    console.log("Reconstructed DSL:");
                    console.log(reconstructed);
                    return reconstructed;
                } catch (reconstructError) {
                    console.log("❌ Reconstruct error:", reconstructError.message);
                    return null;
                }
            } else {
                console.log("❌ No parse results");
                return null;
            }
        } catch (error) {
            console.log("❌ Parse error:", error.message);
            return null;
        }
    }

    console.log("Testing ranged position reconstruction...");

    // Test 1: Regular tuple position
    const test1 = `array arr1 = {
	value: [1, 2, 3]
}

page 3x3
show arr1 (0, 1)`;
    testReconstruct(test1, "Regular tuple position");

    // Test 2: Ranged position - single range in x
    const test2 = `array arr1 = {
	value: [1, 2, 3]
}

page 3x3
show arr1 (0..2, 0)`;
    testReconstruct(test2, "Ranged position - x range");

    // Test 3: Ranged position - both x and y ranges
    const test3 = `array arr1 = {
	value: [1, 2, 3]
}

page 3x3
show arr1 (0..2, 0..2)`;
    testReconstruct(test3, "Ranged position - both ranges");

    // Test 4: Ranged position - single range in y
    const test4 = `array arr1 = {
	value: [1, 2, 3]
}

page 3x3
show arr1 (1, 0..2)`;
    testReconstruct(test4, "Ranged position - y range");
}

runTests().catch(console.error);
