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
{
  "id":"27",
  "title":"surrounded regions",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]]
  value:[[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]]
  color:[[[red,red,red,red],[red,red,red,red],[null,null,null,null],[red,null,null,null]],[[red,red,red,red],[red,red,red,red],[blue,null,null,null],[red,null,null,null]],[[red,red,red,red],[red,red,red,red],[blue,blue,null,null],[red,null,null,null]],[[red,red,red,red],[red,red,red,red],[blue,blue,blue,null],[red,null,null,null]],[[red,red,red,red],[red,red,red,red],[blue,blue,blue,blue],[red,null,null,null]],[[red,red,red,red],[red,red,red,red],[blue,blue,blue,blue],[red,null,null,blue]],[[red,red,red,red],[red,red,red,red],[blue,blue,blue,blue],[red,null,blue,blue]],[[red,red,red,red],[red,red,red,red],[blue,blue,blue,blue],[red,blue,blue,blue]]]
  arrow:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,7] {
show mr1[p]
}`,
},
{
  "id":"28",
  "title":"Unique path ii",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,0,1,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,0,0,1],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]]]
  value:[[[1,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[1,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,0,1,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,0,0,1],[0,0,0,2],[0,0,0,0],[0,0,0,0]],[[0,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]]]
  color:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[red,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[red,red,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[red,red,red,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[red,red,red,red],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[red,red,red,red],[null,null,null,green],[null,null,null,null],[null,null,null,null]]]
  arrow:[[[start,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[start,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,5] {
show mr1[p]
}`,
},
{
  "id":"30",
  "title":"Word Search",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]]]
  value:[[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]]]
  color:[[[green,null,null,null]],[[green,null,null,null]],[[green,green,null,null]],[[green,green,red,null]],[[green,green,green,null]],[[green,green,green,green]]]
  arrow:[[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]]]
  hidden:[[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]]]
}
matrix mr2 = {
  structure:[[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]]
  value:[[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]]
  color:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,red],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,red],[null,null,green,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,red],[null,null,green,green],[null,null,null,null]]]
  arrow:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,5] {
show mr1[p]
show mr2[p]
}`,
},
{
  "id":"31",
  "title":"kth largest element in a stream",
  "userCode" : `data:
