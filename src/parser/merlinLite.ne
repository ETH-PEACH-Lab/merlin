##################
# --- MACROS --- #
##################

# definition[X, Y] -> $X __ word _ equals _ bracketlist[$Y] _ {% ([type, , name, , , , body]) => ({ ...getDef(type), name, body: body }) %}
definition[X, Y] -> $X __ word _ equals _ bracketlist[$Y] _ {% ([type, , word, , , , body]) => ({ ...getDef(type), body: body, ...word }) %}

# bracketlist: One-per-line definition,
# e.g. catch all, be lenient with whitespace
# {
#   value: [1, 2, 3]
#   name: "something"
# }
bracketlist[X] -> lbracket nlow $X (comma_nlow $X):* nlow:? rbracket {% d => {
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
} %}

# Multiple consecutive definitions, one per line
one_per_line[X] -> nlw:* $X nlw:* (nlw:+ $X nlw:* _):* {% ([, first, ,rest]) => {
    const firstValue = first[0];
    const restValues = rest.map(([, value]) => value[0]);
    // Remove nulls (comments) from the result
    return [firstValue, ...restValues].filter(x => x !== null && x !== undefined);
} %}

# Key-value pairs, e.g. key: value
pair[X, Y] -> $X colon _ $Y {% ([key, , , value]) => ({ [key]: id(value) }) %}

# Tuple, e.g. 1, 2
tuple[X, Y] -> $X _ comma _ $Y {% ([x, , , , y]) => ({ index: x, value: y }) %}

# Lists, e.g. [1, 2, 3]
list[X] -> lbrac list_content[$X] rbrac {% ([, content]) => content.flat() %}
list_content[X] -> trim[$X] next_list_item[$X]:* {% (([first, rest]) => [...first, ...rest.flat()]) %}
next_list_item[X] -> comma trim[$X] {% ([, value]) => id(value) %}

# Commands
cmd[X, Y] -> word dot $X lparen _ $Y _ rparen {% ([word, dot, , , , args], _, reject) => ({ args: id(args), ...word }) %}

# Ignore surrounding whitespace
trim[X] -> _ $X _ {% ([, value, ]) => value[0] %}

#################
# --- LEXER --- #
#################
@{%
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

let symbolTable = {};
console.log("Symbol table initialized.");

const iid = ([el]) => id(el);

const getDef = ([el]) => { 
  return {
    class: el.type,
    type: el.value,
    line: el.line,
    col: el.col,
  };
}
%}

###################
# --- GRAMMAR --- #
###################
# Pass your lexer object using the @lexer option:
@lexer lexer

root -> one_per_line[definition] one_per_line[commands] {% ([defs, cmds]) => ({ defs: defs.flat(), cmds: cmds.flat() }) %}

# - DEFINITIONS - #
# List of all definitions
definition -> (comment 
            | array_def
) {% iid %}

# Array Definition
array_def -> definition["array", array_pair] {% id %}
array_pair -> (
              pair["color", nns_list] 
            | pair["value", nns_list]
            | pair["arrow", nns_list]
) {% iid %}


# - COMMANDS - #
# List of all commands
commands -> (comment
          | set_value 
          | page 
          | show
          | hide
          | set_color
          | set_arrow
) {% iid %}

# Set a value in an array
set_value -> cmd["setValue", tuple[number, number]] {% (details) => ({ type: "set", target: "value", ...id(details) }) %}
set_color -> cmd["setColor", tuple[number, string]] {% (details) => ({ type: "set", target: "color", ...id(details) }) %}
set_arrow -> cmd["setArrow", tuple[number, (string | nullT) {% iid %}]] {% (details) => ({ type: "set", target: "arrow", ...id(details) }) %}

# Set multiple values in an array
# Example: arr1.setValue([2,_,4,_,_,_,_])
set_value -> cmd["setValues", list[(number | nullT | pass) {% iid %}]] {% (details) => ({ type: "set_multiple", target: "value", ...id(details) }) %}
set_color -> cmd["setColors", list[(string | nullT | pass) {% iid %}]] {% (details) => ({ type: "set_multiple", target: "color", ...id(details) }) %}
set_arrow -> cmd["setArrows", list[(string | nullT | pass) {% iid %}]] {% (details) => ({ type: "set_multiple", target: "arrow", ...id(details) }) %}

page -> "page" {% () => ({ type: "page" }) %}

show -> "show" _ word {% ([, , word]) => ({ type: "show", value: word.name, line: word.line, col: word.col }) %}

hide -> "hide" _ word {% ([, , word]) => ({ type: "hide", value: word.name, line: word.line, col: word.col }) %}

# - Lists - #
nns_list -> list[(nullT | number | string) {% iid %}] {% id %} # Accepts null, number, or string

# - Literals - #
number -> %number {% ([value]) => parseInt(value.value, 10) %}
string -> %string {% ([value]) => value.value %}
word -> %word {% ([value]) => ({name: value.value, line: value.line, col: value.col}) %}
nullT -> %nullT {% () => null %}
pass -> %pass {% () => "_" %}

# Whitespace and newlines
_ -> %ws:? {% () => null %}
__ -> %ws {% () => null %}
nlw -> %nlw {% () => null %}
nlow -> (%nlw | %ws) {% () => null %}
comma_nlow -> ((nlow:? comma nlow:?) | nlw) {% () => null %}

# - Tokens - # 
# Note: Return null to save memory
comment -> %comment {% () => null %}
lbracket -> %lbracket {% () => null %}
rbracket -> %rbracket {% () => null %}
lbrac -> %lbrac {% () => null %}
rbrac -> %rbrac {% () => null %}
lparen -> %lparen {% () => null %}
rparen -> %rparen {% () => null %}
comma -> %comma {% () => null %}
dot -> %dot {% () => null %}
colon -> %colon {% () => null %}
equals -> %equals {% () => null %}