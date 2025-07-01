# Merlin Lite Parser
# From this file, we can generate the parser.js file

##################
# --- MACROS --- #
##################

# definition[X, Y] -> $X __ wordL _ equals _ bracketlist[$Y] _ {% ([type, , name, , , , body]) => ({ ...getDef(type), name, body: body }) %}
definition[X, Y] -> $X __ wordL _ equals _ bracketlist[$Y] _ {% ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL }) %}

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
one_per_line[X] -> $X (nlw:+ $X):* {% ([first, rest]) => {
    const firstValue = first[0];
    const restValues = rest.map(([, value]) => value[0]);
    // Include all items, even comments
    return [firstValue, ...restValues];
} %}

# Key-value pairs, e.g. key: value
pair[X, Y] -> $X colon _ $Y {% ([key, , , value]) => ({ [key]: id(value) }) %}

# Comma Separated, e.g. 1, 2
comma_sep[X, Y] -> $X _ comma _ $Y {% ([x, , , , y]) => ({ index: id(x), value: id(y) }) %}

# Tuples, e.g. (1, 2)
tuple[X, Y] -> lparen _ $X _ comma _ $Y _ rparen {% ([, , x, , , , y, ]) => [x[0], y[0]] %}

# Lists, e.g. [1, 2, 3]
list[X] -> lbrac list_content[$X] rbrac {% ([, content]) => content.flat() %}
list_content[X] -> trim[$X] next_list_item[$X]:* {% (([first, rest]) => [...first, ...rest.flat()]) %}
next_list_item[X] -> comma trim[$X] {% ([, value]) => id(value) %}

# 2D Lists for matrices, e.g. [[1, 2], [3, 4]] - do not flatten
matrix_2d_list[X] -> lbrac nlow:? matrix_row[$X] (nlow:? comma nlow:? matrix_row[$X]):* nlow:? rbrac {% ([, , first, rest]) => {
    const rows = [first];
    if (rest) {
        rest.forEach(([, , , row]) => rows.push(row));
    }
    return rows;
} %}
matrix_row[X] -> lbrac nlow:? $X (nlow:? comma nlow:? $X):* nlow:? rbrac {% ([, , first, rest]) => {
    const row = [first[0]];
    if (rest) {
        rest.forEach(([, , , item]) => row.push(item[0]));
    }
    return row;
} %}

# Commands
cmd[X, Y] -> wordL dot $X lparen _ $Y _ rparen {% ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL }) %}

# Matrix commands with 3 parameters (row, col, value)
matrix_cmd[X, Y] -> wordL dot $X lparen _ number _ comma _ number _ comma _ $Y _ rparen {% ([wordL, , , , , row, , , , col, , , , value]) => ({ args: { row: row, col: col, value: id(value) }, ...wordL }) %}

# Ignore surrounding whitespace
trim[X] -> _ $X _ {% ([, value, ]) => id(value) %}

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
%}

###################
# --- GRAMMAR --- #
###################
# Pass your lexer object using the @lexer option:
@lexer lexer

root -> nlw:* one_per_line[definition] nlw:+ one_per_line[commands] nlw:* {% ([, defs, , cmds]) => ({ defs: defs.flat(), cmds: cmds.flat() }) %}

# - DEFINITIONS - #
# List of all definitions
definition -> (comment 
            | array_def
            | matrix_def
            | linkedlist_def
            | tree_def
            | stack_def
            | graph_def
            | text_def
) {% iid %}

# Array Definition
array_def -> definition["array", array_pair] {% id %}
array_pair -> (
              pair["color", ns_list] 
            | pair["value", nns_list]
            | pair["arrow", nns_list]
            | pair["above", (string | word) {% id %}]
            | pair["below", (string | word) {% id %}]
            | pair["left", (string | word) {% id %}]
            | pair["right", (string | word) {% id %}]
) {% iid %}

# Matrix Definition
matrix_def -> definition["matrix", matrix_pair] {% id %}
matrix_pair -> (
              pair["value", nns_mlist]
            | pair["color", nns_mlist]
            | pair["arrow", nns_mlist]
            | pair["above", (string | word) {% id %}]
            | pair["below", (string | word) {% id %}]
            | pair["left", (string | word) {% id %}]
            | pair["right", (string | word) {% id %}]
) {% iid %}

# LinkedList Definition
linkedlist_def -> definition["linkedlist", linkedlist_pair] {% id %}
linkedlist_pair -> (
              pair["nodes", w_list]
            | pair["color", ns_list]
            | pair["value", nns_list]
            | pair["arrow", nns_list]
            | pair["above", (string | word) {% id %}]
            | pair["below", (string | word) {% id %}]
            | pair["left", (string | word) {% id %}]
            | pair["right", (string | word) {% id %}]
) {% iid %}

