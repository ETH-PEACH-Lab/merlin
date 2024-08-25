import nearley from 'nearley';
import grammar from './myDSL.js';  // Compiled from data_structure_extended_with_strings.ne

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

const input = `data:
array arr1 = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5],*]
color:[[blue],[null,blue],[null,null,blue]]
}
array arr2 = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[red],[null,red],[null,null,red]]
}
stack st = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
array arr1 = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5],*]
color:[[blue],[null,blue],[null,null,blue]]
}
array arr2 = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[red],[null,red],[null,null,red]]
}
graph gp = {
id: [[node1,node2,node3,node4],*,*]
edge:[[(node1,node2),(node1,node4)],*,*]
value:[[1,2,3,4],*,*]
color: [[blue,blue,blue,red],*,*]
}
array ar = {
structure: [[1],[1,2,3],[1,2,3,4]]
color: [[blue,red],[green],*,[black,white,grey]]
}
graph gp = {
id: [[node1,node2,node3,node4],*,*]
edge:[[(node1,node2),(node1,node4)],*,*]
value:[[1,2,3,4],*,*]
color: [[blue,blue,blue,red],*,*]
}
array ar = {
structure: [[1],[1,2,3],[1,2,3,4]]
color: [[blue,red],[green],*,[black,white,grey]]
}
graph gp = {
id: [[node1,node2,node3,node4],*,*]
edge:[[(node1,node2),(node1,node4)],*,*]
value:[[1,2,3,4],*,*]
color: [[blue,blue,blue,red],*,*]
}
array ar = {
structure: [[1],[1,2,3],[1,2,3,4]]
color: [[blue,red],[green],*,[black,white,grey]]
}
graph gp = {
id: [[node1,node2,node3,node4],*,*]
edge:[[(node1,node2),(node1,node4)],*,*]
value:[[1,2,3,4],*,*]
color: [[blue,blue,blue,red],*,*]
}
array ar = {
structure: [[1],[1,2,3],[1,2,3,4]]
color: [[blue,red],[green],*,[black,white,grey]]
}
matrix mr = {
structure:[[[1]],[[1],[1,2]],[[1],[1,2],[1,2,3]],[[1],[1,2],[1,2,3],[1,2,3,4]]]
}
graph gp = {
id: [[node1,node2,node3,node4],*,*]
edge:[[(node1,node2),(node1,node4)],*,*]
value:[[1,2,3,4],*,*]
color: [[blue,blue,blue,red],*,*]
}
array ar = {
structure: [[1],[1,2,3],[1,2,3,4]]
color: [[blue,red],[green],*,[black,white,grey]]
}
matrix mr = {
structure:[[[1]],[[1],[1,2]],[[1],[1,2],[1,2,3]],[[1],[1,2],[1,2,3],[1,2,3,4]],*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*]
id:[[[1]],[[1],[1,2]],[[1],[1,2],[1,2,3]],[[1],[1,2],[1,2,3],[1,2,3,4]],*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*]
color:[[[1]],[[1],[1,2]],[[1],[1,2],[1,2,3]],[[1],[1,2],[1,2,3],[1,2,3,4]],*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*,*]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}
tree tr = {
structure: [[1],[1,2],[1,2,3],[1,2,3,4],[1,2,3,4,5]]
color: [[blue],[null,blue],[null,null,blue]]
id: [[blue],[null,blue],[null,null,blue]]
arrow: [[blue],[null,blue],[null,null,blue]]
null: [[blue],[null,blue],[null,null,blue]]
input: [[blue],[null,blue],[null,null,blue]]
example: [[blue],[null,blue],[null,null,blue]]
float: [[blue],[null,blue],[null,null,blue]]
double: [[blue],[null,blue],[null,null,blue]]
}

draw:
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
    page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[fadgda]
}
page p := [0,4] {
    show arr1[p]
    show st[p]
}
page p := [1,4] {
    show arr1[p+4]
    show st[dfgsgfdsgdsfgdfsgdssd]
}`;

parser.feed(input);
const parsedData = parser.results[0];  // Parsed output

console.log(JSON.stringify(parsedData, null, 2));
