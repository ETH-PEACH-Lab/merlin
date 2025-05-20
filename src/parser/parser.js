// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
  nlw: { match: /[ \t]*\n[ \t]*/, lineBreaks: true },
  ws:     /[ \t]+/,
  nullT: { match: /null/, value: () => null },
  number: /[0-9]+/,
  def: ["array", "matrix", "graph"],
  string: { match: /"(?:\\.|[^"\\])*"/, value: s => s.slice(1, -1) },
  times:  /\*/,
  lbracket: "{",
  rbracket: "}",
  lbrac: "[",
  rbrac: "]",
  lparen: "(",
  rparen: ")",
  colon: ":",
  comma: ",",
  dot: ".",
  equals: "=",
  pass: "_",
  word:  /[a-zA-Z_][a-zA-Z0-9_]*/,
  comment: { match: /\/\/.*?$/, lineBreaks: true },
});

const symbolTable = {};

const iid = ([el]) => id(el);

const getDef = ([el]) => { 
  return {
    class: el.type,
    type: el.value,
  };
}
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "root$macrocall$2", "symbols": ["definition"]},
    {"name": "root$macrocall$1$ebnf$1", "symbols": []},
    {"name": "root$macrocall$1$ebnf$1", "symbols": ["root$macrocall$1$ebnf$1", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$1$ebnf$2", "symbols": []},
    {"name": "root$macrocall$1$ebnf$2", "symbols": ["root$macrocall$1$ebnf$2", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$1$ebnf$3", "symbols": []},
    {"name": "root$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlw"]},
    {"name": "root$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "symbols": ["root$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": []},
    {"name": "root$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "symbols": ["root$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$1$ebnf$3$subexpression$1", "symbols": ["root$macrocall$1$ebnf$3$subexpression$1$ebnf$1", "root$macrocall$2", "root$macrocall$1$ebnf$3$subexpression$1$ebnf$2", "_"]},
    {"name": "root$macrocall$1$ebnf$3", "symbols": ["root$macrocall$1$ebnf$3", "root$macrocall$1$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$1", "symbols": ["root$macrocall$1$ebnf$1", "root$macrocall$2", "root$macrocall$1$ebnf$2", "root$macrocall$1$ebnf$3"], "postprocess":  ([, first, ,rest]) => {
            const firstValue = first[0];
            const restValues = rest.map(([, value]) => value[0]);
            // Remove nulls (comments) from the result
            return [firstValue, ...restValues].filter(x => x !== null && x !== undefined);
        } },
    {"name": "root$macrocall$4", "symbols": ["commands"]},
    {"name": "root$macrocall$3$ebnf$1", "symbols": []},
    {"name": "root$macrocall$3$ebnf$1", "symbols": ["root$macrocall$3$ebnf$1", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$3$ebnf$2", "symbols": []},
    {"name": "root$macrocall$3$ebnf$2", "symbols": ["root$macrocall$3$ebnf$2", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$3$ebnf$3", "symbols": []},
    {"name": "root$macrocall$3$ebnf$3$subexpression$1$ebnf$1", "symbols": ["nlw"]},
    {"name": "root$macrocall$3$ebnf$3$subexpression$1$ebnf$1", "symbols": ["root$macrocall$3$ebnf$3$subexpression$1$ebnf$1", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$3$ebnf$3$subexpression$1$ebnf$2", "symbols": []},
    {"name": "root$macrocall$3$ebnf$3$subexpression$1$ebnf$2", "symbols": ["root$macrocall$3$ebnf$3$subexpression$1$ebnf$2", "nlw"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$3$ebnf$3$subexpression$1", "symbols": ["root$macrocall$3$ebnf$3$subexpression$1$ebnf$1", "root$macrocall$4", "root$macrocall$3$ebnf$3$subexpression$1$ebnf$2", "_"]},
    {"name": "root$macrocall$3$ebnf$3", "symbols": ["root$macrocall$3$ebnf$3", "root$macrocall$3$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "root$macrocall$3", "symbols": ["root$macrocall$3$ebnf$1", "root$macrocall$4", "root$macrocall$3$ebnf$2", "root$macrocall$3$ebnf$3"], "postprocess":  ([, first, ,rest]) => {
            const firstValue = first[0];
            const restValues = rest.map(([, value]) => value[0]);
            // Remove nulls (comments) from the result
            return [firstValue, ...restValues].filter(x => x !== null && x !== undefined);
        } },
    {"name": "root", "symbols": ["root$macrocall$1", "root$macrocall$3"], "postprocess": ([defs, cmds]) => ({ defs: defs.flat(), cmds: cmds.flat() })},
    {"name": "definition$subexpression$1", "symbols": ["comment"]},
    {"name": "definition$subexpression$1", "symbols": ["array_def"]},
    {"name": "definition", "symbols": ["definition$subexpression$1"], "postprocess": iid},
    {"name": "array_def$macrocall$2", "symbols": [{"literal":"array"}]},
    {"name": "array_def$macrocall$3", "symbols": ["array_pairs"]},
    {"name": "array_def$macrocall$1$macrocall$2", "symbols": ["array_def$macrocall$3"]},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$2", "symbols": []},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$2$subexpression$1", "symbols": ["comma_nlow", "array_def$macrocall$1$macrocall$2"]},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$2", "symbols": ["array_def$macrocall$1$macrocall$1$ebnf$2", "array_def$macrocall$1$macrocall$1$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "array_def$macrocall$1$macrocall$1$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "array_def$macrocall$1$macrocall$1", "symbols": ["lbracket", "array_def$macrocall$1$macrocall$1$ebnf$1", "array_def$macrocall$1$macrocall$2", "array_def$macrocall$1$macrocall$1$ebnf$2", "array_def$macrocall$1$macrocall$1$ebnf$3", "rbracket"], "postprocess":  d => {
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
    {"name": "array_def$macrocall$1", "symbols": ["array_def$macrocall$2", "__", "word", "_", "equals", "_", "array_def$macrocall$1$macrocall$1", "_"], "postprocess":  ([type, , name, , , , body]) => {
            const def = { ...getDef(type), name, body: body };
            // If already defined, throw an error
            //console.log("symbolTable", symbolTable);
            
            symbolTable[name] = def;
            return def;
        } },
    {"name": "array_def", "symbols": ["array_def$macrocall$1"], "postprocess": id},
    {"name": "array_pairs$subexpression$1$macrocall$2", "symbols": [{"literal":"color"}]},
    {"name": "array_pairs$subexpression$1$macrocall$3", "symbols": ["nns_list"]},
    {"name": "array_pairs$subexpression$1$macrocall$1", "symbols": ["array_pairs$subexpression$1$macrocall$2", "colon", "_", "array_pairs$subexpression$1$macrocall$3"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pairs$subexpression$1", "symbols": ["array_pairs$subexpression$1$macrocall$1"]},
    {"name": "array_pairs$subexpression$1$macrocall$5", "symbols": [{"literal":"value"}]},
    {"name": "array_pairs$subexpression$1$macrocall$6", "symbols": ["nns_list"]},
    {"name": "array_pairs$subexpression$1$macrocall$4", "symbols": ["array_pairs$subexpression$1$macrocall$5", "colon", "_", "array_pairs$subexpression$1$macrocall$6"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pairs$subexpression$1", "symbols": ["array_pairs$subexpression$1$macrocall$4"]},
    {"name": "array_pairs$subexpression$1$macrocall$8", "symbols": [{"literal":"arrow"}]},
    {"name": "array_pairs$subexpression$1$macrocall$9", "symbols": ["nns_list"]},
    {"name": "array_pairs$subexpression$1$macrocall$7", "symbols": ["array_pairs$subexpression$1$macrocall$8", "colon", "_", "array_pairs$subexpression$1$macrocall$9"], "postprocess": ([key, , , value]) => ({ [key]: id(value) })},
    {"name": "array_pairs$subexpression$1", "symbols": ["array_pairs$subexpression$1$macrocall$7"]},
    {"name": "array_pairs", "symbols": ["array_pairs$subexpression$1"], "postprocess": iid},
    {"name": "commands$subexpression$1", "symbols": ["comment"]},
    {"name": "commands$subexpression$1", "symbols": ["set_value"]},
    {"name": "commands$subexpression$1", "symbols": ["page"]},
    {"name": "commands$subexpression$1", "symbols": ["show"]},
    {"name": "commands$subexpression$1", "symbols": ["hide"]},
    {"name": "commands$subexpression$1", "symbols": ["set_color"]},
    {"name": "commands$subexpression$1", "symbols": ["set_arrow"]},
    {"name": "commands", "symbols": ["commands$subexpression$1"], "postprocess": iid},
    {"name": "set_value$macrocall$2", "symbols": [{"literal":"setValue"}]},
    {"name": "set_value$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "set_value$macrocall$3$macrocall$3", "symbols": ["number"]},
    {"name": "set_value$macrocall$3$macrocall$1", "symbols": ["set_value$macrocall$3$macrocall$2", "_", "comma", "_", "set_value$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: x, value: y })},
    {"name": "set_value$macrocall$3", "symbols": ["set_value$macrocall$3$macrocall$1"]},
    {"name": "set_value$macrocall$1", "symbols": ["word", "dot", "set_value$macrocall$2", "lparen", "_", "set_value$macrocall$3", "_", "rparen"], "postprocess":  ([name, , , , , args], _, reject) => {
            const command = { name, args: id(args) };
            // Check if the command is valid
            if (symbolTable[name]) {
                return command;
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "set_value", "symbols": ["set_value$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "value", ...id(details) })},
    {"name": "set_color$macrocall$2", "symbols": [{"literal":"setColor"}]},
    {"name": "set_color$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "set_color$macrocall$3$macrocall$3", "symbols": ["string"]},
    {"name": "set_color$macrocall$3$macrocall$1", "symbols": ["set_color$macrocall$3$macrocall$2", "_", "comma", "_", "set_color$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: x, value: y })},
    {"name": "set_color$macrocall$3", "symbols": ["set_color$macrocall$3$macrocall$1"]},
    {"name": "set_color$macrocall$1", "symbols": ["word", "dot", "set_color$macrocall$2", "lparen", "_", "set_color$macrocall$3", "_", "rparen"], "postprocess":  ([name, , , , , args], _, reject) => {
            const command = { name, args: id(args) };
            // Check if the command is valid
            if (symbolTable[name]) {
                return command;
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "set_color", "symbols": ["set_color$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "color", ...id(details) })},
    {"name": "set_arrow$macrocall$2", "symbols": [{"literal":"setArrow"}]},
    {"name": "set_arrow$macrocall$3$macrocall$2", "symbols": ["number"]},
    {"name": "set_arrow$macrocall$3$macrocall$3$subexpression$1", "symbols": ["string"]},
    {"name": "set_arrow$macrocall$3$macrocall$3$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_arrow$macrocall$3$macrocall$3", "symbols": ["set_arrow$macrocall$3$macrocall$3$subexpression$1"], "postprocess": iid},
    {"name": "set_arrow$macrocall$3$macrocall$1", "symbols": ["set_arrow$macrocall$3$macrocall$2", "_", "comma", "_", "set_arrow$macrocall$3$macrocall$3"], "postprocess": ([x, , , , y]) => ({ index: x, value: y })},
    {"name": "set_arrow$macrocall$3", "symbols": ["set_arrow$macrocall$3$macrocall$1"]},
    {"name": "set_arrow$macrocall$1", "symbols": ["word", "dot", "set_arrow$macrocall$2", "lparen", "_", "set_arrow$macrocall$3", "_", "rparen"], "postprocess":  ([name, , , , , args], _, reject) => {
            const command = { name, args: id(args) };
            // Check if the command is valid
            if (symbolTable[name]) {
                return command;
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "set_arrow", "symbols": ["set_arrow$macrocall$1"], "postprocess": (details) => ({ type: "set", target: "arrow", ...id(details) })},
    {"name": "set_value$macrocall$5", "symbols": [{"literal":"setValues"}]},
    {"name": "set_value$macrocall$6$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "set_value$macrocall$6$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_value$macrocall$6$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_value$macrocall$6$macrocall$2", "symbols": ["set_value$macrocall$6$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$2", "symbols": ["set_value$macrocall$6$macrocall$2"]},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_value$macrocall$6$macrocall$1$macrocall$2"]},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_value$macrocall$6$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_value$macrocall$6$macrocall$1$macrocall$2"]},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_value$macrocall$6$macrocall$1$macrocall$1", "symbols": ["set_value$macrocall$6$macrocall$1$macrocall$1$macrocall$1", "set_value$macrocall$6$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_value$macrocall$6$macrocall$1", "symbols": ["lbrac", "set_value$macrocall$6$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_value$macrocall$6", "symbols": ["set_value$macrocall$6$macrocall$1"]},
    {"name": "set_value$macrocall$4", "symbols": ["word", "dot", "set_value$macrocall$5", "lparen", "_", "set_value$macrocall$6", "_", "rparen"], "postprocess":  ([name, , , , , args], _, reject) => {
            const command = { name, args: id(args) };
            // Check if the command is valid
            if (symbolTable[name]) {
                return command;
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "set_value", "symbols": ["set_value$macrocall$4"], "postprocess": (details) => ({ type: "set_multiple", target: "value", ...id(details) })},
    {"name": "set_color$macrocall$5", "symbols": [{"literal":"setColors"}]},
    {"name": "set_color$macrocall$6$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_color$macrocall$6$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_color$macrocall$6$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_color$macrocall$6$macrocall$2", "symbols": ["set_color$macrocall$6$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$2", "symbols": ["set_color$macrocall$6$macrocall$2"]},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_color$macrocall$6$macrocall$1$macrocall$2"]},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_color$macrocall$6$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_color$macrocall$6$macrocall$1$macrocall$2"]},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_color$macrocall$6$macrocall$1$macrocall$1", "symbols": ["set_color$macrocall$6$macrocall$1$macrocall$1$macrocall$1", "set_color$macrocall$6$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_color$macrocall$6$macrocall$1", "symbols": ["lbrac", "set_color$macrocall$6$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_color$macrocall$6", "symbols": ["set_color$macrocall$6$macrocall$1"]},
    {"name": "set_color$macrocall$4", "symbols": ["word", "dot", "set_color$macrocall$5", "lparen", "_", "set_color$macrocall$6", "_", "rparen"], "postprocess":  ([name, , , , , args], _, reject) => {
            const command = { name, args: id(args) };
            // Check if the command is valid
            if (symbolTable[name]) {
                return command;
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "set_color", "symbols": ["set_color$macrocall$4"], "postprocess": (details) => ({ type: "set_multiple", target: "color", ...id(details) })},
    {"name": "set_arrow$macrocall$5", "symbols": [{"literal":"setArrows"}]},
    {"name": "set_arrow$macrocall$6$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "set_arrow$macrocall$6$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "set_arrow$macrocall$6$macrocall$2$subexpression$1", "symbols": ["pass"]},
    {"name": "set_arrow$macrocall$6$macrocall$2", "symbols": ["set_arrow$macrocall$6$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$2", "symbols": ["set_arrow$macrocall$6$macrocall$2"]},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$macrocall$2", "symbols": ["set_arrow$macrocall$6$macrocall$1$macrocall$2"]},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "set_arrow$macrocall$6$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["set_arrow$macrocall$6$macrocall$1$macrocall$2"]},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "symbols": ["set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1", "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "set_arrow$macrocall$6$macrocall$1$macrocall$1", "symbols": ["set_arrow$macrocall$6$macrocall$1$macrocall$1$macrocall$1", "set_arrow$macrocall$6$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "set_arrow$macrocall$6$macrocall$1", "symbols": ["lbrac", "set_arrow$macrocall$6$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "set_arrow$macrocall$6", "symbols": ["set_arrow$macrocall$6$macrocall$1"]},
    {"name": "set_arrow$macrocall$4", "symbols": ["word", "dot", "set_arrow$macrocall$5", "lparen", "_", "set_arrow$macrocall$6", "_", "rparen"], "postprocess":  ([name, , , , , args], _, reject) => {
            const command = { name, args: id(args) };
            // Check if the command is valid
            if (symbolTable[name]) {
                return command;
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "set_arrow", "symbols": ["set_arrow$macrocall$4"], "postprocess": (details) => ({ type: "set_multiple", target: "arrow", ...id(details) })},
    {"name": "page", "symbols": [{"literal":"page"}], "postprocess": () => ({ type: "page" })},
    {"name": "show", "symbols": [{"literal":"show"}, "_", "word"], "postprocess":  ([, , name]) => {
            // Check if the command is valid
            if (symbolTable[name]) {
                return { type: "show", value: name };
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "hide", "symbols": [{"literal":"hide"}, "_", "word"], "postprocess":  ([, , name]) => {
            // Check if the command is valid
            if (symbolTable[name]) {
                return { type: "hide", value: name };
            } else {
                throw new Error(`Command "${name}" is not defined.`);
            }
        } },
    {"name": "nns_list$macrocall$2$subexpression$1", "symbols": ["nullT"]},
    {"name": "nns_list$macrocall$2$subexpression$1", "symbols": ["number"]},
    {"name": "nns_list$macrocall$2$subexpression$1", "symbols": ["string"]},
    {"name": "nns_list$macrocall$2", "symbols": ["nns_list$macrocall$2$subexpression$1"], "postprocess": iid},
    {"name": "nns_list$macrocall$1$macrocall$2", "symbols": ["nns_list$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$macrocall$2", "symbols": ["nns_list$macrocall$1$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$macrocall$1", "symbols": ["_", "nns_list$macrocall$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2", "symbols": ["nns_list$macrocall$1$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "symbols": ["nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$2"]},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1", "symbols": ["_", "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$2", "_"], "postprocess": ([, value, ]) => value[0]},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1", "symbols": ["comma", "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1$macrocall$1"], "postprocess": ([, value]) => id(value)},
    {"name": "nns_list$macrocall$1$macrocall$1$ebnf$1", "symbols": ["nns_list$macrocall$1$macrocall$1$ebnf$1", "nns_list$macrocall$1$macrocall$1$ebnf$1$macrocall$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "nns_list$macrocall$1$macrocall$1", "symbols": ["nns_list$macrocall$1$macrocall$1$macrocall$1", "nns_list$macrocall$1$macrocall$1$ebnf$1"], "postprocess": (([first, rest]) => [...first, ...rest.flat()])},
    {"name": "nns_list$macrocall$1", "symbols": ["lbrac", "nns_list$macrocall$1$macrocall$1", "rbrac"], "postprocess": ([, content]) => content.flat()},
    {"name": "nns_list", "symbols": ["nns_list$macrocall$1"], "postprocess": id},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": ([value]) => parseInt(value.value, 10)},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": ([value]) => value.value},
    {"name": "word", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": ([value]) => value.value},
    {"name": "nullT", "symbols": [(lexer.has("nullT") ? {type: "nullT"} : nullT)], "postprocess": () => null},
    {"name": "pass", "symbols": [(lexer.has("pass") ? {type: "pass"} : pass)], "postprocess": () => "_"},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": () => null},
    {"name": "nlw", "symbols": [(lexer.has("nlw") ? {type: "nlw"} : nlw)], "postprocess": () => null},
    {"name": "nlow$subexpression$1", "symbols": [(lexer.has("nlw") ? {type: "nlw"} : nlw)]},
    {"name": "nlow$subexpression$1", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "nlow", "symbols": ["nlow$subexpression$1"], "postprocess": () => null},
    {"name": "comma_nlow$ebnf$1", "symbols": ["nlow"], "postprocess": id},
    {"name": "comma_nlow$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comma_nlow$ebnf$2", "symbols": ["comma"], "postprocess": id},
    {"name": "comma_nlow$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comma_nlow$ebnf$3", "symbols": ["nlow"], "postprocess": id},
    {"name": "comma_nlow$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "comma_nlow", "symbols": ["comma_nlow$ebnf$1", "comma_nlow$ebnf$2", "comma_nlow$ebnf$3"], "postprocess": () => null},
    {"name": "comment", "symbols": [(lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": () => null},
    {"name": "lbracket", "symbols": [(lexer.has("lbracket") ? {type: "lbracket"} : lbracket)], "postprocess": () => null},
    {"name": "rbracket", "symbols": [(lexer.has("rbracket") ? {type: "rbracket"} : rbracket)], "postprocess": () => null},
    {"name": "lbrac", "symbols": [(lexer.has("lbrac") ? {type: "lbrac"} : lbrac)], "postprocess": () => null},
    {"name": "rbrac", "symbols": [(lexer.has("rbrac") ? {type: "rbrac"} : rbrac)], "postprocess": () => null},
    {"name": "lparen", "symbols": [(lexer.has("lparen") ? {type: "lparen"} : lparen)], "postprocess": () => null},
    {"name": "rparen", "symbols": [(lexer.has("rparen") ? {type: "rparen"} : rparen)], "postprocess": () => null},
    {"name": "comma", "symbols": [(lexer.has("comma") ? {type: "comma"} : comma)], "postprocess": () => null},
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
