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
  color:[[null,null,null,null,null,null,null],[blue,null,null,null,null,null,null],[blue,blue,null,null,null,null,null],[blue,blue,blue,null,null,null,null],[blue,blue,blue,blue,null,null,null],[blue,blue,blue,blue,blue,null,null],[blue,blue,blue,blue,blue,blue,blue],[blue,blue,blue,blue,blue,blue,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  arrow:[[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null],[null,null,null,null,null,null,null]]
  hidden:[[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false],[false,false,false,false,false,false,false]]
}
draw:
page p:=[0,7] {
show tr1[p]
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

