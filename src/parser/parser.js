// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  nlw: { match: /[ \t]*\r?\n[ \t]*/, lineBreaks: true },
  ws: /[ \t]+/,
  nullT: { match: /null/, value: () => null },
  layoutspec: /-?(?:[0-9]*\.[0-9]+|[0-9]+)x-?(?:[0-9]*\.[0-9]+|[0-9]+)(?:x-?(?:[0-9]*\.[0-9]+|[0-9]+))?/, 
  number: /-?(?:[0-9]*\.[0-9]+|[0-9]+)/,
  boolean: { match: /true|false/, value: s => s === "true" },
  times:  /\*/,
  lbracket: "{",
  rbracket: "}",
  lbrac: "[",
  rbrac: "]",
  lparen: "(",
  rparen: ")",
  colon: ":",
  comma: ",",
  dotdot: "..", // Add range operator before dot to avoid conflicts
  dot: ".",
  arrow: "->",
  dash: "-",
  equals: "=",
  pass: "_",
  word: { match: /[a-zA-Z_][a-zA-Z0-9_]*/, 
  type: moo.keywords({
    def: ["array", "matrix", "graph", "linkedlist", "tree", "stack", "text", "neuralnetwork", "architecture"],
    
  })},
  comment: { match: /\/\/.*?$/, lineBreaks: true, value: s => s.slice(2).trim() },
  string: { match: /"(?:\\.|[^"\\])*"/, value: s => s.slice(1, -1) },
});

const iid = ([el]) => id(el);

