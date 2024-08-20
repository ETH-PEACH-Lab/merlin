# data_structure_extended_with_strings_corrected.ne
# TODO: add graph and matrix grammar

@{%
const flatten = arr => [].concat(...arr);

function handleRepetition(array) {
    const result = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i] === '*') {
            if (result.length > 0) {
                result.push([...result[result.length - 1]]);
            }
        } else {
            result.push(array[i][0]);
        }
    }
    return result;
}

function createAttributes(arr) {
    let result = {
        id: null,
        value: null,
        color: null,
        arrow: null,
        hidden: null
    };
    arr.forEach(item => {
        let key = Object.keys(item)[0];
        let value = item[key];
        result[key] = value;
    });
    return result;
}
%}

main -> _ "data:" _ data_entries _ (_ "draw:" _ draw_section _):? {%
    function(data) {
        let result = { data: data[3] };
        if (data[5]) {
            result.draw = data[5][3];
        }
        return result;
    }
%}

draw_section -> draw_entry:+ {%
    function(data) {
        return data[0];
    }
%}

draw_entry -> _ page_entry _ {%
    function(data) {
        return data[1];
    }
%}

page_entry -> _ "page" _ page_index _ ":=" _ range_entry _ "{" (_ show_entry _):* _ "}" _ {%
    function(data) {
        let result = {};
        result.page_index = data[3][0];
        result.range = data[7];
        result.show = data[10].map(item => item[1]);
        return result;
    }
%}

range_entry -> "[" _ number _ "," _ number _ "]" {%
    function(data) {
        return { start: data[2], end: data[6] };
    }
%}

page_index -> alphanum

show_entry -> "show" _ component_name _ "[" _ component_index _ "]" _ {%
    function(data) {
        return { component_name: data[2][0], component_index: data[6] };
    }
%}

component_index -> [A-Za-z0-9_\-\+\*/]:+ {%
    function(data) {
        return data[0].join("");
    }
%}

component_name -> alphanum

data_entries -> data_entry:+ {%
    function(data) {
        return data.map(item => item[0]);
    }
%}

data_entry -> data_type _ var_name _ "=" _ "{" _ all_type_description:* _ "}" {%
    function(data) {
        let type = data[0][0];
        let name = data[2];
        let raw_data = data[8];
        let value = handleRepetition(raw_data);
        let attributes = createAttributes(raw_data.map(item => item[0]));

        switch (type) {
            case "array":
            case "stack":
            case "tree":
            case "linkedlist":
            case "graph":
                return { type, name, value, raw_data, attributes };
            case "matrix":
                return { type, name, row_data: raw_data, processed_data: handleRepetition(raw_data.map(item => item[0])), attributes };
            default:
                return;
        }
    }
%}

all_type_description -> data_description | matrix_description {%
    function(data) {
        return flatten(data);
    }
%}

matrix_description -> _ attribute_name _ ":" _ "[" _ matrix_components _ "]" _ {%
    function(data) {
        return { [data[1][0]]: handleRepetition(data[7]) };
    }
%}

matrix_components -> matrix_component_or_star ("," _ matrix_component_or_star):* {%
    function(data) {
        return [data[0]].concat(data[1].map(item => item[3]));
    }
%}

matrix_component_or_star -> matrix_component | "*" {%
    function(data) {
        return data[0] === '*' ? '*' : data[0];
    }
%}

matrix_component -> "[" _ matrix_rows _ "]" {%
    function(data) {
        return data[2];
    }
%}

matrix_rows -> matrix_row ("," _ matrix_row):* {%
    function(data) {
        return [data[0]].concat(data[1].map(item => item[3]));
    }
%}

matrix_row -> "[" value ("," _ value):* "]" {%
    function(data) {
        return [data[2]].concat(data[3].map(item => item[3]));
    }
%}

data_type -> "array" | "stack" | "linkedlist" | "tree" | "matrix" | "graph"

var_name -> [a-zA-Z0-9_]:+ {%
    function(data) {
        return data[0].join("").replace(",", "");
    }
%}

data_description -> _ attribute_name _ ":" _ "[" _ data_rows _ "]" _ {%
    function(data) {
        return { [data[1][0]]: handleRepetition(data[7]) };
    }
%}

attribute_name -> alphanum

data_rows -> data_row_or_star ("," _ data_row_or_star):* {%
    function(data) {
        return [data[0]].concat(data[1].map(item => item[3]));
    }
%}

data_row_or_star -> data_row | "*" {%
    function(data) {
        return data[0] === '*' ? '*' : data[0];
    }
%}

data_row -> "[" _ value_edge_list _ "]" {%
    function(data) {
        return typeof data[2][0] === "object" ? data[2][0] : data[2];
    }
%}

value_edge_list -> edge_list | value_list {%
    function(data) {
        return data[0];
    }
%}

value_list -> value ("," _ value):* {%
    function(data) {
        return [data[0][0]].concat(data[1].map(item => item[3][0]));
    }
%}

edge_list -> edge ("," _ edge):* {%
    function(data) {
        return [data[0]].concat(data[1].map(item => item[3]));
    }
%}

edge -> "(" _ value _ "," _ value _ ")" {%
    function(data) {
        return { startPoint: data[2], endPoint: data[6] };
    }
%}

value -> alphanum

number -> [0-9]:+ {%
    function(data) {
        return parseInt(data[0].join(""), 10);
    }
%}

alphanum -> [a-zA-Z0-9]:+ {%
    function(data) {
        return data[0].join("");
    }
%}

_ -> [ \t\n\r]:*  # Skip whitespace
