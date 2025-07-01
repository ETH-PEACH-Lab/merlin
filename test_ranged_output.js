// Test script for ranged position output
const nearley = require("nearley");
const grammar = require("./src/parser/parser.js");

async function testCompilation() {
    const { default: compiler } = await import("./src/compiler/compiler.mjs");

    const dslCode = `array numbers = {
	value: [64,34,25,12,22,11,90]
	color: [null,"blue",null,null,null,null,null]
	arrow: [null,null,"important",null,null,null,null]
}

page 2x2
show numbers (0..1,0)`;

    console.log("Input DSL:");
    console.log(dslCode);
    console.log("\n" + "=".repeat(50) + "\n");

    try {
        // Parse the DSL
        const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
        parser.feed(dslCode);
        
        if (parser.results.length > 0) {
            const parsedDSL = parser.results[0];
            console.log("✅ Parsing successful");
            
            // Compile to mermaid
            const result = compiler(parsedDSL);
            console.log("✅ Compilation successful");
            console.log("\nGenerated Mermaid:");
            console.log(result.mermaidString);
            
            console.log("\nCompiled pages structure:");
            console.log(JSON.stringify(result.compiled_pages, null, 2));
            
        } else {
            console.log("❌ No parse results");
        }
    } catch (error) {
        console.log("❌ Error:", error.message);
        console.log("Stack:", error.stack);
    }
}

testCompilation();
