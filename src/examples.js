export const examples = [
  {
    id: "graphExample",
    title: "Example - graph",
    userCode: `graph gh = {
  nodes: [n1, n2, n3]
  value: [1, 2, 3]
  edges: [n1-n2, n2-n3]
}

page
show gh

page
gh.addNode(n4, 4)
gh.addEdge(n3-n4)

page
gh.removeNode(n1)`,
  },
  {
    id: "arrayExample",
    title: "Example - array",
    userCode: `array arr1 = {
  value: [1]
}
array arr2 = {
  value: [3, 2, 1]
}

page
show arr1
show arr2

page
arr2.removeValue(3)
arr1.addValue(2)

page
arr2.removeValue(2)
arr1.addValue(3)`,
  },
  {
    id: "TutorialFibonacci",
    title: "Tutorial - Fibonacci",
    userCode: `array arr1 = {
  value: [1]
}

page
show arr1

page
arr1.addValue(1)

page
arr1.addValue(2)`,
  },
  {
    id: "playground",
    title: "Playground",
    userCode: ``,
  },
  {
    id: "task1LCAofTree",
    title: "Task 1 - LCA in a tree",
    userCode: `tree tr1 = {
  nodes: [n1, n2, n3, n4, n5, n6, n7]
  value: [1, 2, 3, 4, 5, 6, 7]
  color: [null, null, "blue", null, "blue"]
}

page
show tr1`,
  },
  {
    id: "task2DepthFirstSearch",
    title: "Task 2 - Depth First Search",
    userCode: `graph dfs = {
  nodes: [n1, n2, n3, n4, n5, n6, n7, n8]
  edges: [n1-n2, n1-n6, n1-n7, n2-n3, n3-n7, n3-n5, n4-n5, n4-n6, n4-n8]
  color: ["red", null, null, null, null, null, null, null]
  arrow: ["start", null, null, null, null, null, null, null]
}

page
show dfs

page
dfs.setColor(0, "blue")
dfs.setColor(1, "red")
dfs.setArrow(0, null)
dfs.setArrow(1, "cur")

page
dfs.setColor(1, "blue")
dfs.setColor(2, "red")
dfs.setArrow(1, null)
dfs.setArrow(2, "cur")

page
dfs.setColor(2, "blue")
dfs.setColor(4, "red")
dfs.setArrow(2, null)
dfs.setArrow(4, "cur")`,
  },
  {
    id: "task3NumbersOfIslands",
    title: "Task 3 - Numbers of Islands",
    userCode: `matrix mr1 = {
  value: [[0, 0, 1, 0], [0, 1, 1, 0], [1, 0, 0, 0], [0, 0, 1, 1]]
  color: [[null, null, "red", null]]
}

page
show mr1`,
  },
  {
    id: "task4ValidBrackets",
    title: "Task 4 - Valid Brackets",
    userCode: `array arr = {
  value: ["{", "{", "{", "}", "{", "}", "}", "]"]
}
stack stk = {
  value: ["{"]
}

page
show arr
show stk`,
  },
  {
    id: "01Matrix",
    title: "01 - Matrix",
    userCode: `matrix mr1 = {
  value: [[0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [1, 0, 0, 0, 0], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1]]
  color: [[null, null, "red", null, null], [null, null, "red", null, null], ["red", null, null, null, null], [null, null, null, null, "red"], [null, null, null, null, "red"]]
}

page
show mr1

page
mr1.setColors([[null, "blue", "red", "blue", null], ["blue", "blue", "red", "blue", null], ["red", "blue", "blue", null, "blue"], ["blue", null, null, "blue", "red"], [null, null, null, "blue", "red"]])

page
mr1.setColors([["green", "blue", "red", "blue", "green"], ["blue", "blue", "red", "blue", "green"], ["red", "blue", "blue", "green", "blue"], ["blue", "green", "green", "blue", "red"], ["green", "green", "green", "blue", "red"]])`,
  },
  {
    id: "132Pattern",
    title: "132 - Pattern",
    userCode: `array arr1 = {
  value: [6, 12, 3, 4, 6, 11, 20]
  color: ["orange", "orange", "orange", "orange", "orange", "orange", "orange"]
}
array arr2 = {
  value: [6, 6, 3, 3, 3, 3, 3]
  color: ["green", "green", "green", "green", "green", "green", "green"]
}
stack stk = {
  value: [20]
}

page
show arr1
show arr2
show stk

page
arr1.setColor(4, "yellow")
arr2.setColor(4, "yellow")
stk.addValue(11)

page
arr1.setColor(3, "yellow")
arr1.setColor(4, "orange")
arr2.setColor(3, "yellow")
arr2.setColor(4, "green")
stk.addValue(20)
stk.addValue(20)

page
arr1.setColor(2, "yellow")
arr1.setColor(3, "orange")
arr2.setColor(2, "yellow")
arr2.setColor(3, "green")
stk.addValue(20)

page
arr1.setColor(1, "yellow")
arr1.setColor(2, "orange")
arr2.setColor(1, "yellow")
arr2.setColor(2, "green")
stk.removeValue(20)`,
  },
  {
    id: "3sum",
    title: "3 Sum",
    userCode: `array arr = {
  value: [4, 1, 1, 0, 1, 2]
  arrow: ["i", null, null, null, null, null]
}

page
show arr

page
arr.setArrow(0, "i")
arr.setArrow(1, "lo")
arr.setArrow(5, "hi")

page
arr.setArrow(1, null)
arr.setArrow(2, "lo")

page
arr.setArrow(2, null)
arr.setArrow(3, "lo")

page
arr.setArrow(3, null)
arr.setArrow(4, "lo")

page
arr.setArrow(0, null)
arr.setArrow(1, "i")

page
arr.setArrow(2, "lo")

page
arr.setColor(1, "green")
arr.setColor(2, "green")
arr.setColor(5, "green")`,
  },
  {
    id: "04",
    title: "arithmetic-slices",
    userCode: `array arr1 = {
  value: [1, 3, 5, 6, 10, 15, 20, 25, 28, 29]
}
array arr2 = {
  value: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

page
show arr1
show arr2

page
arr1.setColors(["green", "green", "green", null, null, null, null, null, null, null])
arr2.setValue(2, 1)
arr2.setColor(2, "yellow")

page
arr1.setColors([null, "green", "green", "green", null, null, null, null, null, null])
arr2.setValue(3, 2)
arr2.setColor(2, null)
arr2.setColor(3, "yellow")

page
arr1.setColors([null, null, "green", "green", "green", null, null, null, null, null])
arr2.setValue(4, 3)
arr2.setColor(3, null)
arr2.setColor(4, "yellow")

page
arr1.setColors([null, null, null, null, "green", "green", "green", null, null, null])
arr2.setColor(4, null)
arr2.setColor(6, "yellow")

page
arr1.setColors([null, null, null, null, null, "green", "green", "green", null, null])
arr2.setValue(7, 1)
arr2.setColor(6, null)
arr2.setColor(7, "yellow")

page
arr1.setColors([null, null, null, null, null, null, "green", "green", "green", null])
arr2.setColor(7, null)
arr2.setColor(8, "yellow")

page
arr1.setColors([null, null, null, null, null, null, null, "green", "green", "green"])
arr2.setColor(8, null)
arr2.setColor(9, "yellow")`,
  },
  {
    id: "05",
    title: "binary subarrays with sum",
    userCode: `array arr1 = {
  value: [1, 0, 1, 0, 1]
  color: ["blue", null, null, null, null]
}
stack stk = {
  value: [1]
}

page
show arr1
show stk

page
arr1.setColor(1, "blue")
arr1.setArrow(1, "cur")
stk.setValue(0, 1)

page
arr1.setColor(2, "blue")
arr1.setArrow(1, null)
arr1.setArrow(2, "cur")
stk.addValue(2)

page
arr1.setColor(3, "blue")
arr1.setArrow(2, null)
arr1.setArrow(3, "cur")
stk.setValues([2, 2])

page
arr1.setColor(4, "blue")
arr1.setArrow(3, null)
arr1.setArrow(4, "cur")
stk.addValue(2)`,
  },
  {
    id: "06",
    title: "building with an ocean view",
    userCode: `array arr1 = {
  value: [5, 3, 2, 4, 1, 1]
  color: ["green", "blue", "blue", "blue", "blue", "blue"]
  arrow: ["cur", null, null, null, null, null]
}
array arr2 = {
  value: [0]
  color: ["orange"]
}

page
show arr1
show arr2

page
arr1.setColor(0, "green")
arr1.setColor(1, "green")
arr1.setArrow(0, null)
arr1.setArrow(1, "cur")
arr2.addValue(1)

page
arr1.setColor(1, "green")
arr1.setColor(2, "green")
arr1.setArrow(1, null)
arr1.setArrow(2, "cur")
arr2.addValue(2)

page
arr1.setArrow(2, null)
arr1.setArrow(3, "cur")`,
  },
  {
    id: "07",
    title: "checking existence of edge length limited paths",
    userCode: `graph dfs = {
  nodes: [n1, n2, n3, n4, n5, n6]
  edges: [n1-n5, n1-n4, n2-n4, n2-n3]
}

page
show dfs

page
dfs.setEdges([n2-n3])

page
dfs.setEdges([n1-n4, n2-n3])

page
dfs.setEdges([n1-n4, n2-n3, n1-n5])

page
dfs.setEdges([n1-n4, n2-n3])

page
dfs.setEdges([n1-n4, n2-n3, n1-n5, n2-n5])`,
  },
  {
    id: "08",
    title: "construct binary search tree from preorder traversal",
    userCode: `tree tr1 = {
  nodes: [n1, n2, n3, n4, n5]
  value: [8, 5, 10, 1, 7]
  color: [null, null, null, null, "blue"]
  arrow: [null, null, null, "nd", null]
}

page
show tr1

page
tr1.setColor(1, "blue")
tr1.setColor(4, "green")
tr1.setArrow(1, "nd")
tr1.setArrow(3, null)

page
tr1.setColor(1, null)
tr1.setColor(4, "blue")
tr1.setArrow(1, null)
tr1.setArrow(4, "nd")

page
tr1.setColor(0, "blue")
tr1.setColor(4, null)
tr1.setArrow(0, "nd")
tr1.setArrow(4, null)

page
tr1.setColor(2, "green")
tr1.setArrow(0, "nd")`,
  },
  {
    id: "10",
    title: "construct binary tree from inorder and postorder traversal",
    userCode: `tree tr1 = {
  nodes: [n1, n2, n3, n4, n5]
  value: [3, 9, 20, 15, 7]
}

page
show tr1

page
tr1.setColor(0, "blue")

page
tr1.setColor(2, "blue")

page
tr1.setColor(3, "blue")

page
tr1.setColor(4, "blue")

page
tr1.setColor(1, "blue")`,
  },
  {
    id: "11",
    title: "count nice pairs in an array",
    userCode: `array arr1 = {
  value: [7, 3, 4, 4, 2, 4, 3, 3]
  color: [null, null, null, null, null, null, null, null]
}

page
show arr1
arr1.setColor(0, "green")

page
arr1.setColor(0, null)
arr1.setColor(1, "green")

page
arr1.setColor(1, null)
arr1.setColor(2, "green")

page
arr1.setColor(2, "blue")
arr1.setColor(3, "green")

page
arr1.setColor(3, null)
arr1.setColor(4, "green")
arr1.setColor(2, "blue")

page
arr1.setColor(3, "blue")
arr1.setColor(4, null)
arr1.setColor(5, "green")

page
arr1.setColors([null, "blue", null, null, null, null, "green"])

page
arr1.setColor(6, "blue")
arr1.setColor(7, "green")`,
  },
  {
    id: "12",
    title: "count pairs in two arrays",
    userCode: `array arr1 = {
  value: [2, 1, 0, 1, 2, 4]
  color: [null, "yellow", null, "green", null, "yellow"]
  arrow: ["i", "left", null, "mid", null, "right"]
}

page
show arr1

page
arr1.setArrow(0, "i")
arr1.setArrow(1, "left")
arr1.setArrow(3, "mid")
arr1.setArrow(5, "right")

page
arr1.setColor(1, null)
arr1.setColor(4, "yellow")
arr1.setArrow(1, null)
arr1.setArrow(4, "leftMid")

page
arr1.setColor(5, null)
arr1.setArrow(5, "leftMidRight")

page
arr1.setColor(4, null)
arr1.setColor(5, "green")
arr1.setArrow(4, "right")
arr1.setArrow(5, "leftMid")`,
  },
  {
    id: "13",
    title: "count strictly increasing subarrays",
    userCode: `array arr1 = {
  value: [1, 3, 5, 4, 4, 6]
  color: ["orange", null, null, null, null, null]
}
array arr2 = {
  value: [0, 1, 2, 3, 4, 5]
  color: ["orange", null, null, null, null, null]
}

page
show arr1
show arr2

page
arr1.setColor(0, null)
arr1.setColor(1, "orange")
arr2.setColor(0, null)
arr2.setColor(1, "orange")

page
arr1.setColor(1, null)
arr1.setColor(2, "orange")
arr2.setColor(1, null)
arr2.setColor(2, "orange")

page
arr1.setColor(2, null)
arr1.setColor(3, "orange")
arr2.setColor(2, null)
arr2.setColor(3, "orange")

page
arr1.setColor(3, null)
arr1.setColor(4, "orange")
arr2.setColor(3, null)
arr2.setColor(4, "orange")

page
arr1.setColor(4, null)
arr1.setColor(5, "orange")
arr2.setColor(4, null)
arr2.setColor(5, "orange")`,
  },
  {
    id: "14",
    title: "Binary tree preorder traversal",
    userCode: `tree tr1 = {
  nodes: [n1, n2, n3, n4, n5, n6, n7]
  value: [1, 2, 3, 4, 5, 6, 7]
}

page
show tr1

page
tr1.setColor(0, "blue")

page
tr1.setColor(1, "blue")

page
tr1.setColor(2, "blue")

page
tr1.setColor(3, "blue")

page
tr1.setColor(4, "blue")

page
tr1.setColor(5, "blue")

page
tr1.setColor(6, "blue")`,
  },
  {
    id: "15",
    title: "Binary tree inorder traversal",
    userCode: `tree tr1 = {
  nodes: [n1, n2, n3, n4, n5, n6, n7]
  value: [1, 2, 3, 4, 5, 6, 7]
}

page
show tr1

page
tr1.setColor(3, "red")

page
tr1.setColor(1, "red")

page
tr1.setColor(4, "red")

page
tr1.setColor(0, "red")

page
tr1.setColor(5, "red")

page
tr1.setColor(2, "red")

page
tr1.setColor(6, "red")`,
  },
  {
    id: "16",
    title: "Binary tree postorder traversal",
    userCode: `tree tr1 = {
  nodes: [n1, n2, n3, n4, n5, n6, n7]
  value: [1, 2, 3, 4, 5, 6, 7]
}

page
show tr1

page
tr1.setColor(3, "purple")

page
tr1.setColor(4, "purple")

page
tr1.setColor(1, "purple")

page
tr1.setColor(5, "purple")

page
tr1.setColor(6, "purple")

page
tr1.setColor(2, "purple")

page
tr1.setColor(0, "purple")`,
  },
  {
    id: "17",
    title: "Binary tree level-order traversal",
    userCode: `tree tr1 = {
  nodes: [n1,n2,n3,n4,n5,n6,n7]
  value: [1,2,3,4,5,6,7]
}

page
show tr1

page
tr1.setColor(0, "pink")

page
tr1.setColors(["pink","pink","white","white","white","white","white"])

page
tr1.setColors(["pink","pink","pink","white","white","white","white"])

page
tr1.setColors(["pink","pink","pink","pink","white","white","white"])

page
tr1.setColors(["pink","pink","pink","pink","pink","white","white"])

page
tr1.setColors(["pink","pink","pink","pink","pink","pink","white"])

page
tr1.setColors(["pink","pink","pink","pink","pink","pink","pink"])`,
  },
  {
    id: "18",
    title: "find smallest common element in all rows",
    userCode: `matrix mr1 = {
  value: [[1,2,3,4,5],[2,4,5,8,10],[3,5,7,9,11],[1,3,5,7,9]]
}

array arr1 = {
  value: ["F","N","N"]
}

page
show mr1
show arr1
mr1.setColors([["yellow","green","green","green","green"],["orange","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"]])

page
mr1.setColors([["yellow","green","green","green","green"],["orange","white","white","white","white"],["orange","white","white","white","white"],["white","white","white","white","white"]])
arr1.setValues(["T","F","N"])

page
mr1.setColors([["green","green","yellow","green","green"],["white","orange","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"]])
arr1.setValues(["F","N","N"])

page
mr1.setColors([["green","green","green","yellow","green"],["white","orange","white","white","white"],["white","orange","white","white","white"],["white","white","white","white","white"]])

page
mr1.setColors([["green","green","green","green","yellow"],["white","white","orange","white","white"],["white","orange","white","white","white"],["white","white","orange","white","white"]])
arr1.setValues(["T","T","T"])
arr1.setColors(["green","green","green"])`,
  },
  {
    id: "19",
    title: "find the safest path in a grid",
    userCode: `matrix mr1 = {
  value: [[1,1,1,0],[1,1,1,1],[1,1,1,1],[0,1,1,1]]
}

page
show mr1
mr1.setColors([["white","white","white","pink"],["white","white","white","white"],["white","white","white","white"],["pink","white","white","white"]])

page
mr1.setColors([["white","white","green","pink"],["white","white","white","green"],["green","white","white","white"],["pink","green","white","white"]])

page
mr1.setValues([[1,2,1,0],[2,1,2,1],[1,2,1,2],[0,1,2,1]])
mr1.setColors([["white","blue","green","pink"],["blue","white","blue","green"],["green","blue","white","blue"],["pink","green","blue","white"]])

page
mr1.setValues([[3,2,1,0],[2,3,2,1],[1,2,3,2],[0,1,2,3]])
mr1.setColors([["orange","blue","green","pink"],["blue","orange","blue","green"],["green","blue","orange","blue"],["pink","green","blue","orange"]])`,
  },
  {
    id: "20",
    title: "number of closed islands",
    userCode: `matrix mr1 = {
  value: [[1,1,1,1,0],[1,0,0,1,0],[1,0,0,1,0],[1,1,1,1,0]]
}

page
show mr1

page
mr1.setArrows([["white","white","white","white","start"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"]])

page
mr1.setColors([["white","white","white","white","pink"],["white","white","white","white","pink"],["white","white","white","white","pink"],["white","white","white","white","pink"]])

page
mr1.setArrows([["white","white","white","white","white"],["white","start","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"]])

page
mr1.setColors([["white","white","white","white","pink"],["white","purple","purple","white","pink"],["white","purple","purple","white","pink"],["white","white","white","white","pink"]])`,
  },
  {
    id: "21",
    title: "number of enclaves",
    userCode: `matrix mr1 = {
  value: [[0,0,0,0,1],[0,0,1,0,1],[0,1,0,0,1],[0,1,0,1,0],[0,0,0,1,1]]
}

page
show mr1
mr1.setArrows([["white","white","white","white","root"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"]])

page
mr1.setColors([["white","white","white","white","red"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"]])

page
mr1.setColors([["white","white","white","white","red"],["white","white","white","white","red"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"]])

page
mr1.setColors([["white","white","white","white","red"],["white","white","white","white","red"],["white","white","white","white","red"],["white","white","white","white","white"],["white","white","white","white","white"]])

page
mr1.setArrows([["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","white","white"],["white","white","white","root","white"]])

page
mr1.setColors([["white","white","white","white","red"],["white","white","white","white","red"],["white","white","white","white","red"],["white","white","white","red","white"],["white","white","white","red","red"]])

page
mr1.setColors([["white","white","white","white","red"],["white","white","green","white","red"],["white","green","white","white","red"],["white","green","white","red","white"],["white","white","white","red","red"]])`,
  },
  {
    id: "22",
    title: "Numbers of Islands",
    userCode: `matrix mr1 = {
  value: [[1,1,1],[0,1,0],[1,0,0],[1,0,1]]
}

page
show mr1
mr1.setArrows([["start","white","white"],["white","white","white"],["white","white","white"],["white","white","white"]])

page
mr1.setColors([["blue","white","white"],["white","white","white"],["white","white","white"],["white","white","white"]])

page
mr1.setColors([["blue","blue","white"],["white","white","white"],["white","white","white"],["white","white","white"]])

page
mr1.setColors([["blue","blue","white"],["white","blue","white"],["white","white","white"],["white","white","white"]])

page
mr1.setColors([["blue","blue","blue"],["white","blue","white"],["white","white","white"],["white","white","white"]])

page
mr1.setArrows([["white","white","white"],["white","white","white"],["start","white","white"],["white","white","white"]])

page
mr1.setColors([["blue","blue","blue"],["white","blue","white"],["pink","white","white"],["white","white","white"]])

page
mr1.setColors([["blue","blue","blue"],["white","blue","white"],["pink","white","white"],["pink","white","white"]])

page
mr1.setArrows([["white","white","white"],["white","white","white"],["white","white","white"],["white","white","start"]])

page
mr1.setColors([["blue","blue","blue"],["white","blue","white"],["pink","white","white"],["pink","white","green"]])`,
  },
  {
    id: "24",
    title: "pacific atlantic water flow",
    userCode: `matrix mr1 = {
  value: [[1,2,2,3,5,1,1,1,3],[3,2,3,4,4,2,2,2,3],[2,4,5,3,2,1,5,1,4],[6,7,1,4,5,1,6,4,2],[5,1,1,2,4,4,1,1,4]]
}

page
show mr1

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","blue"],["blue","white","white","white","white","white","white","white","white"],["blue","white","white","white","white","white","white","white","white"],["blue","white","white","white","white","white","white","white","white"],["blue","white","white","white","white","white","white","white","white"]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","blue"],["blue","blue","blue","blue","blue","blue","blue","blue","blue"],["blue","blue","blue","white","white","white","blue","white","blue"],["blue","blue","white","white","white","white","blue","white","white"],["blue","white","white","white","white","white","white","white","white"]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue","white","white","white","blue","white","yellow"],["blue","blue","white","white","white","white","blue","white","yellow"],["yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow"]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","yellow","white","white","white","blue","white","yellow"],["yellow","yellow","yellow","yellow","yellow","white","yellow","yellow","yellow"],["yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow","yellow"]])

page
mr1.setColors([["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","blue","blue","blue","blue","blue","blue","yellow"],["blue","blue","yellow","white","white","white","blue","white","yellow"],["yellow","yellow","green","green","green","white","yellow","green","green"],["yellow","green","green","green","green","green","green","green","green"]])`,
  },
  {
    id: "25",
    title: "score after flipping matrix",
    userCode: `matrix mr1 = {
  value: [[0,0,1,1],[1,0,1,0],[1,1,0,0]]
}

page
show mr1
mr1.setColors([["pink","white","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setValues([[1,1,0,0],[1,0,1,0],[1,1,0,0]])
mr1.setColors([["blue","blue","blue","blue"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setColors([["blue","blue","blue","blue"],["green","white","white","white"],["white","white","white","white"]])

page
mr1.setColors([["blue","blue","blue","blue"],["green","white","white","white"],["green","white","white","white"]])

page
mr1.setColors([["blue","green","blue","blue"],["green","pink","white","white"],["green","green","white","white"]])

page
mr1.setColors([["blue","green","pink","blue"],["green","pink","green","white"],["green","green","pink","white"]])

page
mr1.setValues([[1,1,1,0],[1,0,0,0],[1,1,1,0]])

page
mr1.setColors([["blue","green","pink","orange"],["green","pink","green","orange"],["green","green","pink","orange"]])`,
  },
  {
    id: "26",
    title: "shift 2d grid",
    userCode: `matrix mr1 = {
  value: [[0,0,0,0],[0,0,0,0],[0,0,0,0]]
}

page
show mr1
mr1.setArrows([["white","white","white","white"],["white","start","white","white"],["white","white","white","white"]])

page
mr1.setValues([[0,0,0,0],[0,1,2,0],[0,0,0,0]])
mr1.setColors([["white","white","white","white"],["white","pink","pink","white"],["white","white","white","white"]])
mr1.setArrows([["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[0,0,0,0]])
mr1.setColors([["white","white","white","white"],["white","pink","pink","pink"],["white","white","white","white"]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,0,0,0]])
mr1.setColors([["white","white","white","white"],["white","pink","pink","pink"],["pink","white","white","white"]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,5,0,0]])
mr1.setColors([["white","white","white","white"],["white","pink","pink","pink"],["pink","pink","white","white"]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,5,6,0]])
mr1.setColors([["white","white","white","white"],["white","pink","pink","pink"],["pink","pink","pink","white"]])

page
mr1.setValues([[0,0,0,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["white","white","white","white"],["white","pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,0,0,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","white","white","white"],["white","pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,0,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink","white","white"],["white","pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,10,0],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink","pink","white"],["white","pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,10,11],[0,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink","pink","pink"],["white","pink","pink","pink"],["pink","pink","pink","pink"]])

page
mr1.setValues([[8,9,10,11],[12,1,2,3],[4,5,6,7]])
mr1.setColors([["pink","pink","pink","pink"],["pink","pink","pink","pink"],["pink","pink","pink","pink"]])`,
  },
  {
    id: "27",
    title: "surrounded regions",
    userCode: `matrix mr1 = {
  value: [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
}

page
show mr1
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["white","white","white","white"],["red","white","white","white"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","white","white","white"],["red","white","white","white"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","white","white"],["red","white","white","white"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","white"],["red","white","white","white"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red","white","white","white"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red","white","white","blue"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red","white","blue","blue"]])

page
mr1.setColors([["red","red","red","red"],["red","red","red","red"],["blue","blue","blue","blue"],["red","blue","blue","blue"]])`,
  },
  {
    id: "28",
    title: "Unique path ii",
    userCode: `matrix mr1 = {
  value: [[1,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]]
}

page
show mr1
mr1.setArrows([["start","white","white","white"],["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setColors([["red","white","white","white"],["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])
mr1.setArrows([["start","white","white","white"],["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setValues([[0,1,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red","white","white"],["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])
mr1.setArrows([["white","white","white","white"],["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setValues([[0,0,1,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red","red","white"],["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setValues([[0,0,0,1],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red","red","red"],["white","white","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setValues([[0,0,0,0],[0,0,0,2],[0,0,0,0],[0,0,0,0]])
mr1.setColors([["red","red","red","red"],["white","white","white","green"],["white","white","white","white"],["white","white","white","white"]])`,
  },
  {
    id: "30",
    title: "Word Search",
    userCode: `matrix mr1 = {
  value: [[1,2,2,1]]
}

matrix mr2 = {
  value: [[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]
}

page
show mr1
show mr2

page
mr1.setColors([["green","white","white","white"]])

page
mr1.setColors([["green","white","white","white"]])
mr2.setColors([["white","white","white","white"],["white","green","white","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setColors([["green","green","white","white"]])
mr2.setColors([["white","white","white","white"],["white","green","green","white"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setColors([["green","green","red","white"]])
mr2.setColors([["white","white","white","white"],["white","green","green","red"],["white","white","white","white"],["white","white","white","white"]])

page
mr1.setColors([["green","green","green","white"]])
mr2.setColors([["white","white","white","white"],["white","green","green","red"],["white","white","green","white"],["white","white","white","white"]])

page
mr1.setColors([["green","green","green","green"]])
mr2.setColors([["white","white","white","white"],["white","green","green","red"],["white","white","green","green"],["white","white","white","white"]])`,
  },
  {
    id: "31",
    title: "kth largest element in a stream",
    userCode: `array arr1 = {
  value: [2,4,8,5]
}

array arr2 = {
  value: [2,3,4,5,8]
}

page
show arr1

page
arr1.setValues([4,5,8])

page
arr1.setValues([4,5,8])

page
arr1.setValues([5,5,8])

page
arr1.setValues([5,8,10])

page
arr1.setValues([8,9,10])

page
show arr2
arr2.setColors(["white","white","green","white","white"])

page
arr2.setValues([2,3,4,5,5,8])
arr2.setColors(["white","white","white","green","white","white"])

page
arr2.setValues([2,3,4,5,5,8,10])
arr2.setColors(["white","white","white","white","green","white","white"])

page
arr2.setValues([2,3,4,5,5,8,9,10])
arr2.setColors(["white","white","white","white","white","white","white","white"])`,
  },
  {
    id: "32",
    title: "validate binary search tree",
    userCode: `tree tr1 = {
  nodes: [n1,n2,n3,n4,n5,n6,n7]
  value: [5,1,4,0,2,3,6]
}

page
show tr1
tr1.setColors(["blue","white","white","white","white","white","white"])

page
tr1.setColors(["blue","red","white","red","red","white","white"])

page
tr1.setColors(["blue","red","green","red","red","green","green"])

page
tr1.setArrows(["white","white","notBST","white","white","white","white"])`,
  },
  {
    id: "33",
    title: "add two numbers ii",
    userCode: `linkedlist li1 = {
  nodes: [n1,n2,n3,n4]
  value: [3,4,2,7]
}

linkedlist li2 = {
  nodes: [n1,n2,n3]
  value: [4,6,5]
}

linkedlist li3 = {
  nodes: [n1,n2]
  value: [7,0]
}

page
show li1
show li2
show li3
li1.setColors(["red","white","white","white"])
li2.setColors(["red","white","white"])
li3.setColors(["green","white"])

page
li1.setColors(["red","red","white","white"])
li2.setColors(["red","red","white"])
li3.addNode(n3, 1)
li3.setColors(["green","green","green"])

page
li1.setColors(["red","red","red","white"])
li2.setColors(["red","red","red"])
li3.addNode(n4, 0)
li3.setValues([7,0,8,0])
li3.setColors(["green","green","green","green"])

page
li1.setColors(["red","red","red","red"])
li2.setColors(["red","red","red"])
li3.setValues([7,0,8,7])
li3.setColors(["green","green","green","green"])

page
li1.setColors(["red","red","red","red"])
li2.setColors(["red","red","red"])
li3.addNode(n5, 0)
li3.setValues([7,0,8,7,0])
li3.setColors(["green","green","green","green","green"])
li3.setArrows(["white","white","white","white","return"])`,
  },
  {
    id: "34",
    title: "print-immutable-linked-list-in-reverse",
    userCode: `linkedlist li = {
  nodes: [n1,n2,n3]
  value: [1,2,3]
}

stack stk = {
  value: [1]
}

page
show li
show stk
li.setColors(["green","white","white"])
stk.setColors(["green"])

page
li.setColors(["white","green","white"])
stk.setValues([1,1])
stk.setColors(["green","white"])

page
li.setColors(["white","white","green"])
stk.setValues([1,2,1])
stk.setColors(["green","white","white"])

page
li.setColors(["white","white","red"])
stk.setValues([1,1])
stk.setColors(["white","white"])

page
li.setColors(["white","red","white"])
stk.setValues([1])
stk.setColors(["white"])`,
  },
  {
    id: "36",
    title: "count-substrings-with-only-one-distinct-letter",
    userCode: `array arr1 = {
  value: ["a","a","a","a","b","b","a","c","c","c"]
}
array arr2 = {
  value: [1,0,0,0,0,0,0,0,0,0]
}

page
show arr1
show arr2
arr1.setColor(0, "pink")
arr2.setColor(0, "pink")

page
arr1.setValues(["a","a","a","a","b","b","a","c","c","c"])
arr2.setValues([1,2,0,0,0,0,0,0,0,0])
arr1.setColor(1, "pink")
arr2.setColor(1, "pink")

page
arr2.setValues([1,2,3,0,0,0,0,0,0,0])
arr1.setColor(2, "pink")
arr2.setColor(2, "pink")

page
arr2.setValues([1,2,3,4,0,0,0,0,0,0])
arr1.setColor(3, "pink")
arr2.setColor(3, "pink")

page
arr2.setValues([1,2,3,4,1,0,0,0,0,0])
arr1.setColor(4, "pink")
arr2.setColor(4, "pink")

page
arr2.setValues([1,2,3,4,1,2,0,0,0,0])
arr1.setColor(5, "pink")
arr2.setColor(5, "pink")

page
arr2.setValues([1,2,3,4,1,2,1,0,0,0])
arr1.setColor(6, "pink")
arr2.setColor(6, "pink")

page
arr2.setValues([1,2,3,4,1,2,1,1,0,0])
arr1.setColor(7, "pink")
arr2.setColor(7, "pink")

page
arr2.setValues([1,2,3,4,1,2,1,1,2,0])
arr1.setColor(8, "pink")
arr2.setColor(8, "pink")

page
arr2.setValues([1,2,3,4,1,2,1,1,2,3])
arr1.setColor(9, "pink")
arr2.setColor(9, "pink")`,
  },
  {
    id: "37",
    title: "vote game",
    userCode: `array arr = {
  value: ["d","r","d","r","d","r"]
}

page
show arr
arr.setArrow(0, "vote")

page
show arr
arr.setArrow(0, "vote")

page
show arr
arr.setColor(5, "red")
arr.setColor(1, "vote")
arr.setArrow(1, "vote")

page
show arr
arr.setColors([null,null,null,"red","red","red"])
arr.setArrow(2, "vote")

page
show arr
arr.setColors([null,null,"red","red","red","red"])
arr.setArrow(1, "vote")

page
show arr
arr.setColors([null,"red","red","red","red","red"])
arr.setArrow(0, "vote")

page
show arr
arr.setColor(0, "green")
arr.setColors([null,null,null,null,null,null])
arr.setArrow(0, "win")`,
  },
  {
    id: "38",
    title: "longest-word-in-dictionary-through-deleting",
    userCode: `array arr1 = {
  value: ["a","l","e"]
}
array arr2 = {
  value: ["a","p","p","l","l","e"]
}

page
show arr1
show arr2

page
show arr1
show arr2
arr1.setColor(0, "red")
arr2.setColor(0, "blue")

page
show arr1
show arr2
arr1.setColors(["red","red",null])
arr2.setColors(["blue","pink",null,null,null,null])

page
show arr1
show arr2
arr2.setColors(["blue","pink","pink",null,null,null])

page
show arr1
show arr2
arr2.setColors(["blue","pink","pink","blue",null,null])

page
show arr1
show arr2
arr2.setColors(["blue","pink","pink","blue","blue",null])

page
show arr1
show arr2
arr1.setColors(["red","red","red"])
arr2.setColors(["blue","pink","pink","blue","blue","red"])`,
  },
  {
    id: "39",
    title: "minimum-length-of-string-after-deleting-similar-ends",
    userCode: `array arr = {
  value: ["a","a","b","c","c","a","b","b","a"]
}

page
show arr
arr.setColor(0, "blue")
arr.setColor(8, "red")

page
show arr
arr.setColors(["blue","blue",null,null,null,null,null,null,"red"])

page
show arr
arr.setColors(["blue","blue","blue",null,null,null,null,"red","red"])

page
show arr
arr.setColors(["blue","blue","blue","blue",null,null,null,"red","red"])

page
show arr
arr.setColors(["blue","blue","blue","blue","blue",null,null,"red","red"])

page
show arr
arr.setColors(["blue","blue","blue","blue","blue","blue",null,"red","red"])

page
show arr
arr.setColors(["blue","blue","blue","blue","blue","blue","red","red","red"])`,
  },
  {
    id: "40",
    title: "number-of-ways-to-form-a-target-string-given-a-dictionary",
    userCode: `matrix mr1 = {
  value: [["a","c","c","a"],["b","b","b","b"],["c","a","c","a"]]
}

page
show mr1

page
show mr1
mr1.setColor(0,0,"yellow")
mr1.setColor(1,0,"yellow")
mr1.setColor(2,0,"yellow")

page
show mr1
mr1.setColor(0,0,"green")

page
show mr1
mr1.setColors([[null,null,null,null],[null,null,null,null],[null,null,null,null]])

page
show mr1
mr1.setColor(0,1,"yellow")
mr1.setColor(1,1,"yellow")
mr1.setColor(2,1,"yellow")

page
show mr1
mr1.setColor(1,1,"green")

page
show mr1
mr1.setColor(0,3,"yellow")
mr1.setColor(1,3,"yellow")
mr1.setColor(2,3,"yellow")

page
show mr1
mr1.setColor(2,3,"green")`,
  },
  {
    id: "41",
    title: "smallest-string-starting-from-leaf",
    userCode: `tree tr1 = {
  nodes: [n1,n2,n3,n4,n5,n6,n7]
  value: ["z","b","d","b","d","a","c"]
  color: [null,null,null,null,null,null,null]
}

page
show tr1

page
tr1.setColor(0, "blue")

page
tr1.setColor(1, "blue")

page
tr1.setColors(["blue","blue",null,"blue",null,null,null])

page
tr1.setColors(["blue","blue",null,null,null,null,null])

page
tr1.setColors(["blue","blue",null,null,"blue",null,null])

page
tr1.setColors(["blue",null,"blue",null,null,null,null])

page
tr1.setColors(["blue",null,"blue",null,null,"blue",null])

page
tr1.setColors(["blue",null,"blue",null,null,null,null])

page
tr1.setColors(["blue",null,"blue",null,null,null,"blue"])`,
  },
  {
    id: "42",
    title: "work ladder",
    userCode: `matrix mr1 = {
  value: [[1,2,2,1]]
  color: [[null,null,null,null]]
}
matrix mr2 = {
  value: [[3,3,3,3],[3,1,2,3],[3,2,2,1],[3,3,3,3]]
  color: [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}

page
show mr1
show mr2

page
mr1.setColor(0,0,"green")
mr2.setColor(1,1,"green")

page
mr1.setColor(0,1,"green")
mr2.setColor(1,2,"green")

page
mr1.setColor(0,2,"red")
mr2.setColor(1,3,"red")

page
mr1.setColor(0,2,"green")
mr2.setColor(2,2,"green")

page
mr1.setColor(0,3,"green")
mr2.setColor(2,3,"green")`,
  },
  {
    id: "43",
    title: "cheapest-flights-within-k-stops",
    userCode: `graph gh = {
  nodes: [n1,n2,n3,n4,n5]
  value: [1,2,3,4,5]
  edges: [n1-n2, n1-n3, n2-n3, n2-n4, n4-n5, n3-n4, n3-n5]
  color: [null,null,null,null,null]
}

page
show gh

page
gh.setColor(0, "red")

page
gh.setColors(["red","green","green",null,null])

page
gh.setColors(["red","red","yellow","green",null])

page
gh.setColors(["red","red","green","green",null])

page
gh.setColors(["red","red","green","yellow","green"])`,
  },
  {
    id: "44",
    title: "design-graph-with-shortest-path-calculator",
    userCode: `graph gh = {
  nodes: [n1,n2,n3,n4,n5,n6]
  value: ["a","b","c","d","e","f"]
  edges: [n1-n2, n1-n3, n2-n4, n2-n5, n3-n5, n4-n6, n4-n5]
  color: [null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "blue")

page
gh.setColors(["grey","blue",null,null,null,null])

page
gh.setColors(["grey","grey","blue",null,null,null])

page
gh.setColors(["grey","grey","grey","blue",null,null])

page
gh.setColors(["grey","grey","grey","grey","blue",null])

page
gh.setColors(["grey","grey","grey","grey","grey","blue"])`,
  },
  {
    id: "46",
    title: "find circle",
    userCode: `graph gh = {
  nodes: [n1,n2,n3,n4,n5,n6,n7,n8]
  value: [1,2,3,4,5,6,7,8]
  edges: [n1-n2, n2-n3, n3-n4, n4-n5, n5-n6, n6-n7, n7-n8, n8-n4]
  color: [null,null,null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "red")

page
gh.setColors(["green","red",null,null,null,null,null,null])

page
gh.setColors(["green",null,"red",null,null,null,null,null])

page
gh.setColors([null,"green",null,null,"red",null,null,null])

page
gh.setColors([null,null,"green",null,null,null,"red",null])

page
gh.setColors([null,null,null,"green",null,null,null,"red"])

page
gh.setColors([null,null,null,null,"green","red",null,null])

page
gh.setColors([null,null,null,null,null,"green",null,"red"])

page
gh.setColors([null,null,null,null,null,null,"red","green"])

page
gh.setColors([null,null,null,"red",null,null,null,null])
gh.setArrow(3, "catch")`,
  },
  {
    id: "47",
    title: "BFS in a graph",
    userCode: `graph gh = {
  nodes: [n1,n2,n3,n4,n5,n6,n7,n8]
  value: [1,2,3,4,5,6,7,8]
  edges: [n1-n2, n1-n3, n1-n4, n1-n6, n1-n7, n3-n4, n3-n6, n4-n5, n6-n8]
  color: [null,null,null,null,null,null,null,null]
  arrow: [null,null,null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "red")
gh.setArrow(0, "start")

page
gh.setColor(1, "red")
gh.setArrow(0, null)
gh.setArrow(1, "cur")

page
gh.setArrow(1, null)
gh.setArrow(0, "cur")

page
gh.setColor(2, "red")
gh.setArrow(0, null)
gh.setArrow(2, "cur")

page
gh.setColor(3, "red")
gh.setArrow(2, null)
gh.setArrow(3, "cur")

page
gh.setColor(5, "red")
gh.setArrow(3, null)
gh.setArrow(5, "cur")

page
gh.setColor(6, "red")
gh.setArrow(5, null)
gh.setArrow(6, "cur")

page
gh.setColor(4, "red")
gh.setArrow(6, null)
gh.setArrow(4, "cur")

page
gh.setColor(7, "red")
gh.setArrow(4, null)
gh.setArrow(7, "finish")`,
  },
  {
    id: "48",
    title: "DFS in a graph",
    userCode: `graph gh = {
  nodes: [n1,n2,n3,n4,n5,n6,n7,n8]
  value: [1,2,3,4,5,6,7,8]
  edges: [n1-n2, n1-n3, n1-n4, n1-n6, n1-n7, n3-n4, n3-n6, n4-n5, n6-n8]
  color: [null,null,null,null,null,null,null,null]
  arrow: [null,null,null,null,null,null,null,null]
}

page
show gh
gh.setColor(0, "blue")
gh.setArrow(0, "start")

page
gh.setColor(1, "blue")
gh.setArrow(0, null)
gh.setArrow(1, "cur")

page
gh.setArrow(1, null)
gh.setArrow(0, "cur")

page
gh.setColor(2, "blue")
gh.setArrow(0, null)
gh.setArrow(2, "cur")

page
gh.setColor(3, "blue")
gh.setArrow(2, null)
gh.setArrow(3, "cur")

page
gh.setColor(4, "blue")
gh.setArrow(3, null)
gh.setArrow(4, "cur")

page
gh.setArrow(4, null)
gh.setArrow(2, "cur")

page
gh.setColor(5, "blue")
gh.setArrow(2, null)
gh.setArrow(5, "cur")

page
gh.setColor(7, "blue")
gh.setArrow(5, null)
gh.setArrow(7, "cur")

page
gh.setArrow(7, null)
gh.setArrow(0, "cur")

page
gh.setColor(6, "blue")
gh.setArrow(0, null)
gh.setArrow(6, "cur")`,
  },
  {
    id: "50",
    title: "reconstruct-itinerary",
    userCode: `graph gh = {
  nodes: [n1,n2,n3,n4]
  value: ["aaa","bbb","ccc","jfk"]
  edges: [n1-n4, n2-n3, n3-n4, n2-n4]
  color: [null,null,null,null]
}

page
show gh

page
gh.setColor(3, "green")

page
gh.setColors(["green",null,null,"green"])

page
gh.setColors([null,null,null,"green"])

page
gh.setColors([null,null,"green","green"])

page
gh.setColors([null,"green","green","green"])

page
gh.setColors(["green","green","green","green"])`,
  },
  {
    "id":"51",
    "title":"find path in a maze i",
    "userCode" : `matrix mr1 = {
  value: [[1,0,"x",0],[0,0,"x",2],[0,0,0,0],["x","x",0,0]]
  color: [[null,null,"red",null],[null,null,"red","green"],[null,null,null,null],["red","red",null,null]]
  arrow: [["start",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}

page
show mr1

page
mr1.setColor(0,0,"blue")
mr1.setArrow(0,0,null)

page
mr1.setColor(0,1,"blue")
mr1.setArrow(0,1,"c")

page
mr1.setColor(1,1,"blue")
mr1.setArrow(0,1,null)
mr1.setArrow(1,1,"c")

page
mr1.setColor(1,0,"blue")
mr1.setArrow(1,1,null)
mr1.setArrow(1,0,"c")

page
mr1.setColor(2,0,"blue")
mr1.setArrow(1,0,null)
mr1.setArrow(2,0,"c")

page
mr1.setColor(2,1,"blue")
mr1.setArrow(2,0,null)
mr1.setArrow(2,1,"c")

page
mr1.setColor(2,2,"blue")
mr1.setArrow(2,1,null)
mr1.setArrow(2,2,"c")

page
mr1.setColor(2,3,"blue")
mr1.setArrow(2,2,null)
mr1.setArrow(2,3,"c")

page
mr1.setArrow(2,3,null)
mr1.setArrow(1,3,"finish")`,
  },
  {
    "id":"52",
    "title":"find path in a maze ii",
    "userCode" : `matrix mr1 = {
  value: [[1,0,"x",0],[0,0,"x",2],[0,"x",0,0],[0,0,0,0]]
  color: [[null,null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
  arrow: [["start",null,null,null],[null,null,null,null],[null,null,null,null],[null,null,null,null]]
}

page
show mr1

page
mr1.setColors([[null,null,"red",null],[null,null,"red",null],[null,"red",null,null],[null,null,null,null]])

page
mr1.setColor(0,0,"blue")

page
mr1.setValue(0,1,1)
mr1.setColor(0,1,"blue")

page
mr1.setValue(1,1,2)
mr1.setColor(1,1,"blue")

page
mr1.setValue(1,0,1)
mr1.setColor(1,0,"blue")

page
mr1.setValue(2,0,2)
mr1.setColor(2,0,"blue")

page
mr1.setValue(3,0,3)
mr1.setColor(3,0,"blue")

page
mr1.setValue(3,1,4)
mr1.setColor(3,1,"blue")

page
mr1.setValue(3,2,5)
mr1.setColor(3,2,"blue")

page
mr1.setValue(2,2,5)
mr1.setColor(2,2,"blue")

page
mr1.setValue(3,3,6)
mr1.setColor(3,3,"blue")

page
mr1.setValue(2,3,7)
mr1.setColor(2,3,"blue")

page
mr1.setValue(1,3,8)
mr1.setColor(1,3,"green")
mr1.setArrow(1,3,"finish")`,
  },
  {
    "id":"53",
    "title":"spiral in a matrix",
    "userCode" : ``,
  },
];

/*
{
  "id":"",
  "title":"",
  "userCode" : ``,
},
*/
