export const examples = [
  {
    "id":"badExample",
    "title":"Bad example",
    "tags":[],
    "svg":``,
    "userCode":`// common error
// 1.page index exceeds data structure, i.e no array[9] but there are only 5 element in array
// 2.invalid input format
// 3.arrow field with ""
// 4.can't find component name
// 5.page index is invalid, like -1
    data:
	array arr = {
		structure: [[unit1],[unit1,unit2],[unit1,unit2,unit3], *] # unit_id, required
	}
	linkedlist li = {
		structure: [[unit1],[unit1,unit2],[unit1,unit2,unit3], *] # unit_id, required
	}
	tree tr = {
		structure: [[node1],[node1,node2],[node1,node2,node3], *, *, *]
	}

draw:
	page p := [0,2] {
		show arr[p]
		show li[p-1]
	}
	page p := [3,3] {
		show li[3]
	}
	page i := [4,8] {
		show li[8-i]
		show tr[i]
	}`,
  },
  {
    "id":"goodExample",
    "title":"Good example",
    "tags":[],
    "svg":"",
    "userCode":`data:
	array arr = {
		structure: [[unit1],[unit1,unit2],[unit1,unit2,unit3], *]
	}
	linkedlist li = {
		structure: [[unit1],[unit1,unit2],[unit1,unit2,unit3], *] 
	}
	tree tr = {
		structure: [[node1],[node1,node2],[node1,node2,node3], *, *, *]
	}

draw:
	page p := [0,2] {
		show arr[p]
		show li[p]
	}
	page p := [3,3] {
		show li[3]
	}`,
    "renderCode":"",
  },
  {
    "id":"goodExample2",
    "title":"Good example 2",
    "tags":[],
    "svg":"",
    "userCode":`data:
graph gh = {
  id:[[n1],[n1,n2],[n1,n2,n3],[n1,n2,n3,n4],[n1,n2,n3,n4,n5]]
  edge:[[(n1,n1)],[(n1,n2),(n1,n1)]]
  value:[[n1,n1],[n1,n2,n1,n2],[n1,n2,n3,n1,n2,n3],[n1,n2,n3,n4,n1,n2,n3,n4],[n1,n2,n3,n4,n5,n1,n2,n3,n4,n5]]
  color:[[blue],[null,blue],[null,null,blue],[null,null,null,null],[null,null,null,null,null]]
  arrow:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
  hidden:[[false],[false,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
}
array arr = {
  structure:[[n1],[n1,n2],[n1,n2,n3],[n1,n2,n3,n4],[n1,n2,n3,n4,n5]]
  value:[[n1,n1],[n1,n2,n1,n2],[n1,n2,n3,n1,n2,n3],[n1,n2,n3,n4,n1,n2,n3,n4],[n1,n2,n3,n4,n5,n1,n2,n3,n4,n5]]
  color:[[blue],[null,blue],[null,null,blue],[null,null,null,null],[null,null,null,null,null]]
  arrow:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
  hidden:[[false],[false,false],[false,false,false],[false,false,false,false],[false,false,false,false,false]]
}
tree tr = {
  structure:[[n1],[n1,n2],[n1,n2,n3],[n1,n2,n3,n4],[n1,n2,n3,n4,n5]]
  value:[[n1,n1],[n1,n2,n1,n2],[n1,n2,n3,n1,n2,n3],[n1,n2,n3,n4,n1,n2,n3,n4],[n1,n2,n3,n4,n5,n1,n2,n3,n4,n5]]
  color:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
  arrow:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
  hidden:[[false],[false,false],[false,false,false],[false,false,false,false],[false,false,false,false,false]]
}
linkedlist li = {
  structure:[[n1],[n1,n2],[n1,n2,n3],[n1,n2,n3,n4],[n1,n2,n3,n4,n5]]
  value:[[n1,n1],[n1,n2,n1,n2],[n1,n2,n3,n1,n2,n3],[n1,n2,n3,n4,n1,n2,n3,n4],[n1,n2,n3,n4,n5,n1,n2,n3,n4,n5]]
  color:[[blue],[null,blue],[null,null,blue],[null,null,null,null],[null,null,null,null,null]]
  arrow:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
  hidden:[[false],[false,false],[false,false,false],[false,false,false,false],[false,false,false,false,false]]
}
stack sk = {
  structure:[[n1],[n1,n2],[n1,n2,n3],[n1,n2,n3,n4],[n1,n2,n3,n4,n5]]
  value:[[n1,n1],[n1,n2,n1,n2],[n1,n2,n3,n1,n2,n3],[n1,n2,n3,n4,n1,n2,n3,n4],[n1,n2,n3,n4,n5,n1,n2,n3,n4,n5]]
  color:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
  arrow:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null,null]]
  hidden:[[false],[false,false],[false,false,false],[false,false,false,false],[false,false,false,false,false]]
}
matrix mr = {
  structure:[[[1]],[[1],[1,2]],[[1],[1,2],[1,2,3]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]]]
  value:[[[1]],[[1],[1,2]],[[1],[1,2],[1,2,3]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]]]
  color:[[[1]],[[1],[1,2]],[[1],[1,2],[1,2,3]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]],[[1],[1,2],[1,2,3],[1,2,3,4]]]
  arrow:[[[null]],[[yes],[null,yes]],[[null],[null,null],[null,yes,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]]]
  hidden:[[[null]],[[null],[null,null]],[[null],[null,null],[null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]],[[null],[null,null],[null,null,null],[null,null,null,null]]]
}
draw:
page p:=[0,2] {
show mr[p]
}
page p:=[3,4] {
show tr[p-3]
}
page p:=[5,6] {
show li[p-5]
show arr[p-5]
}
page i:=[7,8] {
show sk[i-7]
}
page jk:=[9,13] {
show gh[jk-9]
}`,
    "renderCode":"",
  },
  {
    "id":"graphTest",
    "title":"graph Test",
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
    "id":"arrayTest",
    "title":"array Test",
    "userCode":`data:
array arr1 = {
structure:[[n1],[n1,n2],[n1,n2,n3]]
}
array arr2 = {
structure:[[n1],[n1,n2],[n1,n2,n3]]
}
draw:
page p := [0,1] {
show arr1[p]
}
page p := [2,2] {
show arr1[p]
show arr2[p-1]
}`,  
  },
  {
  "id":"Fibonacci",
  "title":"Fibonacci",
  "userCode":`data:
array arr1 = {
  structure:[[1],[1,1],[1,1,2],[1,1,2,3],[1,1,2,3,5],[1,1,2,3,5,8]]
  value:[[1],[1,1],[1,1,2],[1,1,2,3],[1,1,2,3]]
  color:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null]]
  arrow:[[null],[null,null],[null,null,null],[null,null,null,null],[null,null,null,null]]
  hidden:[[false],[false,false],[false,false,false],[false,false,false,false],[false,false,false,false]]
}
draw:
page p:=[0,5] {
show arr1[p]
}`
  },
  {
    "id":"dfsExample",
    "title":"Depth-First Search",
    "userCode":`data:
graph dfs = {
  id:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  edge:[[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)],[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)],[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)],[(n1,n2),(n1,n6),(n1,n7),(n2,n3),(n3,n7),(n3,n5),(n4,n5),(n4,n6),(n4,n8)]]
  value:[[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8],[n1,n2,n3,n4,n5,n6,n7,n8]]
  color:[[red,null,null,null,null,null,null,null],[blue,red,null,null,null,null,null,null],[blue,blue,red,null,null,null,null,null],[blue,blue,blue,null,red,null,null,null]]
  arrow:[[start,null,null,null,null,null,null,null],[null,cur,null,null,null,null,null,null],[null,null,cur,null,null,null,null,null],[null,null,null,null,cur,null,null,null]]
  hidden:[[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]]
}
draw:
page p:=[0,3] {
show dfs[p]
}`
    },
];