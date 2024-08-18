Main -> data_row

data_row -> "[" _ edge_list | value_list _ "]" {%
  function(d) {
    return d[2];
  }
%}

edge_list -> edge (_ "," _ edge):* {%
  function(d) {
    return [d[0]].concat(d[1].map(item => item[3]));
  }
%}

value_list -> value (_ "," _ value):* {%
  function(d) {
    return [d[0][0]].concat(d[1].map(item => item[3][0]));
  }
%}

edge -> _ "(" _ value _ "," _ value _ ")" {%
	function (d) {
		return {startPoint:d[3], endPoint:d[7]};
	}
%}

value -> alphanum

number -> [0-9]:+ {% function(d) { return parseInt(d[0].join(""), 10); } %}

alphanum -> [a-zA-Z0-9]:+ {% function(d) { return d[0].join(""); } %}

_ -> [ \t\n\r]:*  # Skip whitespace