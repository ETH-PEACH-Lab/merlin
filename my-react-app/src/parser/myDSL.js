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
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "main$string$1", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "main", "symbols": ["_", "main$string$1", "_", "data_entries", "_"], "postprocess": 
        function(data) {
          return data[3];
        }
        },
    {"name": "data_entries$ebnf$1", "symbols": []},
    {"name": "data_entries$ebnf$1$subexpression$1", "symbols": ["_", "data_entry"]},
    {"name": "data_entries$ebnf$1", "symbols": ["data_entries$ebnf$1", "data_entries$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "data_entries", "symbols": ["data_entry", "data_entries$ebnf$1"], "postprocess": 
        function(d) {
          return [d[0]].concat(d[1].map(item => item[1]));
        }
        },
    {"name": "data_entry", "symbols": ["data_type", "_", "var_name", "_", {"literal":"="}, "_", "data_structure"], "postprocess": 
        function(d) {
        	  switch (d[0][0]) {
        		  case "array": 
        			return { type: d[0][0], name: d[2], value: handleRepetition(d[6])};
        			break;
        		case "stack": 
        			return { type: d[0][0], name: d[2], value: handleRepetition(d[6])};
        			break;
        		case "tree": 
        			return { type: d[0][0], name: d[2], value: handleRepetition(d[6])};
        			break;
        		case "linkedlist": 
        			return { type: d[0][0], name: d[2], value: handleRepetition(d[6])};
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
    {"name": "data_structure", "symbols": [{"literal":"["}, "_", "data_rows", "_", {"literal":"]"}], "postprocess": 
        function(d) {
          return d[2];
        }
        },
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