const getDef = ([el]) => { 
  return {
    class: el.type,
    type: el.value,
    line: el.line,
    col: el.col,
  };
}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "root$ebnf$1", "symbols": []},
    {"name": "root$ebnf$1", "symbols": ["root$ebnf$1", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$ebnf$2$macrocall$2", "symbols": ["definition_or_command"]},
    {"name": "root$ebnf$2$macrocall$1$ebnf$1", "symbols": []},
    {"name": "root$ebnf$2$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["nlw"]},
    {"name": "root$ebnf$2$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["root$ebnf$2$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$ebnf$2$macrocall$1$ebnf$1$subexpression$1", "symbols": ["root$ebnf$2$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "root$ebnf$2$macrocall$2"]},
    {"name": "root$ebnf$2$macrocall$1$ebnf$1", "symbols": ["root$ebnf$2$macrocall$1$ebnf$1", "root$ebnf$2$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$ebnf$2$macrocall$1", "symbols": ["root$ebnf$2$macrocall$2", "root$ebnf$2$macrocall$1$ebnf$1"], "postprocess":  ([first, rest]) => {
            const firstValue = first[0];
            const restValues = rest.map(([, value]) => value[0]);
            // Include all items, even comments
            return [firstValue, ...restValues];
        } },
    {"name": "root$ebnf$2", "symbols": ["root$ebnf$2$macrocall$1"], "postprocess": id},
    {"name": "root$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "root$ebnf$3", "symbols": []},
    {"name": "root$ebnf$3", "symbols": ["root$ebnf$3", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root", "symbols": ["root$ebnf$1", "root$ebnf$2", "root$ebnf$3"], "postprocess":  ([, items]) => {
            const allItems = (items ?? []).flat();
            const defs = [];
            const cmds = [];
            let lastAddedType = null;
            
            allItems.forEach(item => {
                if (!item) return;
        
                // Add comments to last added type
                if (item.type === 'comment') {
                    if (lastAddedType === 'command') {
                        cmds.push(item);
                    } else {
                        defs.push(item);
                    }
                } else if (item.class) {
                    // Definitions have a 'class' property (from getDef function)
                    defs.push(item);
                    lastAddedType = 'definition';   
                } else if (item.type) {
                    // Everything else with a type is a command
                    cmds.push(item);
                    lastAddedType = 'command';
                }
            });
            
            return { defs, cmds };
        } },
    {"name": "definition$subexpression$1", "symbols": ["array_def"]},
    {"name": "definition$subexpression$1", "symbols": ["architecture_def"]},
    {"name": "definition$subexpression$1", "symbols": ["neuralNetwork_def"]},
    {"name": "definition$subexpression$1", "symbols": ["matrix_def"]},
    {"name": "definition$subexpression$1", "symbols": ["linkedlist_def"]},
    {"name": "definition$subexpression$1", "symbols": ["tree_def"]},
    {"name": "definition$subexpression$1", "symbols": ["stack_def"]},
    {"name": "definition$subexpression$1", "symbols": ["graph_def"]},
    {"name": "definition$subexpression$1", "symbols": ["text_def"]},
    {"name": "definition", "symbols": ["definition$subexpression$1"], "postprocess": iid},
    {"name": "definition_or_command$subexpression$1", "symbols": ["definition"]},
    {"name": "definition_or_command$subexpression$1", "symbols": ["commands"]},
    {"name": "definition_or_command", "symbols": ["definition_or_command$subexpression$1"], "postprocess": iid},
    {"name": "array_def$macrocall$2", "symbols": [{"literal":"array"}]},
    {"name": "array_def$macrocall$3", "symbols": ["array_pair"]},
    {"name": "array_def$macrocall$1$macrocall$2", "symbols": ["array_def$macrocall$3"]},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "array_def$macrocall$1$macrocall$2"]},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["array_def$macrocall$1$macrocall$2", "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "array_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "array_def$macrocall$1", "symbols": ["array_def$macrocall$2", "__", "wordL", "_", "equals", "_", "array_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "array_def", "symbols": ["array_def$macrocall$1"], "postprocess": id},
    {"name": "array_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"color"}]},
    {"name": "array_pair$subexpression$1$macrocall$3", "symbols": ["ns_list"]},
    {"name": "array_pair$subexpression$1$macrocall$1", "symbols": ["array_pair$subexpression$1$macrocall$2", "colon", "_", "array_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pair$subexpression$1", "symbols": ["array_pair$subexpression$1$macrocall$1"]},
    {"name": "array_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"value"}]},
    {"name": "array_pair$subexpression$1$macrocall$6", "symbols": ["nns_list"]},
    {"name": "array_pair$subexpression$1$macrocall$4", "symbols": ["array_pair$subexpression$1$macrocall$5", "colon", "_", "array_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pair$subexpression$1", "symbols": ["array_pair$subexpression$1$macrocall$4"]},
    {"name": "array_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"arrow"}]},
    {"name": "array_pair$subexpression$1$macrocall$9", "symbols": ["nns_list"]},
    {"name": "array_pair$subexpression$1$macrocall$7", "symbols": ["array_pair$subexpression$1$macrocall$8", "colon", "_", "array_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pair$subexpression$1", "symbols": ["array_pair$subexpression$1$macrocall$7"]},
    {"name": "array_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"above"}]},
    {"name": "array_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "array_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["word"]},
    {"name": "array_pair$subexpression$1$macrocall$12", "symbols": ["array_pair$subexpression$1$macrocall$12$subexpression$1"], "postprocess": id},
    {"name": "array_pair$subexpression$1$macrocall$10", "symbols": ["array_pair$subexpression$1$macrocall$11", "colon", "_", "array_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pair$subexpression$1", "symbols": ["array_pair$subexpression$1$macrocall$10"]},
    {"name": "array_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"below"}]},
    {"name": "array_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["string"]},
    {"name": "array_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["word"]},
    {"name": "array_pair$subexpression$1$macrocall$15", "symbols": ["array_pair$subexpression$1$macrocall$15$subexpression$1"], "postprocess": id},
    {"name": "array_pair$subexpression$1$macrocall$13", "symbols": ["array_pair$subexpression$1$macrocall$14", "colon", "_", "array_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pair$subexpression$1", "symbols": ["array_pair$subexpression$1$macrocall$13"]},
    {"name": "array_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"left"}]},
    {"name": "array_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["string"]},
    {"name": "array_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["word"]},
    {"name": "array_pair$subexpression$1$macrocall$18", "symbols": ["array_pair$subexpression$1$macrocall$18$subexpression$1"], "postprocess": id},
    {"name": "array_pair$subexpression$1$macrocall$16", "symbols": ["array_pair$subexpression$1$macrocall$17", "colon", "_", "array_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pair$subexpression$1", "symbols": ["array_pair$subexpression$1$macrocall$16"]},
    {"name": "array_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"right"}]},
    {"name": "array_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["string"]},
    {"name": "array_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["word"]},
    {"name": "array_pair$subexpression$1$macrocall$21", "symbols": ["array_pair$subexpression$1$macrocall$21$subexpression$1"], "postprocess": id},
    {"name": "array_pair$subexpression$1$macrocall$19", "symbols": ["array_pair$subexpression$1$macrocall$20", "colon", "_", "array_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pair$subexpression$1", "symbols": ["array_pair$subexpression$1$macrocall$19"]},
    {"name": "array_pair", "symbols": ["array_pair$subexpression$1"], "postprocess": iid},
    {"name": "architecture_def$macrocall$2", "symbols": [{"literal":"architecture"}]},
    {"name": "architecture_def$macrocall$3", "symbols": ["architecture_pair"]},
    {"name": "architecture_def$macrocall$1$macrocall$2", "symbols": ["architecture_def$macrocall$3"]},
    {"name": "architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "architecture_def$macrocall$1$macrocall$2"]},
    {"name": "architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["architecture_def$macrocall$1$macrocall$2", "architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "architecture_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["architecture_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "architecture_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "architecture_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "architecture_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "architecture_def$macrocall$1", "symbols": ["architecture_def$macrocall$2", "__", "wordL", "_", "equals", "_", "architecture_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "architecture_def", "symbols": ["architecture_def$macrocall$1"], "postprocess": id},
    {"name": "architecture_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"title"}]},
    {"name": "architecture_pair$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "architecture_pair$subexpression$1$macrocall$3$subexpression$1", "symbols": ["word"]},
    {"name": "architecture_pair$subexpression$1$macrocall$3", "symbols": ["architecture_pair$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "architecture_pair$subexpression$1$macrocall$1", "symbols": ["architecture_pair$subexpression$1$macrocall$2", "colon", "_", "architecture_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "architecture_pair$subexpression$1", "symbols": ["architecture_pair$subexpression$1$macrocall$1"]},
    {"name": "architecture_pair$subexpression$1", "symbols": ["architecture_block"]},
    {"name": "architecture_pair$subexpression$1", "symbols": ["architecture_diagram"]},
    {"name": "architecture_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"above"}]},
    {"name": "architecture_pair$subexpression$1$macrocall$6$subexpression$1", "symbols": ["string"]},
    {"name": "architecture_pair$subexpression$1$macrocall$6$subexpression$1", "symbols": ["word"]},
    {"name": "architecture_pair$subexpression$1$macrocall$6", "symbols": ["architecture_pair$subexpression$1$macrocall$6$subexpression$1"], "postprocess": id},
    {"name": "architecture_pair$subexpression$1$macrocall$4", "symbols": ["architecture_pair$subexpression$1$macrocall$5", "colon", "_", "architecture_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "architecture_pair$subexpression$1", "symbols": ["architecture_pair$subexpression$1$macrocall$4"]},
    {"name": "architecture_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"below"}]},
    {"name": "architecture_pair$subexpression$1$macrocall$9$subexpression$1", "symbols": ["string"]},
    {"name": "architecture_pair$subexpression$1$macrocall$9$subexpression$1", "symbols": ["word"]},
    {"name": "architecture_pair$subexpression$1$macrocall$9", "symbols": ["architecture_pair$subexpression$1$macrocall$9$subexpression$1"], "postprocess": id},
    {"name": "architecture_pair$subexpression$1$macrocall$7", "symbols": ["architecture_pair$subexpression$1$macrocall$8", "colon", "_", "architecture_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "architecture_pair$subexpression$1", "symbols": ["architecture_pair$subexpression$1$macrocall$7"]},
    {"name": "architecture_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"left"}]},
    {"name": "architecture_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "architecture_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["word"]},
    {"name": "architecture_pair$subexpression$1$macrocall$12", "symbols": ["architecture_pair$subexpression$1$macrocall$12$subexpression$1"], "postprocess": id},
    {"name": "architecture_pair$subexpression$1$macrocall$10", "symbols": ["architecture_pair$subexpression$1$macrocall$11", "colon", "_", "architecture_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "architecture_pair$subexpression$1", "symbols": ["architecture_pair$subexpression$1$macrocall$10"]},
    {"name": "architecture_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"right"}]},
    {"name": "architecture_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["string"]},
    {"name": "architecture_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["word"]},
    {"name": "architecture_pair$subexpression$1$macrocall$15", "symbols": ["architecture_pair$subexpression$1$macrocall$15$subexpression$1"], "postprocess": id},
    {"name": "architecture_pair$subexpression$1$macrocall$13", "symbols": ["architecture_pair$subexpression$1$macrocall$14", "colon", "_", "architecture_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "architecture_pair$subexpression$1", "symbols": ["architecture_pair$subexpression$1$macrocall$13"]},
    {"name": "architecture_pair", "symbols": ["architecture_pair$subexpression$1"], "postprocess": iid},
    {"name": "architecture_block", "symbols": [{"literal":"block"}, "__", "wordL", "_", "colon", "_", "block_body"], "postprocess":  ([, , name , , , , body]) => ({
            blocks: [{id: name, ...body}]
        }) },
    {"name": "architecture_diagram", "symbols": [{"literal":"diagram"}, "_", "colon", "_", "diagram_body"], "postprocess":  ([ , , , , body]) => ({
            diagram: body
        
        })},
    {"name": "block_body$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "block_body$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "block_entry"]},
    {"name": "block_body$ebnf$1$subexpression$1$ebnf$1", "symbols": ["block_body$ebnf$1$subexpression$1$ebnf$1", "block_body$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "block_body$ebnf$1$subexpression$1", "symbols": ["block_entry", "block_body$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "block_body$ebnf$1", "symbols": ["block_body$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "block_body$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "block_body", "symbols": ["lbrac", "wsn", "block_body$ebnf$1", "wsn", "rbrac"], "postprocess":  ([ , ,items, , ]) => {
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (entry.annotation) {
                     if (!result.annotations) result.annotations = [];
        
                    const existing = result.annotations.find(a => a.side === entry.annotation.side);
        
                    if (existing) {
                      Object.assign(existing, entry.annotation);
                    } else { 
                      result.annotations.push({ ...entry.annotation });
                    }
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result
        
            const [first, rest] = items
        
            mergeEntry(first);
        
            if (rest) {
                rest.forEach(x => mergeEntry(x[1]));
            }
        
            return result;
        } },
    {"name": "block_entry$subexpression$1$macrocall$2", "symbols": [{"literal":"layout"}]},
    {"name": "block_entry$subexpression$1$macrocall$3", "symbols": ["layout_literal"]},
    {"name": "block_entry$subexpression$1$macrocall$1", "symbols": ["block_entry$subexpression$1$macrocall$2", "colon", "_", "block_entry$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "block_entry$subexpression$1", "symbols": ["block_entry$subexpression$1$macrocall$1"]},
    {"name": "block_entry$subexpression$1$macrocall$5", "symbols": [{"literal":"gap"}]},
    {"name": "block_entry$subexpression$1$macrocall$6", "symbols": ["number"]},
    {"name": "block_entry$subexpression$1$macrocall$4", "symbols": ["block_entry$subexpression$1$macrocall$5", "colon", "_", "block_entry$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "block_entry$subexpression$1", "symbols": ["block_entry$subexpression$1$macrocall$4"]},
    {"name": "block_entry$subexpression$1$macrocall$8", "symbols": [{"literal":"size"}]},
    {"name": "block_entry$subexpression$1$macrocall$9", "symbols": ["size_tuple"]},
    {"name": "block_entry$subexpression$1$macrocall$7", "symbols": ["block_entry$subexpression$1$macrocall$8", "colon", "_", "block_entry$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "block_entry$subexpression$1", "symbols": ["block_entry$subexpression$1$macrocall$7"]},
    {"name": "block_entry$subexpression$1$macrocall$11", "symbols": [{"literal":"color"}]},
    {"name": "block_entry$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "block_entry$subexpression$1$macrocall$12$subexpression$1", "symbols": ["nullT"]},
    {"name": "block_entry$subexpression$1$macrocall$12", "symbols": ["block_entry$subexpression$1$macrocall$12$subexpression$1"]},
    {"name": "block_entry$subexpression$1$macrocall$10", "symbols": ["block_entry$subexpression$1$macrocall$11", "colon", "_", "block_entry$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "block_entry$subexpression$1", "symbols": ["block_entry$subexpression$1$macrocall$10"]},
    {"name": "block_entry$subexpression$1$macrocall$14", "symbols": [{"literal":"shape"}]},
    {"name": "block_entry$subexpression$1$macrocall$15", "symbols": ["block_group_shape_literal"]},
    {"name": "block_entry$subexpression$1$macrocall$13", "symbols": ["block_entry$subexpression$1$macrocall$14", "colon", "_", "block_entry$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "block_entry$subexpression$1", "symbols": ["block_entry$subexpression$1$macrocall$13"]},
    {"name": "block_entry$subexpression$1", "symbols": ["stroke_property"]},
    {"name": "block_entry$subexpression$1", "symbols": ["block_annotation"]},
    {"name": "block_entry$subexpression$1", "symbols": ["annotation_property"]},
    {"name": "block_entry$subexpression$1", "symbols": ["block_font_subfield"]},
    {"name": "block_entry$subexpression$1", "symbols": ["block_nodes"]},
    {"name": "block_entry$subexpression$1", "symbols": ["block_edges"]},
    {"name": "block_entry$subexpression$1", "symbols": ["block_groups"]},
    {"name": "block_entry", "symbols": ["block_entry$subexpression$1"], "postprocess": iid},
    {"name": "block_font_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "block_font_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "block_font_subfield", "symbols": [{"literal":"fontFamily"}, "colon", "_", "block_font_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ fontFamily: x })},
    {"name": "block_font_subfield", "symbols": [{"literal":"fontSize"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ fontSize: x })},
    {"name": "block_font_subfield", "symbols": [{"literal":"fontWeight"}, "colon", "_", "numberL"], "postprocess": ([ , , , x]) => ({ fontWeight: x })},
    {"name": "block_font_subfield", "symbols": [{"literal":"fontStyle"}, "colon", "_", "font_style_literal"], "postprocess": ([ , , , x]) => ({ fontStyle: x })},
    {"name": "block_font_subfield$subexpression$2", "symbols": ["string"]},
    {"name": "block_font_subfield$subexpression$2", "symbols": ["nullT"]},
    {"name": "block_font_subfield", "symbols": [{"literal":"fontColor"}, "colon", "_", "block_font_subfield$subexpression$2"], "postprocess": ([ , , , x]) => ({ fontColor: x })},
    {"name": "stroke_property", "symbols": [{"literal":"stroke"}, "dot", "stroke_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "stroke_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "stroke_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "stroke_subfield", "symbols": [{"literal":"color"}, "colon", "_", "stroke_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ strokeColor: x })},
    {"name": "stroke_subfield", "symbols": [{"literal":"style"}, "colon", "_", "stroke_style_literal"], "postprocess": ([ , , , x]) => ({ strokeStyle: x })},
    {"name": "stroke_subfield", "symbols": [{"literal":"width"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ strokeWidth: x })},
    {"name": "annotation_entry$subexpression$1", "symbols": ["string"]},
    {"name": "annotation_entry$subexpression$1", "symbols": ["nullT"]},
    {"name": "annotation_entry", "symbols": [{"literal":"annotation"}, "dot", "side_literal", "colon", "_", "annotation_entry$subexpression$1"], "postprocess":  ([, , side, , , value]) => ({
          annotation: { side, value }
        }) },
    {"name": "annotation_entry", "symbols": [{"literal":"annotation"}, "dot", "side_literal", "dot", {"literal":"shift"}, "dot", "side_literal", "colon", "_", "number"], "postprocess":  ([, , side, , , , shiftSide, , , value]) => ({
          annotation: {
            side,
            [`shift${shiftSide[0].toUpperCase()}${shiftSide.slice(1)}`]: value
          }
        }) },
    {"name": "block_annotation", "symbols": ["annotation_entry"], "postprocess": id},
    {"name": "annotation_property", "symbols": [{"literal":"annotation"}, "dot", "annotation_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "annotation_subfield", "symbols": [{"literal":"gap"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ annotationGap: x })},
    {"name": "annotation_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "annotation_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "annotation_subfield", "symbols": [{"literal":"fontFamily"}, "colon", "_", "annotation_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ annotationFontFamily: x })},
    {"name": "annotation_subfield", "symbols": [{"literal":"fontSize"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ annotationFontSize: x })},
    {"name": "annotation_subfield", "symbols": [{"literal":"fontWeight"}, "colon", "_", "numberL"], "postprocess": ([ , , , x]) => ({ annotationFontWeight: x })},
    {"name": "annotation_subfield", "symbols": [{"literal":"fontStyle"}, "colon", "_", "font_style_literal"], "postprocess": ([ , , , x]) => ({ annotationFontStyle: x })},
    {"name": "annotation_subfield$subexpression$2", "symbols": ["string"]},
    {"name": "annotation_subfield$subexpression$2", "symbols": ["nullT"]},
    {"name": "annotation_subfield", "symbols": [{"literal":"fontColor"}, "colon", "_", "annotation_subfield$subexpression$2"], "postprocess": ([ , , , x]) => ({ annotationFontColor: x })},
    {"name": "block_nodes", "symbols": [{"literal":"nodes"}, "colon", "_", "node_list"], "postprocess": ([, , , list]) => ({ nodes: list })},
    {"name": "block_edges", "symbols": [{"literal":"edges"}, "colon", "_", "edge_list"], "postprocess": ([, , , list]) => ({ edges: list })},
    {"name": "block_groups", "symbols": [{"literal":"groups"}, "colon", "_", "group_list"], "postprocess": ([, , , list]) => ({ groups: list })},
    {"name": "node_list$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "node_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "node_entry"]},
    {"name": "node_list$ebnf$1$subexpression$1$ebnf$1", "symbols": ["node_list$ebnf$1$subexpression$1$ebnf$1", "node_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "node_list$ebnf$1$subexpression$1", "symbols": ["node_entry", "node_list$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "node_list$ebnf$1", "symbols": ["node_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "node_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "node_list", "symbols": ["lbrac", "wsn", "node_list$ebnf$1", "wsn", "rbrac"], "postprocess":  ([, , items, ,]) => {
            if (!items) return []
            const [first, rest] = items
            const result = [first];
            if (rest) rest.forEach(x => result.push(x[1]));
            return result;
        } },
    {"name": "node_entry", "symbols": ["wordL", "_", "equals", "wsn", "node_body"], "postprocess":  ([id, , , , body]) => ({
          id,
          ...body
        }) },
    {"name": "node_body$ebnf$1", "symbols": []},
    {"name": "node_body$ebnf$1$subexpression$1", "symbols": ["nlow", "node_field"]},
    {"name": "node_body$ebnf$1", "symbols": ["node_body$ebnf$1", "node_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "node_body", "symbols": ["node_field", "node_body$ebnf$1"], "postprocess":  ([first, rest]) => {
            const fields = [first, ...rest.map(x => x[1])];
        
            let result = {};
            let annotations = [];
        
            for (const entry of fields) {
                if (!entry || typeof entry !== "object") continue;
        
                if (entry.annotation) {
                    const existing = annotations.find(a => a.side === entry.annotation.side);
                    if (existing) {
                        Object.assign(existing, entry.annotation);
                    } else {
                        annotations.push({ ...entry.annotation });
                    }
                    continue;
                    }
        
                for (const key of Object.keys(entry)) {
                    result[key] = entry[key];
                }
            }
        
            if (annotations.length > 0) {
                result.annotations = annotations;
            }
        
            return result;
        } },
    {"name": "node_field$subexpression$1$macrocall$2", "symbols": [{"literal":"type"}]},
    {"name": "node_field$subexpression$1$macrocall$3", "symbols": ["node_type_literal"]},
    {"name": "node_field$subexpression$1$macrocall$1", "symbols": ["node_field$subexpression$1$macrocall$2", "colon", "_", "node_field$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$1"]},
    {"name": "node_field$subexpression$1$macrocall$5", "symbols": [{"literal":"shape"}]},
    {"name": "node_field$subexpression$1$macrocall$6$subexpression$1", "symbols": ["shape_literal"]},
    {"name": "node_field$subexpression$1$macrocall$6$subexpression$1", "symbols": ["number_only_list"]},
    {"name": "node_field$subexpression$1$macrocall$6", "symbols": ["node_field$subexpression$1$macrocall$6$subexpression$1"]},
    {"name": "node_field$subexpression$1$macrocall$4", "symbols": ["node_field$subexpression$1$macrocall$5", "colon", "_", "node_field$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$4"]},
    {"name": "node_field$subexpression$1$macrocall$8", "symbols": [{"literal":"kernelSize"}]},
    {"name": "node_field$subexpression$1$macrocall$9", "symbols": ["kernel_size_literal"]},
    {"name": "node_field$subexpression$1$macrocall$7", "symbols": ["node_field$subexpression$1$macrocall$8", "colon", "_", "node_field$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$7"]},
    {"name": "node_field$subexpression$1$macrocall$11", "symbols": [{"literal":"filterSpacing"}]},
    {"name": "node_field$subexpression$1$macrocall$12", "symbols": ["number"]},
    {"name": "node_field$subexpression$1$macrocall$10", "symbols": ["node_field$subexpression$1$macrocall$11", "colon", "_", "node_field$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$10"]},
    {"name": "node_field$subexpression$1", "symbols": ["node_label_property"]},
    {"name": "node_field$subexpression$1", "symbols": ["node_sub_label_property"]},
    {"name": "node_field$subexpression$1", "symbols": ["node_op_label_property"]},
    {"name": "node_field$subexpression$1", "symbols": ["stroke_property"]},
    {"name": "node_field$subexpression$1", "symbols": ["outer_stroke_property"]},
    {"name": "node_field$subexpression$1", "symbols": ["annotation_property"]},
    {"name": "node_field$subexpression$1$macrocall$14", "symbols": [{"literal":"size"}]},
    {"name": "node_field$subexpression$1$macrocall$15", "symbols": ["size_tuple"]},
    {"name": "node_field$subexpression$1$macrocall$13", "symbols": ["node_field$subexpression$1$macrocall$14", "colon", "_", "node_field$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$13"]},
    {"name": "node_field$subexpression$1$macrocall$17", "symbols": [{"literal":"shape"}]},
    {"name": "node_field$subexpression$1$macrocall$18", "symbols": ["node_shape_literal"]},
    {"name": "node_field$subexpression$1$macrocall$16", "symbols": ["node_field$subexpression$1$macrocall$17", "colon", "_", "node_field$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$16"]},
    {"name": "node_field$subexpression$1$macrocall$20", "symbols": [{"literal":"color"}]},
    {"name": "node_field$subexpression$1$macrocall$21$subexpression$1", "symbols": ["string"]},
    {"name": "node_field$subexpression$1$macrocall$21$subexpression$1", "symbols": ["nullT"]},
    {"name": "node_field$subexpression$1$macrocall$21$subexpression$1", "symbols": ["ns_list"]},
    {"name": "node_field$subexpression$1$macrocall$21", "symbols": ["node_field$subexpression$1$macrocall$21$subexpression$1"]},
    {"name": "node_field$subexpression$1$macrocall$19", "symbols": ["node_field$subexpression$1$macrocall$20", "colon", "_", "node_field$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$19"]},
    {"name": "node_field$subexpression$1$macrocall$23", "symbols": [{"literal":"outputLabels"}]},
    {"name": "node_field$subexpression$1$macrocall$24", "symbols": ["ns_list"]},
    {"name": "node_field$subexpression$1$macrocall$22", "symbols": ["node_field$subexpression$1$macrocall$23", "colon", "_", "node_field$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$22"]},
    {"name": "node_field$subexpression$1$macrocall$26", "symbols": [{"literal":"direction"}]},
    {"name": "node_field$subexpression$1$macrocall$27", "symbols": ["side_literal"]},
    {"name": "node_field$subexpression$1$macrocall$25", "symbols": ["node_field$subexpression$1$macrocall$26", "colon", "_", "node_field$subexpression$1$macrocall$27"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "node_field$subexpression$1", "symbols": ["node_field$subexpression$1$macrocall$25"]},
    {"name": "node_field$subexpression$1", "symbols": ["node_annotation"]},
    {"name": "node_field", "symbols": ["node_field$subexpression$1"], "postprocess": iid},
    {"name": "outer_stroke_property", "symbols": [{"literal":"outerStroke"}, "dot", "outer_stroke_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "outer_stroke_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "outer_stroke_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "outer_stroke_subfield", "symbols": [{"literal":"color"}, "colon", "_", "outer_stroke_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ outerStrokeColor: x })},
    {"name": "outer_stroke_subfield", "symbols": [{"literal":"style"}, "colon", "_", "stroke_style_literal"], "postprocess": ([ , , , x]) => ({ outerStrokeStyle: x })},
    {"name": "outer_stroke_subfield", "symbols": [{"literal":"width"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ outerStrokeWidth: x })},
    {"name": "node_label_property", "symbols": [{"literal":"label"}, "dot", "node_label_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "node_label_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "node_label_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "node_label_subfield", "symbols": [{"literal":"text"}, "colon", "_", "node_label_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ labelText: x })},
    {"name": "node_label_subfield", "symbols": [{"literal":"orientation"}, "colon", "_", "labelOrientation_tuple"], "postprocess": ([ , , , x]) => ({ labelOrientation: x })},
    {"name": "node_label_subfield$subexpression$2", "symbols": ["string"]},
    {"name": "node_label_subfield$subexpression$2", "symbols": ["nullT"]},
    {"name": "node_label_subfield", "symbols": [{"literal":"fontColor"}, "colon", "_", "node_label_subfield$subexpression$2"], "postprocess": ([ , , , x]) => ({ labelFontColor: x })},
    {"name": "node_label_subfield$subexpression$3", "symbols": ["string"]},
    {"name": "node_label_subfield$subexpression$3", "symbols": ["nullT"]},
    {"name": "node_label_subfield", "symbols": [{"literal":"fontFamily"}, "colon", "_", "node_label_subfield$subexpression$3"], "postprocess": ([ , , , x]) => ({ labelFontFamily: x })},
    {"name": "node_label_subfield", "symbols": [{"literal":"fontSize"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ labelFontSize: x })},
    {"name": "node_label_subfield", "symbols": [{"literal":"fontWeight"}, "colon", "_", "numberL"], "postprocess": ([ , , , x]) => ({ labelFontWeight: x })},
    {"name": "node_label_subfield", "symbols": [{"literal":"fontStyle"}, "colon", "_", "font_style_literal"], "postprocess": ([ , , , x]) => ({ labelFontStyle: x })},
    {"name": "node_sub_label_property", "symbols": [{"literal":"subLabel"}, "dot", "node_sub_label_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "node_sub_label_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "node_sub_label_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "node_sub_label_subfield", "symbols": [{"literal":"text"}, "colon", "_", "node_sub_label_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ subLabelText: x })},
    {"name": "node_sub_label_subfield$subexpression$2", "symbols": ["string"]},
    {"name": "node_sub_label_subfield$subexpression$2", "symbols": ["nullT"]},
    {"name": "node_sub_label_subfield", "symbols": [{"literal":"fontColor"}, "colon", "_", "node_sub_label_subfield$subexpression$2"], "postprocess": ([ , , , x]) => ({ subLabelFontColor: x })},
    {"name": "node_sub_label_subfield$subexpression$3", "symbols": ["string"]},
    {"name": "node_sub_label_subfield$subexpression$3", "symbols": ["nullT"]},
    {"name": "node_sub_label_subfield", "symbols": [{"literal":"fontFamily"}, "colon", "_", "node_sub_label_subfield$subexpression$3"], "postprocess": ([ , , , x]) => ({ subLabelFontFamily: x })},
    {"name": "node_sub_label_subfield", "symbols": [{"literal":"fontSize"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ subLabelFontSize: x })},
    {"name": "node_sub_label_subfield", "symbols": [{"literal":"fontWeight"}, "colon", "_", "numberL"], "postprocess": ([ , , , x]) => ({ subLabelFontWeight: x })},
    {"name": "node_sub_label_subfield", "symbols": [{"literal":"fontStyle"}, "colon", "_", "font_style_literal"], "postprocess": ([ , , , x]) => ({ subLabelFontStyle: x })},
    {"name": "node_op_label_property", "symbols": [{"literal":"opLabel"}, "dot", "node_op_label_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "node_op_label_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "node_op_label_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "node_op_label_subfield", "symbols": [{"literal":"text"}, "colon", "_", "node_op_label_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ opLabelText: x })},
    {"name": "node_op_label_subfield$subexpression$2", "symbols": ["string"]},
    {"name": "node_op_label_subfield$subexpression$2", "symbols": ["nullT"]},
    {"name": "node_op_label_subfield", "symbols": [{"literal":"fontColor"}, "colon", "_", "node_op_label_subfield$subexpression$2"], "postprocess": ([ , , , x]) => ({ opLabelFontColor: x })},
    {"name": "node_op_label_subfield$subexpression$3", "symbols": ["string"]},
    {"name": "node_op_label_subfield$subexpression$3", "symbols": ["nullT"]},
    {"name": "node_op_label_subfield", "symbols": [{"literal":"fontFamily"}, "colon", "_", "node_op_label_subfield$subexpression$3"], "postprocess": ([ , , , x]) => ({ opLabelFontFamily: x })},
    {"name": "node_op_label_subfield", "symbols": [{"literal":"fontSize"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ opLabelFontSize: x })},
    {"name": "node_op_label_subfield", "symbols": [{"literal":"fontWeight"}, "colon", "_", "numberL"], "postprocess": ([ , , , x]) => ({ opLabelFontWeight: x })},
    {"name": "node_op_label_subfield", "symbols": [{"literal":"fontStyle"}, "colon", "_", "font_style_literal"], "postprocess": ([ , , , x]) => ({ opLabelFontStyle: x })},
    {"name": "node_op_label_subfield$subexpression$4", "symbols": ["string"]},
    {"name": "node_op_label_subfield$subexpression$4", "symbols": ["nullT"]},
    {"name": "node_op_label_subfield", "symbols": [{"literal":"subtext"}, "colon", "_", "node_op_label_subfield$subexpression$4"], "postprocess": ([ , , , x]) => ({ opLabelSubtext: x })},
    {"name": "node_annotation", "symbols": ["annotation_entry"], "postprocess": id},
    {"name": "edge_list$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "edge_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "edge_entry"]},
    {"name": "edge_list$ebnf$1$subexpression$1$ebnf$1", "symbols": ["edge_list$ebnf$1$subexpression$1$ebnf$1", "edge_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "edge_list$ebnf$1$subexpression$1", "symbols": ["edge_entry", "edge_list$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "edge_list$ebnf$1", "symbols": ["edge_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "edge_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "edge_list", "symbols": ["lbrac", "wsn", "edge_list$ebnf$1", "wsn", "rbrac"], "postprocess":  ([, , items, ,]) => {
            if (!items) return []
            const [first, rest] = items
            const result = [first];
            if (rest) rest.forEach(x => result.push(x[1]));
            return result;
        } },
    {"name": "edge_entry$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "edge_entry$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["nlow", "edge_field"]},
    {"name": "edge_entry$ebnf$1$subexpression$1$ebnf$1", "symbols": ["edge_entry$ebnf$1$subexpression$1$ebnf$1", "edge_entry$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "edge_entry$ebnf$1$subexpression$1", "symbols": ["__", "edge_field", "edge_entry$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "edge_entry$ebnf$1", "symbols": ["edge_entry$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "edge_entry$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "edge_entry", "symbols": ["wordL", "_", "equals", "wsn", "endpoint", "_", (lexer.has("arrow") ? {type: "arrow"} : arrow), "_", "endpoint", "edge_entry$ebnf$1"], "postprocess":  ([id, , , , from, , , , to, fields]) => {
        
            let result = {
                id,
                from,
                to
            };
        
            if (fields) {
                const [ ,first, rest] = fields
        
                if (first) Object.assign(result, first);
        
                if (rest) {
                    rest.forEach(x => {
                        const field = x[1];
                        if (field) Object.assign(result, field);
                    });
                }
            }
        
            return result;
        
            
        } },
    {"name": "edge_field$subexpression$1$macrocall$2", "symbols": [{"literal":"shape"}]},
    {"name": "edge_field$subexpression$1$macrocall$3", "symbols": ["edge_shape_literal"]},
    {"name": "edge_field$subexpression$1$macrocall$1", "symbols": ["edge_field$subexpression$1$macrocall$2", "colon", "_", "edge_field$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$1"]},
    {"name": "edge_field$subexpression$1$macrocall$5", "symbols": [{"literal":"style"}]},
    {"name": "edge_field$subexpression$1$macrocall$6", "symbols": ["edge_style_literal"]},
    {"name": "edge_field$subexpression$1$macrocall$4", "symbols": ["edge_field$subexpression$1$macrocall$5", "colon", "_", "edge_field$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$4"]},
    {"name": "edge_field$subexpression$1$macrocall$8", "symbols": [{"literal":"transition"}]},
    {"name": "edge_field$subexpression$1$macrocall$9", "symbols": ["edge_transition_literal"]},
    {"name": "edge_field$subexpression$1$macrocall$7", "symbols": ["edge_field$subexpression$1$macrocall$8", "colon", "_", "edge_field$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$7"]},
    {"name": "edge_field$subexpression$1$macrocall$11", "symbols": [{"literal":"color"}]},
    {"name": "edge_field$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "edge_field$subexpression$1$macrocall$12$subexpression$1", "symbols": ["nullT"]},
    {"name": "edge_field$subexpression$1$macrocall$12", "symbols": ["edge_field$subexpression$1$macrocall$12$subexpression$1"]},
    {"name": "edge_field$subexpression$1$macrocall$10", "symbols": ["edge_field$subexpression$1$macrocall$11", "colon", "_", "edge_field$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$10"]},
    {"name": "edge_field$subexpression$1$macrocall$14", "symbols": [{"literal":"arrowheads"}]},
    {"name": "edge_field$subexpression$1$macrocall$15", "symbols": ["numberL"]},
    {"name": "edge_field$subexpression$1$macrocall$13", "symbols": ["edge_field$subexpression$1$macrocall$14", "colon", "_", "edge_field$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$13"]},
    {"name": "edge_field$subexpression$1$macrocall$17", "symbols": [{"literal":"gap"}]},
    {"name": "edge_field$subexpression$1$macrocall$18", "symbols": ["number"]},
    {"name": "edge_field$subexpression$1$macrocall$16", "symbols": ["edge_field$subexpression$1$macrocall$17", "colon", "_", "edge_field$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$16"]},
    {"name": "edge_field$subexpression$1$macrocall$20", "symbols": [{"literal":"edgeAnchorOffset"}]},
    {"name": "edge_field$subexpression$1$macrocall$21", "symbols": ["number_only_list"]},
    {"name": "edge_field$subexpression$1$macrocall$19", "symbols": ["edge_field$subexpression$1$macrocall$20", "colon", "_", "edge_field$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$19"]},
    {"name": "edge_field$subexpression$1$macrocall$23", "symbols": [{"literal":"curveHeight"}]},
    {"name": "edge_field$subexpression$1$macrocall$24", "symbols": ["number"]},
    {"name": "edge_field$subexpression$1$macrocall$22", "symbols": ["edge_field$subexpression$1$macrocall$23", "colon", "_", "edge_field$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$22"]},
    {"name": "edge_field$subexpression$1$macrocall$26", "symbols": [{"literal":"width"}]},
    {"name": "edge_field$subexpression$1$macrocall$27", "symbols": ["number"]},
    {"name": "edge_field$subexpression$1$macrocall$25", "symbols": ["edge_field$subexpression$1$macrocall$26", "colon", "_", "edge_field$subexpression$1$macrocall$27"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$25"]},
    {"name": "edge_field$subexpression$1$macrocall$29", "symbols": [{"literal":"bidirectional"}]},
    {"name": "edge_field$subexpression$1$macrocall$30", "symbols": ["boolean"]},
    {"name": "edge_field$subexpression$1$macrocall$28", "symbols": ["edge_field$subexpression$1$macrocall$29", "colon", "_", "edge_field$subexpression$1$macrocall$30"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$28"]},
    {"name": "edge_field$subexpression$1$macrocall$32", "symbols": [{"literal":"headOnly"}]},
    {"name": "edge_field$subexpression$1$macrocall$33", "symbols": ["boolean"]},
    {"name": "edge_field$subexpression$1$macrocall$31", "symbols": ["edge_field$subexpression$1$macrocall$32", "colon", "_", "edge_field$subexpression$1$macrocall$33"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$31"]},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_label_property"]},
    {"name": "edge_field$subexpression$1$macrocall$35", "symbols": [{"literal":"alignToIndexedPort"}]},
    {"name": "edge_field$subexpression$1$macrocall$36", "symbols": ["boolean"]},
    {"name": "edge_field$subexpression$1$macrocall$34", "symbols": ["edge_field$subexpression$1$macrocall$35", "colon", "_", "edge_field$subexpression$1$macrocall$36"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "edge_field$subexpression$1", "symbols": ["edge_field$subexpression$1$macrocall$34"]},
    {"name": "edge_field", "symbols": ["edge_field$subexpression$1"], "postprocess": iid},
    {"name": "edge_label_property", "symbols": [{"literal":"label"}, "dot", "edge_label_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "edge_label_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "edge_label_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "edge_label_subfield", "symbols": [{"literal":"text"}, "colon", "_", "edge_label_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({ labelText: x })},
    {"name": "edge_label_subfield$subexpression$2", "symbols": ["string"]},
    {"name": "edge_label_subfield$subexpression$2", "symbols": ["nullT"]},
    {"name": "edge_label_subfield", "symbols": [{"literal":"fontColor"}, "colon", "_", "edge_label_subfield$subexpression$2"], "postprocess": ([ , , , x]) => ({ labelFontColor: x })},
    {"name": "edge_label_subfield$subexpression$3", "symbols": ["string"]},
    {"name": "edge_label_subfield$subexpression$3", "symbols": ["nullT"]},
    {"name": "edge_label_subfield", "symbols": [{"literal":"fontFamily"}, "colon", "_", "edge_label_subfield$subexpression$3"], "postprocess": ([ , , , x]) => ({ labelFontFamily: x })},
    {"name": "edge_label_subfield", "symbols": [{"literal":"fontSize"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ labelFontSize: x })},
    {"name": "edge_label_subfield", "symbols": [{"literal":"fontWeight"}, "colon", "_", "numberL"], "postprocess": ([ , , , x]) => ({ labelFontWeight: x })},
    {"name": "edge_label_subfield", "symbols": [{"literal":"fontStyle"}, "colon", "_", "font_style_literal"], "postprocess": ([ , , , x]) => ({ labelFontStyle: x })},
    {"name": "edge_label_subfield", "symbols": [{"literal":"shift"}, "dot", "side_literal", "colon", "_", "number"], "postprocess": ([, , side, , , value]) => ({ [`labelShift${side[0].toUpperCase()}${side.slice(1)}`]: value })},
    {"name": "endpoint", "symbols": ["wordL", "anchor_with_index"], "postprocess":  ([name, s]) => {
            if (s.edgeAnchor) {
                return {
                    edge: name,
                    ...s
                };
            }
            return {
                node: name,
                ...s
            };
        } },
    {"name": "anchor_with_index$ebnf$1", "symbols": ["index_opt"], "postprocess": id},
    {"name": "anchor_with_index$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "anchor_with_index", "symbols": ["dot", "node_edge_literals", "anchor_with_index$ebnf$1"], "postprocess":  ([, anchor, index]) => {
            if (anchor === "mid" || anchor === "start" || anchor === "end") {
                return { edgeAnchor: anchor };
            }
        
            if (index !== undefined) {
                return {nodeAnchor: anchor, portIndex: index}
            } else {
                return {nodeAnchor: anchor}
            }
        
        } },
    {"name": "index_opt", "symbols": ["lbrac", "_", "numberL", "_", "rbrac"], "postprocess": ([, , n, ,]) => n},
    {"name": "group_list$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "group_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "group_entry"]},
    {"name": "group_list$ebnf$1$subexpression$1$ebnf$1", "symbols": ["group_list$ebnf$1$subexpression$1$ebnf$1", "group_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "group_list$ebnf$1$subexpression$1", "symbols": ["group_entry", "group_list$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "group_list$ebnf$1", "symbols": ["group_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "group_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "group_list", "symbols": ["lbrac", "wsn", "group_list$ebnf$1", "wsn", "rbrac"], "postprocess":  ([, , items, ,]) => {
            if (!items) return []
            const [first, rest] = items
            const result = [first];
            if (rest) rest.forEach(x => result.push(x[1]));
            return result;
        } },
    {"name": "group_entry", "symbols": ["wordL", "_", "equals", "wsn", "group_body"], "postprocess":  ([id, , , , body]) => ({
          id,
          ...body
        }) },
    {"name": "group_body$ebnf$1", "symbols": []},
    {"name": "group_body$ebnf$1$subexpression$1", "symbols": ["nlow", "group_field"]},
    {"name": "group_body$ebnf$1", "symbols": ["group_body$ebnf$1", "group_body$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "group_body", "symbols": ["group_field", "group_body$ebnf$1"], "postprocess":  ([first, rest]) => {
            let result = {};
        
            const mergeField = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (entry.annotation) {
                    if (!result.annotations) result.annotations = [];
        
                    const existing = result.annotations.find(a => a.side === entry.annotation.side);
                    if (existing) {
                        Object.assign(existing, entry.annotation);
                    } else {
                        result.annotations.push({ ...entry.annotation });
                    }
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            mergeField(first);
        
            if (rest) {
                rest.forEach(([, field]) => mergeField(field));
            }
        
            return result;
        
            
        } },
    {"name": "group_field$subexpression$1$macrocall$2", "symbols": [{"literal":"members"}]},
    {"name": "group_field$subexpression$1$macrocall$3", "symbols": ["member_list"]},
    {"name": "group_field$subexpression$1$macrocall$1", "symbols": ["group_field$subexpression$1$macrocall$2", "colon", "_", "group_field$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "group_field$subexpression$1", "symbols": ["group_field$subexpression$1$macrocall$1"]},
    {"name": "group_field$subexpression$1$macrocall$5", "symbols": [{"literal":"layout"}]},
    {"name": "group_field$subexpression$1$macrocall$6", "symbols": ["layout_literal"]},
    {"name": "group_field$subexpression$1$macrocall$4", "symbols": ["group_field$subexpression$1$macrocall$5", "colon", "_", "group_field$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "group_field$subexpression$1", "symbols": ["group_field$subexpression$1$macrocall$4"]},
    {"name": "group_field$subexpression$1$macrocall$8", "symbols": [{"literal":"gap"}]},
    {"name": "group_field$subexpression$1$macrocall$9", "symbols": ["number"]},
    {"name": "group_field$subexpression$1$macrocall$7", "symbols": ["group_field$subexpression$1$macrocall$8", "colon", "_", "group_field$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "group_field$subexpression$1", "symbols": ["group_field$subexpression$1$macrocall$7"]},
    {"name": "group_field$subexpression$1$macrocall$11", "symbols": [{"literal":"color"}]},
    {"name": "group_field$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "group_field$subexpression$1$macrocall$12$subexpression$1", "symbols": ["nullT"]},
    {"name": "group_field$subexpression$1$macrocall$12", "symbols": ["group_field$subexpression$1$macrocall$12$subexpression$1"]},
    {"name": "group_field$subexpression$1$macrocall$10", "symbols": ["group_field$subexpression$1$macrocall$11", "colon", "_", "group_field$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "group_field$subexpression$1", "symbols": ["group_field$subexpression$1$macrocall$10"]},
    {"name": "group_field$subexpression$1$macrocall$14", "symbols": [{"literal":"colorBoxAdjustments"}]},
    {"name": "group_field$subexpression$1$macrocall$15", "symbols": ["size_4tuple"]},
    {"name": "group_field$subexpression$1$macrocall$13", "symbols": ["group_field$subexpression$1$macrocall$14", "colon", "_", "group_field$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "group_field$subexpression$1", "symbols": ["group_field$subexpression$1$macrocall$13"]},
    {"name": "group_field$subexpression$1$macrocall$17", "symbols": [{"literal":"align"}]},
    {"name": "group_field$subexpression$1$macrocall$18", "symbols": ["boolean"]},
    {"name": "group_field$subexpression$1$macrocall$16", "symbols": ["group_field$subexpression$1$macrocall$17", "colon", "_", "group_field$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "group_field$subexpression$1", "symbols": ["group_field$subexpression$1$macrocall$16"]},
    {"name": "group_field$subexpression$1$macrocall$20", "symbols": [{"literal":"shape"}]},
    {"name": "group_field$subexpression$1$macrocall$21", "symbols": ["block_group_shape_literal"]},
    {"name": "group_field$subexpression$1$macrocall$19", "symbols": ["group_field$subexpression$1$macrocall$20", "colon", "_", "group_field$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "group_field$subexpression$1", "symbols": ["group_field$subexpression$1$macrocall$19"]},
    {"name": "group_field$subexpression$1", "symbols": ["stroke_property"]},
    {"name": "group_field$subexpression$1", "symbols": ["marker_property"]},
    {"name": "group_field$subexpression$1", "symbols": ["anchor_property"]},
    {"name": "group_field$subexpression$1", "symbols": ["group_annotation"]},
    {"name": "group_field$subexpression$1", "symbols": ["annotation_property"]},
    {"name": "group_field$subexpression$1", "symbols": ["shift_property"]},
    {"name": "group_field", "symbols": ["group_field$subexpression$1"], "postprocess": iid},
    {"name": "anchor_property", "symbols": [{"literal":"anchor"}, "dot", "anchor_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "anchor_subfield", "symbols": [{"literal":"source"}, "colon", "_", "wordL"], "postprocess": ([ , , , x]) => ({anchorSource: x})},
    {"name": "anchor_subfield", "symbols": [{"literal":"target"}, "colon", "_", "wordL"], "postprocess": ([ , , , x]) => ({anchorTarget: x})},
    {"name": "shift_property", "symbols": [{"literal":"shift"}, "dot", "shift_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "shift_subfield", "symbols": [{"literal":"left"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({shiftLeft: x})},
    {"name": "shift_subfield", "symbols": [{"literal":"right"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({shiftRight: x})},
    {"name": "shift_subfield", "symbols": [{"literal":"top"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({shiftTop: x})},
    {"name": "shift_subfield", "symbols": [{"literal":"bottom"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({shiftBottom: x})},
    {"name": "marker_property", "symbols": [{"literal":"marker"}, "dot", "marker_subfield"], "postprocess": ([ , , sub]) => sub},
    {"name": "marker_subfield", "symbols": [{"literal":"type"}, "colon", "_", "marker_type_literal"], "postprocess": ([ , , , x]) => ({markerType: x})},
    {"name": "marker_subfield$subexpression$1", "symbols": ["string"]},
    {"name": "marker_subfield$subexpression$1", "symbols": ["nullT"]},
    {"name": "marker_subfield", "symbols": [{"literal":"color"}, "colon", "_", "marker_subfield$subexpression$1"], "postprocess": ([ , , , x]) => ({markerColor: x})},
    {"name": "marker_subfield", "symbols": [{"literal":"position"}, "colon", "_", "side_literal"], "postprocess": ([ , , , x]) => ({markerPosition: x})},
    {"name": "marker_subfield$subexpression$2", "symbols": ["string"]},
    {"name": "marker_subfield$subexpression$2", "symbols": ["nullT"]},
    {"name": "marker_subfield", "symbols": [{"literal":"text"}, "colon", "_", "marker_subfield$subexpression$2"], "postprocess": ([ , , , x]) => ({ markerLabelText: x })},
    {"name": "marker_subfield$subexpression$3", "symbols": ["string"]},
    {"name": "marker_subfield$subexpression$3", "symbols": ["nullT"]},
    {"name": "marker_subfield", "symbols": [{"literal":"fontColor"}, "colon", "_", "marker_subfield$subexpression$3"], "postprocess": ([ , , , x]) => ({ markerLabelFontColor: x })},
    {"name": "marker_subfield$subexpression$4", "symbols": ["string"]},
    {"name": "marker_subfield$subexpression$4", "symbols": ["nullT"]},
    {"name": "marker_subfield", "symbols": [{"literal":"fontFamily"}, "colon", "_", "marker_subfield$subexpression$4"], "postprocess": ([ , , , x]) => ({ markerLabelFontFamily: x })},
    {"name": "marker_subfield", "symbols": [{"literal":"fontSize"}, "colon", "_", "number"], "postprocess": ([ , , , x]) => ({ markerLabelFontSize: x })},
    {"name": "marker_subfield", "symbols": [{"literal":"fontWeight"}, "colon", "_", "numberL"], "postprocess": ([ , , , x]) => ({ markerLabelFontWeight: x })},
    {"name": "marker_subfield", "symbols": [{"literal":"fontStyle"}, "colon", "_", "font_style_literal"], "postprocess": ([ , , , x]) => ({ markerLabelFontStyle: x })},
    {"name": "marker_subfield", "symbols": [{"literal":"shift"}, "dot", {"literal":"left"}, "colon", "_", "number"], "postprocess": ([ , , , , , x]) => ({ markerLeft: x })},
    {"name": "marker_subfield", "symbols": [{"literal":"shift"}, "dot", {"literal":"right"}, "colon", "_", "number"], "postprocess": ([ , , , , , x]) => ({ markerRight: x })},
    {"name": "marker_subfield", "symbols": [{"literal":"shift"}, "dot", {"literal":"bottom"}, "colon", "_", "number"], "postprocess": ([ , , , , , x]) => ({ markerBottom: x })},
    {"name": "marker_subfield", "symbols": [{"literal":"shift"}, "dot", {"literal":"top"}, "colon", "_", "number"], "postprocess": ([ , , , , , x]) => ({ markerTop: x })},
    {"name": "group_annotation", "symbols": ["annotation_entry"], "postprocess": id},
    {"name": "member_list$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "member_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "wordL"]},
    {"name": "member_list$ebnf$1$subexpression$1$ebnf$1", "symbols": ["member_list$ebnf$1$subexpression$1$ebnf$1", "member_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "member_list$ebnf$1$subexpression$1", "symbols": ["wordL", "member_list$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "member_list$ebnf$1", "symbols": ["member_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "member_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "member_list", "symbols": ["lbrac", "wsn", "member_list$ebnf$1", "wsn", "rbrac"], "postprocess":  ([, ,items, ,]) => {
           if (!items) return []
           const [first, rest] = items
           let result = [first]
           if (rest) rest.forEach(([, member]) => result.push(member));
           return result
        } },
    {"name": "diagram_body$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "diagram_body$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "diagram_entry"]},
    {"name": "diagram_body$ebnf$1$subexpression$1$ebnf$1", "symbols": ["diagram_body$ebnf$1$subexpression$1$ebnf$1", "diagram_body$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "diagram_body$ebnf$1$subexpression$1", "symbols": ["diagram_entry", "diagram_body$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "diagram_body$ebnf$1", "symbols": ["diagram_body$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "diagram_body$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "diagram_body", "symbols": ["lbrac", "wsn", "diagram_body$ebnf$1", "wsn", "rbrac"], "postprocess":  ([, ,items, ,]) => {
            if (!items) return {}
            const [first, rest] = items
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (entry.annotation) {
                    if (!result.annotations) result.annotations = [];
        
                    const existing = result.annotations.find(a => a.side === entry.annotation.side);
                    if (existing) {
                    Object.assign(existing, entry.annotation);
                     } else {
                    result.annotations.push({ ...entry.annotation });
                    }
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            mergeEntry(first);
        
            if (rest) {
                rest.forEach(x => mergeEntry(x[1]));
            }
        
            return result;
        } },
    {"name": "diagram_entry$subexpression$1$macrocall$2", "symbols": [{"literal":"layout"}]},
    {"name": "diagram_entry$subexpression$1$macrocall$3", "symbols": ["layout_literal"]},
    {"name": "diagram_entry$subexpression$1$macrocall$1", "symbols": ["diagram_entry$subexpression$1$macrocall$2", "colon", "_", "diagram_entry$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "diagram_entry$subexpression$1", "symbols": ["diagram_entry$subexpression$1$macrocall$1"]},
    {"name": "diagram_entry$subexpression$1$macrocall$5", "symbols": [{"literal":"gap"}]},
    {"name": "diagram_entry$subexpression$1$macrocall$6", "symbols": ["number"]},
    {"name": "diagram_entry$subexpression$1$macrocall$4", "symbols": ["diagram_entry$subexpression$1$macrocall$5", "colon", "_", "diagram_entry$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "diagram_entry$subexpression$1", "symbols": ["diagram_entry$subexpression$1$macrocall$4"]},
    {"name": "diagram_entry$subexpression$1$macrocall$8", "symbols": [{"literal":"rotateRight"}]},
    {"name": "diagram_entry$subexpression$1$macrocall$9", "symbols": ["numberL"]},
    {"name": "diagram_entry$subexpression$1$macrocall$7", "symbols": ["diagram_entry$subexpression$1$macrocall$8", "colon", "_", "diagram_entry$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "diagram_entry$subexpression$1", "symbols": ["diagram_entry$subexpression$1$macrocall$7"]},
    {"name": "diagram_entry$subexpression$1$macrocall$11", "symbols": [{"literal":"uses"}]},
    {"name": "diagram_entry$subexpression$1$macrocall$12", "symbols": ["use_list"]},
    {"name": "diagram_entry$subexpression$1$macrocall$10", "symbols": ["diagram_entry$subexpression$1$macrocall$11", "colon", "_", "diagram_entry$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "diagram_entry$subexpression$1", "symbols": ["diagram_entry$subexpression$1$macrocall$10"]},
    {"name": "diagram_entry$subexpression$1$macrocall$14", "symbols": [{"literal":"connects"}]},
    {"name": "diagram_entry$subexpression$1$macrocall$15", "symbols": ["connect_list"]},
    {"name": "diagram_entry$subexpression$1$macrocall$13", "symbols": ["diagram_entry$subexpression$1$macrocall$14", "colon", "_", "diagram_entry$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "diagram_entry$subexpression$1", "symbols": ["diagram_entry$subexpression$1$macrocall$13"]},
    {"name": "diagram_entry$subexpression$1", "symbols": ["diagram_annotation"]},
    {"name": "diagram_entry$subexpression$1", "symbols": ["annotation_property"]},
    {"name": "diagram_entry", "symbols": ["diagram_entry$subexpression$1"], "postprocess": iid},
    {"name": "diagram_annotation", "symbols": ["annotation_entry"], "postprocess": id},
    {"name": "connect_list$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "connect_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "connect_entry"]},
    {"name": "connect_list$ebnf$1$subexpression$1$ebnf$1", "symbols": ["connect_list$ebnf$1$subexpression$1$ebnf$1", "connect_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "connect_list$ebnf$1$subexpression$1", "symbols": ["connect_entry", "connect_list$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "connect_list$ebnf$1", "symbols": ["connect_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "connect_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "connect_list", "symbols": ["lbrac", "wsn", "connect_list$ebnf$1", "wsn", "rbrac"], "postprocess":  ([, , items, ,]) => {
            if (!items) return []
            const [first, rest] = items
            const result = [first];
            if (rest) rest.forEach(x => result.push(x[1]));
            return result;
        } },
    {"name": "connect_entry$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "connect_entry$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["nlow", "connect_field"]},
    {"name": "connect_entry$ebnf$1$subexpression$1$ebnf$1", "symbols": ["connect_entry$ebnf$1$subexpression$1$ebnf$1", "connect_entry$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "connect_entry$ebnf$1$subexpression$1", "symbols": ["__", "connect_field", "connect_entry$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "connect_entry$ebnf$1", "symbols": ["connect_entry$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "connect_entry$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "connect_entry", "symbols": ["endpoint_connect", "_", (lexer.has("arrow") ? {type: "arrow"} : arrow), "_", "endpoint_connect", "connect_entry$ebnf$1"], "postprocess":  ([from, , , , to, fields]) => {
        
            let result = {
                from,
                to
            };
        
            if (fields) {
                const [ ,first, rest] = fields
        
                if (first) Object.assign(result, first);
        
                if (rest) {
                    rest.forEach(x => {
                        const field = x[1];
                        if (field) Object.assign(result, field);
                    });
                }
            }
        
            return result;
        
            
        } },
    {"name": "endpoint_connect", "symbols": ["wordL", "dot", "wordL", "anchor_with_index"], "postprocess":  ([blockName, ,node_or_edge, s]) => {
            if (s.edgeAnchor) {
                return {
                    block: blockName,
                    edge: node_or_edge,
                    ...s
                };
            }
            return {
                block: blockName,
                node: node_or_edge,
                ...s
            };
        } },
    {"name": "connect_field$subexpression$1$macrocall$2", "symbols": [{"literal":"shape"}]},
    {"name": "connect_field$subexpression$1$macrocall$3", "symbols": ["edge_shape_literal"]},
    {"name": "connect_field$subexpression$1$macrocall$1", "symbols": ["connect_field$subexpression$1$macrocall$2", "colon", "_", "connect_field$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$1"]},
    {"name": "connect_field$subexpression$1$macrocall$5", "symbols": [{"literal":"style"}]},
    {"name": "connect_field$subexpression$1$macrocall$6", "symbols": ["edge_style_literal"]},
    {"name": "connect_field$subexpression$1$macrocall$4", "symbols": ["connect_field$subexpression$1$macrocall$5", "colon", "_", "connect_field$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$4"]},
    {"name": "connect_field$subexpression$1$macrocall$8", "symbols": [{"literal":"transition"}]},
    {"name": "connect_field$subexpression$1$macrocall$9", "symbols": ["edge_transition_literal"]},
    {"name": "connect_field$subexpression$1$macrocall$7", "symbols": ["connect_field$subexpression$1$macrocall$8", "colon", "_", "connect_field$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$7"]},
    {"name": "connect_field$subexpression$1$macrocall$11", "symbols": [{"literal":"color"}]},
    {"name": "connect_field$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "connect_field$subexpression$1$macrocall$12$subexpression$1", "symbols": ["nullT"]},
    {"name": "connect_field$subexpression$1$macrocall$12", "symbols": ["connect_field$subexpression$1$macrocall$12$subexpression$1"]},
    {"name": "connect_field$subexpression$1$macrocall$10", "symbols": ["connect_field$subexpression$1$macrocall$11", "colon", "_", "connect_field$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$10"]},
    {"name": "connect_field$subexpression$1$macrocall$14", "symbols": [{"literal":"arrowheads"}]},
    {"name": "connect_field$subexpression$1$macrocall$15", "symbols": ["numberL"]},
    {"name": "connect_field$subexpression$1$macrocall$13", "symbols": ["connect_field$subexpression$1$macrocall$14", "colon", "_", "connect_field$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$13"]},
    {"name": "connect_field$subexpression$1$macrocall$17", "symbols": [{"literal":"gap"}]},
    {"name": "connect_field$subexpression$1$macrocall$18", "symbols": ["number"]},
    {"name": "connect_field$subexpression$1$macrocall$16", "symbols": ["connect_field$subexpression$1$macrocall$17", "colon", "_", "connect_field$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$16"]},
    {"name": "connect_field$subexpression$1$macrocall$20", "symbols": [{"literal":"curveHeight"}]},
    {"name": "connect_field$subexpression$1$macrocall$21", "symbols": ["number"]},
    {"name": "connect_field$subexpression$1$macrocall$19", "symbols": ["connect_field$subexpression$1$macrocall$20", "colon", "_", "connect_field$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$19"]},
    {"name": "connect_field$subexpression$1$macrocall$23", "symbols": [{"literal":"width"}]},
    {"name": "connect_field$subexpression$1$macrocall$24", "symbols": ["number"]},
    {"name": "connect_field$subexpression$1$macrocall$22", "symbols": ["connect_field$subexpression$1$macrocall$23", "colon", "_", "connect_field$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$22"]},
    {"name": "connect_field$subexpression$1$macrocall$26", "symbols": [{"literal":"alignToIndexedPort"}]},
    {"name": "connect_field$subexpression$1$macrocall$27", "symbols": ["boolean"]},
    {"name": "connect_field$subexpression$1$macrocall$25", "symbols": ["connect_field$subexpression$1$macrocall$26", "colon", "_", "connect_field$subexpression$1$macrocall$27"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$25"]},
    {"name": "connect_field$subexpression$1$macrocall$29", "symbols": [{"literal":"edgeAnchorOffset"}]},
    {"name": "connect_field$subexpression$1$macrocall$30", "symbols": ["number_only_list"]},
    {"name": "connect_field$subexpression$1$macrocall$28", "symbols": ["connect_field$subexpression$1$macrocall$29", "colon", "_", "connect_field$subexpression$1$macrocall$30"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$28"]},
    {"name": "connect_field$subexpression$1$macrocall$32", "symbols": [{"literal":"bidirectional"}]},
    {"name": "connect_field$subexpression$1$macrocall$33", "symbols": ["boolean"]},
    {"name": "connect_field$subexpression$1$macrocall$31", "symbols": ["connect_field$subexpression$1$macrocall$32", "colon", "_", "connect_field$subexpression$1$macrocall$33"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "connect_field$subexpression$1", "symbols": ["connect_field$subexpression$1$macrocall$31"]},
    {"name": "connect_field$subexpression$1", "symbols": ["edge_label_property"]},
    {"name": "connect_field", "symbols": ["connect_field$subexpression$1"], "postprocess": iid},
    {"name": "use_list$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "use_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow_new_arch", "use_entry"]},
    {"name": "use_list$ebnf$1$subexpression$1$ebnf$1", "symbols": ["use_list$ebnf$1$subexpression$1$ebnf$1", "use_list$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "use_list$ebnf$1$subexpression$1", "symbols": ["use_entry", "use_list$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "use_list$ebnf$1", "symbols": ["use_list$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "use_list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "use_list", "symbols": ["lbrac", "wsn", "use_list$ebnf$1", "wsn", "rbrac"], "postprocess":  ([, ,items, ,]) => {
           if (!items) return []
           const [first, rest] = items
           let result = [first]
           if (rest) rest.forEach(([, member]) => result.push(member));
           return result
        } },
    {"name": "use_entry$ebnf$1$subexpression$1$macrocall$2", "symbols": [{"literal":"anchor"}]},
    {"name": "use_entry$ebnf$1$subexpression$1$macrocall$3", "symbols": ["wordL"]},
    {"name": "use_entry$ebnf$1$subexpression$1$macrocall$1", "symbols": ["use_entry$ebnf$1$subexpression$1$macrocall$2", "colon", "_", "use_entry$ebnf$1$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "use_entry$ebnf$1$subexpression$1", "symbols": ["_", "use_entry$ebnf$1$subexpression$1$macrocall$1"]},
    {"name": "use_entry$ebnf$1", "symbols": ["use_entry$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "use_entry$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "use_entry", "symbols": ["wordL", "_", "equals", "_", "wordL", "use_entry$ebnf$1"], "postprocess":  ([alias, , , ,blockName, field]) => ({
          id: alias,
          block: blockName,
           ...(field ? field[1] : null)
        
        }) },
    {"name": "shape_literal", "symbols": [(lexer.has("layoutspec") ? {type: "layoutspec"} : layoutspec)], "postprocess":  ([t]) => {
          const parts = t.value.split("x").map(Number);
        
          if (!(parts.length === 2 || parts.length === 3)) {
            throw new Error("shape must be NUMBERxNUMBER or NUMBERxNUMBERxNUMBER");
          }
        
          if (parts.some(n => !Number.isInteger(n) || n < 0)) {
            throw new Error("shape values must be non-negative integers");
          }
        
          return parts;
        } },
    {"name": "kernel_size_literal", "symbols": [(lexer.has("layoutspec") ? {type: "layoutspec"} : layoutspec)], "postprocess":  ([t]) => {
          const parts = t.value.split("x").map(Number);
        
          if (parts.length !== 2) {
            throw new Error("kernelSize must be NUMBERxNUMBER");
          }
        
          if (parts.some(n => !Number.isInteger(n) || n < 0)) {
            throw new Error("kernelSize values must be non-negative integers");
          }
        
          return parts;
        } },
    {"name": "marker_type_literal", "symbols": [{"literal":"bracket"}], "postprocess": () => "bracket"},
    {"name": "marker_type_literal", "symbols": [{"literal":"brace"}], "postprocess": () => "brace"},
    {"name": "marker_type_literal", "symbols": [{"literal":"arrow"}], "postprocess": () => "arrow"},
    {"name": "label_orientation_literal", "symbols": [{"literal":"horizontal"}], "postprocess": () => "horizontal"},
    {"name": "label_orientation_literal", "symbols": [{"literal":"vertical"}], "postprocess": () => "vertical"},
    {"name": "node_edge_literals", "symbols": ["side_literal"], "postprocess": id},
    {"name": "node_edge_literals", "symbols": [{"literal":"mid"}], "postprocess": () => "mid"},
    {"name": "node_edge_literals", "symbols": [{"literal":"start"}], "postprocess": () => "start"},
    {"name": "node_edge_literals", "symbols": [{"literal":"end"}], "postprocess": () => "end"},
    {"name": "edge_shape_literal", "symbols": [{"literal":"straight"}], "postprocess": () => "straight"},
    {"name": "edge_shape_literal", "symbols": [{"literal":"bow"}], "postprocess": () => "bow"},
    {"name": "edge_shape_literal", "symbols": [{"literal":"arc"}], "postprocess": () => "arc"},
    {"name": "edge_style_literal", "symbols": [{"literal":"solid"}], "postprocess": () => "solid"},
    {"name": "edge_style_literal", "symbols": [{"literal":"dashed"}], "postprocess": () => "dashed"},
    {"name": "edge_style_literal", "symbols": [{"literal":"dotted"}], "postprocess": () => "dotted"},
    {"name": "stroke_style_literal", "symbols": [{"literal":"solid"}], "postprocess": () => "solid"},
    {"name": "stroke_style_literal", "symbols": [{"literal":"dashed"}], "postprocess": () => "dashed"},
    {"name": "stroke_style_literal", "symbols": [{"literal":"dotted"}], "postprocess": () => "dotted"},
    {"name": "edge_transition_literal", "symbols": [{"literal":"default"}], "postprocess": () => "default"},
    {"name": "edge_transition_literal", "symbols": [{"literal":"featureMap"}], "postprocess": () => "featureMap"},
    {"name": "edge_transition_literal", "symbols": [{"literal":"flatten"}], "postprocess": () => "flatten"},
    {"name": "edge_transition_literal", "symbols": [{"literal":"fullyConnected"}], "postprocess": () => "fullyConnected"},
    {"name": "layout_literal", "symbols": [{"literal":"horizontal"}], "postprocess": () => "horizontal"},
    {"name": "layout_literal", "symbols": [{"literal":"vertical"}], "postprocess": () => "vertical"},
    {"name": "layout_literal", "symbols": [{"literal":"grid"}], "postprocess": () => "grid"},
    {"name": "size_tuple$macrocall$2", "symbols": ["number"]},
    {"name": "size_tuple$macrocall$3", "symbols": ["number"]},
    {"name": "size_tuple$macrocall$1", "symbols": ["lparen", "_", "size_tuple$macrocall$2", "_", "comma", "_", "size_tuple$macrocall$3", "_", "rparen"], "postprocess": ([, , x, , , , y, ]) => [x[0], y[0]]},
    {"name": "size_tuple", "symbols": ["size_tuple$macrocall$1"], "postprocess": id},
    {"name": "labelOrientation_tuple$macrocall$2", "symbols": ["labelOrientation_orientation_literal"]},
    {"name": "labelOrientation_tuple$macrocall$3", "symbols": ["labelOrientation_side_literal"]},
    {"name": "labelOrientation_tuple$macrocall$1", "symbols": ["lparen", "_", "labelOrientation_tuple$macrocall$2", "_", "comma", "_", "labelOrientation_tuple$macrocall$3", "_", "rparen"], "postprocess": ([, , x, , , , y, ]) => [x[0], y[0]]},
    {"name": "labelOrientation_tuple", "symbols": ["labelOrientation_tuple$macrocall$1"], "postprocess": id},
    {"name": "labelOrientation_orientation_literal", "symbols": [{"literal":"vertical"}], "postprocess": () => "vertical"},
    {"name": "labelOrientation_side_literal", "symbols": [{"literal":"right"}], "postprocess": () => "right"},
    {"name": "labelOrientation_side_literal", "symbols": [{"literal":"left"}], "postprocess": () => "left"},
    {"name": "size_4tuple$macrocall$2", "symbols": ["number"]},
    {"name": "size_4tuple$macrocall$3", "symbols": ["number"]},
    {"name": "size_4tuple$macrocall$4", "symbols": ["number"]},
    {"name": "size_4tuple$macrocall$5", "symbols": ["number"]},
    {"name": "size_4tuple$macrocall$1", "symbols": ["lparen", "_", "size_4tuple$macrocall$2", "_", "comma", "_", "size_4tuple$macrocall$3", "_", "comma", "_", "size_4tuple$macrocall$4", "_", "comma", "_", "size_4tuple$macrocall$5", "_", "rparen"], "postprocess": ([, , a, , , , b, , , , c, , , , d, ]) => [a[0], b[0], c[0], d[0]]},
    {"name": "size_4tuple", "symbols": ["size_4tuple$macrocall$1"], "postprocess": id},
    {"name": "node_type_literal", "symbols": [{"literal":"text"}], "postprocess": () => "text"},
    {"name": "node_type_literal", "symbols": [{"literal":"rect"}], "postprocess": () => "rect"},
    {"name": "node_type_literal", "symbols": [{"literal":"circle"}], "postprocess": () => "circle"},
    {"name": "node_type_literal", "symbols": [{"literal":"stacked"}], "postprocess": () => "stacked"},
    {"name": "node_type_literal", "symbols": [{"literal":"flatten"}], "postprocess": () => "flatten"},
    {"name": "node_type_literal", "symbols": [{"literal":"fullyConnected"}], "postprocess": () => "fullyConnected"},
    {"name": "node_type_literal", "symbols": [{"literal":"arrow"}], "postprocess": () => "arrow"},
    {"name": "node_type_literal", "symbols": [{"literal":"trapezoid"}], "postprocess": () => "trapezoid"},
    {"name": "font_style_literal", "symbols": [{"literal":"normal"}], "postprocess": () => "normal"},
    {"name": "font_style_literal", "symbols": [{"literal":"italic"}], "postprocess": () => "italic"},
    {"name": "font_style_literal", "symbols": [{"literal":"oblique"}], "postprocess": () => "oblique"},
    {"name": "node_shape_literal", "symbols": [{"literal":"rounded"}], "postprocess": () => "rounded"},
    {"name": "block_group_shape_literal", "symbols": [{"literal":"rounded"}], "postprocess": () => "rounded"},
    {"name": "node_orientation_literal", "symbols": [{"literal":"vertical"}], "postprocess": () => "vertical"},
    {"name": "node_orientation_literal", "symbols": [{"literal":"horizontal"}], "postprocess": () => "horizontal"},
    {"name": "side_literal", "symbols": [{"literal":"top"}], "postprocess": () => "top"},
    {"name": "side_literal", "symbols": [{"literal":"bottom"}], "postprocess": () => "bottom"},
    {"name": "side_literal", "symbols": [{"literal":"left"}], "postprocess": () => "left"},
    {"name": "side_literal", "symbols": [{"literal":"right"}], "postprocess": () => "right"},
    {"name": "neuralNetwork_def$macrocall$2", "symbols": [{"literal":"neuralnetwork"}]},
    {"name": "neuralNetwork_def$macrocall$3", "symbols": ["neuralNetwork_pair"]},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$2", "symbols": ["neuralNetwork_def$macrocall$3"]},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "neuralNetwork_def$macrocall$1$macrocall$2"]},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["neuralNetwork_def$macrocall$1$macrocall$2", "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "neuralNetwork_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "neuralNetwork_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "neuralNetwork_def$macrocall$1", "symbols": ["neuralNetwork_def$macrocall$2", "__", "wordL", "_", "equals", "_", "neuralNetwork_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "neuralNetwork_def", "symbols": ["neuralNetwork_def$macrocall$1"], "postprocess": id},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"layers"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$3", "symbols": ["nns_list"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$2", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$1"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"neurons"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$6", "symbols": ["nns_mlist"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$4", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$5", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$4"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"layerColors"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$9", "symbols": ["ns_list"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$7", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$8", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$7"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"neuronColors"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$12", "symbols": ["nns_mlist"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$10", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$11", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$10"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"showBias"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$15", "symbols": ["boolean"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$13", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$14", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$13"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"showLabels"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$18", "symbols": ["boolean"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$16", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$17", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$16"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"labelPosition"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$21", "symbols": ["position_labels_literal"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$19", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$20", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$19"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$23", "symbols": [{"literal":"showWeights"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$24", "symbols": ["boolean"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$22", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$23", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$22"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$26", "symbols": [{"literal":"showArrowheads"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$27", "symbols": ["boolean"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$25", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$26", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$27"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$25"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$29", "symbols": [{"literal":"edgeWidth"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$30", "symbols": ["numberL"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$28", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$29", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$30"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$28"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$32", "symbols": [{"literal":"edgeColor"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$33$subexpression$1", "symbols": ["string"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$33$subexpression$1", "symbols": []},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$33", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$33$subexpression$1"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$31", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$32", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$33"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$31"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$35", "symbols": [{"literal":"layerSpacing"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$36", "symbols": ["number"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$34", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$35", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$36"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$34"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$38", "symbols": [{"literal":"neuronSpacing"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$39", "symbols": ["number"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$37", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$38", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$39"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$37"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$41", "symbols": [{"literal":"layerStrokes"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$42", "symbols": ["ns_list"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$40", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$41", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$42"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$40"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$44", "symbols": [{"literal":"above"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$45$subexpression$1", "symbols": ["string"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$45$subexpression$1", "symbols": ["word"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$45", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$45$subexpression$1"], "postprocess": id},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$43", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$44", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$45"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$43"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$47", "symbols": [{"literal":"below"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$48$subexpression$1", "symbols": ["string"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$48$subexpression$1", "symbols": ["word"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$48", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$48$subexpression$1"], "postprocess": id},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$46", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$47", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$48"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$46"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$50", "symbols": [{"literal":"left"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$51$subexpression$1", "symbols": ["string"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$51$subexpression$1", "symbols": ["word"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$51", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$51$subexpression$1"], "postprocess": id},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$49", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$50", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$51"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$49"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$53", "symbols": [{"literal":"right"}]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$54$subexpression$1", "symbols": ["string"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$54$subexpression$1", "symbols": ["word"]},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$54", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$54$subexpression$1"], "postprocess": id},
    {"name": "neuralNetwork_pair$subexpression$1$macrocall$52", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$53", "colon", "_", "neuralNetwork_pair$subexpression$1$macrocall$54"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "neuralNetwork_pair$subexpression$1", "symbols": ["neuralNetwork_pair$subexpression$1$macrocall$52"]},
    {"name": "neuralNetwork_pair", "symbols": ["neuralNetwork_pair$subexpression$1"], "postprocess": iid},
    {"name": "matrix_def$macrocall$2", "symbols": [{"literal":"matrix"}]},
    {"name": "matrix_def$macrocall$3", "symbols": ["matrix_pair"]},
    {"name": "matrix_def$macrocall$1$macrocall$2", "symbols": ["matrix_def$macrocall$3"]},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "matrix_def$macrocall$1$macrocall$2"]},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["matrix_def$macrocall$1$macrocall$2", "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "matrix_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "matrix_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "matrix_def$macrocall$1", "symbols": ["matrix_def$macrocall$2", "__", "wordL", "_", "equals", "_", "matrix_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "matrix_def", "symbols": ["matrix_def$macrocall$1"], "postprocess": id},
    {"name": "matrix_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"value"}]},
    {"name": "matrix_pair$subexpression$1$macrocall$3", "symbols": ["nns_mlist"]},
    {"name": "matrix_pair$subexpression$1$macrocall$1", "symbols": ["matrix_pair$subexpression$1$macrocall$2", "colon", "_", "matrix_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "matrix_pair$subexpression$1", "symbols": ["matrix_pair$subexpression$1$macrocall$1"]},
    {"name": "matrix_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"color"}]},
    {"name": "matrix_pair$subexpression$1$macrocall$6", "symbols": ["nns_mlist"]},
    {"name": "matrix_pair$subexpression$1$macrocall$4", "symbols": ["matrix_pair$subexpression$1$macrocall$5", "colon", "_", "matrix_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "matrix_pair$subexpression$1", "symbols": ["matrix_pair$subexpression$1$macrocall$4"]},
    {"name": "matrix_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"arrow"}]},
    {"name": "matrix_pair$subexpression$1$macrocall$9", "symbols": ["nns_mlist"]},
    {"name": "matrix_pair$subexpression$1$macrocall$7", "symbols": ["matrix_pair$subexpression$1$macrocall$8", "colon", "_", "matrix_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "matrix_pair$subexpression$1", "symbols": ["matrix_pair$subexpression$1$macrocall$7"]},
    {"name": "matrix_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"above"}]},
    {"name": "matrix_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "matrix_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["word"]},
    {"name": "matrix_pair$subexpression$1$macrocall$12", "symbols": ["matrix_pair$subexpression$1$macrocall$12$subexpression$1"], "postprocess": id},
    {"name": "matrix_pair$subexpression$1$macrocall$10", "symbols": ["matrix_pair$subexpression$1$macrocall$11", "colon", "_", "matrix_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "matrix_pair$subexpression$1", "symbols": ["matrix_pair$subexpression$1$macrocall$10"]},
    {"name": "matrix_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"below"}]},
    {"name": "matrix_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["string"]},
    {"name": "matrix_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["word"]},
    {"name": "matrix_pair$subexpression$1$macrocall$15", "symbols": ["matrix_pair$subexpression$1$macrocall$15$subexpression$1"], "postprocess": id},
    {"name": "matrix_pair$subexpression$1$macrocall$13", "symbols": ["matrix_pair$subexpression$1$macrocall$14", "colon", "_", "matrix_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "matrix_pair$subexpression$1", "symbols": ["matrix_pair$subexpression$1$macrocall$13"]},
    {"name": "matrix_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"left"}]},
    {"name": "matrix_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["string"]},
    {"name": "matrix_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["word"]},
    {"name": "matrix_pair$subexpression$1$macrocall$18", "symbols": ["matrix_pair$subexpression$1$macrocall$18$subexpression$1"], "postprocess": id},
    {"name": "matrix_pair$subexpression$1$macrocall$16", "symbols": ["matrix_pair$subexpression$1$macrocall$17", "colon", "_", "matrix_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "matrix_pair$subexpression$1", "symbols": ["matrix_pair$subexpression$1$macrocall$16"]},
    {"name": "matrix_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"right"}]},
    {"name": "matrix_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["string"]},
    {"name": "matrix_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["word"]},
    {"name": "matrix_pair$subexpression$1$macrocall$21", "symbols": ["matrix_pair$subexpression$1$macrocall$21$subexpression$1"], "postprocess": id},
    {"name": "matrix_pair$subexpression$1$macrocall$19", "symbols": ["matrix_pair$subexpression$1$macrocall$20", "colon", "_", "matrix_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "matrix_pair$subexpression$1", "symbols": ["matrix_pair$subexpression$1$macrocall$19"]},
    {"name": "matrix_pair", "symbols": ["matrix_pair$subexpression$1"], "postprocess": iid},
    {"name": "linkedlist_def$macrocall$2", "symbols": [{"literal":"linkedlist"}]},
    {"name": "linkedlist_def$macrocall$3", "symbols": ["linkedlist_pair"]},
    {"name": "linkedlist_def$macrocall$1$macrocall$2", "symbols": ["linkedlist_def$macrocall$3"]},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "linkedlist_def$macrocall$1$macrocall$2"]},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["linkedlist_def$macrocall$1$macrocall$2", "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "linkedlist_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "linkedlist_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "linkedlist_def$macrocall$1", "symbols": ["linkedlist_def$macrocall$2", "__", "wordL", "_", "equals", "_", "linkedlist_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "linkedlist_def", "symbols": ["linkedlist_def$macrocall$1"], "postprocess": id},
    {"name": "linkedlist_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"nodes"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$3", "symbols": ["w_list"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$2", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$1"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"color"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$6", "symbols": ["ns_list"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$4", "symbols": ["linkedlist_pair$subexpression$1$macrocall$5", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$4"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"value"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$9", "symbols": ["nns_list"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$7", "symbols": ["linkedlist_pair$subexpression$1$macrocall$8", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$7"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"arrow"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$12", "symbols": ["nns_list"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$10", "symbols": ["linkedlist_pair$subexpression$1$macrocall$11", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$10"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"above"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["string"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["word"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$15", "symbols": ["linkedlist_pair$subexpression$1$macrocall$15$subexpression$1"], "postprocess": id},
    {"name": "linkedlist_pair$subexpression$1$macrocall$13", "symbols": ["linkedlist_pair$subexpression$1$macrocall$14", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$13"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"below"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["string"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["word"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$18", "symbols": ["linkedlist_pair$subexpression$1$macrocall$18$subexpression$1"], "postprocess": id},
    {"name": "linkedlist_pair$subexpression$1$macrocall$16", "symbols": ["linkedlist_pair$subexpression$1$macrocall$17", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$16"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"left"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["string"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["word"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$21", "symbols": ["linkedlist_pair$subexpression$1$macrocall$21$subexpression$1"], "postprocess": id},
    {"name": "linkedlist_pair$subexpression$1$macrocall$19", "symbols": ["linkedlist_pair$subexpression$1$macrocall$20", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$19"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$23", "symbols": [{"literal":"right"}]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$24$subexpression$1", "symbols": ["string"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$24$subexpression$1", "symbols": ["word"]},
    {"name": "linkedlist_pair$subexpression$1$macrocall$24", "symbols": ["linkedlist_pair$subexpression$1$macrocall$24$subexpression$1"], "postprocess": id},
    {"name": "linkedlist_pair$subexpression$1$macrocall$22", "symbols": ["linkedlist_pair$subexpression$1$macrocall$23", "colon", "_", "linkedlist_pair$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "linkedlist_pair$subexpression$1", "symbols": ["linkedlist_pair$subexpression$1$macrocall$22"]},
    {"name": "linkedlist_pair", "symbols": ["linkedlist_pair$subexpression$1"], "postprocess": iid},
    {"name": "tree_def$macrocall$2", "symbols": [{"literal":"tree"}]},
    {"name": "tree_def$macrocall$3", "symbols": ["tree_pair"]},
    {"name": "tree_def$macrocall$1$macrocall$2", "symbols": ["tree_def$macrocall$3"]},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "tree_def$macrocall$1$macrocall$2"]},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["tree_def$macrocall$1$macrocall$2", "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tree_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "tree_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "tree_def$macrocall$1", "symbols": ["tree_def$macrocall$2", "__", "wordL", "_", "equals", "_", "tree_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "tree_def", "symbols": ["tree_def$macrocall$1"], "postprocess": id},
    {"name": "tree_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"nodes"}]},
    {"name": "tree_pair$subexpression$1$macrocall$3", "symbols": ["w_list"]},
    {"name": "tree_pair$subexpression$1$macrocall$1", "symbols": ["tree_pair$subexpression$1$macrocall$2", "colon", "_", "tree_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$1"]},
    {"name": "tree_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"color"}]},
    {"name": "tree_pair$subexpression$1$macrocall$6", "symbols": ["ns_list"]},
    {"name": "tree_pair$subexpression$1$macrocall$4", "symbols": ["tree_pair$subexpression$1$macrocall$5", "colon", "_", "tree_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$4"]},
    {"name": "tree_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"value"}]},
    {"name": "tree_pair$subexpression$1$macrocall$9", "symbols": ["nns_list"]},
    {"name": "tree_pair$subexpression$1$macrocall$7", "symbols": ["tree_pair$subexpression$1$macrocall$8", "colon", "_", "tree_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$7"]},
    {"name": "tree_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"arrow"}]},
    {"name": "tree_pair$subexpression$1$macrocall$12", "symbols": ["nns_list"]},
    {"name": "tree_pair$subexpression$1$macrocall$10", "symbols": ["tree_pair$subexpression$1$macrocall$11", "colon", "_", "tree_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$10"]},
    {"name": "tree_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"children"}]},
    {"name": "tree_pair$subexpression$1$macrocall$15", "symbols": ["e_list"]},
    {"name": "tree_pair$subexpression$1$macrocall$13", "symbols": ["tree_pair$subexpression$1$macrocall$14", "colon", "_", "tree_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$13"]},
    {"name": "tree_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"above"}]},
    {"name": "tree_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["string"]},
    {"name": "tree_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["word"]},
    {"name": "tree_pair$subexpression$1$macrocall$18", "symbols": ["tree_pair$subexpression$1$macrocall$18$subexpression$1"], "postprocess": id},
    {"name": "tree_pair$subexpression$1$macrocall$16", "symbols": ["tree_pair$subexpression$1$macrocall$17", "colon", "_", "tree_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$16"]},
    {"name": "tree_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"below"}]},
    {"name": "tree_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["string"]},
    {"name": "tree_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["word"]},
    {"name": "tree_pair$subexpression$1$macrocall$21", "symbols": ["tree_pair$subexpression$1$macrocall$21$subexpression$1"], "postprocess": id},
    {"name": "tree_pair$subexpression$1$macrocall$19", "symbols": ["tree_pair$subexpression$1$macrocall$20", "colon", "_", "tree_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$19"]},
    {"name": "tree_pair$subexpression$1$macrocall$23", "symbols": [{"literal":"left"}]},
    {"name": "tree_pair$subexpression$1$macrocall$24$subexpression$1", "symbols": ["string"]},
    {"name": "tree_pair$subexpression$1$macrocall$24$subexpression$1", "symbols": ["word"]},
    {"name": "tree_pair$subexpression$1$macrocall$24", "symbols": ["tree_pair$subexpression$1$macrocall$24$subexpression$1"], "postprocess": id},
    {"name": "tree_pair$subexpression$1$macrocall$22", "symbols": ["tree_pair$subexpression$1$macrocall$23", "colon", "_", "tree_pair$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$22"]},
    {"name": "tree_pair$subexpression$1$macrocall$26", "symbols": [{"literal":"right"}]},
    {"name": "tree_pair$subexpression$1$macrocall$27$subexpression$1", "symbols": ["string"]},
    {"name": "tree_pair$subexpression$1$macrocall$27$subexpression$1", "symbols": ["word"]},
    {"name": "tree_pair$subexpression$1$macrocall$27", "symbols": ["tree_pair$subexpression$1$macrocall$27$subexpression$1"], "postprocess": id},
    {"name": "tree_pair$subexpression$1$macrocall$25", "symbols": ["tree_pair$subexpression$1$macrocall$26", "colon", "_", "tree_pair$subexpression$1$macrocall$27"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "tree_pair$subexpression$1", "symbols": ["tree_pair$subexpression$1$macrocall$25"]},
    {"name": "tree_pair", "symbols": ["tree_pair$subexpression$1"], "postprocess": iid},
    {"name": "stack_def$macrocall$2", "symbols": [{"literal":"stack"}]},
    {"name": "stack_def$macrocall$3", "symbols": ["stack_pair"]},
    {"name": "stack_def$macrocall$1$macrocall$2", "symbols": ["stack_def$macrocall$3"]},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "stack_def$macrocall$1$macrocall$2"]},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["stack_def$macrocall$1$macrocall$2", "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "stack_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "stack_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "stack_def$macrocall$1", "symbols": ["stack_def$macrocall$2", "__", "wordL", "_", "equals", "_", "stack_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "stack_def", "symbols": ["stack_def$macrocall$1"], "postprocess": id},
    {"name": "stack_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"color"}]},
    {"name": "stack_pair$subexpression$1$macrocall$3", "symbols": ["ns_list"]},
    {"name": "stack_pair$subexpression$1$macrocall$1", "symbols": ["stack_pair$subexpression$1$macrocall$2", "colon", "_", "stack_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "stack_pair$subexpression$1", "symbols": ["stack_pair$subexpression$1$macrocall$1"]},
    {"name": "stack_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"value"}]},
    {"name": "stack_pair$subexpression$1$macrocall$6", "symbols": ["nns_list"]},
    {"name": "stack_pair$subexpression$1$macrocall$4", "symbols": ["stack_pair$subexpression$1$macrocall$5", "colon", "_", "stack_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "stack_pair$subexpression$1", "symbols": ["stack_pair$subexpression$1$macrocall$4"]},
    {"name": "stack_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"arrow"}]},
    {"name": "stack_pair$subexpression$1$macrocall$9", "symbols": ["nns_list"]},
    {"name": "stack_pair$subexpression$1$macrocall$7", "symbols": ["stack_pair$subexpression$1$macrocall$8", "colon", "_", "stack_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "stack_pair$subexpression$1", "symbols": ["stack_pair$subexpression$1$macrocall$7"]},
    {"name": "stack_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"above"}]},
    {"name": "stack_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "stack_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["word"]},
    {"name": "stack_pair$subexpression$1$macrocall$12", "symbols": ["stack_pair$subexpression$1$macrocall$12$subexpression$1"], "postprocess": id},
    {"name": "stack_pair$subexpression$1$macrocall$10", "symbols": ["stack_pair$subexpression$1$macrocall$11", "colon", "_", "stack_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "stack_pair$subexpression$1", "symbols": ["stack_pair$subexpression$1$macrocall$10"]},
    {"name": "stack_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"below"}]},
    {"name": "stack_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["string"]},
    {"name": "stack_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["word"]},
    {"name": "stack_pair$subexpression$1$macrocall$15", "symbols": ["stack_pair$subexpression$1$macrocall$15$subexpression$1"], "postprocess": id},
    {"name": "stack_pair$subexpression$1$macrocall$13", "symbols": ["stack_pair$subexpression$1$macrocall$14", "colon", "_", "stack_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "stack_pair$subexpression$1", "symbols": ["stack_pair$subexpression$1$macrocall$13"]},
    {"name": "stack_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"left"}]},
    {"name": "stack_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["string"]},
    {"name": "stack_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["word"]},
    {"name": "stack_pair$subexpression$1$macrocall$18", "symbols": ["stack_pair$subexpression$1$macrocall$18$subexpression$1"], "postprocess": id},
    {"name": "stack_pair$subexpression$1$macrocall$16", "symbols": ["stack_pair$subexpression$1$macrocall$17", "colon", "_", "stack_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "stack_pair$subexpression$1", "symbols": ["stack_pair$subexpression$1$macrocall$16"]},
    {"name": "stack_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"right"}]},
    {"name": "stack_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["string"]},
    {"name": "stack_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["word"]},
    {"name": "stack_pair$subexpression$1$macrocall$21", "symbols": ["stack_pair$subexpression$1$macrocall$21$subexpression$1"], "postprocess": id},
    {"name": "stack_pair$subexpression$1$macrocall$19", "symbols": ["stack_pair$subexpression$1$macrocall$20", "colon", "_", "stack_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "stack_pair$subexpression$1", "symbols": ["stack_pair$subexpression$1$macrocall$19"]},
    {"name": "stack_pair", "symbols": ["stack_pair$subexpression$1"], "postprocess": iid},
    {"name": "graph_def$macrocall$2", "symbols": [{"literal":"graph"}]},
    {"name": "graph_def$macrocall$3", "symbols": ["graph_pair"]},
    {"name": "graph_def$macrocall$1$macrocall$2", "symbols": ["graph_def$macrocall$3"]},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "graph_def$macrocall$1$macrocall$2"]},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["graph_def$macrocall$1$macrocall$2", "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "graph_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "graph_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "graph_def$macrocall$1", "symbols": ["graph_def$macrocall$2", "__", "wordL", "_", "equals", "_", "graph_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "graph_def", "symbols": ["graph_def$macrocall$1"], "postprocess": id},
    {"name": "graph_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"nodes"}]},
    {"name": "graph_pair$subexpression$1$macrocall$3", "symbols": ["w_list"]},
    {"name": "graph_pair$subexpression$1$macrocall$1", "symbols": ["graph_pair$subexpression$1$macrocall$2", "colon", "_", "graph_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$1"]},
    {"name": "graph_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"color"}]},
    {"name": "graph_pair$subexpression$1$macrocall$6", "symbols": ["ns_list"]},
    {"name": "graph_pair$subexpression$1$macrocall$4", "symbols": ["graph_pair$subexpression$1$macrocall$5", "colon", "_", "graph_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$4"]},
    {"name": "graph_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"value"}]},
    {"name": "graph_pair$subexpression$1$macrocall$9", "symbols": ["nns_list"]},
    {"name": "graph_pair$subexpression$1$macrocall$7", "symbols": ["graph_pair$subexpression$1$macrocall$8", "colon", "_", "graph_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$7"]},
    {"name": "graph_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"arrow"}]},
    {"name": "graph_pair$subexpression$1$macrocall$12", "symbols": ["nns_list"]},
    {"name": "graph_pair$subexpression$1$macrocall$10", "symbols": ["graph_pair$subexpression$1$macrocall$11", "colon", "_", "graph_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$10"]},
    {"name": "graph_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"edges"}]},
    {"name": "graph_pair$subexpression$1$macrocall$15", "symbols": ["e_list"]},
    {"name": "graph_pair$subexpression$1$macrocall$13", "symbols": ["graph_pair$subexpression$1$macrocall$14", "colon", "_", "graph_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$13"]},
    {"name": "graph_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"hidden"}]},
    {"name": "graph_pair$subexpression$1$macrocall$18", "symbols": ["b_list"]},
    {"name": "graph_pair$subexpression$1$macrocall$16", "symbols": ["graph_pair$subexpression$1$macrocall$17", "colon", "_", "graph_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$16"]},
    {"name": "graph_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"above"}]},
    {"name": "graph_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["string"]},
    {"name": "graph_pair$subexpression$1$macrocall$21$subexpression$1", "symbols": ["word"]},
    {"name": "graph_pair$subexpression$1$macrocall$21", "symbols": ["graph_pair$subexpression$1$macrocall$21$subexpression$1"], "postprocess": id},
    {"name": "graph_pair$subexpression$1$macrocall$19", "symbols": ["graph_pair$subexpression$1$macrocall$20", "colon", "_", "graph_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$19"]},
    {"name": "graph_pair$subexpression$1$macrocall$23", "symbols": [{"literal":"below"}]},
    {"name": "graph_pair$subexpression$1$macrocall$24$subexpression$1", "symbols": ["string"]},
    {"name": "graph_pair$subexpression$1$macrocall$24$subexpression$1", "symbols": ["word"]},
    {"name": "graph_pair$subexpression$1$macrocall$24", "symbols": ["graph_pair$subexpression$1$macrocall$24$subexpression$1"], "postprocess": id},
    {"name": "graph_pair$subexpression$1$macrocall$22", "symbols": ["graph_pair$subexpression$1$macrocall$23", "colon", "_", "graph_pair$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$22"]},
    {"name": "graph_pair$subexpression$1$macrocall$26", "symbols": [{"literal":"left"}]},
    {"name": "graph_pair$subexpression$1$macrocall$27$subexpression$1", "symbols": ["string"]},
    {"name": "graph_pair$subexpression$1$macrocall$27$subexpression$1", "symbols": ["word"]},
    {"name": "graph_pair$subexpression$1$macrocall$27", "symbols": ["graph_pair$subexpression$1$macrocall$27$subexpression$1"], "postprocess": id},
    {"name": "graph_pair$subexpression$1$macrocall$25", "symbols": ["graph_pair$subexpression$1$macrocall$26", "colon", "_", "graph_pair$subexpression$1$macrocall$27"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$25"]},
    {"name": "graph_pair$subexpression$1$macrocall$29", "symbols": [{"literal":"right"}]},
    {"name": "graph_pair$subexpression$1$macrocall$30$subexpression$1", "symbols": ["string"]},
    {"name": "graph_pair$subexpression$1$macrocall$30$subexpression$1", "symbols": ["word"]},
    {"name": "graph_pair$subexpression$1$macrocall$30", "symbols": ["graph_pair$subexpression$1$macrocall$30$subexpression$1"], "postprocess": id},
    {"name": "graph_pair$subexpression$1$macrocall$28", "symbols": ["graph_pair$subexpression$1$macrocall$29", "colon", "_", "graph_pair$subexpression$1$macrocall$30"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "graph_pair$subexpression$1", "symbols": ["graph_pair$subexpression$1$macrocall$28"]},
    {"name": "graph_pair", "symbols": ["graph_pair$subexpression$1"], "postprocess": iid},
    {"name": "text_def$macrocall$2", "symbols": [{"literal":"text"}]},
    {"name": "text_def$macrocall$3", "symbols": ["text_pair"]},
    {"name": "text_def$macrocall$1$macrocall$2", "symbols": ["text_def$macrocall$3"]},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": []},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "text_def$macrocall$1$macrocall$2"]},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "symbols": ["text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1", "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["text_def$macrocall$1$macrocall$2", "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1$ebnf$1"]},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "wsn", "text_def$macrocall$1$macrocall$1$ebnf$1", "wsn", "rbracket"], "postprocess":  d => {
            const items = d[2];
            let result = {};
        
            const mergeEntry = (entry) => {
                if (!entry || typeof entry !== "object") return;
        
                if (Array.isArray(entry.blocks)) {
                    if (!result.blocks) result.blocks = [];
                    result.blocks.push(...entry.blocks);
                    const { blocks, ...rest } = entry;
                    Object.assign(result, rest);
                    return;
                }
        
                Object.assign(result, entry);
            };
        
            if (!items) return result;
        
            const [firstXValue, repetitionGroups] = items;
        
            if (
                Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null &&
                typeof firstXValue[0][0] === "object" &&
                !Array.isArray(firstXValue[0][0])
            ) {
                mergeEntry(firstXValue[0][0]);
            }
        
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    if (
                        Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null &&
                        typeof subsequentXValue[0][0] === "object" &&
                        !Array.isArray(subsequentXValue[0][0])
                    ) {
                        mergeEntry(subsequentXValue[0][0]);
                    }
                });
            }
        
            return result;
        } },
    {"name": "text_def$macrocall$1", "symbols": ["text_def$macrocall$2", "__", "wordL", "_", "equals", "_", "text_def$macrocall$1$macrocall$1", "_"], "postprocess": ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL })},
    {"name": "text_def", "symbols": ["text_def$macrocall$1"], "postprocess": id},
    {"name": "text_pair$subexpression$1$macrocall$2", "symbols": [{"literal":"value"}]},
    {"name": "text_pair$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "text_pair$subexpression$1$macrocall$3$subexpression$1", "symbols": ["s_list"]},
    {"name": "text_pair$subexpression$1$macrocall$3", "symbols": ["text_pair$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "text_pair$subexpression$1$macrocall$1", "symbols": ["text_pair$subexpression$1$macrocall$2", "colon", "_", "text_pair$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$1"]},
    {"name": "text_pair$subexpression$1$macrocall$5", "symbols": [{"literal":"fontSize"}]},
    {"name": "text_pair$subexpression$1$macrocall$6$subexpression$1", "symbols": ["number"]},
    {"name": "text_pair$subexpression$1$macrocall$6$subexpression$1", "symbols": ["n_list"]},
    {"name": "text_pair$subexpression$1$macrocall$6", "symbols": ["text_pair$subexpression$1$macrocall$6$subexpression$1"], "postprocess": id},
    {"name": "text_pair$subexpression$1$macrocall$4", "symbols": ["text_pair$subexpression$1$macrocall$5", "colon", "_", "text_pair$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$4"]},
    {"name": "text_pair$subexpression$1$macrocall$8", "symbols": [{"literal":"color"}]},
    {"name": "text_pair$subexpression$1$macrocall$9$subexpression$1", "symbols": ["string"]},
    {"name": "text_pair$subexpression$1$macrocall$9$subexpression$1", "symbols": ["ns_list"]},
    {"name": "text_pair$subexpression$1$macrocall$9", "symbols": ["text_pair$subexpression$1$macrocall$9$subexpression$1"], "postprocess": id},
    {"name": "text_pair$subexpression$1$macrocall$7", "symbols": ["text_pair$subexpression$1$macrocall$8", "colon", "_", "text_pair$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$7"]},
    {"name": "text_pair$subexpression$1$macrocall$11", "symbols": [{"literal":"fontWeight"}]},
    {"name": "text_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["string"]},
    {"name": "text_pair$subexpression$1$macrocall$12$subexpression$1", "symbols": ["ns_list"]},
    {"name": "text_pair$subexpression$1$macrocall$12", "symbols": ["text_pair$subexpression$1$macrocall$12$subexpression$1"], "postprocess": id},
    {"name": "text_pair$subexpression$1$macrocall$10", "symbols": ["text_pair$subexpression$1$macrocall$11", "colon", "_", "text_pair$subexpression$1$macrocall$12"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$10"]},
    {"name": "text_pair$subexpression$1$macrocall$14", "symbols": [{"literal":"fontFamily"}]},
    {"name": "text_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["string"]},
    {"name": "text_pair$subexpression$1$macrocall$15$subexpression$1", "symbols": ["ns_list"]},
    {"name": "text_pair$subexpression$1$macrocall$15", "symbols": ["text_pair$subexpression$1$macrocall$15$subexpression$1"], "postprocess": id},
    {"name": "text_pair$subexpression$1$macrocall$13", "symbols": ["text_pair$subexpression$1$macrocall$14", "colon", "_", "text_pair$subexpression$1$macrocall$15"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$13"]},
    {"name": "text_pair$subexpression$1$macrocall$17", "symbols": [{"literal":"align"}]},
    {"name": "text_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["string"]},
    {"name": "text_pair$subexpression$1$macrocall$18$subexpression$1", "symbols": ["ns_list"]},
    {"name": "text_pair$subexpression$1$macrocall$18", "symbols": ["text_pair$subexpression$1$macrocall$18$subexpression$1"], "postprocess": id},
    {"name": "text_pair$subexpression$1$macrocall$16", "symbols": ["text_pair$subexpression$1$macrocall$17", "colon", "_", "text_pair$subexpression$1$macrocall$18"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$16"]},
    {"name": "text_pair$subexpression$1$macrocall$20", "symbols": [{"literal":"lineSpacing"}]},
    {"name": "text_pair$subexpression$1$macrocall$21", "symbols": ["number"]},
    {"name": "text_pair$subexpression$1$macrocall$19", "symbols": ["text_pair$subexpression$1$macrocall$20", "colon", "_", "text_pair$subexpression$1$macrocall$21"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$19"]},
    {"name": "text_pair$subexpression$1$macrocall$23", "symbols": [{"literal":"width"}]},
    {"name": "text_pair$subexpression$1$macrocall$24", "symbols": ["number"]},
    {"name": "text_pair$subexpression$1$macrocall$22", "symbols": ["text_pair$subexpression$1$macrocall$23", "colon", "_", "text_pair$subexpression$1$macrocall$24"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$22"]},
    {"name": "text_pair$subexpression$1$macrocall$26", "symbols": [{"literal":"height"}]},
    {"name": "text_pair$subexpression$1$macrocall$27", "symbols": ["number"]},
    {"name": "text_pair$subexpression$1$macrocall$25", "symbols": ["text_pair$subexpression$1$macrocall$26", "colon", "_", "text_pair$subexpression$1$macrocall$27"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "text_pair$subexpression$1", "symbols": ["text_pair$subexpression$1$macrocall$25"]},
    {"name": "text_pair", "symbols": ["text_pair$subexpression$1"], "postprocess": iid},
    {"name": "commands$subexpression$1", "symbols": ["comment"]},
    {"name": "commands$subexpression$1", "symbols": ["page"]},
    {"name": "commands$subexpression$1", "symbols": ["show"]},
    {"name": "commands$subexpression$1", "symbols": ["hide"]},
    {"name": "commands$subexpression$1", "symbols": ["set_value"]},
    {"name": "commands$subexpression$1", "symbols": ["set_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_arrow"]},
    {"name": "commands$subexpression$1", "symbols": ["set_hidden"]},
    {"name": "commands$subexpression$1", "symbols": ["set_edges"]},
    {"name": "commands$subexpression$1", "symbols": ["block_remove_nodes"]},
    {"name": "commands$subexpression$1", "symbols": ["block_remove_node"]},
    {"name": "commands$subexpression$1", "symbols": ["block_remove_group"]},
    {"name": "commands$subexpression$1", "symbols": ["block_remove_block"]},
    {"name": "commands$subexpression$1", "symbols": ["block_remove_edges"]},
    {"name": "commands$subexpression$1", "symbols": ["block_remove_edge"]},
    {"name": "commands$subexpression$1", "symbols": ["set_node_label"]},
    {"name": "commands$subexpression$1", "symbols": ["set_node_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_node_stroke"]},
    {"name": "commands$subexpression$1", "symbols": ["set_edge_label"]},
    {"name": "commands$subexpression$1", "symbols": ["set_edge_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_edge_shape"]},
    {"name": "commands$subexpression$1", "symbols": ["hide_node"]},
    {"name": "commands$subexpression$1", "symbols": ["show_node"]},
    {"name": "commands$subexpression$1", "symbols": ["hide_edge"]},
    {"name": "commands$subexpression$1", "symbols": ["show_edge"]},
    {"name": "commands$subexpression$1", "symbols": ["hide_block"]},
    {"name": "commands$subexpression$1", "symbols": ["show_block"]},
    {"name": "commands$subexpression$1", "symbols": ["set_block_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_block_annotation"]},
    {"name": "commands$subexpression$1", "symbols": ["set_block_layout"]},
    {"name": "commands$subexpression$1", "symbols": ["set_group_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_group_layout"]},
    {"name": "commands$subexpression$1", "symbols": ["set_group_annotation"]},
    {"name": "commands$subexpression$1", "symbols": ["set_node_annotation"]},
    {"name": "commands$subexpression$1", "symbols": ["set_node_shape"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_neuron"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_neuron_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_layer"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_layer_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_neurons"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_neurons_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_layers"]},
    {"name": "commands$subexpression$1", "symbols": ["set_neuralnetwork_layers_color"]},
    {"name": "commands$subexpression$1", "symbols": ["add_neuron_at_layer_at_end"]},
    {"name": "commands$subexpression$1", "symbols": ["add_layer_with_neurons"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_neurons_at_layer"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_layer"]},
    {"name": "commands$subexpression$1", "symbols": ["set_matrix_value"]},
    {"name": "commands$subexpression$1", "symbols": ["set_matrix_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_matrix_values"]},
    {"name": "commands$subexpression$1", "symbols": ["set_matrix_colors"]},
    {"name": "commands$subexpression$1", "symbols": ["set_matrix_arrow"]},
    {"name": "commands$subexpression$1", "symbols": ["set_matrix_arrows"]},
    {"name": "commands$subexpression$1", "symbols": ["set_values_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["set_colors_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["set_arrows_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["set_hidden_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["add_value"]},
    {"name": "commands$subexpression$1", "symbols": ["add_node"]},
    {"name": "commands$subexpression$1", "symbols": ["add_edge"]},
    {"name": "commands$subexpression$1", "symbols": ["add_child"]},
    {"name": "commands$subexpression$1", "symbols": ["set_child"]},
    {"name": "commands$subexpression$1", "symbols": ["insert_value"]},
    {"name": "commands$subexpression$1", "symbols": ["insert_node"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_value"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_node"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_edge"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_child"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_subtree"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_at"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_value"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_fontSize"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_fontWeight"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_fontFamily"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_align"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_lineSpacing"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_width"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_height"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_fontSizes_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_fontWeights_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_fontFamilies_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text_aligns_multiple"]},
    {"name": "commands$subexpression$1", "symbols": ["set_text"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_fontSize"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_fontWeight"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_fontFamily"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_align"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_value"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_lineSpacing"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_width"]},
    {"name": "commands$subexpression$1", "symbols": ["set_chained_text_height"]},
    {"name": "commands$subexpression$1", "symbols": ["add_matrix_row"]},
    {"name": "commands$subexpression$1", "symbols": ["add_matrix_column"]},
    {"name": "commands$subexpression$1", "symbols": ["insert_matrix_row"]},
    {"name": "commands$subexpression$1", "symbols": ["insert_matrix_column"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_matrix_row"]},
    {"name": "commands$subexpression$1", "symbols": ["remove_matrix_column"]},
    {"name": "commands$subexpression$1", "symbols": ["add_matrix_border"]},
    {"name": "commands", "symbols": ["commands$subexpression$1"], "postprocess": iid},
    {"name": "page$ebnf$1$subexpression$1", "symbols": ["_", "layout"]},
    {"name": "page$ebnf$1", "symbols": ["page$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "page$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "page", "symbols": [{"literal":"page"}, "page$ebnf$1"], "postprocess": ([, layoutArg]) => ({ type: "page", layout: layoutArg ? layoutArg[1] : null })},
    {"name": "show$ebnf$1$subexpression$1$subexpression$1", "symbols": ["position_keyword"]},
    {"name": "show$ebnf$1$subexpression$1$subexpression$1", "symbols": ["ranged_tuple"]},
    {"name": "show$ebnf$1$subexpression$1", "symbols": ["_", "show$ebnf$1$subexpression$1$subexpression$1"]},
    {"name": "show$ebnf$1", "symbols": ["show$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "show$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "show", "symbols": [{"literal":"show"}, "_", "wordL", "show$ebnf$1"], "postprocess":  ([, , wordL, positionArg]) => ({ 
            type: "show", 
            value: wordL.name, 
            position: positionArg ? positionArg[1][0] : null,
            line: wordL.line, 
            col: wordL.col 
        }) },
    {"name": "hide", "symbols": [{"literal":"hide"}, "_", "wordL"], "postprocess": ([, , wordL]) => ({ type: "hide", value: wordL.name, line: wordL.line, col: wordL.col })},
    {"name": "block_remove_nodes$macrocall$2", "symbols": [{"literal":"removeNodes"}]},
    {"name": "block_remove_nodes$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "block_remove_nodes$macrocall$3$macrocall$3", "symbols": ["w_list"]},
    {"name": "block_remove_nodes$macrocall$3$macrocall$1", "symbols": ["block_remove_nodes$macrocall$3$macrocall$2", "_", "comma", "_", "block_remove_nodes$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "block_remove_nodes$macrocall$3", "symbols": ["block_remove_nodes$macrocall$3$macrocall$1"]},
    {"name": "block_remove_nodes$macrocall$1", "symbols": ["wordL", "dot", "block_remove_nodes$macrocall$2", "lparen", "_", "block_remove_nodes$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "block_remove_nodes", "symbols": ["block_remove_nodes$macrocall$1"], "postprocess": (details) => ({ type: "block_remove_nodes", ...id(details) })},
    {"name": "block_remove_node$macrocall$2", "symbols": [{"literal":"removeNode"}]},
    {"name": "block_remove_node$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "block_remove_node$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "block_remove_node$macrocall$3$macrocall$1", "symbols": ["block_remove_node$macrocall$3$macrocall$2", "_", "comma", "_", "block_remove_node$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "block_remove_node$macrocall$3", "symbols": ["block_remove_node$macrocall$3$macrocall$1"]},
    {"name": "block_remove_node$macrocall$1", "symbols": ["wordL", "dot", "block_remove_node$macrocall$2", "lparen", "_", "block_remove_node$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "block_remove_node", "symbols": ["block_remove_node$macrocall$1"], "postprocess": (details) => ({ type: "block_remove_node", ...id(details) })},
    {"name": "block_remove_group$macrocall$2", "symbols": [{"literal":"removeGroup"}]},
    {"name": "block_remove_group$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "block_remove_group$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "block_remove_group$macrocall$3$macrocall$1", "symbols": ["block_remove_group$macrocall$3$macrocall$2", "_", "comma", "_", "block_remove_group$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "block_remove_group$macrocall$3", "symbols": ["block_remove_group$macrocall$3$macrocall$1"]},
    {"name": "block_remove_group$macrocall$1", "symbols": ["wordL", "dot", "block_remove_group$macrocall$2", "lparen", "_", "block_remove_group$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "block_remove_group", "symbols": ["block_remove_group$macrocall$1"], "postprocess": (details) => ({ type: "block_remove_group", ...id(details) })},
    {"name": "block_remove_block$macrocall$2", "symbols": [{"literal":"removeBlock"}]},
    {"name": "block_remove_block$macrocall$3", "symbols": ["word"]},
    {"name": "block_remove_block$macrocall$1", "symbols": ["wordL", "dot", "block_remove_block$macrocall$2", "lparen", "_", "block_remove_block$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "block_remove_block", "symbols": ["block_remove_block$macrocall$1"], "postprocess": (details) => ({ type: "block_remove_block", ...id(details) })},
    {"name": "set_node_label$macrocall$2", "symbols": [{"literal":"setNodeLabel"}]},
    {"name": "set_node_label$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_node_label$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_node_label$macrocall$3$macrocall$4$subexpression$1", "symbols": ["string"]},
    {"name": "set_node_label$macrocall$3$macrocall$4$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_node_label$macrocall$3$macrocall$4", "symbols": ["set_node_label$macrocall$3$macrocall$4$subexpression$1"]},
    {"name": "set_node_label$macrocall$3$macrocall$1", "symbols": ["set_node_label$macrocall$3$macrocall$2", "_", "comma", "_", "set_node_label$macrocall$3$macrocall$3", "_", "comma", "_", "set_node_label$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_node_label$macrocall$3", "symbols": ["set_node_label$macrocall$3$macrocall$1"]},
    {"name": "set_node_label$macrocall$1", "symbols": ["wordL", "dot", "set_node_label$macrocall$2", "lparen", "_", "set_node_label$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_node_label", "symbols": ["set_node_label$macrocall$1"], "postprocess": (details) => ({ type: "set_node_label", ...id(details) })},
    {"name": "set_node_color$macrocall$2", "symbols": [{"literal":"setNodeColor"}]},
    {"name": "set_node_color$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_node_color$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_node_color$macrocall$3$macrocall$4$subexpression$1", "symbols": ["string"]},
    {"name": "set_node_color$macrocall$3$macrocall$4$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_node_color$macrocall$3$macrocall$4", "symbols": ["set_node_color$macrocall$3$macrocall$4$subexpression$1"]},
    {"name": "set_node_color$macrocall$3$macrocall$1", "symbols": ["set_node_color$macrocall$3$macrocall$2", "_", "comma", "_", "set_node_color$macrocall$3$macrocall$3", "_", "comma", "_", "set_node_color$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_node_color$macrocall$3", "symbols": ["set_node_color$macrocall$3$macrocall$1"]},
    {"name": "set_node_color$macrocall$1", "symbols": ["wordL", "dot", "set_node_color$macrocall$2", "lparen", "_", "set_node_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_node_color", "symbols": ["set_node_color$macrocall$1"], "postprocess": (details) => ({ type: "set_node_color", ...id(details) })},
    {"name": "block_remove_edges$macrocall$2", "symbols": [{"literal":"removeEdges"}]},
    {"name": "block_remove_edges$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "block_remove_edges$macrocall$3$macrocall$3$subexpression$1", "symbols": ["w_list"]},
    {"name": "block_remove_edges$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number_only_list"]},
    {"name": "block_remove_edges$macrocall$3$macrocall$3", "symbols": ["block_remove_edges$macrocall$3$macrocall$3$subexpression$1"]},
    {"name": "block_remove_edges$macrocall$3$macrocall$1", "symbols": ["block_remove_edges$macrocall$3$macrocall$2", "_", "comma", "_", "block_remove_edges$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "block_remove_edges$macrocall$3", "symbols": ["block_remove_edges$macrocall$3$macrocall$1"]},
    {"name": "block_remove_edges$macrocall$1", "symbols": ["wordL", "dot", "block_remove_edges$macrocall$2", "lparen", "_", "block_remove_edges$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "block_remove_edges", "symbols": ["block_remove_edges$macrocall$1"], "postprocess": (details) => ({ type: "block_remove_edges", ...id(details) })},
    {"name": "block_remove_edge$macrocall$2", "symbols": [{"literal":"removeEdge"}]},
    {"name": "block_remove_edge$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "block_remove_edge$macrocall$3$macrocall$3$subexpression$1", "symbols": ["word"]},
    {"name": "block_remove_edge$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "block_remove_edge$macrocall$3$macrocall$3", "symbols": ["block_remove_edge$macrocall$3$macrocall$3$subexpression$1"]},
    {"name": "block_remove_edge$macrocall$3$macrocall$1", "symbols": ["block_remove_edge$macrocall$3$macrocall$2", "_", "comma", "_", "block_remove_edge$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "block_remove_edge$macrocall$3", "symbols": ["block_remove_edge$macrocall$3$macrocall$1"]},
    {"name": "block_remove_edge$macrocall$1", "symbols": ["wordL", "dot", "block_remove_edge$macrocall$2", "lparen", "_", "block_remove_edge$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "block_remove_edge", "symbols": ["block_remove_edge$macrocall$1"], "postprocess": (details) => ({ type: "block_remove_edge", ...id(details) })},
    {"name": "set_edge_label$macrocall$2", "symbols": [{"literal":"setEdgeLabel"}]},
    {"name": "set_edge_label$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_edge_label$macrocall$3$macrocall$3$subexpression$1", "symbols": ["word"]},
    {"name": "set_edge_label$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_edge_label$macrocall$3$macrocall$3", "symbols": ["set_edge_label$macrocall$3$macrocall$3$subexpression$1"]},
    {"name": "set_edge_label$macrocall$3$macrocall$4$subexpression$1", "symbols": ["string"]},
    {"name": "set_edge_label$macrocall$3$macrocall$4$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_edge_label$macrocall$3$macrocall$4", "symbols": ["set_edge_label$macrocall$3$macrocall$4$subexpression$1"]},
    {"name": "set_edge_label$macrocall$3$macrocall$1", "symbols": ["set_edge_label$macrocall$3$macrocall$2", "_", "comma", "_", "set_edge_label$macrocall$3$macrocall$3", "_", "comma", "_", "set_edge_label$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_edge_label$macrocall$3", "symbols": ["set_edge_label$macrocall$3$macrocall$1"]},
    {"name": "set_edge_label$macrocall$1", "symbols": ["wordL", "dot", "set_edge_label$macrocall$2", "lparen", "_", "set_edge_label$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_edge_label", "symbols": ["set_edge_label$macrocall$1"], "postprocess": (details) => ({ type: "set_edge_label", ...id(details) })},
    {"name": "set_edge_color$macrocall$2", "symbols": [{"literal":"setEdgeColor"}]},
    {"name": "set_edge_color$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_edge_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["word"]},
    {"name": "set_edge_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_edge_color$macrocall$3$macrocall$3", "symbols": ["set_edge_color$macrocall$3$macrocall$3$subexpression$1"]},
    {"name": "set_edge_color$macrocall$3$macrocall$4$subexpression$1", "symbols": ["string"]},
    {"name": "set_edge_color$macrocall$3$macrocall$4$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_edge_color$macrocall$3$macrocall$4", "symbols": ["set_edge_color$macrocall$3$macrocall$4$subexpression$1"]},
    {"name": "set_edge_color$macrocall$3$macrocall$1", "symbols": ["set_edge_color$macrocall$3$macrocall$2", "_", "comma", "_", "set_edge_color$macrocall$3$macrocall$3", "_", "comma", "_", "set_edge_color$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_edge_color$macrocall$3", "symbols": ["set_edge_color$macrocall$3$macrocall$1"]},
    {"name": "set_edge_color$macrocall$1", "symbols": ["wordL", "dot", "set_edge_color$macrocall$2", "lparen", "_", "set_edge_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_edge_color", "symbols": ["set_edge_color$macrocall$1"], "postprocess": (details) => ({ type: "set_edge_color", ...id(details) })},
    {"name": "set_edge_shape$macrocall$2", "symbols": [{"literal":"setEdgeShape"}]},
    {"name": "set_edge_shape$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_edge_shape$macrocall$3$macrocall$3$subexpression$1", "symbols": ["word"]},
    {"name": "set_edge_shape$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_edge_shape$macrocall$3$macrocall$3", "symbols": ["set_edge_shape$macrocall$3$macrocall$3$subexpression$1"]},
    {"name": "set_edge_shape$macrocall$3$macrocall$4", "symbols": ["edge_shape_literal"]},
    {"name": "set_edge_shape$macrocall$3$macrocall$1", "symbols": ["set_edge_shape$macrocall$3$macrocall$2", "_", "comma", "_", "set_edge_shape$macrocall$3$macrocall$3", "_", "comma", "_", "set_edge_shape$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_edge_shape$macrocall$3", "symbols": ["set_edge_shape$macrocall$3$macrocall$1"]},
    {"name": "set_edge_shape$macrocall$1", "symbols": ["wordL", "dot", "set_edge_shape$macrocall$2", "lparen", "_", "set_edge_shape$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_edge_shape", "symbols": ["set_edge_shape$macrocall$1"], "postprocess": (details) => ({ type: "set_edge_shape", ...id(details) })},
    {"name": "set_node_stroke$macrocall$2", "symbols": [{"literal":"setNodeStroke"}]},
    {"name": "set_node_stroke$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_node_stroke$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_node_stroke$macrocall$3$macrocall$4$subexpression$1", "symbols": ["string"]},
    {"name": "set_node_stroke$macrocall$3$macrocall$4$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_node_stroke$macrocall$3$macrocall$4", "symbols": ["set_node_stroke$macrocall$3$macrocall$4$subexpression$1"]},
    {"name": "set_node_stroke$macrocall$3$macrocall$1", "symbols": ["set_node_stroke$macrocall$3$macrocall$2", "_", "comma", "_", "set_node_stroke$macrocall$3$macrocall$3", "_", "comma", "_", "set_node_stroke$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_node_stroke$macrocall$3", "symbols": ["set_node_stroke$macrocall$3$macrocall$1"]},
    {"name": "set_node_stroke$macrocall$1", "symbols": ["wordL", "dot", "set_node_stroke$macrocall$2", "lparen", "_", "set_node_stroke$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_node_stroke", "symbols": ["set_node_stroke$macrocall$1"], "postprocess": (details) => ({ type: "set_node_stroke", ...id(details) })},
    {"name": "hide_node$macrocall$2", "symbols": [{"literal":"hideNode"}]},
    {"name": "hide_node$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "hide_node$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "hide_node$macrocall$3$macrocall$1", "symbols": ["hide_node$macrocall$3$macrocall$2", "_", "comma", "_", "hide_node$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "hide_node$macrocall$3", "symbols": ["hide_node$macrocall$3$macrocall$1"]},
    {"name": "hide_node$macrocall$1", "symbols": ["wordL", "dot", "hide_node$macrocall$2", "lparen", "_", "hide_node$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "hide_node", "symbols": ["hide_node$macrocall$1"], "postprocess": (details) => ({ type: "hide_node", ...id(details) })},
    {"name": "show_node$macrocall$2", "symbols": [{"literal":"showNode"}]},
    {"name": "show_node$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "show_node$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "show_node$macrocall$3$macrocall$1", "symbols": ["show_node$macrocall$3$macrocall$2", "_", "comma", "_", "show_node$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "show_node$macrocall$3", "symbols": ["show_node$macrocall$3$macrocall$1"]},
    {"name": "show_node$macrocall$1", "symbols": ["wordL", "dot", "show_node$macrocall$2", "lparen", "_", "show_node$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "show_node", "symbols": ["show_node$macrocall$1"], "postprocess": (details) => ({ type: "show_node", ...id(details) })},
    {"name": "hide_edge$macrocall$2", "symbols": [{"literal":"hideEdge"}]},
    {"name": "hide_edge$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "hide_edge$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "hide_edge$macrocall$3$macrocall$1", "symbols": ["hide_edge$macrocall$3$macrocall$2", "_", "comma", "_", "hide_edge$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "hide_edge$macrocall$3", "symbols": ["hide_edge$macrocall$3$macrocall$1"]},
    {"name": "hide_edge$macrocall$1", "symbols": ["wordL", "dot", "hide_edge$macrocall$2", "lparen", "_", "hide_edge$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "hide_edge", "symbols": ["hide_edge$macrocall$1"], "postprocess": (details) => ({ type: "hide_edge", ...id(details) })},
    {"name": "show_edge$macrocall$2", "symbols": [{"literal":"showEdge"}]},
    {"name": "show_edge$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "show_edge$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "show_edge$macrocall$3$macrocall$1", "symbols": ["show_edge$macrocall$3$macrocall$2", "_", "comma", "_", "show_edge$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "show_edge$macrocall$3", "symbols": ["show_edge$macrocall$3$macrocall$1"]},
    {"name": "show_edge$macrocall$1", "symbols": ["wordL", "dot", "show_edge$macrocall$2", "lparen", "_", "show_edge$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "show_edge", "symbols": ["show_edge$macrocall$1"], "postprocess": (details) => ({ type: "show_edge", ...id(details) })},
    {"name": "hide_block$macrocall$2", "symbols": [{"literal":"hideBlock"}]},
    {"name": "hide_block$macrocall$3", "symbols": ["word"]},
    {"name": "hide_block$macrocall$1", "symbols": ["wordL", "dot", "hide_block$macrocall$2", "lparen", "_", "hide_block$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "hide_block", "symbols": ["hide_block$macrocall$1"], "postprocess": (details) => ({ type: "hide_block", ...id(details) })},
    {"name": "show_block$macrocall$2", "symbols": [{"literal":"showBlock"}]},
    {"name": "show_block$macrocall$3", "symbols": ["word"]},
    {"name": "show_block$macrocall$1", "symbols": ["wordL", "dot", "show_block$macrocall$2", "lparen", "_", "show_block$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "show_block", "symbols": ["show_block$macrocall$1"], "postprocess": (details) => ({ type: "show_block", ...id(details) })},
    {"name": "set_block_color$macrocall$2", "symbols": [{"literal":"setBlockColor"}]},
    {"name": "set_block_color$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_block_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_block_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_block_color$macrocall$3$macrocall$3", "symbols": ["set_block_color$macrocall$3$macrocall$3$subexpression$1"]},
    {"name": "set_block_color$macrocall$3$macrocall$1", "symbols": ["set_block_color$macrocall$3$macrocall$2", "_", "comma", "_", "set_block_color$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_block_color$macrocall$3", "symbols": ["set_block_color$macrocall$3$macrocall$1"]},
    {"name": "set_block_color$macrocall$1", "symbols": ["wordL", "dot", "set_block_color$macrocall$2", "lparen", "_", "set_block_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_block_color", "symbols": ["set_block_color$macrocall$1"], "postprocess": (details) => ({ type: "set_block_color", ...id(details) })},
    {"name": "set_block_layout$macrocall$2", "symbols": [{"literal":"setBlockLayout"}]},
    {"name": "set_block_layout$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_block_layout$macrocall$3$macrocall$3", "symbols": ["layout_literal"]},
    {"name": "set_block_layout$macrocall$3$macrocall$1", "symbols": ["set_block_layout$macrocall$3$macrocall$2", "_", "comma", "_", "set_block_layout$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_block_layout$macrocall$3", "symbols": ["set_block_layout$macrocall$3$macrocall$1"]},
    {"name": "set_block_layout$macrocall$1", "symbols": ["wordL", "dot", "set_block_layout$macrocall$2", "lparen", "_", "set_block_layout$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_block_layout", "symbols": ["set_block_layout$macrocall$1"], "postprocess": (details) => ({ type: "set_block_layout", ...id(details) })},
    {"name": "set_block_annotation$macrocall$2", "symbols": [{"literal":"setBlockAnnotation"}]},
    {"name": "set_block_annotation$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_block_annotation$macrocall$3$macrocall$3", "symbols": ["side_literal"]},
    {"name": "set_block_annotation$macrocall$3$macrocall$4$subexpression$1", "symbols": ["string"]},
    {"name": "set_block_annotation$macrocall$3$macrocall$4$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_block_annotation$macrocall$3$macrocall$4", "symbols": ["set_block_annotation$macrocall$3$macrocall$4$subexpression$1"]},
    {"name": "set_block_annotation$macrocall$3$macrocall$1", "symbols": ["set_block_annotation$macrocall$3$macrocall$2", "_", "comma", "_", "set_block_annotation$macrocall$3$macrocall$3", "_", "comma", "_", "set_block_annotation$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_block_annotation$macrocall$3", "symbols": ["set_block_annotation$macrocall$3$macrocall$1"]},
    {"name": "set_block_annotation$macrocall$1", "symbols": ["wordL", "dot", "set_block_annotation$macrocall$2", "lparen", "_", "set_block_annotation$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_block_annotation", "symbols": ["set_block_annotation$macrocall$1"], "postprocess": (details) => ({ type: "set_block_annotation", ...id(details) })},
    {"name": "set_group_color$macrocall$2", "symbols": [{"literal":"setGroupColor"}]},
    {"name": "set_group_color$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_group_color$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_group_color$macrocall$3$macrocall$4$subexpression$1", "symbols": ["string"]},
    {"name": "set_group_color$macrocall$3$macrocall$4$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_group_color$macrocall$3$macrocall$4", "symbols": ["set_group_color$macrocall$3$macrocall$4$subexpression$1"]},
    {"name": "set_group_color$macrocall$3$macrocall$1", "symbols": ["set_group_color$macrocall$3$macrocall$2", "_", "comma", "_", "set_group_color$macrocall$3$macrocall$3", "_", "comma", "_", "set_group_color$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_group_color$macrocall$3", "symbols": ["set_group_color$macrocall$3$macrocall$1"]},
    {"name": "set_group_color$macrocall$1", "symbols": ["wordL", "dot", "set_group_color$macrocall$2", "lparen", "_", "set_group_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_group_color", "symbols": ["set_group_color$macrocall$1"], "postprocess": (details) => ({ type: "set_group_color", ...id(details) })},
    {"name": "set_group_layout$macrocall$2", "symbols": [{"literal":"setGroupLayout"}]},
    {"name": "set_group_layout$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_group_layout$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_group_layout$macrocall$3$macrocall$4", "symbols": ["layout_literal"]},
    {"name": "set_group_layout$macrocall$3$macrocall$1", "symbols": ["set_group_layout$macrocall$3$macrocall$2", "_", "comma", "_", "set_group_layout$macrocall$3$macrocall$3", "_", "comma", "_", "set_group_layout$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_group_layout$macrocall$3", "symbols": ["set_group_layout$macrocall$3$macrocall$1"]},
    {"name": "set_group_layout$macrocall$1", "symbols": ["wordL", "dot", "set_group_layout$macrocall$2", "lparen", "_", "set_group_layout$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_group_layout", "symbols": ["set_group_layout$macrocall$1"], "postprocess": (details) => ({ type: "set_group_layout", ...id(details) })},
    {"name": "set_group_annotation$macrocall$2", "symbols": [{"literal":"setGroupAnnotation"}]},
    {"name": "set_group_annotation$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_group_annotation$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_group_annotation$macrocall$3$macrocall$4", "symbols": ["side_literal"]},
    {"name": "set_group_annotation$macrocall$3$macrocall$5$subexpression$1", "symbols": ["string"]},
    {"name": "set_group_annotation$macrocall$3$macrocall$5$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_group_annotation$macrocall$3$macrocall$5", "symbols": ["set_group_annotation$macrocall$3$macrocall$5$subexpression$1"]},
    {"name": "set_group_annotation$macrocall$3$macrocall$1", "symbols": ["set_group_annotation$macrocall$3$macrocall$2", "_", "comma", "_", "set_group_annotation$macrocall$3$macrocall$3", "_", "comma", "_", "set_group_annotation$macrocall$3$macrocall$4", "_", "comma", "_", "set_group_annotation$macrocall$3$macrocall$5"], "postprocess":  ([a, , , , b, , , , c, , , , d]) => ({
          block: id(a),
          second: id(b),
          third: id(c),
          fourth: id(d)
        }) },
    {"name": "set_group_annotation$macrocall$3", "symbols": ["set_group_annotation$macrocall$3$macrocall$1"]},
    {"name": "set_group_annotation$macrocall$1", "symbols": ["wordL", "dot", "set_group_annotation$macrocall$2", "lparen", "_", "set_group_annotation$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_group_annotation", "symbols": ["set_group_annotation$macrocall$1"], "postprocess": (details) => ({ type: "set_group_annotation", ...id(details) })},
    {"name": "set_node_annotation$macrocall$2", "symbols": [{"literal":"setNodeAnnotation"}]},
    {"name": "set_node_annotation$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_node_annotation$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_node_annotation$macrocall$3$macrocall$4", "symbols": ["side_literal"]},
    {"name": "set_node_annotation$macrocall$3$macrocall$5$subexpression$1", "symbols": ["string"]},
    {"name": "set_node_annotation$macrocall$3$macrocall$5$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_node_annotation$macrocall$3$macrocall$5", "symbols": ["set_node_annotation$macrocall$3$macrocall$5$subexpression$1"]},
    {"name": "set_node_annotation$macrocall$3$macrocall$1", "symbols": ["set_node_annotation$macrocall$3$macrocall$2", "_", "comma", "_", "set_node_annotation$macrocall$3$macrocall$3", "_", "comma", "_", "set_node_annotation$macrocall$3$macrocall$4", "_", "comma", "_", "set_node_annotation$macrocall$3$macrocall$5"], "postprocess":  ([a, , , , b, , , , c, , , , d]) => ({
          block: id(a),
          second: id(b),
          third: id(c),
          fourth: id(d)
        }) },
    {"name": "set_node_annotation$macrocall$3", "symbols": ["set_node_annotation$macrocall$3$macrocall$1"]},
    {"name": "set_node_annotation$macrocall$1", "symbols": ["wordL", "dot", "set_node_annotation$macrocall$2", "lparen", "_", "set_node_annotation$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_node_annotation", "symbols": ["set_node_annotation$macrocall$1"], "postprocess": (details) => ({ type: "set_node_annotation", ...id(details) })},
    {"name": "set_node_shape$macrocall$2", "symbols": [{"literal":"setNodeShape"}]},
    {"name": "set_node_shape$macrocall$3$macrocall$2", "symbols": ["word"]},
    {"name": "set_node_shape$macrocall$3$macrocall$3", "symbols": ["word"]},
    {"name": "set_node_shape$macrocall$3$macrocall$4", "symbols": ["shape_literal"]},
    {"name": "set_node_shape$macrocall$3$macrocall$1", "symbols": ["set_node_shape$macrocall$3$macrocall$2", "_", "comma", "_", "set_node_shape$macrocall$3$macrocall$3", "_", "comma", "_", "set_node_shape$macrocall$3$macrocall$4"], "postprocess":  ([x, , , , y, , , , z]) => ({
          block: id(x),
          second: id(y),
          third: id(z)
        }) },
    {"name": "set_node_shape$macrocall$3", "symbols": ["set_node_shape$macrocall$3$macrocall$1"]},
    {"name": "set_node_shape$macrocall$1", "symbols": ["wordL", "dot", "set_node_shape$macrocall$2", "lparen", "_", "set_node_shape$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_node_shape", "symbols": ["set_node_shape$macrocall$1"], "postprocess": (details) => ({ type: "set_node_shape", ...id(details) })},
    {"name": "set_value$macrocall$2", "symbols": [{"literal":"setValue"}]},
    {"name": "set_value$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_value$macrocall$3$macrocall$2$subexpression$1", "symbols": ["word"]},
    {"name": "set_value$macrocall$3$macrocall$2", "symbols": ["set_value$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_value$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_value$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_value$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_value$macrocall$3$macrocall$3", "symbols": ["set_value$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_value$macrocall$3$macrocall$1", "symbols": ["set_value$macrocall$3$macrocall$2", "_", "comma", "_", "set_value$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_value$macrocall$3", "symbols": ["set_value$macrocall$3$macrocall$1"]},
    {"name": "set_value$macrocall$1", "symbols": ["wordL", "dot", "set_value$macrocall$2", "lparen", "_", "set_value$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_value", "symbols": ["set_value$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "value", ...id(details) })},
    {"name": "set_color$macrocall$2", "symbols": [{"literal":"setColor"}]},
    {"name": "set_color$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_color$macrocall$3$macrocall$2$subexpression$1", "symbols": ["word"]},
    {"name": "set_color$macrocall$3$macrocall$2", "symbols": ["set_color$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_color$macrocall$3$macrocall$3", "symbols": ["set_color$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_color$macrocall$3$macrocall$1", "symbols": ["set_color$macrocall$3$macrocall$2", "_", "comma", "_", "set_color$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_color$macrocall$3", "symbols": ["set_color$macrocall$3$macrocall$1"]},
    {"name": "set_color$macrocall$1", "symbols": ["wordL", "dot", "set_color$macrocall$2", "lparen", "_", "set_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_color", "symbols": ["set_color$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "color", ...id(details) })},
    {"name": "set_arrow$macrocall$2", "symbols": [{"literal":"setArrow"}]},
    {"name": "set_arrow$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_arrow$macrocall$3$macrocall$2$subexpression$1", "symbols": ["word"]},
    {"name": "set_arrow$macrocall$3$macrocall$2", "symbols": ["set_arrow$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_arrow$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_arrow$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_arrow$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_arrow$macrocall$3$macrocall$3", "symbols": ["set_arrow$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_arrow$macrocall$3$macrocall$1", "symbols": ["set_arrow$macrocall$3$macrocall$2", "_", "comma", "_", "set_arrow$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_arrow$macrocall$3", "symbols": ["set_arrow$macrocall$3$macrocall$1"]},
    {"name": "set_arrow$macrocall$1", "symbols": ["wordL", "dot", "set_arrow$macrocall$2", "lparen", "_", "set_arrow$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_arrow", "symbols": ["set_arrow$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "arrow", ...id(details) })},
    {"name": "set_hidden$macrocall$2", "symbols": [{"literal":"setHidden"}]},
    {"name": "set_hidden$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_hidden$macrocall$3$macrocall$2$subexpression$1", "symbols": ["word"]},
    {"name": "set_hidden$macrocall$3$macrocall$2", "symbols": ["set_hidden$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_hidden$macrocall$3$macrocall$3", "symbols": ["boolean"]},
    {"name": "set_hidden$macrocall$3$macrocall$1", "symbols": ["set_hidden$macrocall$3$macrocall$2", "_", "comma", "_", "set_hidden$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_hidden$macrocall$3", "symbols": ["set_hidden$macrocall$3$macrocall$1"]},
    {"name": "set_hidden$macrocall$1", "symbols": ["wordL", "dot", "set_hidden$macrocall$2", "lparen", "_", "set_hidden$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_hidden", "symbols": ["set_hidden$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "hidden", ...id(details) })},
    {"name": "set_neuralnetwork_neuron$macrocall$2", "symbols": [{"literal":"setNeuron"}]},
    {"name": "set_neuralnetwork_neuron$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_neuralnetwork_neuron$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_neuralnetwork_neuron$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_neuralnetwork_neuron$macrocall$3", "symbols": ["set_neuralnetwork_neuron$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_neuron$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_neuron$macrocall$2", "lparen", "_", "number", "_", "comma", "_", "number", "_", "comma", "_", "set_neuralnetwork_neuron$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , , , , row, , , , col, , , , value]) => ({ args: { row: row, col: col, value: id(value) }, ...wordL })},
    {"name": "set_neuralnetwork_neuron", "symbols": ["set_neuralnetwork_neuron$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_neuron_setNeuron", target: "neurons", ...id(details) })},
    {"name": "set_neuralnetwork_neuron_color$macrocall$2", "symbols": [{"literal":"setNeuronColor"}]},
    {"name": "set_neuralnetwork_neuron_color$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_neuralnetwork_neuron_color$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_neuralnetwork_neuron_color$macrocall$3", "symbols": ["set_neuralnetwork_neuron_color$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_neuron_color$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_neuron_color$macrocall$2", "lparen", "_", "number", "_", "comma", "_", "number", "_", "comma", "_", "set_neuralnetwork_neuron_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , , , , row, , , , col, , , , value]) => ({ args: { row: row, col: col, value: id(value) }, ...wordL })},
    {"name": "set_neuralnetwork_neuron_color", "symbols": ["set_neuralnetwork_neuron_color$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_neuron_setNeuronColor", target: "neuronColors", ...id(details) })},
    {"name": "set_neuralnetwork_layer$macrocall$2", "symbols": [{"literal":"setLayer"}]},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$2$subexpression$1", "symbols": ["word"]},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$2", "symbols": ["set_neuralnetwork_layer$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$3", "symbols": ["set_neuralnetwork_layer$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_layer$macrocall$3$macrocall$1", "symbols": ["set_neuralnetwork_layer$macrocall$3$macrocall$2", "_", "comma", "_", "set_neuralnetwork_layer$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_neuralnetwork_layer$macrocall$3", "symbols": ["set_neuralnetwork_layer$macrocall$3$macrocall$1"]},
    {"name": "set_neuralnetwork_layer$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_layer$macrocall$2", "lparen", "_", "set_neuralnetwork_layer$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_neuralnetwork_layer", "symbols": ["set_neuralnetwork_layer$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_layer", target: "layers", ...id(details) })},
    {"name": "set_neuralnetwork_layer_color$macrocall$2", "symbols": [{"literal":"setLayerColor"}]},
    {"name": "set_neuralnetwork_layer_color$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_neuralnetwork_layer_color$macrocall$3$macrocall$2$subexpression$1", "symbols": ["word"]},
    {"name": "set_neuralnetwork_layer_color$macrocall$3$macrocall$2", "symbols": ["set_neuralnetwork_layer_color$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_layer_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_neuralnetwork_layer_color$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_neuralnetwork_layer_color$macrocall$3$macrocall$3", "symbols": ["set_neuralnetwork_layer_color$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_layer_color$macrocall$3$macrocall$1", "symbols": ["set_neuralnetwork_layer_color$macrocall$3$macrocall$2", "_", "comma", "_", "set_neuralnetwork_layer_color$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_neuralnetwork_layer_color$macrocall$3", "symbols": ["set_neuralnetwork_layer_color$macrocall$3$macrocall$1"]},
    {"name": "set_neuralnetwork_layer_color$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_layer_color$macrocall$2", "lparen", "_", "set_neuralnetwork_layer_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_neuralnetwork_layer_color", "symbols": ["set_neuralnetwork_layer_color$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_layer", target: "layerColors", ...id(details) })},
    {"name": "set_matrix_value$macrocall$2", "symbols": [{"literal":"setValue"}]},
    {"name": "set_matrix_value$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_matrix_value$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_matrix_value$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_matrix_value$macrocall$3", "symbols": ["set_matrix_value$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_matrix_value$macrocall$1", "symbols": ["wordL", "dot", "set_matrix_value$macrocall$2", "lparen", "_", "number", "_", "comma", "_", "number", "_", "comma", "_", "set_matrix_value$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , , , , row, , , , col, , , , value]) => ({ args: { row: row, col: col, value: id(value) }, ...wordL })},
    {"name": "set_matrix_value", "symbols": ["set_matrix_value$macrocall$1"], "postprocess": (details) => ({ type: "set_matrix", target: "value", ...id(details) })},
    {"name": "set_matrix_color$macrocall$2", "symbols": [{"literal":"setColor"}]},
    {"name": "set_matrix_color$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_matrix_color$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_matrix_color$macrocall$3", "symbols": ["set_matrix_color$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_matrix_color$macrocall$1", "symbols": ["wordL", "dot", "set_matrix_color$macrocall$2", "lparen", "_", "number", "_", "comma", "_", "number", "_", "comma", "_", "set_matrix_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , , , , row, , , , col, , , , value]) => ({ args: { row: row, col: col, value: id(value) }, ...wordL })},
    {"name": "set_matrix_color", "symbols": ["set_matrix_color$macrocall$1"], "postprocess": (details) => ({ type: "set_matrix", target: "color", ...id(details) })},
    {"name": "set_matrix_arrow$macrocall$2", "symbols": [{"literal":"setArrow"}]},
    {"name": "set_matrix_arrow$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_matrix_arrow$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_matrix_arrow$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_matrix_arrow$macrocall$3", "symbols": ["set_matrix_arrow$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_matrix_arrow$macrocall$1", "symbols": ["wordL", "dot", "set_matrix_arrow$macrocall$2", "lparen", "_", "number", "_", "comma", "_", "number", "_", "comma", "_", "set_matrix_arrow$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , , , , row, , , , col, , , , value]) => ({ args: { row: row, col: col, value: id(value) }, ...wordL })},
    {"name": "set_matrix_arrow", "symbols": ["set_matrix_arrow$macrocall$1"], "postprocess": (details) => ({ type: "set_matrix", target: "arrow", ...id(details) })},
    {"name": "set_edges$macrocall$2", "symbols": [{"literal":"setEdges"}]},
    {"name": "set_edges$macrocall$3", "symbols": ["e_list"]},
    {"name": "set_edges$macrocall$1", "symbols": ["wordL", "dot", "set_edges$macrocall$2", "lparen", "_", "set_edges$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_edges", "symbols": ["set_edges$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "edges", ...id(details) })},
    {"name": "set_text_value$macrocall$2", "symbols": [{"literal":"setValue"}]},
    {"name": "set_text_value$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_value$macrocall$3$subexpression$1", "symbols": ["s_list"]},
    {"name": "set_text_value$macrocall$3", "symbols": ["set_text_value$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_value$macrocall$1", "symbols": ["wordL", "dot", "set_text_value$macrocall$2", "lparen", "_", "set_text_value$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_value", "symbols": ["set_text_value$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "value", ...id(details) })},
    {"name": "set_text_fontSize$macrocall$2", "symbols": [{"literal":"setFontSize"}]},
    {"name": "set_text_fontSize$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_text_fontSize$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_text_fontSize$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_text_fontSize$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_fontSize$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_text_fontSize$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontSize$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_text_fontSize$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_text_fontSize$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_text_fontSize$macrocall$3$subexpression$1", "symbols": ["set_text_fontSize$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_text_fontSize$macrocall$3", "symbols": ["set_text_fontSize$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontSize$macrocall$1", "symbols": ["wordL", "dot", "set_text_fontSize$macrocall$2", "lparen", "_", "set_text_fontSize$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_fontSize", "symbols": ["set_text_fontSize$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "fontSize", ...id(details) })},
    {"name": "set_text_color$macrocall$2", "symbols": [{"literal":"setColor"}]},
    {"name": "set_text_color$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_color$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_text_color$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_color$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_color$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_text_color$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_color$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_text_color$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_text_color$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_text_color$macrocall$3$subexpression$1", "symbols": ["set_text_color$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_text_color$macrocall$3", "symbols": ["set_text_color$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_color$macrocall$1", "symbols": ["wordL", "dot", "set_text_color$macrocall$2", "lparen", "_", "set_text_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_color", "symbols": ["set_text_color$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "color", ...id(details) })},
    {"name": "set_text_fontWeight$macrocall$2", "symbols": [{"literal":"setFontWeight"}]},
    {"name": "set_text_fontWeight$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_fontWeight$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_text_fontWeight$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_fontWeight$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_fontWeight$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_text_fontWeight$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontWeight$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_text_fontWeight$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_text_fontWeight$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_text_fontWeight$macrocall$3$subexpression$1", "symbols": ["set_text_fontWeight$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_text_fontWeight$macrocall$3", "symbols": ["set_text_fontWeight$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontWeight$macrocall$1", "symbols": ["wordL", "dot", "set_text_fontWeight$macrocall$2", "lparen", "_", "set_text_fontWeight$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_fontWeight", "symbols": ["set_text_fontWeight$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "fontWeight", ...id(details) })},
    {"name": "set_text_fontFamily$macrocall$2", "symbols": [{"literal":"setFontFamily"}]},
    {"name": "set_text_fontFamily$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_fontFamily$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_text_fontFamily$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_fontFamily$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_fontFamily$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_text_fontFamily$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontFamily$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_text_fontFamily$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_text_fontFamily$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_text_fontFamily$macrocall$3$subexpression$1", "symbols": ["set_text_fontFamily$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_text_fontFamily$macrocall$3", "symbols": ["set_text_fontFamily$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontFamily$macrocall$1", "symbols": ["wordL", "dot", "set_text_fontFamily$macrocall$2", "lparen", "_", "set_text_fontFamily$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_fontFamily", "symbols": ["set_text_fontFamily$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "fontFamily", ...id(details) })},
    {"name": "set_text_align$macrocall$2", "symbols": [{"literal":"setAlign"}]},
    {"name": "set_text_align$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_align$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_text_align$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_align$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_align$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_text_align$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_align$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_text_align$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_text_align$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_text_align$macrocall$3$subexpression$1", "symbols": ["set_text_align$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_text_align$macrocall$3", "symbols": ["set_text_align$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text_align$macrocall$1", "symbols": ["wordL", "dot", "set_text_align$macrocall$2", "lparen", "_", "set_text_align$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_align", "symbols": ["set_text_align$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "align", ...id(details) })},
    {"name": "set_text_lineSpacing$macrocall$2", "symbols": [{"literal":"setLineSpacing"}]},
    {"name": "set_text_lineSpacing$macrocall$3", "symbols": ["number"]},
    {"name": "set_text_lineSpacing$macrocall$1", "symbols": ["wordL", "dot", "set_text_lineSpacing$macrocall$2", "lparen", "_", "set_text_lineSpacing$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_lineSpacing", "symbols": ["set_text_lineSpacing$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "lineSpacing", ...id(details) })},
    {"name": "set_text_width$macrocall$2", "symbols": [{"literal":"setWidth"}]},
    {"name": "set_text_width$macrocall$3", "symbols": ["number"]},
    {"name": "set_text_width$macrocall$1", "symbols": ["wordL", "dot", "set_text_width$macrocall$2", "lparen", "_", "set_text_width$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_width", "symbols": ["set_text_width$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "width", ...id(details) })},
    {"name": "set_text_height$macrocall$2", "symbols": [{"literal":"setHeight"}]},
    {"name": "set_text_height$macrocall$3", "symbols": ["number"]},
    {"name": "set_text_height$macrocall$1", "symbols": ["wordL", "dot", "set_text_height$macrocall$2", "lparen", "_", "set_text_height$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_height", "symbols": ["set_text_height$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "height", ...id(details) })},
    {"name": "set_values_multiple$macrocall$2", "symbols": [{"literal":"setValues"}]},
    {"name": "set_values_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$2", "symbols": ["set_values_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_values_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_values_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_values_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_values_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_values_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_values_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_values_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_values_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_values_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_values_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_values_multiple$macrocall$3", "symbols": ["set_values_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_values_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_values_multiple$macrocall$2", "lparen", "_", "set_values_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_values_multiple", "symbols": ["set_values_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "value", ...id(details) })},
    {"name": "set_colors_multiple$macrocall$2", "symbols": [{"literal":"setColors"}]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$2", "symbols": ["set_colors_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_colors_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_colors_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_colors_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_colors_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_colors_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_colors_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_colors_multiple$macrocall$3", "symbols": ["set_colors_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_colors_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_colors_multiple$macrocall$2", "lparen", "_", "set_colors_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_colors_multiple", "symbols": ["set_colors_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "color", ...id(details) })},
    {"name": "set_arrows_multiple$macrocall$2", "symbols": [{"literal":"setArrows"}]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$2", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_arrows_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_arrows_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_arrows_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_arrows_multiple$macrocall$3", "symbols": ["set_arrows_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_arrows_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_arrows_multiple$macrocall$2", "lparen", "_", "set_arrows_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_arrows_multiple", "symbols": ["set_arrows_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "arrow", ...id(details) })},
    {"name": "set_hidden_multiple$macrocall$2", "symbols": [{"literal":"setHidden"}]},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["boolean"]},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$2", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_hidden_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_hidden_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_hidden_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_hidden_multiple$macrocall$3", "symbols": ["set_hidden_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_hidden_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_hidden_multiple$macrocall$2", "lparen", "_", "set_hidden_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_hidden_multiple", "symbols": ["set_hidden_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "hidden", ...id(details) })},
    {"name": "set_neuralnetwork_neurons$macrocall$2", "symbols": [{"literal":"setNeurons"}]},
    {"name": "set_neuralnetwork_neurons$macrocall$3", "symbols": ["nnsp_mlist"]},
    {"name": "set_neuralnetwork_neurons$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_neurons$macrocall$2", "lparen", "_", "set_neuralnetwork_neurons$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_neuralnetwork_neurons", "symbols": ["set_neuralnetwork_neurons$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_neurons_multiple", target: "neurons", ...id(details) })},
    {"name": "set_neuralnetwork_layers$macrocall$2", "symbols": [{"literal":"setLayers"}]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$2", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_neuralnetwork_layers$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$2"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_neuralnetwork_layers$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_neuralnetwork_layers$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_neuralnetwork_layers$macrocall$3", "symbols": ["set_neuralnetwork_layers$macrocall$3$macrocall$1"]},
    {"name": "set_neuralnetwork_layers$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_layers$macrocall$2", "lparen", "_", "set_neuralnetwork_layers$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_neuralnetwork_layers", "symbols": ["set_neuralnetwork_layers$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_layer_multiple", target: "layers", ...id(details) })},
    {"name": "set_neuralnetwork_neurons_color$macrocall$2", "symbols": [{"literal":"setNeuronColors"}]},
    {"name": "set_neuralnetwork_neurons_color$macrocall$3", "symbols": ["nnsp_mlist"]},
    {"name": "set_neuralnetwork_neurons_color$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_neurons_color$macrocall$2", "lparen", "_", "set_neuralnetwork_neurons_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_neuralnetwork_neurons_color", "symbols": ["set_neuralnetwork_neurons_color$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_neurons_multiple", target: "neuronColors", ...id(details) })},
    {"name": "set_neuralnetwork_layers_color$macrocall$2", "symbols": [{"literal":"setLayerColors"}]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$2", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$2"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_neuralnetwork_layers_color$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_neuralnetwork_layers_color$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_neuralnetwork_layers_color$macrocall$3", "symbols": ["set_neuralnetwork_layers_color$macrocall$3$macrocall$1"]},
    {"name": "set_neuralnetwork_layers_color$macrocall$1", "symbols": ["wordL", "dot", "set_neuralnetwork_layers_color$macrocall$2", "lparen", "_", "set_neuralnetwork_layers_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_neuralnetwork_layers_color", "symbols": ["set_neuralnetwork_layers_color$macrocall$1"], "postprocess": (details) => ({ type: "set_neuralnetwork_layer_multiple", target: "layerColors", ...id(details) })},
    {"name": "set_matrix_values$macrocall$2", "symbols": [{"literal":"setValues"}]},
    {"name": "set_matrix_values$macrocall$3", "symbols": ["nnsp_mlist"]},
    {"name": "set_matrix_values$macrocall$1", "symbols": ["wordL", "dot", "set_matrix_values$macrocall$2", "lparen", "_", "set_matrix_values$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_matrix_values", "symbols": ["set_matrix_values$macrocall$1"], "postprocess": (details) => ({ type: "set_matrix_multiple", target: "value", ...id(details) })},
    {"name": "set_matrix_colors$macrocall$2", "symbols": [{"literal":"setColors"}]},
    {"name": "set_matrix_colors$macrocall$3", "symbols": ["nnsp_mlist"]},
    {"name": "set_matrix_colors$macrocall$1", "symbols": ["wordL", "dot", "set_matrix_colors$macrocall$2", "lparen", "_", "set_matrix_colors$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_matrix_colors", "symbols": ["set_matrix_colors$macrocall$1"], "postprocess": (details) => ({ type: "set_matrix_multiple", target: "color", ...id(details) })},
    {"name": "set_matrix_arrows$macrocall$2", "symbols": [{"literal":"setArrows"}]},
    {"name": "set_matrix_arrows$macrocall$3", "symbols": ["nnsp_mlist"]},
    {"name": "set_matrix_arrows$macrocall$1", "symbols": ["wordL", "dot", "set_matrix_arrows$macrocall$2", "lparen", "_", "set_matrix_arrows$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_matrix_arrows", "symbols": ["set_matrix_arrows$macrocall$1"], "postprocess": (details) => ({ type: "set_matrix_multiple", target: "arrow", ...id(details) })},
    {"name": "set_text_fontSizes_multiple$macrocall$2", "symbols": [{"literal":"setFontSizes"}]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$2", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_fontSizes_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_text_fontSizes_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_fontSizes_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_text_fontSizes_multiple$macrocall$3", "symbols": ["set_text_fontSizes_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_text_fontSizes_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_text_fontSizes_multiple$macrocall$2", "lparen", "_", "set_text_fontSizes_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_fontSizes_multiple", "symbols": ["set_text_fontSizes_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "fontSize", ...id(details) })},
    {"name": "set_text_fontWeights_multiple$macrocall$2", "symbols": [{"literal":"setFontWeights"}]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$2", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_fontWeights_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_text_fontWeights_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_fontWeights_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_text_fontWeights_multiple$macrocall$3", "symbols": ["set_text_fontWeights_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_text_fontWeights_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_text_fontWeights_multiple$macrocall$2", "lparen", "_", "set_text_fontWeights_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_fontWeights_multiple", "symbols": ["set_text_fontWeights_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "fontWeight", ...id(details) })},
    {"name": "set_text_fontFamilies_multiple$macrocall$2", "symbols": [{"literal":"setFontFamilies"}]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$2", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_text_fontFamilies_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_fontFamilies_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_text_fontFamilies_multiple$macrocall$3", "symbols": ["set_text_fontFamilies_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_text_fontFamilies_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_text_fontFamilies_multiple$macrocall$2", "lparen", "_", "set_text_fontFamilies_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_fontFamilies_multiple", "symbols": ["set_text_fontFamilies_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "fontFamily", ...id(details) })},
    {"name": "set_text_aligns_multiple$macrocall$2", "symbols": [{"literal":"setAligns"}]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$2", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_aligns_multiple$macrocall$3$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$2", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$2"]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$2"]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1", "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$macrocall$1", "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_text_aligns_multiple$macrocall$3$macrocall$1", "symbols": ["lbrac", "set_text_aligns_multiple$macrocall$3$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_text_aligns_multiple$macrocall$3", "symbols": ["set_text_aligns_multiple$macrocall$3$macrocall$1"]},
    {"name": "set_text_aligns_multiple$macrocall$1", "symbols": ["wordL", "dot", "set_text_aligns_multiple$macrocall$2", "lparen", "_", "set_text_aligns_multiple$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text_aligns_multiple", "symbols": ["set_text_aligns_multiple$macrocall$1"], "postprocess": (details) => ({ type: "set_multiple", target: "align", ...id(details) })},
    {"name": "set_text$macrocall$2", "symbols": [{"literal":"setText"}]},
    {"name": "set_text$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_text$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_text$macrocall$3$macrocall$2", "symbols": ["set_text$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "set_text$macrocall$3$macrocall$3$subexpression$1", "symbols": [{"literal":"\"above\""}]},
    {"name": "set_text$macrocall$3$macrocall$3$subexpression$1", "symbols": [{"literal":"\"below\""}]},
    {"name": "set_text$macrocall$3$macrocall$3$subexpression$1", "symbols": [{"literal":"\"left\""}]},
    {"name": "set_text$macrocall$3$macrocall$3$subexpression$1", "symbols": [{"literal":"\"right\""}]},
    {"name": "set_text$macrocall$3$macrocall$3", "symbols": ["set_text$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_text$macrocall$3$macrocall$1", "symbols": ["set_text$macrocall$3$macrocall$2", "_", "comma", "_", "set_text$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_text$macrocall$3", "symbols": ["set_text$macrocall$3$macrocall$1"]},
    {"name": "set_text$macrocall$1", "symbols": ["wordL", "dot", "set_text$macrocall$2", "lparen", "_", "set_text$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_text", "symbols": ["set_text$macrocall$1"], "postprocess": (details) => ({ type: "set_text", ...id(details) })},
    {"name": "set_chained_text_fontSize$macrocall$2", "symbols": [{"literal":"setFontSize"}]},
    {"name": "set_chained_text_fontSize$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_chained_text_fontSize$macrocall$3$subexpression$1", "symbols": ["set_chained_text_fontSize$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_chained_text_fontSize$macrocall$3", "symbols": ["set_chained_text_fontSize$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_fontSize$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_fontSize$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_fontSize$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_fontSize$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_fontSize$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_fontSize$macrocall$1$subexpression$1", "dot", "set_chained_text_fontSize$macrocall$2", "lparen", "_", "set_chained_text_fontSize$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_fontSize", "symbols": ["set_chained_text_fontSize$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "fontSize", ...id(details) })},
    {"name": "set_chained_text_color$macrocall$2", "symbols": [{"literal":"setColor"}]},
    {"name": "set_chained_text_color$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_color$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_chained_text_color$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_color$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_chained_text_color$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_chained_text_color$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_color$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_chained_text_color$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_chained_text_color$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_chained_text_color$macrocall$3$subexpression$1", "symbols": ["set_chained_text_color$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_chained_text_color$macrocall$3", "symbols": ["set_chained_text_color$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_color$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_color$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_color$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_color$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_color$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_color$macrocall$1$subexpression$1", "dot", "set_chained_text_color$macrocall$2", "lparen", "_", "set_chained_text_color$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_color", "symbols": ["set_chained_text_color$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "color", ...id(details) })},
    {"name": "set_chained_text_fontWeight$macrocall$2", "symbols": [{"literal":"setFontWeight"}]},
    {"name": "set_chained_text_fontWeight$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_chained_text_fontWeight$macrocall$3$subexpression$1", "symbols": ["set_chained_text_fontWeight$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_chained_text_fontWeight$macrocall$3", "symbols": ["set_chained_text_fontWeight$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_fontWeight$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_fontWeight$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_fontWeight$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_fontWeight$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_fontWeight$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_fontWeight$macrocall$1$subexpression$1", "dot", "set_chained_text_fontWeight$macrocall$2", "lparen", "_", "set_chained_text_fontWeight$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_fontWeight", "symbols": ["set_chained_text_fontWeight$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "fontWeight", ...id(details) })},
    {"name": "set_chained_text_fontFamily$macrocall$2", "symbols": [{"literal":"setFontFamily"}]},
    {"name": "set_chained_text_fontFamily$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_chained_text_fontFamily$macrocall$3$subexpression$1", "symbols": ["set_chained_text_fontFamily$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_chained_text_fontFamily$macrocall$3", "symbols": ["set_chained_text_fontFamily$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_fontFamily$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_fontFamily$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_fontFamily$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_fontFamily$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_fontFamily$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_fontFamily$macrocall$1$subexpression$1", "dot", "set_chained_text_fontFamily$macrocall$2", "lparen", "_", "set_chained_text_fontFamily$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_fontFamily", "symbols": ["set_chained_text_fontFamily$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "fontFamily", ...id(details) })},
    {"name": "set_chained_text_align$macrocall$2", "symbols": [{"literal":"setAlign"}]},
    {"name": "set_chained_text_align$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_align$macrocall$3$subexpression$1$macrocall$2", "symbols": ["number"]},
    {"name": "set_chained_text_align$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_align$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_chained_text_align$macrocall$3$subexpression$1$macrocall$3", "symbols": ["set_chained_text_align$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_align$macrocall$3$subexpression$1$macrocall$1", "symbols": ["set_chained_text_align$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "set_chained_text_align$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "set_chained_text_align$macrocall$3$subexpression$1", "symbols": ["set_chained_text_align$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "set_chained_text_align$macrocall$3", "symbols": ["set_chained_text_align$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_align$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_align$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_align$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_align$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_align$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_align$macrocall$1$subexpression$1", "dot", "set_chained_text_align$macrocall$2", "lparen", "_", "set_chained_text_align$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_align", "symbols": ["set_chained_text_align$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "align", ...id(details) })},
    {"name": "set_chained_text_value$macrocall$2", "symbols": [{"literal":"setValue"}]},
    {"name": "set_chained_text_value$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_chained_text_value$macrocall$3$subexpression$1", "symbols": ["s_list"]},
    {"name": "set_chained_text_value$macrocall$3", "symbols": ["set_chained_text_value$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "set_chained_text_value$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_value$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_value$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_value$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_value$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_value$macrocall$1$subexpression$1", "dot", "set_chained_text_value$macrocall$2", "lparen", "_", "set_chained_text_value$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_value", "symbols": ["set_chained_text_value$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "value", ...id(details) })},
    {"name": "set_chained_text_lineSpacing$macrocall$2", "symbols": [{"literal":"setLineSpacing"}]},
    {"name": "set_chained_text_lineSpacing$macrocall$3", "symbols": ["number"]},
    {"name": "set_chained_text_lineSpacing$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_lineSpacing$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_lineSpacing$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_lineSpacing$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_lineSpacing$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_lineSpacing$macrocall$1$subexpression$1", "dot", "set_chained_text_lineSpacing$macrocall$2", "lparen", "_", "set_chained_text_lineSpacing$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_lineSpacing", "symbols": ["set_chained_text_lineSpacing$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "lineSpacing", ...id(details) })},
    {"name": "set_chained_text_width$macrocall$2", "symbols": [{"literal":"setWidth"}]},
    {"name": "set_chained_text_width$macrocall$3", "symbols": ["number"]},
    {"name": "set_chained_text_width$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_width$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_width$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_width$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_width$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_width$macrocall$1$subexpression$1", "dot", "set_chained_text_width$macrocall$2", "lparen", "_", "set_chained_text_width$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_width", "symbols": ["set_chained_text_width$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "width", ...id(details) })},
    {"name": "set_chained_text_height$macrocall$2", "symbols": [{"literal":"setHeight"}]},
    {"name": "set_chained_text_height$macrocall$3", "symbols": ["number"]},
    {"name": "set_chained_text_height$macrocall$1$subexpression$1", "symbols": [{"literal":"above"}]},
    {"name": "set_chained_text_height$macrocall$1$subexpression$1", "symbols": [{"literal":"below"}]},
    {"name": "set_chained_text_height$macrocall$1$subexpression$1", "symbols": [{"literal":"left"}]},
    {"name": "set_chained_text_height$macrocall$1$subexpression$1", "symbols": [{"literal":"right"}]},
    {"name": "set_chained_text_height$macrocall$1", "symbols": ["wordL", "dot", "set_chained_text_height$macrocall$1$subexpression$1", "dot", "set_chained_text_height$macrocall$2", "lparen", "_", "set_chained_text_height$macrocall$3", "_", "rparen"], "postprocess": ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL })},
    {"name": "set_chained_text_height", "symbols": ["set_chained_text_height$macrocall$1"], "postprocess": (details) => ({ type: "set_chained", target: "height", ...id(details) })},
    {"name": "add_value$macrocall$2", "symbols": [{"literal":"addValue"}]},
    {"name": "add_value$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "add_value$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "add_value$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_value$macrocall$3", "symbols": ["add_value$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "add_value$macrocall$1", "symbols": ["wordL", "dot", "add_value$macrocall$2", "lparen", "_", "add_value$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_value", "symbols": ["add_value$macrocall$1"], "postprocess": (details) => ({ type: "add", target: "value", ...id(details) })},
    {"name": "add_node$macrocall$2", "symbols": [{"literal":"addNode"}]},
    {"name": "add_node$macrocall$3$subexpression$1", "symbols": ["word"]},
    {"name": "add_node$macrocall$3$subexpression$1$macrocall$2", "symbols": ["word"]},
    {"name": "add_node$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "add_node$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "add_node$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_node$macrocall$3$subexpression$1$macrocall$3", "symbols": ["add_node$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "add_node$macrocall$3$subexpression$1$macrocall$1", "symbols": ["add_node$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "add_node$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "add_node$macrocall$3$subexpression$1", "symbols": ["add_node$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "add_node$macrocall$3", "symbols": ["add_node$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "add_node$macrocall$1", "symbols": ["wordL", "dot", "add_node$macrocall$2", "lparen", "_", "add_node$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_node", "symbols": ["add_node$macrocall$1"], "postprocess": (details) => ({ type: "add", target: "nodes", ...id(details) })},
    {"name": "add_edge$macrocall$2", "symbols": [{"literal":"addEdge"}]},
    {"name": "add_edge$macrocall$3", "symbols": ["edge"]},
    {"name": "add_edge$macrocall$1", "symbols": ["wordL", "dot", "add_edge$macrocall$2", "lparen", "_", "add_edge$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_edge", "symbols": ["add_edge$macrocall$1"], "postprocess": (details) => ({ type: "add", target: "edges", ...id(details) })},
    {"name": "add_child$macrocall$2", "symbols": [{"literal":"addChild"}]},
    {"name": "add_child$macrocall$3$subexpression$1", "symbols": ["edge"]},
    {"name": "add_child$macrocall$3$subexpression$1$macrocall$2", "symbols": ["edge"]},
    {"name": "add_child$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "add_child$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "add_child$macrocall$3$subexpression$1$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_child$macrocall$3$subexpression$1$macrocall$3", "symbols": ["add_child$macrocall$3$subexpression$1$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "add_child$macrocall$3$subexpression$1$macrocall$1", "symbols": ["add_child$macrocall$3$subexpression$1$macrocall$2", "_", "comma", "_", "add_child$macrocall$3$subexpression$1$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "add_child$macrocall$3$subexpression$1", "symbols": ["add_child$macrocall$3$subexpression$1$macrocall$1"]},
    {"name": "add_child$macrocall$3", "symbols": ["add_child$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "add_child$macrocall$1", "symbols": ["wordL", "dot", "add_child$macrocall$2", "lparen", "_", "add_child$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_child", "symbols": ["add_child$macrocall$1"], "postprocess": (details) => ({ type: "add_child", ...id(details) })},
    {"name": "set_child$macrocall$2", "symbols": [{"literal":"setChild"}]},
    {"name": "set_child$macrocall$3", "symbols": ["edge"]},
    {"name": "set_child$macrocall$1", "symbols": ["wordL", "dot", "set_child$macrocall$2", "lparen", "_", "set_child$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "set_child", "symbols": ["set_child$macrocall$1"], "postprocess": (details) => ({ type: "set_child", ...id(details) })},
    {"name": "insert_value$macrocall$2", "symbols": [{"literal":"insertValue"}]},
    {"name": "insert_value$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "insert_value$macrocall$3$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "insert_value$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "insert_value$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "insert_value$macrocall$3$macrocall$3", "symbols": ["insert_value$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "insert_value$macrocall$3$macrocall$1", "symbols": ["insert_value$macrocall$3$macrocall$2", "_", "comma", "_", "insert_value$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "insert_value$macrocall$3", "symbols": ["insert_value$macrocall$3$macrocall$1"]},
    {"name": "insert_value$macrocall$1", "symbols": ["wordL", "dot", "insert_value$macrocall$2", "lparen", "_", "insert_value$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "insert_value", "symbols": ["insert_value$macrocall$1"], "postprocess": (details) => ({ type: "insert", target: "value", ...id(details) })},
    {"name": "insert_node$macrocall$2", "symbols": [{"literal":"insertNode"}]},
    {"name": "insert_node$macrocall$3", "symbols": ["insert_node_2_args"]},
    {"name": "insert_node$macrocall$1", "symbols": ["wordL", "dot", "insert_node$macrocall$2", "lparen", "_", "insert_node$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "insert_node", "symbols": ["insert_node$macrocall$1"], "postprocess": (details) => ({ type: "insert", target: "nodes", ...id(details) })},
    {"name": "insert_node$macrocall$5", "symbols": [{"literal":"insertNode"}]},
    {"name": "insert_node$macrocall$6", "symbols": ["insert_node_3_args"]},
    {"name": "insert_node$macrocall$4", "symbols": ["wordL", "dot", "insert_node$macrocall$5", "lparen", "_", "insert_node$macrocall$6", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "insert_node", "symbols": ["insert_node$macrocall$4"], "postprocess": (details) => ({ type: "insert", target: "nodes", ...id(details) })},
    {"name": "insert_matrix_row$macrocall$2", "symbols": [{"literal":"insertRow"}]},
    {"name": "insert_matrix_row$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "insert_matrix_row$macrocall$3$macrocall$3", "symbols": ["nns_list"]},
    {"name": "insert_matrix_row$macrocall$3$macrocall$1", "symbols": ["insert_matrix_row$macrocall$3$macrocall$2", "_", "comma", "_", "insert_matrix_row$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "insert_matrix_row$macrocall$3", "symbols": ["insert_matrix_row$macrocall$3$macrocall$1"]},
    {"name": "insert_matrix_row$macrocall$1", "symbols": ["wordL", "dot", "insert_matrix_row$macrocall$2", "lparen", "_", "insert_matrix_row$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "insert_matrix_row", "symbols": ["insert_matrix_row$macrocall$1"], "postprocess": (details) => ({ type: "insert_matrix_row", target: "value", ...id(details) })},
    {"name": "insert_matrix_column$macrocall$2", "symbols": [{"literal":"insertColumn"}]},
    {"name": "insert_matrix_column$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "insert_matrix_column$macrocall$3$macrocall$3", "symbols": ["nns_list"]},
    {"name": "insert_matrix_column$macrocall$3$macrocall$1", "symbols": ["insert_matrix_column$macrocall$3$macrocall$2", "_", "comma", "_", "insert_matrix_column$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "insert_matrix_column$macrocall$3", "symbols": ["insert_matrix_column$macrocall$3$macrocall$1"]},
    {"name": "insert_matrix_column$macrocall$1", "symbols": ["wordL", "dot", "insert_matrix_column$macrocall$2", "lparen", "_", "insert_matrix_column$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "insert_matrix_column", "symbols": ["insert_matrix_column$macrocall$1"], "postprocess": (details) => ({ type: "insert_matrix_column", target: "value", ...id(details) })},
    {"name": "insert_matrix_row$macrocall$5", "symbols": [{"literal":"insertRow"}]},
    {"name": "insert_matrix_row$macrocall$6$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nullT"]},
    {"name": "insert_matrix_row$macrocall$6$ebnf$1$subexpression$1$subexpression$1", "symbols": ["number"]},
    {"name": "insert_matrix_row$macrocall$6$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nns_list"]},
    {"name": "insert_matrix_row$macrocall$6$ebnf$1$subexpression$1", "symbols": ["insert_matrix_row$macrocall$6$ebnf$1$subexpression$1$subexpression$1"], "postprocess": iid},
    {"name": "insert_matrix_row$macrocall$6$ebnf$1", "symbols": ["insert_matrix_row$macrocall$6$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "insert_matrix_row$macrocall$6$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "insert_matrix_row$macrocall$6", "symbols": ["insert_matrix_row$macrocall$6$ebnf$1"]},
    {"name": "insert_matrix_row$macrocall$4", "symbols": ["wordL", "dot", "insert_matrix_row$macrocall$5", "lparen", "_", "insert_matrix_row$macrocall$6", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "insert_matrix_row", "symbols": ["insert_matrix_row$macrocall$4"], "postprocess": (details) => ({ type: "insert_matrix_row", target: "value", ...id(details) })},
    {"name": "insert_matrix_column$macrocall$5", "symbols": [{"literal":"insertColumn"}]},
    {"name": "insert_matrix_column$macrocall$6$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nullT"]},
    {"name": "insert_matrix_column$macrocall$6$ebnf$1$subexpression$1$subexpression$1", "symbols": ["number"]},
    {"name": "insert_matrix_column$macrocall$6$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nns_list"]},
    {"name": "insert_matrix_column$macrocall$6$ebnf$1$subexpression$1", "symbols": ["insert_matrix_column$macrocall$6$ebnf$1$subexpression$1$subexpression$1"], "postprocess": iid},
    {"name": "insert_matrix_column$macrocall$6$ebnf$1", "symbols": ["insert_matrix_column$macrocall$6$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "insert_matrix_column$macrocall$6$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "insert_matrix_column$macrocall$6", "symbols": ["insert_matrix_column$macrocall$6$ebnf$1"]},
    {"name": "insert_matrix_column$macrocall$4", "symbols": ["wordL", "dot", "insert_matrix_column$macrocall$5", "lparen", "_", "insert_matrix_column$macrocall$6", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "insert_matrix_column", "symbols": ["insert_matrix_column$macrocall$4"], "postprocess": (details) => ({ type: "insert_matrix_column", target: "value", ...id(details) })},
    {"name": "insert_node_2_args$subexpression$1", "symbols": ["number"]},
    {"name": "insert_node_2_args$subexpression$1", "symbols": ["word"]},
    {"name": "insert_node_2_args", "symbols": ["insert_node_2_args$subexpression$1", {"literal":","}, "_", "word"], "postprocess": ([indexOrNode, , , nodeName]) => ({ index: indexOrNode[0], value: nodeName })},
    {"name": "insert_node_3_args$subexpression$1", "symbols": ["number"]},
    {"name": "insert_node_3_args$subexpression$1", "symbols": ["word"]},
    {"name": "insert_node_3_args$subexpression$2", "symbols": ["number"]},
    {"name": "insert_node_3_args$subexpression$2", "symbols": ["string"]},
    {"name": "insert_node_3_args$subexpression$2", "symbols": ["nullT"]},
    {"name": "insert_node_3_args", "symbols": ["insert_node_3_args$subexpression$1", {"literal":","}, "_", "word", {"literal":","}, "_", "insert_node_3_args$subexpression$2"], "postprocess":  ([indexOrNode, , , nodeName, , , nodeValue]) => {
          return { index: indexOrNode[0], value: nodeName, nodeValue: nodeValue[0] };
        } },
    {"name": "remove_value$macrocall$2", "symbols": [{"literal":"removeValue"}]},
    {"name": "remove_value$macrocall$3$subexpression$1", "symbols": ["number"]},
    {"name": "remove_value$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "remove_value$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "remove_value$macrocall$3", "symbols": ["remove_value$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "remove_value$macrocall$1", "symbols": ["wordL", "dot", "remove_value$macrocall$2", "lparen", "_", "remove_value$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_value", "symbols": ["remove_value$macrocall$1"], "postprocess": (details) => ({ type: "remove", target: "value", ...id(details) })},
    {"name": "remove_node$macrocall$2", "symbols": [{"literal":"removeNode"}]},
    {"name": "remove_node$macrocall$3", "symbols": ["word"]},
    {"name": "remove_node$macrocall$1", "symbols": ["wordL", "dot", "remove_node$macrocall$2", "lparen", "_", "remove_node$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_node", "symbols": ["remove_node$macrocall$1"], "postprocess": (details) => ({ type: "remove", target: "nodes", ...id(details) })},
    {"name": "remove_edge$macrocall$2", "symbols": [{"literal":"removeEdge"}]},
    {"name": "remove_edge$macrocall$3", "symbols": ["edge"]},
    {"name": "remove_edge$macrocall$1", "symbols": ["wordL", "dot", "remove_edge$macrocall$2", "lparen", "_", "remove_edge$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_edge", "symbols": ["remove_edge$macrocall$1"], "postprocess": (details) => ({ type: "remove", target: "edges", ...id(details) })},
    {"name": "remove_child$macrocall$2", "symbols": [{"literal":"removeChild"}]},
    {"name": "remove_child$macrocall$3", "symbols": ["edge"]},
    {"name": "remove_child$macrocall$1", "symbols": ["wordL", "dot", "remove_child$macrocall$2", "lparen", "_", "remove_child$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_child", "symbols": ["remove_child$macrocall$1"], "postprocess": (details) => ({ type: "remove", target: "children", ...id(details) })},
    {"name": "remove_subtree$macrocall$2", "symbols": [{"literal":"removeSubtree"}]},
    {"name": "remove_subtree$macrocall$3", "symbols": ["word"]},
    {"name": "remove_subtree$macrocall$1", "symbols": ["wordL", "dot", "remove_subtree$macrocall$2", "lparen", "_", "remove_subtree$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_subtree", "symbols": ["remove_subtree$macrocall$1"], "postprocess": (details) => ({ type: "remove_subtree", target: "nodes", ...id(details) })},
    {"name": "remove_at$macrocall$2", "symbols": [{"literal":"removeAt"}]},
    {"name": "remove_at$macrocall$3", "symbols": ["number"]},
    {"name": "remove_at$macrocall$1", "symbols": ["wordL", "dot", "remove_at$macrocall$2", "lparen", "_", "remove_at$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_at", "symbols": ["remove_at$macrocall$1"], "postprocess": (details) => ({ type: "remove_at", target: "all", ...id(details) })},
    {"name": "add_neuron_at_layer_at_end$macrocall$2", "symbols": [{"literal":"addNeurons"}]},
    {"name": "add_neuron_at_layer_at_end$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "add_neuron_at_layer_at_end$macrocall$3$macrocall$3", "symbols": ["nns_list"]},
    {"name": "add_neuron_at_layer_at_end$macrocall$3$macrocall$1", "symbols": ["add_neuron_at_layer_at_end$macrocall$3$macrocall$2", "_", "comma", "_", "add_neuron_at_layer_at_end$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "add_neuron_at_layer_at_end$macrocall$3", "symbols": ["add_neuron_at_layer_at_end$macrocall$3$macrocall$1"]},
    {"name": "add_neuron_at_layer_at_end$macrocall$1", "symbols": ["wordL", "dot", "add_neuron_at_layer_at_end$macrocall$2", "lparen", "_", "add_neuron_at_layer_at_end$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_neuron_at_layer_at_end", "symbols": ["add_neuron_at_layer_at_end$macrocall$1"], "postprocess": (details) => ({ type: "insert_neuralnetwork_addNeurons", target1: "layers", target2: "neurons", ...id(details) })},
    {"name": "add_layer_with_neurons$macrocall$2", "symbols": [{"literal":"addLayer"}]},
    {"name": "add_layer_with_neurons$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "add_layer_with_neurons$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "add_layer_with_neurons$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_layer_with_neurons$macrocall$3$macrocall$2", "symbols": ["add_layer_with_neurons$macrocall$3$macrocall$2$subexpression$1"]},
    {"name": "add_layer_with_neurons$macrocall$3$macrocall$3", "symbols": ["nns_list"]},
    {"name": "add_layer_with_neurons$macrocall$3$macrocall$1", "symbols": ["add_layer_with_neurons$macrocall$3$macrocall$2", "_", "comma", "_", "add_layer_with_neurons$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "add_layer_with_neurons$macrocall$3", "symbols": ["add_layer_with_neurons$macrocall$3$macrocall$1"]},
    {"name": "add_layer_with_neurons$macrocall$1", "symbols": ["wordL", "dot", "add_layer_with_neurons$macrocall$2", "lparen", "_", "add_layer_with_neurons$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_layer_with_neurons", "symbols": ["add_layer_with_neurons$macrocall$1"], "postprocess": (details) => ({ type: "insert_neuralnetwork_addLayer", target1: "layers", target2: "neurons", target3: "layerColors", ...id(details) })},
    {"name": "remove_neurons_at_layer$macrocall$2", "symbols": [{"literal":"removeNeuronsFromLayer"}]},
    {"name": "remove_neurons_at_layer$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "remove_neurons_at_layer$macrocall$3$macrocall$3", "symbols": ["nns_list"]},
    {"name": "remove_neurons_at_layer$macrocall$3$macrocall$1", "symbols": ["remove_neurons_at_layer$macrocall$3$macrocall$2", "_", "comma", "_", "remove_neurons_at_layer$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "remove_neurons_at_layer$macrocall$3", "symbols": ["remove_neurons_at_layer$macrocall$3$macrocall$1"]},
    {"name": "remove_neurons_at_layer$macrocall$1", "symbols": ["wordL", "dot", "remove_neurons_at_layer$macrocall$2", "lparen", "_", "remove_neurons_at_layer$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_neurons_at_layer", "symbols": ["remove_neurons_at_layer$macrocall$1"], "postprocess": (details) => ({ type: "remove_neuralnetwork_removeNeuronsFromLayer",target1: "layers", target2: "neurons", target3: "neuronColors", target4: "layerColors", ...id(details) })},
    {"name": "remove_layer$macrocall$2", "symbols": [{"literal":"removeLayerAt"}]},
    {"name": "remove_layer$macrocall$3", "symbols": ["number"]},
    {"name": "remove_layer$macrocall$1", "symbols": ["wordL", "dot", "remove_layer$macrocall$2", "lparen", "_", "remove_layer$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_layer", "symbols": ["remove_layer$macrocall$1"], "postprocess": (details) => ({ type: "remove_neuralnetwork_removeLayerAt", target1: "layers", target2: "neurons", target3: "layerColors", target4: "neuronColors", ...id(details) })},
    {"name": "add_matrix_row$macrocall$2", "symbols": [{"literal":"addRow"}]},
    {"name": "add_matrix_row$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_matrix_row$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nns_list"]},
    {"name": "add_matrix_row$macrocall$3$ebnf$1$subexpression$1", "symbols": ["add_matrix_row$macrocall$3$ebnf$1$subexpression$1$subexpression$1"], "postprocess": iid},
    {"name": "add_matrix_row$macrocall$3$ebnf$1", "symbols": ["add_matrix_row$macrocall$3$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "add_matrix_row$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "add_matrix_row$macrocall$3", "symbols": ["add_matrix_row$macrocall$3$ebnf$1"]},
    {"name": "add_matrix_row$macrocall$1", "symbols": ["wordL", "dot", "add_matrix_row$macrocall$2", "lparen", "_", "add_matrix_row$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_matrix_row", "symbols": ["add_matrix_row$macrocall$1"], "postprocess": (details) => ({ type: "add_matrix_row", target: "value", ...id(details) })},
    {"name": "add_matrix_column$macrocall$2", "symbols": [{"literal":"addColumn"}]},
    {"name": "add_matrix_column$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_matrix_column$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nns_list"]},
    {"name": "add_matrix_column$macrocall$3$ebnf$1$subexpression$1", "symbols": ["add_matrix_column$macrocall$3$ebnf$1$subexpression$1$subexpression$1"], "postprocess": iid},
    {"name": "add_matrix_column$macrocall$3$ebnf$1", "symbols": ["add_matrix_column$macrocall$3$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "add_matrix_column$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "add_matrix_column$macrocall$3", "symbols": ["add_matrix_column$macrocall$3$ebnf$1"]},
    {"name": "add_matrix_column$macrocall$1", "symbols": ["wordL", "dot", "add_matrix_column$macrocall$2", "lparen", "_", "add_matrix_column$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_matrix_column", "symbols": ["add_matrix_column$macrocall$1"], "postprocess": (details) => ({ type: "add_matrix_column", target: "value", ...id(details) })},
    {"name": "remove_matrix_row$macrocall$2", "symbols": [{"literal":"removeRow"}]},
    {"name": "remove_matrix_row$macrocall$3", "symbols": ["number"]},
    {"name": "remove_matrix_row$macrocall$1", "symbols": ["wordL", "dot", "remove_matrix_row$macrocall$2", "lparen", "_", "remove_matrix_row$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_matrix_row", "symbols": ["remove_matrix_row$macrocall$1"], "postprocess": (details) => ({ type: "remove_matrix_row", target: "value", ...id(details) })},
    {"name": "remove_matrix_column$macrocall$2", "symbols": [{"literal":"removeColumn"}]},
    {"name": "remove_matrix_column$macrocall$3", "symbols": ["number"]},
    {"name": "remove_matrix_column$macrocall$1", "symbols": ["wordL", "dot", "remove_matrix_column$macrocall$2", "lparen", "_", "remove_matrix_column$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "remove_matrix_column", "symbols": ["remove_matrix_column$macrocall$1"], "postprocess": (details) => ({ type: "remove_matrix_column", target: "value", ...id(details) })},
    {"name": "add_matrix_border$macrocall$2", "symbols": [{"literal":"addBorder"}]},
    {"name": "add_matrix_border$macrocall$3$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "add_matrix_border$macrocall$3$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "add_matrix_border$macrocall$3$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_matrix_border$macrocall$3$macrocall$2", "symbols": ["add_matrix_border$macrocall$3$macrocall$2$subexpression$1"], "postprocess": id},
    {"name": "add_matrix_border$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "add_matrix_border$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_matrix_border$macrocall$3$macrocall$3", "symbols": ["add_matrix_border$macrocall$3$macrocall$3$subexpression$1"], "postprocess": id},
    {"name": "add_matrix_border$macrocall$3$macrocall$1", "symbols": ["add_matrix_border$macrocall$3$macrocall$2", "_", "comma", "_", "add_matrix_border$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: id(x), value: id(y) })},
    {"name": "add_matrix_border$macrocall$3", "symbols": ["add_matrix_border$macrocall$3$macrocall$1"]},
    {"name": "add_matrix_border$macrocall$1", "symbols": ["wordL", "dot", "add_matrix_border$macrocall$2", "lparen", "_", "add_matrix_border$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_matrix_border", "symbols": ["add_matrix_border$macrocall$1"], "postprocess": (details) => ({ type: "add_matrix_border", target: "value", ...id(details) })},
    {"name": "add_matrix_border$macrocall$5", "symbols": [{"literal":"addBorder"}]},
    {"name": "add_matrix_border$macrocall$6$subexpression$1", "symbols": ["number"]},
    {"name": "add_matrix_border$macrocall$6$subexpression$1", "symbols": ["string"]},
    {"name": "add_matrix_border$macrocall$6$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_matrix_border$macrocall$6", "symbols": ["add_matrix_border$macrocall$6$subexpression$1"], "postprocess": id},
    {"name": "add_matrix_border$macrocall$4", "symbols": ["wordL", "dot", "add_matrix_border$macrocall$5", "lparen", "_", "add_matrix_border$macrocall$6", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_matrix_border", "symbols": ["add_matrix_border$macrocall$4"], "postprocess": (details) => ({ type: "add_matrix_border", target: "value", ...id(details) })},
    {"name": "nns_list$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "nns_list$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "nns_list$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "nns_list$macrocall$2", "symbols": ["nns_list$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "nns_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_list$macrocall$1", "symbols": ["lbrac", "nns_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "nns_list$macrocall$1$macrocall$2", "symbols": ["nns_list$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["nns_list$macrocall$1$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "nns_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["nns_list$macrocall$1$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["nns_list$macrocall$1$macrocall$1$ebnf$1", "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_list$macrocall$1$macrocall$1", "symbols": ["nns_list$macrocall$1$macrocall$1$macrocall$1", "nns_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "nns_list$macrocall$1", "symbols": ["lbrac", "nns_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "nns_list", "symbols": ["nns_list$macrocall$1"], "postprocess": id},
    {"name": "ns_list$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "ns_list$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "ns_list$macrocall$2", "symbols": ["ns_list$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "ns_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "ns_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "ns_list$macrocall$1", "symbols": ["lbrac", "ns_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "ns_list$macrocall$1$macrocall$2", "symbols": ["ns_list$macrocall$2"]},
    {"name": "ns_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["ns_list$macrocall$1$macrocall$2"]},
    {"name": "ns_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "ns_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "ns_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["ns_list$macrocall$1$macrocall$2"]},
    {"name": "ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "ns_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["ns_list$macrocall$1$macrocall$1$ebnf$1", "ns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ns_list$macrocall$1$macrocall$1", "symbols": ["ns_list$macrocall$1$macrocall$1$macrocall$1", "ns_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "ns_list$macrocall$1", "symbols": ["lbrac", "ns_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "ns_list", "symbols": ["ns_list$macrocall$1"], "postprocess": id},
    {"name": "n_list$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "n_list$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "n_list$macrocall$2", "symbols": ["n_list$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "n_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "n_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "n_list$macrocall$1", "symbols": ["lbrac", "n_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "n_list$macrocall$1$macrocall$2", "symbols": ["n_list$macrocall$2"]},
    {"name": "n_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["n_list$macrocall$1$macrocall$2"]},
    {"name": "n_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "n_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "n_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["n_list$macrocall$1$macrocall$2"]},
    {"name": "n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "n_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["n_list$macrocall$1$macrocall$1$ebnf$1", "n_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "n_list$macrocall$1$macrocall$1", "symbols": ["n_list$macrocall$1$macrocall$1$macrocall$1", "n_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "n_list$macrocall$1", "symbols": ["lbrac", "n_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "n_list", "symbols": ["n_list$macrocall$1"], "postprocess": id},
    {"name": "s_list$macrocall$2", "symbols": ["string"], "postprocess": id},
    {"name": "s_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "s_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "s_list$macrocall$1", "symbols": ["lbrac", "s_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "s_list$macrocall$1$macrocall$2", "symbols": ["s_list$macrocall$2"]},
    {"name": "s_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["s_list$macrocall$1$macrocall$2"]},
    {"name": "s_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "s_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "s_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["s_list$macrocall$1$macrocall$2"]},
    {"name": "s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "s_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["s_list$macrocall$1$macrocall$1$ebnf$1", "s_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "s_list$macrocall$1$macrocall$1", "symbols": ["s_list$macrocall$1$macrocall$1$macrocall$1", "s_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "s_list$macrocall$1", "symbols": ["lbrac", "s_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "s_list", "symbols": ["s_list$macrocall$1"], "postprocess": id},
    {"name": "number_only_list$macrocall$2", "symbols": ["number"], "postprocess": id},
    {"name": "number_only_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "number_only_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "number_only_list$macrocall$1", "symbols": ["lbrac", "number_only_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "number_only_list$macrocall$1$macrocall$2", "symbols": ["number_only_list$macrocall$2"]},
    {"name": "number_only_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["number_only_list$macrocall$1$macrocall$2"]},
    {"name": "number_only_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "number_only_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "number_only_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["number_only_list$macrocall$1$macrocall$2"]},
    {"name": "number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "number_only_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["number_only_list$macrocall$1$macrocall$1$ebnf$1", "number_only_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number_only_list$macrocall$1$macrocall$1", "symbols": ["number_only_list$macrocall$1$macrocall$1$macrocall$1", "number_only_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "number_only_list$macrocall$1", "symbols": ["lbrac", "number_only_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "number_only_list", "symbols": ["number_only_list$macrocall$1"], "postprocess": id},
    {"name": "w_list$macrocall$2", "symbols": ["word"], "postprocess": id},
    {"name": "w_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "w_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "w_list$macrocall$1", "symbols": ["lbrac", "w_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "w_list$macrocall$1$macrocall$2", "symbols": ["w_list$macrocall$2"]},
    {"name": "w_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["w_list$macrocall$1$macrocall$2"]},
    {"name": "w_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "w_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "w_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["w_list$macrocall$1$macrocall$2"]},
    {"name": "w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "w_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["w_list$macrocall$1$macrocall$1$ebnf$1", "w_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "w_list$macrocall$1$macrocall$1", "symbols": ["w_list$macrocall$1$macrocall$1$macrocall$1", "w_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "w_list$macrocall$1", "symbols": ["lbrac", "w_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "w_list", "symbols": ["w_list$macrocall$1"], "postprocess": id},
    {"name": "e_list$macrocall$2", "symbols": ["edge"], "postprocess": id},
    {"name": "e_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "e_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "e_list$macrocall$1", "symbols": ["lbrac", "e_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "e_list$macrocall$1$macrocall$2", "symbols": ["e_list$macrocall$2"]},
    {"name": "e_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["e_list$macrocall$1$macrocall$2"]},
    {"name": "e_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "e_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "e_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["e_list$macrocall$1$macrocall$2"]},
    {"name": "e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "e_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["e_list$macrocall$1$macrocall$1$ebnf$1", "e_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "e_list$macrocall$1$macrocall$1", "symbols": ["e_list$macrocall$1$macrocall$1$macrocall$1", "e_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "e_list$macrocall$1", "symbols": ["lbrac", "e_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "e_list", "symbols": ["e_list$macrocall$1"], "postprocess": id},
    {"name": "b_list$macrocall$2", "symbols": ["boolean"], "postprocess": id},
    {"name": "b_list$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "b_list$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "b_list$macrocall$1", "symbols": ["lbrac", "b_list$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "b_list$macrocall$1$macrocall$2", "symbols": ["b_list$macrocall$2"]},
    {"name": "b_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["b_list$macrocall$1$macrocall$2"]},
    {"name": "b_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "b_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "b_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["b_list$macrocall$1$macrocall$2"]},
    {"name": "b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => id(value)},
    {"name": "b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "b_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["b_list$macrocall$1$macrocall$1$ebnf$1", "b_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "b_list$macrocall$1$macrocall$1", "symbols": ["b_list$macrocall$1$macrocall$1$macrocall$1", "b_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "b_list$macrocall$1", "symbols": ["lbrac", "b_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "b_list", "symbols": ["b_list$macrocall$1"], "postprocess": id},
    {"name": "nns_mlist$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "nns_mlist$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "nns_mlist$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "nns_mlist$macrocall$2", "symbols": ["nns_mlist$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "nns_mlist$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "nns_mlist$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$2", "symbols": ["nns_mlist$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": []},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1", "symbols": ["nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "comma", "nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "nns_mlist$macrocall$1$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": ["nns_mlist$macrocall$1$macrocall$1$ebnf$3", "nns_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$4", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$macrocall$2", "nns_mlist$macrocall$1$macrocall$1$ebnf$3", "nns_mlist$macrocall$1$macrocall$1$ebnf$4", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nns_mlist$macrocall$1$ebnf$3", "symbols": []},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$2", "symbols": ["nns_mlist$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "symbols": []},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1", "symbols": ["nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "comma", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "symbols": ["nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$4", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$2", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$4", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nns_mlist$macrocall$1$ebnf$3$subexpression$1", "symbols": ["nns_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "comma", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1"]},
    {"name": "nns_mlist$macrocall$1$ebnf$3", "symbols": ["nns_mlist$macrocall$1$ebnf$3", "nns_mlist$macrocall$1$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_mlist$macrocall$1$ebnf$4", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$macrocall$1", "nns_mlist$macrocall$1$ebnf$3", "nns_mlist$macrocall$1$ebnf$4", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const rows = [first];
            if (rest) {
                rest.forEach(([, , , row]) => rows.push(row));
            }
            return rows;
        } },
    {"name": "nns_mlist", "symbols": ["nns_mlist$macrocall$1"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "nnsp_mlist$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "nnsp_mlist$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "nnsp_mlist$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "nnsp_mlist$macrocall$2", "symbols": ["nnsp_mlist$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "nnsp_mlist$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$2", "symbols": ["nnsp_mlist$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": []},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1", "symbols": ["nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "comma", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "nnsp_mlist$macrocall$1$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": ["nnsp_mlist$macrocall$1$macrocall$1$ebnf$3", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$4", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$macrocall$2", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$4", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nnsp_mlist$macrocall$1$ebnf$3", "symbols": []},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$2", "symbols": ["nnsp_mlist$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$1", "rbrac"], "postprocess": () => []},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "symbols": []},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1", "symbols": ["nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "comma", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "symbols": ["nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$4", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$2", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$3", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1$ebnf$4", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1", "symbols": ["nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "comma", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1$macrocall$1"]},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3", "symbols": ["nnsp_mlist$macrocall$1$ebnf$3", "nnsp_mlist$macrocall$1$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$4", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$macrocall$1", "nnsp_mlist$macrocall$1$ebnf$3", "nnsp_mlist$macrocall$1$ebnf$4", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const rows = [first];
            if (rest) {
                rest.forEach(([, , , row]) => rows.push(row));
            }
            return rows;
        } },
    {"name": "nnsp_mlist", "symbols": ["nnsp_mlist$macrocall$1"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([value]) => Number(value.value)},
    {"name": "numberL", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([value]) => ({number: Number(value.value), line: value.line, col: value.col})},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([value]) => value.value},
    {"name": "boolean", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([value]) => value.value},
    {"name": "edge", "symbols": ["wordL", (lexer.has("dash") ? {type: "dash"} : dash), "wordL"], "postprocess": ([start, , end]) => ({ start: start.name, end: end.name })},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([value]) => value.value},
    {"name": "layoutspec", "symbols": [(lexer.has("layoutspec") ? {type: "layoutspec"} : layoutspec)], "postprocess": ([value]) => value.value},
    {"name": "wordL", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([value]) => ({name: value.value, line: value.line, col: value.col})},
    {"name": "nullT", "symbols": [(lexer.has("nullT") ? {type: "nullT"} : nullT)], "postprocess": () => null},
    {"name": "pass", "symbols": [(lexer.has("pass") ? {type: "pass"} : pass)], "postprocess": () => "_"},
    {"name": "layout", "symbols": [(lexer.has("layoutspec") ? {type: "layoutspec"} : layoutspec)], "postprocess":  ([t]) => {
            const parts = t.value.split("x").map(Number);
            if (parts.length !== 2) throw new Error("layout must be NUMBERxNUMBER");
            return parts
        } },
    {"name": "position_labels_literal", "symbols": [{"literal":"bottom"}], "postprocess": () => "bottom"},
    {"name": "position_labels_literal", "symbols": [{"literal":"top"}], "postprocess": () => "top"},
    {"name": "range_value", "symbols": ["number", "dotdot", "number"], "postprocess": ([start, , end]) => ({ type: "range", start: start, end: end })},
    {"name": "position_value$subexpression$1", "symbols": ["range_value"]},
    {"name": "position_value$subexpression$1", "symbols": ["number"]},
    {"name": "position_value", "symbols": ["position_value$subexpression$1"], "postprocess": iid},
    {"name": "ranged_tuple", "symbols": ["lparen", "_", "position_value", "_", "comma", "_", "position_value", "_", "rparen"], "postprocess": ([, , x, , , , y, ]) => [x, y]},
    {"name": "position_keyword$subexpression$1", "symbols": [(lexer.has("word") ? {type: "word"} : word)]},
    {"name": "position_keyword$subexpression$1", "symbols": [(lexer.has("word") ? {type: "word"} : word), (lexer.has("dash") ? {type: "dash"} : dash), (lexer.has("word") ? {type: "word"} : word)]},
    {"name": "position_keyword", "symbols": ["position_keyword$subexpression$1"], "postprocess":  (parts) => {
            const tokens = parts[0]; // Access the actual token array
            let keywordValue;
            if (Array.isArray(tokens) && tokens.length === 3) {
                // Hyphenated keyword like "top-left"
                keywordValue = tokens[0].value + '-' + tokens[2].value;
            } else if (Array.isArray(tokens)) {
                // Single word keyword like "tl"
                keywordValue = tokens[0].value;
            } else {
                // Single token case
                keywordValue = tokens.value;
            }
            const firstToken = Array.isArray(tokens) ? tokens[0] : tokens;
            return { 
                type: "keyword", 
                value: keywordValue, 
                line: firstToken.line, 
                col: firstToken.col 
            };
        } },
    {"name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null},
    {"name": "nlw", "symbols": [(lexer.has("nlw") ? {type: "nlw"} : nlw)], "postprocess": () => null},
    {"name": "nlow$subexpression$1", "symbols": [(lexer.has("nlw") ? {type: "nlw"} : nlw)]},
    {"name": "nlow$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "nlow", "symbols": ["nlow$subexpression$1"], "postprocess": () => null},
    {"name": "comma_nlow$subexpression$1$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "comma_nlow$subexpression$1$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comma_nlow$subexpression$1$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "comma_nlow$subexpression$1$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comma_nlow$subexpression$1$subexpression$1", "symbols": ["comma_nlow$subexpression$1$subexpression$1$ebnf$1", "comma", "comma_nlow$subexpression$1$subexpression$1$ebnf$2"]},
    {"name": "comma_nlow$subexpression$1", "symbols": ["comma_nlow$subexpression$1$subexpression$1"]},
    {"name": "comma_nlow$subexpression$1$ebnf$1", "symbols": ["nlw"]},
    {"name": "comma_nlow$subexpression$1$ebnf$1", "symbols": ["comma_nlow$subexpression$1$ebnf$1", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "comma_nlow$subexpression$1", "symbols": ["comma_nlow$subexpression$1$ebnf$1"]},
    {"name": "comma_nlow", "symbols": ["comma_nlow$subexpression$1"], "postprocess": () => null},
    {"name": "wsn$ebnf$1", "symbols": []},
    {"name": "wsn$ebnf$1$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "wsn$ebnf$1$subexpression$1", "symbols": [(lexer.has("nlw") ? {type: "nlw"} : nlw)]},
    {"name": "wsn$ebnf$1", "symbols": ["wsn$ebnf$1", "wsn$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "wsn", "symbols": ["wsn$ebnf$1"], "postprocess": () => null},
    {"name": "nlw1$ebnf$1", "symbols": [(lexer.has("nlw") ? {type: "nlw"} : nlw)]},
    {"name": "nlw1$ebnf$1", "symbols": ["nlw1$ebnf$1", (lexer.has("nlw") ? {type: "nlw"} : nlw)], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nlw1", "symbols": ["nlw1$ebnf$1"], "postprocess": () => null},
    {"name": "comma_nlow_new_arch$subexpression$1", "symbols": ["wsn", "comma", "wsn"]},
    {"name": "comma_nlow_new_arch", "symbols": ["comma_nlow_new_arch$subexpression$1"], "postprocess": () => null},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": ([value]) => ({ type: "comment", content: value.value, line: value.line, col: value.col })},
    {"name": "lbracket", "symbols": [(lexer.has("lbracket") ? {type: "lbracket"} : lbracket)], "postprocess": () => null},
    {"name": "rbracket", "symbols": [(lexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": () => null},
    {"name": "lbrac", "symbols": [(lexer.has("lbrac") ? {type: "lbrac"} : lbrac)], "postprocess": () => null},
    {"name": "rbrac", "symbols": [(lexer.has("rbrac") ? {type: "rbrac"} : rbrac)], "postprocess": () => null},
    {"name": "lparen", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen)], "postprocess": () => null},
    {"name": "rparen", "symbols": [(lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": () => null},
    {"name": "comma", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": () => null},
    {"name": "dotdot", "symbols": [(lexer.has("dotdot") ? {type: "dotdot"} : dotdot)], "postprocess": () => null},
    {"name": "dot", "symbols": [(lexer.has("dot") ? {type: "dot"} : dot)], "postprocess": () => null},
    {"name": "colon", "symbols": [(lexer.has("colon") ? {type: "colon"} : colon)], "postprocess": () => null},
    {"name": "equals", "symbols": [(lexer.has("equals") ? {type: "equals"} : equals)], "postprocess": () => null}
]
  , ParserStart: "root"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
