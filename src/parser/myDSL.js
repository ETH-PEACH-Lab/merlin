// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
		structure : null,
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
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$string$1", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "main$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"d"}, {"literal":"r"}, {"literal":"a"}, {"literal":"w"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["_", "main$ebnf$1$subexpression$1$string$1", "_", "draw_section", "_"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "main$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main", "symbols": ["_", "main$string$1", "_", "data_entries", "_", "main$ebnf$1"], "postprocess": 
          function(data) {
        let result = {data: data[3]};
        if (data[5]) {
        	result.draw = data[5][3]
        }
            return result;
          }
        },
    {"name": "draw_section$ebnf$1", "symbols": []},
    {"name": "draw_section$ebnf$1", "symbols": ["draw_section$ebnf$1", "draw_entry"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "draw_section", "symbols": ["draw_section$ebnf$1"], "postprocess": 
        function (data) {
        	return data[0];
        }
        },
    {"name": "draw_entry", "symbols": ["_", "page_entry", "_"], "postprocess": 
        function (data) {
        	return data[1]
        }
        
        },
    {"name": "page_entry$string$1", "symbols": [{"literal":"p"}, {"literal":"a"}, {"literal":"g"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "page_entry$string$2", "symbols": [{"literal":":"}, {"literal":"="}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "page_entry$ebnf$1", "symbols": []},
    {"name": "page_entry$ebnf$1$subexpression$1", "symbols": ["_", "show_entry", "_"]},
    {"name": "page_entry$ebnf$1", "symbols": ["page_entry$ebnf$1", "page_entry$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "page_entry", "symbols": ["_", "page_entry$string$1", "_", "page_index", "_", "page_entry$string$2", "_", "range_entry", "_", {"literal":"{"}, "page_entry$ebnf$1", "_", {"literal":"}"}, "_"], "postprocess": 
        function (data) {
        	let result = {};
        	result.page_index = data[3][0];
        	result.range = data[7];
        	result.show = data[10].map((item)=>item[1]);
        	return result;
        }
        
        },
    {"name": "range_entry", "symbols": [{"literal":"["}, "_", "number", {"literal":","}, "number", "_", {"literal":"]"}], "postprocess": 
        function (data) {
        	return {start:data[2], end:data[4]}
        }
        },
    {"name": "page_index", "symbols": ["alphanum"]},
    {"name": "show_entry$string$1", "symbols": [{"literal":"s"}, {"literal":"h"}, {"literal":"o"}, {"literal":"w"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "show_entry", "symbols": ["show_entry$string$1", "_", "component_name", "_", {"literal":"["}, "_", "component_index", "_", {"literal":"]"}, "_"], "postprocess": 
        function (data) {
        	return {component_name: data[2][0], component_index: data[6]};
        }
        
        },
    {"name": "component_index$ebnf$1", "symbols": [/[A-Za-z0-9_\-\+\*/]/]},
    {"name": "component_index$ebnf$1", "symbols": ["component_index$ebnf$1", /[A-Za-z0-9_\-\+\*/]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "component_index", "symbols": ["component_index$ebnf$1"], "postprocess": 
        function (data) {
        	return data[0].join("");
        }
        },
    {"name": "component_name", "symbols": ["alphanum"]},
    {"name": "data_entries$ebnf$1", "symbols": []},
    {"name": "data_entries$ebnf$1$subexpression$1", "symbols": ["_", "data_entry"]},
    {"name": "data_entries$ebnf$1", "symbols": ["data_entries$ebnf$1", "data_entries$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "data_entries", "symbols": ["data_entry", "data_entries$ebnf$1"], "postprocess": 
        function(d) {
          return [d[0]].concat(d[1].map(item => item[1]));
        }
        },
    {"name": "data_entry$ebnf$1", "symbols": []},
    {"name": "data_entry$ebnf$1", "symbols": ["data_entry$ebnf$1", "data_description"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "data_entry", "symbols": ["data_type", "_", "var_name", "_", {"literal":"="}, "_", {"literal":"{"}, "_", "data_entry$ebnf$1", "_", {"literal":"}"}], "postprocess": 
        function(d) {
        	  switch (d[0][0]) {
        		  case "array": 
        			let array_result = { type: d[0][0], name: d[2], value: handleRepetition(d[8]), raw_data: d[8]};
        			array_result.attributes = createAttributes(d[8]);
        			return array_result;
        			break;
        		case "stack": 
        			let stack_result = { type: d[0][0], name: d[2], value: handleRepetition(d[8]), raw_data: d[8]};
        			stack_result.attributes = createAttributes(d[8]);
        			return stack_result;
        			break;
        		case "tree": 
        			let tree_result = { type: d[0][0], name: d[2], value: handleRepetition(d[8]), raw_data: d[8]};
        			tree_result.attributes = createAttributes(d[8]);
        			return tree_result;
        			break;
        		case "linkedlist": 
        			let linkedlist_result = { type: d[0][0], name: d[2], value: handleRepetition(d[8]), raw_data: d[8]};
        			linkedlist_result.attributes = createAttributes(d[8]);
        			return linkedlist_result;
        			break;
        		case "matrix":
        			 // TODO 
        			break;
        		default:
        			return;
        			break
        	  }
        	 
        }
        },
    {"name": "data_type$string$1", "symbols": [{"literal":"a"}, {"literal":"r"}, {"literal":"r"}, {"literal":"a"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_type", "symbols": ["data_type$string$1"]},
    {"name": "data_type$string$2", "symbols": [{"literal":"s"}, {"literal":"t"}, {"literal":"a"}, {"literal":"c"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_type", "symbols": ["data_type$string$2"]},
    {"name": "data_type$string$3", "symbols": [{"literal":"l"}, {"literal":"i"}, {"literal":"n"}, {"literal":"k"}, {"literal":"e"}, {"literal":"d"}, {"literal":"l"}, {"literal":"i"}, {"literal":"s"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_type", "symbols": ["data_type$string$3"]},
    {"name": "data_type$string$4", "symbols": [{"literal":"t"}, {"literal":"r"}, {"literal":"e"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_type", "symbols": ["data_type$string$4"]},
    {"name": "data_type$string$5", "symbols": [{"literal":"m"}, {"literal":"a"}, {"literal":"t"}, {"literal":"r"}, {"literal":"i"}, {"literal":"x"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "data_type", "symbols": ["data_type$string$5"]},
    {"name": "var_name$ebnf$1", "symbols": []},
    {"name": "var_name$ebnf$1", "symbols": ["var_name$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "var_name", "symbols": ["var_name$ebnf$1"], "postprocess": function(d) { return d.join("").replace(",",""); }},
    {"name": "data_description", "symbols": ["_", "attribute_name", "_", {"literal":":"}, "_", {"literal":"["}, "_", "data_rows", "_", {"literal":"]"}, "_"], "postprocess": 
        function(d) {
          return {[d[1][0]] : handleRepetition(d[7])};
        }
        },
    {"name": "attribute_name", "symbols": ["alphanum"]},
    {"name": "data_rows$ebnf$1", "symbols": []},
    {"name": "data_rows$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "data_row_or_star"]},
    {"name": "data_rows$ebnf$1", "symbols": ["data_rows$ebnf$1", "data_rows$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "data_rows", "symbols": ["data_row_or_star", "data_rows$ebnf$1"], "postprocess": 
        function(d) {
          return [d[0]].concat(d[1].map(item => item[3]));
        }
        },
    {"name": "data_row_or_star", "symbols": ["data_row"]},
    {"name": "data_row_or_star", "symbols": [{"literal":"*"}], "postprocess": function(d) { return d[0] === '*' ? '*' : d[0]; }},
    {"name": "data_row", "symbols": [{"literal":"["}, "_", "value_list", "_", {"literal":"]"}], "postprocess": 
        function(d) {
          return d[2];
        }
        },
    {"name": "value_list$ebnf$1", "symbols": []},
    {"name": "value_list$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "value_list$ebnf$1", "symbols": ["value_list$ebnf$1", "value_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "value_list", "symbols": ["value", "value_list$ebnf$1"], "postprocess": 
        function(d) {
          return [d[0][0]].concat(d[1].map(item => item[3][0]));
        }
        },
    {"name": "value", "symbols": ["alphanum"]},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": function(d) { return parseInt(d[0].join(""), 10); }},
    {"name": "alphanum$ebnf$1", "symbols": [/[a-zA-Z0-9]/]},
    {"name": "alphanum$ebnf$1", "symbols": ["alphanum$ebnf$1", /[a-zA-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "alphanum", "symbols": ["alphanum$ebnf$1"], "postprocess": function(d) { return d[0].join(""); }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \t\n\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
