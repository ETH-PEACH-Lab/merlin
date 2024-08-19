import { parserMyDSL } from "../parser/test.mjs";
import { convertDSLtoMermaid } from "./myCompiler.mjs";

const input = `
data: 
graph gp = {
id : [[node1,node2,node3,node4], *, *]
edge:[[(node1,node2),(node1,node4)], *, *]
value:[[1,2,3,4], *, *]
color : [[blue,blue,blue,red], *, *]
}
array ar = {
structure : [[1],[1,2,3],[1,2,3,4]]
color : [[blue, red], [green], *, [black, white, grey]]
}

draw:
page p := [0,1] {
show matrix[1]
show arr[p+4]
}
`;

console.log(JSON.stringify(parserMyDSL(input), null, 1));