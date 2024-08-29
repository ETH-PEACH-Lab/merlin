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
		id : null,
		value : null,
		color : null,
		arrow : null,
		hidden : null
	};
		arr.forEach(item => {
  let key = Object.keys(item)[0];
  let value = item[key];

  result[key] = value;
});
	return result;
}
%}

main -> _ "data:" _ data_entries _  "draw:" draw_section _ {%
  function(data) {
	let result = {data: data[3]};
	result.draw = data[6];
    return result;
  }
%}

draw_section -> draw_entry :+ {%
	function (data) {
		return data[0];
	}
%}

draw_entry -> page_entry {%
	function (data) {
		return data[0]
	}

%}

page_entry -> _ "page" _ page_index _ ":=" _ range_entry _ "{" (_ show_entry ):+ _ "}" {%
	function (data) {
		let result = {};
		result.page_index = data[3][0];
		result.range = data[7];
		result.show = data[10].map((item)=>item[1]);
		return result;
	}

%}

range_entry -> "[" number "," number "]" {%
	function (data) {
		return {start:data[1], end:data[3]}
	}
%}

page_index -> alphanum

show_entry-> "show" _ component_name "[" component_index "]" {%
	function (data) {
		return {component_name: data[2][0], component_index: data[4]};
	}
%}

component_index -> [A-Za-z0-9\-\+\*/]:+ {%
	function (data) {
		return data[0].join("");
	}
%}

component_name -> alphanum



data_entries -> (_ data_entry):+ {%
  function(d) {
    //return [d[0]].concat(d[1].map(item => item[1]));
	return d[0].map(item => item[1]);
  }
%}

data_entry -> data_type _ var_name _ "=" _ "{" all_type_description:+ _ "}" {%
  function(d) {
	  switch (d[0][0]) {
		  case "array": 
			let array_result = { type: d[0][0], name: d[2] };
			array_result.attributes = createAttributes(d[7].map((item)=>item[0]));
			return array_result;
			break;
		case "stack": 
			let stack_result = { type: d[0][0], name: d[2] };
			stack_result.attributes = createAttributes(d[7].map((item)=>item[0]));
			return stack_result;
			break;
		case "tree": 
			let tree_result = { type: d[0][0], name: d[2] };
			tree_result.attributes = createAttributes(d[7].map((item)=>item[0]));
			return tree_result;
			break;
		case "linkedlist": 
			let linkedlist_result = { type: d[0][0], name: d[2] };
			linkedlist_result.attributes = createAttributes(d[7].map((item)=>item[0]));
			return linkedlist_result;
			break;
		case "matrix":
			 let matrix_result = {type: d[0][0], name: d[2], processed_data:d[7].map((item) => item[0])};
			  matrix_result.attributes = createAttributes(matrix_result.processed_data);
			 return matrix_result;
			break;
		  case "graph":
			  let graph_result = { type: d[0][0], name: d[2] };
			  graph_result.attributes = createAttributes(d[7].map((item)=>item[0]));
			return graph_result;
			  break;
		default:
			return;
			break
	  }
	 
  }
%}

all_type_description -> data_description | matrix_description {%
	function(d) {
		return flatten(d);
	}
%}

matrix_description -> _ attribute_name _ ":" _ "[" _ matrix_components _ "]" {%
  function(d) {
	  // todo: handle repetition
	  // matrix_components should be a list of matrix components [component1, component2, ...]
    return {[d[1][0]] : handleRepetition(d[7])}; // return {attribute_name : [[[row1],[row2]],...]}
  }
%}

matrix_components -> matrix_component_or_star (_ "," _ matrix_component_or_star):* {%
  function(d) {
    return [d[0]].concat(d[1].map(item => item[3])); // return [component1, componenet2, ...]
  }
%}

matrix_component_or_star -> matrix_component | "*" {% function(d) { return d[0] === '*' ? '*' : d[0]; } %}

matrix_component -> "[" matrix_rows "]" {%
  function(d) {
    return d[1]; // return matrix_component [[row1],[row2],...]
  }
%}

matrix_rows -> matrix_row _ ("," _ matrix_row):* {%
  function(d) {
    return [d[0]].concat(d[2].map(item => item[2]));  // return matrix_component [[row1],[row2],...]
  }
%}

matrix_row -> _ "[" value _ ("," _ value ):* "]" {%
	function (d) {
		return [d[2][0]].concat(d[4].map(item => item[2][0])); 
	}
%}

data_type -> "array" | "stack" | "linkedlist" | "tree" | "matrix" | "graph"

var_name -> [a-zA-Z0-9]:+ {% function(d) { return d[0].join("").replace(",",""); } %}

data_description -> _ attribute_name  _ ":" _ "[" _ data_rows _ "]" {%
  function(d) {
    return {[d[1][0]] : handleRepetition(d[7])};
  }
%}

attribute_name -> alphanum

data_rows -> data_row_or_star _ ("," _ data_row_or_star):* {%
  function(d) {
    return [d[0]].concat(d[2].map(item => item[2]));
  }
%}

data_row_or_star -> data_row | "*" {% function(d) { return d[0] === '*' ? '*' : d[0]; } %}

data_row -> "[" _ value_edge_list _ "]" {%
  function(d) {
    if (typeof(d[2][0]) == "object") { //edge type
		return d[2][0];
  }
	else { // value type
		return d[2] 
	}
  }
%}

value_edge_list -> edge_list | value_list {%
	function (d) {
		return d[0]
	}
%}

value_list -> value _ ("," _ value):* {%
  function(d) {
    return [d[0][0]].concat(d[2].map(item => item[2][0]));
  }
%}

edge_list -> edge _ ("," _ edge):* {%
  function(d) {
    return [d[0]].concat(d[2].map(item => item[2]));
  }
%}

edge -> "(" _ value _ "," _ value _ ")" {%
	function (d) {
		return {startPoint:d[2], endPoint:d[6]};
	}
%}

value -> alphanum

number -> [0-9]:+ {% function(d) { return parseInt(d[0].join(""), 10); } %}

alphanum -> [a-zA-Z0-9\/\\<>#@$&|]:+ {% function(d) { return d[0].join(""); } %}

_ -> [ \t\n\r]:*  # Skip whitespace