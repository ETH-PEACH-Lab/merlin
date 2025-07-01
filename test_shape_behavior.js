// Test script for ranged position shape behavior
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
                            console.log(`  ${index}: ${comp.name}`);
                            console.log(`      Type: ${comp.type}`);
                            console.log(`      Position: ${JSON.stringify(comp.position)}`);
                            if (comp.body && comp.body.value) {
                                console.log(`      Values: ${JSON.stringify(comp.body.value)}`);
                            }
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

    console.log("Testing ranged position shape behavior...");

    // Test 1: Regular position (should work as before)
    const test1 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0, 1)`;
    testCompile(test1, "Regular position (single cell)");

    // Test 2: Ranged position - horizontal span (0..1, 0) = 2x1 shape
    const test2 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0..1, 0)`;
    testCompile(test2, "Horizontal range (0..1, 0) - should be 2x1 shape");

    // Test 3: Ranged position - vertical span (0, 0..1) = 1x2 shape
    const test3 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0, 0..1)`;
    testCompile(test3, "Vertical range (0, 0..1) - should be 1x2 shape");

    // Test 4: Ranged position - rectangle (0..1, 0..1) = 2x2 shape
    const test4 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0..1, 0..1)`;
    testCompile(test4, "Rectangle range (0..1, 0..1) - should be 2x2 shape");

    // Test 5: Larger range (0..2, 0) = 3x1 shape
    const test5 = `array arr1 = {
    value: [1, 2, 3]
}

page 3x3
show arr1 (0..2, 0)`;
    testCompile(test5, "Larger horizontal range (0..2, 0) - should be 3x1 shape");
}

runTests().catch(console.error);
