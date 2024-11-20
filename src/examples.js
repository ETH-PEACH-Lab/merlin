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
  structure:[[{,{,{,},{,},},{]]
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
    {
      "id":"01Matrix",
      "title":"01 - Matrix",
      "userCode" : `data:
matrix mr1 = {
  structure:[[[0,0,1,0,0],[0,0,1,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,0,1]],[[0,0,1,0,0],[0,0,1,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,0,1]],[[0,0,1,0,0],[0,0,1,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,0,1]]]
  value:[[[0,0,1,0,0],[0,0,1,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,0,1]],[[0,0,1,0,0],[0,0,1,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,0,1]],[[0,0,1,0,0],[0,0,1,0,0],[1,0,0,0,0],[0,0,0,0,1],[0,0,0,0,1]]]
  color:[[[null,null,red,null,null],[null,null,red,null,null],[red,null,null,null,null],[null,null,null,null,red],[null,null,null,null,red]],[[null,blue,red,blue,null],[blue,blue,red,blue,null],[red,blue,blue,null,blue],[blue,null,null,blue,red],[null,null,null,blue,red]],[[green,blue,red,blue,green],[blue,blue,red,blue,green],[red,blue,blue,green,blue],[blue,green,green,blue,red],[green,green,green,blue,red]]]
  arrow:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]]
  hidden:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]]
}
draw:
page p:=[0,2] {
show mr1[p]
}`,
    },
    {
      "id":"132Pattern",
      "title":"132 - Pattern",
      "userCode" : `data:
array arr1 = {
  structure:[[6,12,3,4,6,11,20],[6,12,3,4,6,11,20],[6,12,3,4,6,11,20],[6,12,3,4,6,11,20],[6,12,3,4,6,11,20]]
  value:[[6,12,3,4,6,11,20],[6,12,3,4,6,11,20],[6,12,3,4,6,11,20],[6,12,3,4,6,11,20],[6,12,3,4,6,11,20]]
  color:[[orange,orange,orange,orange,orange,orange,orange],[orange,orange,orange,orange,yellow,orange,orange],[orange,orange,orange,yellow,orange,orange,orange],[orange,orange,yellow,orange,orange,orange,orange],[orange,yellow,orange,orange,orange,orange,orange]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
array arr2 = {
  structure:[[6,6,3,3,3,3,3],[6,6,3,3,3,3,3],[6,6,3,3,3,3,3],[6,6,3,3,3,3,3],[6,6,3,3,3,3,3]]
  value:[[6,6,3,3,3,3,3],[6,6,3,3,3,3,3],[6,6,3,3,3,3,3],[6,6,3,3,3,3,3],[6,6,3,3,3,3,3]]
  color:[[green,green,green,green,green,green,green],[green,green,green,green,yellow,green,green],[green,green,green,yellow,green,green,green],[green,green,yellow,green,green,green,green],[green,yellow,green,green,green,green,green]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
stack stk = {
  structure:[[20],[11,20],[6,11,20],[4,6,11,20],[6,11,20]]
  value:[[20],[11,20],[11,20,20],[11,20,20,20],[11,20,20,20]]
  color:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null]]
  arrow:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null]]
  hidden:[[false],[false,false],[false,false,false],[false,false,false,false],[false,false,false,false]]
}
draw:
page p:=[0,4] {
show arr1[p]
show arr2[p]
show stk[p]
}`,
    },
    {
      "id":"3sum",
      "title":"3 Sum",
      "userCode" : `data:
array arr = {
  structure:[[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2]]
  value:[[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2],[4,1,1,0,1,2]]
  color:[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,green,green,null,null,green]]
  arrow:[[i,null,null,null,null,null],[i,lo,null,null,null,hi],[i,null,lo,null,null,hi],[i,null,null,lo,null,hi],[i,null,null,null,lo,hi],[null,i,null,null,null,null],[null,i,lo,null,null,hi],[null,i,lo,null,null,hi]]
  hidden:[[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false]]
}
draw:
page p:=[0,7] {
show arr[p]
}`,
    },
    {
      "id":"04",
      "title":"arithmetic-slices",
      "userCode" : `data:
array arr1 = {
  structure:[[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29]]
  value:[[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29],[1,3,5,6,10,15,20,25,28,29]]
  color:[[null,null,null,null,null,null,null,null,null,null],[green,green,green,null,null,null,null,null,null,null],[null,green,green,green,null,null,null,null,null,null],[null,null,green,green,green,null,null,null,null,null],[null,null,null,null,green,green,green,null,null,null],[null,null,null,null,null,green,green,green,null,null],[null,null,null,null,null,null,green,green,green,null],[null,null,null,null,null,null,null,green,green,green,null]]
  arrow:[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false]]
}
array arr2 = {
  structure:[[0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0],[0,0,1,2,0,0,0,0,0,0],[0,0,1,2,3,0,0,0,0,0],[0,0,1,2,3,0,0,0,0,0],[0,0,1,2,3,0,0,1,0,0],[0,0,1,2,3,0,0,0,0,0],[0,0,1,2,3,0,0,0,0,0]]
  value:[[0,0,0,0,0,0,0,0,0,0],[0,0,1,0,0,0,0,0,0,0],[0,0,1,2,0,0,0,0,0,0],[0,0,1,2,3,0,0,0,0,0],[0,0,1,2,3,0,0,0,0,0],[0,0,1,2,3,0,0,1,0,0],[0,0,1,2,3,0,0,0,0,0],[0,0,1,2,3,0,0,0,0,0]]
  color:[[null,null,null,null,null,null,null,null,null,null],[null,null,yellow,null,null,null,null,null,null,null],[null,null,null,yellow,null,null,null,null,null,null],[null,null,null,null,yellow,null,null,null,null,null],[null,null,null,null,null,null,yellow,null,null,null],[null,null,null,null,null,null,null,yellow,null,null,null],[null,null,null,null,null,null,null,null,yellow,null,null,null],[null,null,null,null,null,null,null,null,null,yellow,null,null,null]]
  arrow:[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false]]
}
draw:
page p:=[0,7] {
show arr1[p]
show arr2[p]
}`,
    },
    {
      "id":"05",
      "title":"binary subarrays with sum",
      "userCode" : `data:
array arr1 = {
  structure:[[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1]]
  value:[[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1],[1,0,1,0,1]]
  color:[[blue,null,null,null,null],[blue,blue,null,null,null],[blue,blue,blue,null,null],[blue,blue,blue,blue,null],[blue,blue,blue,blue,blue]]
  arrow:[[null,null,null,null,null],[null,cur,null,null,null],[null,null,cur,null,null],[null,null,null,cur,null],[null,null,null,null,cur]]
  hidden:[[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false]]
}
stack stk = {
  structure:[[1],[2],[1,2],[2,2],[1,2,2]]
  value:[[1],[1],[1,2],[2,2],[1,2,2]]
  color:[[null],[null],[null,null],[null,null],[null,null,null]]
  arrow:[[null],[null],[null,null],[null,null],[null,null,null]]
  hidden:[[false],[false],[false,false],[false,false],[false,false,false]]
}
draw:
page p:=[0,4] {
show arr1[p]
show stk[p]
}`,
},
{
  "id":"06",
  "title":"building with an ocean view",
  "userCode" : `data:
array arr1 = {
  structure:[[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1]]
  value:[[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1],[5,3,2,4,1,1]]
  color:[[green,blue,blue,blue,blue,blue],[green,green,blue,blue,blue,blue],[green,green,green,blue,blue,blue],[green,green,green,blue,blue,blue],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  arrow:[[cur,null,null,null,null,null],[null,cur,null,null,null,null],[null,null,cur,null,null,null],[null,null,null,cur,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false]]
}
array arr2 = {
  structure:[[0],[0,1],[0,1,2],[0,1,2]]
  value:[[0],[0,1],[0,1,2]]
  color:[[orange],[orange,orange],[orange,orange,orange],[orange,orange,orange]]
  arrow:[[null],[null,null],[null,null,null]]
  hidden:[[false],[false,false],[false,false,false]]
}
draw:
page p:=[0,3] {
show arr1[p]
show arr2[p]
}`,
},
{
  "id":"07",
  "title":"checking existence of edge length limited paths",
  "userCode" : `data:
graph dfs = {
  id:[[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6]]
  edge:[[(n1,n5),(n1,n4),(n2,n4),(n2,n3)],[(n2,n3)],[(n1,n4),(n2,n3)],[(n1,n4),(n2,n3),(n1,n5)],[(n1,n4),(n2,n3)],[(n1,n4),(n2,n3),(n1,n5),(n2,n5)],[(n1,n4),(n2,n3),(n1,n5),(n2,n5)],[(n1,n4),(n2,n3),(n1,n5),(n5,n6),(n3,n6)]]

}
draw:
page p:=[0,5] {
show dfs[p]
}`,
},
{
  "id":"08",
  "title":"construct binary search tree from preorder traversal",
  "userCode" : `data:
tree tr1 = {
  structure:[[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5]]
  value:[[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7],[8,5,10,1,7]]
  color:[[null,null,null,null,blue],[null,blue,null,null,green],[null,null,null,null,blue],[blue,null,null,null,null],[blue,null,green,null,null],[null,null,null,null,null],[null,null,null,null,null]]
  arrow:[[null,null,null,nd,null],[null,nd,null,null,null],[null,null,null,null,nd],[nd,null,null,null,null],[nd,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]
  hidden:[[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false]]
}
draw:
page p:=[0,4] {
show tr1[p]
}`,
},
{
  "id":"10",
  "title":"construct binary tree from inorder and postorder traversal",
  "userCode" : `data:
tree tr1 = {
    structure:[[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5]]
    value:[[3,9,20,15,7],[3,9,20,15,7],[3,9,20,15,7],[3,9,20,15,7],[3,9,20,15,7],[3,9,20,15,7],[3,9,20,15,7]]
    color:[[null,null,null,null,null],[blue],[blue,null,blue],[blue,null,blue,null,blue],[blue,null,blue,blue,blue],[blue,blue,blue,blue,blue]]
}
draw:
page p:=[0,5] {
show tr1[p]
}`,
},
{
  "id":"11",
  "title":"count nice pairs in an array",
  "userCode" : `data:
array arr1 = {
  structure:[[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3]]
  value:[[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3],[7,3,4,4,2,4,3,3]]
  color:[[green,null,null,null,null,null,null,null],[null,green,null,null,null,null,null,null],[null,null,green,null,null,null,null,null],[null,null,blue,green,null,null,null,null],[null,null,null,null,green,null,null,null],[null,null,blue,blue,null,green,null,null],[null,blue,null,null,null,null,green,null],[null,blue,null,null,null,null,blue,green],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false]]
}
draw:
page p:=[0,7] {
show arr1[p]
}`,
},
{
  "id":"12",
  "title":"count pairs in two arrays",
  "userCode" : `data:
array arr1 = {
  structure:[[2,1,0,1,2,4],[2,1,0,1,2,4],[2,1,0,1,2,4],[2,1,0,1,2,4],[2,1,0,1,2,4]]
  value:[[2,1,0,1,2,4],[2,1,0,1,2,4],[2,1,0,1,2,4],[2,1,0,1,2,4],[2,1,0,1,2,4]]
  color:[[null,yellow,null,green,null,yellow],[null,yellow,null,green,null,yellow],[null,null,null,null,yellow,yellow],[null,null,null,null,null,yellow],[null,null,null,null,yellow,green]]
  arrow:[[i,left,null,mid,null,right],[i,left,null,mid,null,right],[i,null,null,null,leftMid,right],[i,null,null,null,null,leftMidRight],[i,null,null,null,right,leftMid]]
  hidden:[[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false]]
}
draw:
page p:=[0,4] {
show arr1[p]
}`,
},
{
  "id":"13",
  "title":"count strictly increasing subarrays",
  "userCode" : `data:
array arr1 = {
  structure:[[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6]]
  value:[[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6],[1,3,5,4,4,6]]
  color:[[orange,null,null,null,null,null],[null,orange,null,null,null,null],[null,null,orange,null,null,null],[null,null,null,orange,null,null],[null,null,null,null,orange,null],[null,null,null,null,null,orange],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false]]
}
array arr2 = {
  structure:[[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5]]
  value:[[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5],[0,1,2,3,4,5]]
  color:[[orange,null,null,null,null,null],[null,orange,null,null,null,null],[null,null,orange,null,null,null],[null,null,null,orange,null,null],[null,null,null,null,orange,null],[null,null,null,null,null,orange],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false]]
}
draw:
page p:=[0,5] {
show arr1[p]
show arr2[p]
}`,
},
{
  "id":"14",
  "title":"Binary tree preorder traversal",
  "userCode" : `data:
tree tr1 = {
  structure:[[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7]]
  value:[[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7]]
  color:[[null,null,null,null,null,null,null],[blue,null,null,null,null,null,null],[blue,blue,null,null,null,null,null],[blue,blue,blue,null,null,null,null],[blue,blue,blue,blue,null,null,null],[blue,blue,blue,blue,blue,null,null],[blue,blue,blue,blue,blue,blue,null],[blue,blue,blue,blue,blue,blue,blue],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
draw:
page p:=[0,7] {
show tr1[p]
}`,
},
{
  "id":"15",
  "title":"Binary tree inorder traversal",
  "userCode" : `data:
tree tr1 = {
  structure:[[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7]]
  value:[[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7]]
  color:[[null,null,null,null,null,null,null],[null,null,null,red,null,null,null],[null,red,null,red,null,null,null],[null,red,null,red,red,null,null],[red,red,null,red,red,null,null],[red,red,null,red,red,red,null],[red,red,red,red,red,red,null],[red,red,red,red,red,red,red],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
draw:
page p:=[0,7] {
show tr1[p]
}`,
},
{
  "id":"16",
  "title":"Binary tree postorder traversal",
  "userCode" : `data:
tree tr1 = {
  structure:[[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7]]
  value:[[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7]]
  color:[[null,null,null,purple,null,null,null],[null,null,null,purple,purple,null,null],[null,purple,null,purple,purple,null,null],[null,purple,null,purple,purple,purple,null],[null,purple,null,purple,purple,purple,purple],[null,purple,purple,purple,purple,purple,purple],[purple,purple,purple,purple,purple,purple,purple],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
draw:
page p:=[0,6] {
show tr1[p]
}`,
},
{
  "id":"17",
  "title":"Binary tree level-order traversal",
  "userCode" : `data:
tree tr1 = {
  structure:[[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7]]
  value:[[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7],[1,2,3,4,5,6,7]]
  color:[[null,null,null,null,null,null,null],[pink,null,null,null,null,null,null],[pink,pink,null,null,null,null,null],[pink,pink,pink,null,null,null,null],[pink,pink,pink,pink,null,null,null],[pink,pink,pink,pink,pink,null,null],[pink,pink,pink,pink,pink,pink,null],[pink,pink,pink,pink,pink,pink,pink],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
draw:
page p:=[0,7] {
show tr1[p]
}`,
},
{
  "id":"18",
  "title":"find smallest common element in all rows",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]]]
  value:[[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]],[[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]]]
  color:[[[yellow,green,green,green,green],[orange,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[yellow,green,green,green,green],[orange,null,null,null,null],[orange,null,null,null,null],[null,null,null,null,null]],[[green,green,yellow,green,green],[null,orange,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[green,green,green,yellow,green],[null,orange,null,null,null],[null,orange,null,null,null],[null,null,null,null,null]],[[green,green,green,green,yellow],[null,null,orange,null,null],[null,orange,null,null,null],[null,null,orange,null,null]]]
  arrow:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]]
  hidden:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]]
}
array arr1 = {
  structure:[[F,N,N],[T,F,N],[F,N,N],[F,N,N],[F,N,N]]
  value:[[F,N,N],[T,F,N],[F,N,N],[F,N,N],[T,T,T]]
  color:[[null,null,null],[null,null,null],[null,null,null],[null,null,null],[green,green,green]]
  arrow:[[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
  hidden:[[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]]
}
draw:
page p:=[0,4] {
show mr1[p]
show arr1[p]
}`,
},
{
  "id":"19",
  "title":"find the safest path in a grid",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,1]],[[1,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,1]],[[1,2,1,0],[2,1,2,1],[1,2,1,2],[0,1,2,1]],[[3,2,1,0],[2,3,2,1],[1,2,3,2],[0,1,2,3]]]
  value:[[[1,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,1]],[[1,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,1]],[[1,2,1,0],[2,1,2,1],[1,2,1,2],[0,1,2,1]],[[3,2,1,0],[2,3,2,1],[1,2,3,2],[0,1,2,3]]]
  color:[[[null,null,null,pink],[null,null,null,null],[null,null,null,null],[pink,null,null,null]],[[null,null,green,pink],[null,null,null,green],[green,null,null,null],[pink,green,null,null]],[[null,blue,green,pink],[blue,null,blue,green],[green,blue,null,blue],[pink,green,blue,null]],[[orange,blue,green,pink],[blue,orange,blue,green],[green,blue,orange,blue],[pink,green,blue,orange]]]
  arrow:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,3] {
show mr1[p]
}`,
},
{
  "id":"20",
  "title":"number of closed islands",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]]]
  value:[[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]],[[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]]]
  color:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,pink],[null,null,null,null,pink],[null,null,null,null,pink],[null,null,null,null,pink]],[[null,null,null,null,pink],[null,null,null,null,pink],[null,null,null,null,pink],[null,null,null,null,pink]],[[null,null,null,null,pink],[null,purple,purple,null,pink],[null,purple,purple,null,pink],[null,null,null,null,pink]]]
  arrow:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,start],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,start],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,start,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,start,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]]
  hidden:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]]
}
draw:
page p:=[0,4] {
show mr1[p]
}`,
},
{
  "id":"21",
  "title":"number of enclaves",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]]]
  value:[[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]],[[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]]]
  color:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,red],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,red],[null,null,null,null,red],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,red],[null,null,null,null,red],[null,null,null,null,red],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,red],[null,null,null,null,red],[null,null,null,null,red],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,red],[null,null,null,null,red],[null,null,null,null,red],[null,null,null,red,null],[null,null,null,red,red]],[[null,null,null,null,red],[null,null,green,null,red],[null,green,null,null,red],[null,green,null,red,null],[null,null,null,red,red]]]
  arrow:[[[null,null,null,null,root],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,root],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,root],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,root],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,root,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,root,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,root,null]]]
  hidden:[[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]]
}
draw:
page p:=[0,6] {
show mr1[p]
}`,
},
{
  "id":"22",
  "title":"Numbers of Islands",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]]]
  value:[[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]],[[1,1,1],[0,1,0],[1,0,0],[1,0,1]]]
  color:[[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[blue,null,null],[null,null,null],[null,null,null],[null,null,null]],[[blue,blue,null],[null,null,null],[null,null,null],[null,null,null]],[[blue,blue,null],[null,blue,null],[null,null,null],[null,null,null]],[[blue,blue,blue],[null,blue,null],[null,null,null],[null,null,null]],[[blue,blue,blue],[null,blue,null],[null,null,null],[null,null,null]],[[blue,blue,blue],[null,blue,null],[pink,null,null],[null,null,null]],[[blue,blue,blue],[null,blue,null],[pink,null,null],[pink,null,null]],[[blue,blue,blue],[null,blue,null],[pink,null,null],[pink,null,null]],[[blue,blue,blue],[null,blue,null],[pink,null,null],[pink,null,green]]]
  arrow:[[[start,null,null],[null,null,null],[null,null,null],[null,null,null]],[[start,null,null],[null,null,null],[null,null,null],[null,null,null]],[[start,null,null],[null,null,null],[null,null,null],[null,null,null]],[[start,null,null],[null,null,null],[null,null,null],[null,null,null]],[[start,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[start,null,null],[null,null,null]],[[null,null,null],[null,null,null],[start,null,null],[null,null,null]],[[null,null,null],[null,null,null],[start,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,start]],[[null,null,null],[null,null,null],[null,null,null],[null,null,start]]]
  hidden:[[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]],[[null,null,null],[null,null,null],[null,null,null],[null,null,null]]]
}
draw:
page p:=[0,9] {
show mr1[p]
}`,
},
{
  "id":"24",
  "title":"pacific atlantic water flow",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]]]
  value:[[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]],[[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]]]
  color:[[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[blue,blue,blue,blue,blue,blue,blue,blue,blue],[blue,null,null,null,null,null,null,null,null],[blue,null,null,null,null,null,null,null,null],[blue,null,null,null,null,null,null,null,null],[blue,null,null,null,null,null,null,null,null]],[[blue,blue,blue,blue,blue,blue,blue,blue,blue],[blue,blue,blue,blue,blue,blue,blue,blue,blue],[blue,blue,blue,null,null,null,blue,null,blue],[blue,blue,null,null,null,null,blue,null,null],[blue,null,null,null,null,null,null,null,null]],[[blue,blue,blue,blue,blue,blue,blue,blue,yellow],[blue,blue,blue,blue,blue,blue,blue,blue,yellow],[blue,blue,blue,null,null,null,blue,null,yellow],[blue,blue,null,null,null,null,blue,null,yellow],[yellow,yellow,yellow,yellow,yellow,yellow,yellow,yellow,yellow]],[[blue,blue,blue,blue,blue,blue,blue,blue,yellow],[blue,blue,blue,blue,blue,blue,blue,blue,yellow],[blue,blue,yellow,null,null,null,blue,null,yellow],[yellow,yellow,yellow,yellow,yellow,null,yellow,yellow,yellow],[yellow,yellow,yellow,yellow,yellow,yellow,yellow,yellow,yellow]],[[blue,blue,blue,blue,blue,blue,blue,blue,yellow],[blue,blue,blue,blue,blue,blue,blue,blue,yellow],[blue,blue,yellow,null,null,null,blue,null,yellow],[yellow,yellow,green,green,green,null,yellow,green,green],[yellow,green,green,green,green,green,green,green,green]]]
  arrow:[[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]]]
  hidden:[[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]],[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]]]
}
draw:
page p:=[0,5] {
show mr1[p]
}`,
},
{
  "id":"25",
  "title":"score after flipping matrix",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[0,0,1,1],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,1,0],[1,0,0,0],[1,1,1,0]],[[1,1,1,0],[1,0,0,0],[1,1,1,0]]]
  value:[[[0,0,1,1],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,0,0],[1,0,1,0],[1,1,0,0]],[[1,1,1,0],[1,0,0,0],[1,1,1,0]],[[1,1,1,0],[1,0,0,0],[1,1,1,0]]]
  color:[[[pink,null,null,null],[null,null,null,null],[null,null,null,null]],[[blue,blue,blue,blue],[null,null,null,null],[null,null,null,null]],[[blue,blue,blue,blue],[green,null,null,null],[null,null,null,null]],[[blue,blue,blue,blue],[green,null,null,null],[green,null,null,null]],[[blue,green,blue,blue],[green,pink,null,null],[green,green,null,null]],[[blue,green,pink,blue],[green,pink,green,null],[green,green,pink,null]],[[blue,green,pink,blue],[green,pink,green,null],[green,green,pink,null]],[[blue,green,pink,orange],[green,pink,green,orange],[green,green,pink,orange]]]
  arrow:[[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,7] {
show mr1[p]
}`,
},
{
  "id":"26",
  "title":"shift 2d grid",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,1,2,0],[0,0,0,0]],[[0,0,0,0],[0,1,2,3],[0,0,0,0]],[[0,0,0,0],[0,1,2,3],[4,0,0,0]],[[0,0,0,0],[0,1,2,3],[4,5,0,0]],[[0,0,0,0],[0,1,2,3],[4,5,6,0]],[[0,0,0,0],[0,1,2,3],[4,5,6,7]],[[8,0,0,0],[0,1,2,3],[4,5,6,7]],[[8,9,0,0],[0,1,2,3],[4,5,6,7]],[[8,9,10,0],[0,1,2,3],[4,5,6,7]],[[8,9,10,11],[0,1,2,3],[4,5,6,7]],[[8,9,10,11],[12,1,2,3],[4,5,6,7]]]
  value:[[[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,1,2,0],[0,0,0,0]],[[0,0,0,0],[0,1,2,3],[0,0,0,0]],[[0,0,0,0],[0,1,2,3],[4,0,0,0]],[[0,0,0,0],[0,1,2,3],[4,5,0,0]],[[0,0,0,0],[0,1,2,3],[4,5,6,0]],[[0,0,0,0],[0,1,2,3],[4,5,6,7]],[[8,0,0,0],[0,1,2,3],[4,5,6,7]],[[8,9,0,0],[0,1,2,3],[4,5,6,7]],[[8,9,10,0],[0,1,2,3],[4,5,6,7]],[[8,9,10,11],[0,1,2,3],[4,5,6,7]],[[8,9,10,11],[12,1,2,3],[4,5,6,7]]]
  color:[[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,pink,pink,null],[null,null,null,null]],[[null,null,null,null],[null,pink,pink,pink],[null,null,null,null]],[[null,null,null,null],[null,pink,pink,pink],[pink,null,null,null]],[[null,null,null,null],[null,pink,pink,pink],[pink,pink,null,null]],[[null,null,null,null],[null,pink,pink,pink],[pink,pink,pink,null]],[[null,null,null,null],[null,pink,pink,pink],[pink,pink,pink,pink]],[[pink,null,null,null],[null,pink,pink,pink],[pink,pink,pink,pink]],[[pink,pink,null,null],[null,pink,pink,pink],[pink,pink,pink,pink]],[[pink,pink,pink,null],[null,pink,pink,pink],[pink,pink,pink,pink]],[[pink,pink,pink,pink],[null,pink,pink,pink],[pink,pink,pink,pink]],[[pink,pink,pink,pink],[pink,pink,pink,pink],[pink,pink,pink,pink]]]
  arrow:[[[null,null,null,null],[null,start,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,11] {
show mr1[p]
}`,
},
];

/*
{
  "id":"task4ValidBrackets",
  "title":"Task 4 - Valid Brackets",
  "userCode" : ``,
},
*/

