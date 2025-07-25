// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  nlw: { match: /[ \t]*\n[ \t]*/, lineBreaks: true },
  ws:     /[ \t]+/,
  nullT: { match: /null/, value: () => null },
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
  dash: "-",
  equals: "=",
  pass: "_",
  x: "x",
  word: { match: /[a-zA-Z_][a-zA-Z0-9_]*/, type: moo.keywords({
    def: ["array", "matrix", "graph", "linkedlist", "tree", "stack", "text"],
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
            
            allItems.forEach(item => {
                if (!item) return;
                
                // Definitions have a 'class' property (from getDef function)
                if (item.class) {
                    defs.push(item);
                } else if (item.type === "comment") {
                    // Comments go to definitions by default (legacy behavior)
                    defs.push(item);
                } else if (item.type) {
                    // Everything else with a type is a command
                    cmds.push(item);
                }
            });
            
            return { defs, cmds };
        } },
    {"name": "definition$subexpression$1", "symbols": ["array_def"]},
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
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "array_def$macrocall$1$macrocall$2"]},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["array_def$macrocall$1$macrocall$1$ebnf$1", "array_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "nlow", "array_def$macrocall$1$macrocall$2", "array_def$macrocall$1$macrocall$1$ebnf$1", "array_def$macrocall$1$macrocall$1$ebnf$2", "rbracket"], "postprocess":  d => {
            const firstXValue = d[2];
            const repetitionGroups = d[3];
            let result = {};
        
            // Process the first $X item
            // Expect firstXValue to be in the format: [[{key: value_obj}]]
            if (Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null && typeof firstXValue[0][0] === 'object' && !Array.isArray(firstXValue[0][0])) {
                Object.assign(result, firstXValue[0][0]);
            }
        
            // Process subsequent $X items
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    // Expect subsequentXValue to be in the format: [[{key: value_obj}]]
                    if (Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null && typeof subsequentXValue[0][0] === 'object' && !Array.isArray(subsequentXValue[0][0])) {
                        Object.assign(result, subsequentXValue[0][0]);
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
    {"name": "matrix_def$macrocall$2", "symbols": [{"literal":"matrix"}]},
    {"name": "matrix_def$macrocall$3", "symbols": ["matrix_pair"]},
    {"name": "matrix_def$macrocall$1$macrocall$2", "symbols": ["matrix_def$macrocall$3"]},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "matrix_def$macrocall$1$macrocall$2"]},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["matrix_def$macrocall$1$macrocall$1$ebnf$1", "matrix_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "matrix_def$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "matrix_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "nlow", "matrix_def$macrocall$1$macrocall$2", "matrix_def$macrocall$1$macrocall$1$ebnf$1", "matrix_def$macrocall$1$macrocall$1$ebnf$2", "rbracket"], "postprocess":  d => {
            const firstXValue = d[2];
            const repetitionGroups = d[3];
            let result = {};
        
            // Process the first $X item
            // Expect firstXValue to be in the format: [[{key: value_obj}]]
            if (Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null && typeof firstXValue[0][0] === 'object' && !Array.isArray(firstXValue[0][0])) {
                Object.assign(result, firstXValue[0][0]);
            }
        
            // Process subsequent $X items
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    // Expect subsequentXValue to be in the format: [[{key: value_obj}]]
                    if (Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null && typeof subsequentXValue[0][0] === 'object' && !Array.isArray(subsequentXValue[0][0])) {
                        Object.assign(result, subsequentXValue[0][0]);
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
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "linkedlist_def$macrocall$1$macrocall$2"]},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["linkedlist_def$macrocall$1$macrocall$1$ebnf$1", "linkedlist_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "linkedlist_def$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "linkedlist_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "nlow", "linkedlist_def$macrocall$1$macrocall$2", "linkedlist_def$macrocall$1$macrocall$1$ebnf$1", "linkedlist_def$macrocall$1$macrocall$1$ebnf$2", "rbracket"], "postprocess":  d => {
            const firstXValue = d[2];
            const repetitionGroups = d[3];
            let result = {};
        
            // Process the first $X item
            // Expect firstXValue to be in the format: [[{key: value_obj}]]
            if (Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null && typeof firstXValue[0][0] === 'object' && !Array.isArray(firstXValue[0][0])) {
                Object.assign(result, firstXValue[0][0]);
            }
        
            // Process subsequent $X items
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    // Expect subsequentXValue to be in the format: [[{key: value_obj}]]
                    if (Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null && typeof subsequentXValue[0][0] === 'object' && !Array.isArray(subsequentXValue[0][0])) {
                        Object.assign(result, subsequentXValue[0][0]);
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
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "tree_def$macrocall$1$macrocall$2"]},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["tree_def$macrocall$1$macrocall$1$ebnf$1", "tree_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "tree_def$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "tree_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "nlow", "tree_def$macrocall$1$macrocall$2", "tree_def$macrocall$1$macrocall$1$ebnf$1", "tree_def$macrocall$1$macrocall$1$ebnf$2", "rbracket"], "postprocess":  d => {
            const firstXValue = d[2];
            const repetitionGroups = d[3];
            let result = {};
        
            // Process the first $X item
            // Expect firstXValue to be in the format: [[{key: value_obj}]]
            if (Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null && typeof firstXValue[0][0] === 'object' && !Array.isArray(firstXValue[0][0])) {
                Object.assign(result, firstXValue[0][0]);
            }
        
            // Process subsequent $X items
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    // Expect subsequentXValue to be in the format: [[{key: value_obj}]]
                    if (Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null && typeof subsequentXValue[0][0] === 'object' && !Array.isArray(subsequentXValue[0][0])) {
                        Object.assign(result, subsequentXValue[0][0]);
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
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "stack_def$macrocall$1$macrocall$2"]},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["stack_def$macrocall$1$macrocall$1$ebnf$1", "stack_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "stack_def$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "stack_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "nlow", "stack_def$macrocall$1$macrocall$2", "stack_def$macrocall$1$macrocall$1$ebnf$1", "stack_def$macrocall$1$macrocall$1$ebnf$2", "rbracket"], "postprocess":  d => {
            const firstXValue = d[2];
            const repetitionGroups = d[3];
            let result = {};
        
            // Process the first $X item
            // Expect firstXValue to be in the format: [[{key: value_obj}]]
            if (Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null && typeof firstXValue[0][0] === 'object' && !Array.isArray(firstXValue[0][0])) {
                Object.assign(result, firstXValue[0][0]);
            }
        
            // Process subsequent $X items
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    // Expect subsequentXValue to be in the format: [[{key: value_obj}]]
                    if (Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null && typeof subsequentXValue[0][0] === 'object' && !Array.isArray(subsequentXValue[0][0])) {
                        Object.assign(result, subsequentXValue[0][0]);
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
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "graph_def$macrocall$1$macrocall$2"]},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["graph_def$macrocall$1$macrocall$1$ebnf$1", "graph_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "graph_def$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "graph_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "nlow", "graph_def$macrocall$1$macrocall$2", "graph_def$macrocall$1$macrocall$1$ebnf$1", "graph_def$macrocall$1$macrocall$1$ebnf$2", "rbracket"], "postprocess":  d => {
            const firstXValue = d[2];
            const repetitionGroups = d[3];
            let result = {};
        
            // Process the first $X item
            // Expect firstXValue to be in the format: [[{key: value_obj}]]
            if (Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null && typeof firstXValue[0][0] === 'object' && !Array.isArray(firstXValue[0][0])) {
                Object.assign(result, firstXValue[0][0]);
            }
        
            // Process subsequent $X items
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    // Expect subsequentXValue to be in the format: [[{key: value_obj}]]
                    if (Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null && typeof subsequentXValue[0][0] === 'object' && !Array.isArray(subsequentXValue[0][0])) {
                        Object.assign(result, subsequentXValue[0][0]);
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
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["comma_nlow", "text_def$macrocall$1$macrocall$2"]},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["text_def$macrocall$1$macrocall$1$ebnf$1", "text_def$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "text_def$macrocall$1$macrocall$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "text_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "nlow", "text_def$macrocall$1$macrocall$2", "text_def$macrocall$1$macrocall$1$ebnf$1", "text_def$macrocall$1$macrocall$1$ebnf$2", "rbracket"], "postprocess":  d => {
            const firstXValue = d[2];
            const repetitionGroups = d[3];
            let result = {};
        
            // Process the first $X item
            // Expect firstXValue to be in the format: [[{key: value_obj}]]
            if (Array.isArray(firstXValue) && firstXValue.length > 0 &&
                Array.isArray(firstXValue[0]) && firstXValue[0].length > 0 &&
                firstXValue[0][0] !== null && typeof firstXValue[0][0] === 'object' && !Array.isArray(firstXValue[0][0])) {
                Object.assign(result, firstXValue[0][0]);
            }
        
            // Process subsequent $X items
            if (repetitionGroups) {
                repetitionGroups.forEach(group => {
                    const subsequentXValue = group[1];
                    // Expect subsequentXValue to be in the format: [[{key: value_obj}]]
                    if (Array.isArray(subsequentXValue) && subsequentXValue.length > 0 &&
                        Array.isArray(subsequentXValue[0]) && subsequentXValue[0].length > 0 &&
                        subsequentXValue[0][0] !== null && typeof subsequentXValue[0][0] === 'object' && !Array.isArray(subsequentXValue[0][0])) {
                        Object.assign(result, subsequentXValue[0][0]);
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
    {"name": "commands$subexpression$1", "symbols": ["add_matrix_row"]},
    {"name": "commands$subexpression$1", "symbols": ["add_matrix_column"]},
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
    {"name": "add_matrix_row$macrocall$2", "symbols": [{"literal":"addRow"}]},
    {"name": "add_matrix_row$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_matrix_row$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["number"]},
    {"name": "add_matrix_row$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nns_list"]},
    {"name": "add_matrix_row$macrocall$3$ebnf$1$subexpression$1", "symbols": ["add_matrix_row$macrocall$3$ebnf$1$subexpression$1$subexpression$1"], "postprocess": iid},
    {"name": "add_matrix_row$macrocall$3$ebnf$1", "symbols": ["add_matrix_row$macrocall$3$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "add_matrix_row$macrocall$3$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "add_matrix_row$macrocall$3", "symbols": ["add_matrix_row$macrocall$3$ebnf$1"]},
    {"name": "add_matrix_row$macrocall$1", "symbols": ["wordL", "dot", "add_matrix_row$macrocall$2", "lparen", "_", "add_matrix_row$macrocall$3", "_", "rparen"], "postprocess": ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL })},
    {"name": "add_matrix_row", "symbols": ["add_matrix_row$macrocall$1"], "postprocess": (details) => ({ type: "add_matrix_row", target: "value", ...id(details) })},
    {"name": "add_matrix_column$macrocall$2", "symbols": [{"literal":"addColumn"}]},
    {"name": "add_matrix_column$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["nullT"]},
    {"name": "add_matrix_column$macrocall$3$ebnf$1$subexpression$1$subexpression$1", "symbols": ["number"]},
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
    {"name": "w_list$macrocall$2", "symbols": ["word"], "postprocess": id},
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
    {"name": "nns_mlist$macrocall$1$macrocall$2", "symbols": ["nns_mlist$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": []},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1", "symbols": ["nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "comma", "nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "nns_mlist$macrocall$1$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nns_mlist$macrocall$1$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$macrocall$1$ebnf$1", "nns_mlist$macrocall$1$macrocall$2", "nns_mlist$macrocall$1$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$macrocall$1$ebnf$3", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nns_mlist$macrocall$1$ebnf$2", "symbols": []},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$2", "symbols": ["nns_mlist$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "symbols": []},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1", "symbols": ["nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "comma", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$2"]},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "symbols": ["nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$1", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$2", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$3", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nns_mlist$macrocall$1$ebnf$2$subexpression$1", "symbols": ["nns_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "comma", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1"]},
    {"name": "nns_mlist$macrocall$1$ebnf$2", "symbols": ["nns_mlist$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_mlist$macrocall$1$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "nns_mlist$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nns_mlist$macrocall$1", "symbols": ["lbrac", "nns_mlist$macrocall$1$ebnf$1", "nns_mlist$macrocall$1$macrocall$1", "nns_mlist$macrocall$1$ebnf$2", "nns_mlist$macrocall$1$ebnf$3", "rbrac"], "postprocess":  ([, , first, rest]) => {
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
    {"name": "nnsp_mlist$macrocall$1$macrocall$2", "symbols": ["nnsp_mlist$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": []},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1", "symbols": ["nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "comma", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "nnsp_mlist$macrocall$1$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2", "symbols": ["nnsp_mlist$macrocall$1$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$1", "nnsp_mlist$macrocall$1$macrocall$2", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$macrocall$1$ebnf$3", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nnsp_mlist$macrocall$1$ebnf$2", "symbols": []},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$2", "symbols": ["nnsp_mlist$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "symbols": []},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1", "symbols": ["nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "comma", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$2"]},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "symbols": ["nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$1", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$2", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1$ebnf$3", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const row = [first[0]];
            if (rest) {
                rest.forEach(([, , , item]) => row.push(item[0]));
            }
            return row;
        } },
    {"name": "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1", "symbols": ["nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$1", "comma", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1$macrocall$1"]},
    {"name": "nnsp_mlist$macrocall$1$ebnf$2", "symbols": ["nnsp_mlist$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "nnsp_mlist$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "nnsp_mlist$macrocall$1", "symbols": ["lbrac", "nnsp_mlist$macrocall$1$ebnf$1", "nnsp_mlist$macrocall$1$macrocall$1", "nnsp_mlist$macrocall$1$ebnf$2", "nnsp_mlist$macrocall$1$ebnf$3", "rbrac"], "postprocess":  ([, , first, rest]) => {
            const rows = [first];
            if (rest) {
                rest.forEach(([, , , row]) => rows.push(row));
            }
            return rows;
        } },
    {"name": "nnsp_mlist", "symbols": ["nnsp_mlist$macrocall$1"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([value]) => Number(value.value)},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([value]) => value.value},
    {"name": "boolean", "symbols": [(lexer.has("boolean") ? {type: "boolean"} : boolean)], "postprocess": ([value]) => value.value},
    {"name": "edge", "symbols": ["wordL", (lexer.has("dash") ? {type: "dash"} : dash), "wordL"], "postprocess": ([start, , end]) => ({ start: start.name, end: end.name })},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([value]) => value.value},
    {"name": "wordL", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([value]) => ({name: value.value, line: value.line, col: value.col})},
    {"name": "nullT", "symbols": [(lexer.has("nullT") ? {type: "nullT"} : nullT)], "postprocess": () => null},
    {"name": "pass", "symbols": [(lexer.has("pass") ? {type: "pass"} : pass)], "postprocess": () => "_"},
    {"name": "layout", "symbols": ["number", (lexer.has("x") ? {type: "x"} : x), "number"], "postprocess": ([a, , b]) => [a, b]},
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
    {"name": "comma_nlow$subexpression$1", "symbols": ["nlw"]},
    {"name": "comma_nlow", "symbols": ["comma_nlow$subexpression$1"], "postprocess": () => null},
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
