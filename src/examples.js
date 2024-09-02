export const examples = [
  {
    "id":"commonErrors",
    "title":"Common Errors",
    "tags":[],
    "svg":``,
    "userCode":`// common error
// 1.page index exceeds data structure, i.e no array[9] but there are only 5 element in array
// 2.invalid input format
// 3.arrow field with ""
// 4.can't find component name
// 5.page index is invalid, like -1`,
  },
  {
    "id":"graphExample",
    "title":"Example - graph",
    "userCode":`data:
graph gh = {
id:[[n1],[n1,n2],[n1,n2,n3]]
value:[[1],[1,2],[1,2,3]]
edge:[[(node1,node1)]]
}
draw:
page p := [0,2] {
show gh[p]
}`,  
  },
  {
    "id":"arrayExample",
    "title":"Example - array",
    "userCode":`data:
array arr1 = {
structure:[[1],[1,2],[1,2,3]]
}
array arr2 = {
structure:[[3,2,1],[2,1],[1]]
}
draw:
page p := [0,2] {
show arr1[p]
show arr2[p]
}`,  
  },
  {
  "id":"TutorialFibonacci",
  "title":"Tutorial - Fibonacci",
  "userCode":`data:
array arr1 = {
  structure:[[1],[1,1],[1,1,2]]
  value:[[1],[1,1],[1,1,2]]
  color:[[null],[null,null],[null,null,null]]
}
draw:
page p:=[0,2] {
show arr1[p]
}`
  },
  {
    "id":"playground",
    "title":"Playground",
    "userCode" : ``,
  },
    {
      "id":"task1LCAofTree",
      "title":"Task 1 - LCA in a tree",
      "userCode" : `data:
tree tr1 = {
    structure:[[n1,n2,n3,n4,n5,n6,n7]]
    value:[[1,2,3,4,5,6,7]]
    color:[[null,null,blue,null,blue]]
}
draw:
page p := [0,0] {
    show tr1[p]
}`,
    },
    {
      "id":"task2DepthFirstSearch",
      "title":"Task 2 - Depth First Search",
      "userCode" : `data:
graph dfs = {
  id:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  edge:[[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)],[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)],[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)],[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)]]
  value:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  color:[[red,null,null,null,null,null,null,null],[blue,red,null,null,null,null,null,null],[blue,blue,red,null,null,null,null,null],[blue,blue,blue,null,red,null,null,null]]
  arrow:[[start,null,null,null,null,null,null,null],[null,cur,null,null,null,null,null,null],[null,null,cur,null,null,null,null,null],[null,null,null,null,cur,null,null,null]]
}
draw:
page p:=[0,3] {
show dfs[p]
}`,
    },
    {
      "id":"task3NumbersOfIslands",
      "title":"Task 3 - Numbers of Islands",
      "userCode" : `data:
matrix mr1 = {
  structure:[[[0,0,1,0],[0,1,1,0],[1,0,0,0],[0,0,1,1]]]
  color:[[[null,null,red,null]]]

}
draw:
page p:=[0,0] {
show mr1[p]
}`,
    },
    {
      "id":"task4ValidBrackets",
      "title":"Task 4 - Valid Brackets",
      "userCode" : `data:
array arr = {
  structure:[[{,{,{,},{,},},{,}]]
}
stack stk = {
    structure: [[{]]
}
draw:
page p:=[0,0] {
show arr[p]
show stk[p]
}`,
    },
];