# Tree Definition
tree_def -> definition["tree", tree_pair] {% id %}
tree_pair -> (
              pair["nodes", w_list]
            | pair["color", ns_list]
            | pair["value", nns_list]
            | pair["arrow", nns_list]
            | pair["above", (string | word) {% id %}]
            | pair["below", (string | word) {% id %}]
            | pair["left", (string | word) {% id %}]
            | pair["right", (string | word) {% id %}]
) {% iid %}

# Stack Definition
stack_def -> definition["stack", stack_pair] {% id %}
stack_pair -> (
              pair["color", ns_list]
            | pair["value", nns_list]
            | pair["arrow", nns_list]
            | pair["above", (string | word) {% id %}]
            | pair["below", (string | word) {% id %}]
            | pair["left", (string | word) {% id %}]
            | pair["right", (string | word) {% id %}]
) {% iid %}

# Graph Definition
graph_def -> definition["graph", graph_pair] {% id %}
graph_pair -> (
              pair["nodes", w_list]
            | pair["color", ns_list]
            | pair["value", nns_list]
            | pair["arrow", nns_list]
            | pair["edges", e_list]
            | pair["hidden", b_list]
            | pair["above", (string | word) {% id %}]
            | pair["below", (string | word) {% id %}]
            | pair["left", (string | word) {% id %}]
            | pair["right", (string | word) {% id %}]
) {% iid %}

# Text Definition
text_def -> definition["text", text_pair] {% id %}
text_pair -> (
              pair["value", string]
) {% iid %}

# - COMMANDS - #
# List of all commands
commands -> (comment
          | page
          | show
          | hide
          | set_value
          | set_color
          | set_arrow
          | set_hidden
          | set_edges
          | set_matrix_value
          | set_matrix_color
          | set_matrix_values
          | set_matrix_colors
          | set_matrix_arrow
          | set_matrix_arrows
          | set_values_multiple
          | set_colors_multiple
          | set_arrows_multiple
          | set_hidden_multiple
          | add_value
          | add_node
          | add_edge
          | insert_value
          | insert_node
          | insert_edge
          | remove_value
          | remove_node
          | remove_edge
          | remove_at
          | set_text_value
) {% iid %}

# Main commands
page -> "page" (_ layout):? {% ([, layoutArg]) => ({ type: "page", layout: layoutArg ? layoutArg[1] : null }) %}

show -> "show" _ wordL (_ tuple[number, number]):? {% ([, , wordL, positionArg]) => ({ 
    type: "show", 
    value: wordL.name, 
    position: positionArg ? positionArg[1] : null,
    line: wordL.line, 
    col: wordL.col 
}) %}

hide -> "hide" _ wordL {% ([, , wordL]) => ({ type: "hide", value: wordL.name, line: wordL.line, col: wordL.col }) %}

# Set a value in an array
set_value -> cmd["setValue", comma_sep[number, (number | string | nullT) {% id %}]] {% (details) => ({ type: "set", target: "value", ...id(details) }) %}
set_color -> cmd["setColor", comma_sep[number, (string | nullT) {% id %}]] {% (details) => ({ type: "set", target: "color", ...id(details) }) %}
set_arrow -> cmd["setArrow", comma_sep[number, (number | string | nullT) {% id %}]] {% (details) => ({ type: "set", target: "arrow", ...id(details) }) %}
set_hidden -> cmd["setHidden", comma_sep[number, boolean]] {% (details) => ({ type: "set", target: "hidden", ...id(details) }) %}

# Set a value in a matrix
set_matrix_value -> matrix_cmd["setValue", (number | string | nullT) {% id %}] {% (details) => ({ type: "set_matrix", target: "value", ...id(details) }) %}
set_matrix_color -> matrix_cmd["setColor", (string | nullT) {% id %}] {% (details) => ({ type: "set_matrix", target: "color", ...id(details) }) %}
set_matrix_arrow -> matrix_cmd["setArrow", (number | string | nullT) {% id %}] {% (details) => ({ type: "set_matrix", target: "arrow", ...id(details) }) %}
set_edges -> cmd["setEdges", e_list] {% (details) => ({ type: "set_multiple", target: "edges", ...id(details) }) %}

