import myParser from "./myParser.js";

const input=`data:
graph gh = {
id:[[n1],[n1,n2],[n1,n2,n3]]
value:[[1],[1,2],[1,2,3]]
edge:[[(node1,node1)]]
}
draw:
page p := [0,2] {
show gh[p]
}`;
console.log(myParser(input));