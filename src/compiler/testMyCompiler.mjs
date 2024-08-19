import { convertDSLtoMermaid } from "./myCompiler.mjs";

const input = `
data: 
graph gp = {
id : [[node1,node2,node3,node4,node5], [node1,node2,node3,node4,node5], *, *, *, *]
edge : [[(node1, node2)], [(node1, node2)], [(node2, node3), (node1, node2), (node1, node3)], *, *, *]
color:[[blue], [null, blue], [null, null, blue]]
}

draw:
page p := [0,3] {
show gp[p]
}
`;

convertDSLtoMermaid(input);