# Set multiple values in an array
# Example: arr1.setValues([2,_,4,_,_,_,_])
set_values_multiple -> cmd["setValues", list[(number | string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "value", ...id(details) }) %}
set_colors_multiple -> cmd["setColors", list[(string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "color", ...id(details) }) %}
set_arrows_multiple -> cmd["setArrows", list[(number | string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "arrow", ...id(details) }) %}
set_hidden_multiple -> cmd["setHidden", list[(boolean | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "hidden", ...id(details) }) %}

# Set multiple values in a matrix
# Example: mat1.setValues([[1, 2], [3, 4]]) or mat1.setValues([[1, _], [_, 4]])
set_matrix_values -> cmd["setValues", nnsp_mlist] {% (details) => ({ type: "set_matrix_multiple", target: "value", ...id(details) }) %}
set_matrix_colors -> cmd["setColors", nnsp_mlist] {% (details) => ({ type: "set_matrix_multiple", target: "color", ...id(details) }) %}
set_matrix_arrows -> cmd["setArrows", nnsp_mlist] {% (details) => ({ type: "set_matrix_multiple", target: "arrow", ...id(details) }) %}

# Add functions
add_value -> cmd["addValue", (number | string | nullT) {% id %}] {% (details) => ({ type: "add", target: "value", ...id(details) }) %}
add_node -> cmd["addNode", (word | comma_sep[word, (number | string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "add", target: "nodes", ...id(details) }) %}
add_edge -> cmd["addEdge", edge] {% (details) => ({ type: "add", target: "edges", ...id(details) }) %}

# Insert functions
insert_value -> cmd["insertValue", comma_sep[number, (number | string | nullT) {% id %}]] {% (details) => ({ type: "insert", target: "value", ...id(details) }) %}
insert_node -> cmd["insertNode", comma_sep[number, word]] {% (details) => ({ type: "insert", target: "nodes", ...id(details) }) %}
insert_edge -> cmd["insertEdge", comma_sep[number, edge]] {% (details) => ({ type: "insert", target: "edges", ...id(details) }) %}

# Remove functions
remove_value -> cmd["removeValue", (number | string | nullT) {% id %}] {% (details) => ({ type: "remove", target: "value", ...id(details) }) %}
remove_node -> cmd["removeNode", word] {% (details) => ({ type: "remove", target: "nodes", ...id(details) }) %}
remove_edge -> cmd["removeEdge", edge] {% (details) => ({ type: "remove", target: "edges", ...id(details) }) %}
remove_at -> cmd["removeAt", number] {% (details) => ({ type: "remove_at", target: "all", ...id(details) }) %}

# Text commands
set_text_value -> cmd["setValue", string] {% (details) => ({ type: "set", target: "value", ...id(details) }) %}

# - Lists - #
nns_list -> list[(nullT | number | string) {% iid %}] {% id %} # Accepts null, number, or string
ns_list -> list[(nullT | string) {% iid %}] {% id %} # Accepts null or string
s_list -> list[string {% id %}] {% id %} # Accepts only strings
w_list -> list[word {% id %}] {% id %} # Accepts only words
e_list -> list[edge {% id %}] {% id %} # Accepts only edges
b_list -> list[boolean {% id %}] {% id %} # Accepts only booleans
nns_mlist -> matrix_2d_list[(nullT | number | string) {% iid %}] {% id %} # 2D array for matrix values, accepts null, number, or string
nnsp_mlist -> matrix_2d_list[(nullT | number | string | pass) {% iid %}] {% id %} # 2D array for matrix values, accepts null, number, string, or pass

# - Literals - #
number -> %number {% ([value]) => parseInt(value.value, 10) %}
string -> %string {% ([value]) => value.value %}
boolean -> %boolean {% ([value]) => value.value %}
edge -> wordL %dash wordL {% ([start, , end]) => ({ start: start.name, end: end.name }) %}
word -> %word {% ([value]) => value.value %}
wordL -> %word {% ([value]) => ({name: value.value, line: value.line, col: value.col}) %}
nullT -> %nullT {% () => null %}
pass -> %pass {% () => "_" %}
layout -> number %x number {% ([a, , b]) => [a, b] %}

# Whitespace and newlines
_ -> %ws:? {% () => null %}
__ -> %ws {% () => null %}
nlw -> %nlw {% () => null %}
nlow -> (%nlw | %ws) {% () => null %}
comma_nlow -> ((nlow:? comma nlow:?) | nlw) {% () => null %}

# - Tokens - # 
# Note: Return null to save memory
comment -> %comment {% ([value]) => ({ type: "comment", content: value.value, line: value.line, col: value.col }) %}
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