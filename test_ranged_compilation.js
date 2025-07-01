// Test script for ranged position compilation
const nearley = require("nearley");
const grammar = require("./src/parser/parser.js");

async function runTests() {
    const { default: compiler } = await import("./src/compiler/compiler.mjs");

    function testCompile(input, testName) {
        console.log(`\n=== ${testName} ===`);
        
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        try {
            parser.feed(input);
            if (parser.results.length > 0) {
                const parsedDSL = parser.results[0];
                console.log("✅ Parsed successfully");
                
                try {
                    const result = compiler(parsedDSL);
                    console.log("✅ Compiled successfully");
                    console.log("Components on page:", result.compiled_pages[0].filter(comp => comp.type).length);
                    console.log("Component details:");
                    result.compiled_pages[0].forEach((comp, index) => {
                        if (comp.type) {
                            console.log(`  ${index}: ${comp.name} at position ${JSON.stringify(comp.position)}`);
                        }
                    });
                    return result;
                } catch (compileError) {
                    console.log("❌ Compile error:", compileError.message);
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

    console.log("Testing ranged position compilation...");

    // Test 1: Regular tuple position (should still work)
    const test1 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0, 1)`;
    testCompile(test1, "Regular tuple position");

    // Test 2: Ranged position - single range in x
    const test2 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0..2, 0)`;
    testCompile(test2, "Ranged position - x range (should create 3 components)");

    // Test 3: Ranged position - both x and y ranges
    const test3 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0..2, 0..2)`;
    testCompile(test3, "Ranged position - both ranges (should create 9 components)");

    // Test 4: Ranged position - single range in y
    const test4 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (1, 0..2)`;
    testCompile(test4, "Ranged position - y range (should create 3 components)");
}

runTests().catch(console.error);
