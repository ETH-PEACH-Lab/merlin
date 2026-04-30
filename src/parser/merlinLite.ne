# Merlin Lite Parser
# From this file, we can generate the parser.js file

##################
# --- MACROS --- #
##################

#definition[X, Y] -> $X __ wordL _ equals _ bracketlist[$Y] _ {% ([type, , name, , , , body]) => ({ ...getDef(type), name, body: body }) %}
definition[X, Y] -> $X __ wordL _ equals _ bracketlist[$Y] _ {% ([type, , wordL, , , , body]) => ({ ...getDef(type), body: body, ...wordL }) %}

# bracketlist: One-per-line definition,
# e.g. catch all, be lenient with whitespace
# {
#   value: [1, 2, 3]
#   name: "something"
# }
bracketlist[X] -> lbracket wsn ($X (comma_nlow $X):*):? wsn rbracket {% d => {
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

# Comma Separated, e.g. 1, 2, 3
comma_sep3[X, Y, Z] -> $X _ comma _ $Y _ comma _ $Z {% ([x, , , , y, , , , z]) => ({
  block: id(x),
  second: id(y),
  third: id(z)
}) %}

# Comma Separated, e.g. 1, 2, 3, 4
comma_sep4[A, B, C, D] -> $A _ comma _ $B _ comma _ $C _ comma _ $D {% ([a, , , , b, , , , c, , , , d]) => ({
  block: id(a),
  second: id(b),
  third: id(c),
  fourth: id(d)
}) %}


# Tuples, e.g. (1, 2)
tuple[X, Y] -> lparen _ $X _ comma _ $Y _ rparen {% ([, , x, , , , y, ]) => [x[0], y[0]] %}

# Tuples, e.g. (1,2,3,4)
tuple4[A, B, C, D] -> lparen _ $A _ comma _ $B _ comma _ $C _ comma _ $D _ rparen
  {% ([, , a, , , , b, , , , c, , , , d, ]) => [a[0], b[0], c[0], d[0]] %}

# Lists, e.g. [1, 2, 3]
list[X] -> lbrac nlow:? rbrac {% () => [] %}
    | lbrac list_content[$X] rbrac {% ([, content]) => content.flat() %}
list_content[X] -> trim[$X] next_list_item[$X]:* {% (([first, rest]) => [...first, ...rest.flat()]) %}
next_list_item[X] -> comma trim[$X] {% ([, value]) => id(value) %}

# 2D Lists for matrices, e.g. [[1, 2], [3, 4]] - do not flatten
matrix_2d_list[X] -> lbrac nlow:? rbrac {% () => [] %}
    | lbrac nlow:? matrix_row[$X] (nlow:? comma nlow:? matrix_row[$X]):* nlow:? rbrac {% ([, , first, rest]) => {
    const rows = [first];
    if (rest) {
        rest.forEach(([, , , row]) => rows.push(row));
    }
    return rows;
} %}
matrix_row[X] -> lbrac nlow:? rbrac {% () => [] %}
    | lbrac nlow:? $X (nlow:? comma nlow:? $X):* nlow:? rbrac {% ([, , first, rest]) => {
        const row = [first[0]];
        if (rest) {
            rest.forEach(([, , , item]) => row.push(item[0]));
        }
        return row;
    } %}

# Commands
cmd[X, Y] -> wordL dot $X lparen _ $Y _ rparen {% ([wordL, dot, , , , args]) => ({ args: id(args), ...wordL }) %}

# Chained commands for text object methods (e.g., object.below.setFontSize())
chained_cmd[X, Y] -> wordL dot ("above" | "below" | "left" | "right") dot $X lparen _ $Y _ rparen {% ([wordL, , placement, , , , , args]) => ({ args: id(args), placement: placement, ...wordL }) %}

# Matrix commands with 3 parameters (row, col, value)
triple_cmd[X, Y] -> wordL dot $X lparen _ number _ comma _ number _ comma _ $Y _ rparen {% ([wordL, , , , , row, , , , col, , , , value]) => ({ args: { row: row, col: col, value: id(value) }, ...wordL }) %}

# Ignore surrounding whitespace
trim[X] -> _ $X _ {% ([, value, ]) => id(value) %}

#################
# --- LEXER --- #
#################
@{%
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
%}

###################
# --- GRAMMAR --- #
###################
# Pass your lexer object using the @lexer option:
@lexer lexer

root -> nlw:* one_per_line[definition_or_command]:? nlw:* {% ([, items]) => {
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
} %}

# - DEFINITIONS - #
# List of all definitions
definition -> (array_def
            | architecture_def
            | neuralNetwork_def
            | matrix_def
            | linkedlist_def
            | tree_def
            | stack_def
            | graph_def
            | text_def
) {% iid %}

# Mixed definitions and commands
definition_or_command -> (definition | commands) {% iid %}

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


# Block Definition
architecture_def -> definition["architecture", architecture_pair] {% id %}

architecture_pair -> (
              pair["title", (string | word) {% id %}]
            | architecture_block
            | architecture_diagram
            | pair["above", (string | word) {% id %}]
            | pair["below", (string | word) {% id %}]
            | pair["left", (string | word) {% id %}]
            | pair["right", (string | word) {% id %}]
) {% iid %}


architecture_block -> "block" __ wordL _ colon _ block_body {% ([, , name , , , , body]) => ({
    blocks: [{id: name, ...body}]
}) %}

architecture_diagram -> "diagram" _ colon _ diagram_body {% ([ , , , , body]) => ({
    diagram: body

})%}

block_body -> lbrac wsn (block_entry (comma_nlow_new_arch block_entry):*):? wsn rbrac {% ([ , ,items, , ]) => {
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
} %}


block_entry -> (
              pair["layout", layout_literal] 
            | pair["gap", number] 
            | pair["size", size_tuple]
            | pair["color", (string | nullT)]
            | pair["shape", block_group_shape_literal]
            | stroke_property
            | block_annotation
            | annotation_property
            | block_font_subfield
            | block_nodes
            | block_edges
            | block_groups
) {% iid %}

block_font_subfield -> 
      "fontFamily" colon _ (string | nullT) {% ([ , , , x]) => ({ fontFamily: x }) %}
    | "fontSize" colon _ number {% ([ , , , x]) => ({ fontSize: x }) %}
    | "fontWeight" colon _ numberL {% ([ , , , x]) => ({ fontWeight: x }) %}
    | "fontStyle" colon _ font_style_literal {% ([ , , , x]) => ({ fontStyle: x }) %}
    | "fontColor" colon _ (string | nullT) {% ([ , , , x]) => ({ fontColor: x }) %}

stroke_property -> "stroke" dot stroke_subfield {% ([ , , sub]) => sub %}

stroke_subfield -> 
      "color" colon _ (string | nullT) {% ([ , , , x]) => ({ strokeColor: x }) %}
    | "style" colon _ stroke_style_literal {% ([ , , , x]) => ({ strokeStyle: x }) %}
    | "width" colon _ number {% ([ , , , x]) => ({ strokeWidth: x }) %}

annotation_entry ->
      "annotation" dot side_literal colon _ (string | nullT) {% ([, , side, , , value]) => ({
        annotation: { side, value }
      }) %}
    | "annotation" dot side_literal dot "shift" dot side_literal colon _ number {% ([, , side, , , , shiftSide, , , value]) => ({
        annotation: {
          side,
          [`shift${shiftSide[0].toUpperCase()}${shiftSide.slice(1)}`]: value
        }
      }) %}
      
block_annotation -> annotation_entry {% id %}

annotation_property -> "annotation" dot annotation_subfield {% ([ , , sub]) => sub %}

annotation_subfield -> 
      "gap" colon _ number {% ([ , , , x]) => ({ annotationGap: x }) %}
    | "fontFamily" colon _ (string | nullT) {% ([ , , , x]) => ({ annotationFontFamily: x }) %}
    | "fontSize" colon _ number {% ([ , , , x]) => ({ annotationFontSize: x }) %}
    | "fontWeight" colon _ numberL {% ([ , , , x]) => ({ annotationFontWeight: x }) %}
    | "fontStyle" colon _ font_style_literal {% ([ , , , x]) => ({ annotationFontStyle: x }) %}
    | "fontColor" colon _ (string | nullT) {% ([ , , , x]) => ({ annotationFontColor: x }) %}


block_nodes -> "nodes" colon _ node_list {% ([, , , list]) => ({ nodes: list }) %}
block_edges -> "edges" colon _ edge_list {% ([, , , list]) => ({ edges: list }) %}
block_groups -> "groups" colon _ group_list {% ([, , , list]) => ({ groups: list }) %}

node_list -> lbrac wsn (node_entry (comma_nlow_new_arch node_entry):*):? wsn rbrac {% ([, , items, ,]) => {
    if (!items) return []
    const [first, rest] = items
    const result = [first];
    if (rest) rest.forEach(x => result.push(x[1]));
    return result;
} %}

node_entry -> wordL _ equals wsn node_body {% ([id, , , , body]) => ({
  id,
  ...body
}) %}

node_body -> node_field (nlow node_field):* {% ([first, rest]) => {
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
} %}

node_field -> (pair["type", node_type_literal] 
            | pair["shape", (shape_literal | number_only_list)] 
            | pair["kernelSize", kernel_size_literal] 
            | pair["filterSpacing", number] 
            | node_label_property
            | node_sub_label_property
            | node_op_label_property
            | stroke_property
            | outer_stroke_property
            | annotation_property
            | pair["size", size_tuple] 
            | pair["shape", node_shape_literal] 
            | pair["color", (string | nullT | ns_list)]
            | pair["outputLabels", ns_list]
            | pair["direction", side_literal]
            | node_annotation
            )
{% iid %}

outer_stroke_property -> "outerStroke" dot outer_stroke_subfield {% ([ , , sub]) => sub %}

outer_stroke_subfield -> 
      "color" colon _ (string | nullT) {% ([ , , , x]) => ({ outerStrokeColor: x }) %}
    | "style" colon _ stroke_style_literal {% ([ , , , x]) => ({ outerStrokeStyle: x }) %}
    | "width" colon _ number {% ([ , , , x]) => ({ outerStrokeWidth: x }) %}


node_label_property -> "label" dot node_label_subfield {% ([ , , sub]) => sub %}

node_label_subfield -> 
      "text" colon _ (string | nullT) {% ([ , , , x]) => ({ labelText: x }) %}
    | "orientation" colon _ labelOrientation_tuple {% ([ , , , x]) => ({ labelOrientation: x }) %}
    | "fontColor" colon _ (string | nullT) {% ([ , , , x]) => ({ labelFontColor: x }) %}
    | "fontFamily" colon _ (string | nullT) {% ([ , , , x]) => ({ labelFontFamily: x }) %}
    | "fontSize" colon _ number {% ([ , , , x]) => ({ labelFontSize: x }) %}
    | "fontWeight" colon _ numberL {% ([ , , , x]) => ({ labelFontWeight: x }) %}
    | "fontStyle" colon _ font_style_literal {% ([ , , , x]) => ({ labelFontStyle: x }) %}


node_sub_label_property -> "subLabel" dot node_sub_label_subfield {% ([ , , sub]) => sub %}

node_sub_label_subfield -> 
      "text" colon _ (string | nullT) {% ([ , , , x]) => ({ subLabelText: x }) %}
    | "fontColor" colon _ (string | nullT) {% ([ , , , x]) => ({ subLabelFontColor: x }) %}
    | "fontFamily" colon _ (string | nullT) {% ([ , , , x]) => ({ subLabelFontFamily: x }) %}
    | "fontSize" colon _ number {% ([ , , , x]) => ({ subLabelFontSize: x }) %}
    | "fontWeight" colon _ numberL {% ([ , , , x]) => ({ subLabelFontWeight: x }) %}
    | "fontStyle" colon _ font_style_literal {% ([ , , , x]) => ({ subLabelFontStyle: x }) %}


node_op_label_property -> "opLabel" dot node_op_label_subfield {% ([ , , sub]) => sub %}

node_op_label_subfield -> 
      "text" colon _ (string | nullT) {% ([ , , , x]) => ({ opLabelText: x }) %}
    | "fontColor" colon _ (string | nullT) {% ([ , , , x]) => ({ opLabelFontColor: x }) %}
    | "fontFamily" colon _ (string | nullT) {% ([ , , , x]) => ({ opLabelFontFamily: x }) %}
    | "fontSize" colon _ number {% ([ , , , x]) => ({ opLabelFontSize: x }) %}
    | "fontWeight" colon _ numberL {% ([ , , , x]) => ({ opLabelFontWeight: x }) %}
    | "fontStyle" colon _ font_style_literal {% ([ , , , x]) => ({ opLabelFontStyle: x }) %}
    | "subtext" colon _ (string | nullT) {% ([ , , , x]) => ({ opLabelSubtext: x }) %}


node_annotation -> annotation_entry {% id %}

edge_list -> lbrac wsn (edge_entry (comma_nlow_new_arch edge_entry):*):? wsn rbrac {% ([, , items, ,]) => {
    if (!items) return []
    const [first, rest] = items
    const result = [first];
    if (rest) rest.forEach(x => result.push(x[1]));
    return result;
} %}

edge_entry -> wordL _ equals wsn endpoint _ %arrow _ endpoint (__ edge_field (nlow edge_field):*):? {% ([id, , , , from, , , , to, fields]) => {

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

    
} %}

edge_field -> (
             pair["shape", edge_shape_literal] 
            | pair["style", edge_style_literal]
            | pair["transition", edge_transition_literal]
            | pair["color", (string | nullT)]
            | pair["arrowheads", numberL]
            | pair["gap", number]
            | pair["edgeAnchorOffset", number_only_list]
            | pair["curveHeight", number]
            | pair["width", number]
            | pair["bidirectional", boolean]
            | pair["headOnly", boolean]
            | edge_label_property
            | pair["alignToIndexedPort", boolean])
{% iid %}


edge_label_property -> "label" dot edge_label_subfield {% ([ , , sub]) => sub %}

edge_label_subfield -> 
      "text" colon _ (string | nullT) {% ([ , , , x]) => ({ labelText: x }) %}
    | "fontColor" colon _ (string | nullT) {% ([ , , , x]) => ({ labelFontColor: x }) %}
    | "fontFamily" colon _ (string | nullT) {% ([ , , , x]) => ({ labelFontFamily: x }) %}
    | "fontSize" colon _ number {% ([ , , , x]) => ({ labelFontSize: x }) %}
    | "fontWeight" colon _ numberL {% ([ , , , x]) => ({ labelFontWeight: x }) %}
    | "fontStyle" colon _ font_style_literal {% ([ , , , x]) => ({ labelFontStyle: x }) %}
    | "shift" dot side_literal colon _ number {% ([, , side, , , value]) => ({ [`labelShift${side[0].toUpperCase()}${side.slice(1)}`]: value }) %}

endpoint -> wordL anchor_with_index {% ([name, s]) => {
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
} %}

anchor_with_index -> dot node_edge_literals index_opt:? {% ([, anchor, index]) => {
    if (anchor === "mid" || anchor === "start" || anchor === "end") {
        return { edgeAnchor: anchor };
    }

    if (index !== undefined) {
        return {nodeAnchor: anchor, portIndex: index}
    } else {
        return {nodeAnchor: anchor}
    }

} %}

index_opt -> lbrac _ numberL _ rbrac {% ([, , n, ,]) => n %}


group_list -> lbrac wsn (group_entry (comma_nlow_new_arch group_entry):*):? wsn rbrac {% ([, , items, ,]) => {
    if (!items) return []
    const [first, rest] = items
    const result = [first];
    if (rest) rest.forEach(x => result.push(x[1]));
    return result;
} %}


group_entry -> wordL _ equals wsn group_body {% ([id, , , , body]) => ({
  id,
  ...body
}) %}


group_body -> group_field (nlow group_field):* {% ([first, rest]) => {
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

    
} %}

group_field -> (pair["members", member_list]
          | pair["layout", layout_literal]
          | pair["gap", number]
          | pair["color", (string | nullT)] 
          | pair["colorBoxAdjustments", size_4tuple]
          | pair["align", boolean] 
          | pair["shape", block_group_shape_literal]
          | stroke_property
          | marker_property
          | anchor_property
          | group_annotation
          | annotation_property
          | shift_property
          )
          {% iid %}

anchor_property -> "anchor" dot anchor_subfield {% ([ , , sub]) => sub %}

anchor_subfield -> 
     "source" colon _ wordL {% ([ , , , x]) => ({anchorSource: x}) %}
    | "target" colon _ wordL {% ([ , , , x]) => ({anchorTarget: x}) %}

shift_property -> "shift" dot shift_subfield {% ([ , , sub]) => sub %}

shift_subfield -> 
     "left" colon _ number {% ([ , , , x]) => ({shiftLeft: x}) %}
    | "right" colon _ number {% ([ , , , x]) => ({shiftRight: x}) %}
    | "top" colon _ number {% ([ , , , x]) => ({shiftTop: x}) %}
    | "bottom" colon _ number {% ([ , , , x]) => ({shiftBottom: x}) %}

marker_property -> "marker" dot marker_subfield {% ([ , , sub]) => sub %}

marker_subfield -> 
     "type" colon _ marker_type_literal {% ([ , , , x]) => ({markerType: x}) %}
    | "color" colon _ (string | nullT) {% ([ , , , x]) => ({markerColor: x}) %}
    | "position" colon _ side_literal {% ([ , , , x]) => ({markerPosition: x}) %}
    | "text" colon _ (string | nullT) {% ([ , , , x]) => ({ markerLabelText: x }) %}
    | "fontColor" colon _ (string | nullT) {% ([ , , , x]) => ({ markerLabelFontColor: x }) %}
    | "fontFamily" colon _ (string | nullT) {% ([ , , , x]) => ({ markerLabelFontFamily: x }) %}
    | "fontSize" colon _ number {% ([ , , , x]) => ({ markerLabelFontSize: x }) %}
    | "fontWeight" colon _ numberL {% ([ , , , x]) => ({ markerLabelFontWeight: x }) %}
    | "fontStyle" colon _ font_style_literal {% ([ , , , x]) => ({ markerLabelFontStyle: x }) %}
    | "shift" dot "left" colon _ number {% ([ , , , , , x]) => ({ markerLeft: x }) %}
    | "shift" dot "right" colon _ number {% ([ , , , , , x]) => ({ markerRight: x }) %}
    | "shift" dot "bottom" colon _ number {% ([ , , , , , x]) => ({ markerBottom: x }) %}
    | "shift" dot "top" colon _ number {% ([ , , , , , x]) => ({ markerTop: x }) %}


group_annotation -> annotation_entry {% id %}

member_list -> lbrac wsn (wordL (comma_nlow_new_arch wordL):*):? wsn rbrac {% ([, ,items, ,]) => {
   if (!items) return []
   const [first, rest] = items
   let result = [first]
   if (rest) rest.forEach(([, member]) => result.push(member));
   return result
} %}

diagram_body -> lbrac wsn (diagram_entry (comma_nlow_new_arch diagram_entry):*):? wsn rbrac {% ([, ,items, ,]) => {
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
} %}

diagram_entry -> (
              pair["layout", layout_literal]
            | pair["gap", number]
            | pair["rotateRight", numberL]
            | pair["uses", use_list] 
            | pair["connects", connect_list] 
            | diagram_annotation
            | annotation_property
) {% iid %}


diagram_annotation -> annotation_entry {% id %}

connect_list -> lbrac wsn (connect_entry (comma_nlow_new_arch connect_entry):*):? wsn rbrac {% ([, , items, ,]) => {
    if (!items) return []
    const [first, rest] = items
    const result = [first];
    if (rest) rest.forEach(x => result.push(x[1]));
    return result;
} %}

connect_entry -> endpoint_connect _ %arrow _ endpoint_connect (__ connect_field (nlow connect_field):*):? {% ([from, , , , to, fields]) => {

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

    
} %}

endpoint_connect -> wordL dot wordL anchor_with_index {% ([blockName, ,node_or_edge, s]) => {
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
} %}

connect_field -> (pair["shape", edge_shape_literal] 
            | pair["style", edge_style_literal]
            | pair["transition", edge_transition_literal]
            | pair["color", (string | nullT)]
            | pair["arrowheads", numberL]
            | pair["gap", number]
            | pair["curveHeight", number]
            | pair["width", number]
            | pair["alignToIndexedPort", boolean]
            | pair["edgeAnchorOffset", number_only_list]
            | pair["bidirectional", boolean]
            | edge_label_property
            )
{% iid %}


use_list -> lbrac wsn (use_entry (comma_nlow_new_arch use_entry):*):? wsn rbrac {% ([, ,items, ,]) => {
   if (!items) return []
   const [first, rest] = items
   let result = [first]
   if (rest) rest.forEach(([, member]) => result.push(member));
   return result
} %}


use_entry -> wordL _ equals _ wordL (_ pair["anchor", wordL]):? {% ([alias, , , ,blockName, field]) => ({
  id: alias,
  block: blockName,
   ...(field ? field[1] : null)

}) %}

shape_literal -> %layoutspec {% ([t]) => {
  const parts = t.value.split("x").map(Number);

  if (!(parts.length === 2 || parts.length === 3)) {
    throw new Error("shape must be NUMBERxNUMBER or NUMBERxNUMBERxNUMBER");
  }

  if (parts.some(n => !Number.isInteger(n) || n < 0)) {
    throw new Error("shape values must be non-negative integers");
  }

  return parts;
} %}

kernel_size_literal -> %layoutspec {% ([t]) => {
  const parts = t.value.split("x").map(Number);

  if (parts.length !== 2) {
    throw new Error("kernelSize must be NUMBERxNUMBER");
  }

  if (parts.some(n => !Number.isInteger(n) || n < 0)) {
    throw new Error("kernelSize values must be non-negative integers");
  }

  return parts;
} %}

# Literals of blocks

marker_type_literal -> "bracket" {% () => "bracket" %}
                   | "brace" {% () => "brace" %}
                   | "arrow" {% () => "arrow" %}

label_orientation_literal -> "horizontal" {% () => "horizontal" %}
                   | "vertical" {% () => "vertical" %}

node_edge_literals -> side_literal {% id %}
                | "mid" {% () => "mid" %}
                | "start" {% () => "start" %}
                | "end" {% () => "end" %}

edge_shape_literal -> "straight" {% () => "straight" %}
                   | "bow" {% () => "bow" %} 
                   | "arc" {% () => "arc" %} 

                   
edge_style_literal -> "solid" {% () => "solid" %}
                   | "dashed" {% () => "dashed" %}      
                   | "dotted" {% () => "dotted" %}      

stroke_style_literal -> "solid" {% () => "solid" %}
                   | "dashed" {% () => "dashed" %}      
                   | "dotted" {% () => "dotted" %}    

edge_transition_literal -> "default" {% () => "default" %}
                   | "featureMap" {% () => "featureMap" %} 
                   | "flatten" {% () => "flatten" %} 
                   | "fullyConnected" {% () => "fullyConnected" %} 


layout_literal -> "horizontal" {% () => "horizontal" %}
                   | "vertical" {% () => "vertical" %}
                   | "grid" {% () => "grid" %}

size_tuple -> tuple[number, number] {%id %}

labelOrientation_tuple -> tuple[labelOrientation_orientation_literal, labelOrientation_side_literal] {%id %}

labelOrientation_orientation_literal -> "vertical" {% () => "vertical" %}

labelOrientation_side_literal -> "right" {% () => "right" %}
                     | "left" {% () => "left" %}

size_4tuple -> tuple4[number, number, number, number] {%id %}

node_type_literal -> "text" {% () => "text" %}
                   | "rect" {% () => "rect" %}
                   | "circle" {% () => "circle" %}
                   | "stacked" {% () => "stacked" %}
                   | "flatten" {% () => "flatten" %}
                   | "fullyConnected" {% () => "fullyConnected" %}
                   | "arrow" {% () => "arrow" %}
                   | "trapezoid" {% () => "trapezoid" %}

font_style_literal -> "normal" {% () => "normal" %}
                   | "italic" {% () => "italic" %}
                   | "oblique" {% () => "oblique" %}


node_shape_literal -> "rounded" {% () => "rounded" %}             

block_group_shape_literal -> "rounded" {% () => "rounded" %}    

node_orientation_literal -> "vertical" {% () => "vertical" %}
                     | "horizontal" {% () => "horizontal" %}

                     
side_literal -> "top" {% () => "top" %}
              | "bottom" {% () => "bottom" %}
              | "left" {% () => "left" %}
              | "right" {% () => "right" %}

# NeuralNetwork Definition
neuralNetwork_def -> definition["neuralnetwork", neuralNetwork_pair] {% id %}
neuralNetwork_pair -> (
              pair["layers", nns_list]
            | pair["neurons", nns_mlist] 
            | pair["layerColors", ns_list]
            | pair["neuronColors", nns_mlist]
            | pair["showBias", boolean]
            | pair["showLabels", boolean]
            | pair["labelPosition", position_labels_literal]
            | pair["showWeights", boolean]
            | pair["showArrowheads", boolean]
            | pair["edgeWidth", numberL]
            | pair["edgeColor", (string | null)]
            | pair["layerSpacing", number]
            | pair["neuronSpacing", number]
            | pair["layerStrokes", ns_list]
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
            | pair["children", e_list]
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
              pair["value", (string | s_list) {% id %}]
            | pair["fontSize", (number | n_list) {% id %}]
            | pair["color", (string | ns_list) {% id %}]
            | pair["fontWeight", (string | ns_list) {% id %}]
            | pair["fontFamily", (string | ns_list) {% id %}]
            | pair["align", (string | ns_list) {% id %}]
            | pair["lineSpacing", number]
            | pair["width", number]
            | pair["height", number]
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
          | block_remove_nodes
          | block_remove_node
          | block_remove_group
          | block_remove_block
          | block_remove_edges
          | block_remove_edge
          | set_node_label
          | set_node_color
          | set_node_stroke
          | set_edge_label
          | set_edge_color
          | set_edge_shape
          | hide_node
          | show_node
          | hide_edge
          | show_edge
          | hide_block
          | show_block
          | set_block_color
          | set_block_annotation
          | set_block_layout
          | set_group_color
          | set_group_layout
          | set_group_annotation
          | set_node_annotation
          | set_node_shape
          | set_neuralnetwork_neuron
          | set_neuralnetwork_neuron_color
          | set_neuralnetwork_layer
          | set_neuralnetwork_layer_color
          | set_neuralnetwork_neurons
          | set_neuralnetwork_neurons_color
          | set_neuralnetwork_layers
          | set_neuralnetwork_layers_color
          | add_neuron_at_layer_at_end
          | add_layer_with_neurons
          | remove_neurons_at_layer
          | remove_layer
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
          | add_child
          | set_child
          | insert_value
          | insert_node
          | remove_value
          | remove_node
          | remove_edge
          | remove_child
          | remove_subtree
          | remove_at
          | set_text_value
          | set_text_fontSize
          | set_text_fontWeight
          | set_text_fontFamily
          | set_text_align
          | set_text_lineSpacing
          | set_text_width
          | set_text_height
          | set_text_fontSizes_multiple
          | set_text_fontWeights_multiple
          | set_text_fontFamilies_multiple
          | set_text_aligns_multiple
          | set_text
          | set_chained_text_fontSize
          | set_chained_text_color
          | set_chained_text_fontWeight
          | set_chained_text_fontFamily
          | set_chained_text_align
          | set_chained_text_value
          | set_chained_text_lineSpacing
          | set_chained_text_width
          | set_chained_text_height
          | add_matrix_row
          | add_matrix_column
          | insert_matrix_row
          | insert_matrix_column
          | remove_matrix_row
          | remove_matrix_column
          | add_matrix_border
) {% iid %}

# Main commands
page -> "page" (_ layout):? {% ([, layoutArg]) => ({ type: "page", layout: layoutArg ? layoutArg[1] : null }) %}

show -> "show" _ wordL (_ (position_keyword | ranged_tuple)):? {% ([, , wordL, positionArg]) => ({ 
    type: "show", 
    value: wordL.name, 
    position: positionArg ? positionArg[1][0] : null,
    line: wordL.line, 
    col: wordL.col 
}) %}

hide -> "hide" _ wordL {% ([, , wordL]) => ({ type: "hide", value: wordL.name, line: wordL.line, col: wordL.col }) %}

# architecture methods
block_remove_nodes -> cmd["removeNodes", comma_sep[word, w_list]] {% (details) => ({ type: "block_remove_nodes", ...id(details) }) %}
block_remove_node -> cmd["removeNode", comma_sep[word, word]] {% (details) => ({ type: "block_remove_node", ...id(details) }) %}
block_remove_group -> cmd["removeGroup", comma_sep[word, word]] {% (details) => ({ type: "block_remove_group", ...id(details) }) %}
block_remove_block -> cmd["removeBlock", word] {% (details) => ({ type: "block_remove_block", ...id(details) }) %}
set_node_label -> cmd["setNodeLabel", comma_sep3[word, word, (string | nullT)]] {% (details) => ({ type: "set_node_label", ...id(details) }) %}
set_node_color-> cmd["setNodeColor", comma_sep3[word, word, (string | nullT)]] {% (details) => ({ type: "set_node_color", ...id(details) }) %}
block_remove_edges -> cmd["removeEdges", comma_sep[word, (w_list | number_only_list)]] {% (details) => ({ type: "block_remove_edges", ...id(details) }) %}
block_remove_edge -> cmd["removeEdge", comma_sep[word, (word | number)]] {% (details) => ({ type: "block_remove_edge", ...id(details) }) %}
set_edge_label -> cmd["setEdgeLabel", comma_sep3[word, (word | number), (string | nullT)]] {% (details) => ({ type: "set_edge_label", ...id(details) }) %}
set_edge_color-> cmd["setEdgeColor", comma_sep3[word, (word | number), (string | nullT)]] {% (details) => ({ type: "set_edge_color", ...id(details) }) %}
set_edge_shape -> cmd["setEdgeShape", comma_sep3[word, (word | number), edge_shape_literal]] {% (details) => ({ type: "set_edge_shape", ...id(details) }) %}
set_node_stroke -> cmd["setNodeStroke", comma_sep3[word, word, (string | nullT)]] {% (details) => ({ type: "set_node_stroke", ...id(details) }) %}
hide_node -> cmd["hideNode", comma_sep[word, word]] {% (details) => ({ type: "hide_node", ...id(details) }) %}
show_node -> cmd["showNode", comma_sep[word, word]] {% (details) => ({ type: "show_node", ...id(details) }) %}
hide_edge -> cmd["hideEdge", comma_sep[word, word]] {% (details) => ({ type: "hide_edge", ...id(details) }) %}
show_edge -> cmd["showEdge", comma_sep[word, word]] {% (details) => ({ type: "show_edge", ...id(details) }) %}
hide_block -> cmd["hideBlock", word] {% (details) => ({ type: "hide_block", ...id(details) }) %}
show_block -> cmd["showBlock", word] {% (details) => ({ type: "show_block", ...id(details) }) %}
set_block_color -> cmd["setBlockColor", comma_sep[word, (string | nullT)]] {% (details) => ({ type: "set_block_color", ...id(details) }) %}
set_block_layout -> cmd["setBlockLayout", comma_sep[word, layout_literal]] {% (details) => ({ type: "set_block_layout", ...id(details) }) %}
set_block_annotation -> cmd["setBlockAnnotation", comma_sep3[word, side_literal, (string | nullT)]] {% (details) => ({ type: "set_block_annotation", ...id(details) }) %}
set_group_color -> cmd["setGroupColor", comma_sep3[word, word, (string | nullT)]] {% (details) => ({ type: "set_group_color", ...id(details) }) %}
set_group_layout -> cmd["setGroupLayout", comma_sep3[word, word, layout_literal]] {% (details) => ({ type: "set_group_layout", ...id(details) }) %}
set_group_annotation -> cmd["setGroupAnnotation", comma_sep4[word, word, side_literal, (string | nullT)]] {% (details) => ({ type: "set_group_annotation", ...id(details) }) %}
set_node_annotation -> cmd["setNodeAnnotation", comma_sep4[word, word, side_literal, (string | nullT)]] {% (details) => ({ type: "set_node_annotation", ...id(details) }) %}
set_node_shape -> cmd["setNodeShape", comma_sep3[word, word, shape_literal]] {% (details) => ({ type: "set_node_shape", ...id(details) }) %}

# Set a value in an array (or by node name for graphs/trees)
set_value -> cmd["setValue", comma_sep[(number | word) {% id %}, (number | string | nullT) {% id %}]] {% (details) => ({ type: "set", target: "value", ...id(details) }) %}
set_color -> cmd["setColor", comma_sep[(number | word) {% id %}, (string | nullT) {% id %}]] {% (details) => ({ type: "set", target: "color", ...id(details) }) %}
set_arrow -> cmd["setArrow", comma_sep[(number | word) {% id %}, (number | string | nullT) {% id %}]] {% (details) => ({ type: "set", target: "arrow", ...id(details) }) %}
set_hidden -> cmd["setHidden", comma_sep[(number | word) {% id %}, boolean]] {% (details) => ({ type: "set", target: "hidden", ...id(details) }) %}

# Set a value in neural network
set_neuralnetwork_neuron -> triple_cmd["setNeuron", (number | string | nullT) {% id %}] {% (details) => ({ type: "set_neuralnetwork_neuron_setNeuron", target: "neurons", ...id(details) }) %}
set_neuralnetwork_neuron_color -> triple_cmd["setNeuronColor", (string | nullT) {% id %}] {% (details) => ({ type: "set_neuralnetwork_neuron_setNeuronColor", target: "neuronColors", ...id(details) }) %}
set_neuralnetwork_layer -> cmd["setLayer", comma_sep[(number | word ) {% id %}, (number | string | nullT) {% id %}]] {% (details) => ({ type: "set_neuralnetwork_layer", target: "layers", ...id(details) }) %}
set_neuralnetwork_layer_color -> cmd["setLayerColor", comma_sep[(number | word) {% id %}, (string | nullT) {% id %}]] {% (details) => ({ type: "set_neuralnetwork_layer", target: "layerColors", ...id(details) }) %}

# Set a value in a matrix
set_matrix_value -> triple_cmd["setValue", (number | string | nullT) {% id %}] {% (details) => ({ type: "set_matrix", target: "value", ...id(details) }) %}
set_matrix_color -> triple_cmd["setColor", (string | nullT) {% id %}] {% (details) => ({ type: "set_matrix", target: "color", ...id(details) }) %}
set_matrix_arrow -> triple_cmd["setArrow", (number | string | nullT) {% id %}] {% (details) => ({ type: "set_matrix", target: "arrow", ...id(details) }) %}
set_edges -> cmd["setEdges", e_list] {% (details) => ({ type: "set_multiple", target: "edges", ...id(details) }) %}

# Set a value in a text
set_text_value -> cmd["setValue", (string | s_list) {% id %}] {% (details) => ({ type: "set", target: "value", ...id(details) }) %}
set_text_fontSize -> cmd["setFontSize", (number | comma_sep[number, (number | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set", target: "fontSize", ...id(details) }) %}
set_text_color -> cmd["setColor", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set", target: "color", ...id(details) }) %}
set_text_fontWeight -> cmd["setFontWeight", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set", target: "fontWeight", ...id(details) }) %}
set_text_fontFamily -> cmd["setFontFamily", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set", target: "fontFamily", ...id(details) }) %}
set_text_align -> cmd["setAlign", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set", target: "align", ...id(details) }) %}
set_text_lineSpacing -> cmd["setLineSpacing", number] {% (details) => ({ type: "set", target: "lineSpacing", ...id(details) }) %}
set_text_width -> cmd["setWidth", number] {% (details) => ({ type: "set", target: "width", ...id(details) }) %}
set_text_height -> cmd["setHeight", number] {% (details) => ({ type: "set", target: "height", ...id(details) }) %}

# Set multiple values in an array
# Example: arr1.setValues([2,_,4,_,_,_,_])
set_values_multiple -> cmd["setValues", list[(number | string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "value", ...id(details) }) %}
set_colors_multiple -> cmd["setColors", list[(string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "color", ...id(details) }) %}
set_arrows_multiple -> cmd["setArrows", list[(number | string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "arrow", ...id(details) }) %}
set_hidden_multiple -> cmd["setHidden", list[(boolean | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "hidden", ...id(details) }) %}

# set multiple values in a neural network
# Example: mat1.setValues([[1, 2], [3, 4]]) or mat1.setValues([[1, _], [_, 4]]), mat1.setValues([2,_,4,_,_,_,_])
set_neuralnetwork_neurons -> cmd["setNeurons", nnsp_mlist] {% (details) => ({ type: "set_neuralnetwork_neurons_multiple", target: "neurons", ...id(details) }) %}
set_neuralnetwork_layers -> cmd["setLayers", list[(number | string | nullT | pass ) {% id %}]] {% (details) => ({ type: "set_neuralnetwork_layer_multiple", target: "layers", ...id(details) }) %}
set_neuralnetwork_neurons_color -> cmd["setNeuronColors", nnsp_mlist] {% (details) => ({ type: "set_neuralnetwork_neurons_multiple", target: "neuronColors", ...id(details) }) %}
set_neuralnetwork_layers_color -> cmd["setLayerColors", list[(string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_neuralnetwork_layer_multiple", target: "layerColors", ...id(details) }) %}

# Set multiple values in a matrix
# Example: mat1.setValues([[1, 2], [3, 4]]) or mat1.setValues([[1, _], [_, 4]])
set_matrix_values -> cmd["setValues", nnsp_mlist] {% (details) => ({ type: "set_matrix_multiple", target: "value", ...id(details) }) %}
set_matrix_colors -> cmd["setColors", nnsp_mlist] {% (details) => ({ type: "set_matrix_multiple", target: "color", ...id(details) }) %}
set_matrix_arrows -> cmd["setArrows", nnsp_mlist] {% (details) => ({ type: "set_matrix_multiple", target: "arrow", ...id(details) }) %}

# Set multiple values in a text
set_text_fontSizes_multiple -> cmd["setFontSizes", list[(number | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "fontSize", ...id(details) }) %}
set_text_fontWeights_multiple -> cmd["setFontWeights", list[(string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "fontWeight", ...id(details) }) %}
set_text_fontFamilies_multiple -> cmd["setFontFamilies", list[(string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "fontFamily", ...id(details) }) %}
set_text_aligns_multiple -> cmd["setAligns", list[(string | nullT | pass) {% id %}]] {% (details) => ({ type: "set_multiple", target: "align", ...id(details) }) %}

# Set text for non-text objects
set_text -> cmd["setText", comma_sep[(string | nullT) {% id %}, ("\"above\"" | "\"below\"" | "\"left\"" | "\"right\"") {% id %}]] {% (details) => ({ type: "set_text", ...id(details) }) %}

# Chained text object methods
set_chained_text_fontSize -> chained_cmd["setFontSize", (number | comma_sep[number, (number | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set_chained", target: "fontSize", ...id(details) }) %}
set_chained_text_color -> chained_cmd["setColor", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set_chained", target: "color", ...id(details) }) %}
set_chained_text_fontWeight -> chained_cmd["setFontWeight", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set_chained", target: "fontWeight", ...id(details) }) %}
set_chained_text_fontFamily -> chained_cmd["setFontFamily", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set_chained", target: "fontFamily", ...id(details) }) %}
set_chained_text_align -> chained_cmd["setAlign", (string | comma_sep[number, (string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "set_chained", target: "align", ...id(details) }) %}
set_chained_text_value -> chained_cmd["setValue", (string | s_list) {% id %}] {% (details) => ({ type: "set_chained", target: "value", ...id(details) }) %}
set_chained_text_lineSpacing -> chained_cmd["setLineSpacing", number] {% (details) => ({ type: "set_chained", target: "lineSpacing", ...id(details) }) %}
set_chained_text_width -> chained_cmd["setWidth", number] {% (details) => ({ type: "set_chained", target: "width", ...id(details) }) %}
set_chained_text_height -> chained_cmd["setHeight", number] {% (details) => ({ type: "set_chained", target: "height", ...id(details) }) %}

# Add functions
add_value -> cmd["addValue", (number | string | nullT) {% id %}] {% (details) => ({ type: "add", target: "value", ...id(details) }) %}
add_node -> cmd["addNode", (word | comma_sep[word, (number | string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "add", target: "nodes", ...id(details) }) %}
add_edge -> cmd["addEdge", edge] {% (details) => ({ type: "add", target: "edges", ...id(details) }) %}
add_child -> cmd["addChild", (edge | comma_sep[edge, (number | string | nullT) {% id %}]) {% id %}] {% (details) => ({ type: "add_child", ...id(details) }) %}
set_child -> cmd["setChild", edge] {% (details) => ({ type: "set_child", ...id(details) }) %}

# Insert functions
insert_value -> cmd["insertValue", comma_sep[number, (number | string | nullT) {% id %}]] {% (details) => ({ type: "insert", target: "value", ...id(details) }) %}
# insertNode command
insert_node -> cmd["insertNode", insert_node_2_args] {% (details) => ({ type: "insert", target: "nodes", ...id(details) }) %}
insert_node -> cmd["insertNode", insert_node_3_args] {% (details) => ({ type: "insert", target: "nodes", ...id(details) }) %}

# Matrix insert functions
# Two-argument version: insertRow(index, [values])
insert_matrix_row -> cmd["insertRow", comma_sep[number, nns_list]] {% (details) => ({ type: "insert_matrix_row", target: "value", ...id(details) }) %}
insert_matrix_column -> cmd["insertColumn", comma_sep[number, nns_list]] {% (details) => ({ type: "insert_matrix_column", target: "value", ...id(details) }) %}
# One-argument version: insertRow(index) or insertRow()
insert_matrix_row -> cmd["insertRow", ((nullT | number | nns_list) {% iid %}):?] {% (details) => ({ type: "insert_matrix_row", target: "value", ...id(details) }) %}
insert_matrix_column -> cmd["insertColumn", ((nullT | number | nns_list) {% iid %}):?] {% (details) => ({ type: "insert_matrix_column", target: "value", ...id(details) }) %}


# 2-argument version: insertNode(index, nodeName)  
insert_node_2_args -> (number | word) "," _ word {% ([indexOrNode, , , nodeName]) => ({ index: indexOrNode[0], value: nodeName }) %}

# 3-argument version: insertNode(index, nodeName, nodeValue)
insert_node_3_args -> (number | word) "," _ word "," _ (number | string | nullT) {% ([indexOrNode, , , nodeName, , , nodeValue]) => {
  return { index: indexOrNode[0], value: nodeName, nodeValue: nodeValue[0] };
} %}

# Remove functions
remove_value -> cmd["removeValue", (number | string | nullT) {% id %}] {% (details) => ({ type: "remove", target: "value", ...id(details) }) %}
remove_node -> cmd["removeNode", word] {% (details) => ({ type: "remove", target: "nodes", ...id(details) }) %}
remove_edge -> cmd["removeEdge", edge] {% (details) => ({ type: "remove", target: "edges", ...id(details) }) %}
remove_child -> cmd["removeChild", edge] {% (details) => ({ type: "remove", target: "children", ...id(details) }) %}
remove_subtree -> cmd["removeSubtree", word] {% (details) => ({ type: "remove_subtree", target: "nodes", ...id(details) }) %}
remove_at -> cmd["removeAt", number] {% (details) => ({ type: "remove_at", target: "all", ...id(details) }) %}

# Neural Network editing
add_neuron_at_layer_at_end -> cmd["addNeurons", comma_sep[number , nns_list]] {% (details) => ({ type: "insert_neuralnetwork_addNeurons", target1: "layers", target2: "neurons", ...id(details) }) %}

add_layer_with_neurons -> cmd["addLayer", comma_sep[(number | string | nullT), nns_list]] {% (details) => ({ type: "insert_neuralnetwork_addLayer", target1: "layers", target2: "neurons", target3: "layerColors", ...id(details) }) %}
remove_neurons_at_layer -> cmd["removeNeuronsFromLayer", comma_sep[number, nns_list]] {% (details) => ({ type: "remove_neuralnetwork_removeNeuronsFromLayer",target1: "layers", target2: "neurons", target3: "neuronColors", target4: "layerColors", ...id(details) }) %}
remove_layer -> cmd["removeLayerAt", number] {% (details) => ({ type: "remove_neuralnetwork_removeLayerAt", target1: "layers", target2: "neurons", target3: "layerColors", target4: "neuronColors", ...id(details) }) %}

# Matrix structural editing
add_matrix_row -> cmd["addRow", ((nullT | nns_list) {% iid %}):?] {% (details) => ({ type: "add_matrix_row", target: "value", ...id(details) }) %}
add_matrix_column -> cmd["addColumn", ((nullT | nns_list) {% iid %}):?] {% (details) => ({ type: "add_matrix_column", target: "value", ...id(details) }) %}
remove_matrix_row -> cmd["removeRow", number] {% (details) => ({ type: "remove_matrix_row", target: "value", ...id(details) }) %}
remove_matrix_column -> cmd["removeColumn", number] {% (details) => ({ type: "remove_matrix_column", target: "value", ...id(details) }) %}
add_matrix_border -> cmd["addBorder", comma_sep[(number | string | nullT) {% id %}, (string | nullT) {% id %}]] {% (details) => ({ type: "add_matrix_border", target: "value", ...id(details) }) %}
add_matrix_border -> cmd["addBorder", (number | string | nullT) {% id %}] {% (details) => ({ type: "add_matrix_border", target: "value", ...id(details) }) %}

# - Lists - #
nns_list -> list[(nullT | number | string) {% iid %}] {% id %} # Accepts null, number, or string
ns_list -> list[(nullT | string) {% iid %}] {% id %} # Accepts null or string
n_list -> list[(nullT | number) {% iid %}] {% id %} # Accepts null or number
s_list -> list[string {% id %}] {% id %} # Accepts only strings
number_only_list -> list[number {% id %}] {% id %} # Accepts only number
w_list -> list[word {% id %}] {% id %} # Accepts only words
e_list -> list[edge {% id %}] {% id %} # Accepts only edges
b_list -> list[boolean {% id %}] {% id %} # Accepts only booleans
nns_mlist -> matrix_2d_list[(nullT | number | string) {% iid %}] {% id %} # 2D array for matrix values, accepts null, number, or string
nnsp_mlist -> matrix_2d_list[(nullT | number | string | pass) {% iid %}] {% id %} # 2D array for matrix values, accepts null, number, string, or pass

# - Literals - #
number -> %number {% ([value]) => Number(value.value) %}
numberL -> %number {% ([value]) => ({number: Number(value.value), line: value.line, col: value.col}) %}
string -> %string {% ([value]) => value.value %}
boolean -> %boolean {% ([value]) => value.value %}
edge -> wordL %dash wordL {% ([start, , end]) => ({ start: start.name, end: end.name }) %}
word -> %word {% ([value]) => value.value %}
layoutspec -> %layoutspec {% ([value]) => value.value %}
wordL -> %word {% ([value]) => ({name: value.value, line: value.line, col: value.col}) %}
nullT -> %nullT {% () => null %}
pass -> %pass {% () => "_" %}

layout -> %layoutspec {% ([t]) => {
    const parts = t.value.split("x").map(Number);
    if (parts.length !== 2) throw new Error("layout must be NUMBERxNUMBER");
    return parts
} %}

position_labels_literal -> "bottom" {% () => "bottom" %}
                   | "top" {% () => "top" %}

# Range values, e.g. 0..1
range_value -> number dotdot number {% ([start, , end]) => ({ type: "range", start: start, end: end }) %}

# Position values that can be numbers or ranges
position_value -> (range_value | number) {% iid %}

# Ranged tuples, e.g. (0..1, 0) or (0..1, 0..1)
ranged_tuple -> lparen _ position_value _ comma _ position_value _ rparen {% ([, , x, , , , y, ]) => [x, y] %}

# Position keywords, e.g. top-left, tl, center, etc.
# Allow hyphenated keywords by combining word tokens with dashes
position_keyword -> (%word | %word %dash %word) {% (parts) => {
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
} %}

# Whitespace and newlines
_ -> %ws:? {% () => null %}
__ -> %ws {% () => null %}
nlw -> %nlw {% () => null %}
nlow -> (%nlw | %ws) {% () => null %}
comma_nlow -> ((nlow:? comma nlow:?) | nlw:+) {% () => null %}
wsn -> (%ws | %nlw):* {% () => null %}
nlw1 -> %nlw:+ {% () => null %}
comma_nlow_new_arch -> (wsn comma wsn) {% () => null %}


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
dotdot -> %dotdot {% () => null %}
dot -> %dot {% () => null %}
colon -> %colon {% () => null %}
equals -> %equals {% () => null %}