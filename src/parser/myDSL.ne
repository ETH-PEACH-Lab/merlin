# data_structure_extended_with_strings_corrected.ne

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
%}

main -> _ "data:" _ data_entries _ (_ "draw:" _ draw_section _):? {%
  function(data) {
	let result = {data: data[3]};
	if (data[5]) {
		result.draw = data[5][3]
	}
    return result;
  }
%}

draw_section -> draw_entry :* {%
	function (data) {
		return data[0];
	}
%}

draw_entry -> _ page_entry _ {%
	function (data) {
		return data[1]
	}

%}

page_entry -> _ "page" _ page_index _ ":=" _ range_entry _ "{" (_ show_entry _):* _ "}" _ {%
	function (data) {
		let result = {};
		result.page_index = data[3][0];
		result.range = data[7];
		result.show = data[10].map((item)=>item[1]);
		return result;
	}

%}

range_entry -> "[" _  number "," number _ "]" {%
	function (data) {
		return {start:data[2], end:data[4]}
	}
%}

page_index -> alphanum

show_entry-> "show" _ component_name _ "[" _ component_index _ "]" _ {%
	function (data) {
		return {component_name: data[2][0], component_index: data[6]};
	}

%}

component_index -> [A-Za-z0-9_\-\+\*/]:+ {%
	function (data) {
		return data[0].join("");
	}
%}

component_name -> alphanum



data_entries -> data_entry (_ data_entry):* {%
  function(d) {
    return [d[0]].concat(d[1].map(item => item[1]));
  }
%}

data_entry -> data_type _ var_name _ "=" _ "{" _ data_description _  "}" {%
  function(d) {
	  switch (d[0][0]) {
		  case "array": 
			return { type: d[0][0], name: d[2], value: handleRepetition(d[8])};
			break;
		case "stack": 
			return { type: d[0][0], name: d[2], value: handleRepetition(d[8])};
			break;
		case "tree": 
			return { type: d[0][0], name: d[2], value: handleRepetition(d[8])};
			break;
		case "linkedlist": 
			return { type: d[0][0], name: d[2], value: handleRepetition(d[8])};
			  break;
		case "matrix":
			 // TODO 
			break;
		default:
			  return;
			  break
	  }
	 
  }
%}

data_type -> "array" | "stack" | "linkedlist" | "tree" | "matrix"

var_name -> [a-zA-Z0-9_]:* {% function(d) { return d.join("").replace(",",""); } %}

data_description -> "[" _ data_rows _ "]" {%
  function(d) {
    return d[2];
  }
%}

data_rows -> data_row_or_star (_ "," _ data_row_or_star):* {%
  function(d) {
    return [d[0]].concat(d[1].map(item => item[3]));
  }
%}

data_row_or_star -> data_row | "*" {% function(d) { return d[0] === '*' ? '*' : d[0]; } %}

data_row -> "[" _ value_list _ "]" {%
  function(d) {
    return d[2];
  }
%}

value_list -> value (_ "," _ value):* {%
  function(d) {
    return [d[0][0]].concat(d[1].map(item => item[3][0]));
  }
%}

value -> alphanum

number -> [0-9]:+ {% function(d) { return parseInt(d[0].join(""), 10); } %}

alphanum -> [a-zA-Z0-9]:+ {% function(d) { return d[0].join(""); } %}

_ -> [ \t\n\r]:*  # Skip whitespace
