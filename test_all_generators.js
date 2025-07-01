// Test script for all generators with ranged positions
const nearley = require("nearley");
const grammar = require("./src/parser/parser.js");

async function runTest() {
    const { default: compiler } = await import("./src/compiler/compiler.mjs");

    function testCompile(input, testName) {
        console.log(`\n=== ${testName} ===`);
        console.log("Input DSL:");
        console.log(input);
        
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        try {
            parser.feed(input);
            if (parser.results.length > 0) {
                const parsedDSL = parser.results[0];
                console.log("✅ Parsed successfully");
                
                try {
                    const output = compiler(parsedDSL);
                    console.log("✅ Compiled successfully");
                    console.log("Output:");
                    console.log(output);
                    return output;
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

    // Test the specific user case
    const userCase = `array numbers = {
	value: [64,34,25,12,22,11,90]
	color: [null,"blue",null,null,null,null,null]
	arrow: [null,null,"important",null,null,null,null]
}

page 2x2
show numbers (0..1,0)`;

    const result = testCompile(userCase, "User's Array with Ranged Position");
    
    // Verify it contains the expected position format
    if (result && result.includes('position: (0..1,0)')) {
        console.log("✅ Contains expected ranged position format!");
    } else if (result) {
        console.log("❌ Missing expected position format");
    }
}

runTest().catch(console.error);