array arr1 = {
  structure:[[2,4,8,5],[4,5,8],[4,5,8],[5,5,8],[5,8,10],[8,9,10]]
  value:[[2,4,8,5],[4,5,8],[4,5,8],[5,5,8],[5,8,10],[8,9,10]]
  color:[[null,null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
  arrow:[[null,null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
  hidden:[[false,false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]]
}
array arr2 = {
  structure:[[2,3,4,5,8],[2,3,4,5,5,8],[2,3,4,5,5,8,10],[2,3,4,5,5,8,9,10]]
  value:[[2,3,4,5,8],[2,3,4,5,5,8],[2,3,4,5,5,8,10],[2,3,4,5,5,8,9,10]]
  color:[[null,null,green,null,null],[null,null,null,green,null,null],[null,null,null,null,green,null,null],[null,null,null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false]]
}
draw:
page p:=[0,5] {
show arr1[p]
}
page p:=[3,5] {
show arr2[p-3]
}`,
},
{
  "id":"32",
  "title":"validate binary search tree",
  "userCode" : `data:
tree tr1 = {
  structure:[[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7]]
  value:[[5,1,4,0,2,3,6],[5,1,4,0,2,3,6],[5,1,4,0,2,3,6],[5,1,4,0,2,3,6]]
  color:[[blue,null,null,0,null,null,null],[blue,red,null,red,red,null,null],[blue,red,green,red,red,green,green],[blue,red,green,red,red,green,green]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,notBST,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
draw:
page p:=[0,3] {
show tr1[p]
}`,
},
{
  "id":"33",
  "title":"add two numbers ii",
  "userCode" : `data:
linkedlist li1 = {
  structure:[[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4]]
  value:[[3,4,2,7],[3,4,2,7],[3,4,2,7],[3,4,2,7],[3,4,2,7]]
  color:[[red,null,null,null],[red,red,null,null],[red,red,red,null],[red,red,red,red],[red,red,red,red]]
  arrow:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
  hidden:[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]
}
linkedlist li2 = {
  structure:[[n1,n2,n3],[n1,n2,n3],[n1,n2,n3],[n1,n2,n3],[n1,n2,n3]]
  value:[[4,6,5],[4,6,5],[4,6,5],[4,6,5],[4,6,5]]
  color:[[red,null,null],[red,red,null],[red,red,red],[red,red,red],[red,red,red]]
  arrow:[[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
  hidden:[[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]]
}
linkedlist li3 = {
  structure:[[n1,n2],[n1,n2,n3],[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4,n5]]
  value:[[7,0],[7,0,1],[7,0,8,0],[7,0,8,7,0],[7,0,8,7,0]]
  color:[[green,null],[green,green,green],[green,green,green,green],[green,green,green,green],[green,green,green,green,green]]
  arrow:[[null,null],[null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,return]]
  hidden:[[false,false],[false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]]
}
draw:
page p:=[0,4] {
show li1[p]
show li2[p]
show li3[p]
}`,
},
{
  "id":"34",
  "title":"print-immutable-linked-list-in-reverse",
  "userCode" : `data:
linkedlist li = {
  structure:[[n1,n2,n3],[n1,n2,n3],[n1,n2,n3],[n1,n2,n3],[n1,n2,n3]]
  value:[[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,3]]
  color:[[green,null,null],[null,green,null],[null,null,green],[null,null,red],[null,red,null]]
  arrow:[[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
  hidden:[[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]]
}
stack stk = {
  structure:[[1],[2,1],[3,2,1],[2,1],[1]]
  value:[[1],[1,1],[1,2,1],[1,1],[1]]
  color:[[green],[green,null],[green,null,null],[null,null],[null]]
  arrow:[[null],[null,null],[null,null,null],[null,null],[null]]
  hidden:[[false],[false,false],[false,false,false],[false,false],[false]]
}
draw:
page p:=[0,4] {
show li[p]
show stk[p]
}`,
},
{
  "id":"36",
  "title":"count-substrings-with-only-one-distinct-letter",
  "userCode" : `data:
array arr1 = {
  structure:[[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c]]
  value:[[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c],[a,a,a,a,b,b,a,c,c,c]]
  color:[[pink,null,null,null,null,null,null,null,null,null],[null,pink,null,null,null,null,null,null,null,null],[null,null,pink,null,null,null,null,null,null,null],[null,null,null,pink,null,null,null,null,null,null],[null,null,null,null,pink,null,null,null,null,null],[null,null,null,null,null,pink,null,null,null,null],[null,null,null,null,null,null,pink,null,null,null],[null,null,null,null,null,null,null,pink,null,null],[null,null,null,null,null,null,null,null,pink,null],[null,null,null,null,null,null,null,null,null,pink]]
  arrow:[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false]]
}
array arr2 = {
  structure:[[1,0,0,0,0,0,0,0,0,0],[1,2,0,0,0,0,0,0,0,0],[1,2,3,0,0,0,0,0,0,0],[1,2,3,4,0,0,0,0,0,0],[1,2,3,4,1,0,0,0,0,0],[1,2,3,4,1,2,0,0,0,0],[1,2,3,4,1,2,1,0,0,0],[1,2,3,4,1,2,1,1,0,0],[1,2,3,4,1,2,1,1,2,0],[1,2,3,4,1,2,1,1,2,3]]
  value:[[1,0,0,0,0,0,0,0,0,0],[1,2,0,0,0,0,0,0,0,0],[1,2,3,0,0,0,0,0,0,0],[1,2,3,4,0,0,0,0,0,0],[1,2,3,4,1,0,0,0,0,0],[1,2,3,4,1,2,0,0,0,0],[1,2,3,4,1,2,1,0,0,0],[1,2,3,4,1,2,1,1,0,0],[1,2,3,4,1,2,1,1,2,0],[1,2,3,4,1,2,1,1,2,3]]
  color:[[pink,null,null,null,null,null,null,null,null,null],[null,pink,null,null,null,null,null,null,null,null],[null,null,pink,null,null,null,null,null,null,null],[null,null,null,pink,null,null,null,null,null,null],[null,null,null,null,pink,null,null,null,null,null],[null,null,null,null,null,pink,null,null,null,null],[null,null,null,null,null,null,pink,null,null,null],[null,null,null,null,null,null,null,pink,null,null],[null,null,null,null,null,null,null,null,pink,null],[null,null,null,null,null,null,null,null,null,pink]]
  arrow:[[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false]]
}
draw:
page p:=[0,9] {
show arr1[p]
show arr2[p]
}`,
},
{
  "id":"37",
  "title":"vote game",
  "userCode" : `data:
array arr = {
  structure:[[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r]]
  value:[[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r],[d,r,d,r,d,r]]
  color:[[null,null,null,null,null,null],[null,null,null,null,null,red],[null,vote,null,null,red,red],[null,null,null,red,red,red],[null,null,red,red,red,red],[null,red,red,red,red,red],[green,null,null,null,null,null]]
  arrow:[[vote,null,null,null,null,null],[vote,null,null,null,null,null],[null,vote,null,null,null,null],[null,null,vote,null,null,null],[null,vote,null,null,null,null],[vote,null,null,null,null,null],[win,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false]]
}
draw:
page p:=[0,6] {
show arr[p]
}`,
},
{
  "id":"38",
  "title":"longest-word-in-dictionary-through-deleting",
  "userCode" : `data:
array arr1 = {
  structure:[[a,l,e],[a,l,e],[a,l,e],[a,l,e],[a,l,e],[a,l,e],[a,l,e]]
  value:[[a,l,e],[a,l,e],[a,l,e],[a,l,e],[a,l,e],[a,l,e],[a,l,e]]
  color:[[null,null,null],[red,null,null],[red,red,null],[red,red,null],[red,red,null],[red,red,null],[red,red,red]]
  arrow:[[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null],[null,null,null]]
  hidden:[[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false],[false,false,false]]
}
array arr2 = {
  structure:[[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e]]
  value:[[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e],[a,p,p,l,l,e]]
  color:[[null,null,null,null,null,null],[blue,null,null,null,null,null],[blue,pink,null,null,null,null],[blue,pink,pink,null,null,null],[blue,pink,pink,blue,null,null],[blue,pink,pink,blue,blue,null],[blue,pink,pink,blue,blue,red]]
  arrow:[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false],[false,false,false,false,false,false]]
}
draw:
page p:=[0,6] {
show arr1[p]
show arr2[p]
}`,
},
{
  "id":"39",
  "title":"minimum-length-of-string-after-deleting-similar-ends",
  "userCode" : `data:
array arr = {
  structure:[[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a]]
  value:[[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a],[a,a,b,c,c,a,b,b,a]]
  color:[[blue,null,null,null,null,null,null,null,red],[blue,blue,null,null,null,null,null,null,red],[blue,blue,blue,null,null,null,null,red,red],[blue,blue,blue,blue,null,null,null,red,red],[blue,blue,blue,blue,blue,null,null,red,red],[blue,blue,blue,blue,blue,blue,null,red,red],[blue,blue,blue,blue,blue,blue,red,red,red]]
  arrow:[[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false]]
}
draw:
page p:=[0,6] {
show arr[p]
}`,
},
{
  "id":"40",
  "title":"number-of-ways-to-form-a-target-string-given-a-dictionary",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]]]
  value:[[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]],[[a,c,c,a],[b,b,b,b],[c,a,c,a]]]
  color:[[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[yellow,null,null,null],[yellow,null,null,null],[yellow,null,null,null]],[[green,null,null,null],[yellow,null,null,null],[yellow,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,yellow,null,null],[null,yellow,null,null],[null,yellow,null,null]],[[null,yellow,null,null],[null,green,null,null],[null,yellow,null,null]],[[null,null,null,yellow],[null,null,null,yellow],[null,null,null,yellow]],[[null,null,null,yellow],[null,null,null,yellow],[null,null,null,green]]]
  arrow:[[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,7] {
show mr1[p]
}`,
},
{
  "id":"41",
  "title":"smallest-string-starting-from-leaf",
  "userCode" : `data:
tree tr1 = {
  structure:[[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7],[n1,n2,n3,n4,n5,n6,n7]]
  value:[[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c],[z,b,d,b,d,a,c]]
  color:[[null,null,null,null,null,null,null],[blue,null,null,null,null,null,null],[blue,blue,null,null,null,null,null],[blue,blue,null,blue,null,null,null],[blue,blue,null,null,null,null,null],[blue,blue,null,null,blue,null,null],[blue,null,blue,null,null,null,null],[blue,null,blue,null,null,blue,null],[blue,null,blue,null,null,null,null],[blue,null,blue,null,null,null,blue]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
draw:
page p:=[0,9] {
show tr1[p]
}`,
},
{
  "id":"42",
  "title":"work ladder",
  "userCode" : `data:
matrix mr1 = {
  structure:[[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]]]
  value:[[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]],[[1,2,2,1]]]
  color:[[[green,null,null,null]],[[green,null,null,null]],[[green,green,null,null]],[[green,green,red,null]],[[green,green,green,null]],[[green,green,green,green]]]
  arrow:[[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]]]
  hidden:[[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]],[[null,null,null,null]]]
}
matrix mr2 = {
  structure:[[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]]
  value:[[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]],[[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]]
  color:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,red],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,red],[null,null,green,null],[null,null,null,null]],[[null,null,null,null],[null,green,green,red],[null,null,green,green],[null,null,null,null]]]
  arrow:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
  hidden:[[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]],[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,5] {
show mr1[p]
show mr2[p]
}`,
},
{
  "id":"43",
  "title":"cheapest-flights-within-k-stops",
  "userCode" : `data:
graph gh = {
  id:[[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5],[n1,n2,n3,n4,n5]]
  edge:[[(n1,n2),(n1,n3),(n2,n3),(n2,n4),(n4,n5),(n3,n4),(n3,n5)],[(n1,n2),(n1,n3),(n2,n3),(n2,n4),(n4,n5),(n3,n4),(n3,n5)],[(n1,n2),(n1,n3),(n2,n3),(n2,n4),(n4,n5),(n3,n4),(n3,n5)],[(n1,n2),(n1,n3),(n2,n3),(n2,n4),(n4,n5),(n3,n4),(n3,n5)],[(n1,n2),(n1,n3),(n2,n3),(n2,n4),(n4,n5),(n3,n4),(n3,n5)],[(n1,n2),(n1,n3),(n2,n3),(n2,n4),(n4,n5),(n3,n4),(n3,n5)]]
  value:[[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[1,2],[1,2,3]]
  color:[[null,null,null,null,null],[red,null,null,null,null],[red,green,green,null,null],[red,red,yellow,green,null],[red,red,green,green,null],[red,red,green,yellow,green]]
  arrow:[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]
  hidden:[[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]]
}
draw:
page p:=[0,5] {
show gh[p]
}`,
},
{
  "id":"44",
  "title":"design-graph-with-shortest-path-calculator",
  "userCode" : `data:
graph gh = {
  id:[[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6],[n1,n2,n3,n4,n5,n6]]
  edge:[[(n1,n2),(n1,n3),(n2,n4),(n2,n5),(n3,n5),(n4,n6),(n4,n5)],[(n1,n2),(n1,n3),(n2,n4),(n2,n5),(n3,n5),(n4,n6),(n4,n5)],[(n1,n2),(n1,n3),(n2,n4),(n2,n5),(n3,n5),(n4,n6),(n4,n5)],[(n1,n2),(n1,n3),(n2,n4),(n2,n5),(n3,n5),(n4,n6),(n4,n5)],[(n1,n2),(n1,n3),(n2,n4),(n2,n5),(n3,n5),(n4,n6),(n4,n5)],[(n1,n2),(n1,n3),(n2,n4),(n2,n5),(n3,n5),(n4,n6),(n4,n5)]]
  value:[[a,b,c,d,e,f],[a,b,c,d,e,f],[a,b,c,d,e,f],[a,b,c,d,e,f],[a,b,c,d,e,f],[a,b,c,d,e,f]]
  color:[[blue,null,null,null,null,null],[grey,blue,null,null,null,null],[grey,grey,blue,null,null,null],[grey,grey,grey,blue,null,null],[grey,grey,grey,grey,blue,null],[grey,grey,grey,grey,grey,blue]]
  arrow:[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
  hidden:[[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null],[null,null,null,null,null,null]]
}
draw:
page p:=[0,5] {
show gh[p]
}`,
},
{
  "id":"46",
  "title":"find circle",
  "userCode" : `data:
graph gh = {
  id:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  edge:[[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)],[(n1,n2),(n2,n3),(n3,n4),(n4,n5),(n5,n6),(n6,n7),(n7,n8),(n8,n4)]]
  value:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  color:[[red,null,null,null,null,null,null,null],[green,red,null,null,null,null,null,null],[green,null,red,null,null,null,null,null],[null,green,null,null,red,null,null,null],[null,null,green,null,null,null,red,null],[null,null,null,green,null,null,null,red],[null,null,null,null,green,red,null,null],[null,null,null,null,null,green,null,red],[null,null,null,null,null,null,red,green],[null,null,null,red,null,null,null,null]]
  arrow:[[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,catch,null,null,null,null]]
  hidden:[[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]
}
draw:
page p:=[0,9] {
show gh[p]
}`,
},
{
  "id":"47",
  "title":"BFS in a graph",
  "userCode" : `data:
graph gh = {
  id:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  edge:[[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)]]
  value:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  color:[[red,null,null,null,null,null,null,null],[red,red,null,null,null,null,null,null],[red,red,null,null,null,null,null,null],[red,red,red,null,null,null,null,null],[red,red,red,red,null,null,null,null],[red,red,red,red,null,red,null,null],[red,red,red,red,null,red,red,null],[red,red,red,red,red,red,red,null],[red,red,red,red,red,red,red,red]]
  arrow:[[start,null,null,null,null,null,null,null],[null,cur,null,null,null,null,null,null],[cur,null,null,null,null,null,null,null],[null,null,cur,null,null,null,null,null],[null,null,null,cur,null,null,null,null],[null,null,null,null,null,cur,null,null],[null,null,null,null,null,null,cur,null],[null,null,null,null,cur,null,null,null],[null,null,null,null,null,null,null,finish]]
  hidden:[[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]
}
draw:
page p:=[0,8] {
show gh[p]
}`,
},
{
  "id":"48",
  "title":"DFS in a graph",
  "userCode" : `data:
graph gh = {
  id:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  edge:[[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)],[(n1,n2),(n1,n3),(n1,n4),(n1,n6),(n1,n7),(n3,n4),(n3,n6),(n4,n5),(n6,n8)]]
  value:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  color:[[blue,null,null,null,null,null,null,null],[blue,blue,null,null,null,null,null,null],[blue,blue,null,null,null,null,null,null],[blue,blue,blue,null,null,null,null,null],[blue,blue,blue,blue,null,null,null,null],[blue,blue,blue,blue,blue,null,null,null],[blue,blue,blue,blue,blue,null,null,null],[blue,blue,blue,blue,blue,blue,null,null],[blue,blue,blue,blue,blue,blue,null,blue],[blue,blue,blue,blue,blue,blue,null,blue],[blue,blue,blue,blue,blue,blue,blue,blue]]
  arrow:[[start,null,null,null,null,null,null,null],[null,cur,null,null,null,null,null,null],[cur,null,null,null,null,null,null,null],[null,null,cur,null,null,null,null,null],[null,null,null,cur,null,null,null,null],[null,null,null,null,cur,null,null,null],[null,null,cur,null,null,null,null,null],[null,null,null,null,null,cur,null,null],[null,null,null,null,null,null,null,cur],[cur,null,null,null,null,null,null,null],[null,null,null,null,null,null,cur,null]]
  hidden:[[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]
}
draw:
page p:=[0,10] {
show gh[p]
}`,
},
{
  "id":"50",
  "title":"reconstruct-itinerary",
  "userCode" : `data:
graph gh = {
  id:[[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4],[n1,n2,n3,n4]]
  edge:[[(n1,n4),(n2,n3),(n3,n4),(n2,n4)],[(n1,n4),(n2,n3),(n3,n4),(n2,n4)],[(n1,n4),(n2,n3),(n3,n4),(n2,n4)],[(n1,n4),(n2,n3),(n3,n4),(n2,n4)],[(n1,n4),(n2,n3),(n3,n4),(n2,n4)],[(n1,n4),(n2,n3),(n3,n4),(n2,n4)],[(n1,n4),(n2,n3),(n3,n4),(n2,n4)]]
  value:[[aaa,bbb,ccc,jfk],[aaa,bbb,ccc,jfk],[aaa,bbb,ccc,jfk],[aaa,bbb,ccc,jfk],[aaa,bbb,ccc,jfk],[aaa,bbb,ccc,jfk],[aaa,bbb,ccc,jfk]]
  color:[[null,null,null,null],[null,null,null,green],[green,null,null,green],[null,null,null,green],[null,null,green,green],[null,green,green,green],[green,green,green,green]]
  arrow:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
  hidden:[[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}
draw:
page p:=[0,6] {
show gh[p]
}`,
},
];

/*
{
  "id":"",
  "title":"",
  "userCode" : ``,
},
*/

