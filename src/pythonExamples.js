const pythonExamples = [
	{
		groupName: 'Template',
		items: [
			{
				id: "emptyTemplate",
				title: "Empty Template",
				userCode: `# Write Python code here
# Click Run Code to visualize`
			},
		]
	},
	{
		groupName: "Single-Page Examples",
		items: [
			{
				id: "listManipulation",
				title: "Example - List",
				userCode: `arr = [1, 2, 3]
arr.append(4)
arr.append(5)

for i in range(len(arr)):
	arr[i] += 2`
			},
			{
				id: "stackManipulation",
				title: "Example - Stack",
				userCode: `st = []
st.append(10)   
st.append(20)
st.append(30)
st.append(40)
st.pop()
st.pop()`
			},
            {
                id: "graphSimulation",
				title: "Example - Graph",
				userCode: `# Simple graph (using lists)
network = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A"],
    "D": ["B"]
}

# Add new nodes
network["E"] = []
network["F"] = []
network["A"].append("E")`
            },
			{
				id: "TreeSimulation",
				title: "Example - Tree",
				userCode: `# Simple tree node
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.children = []

    def add_child(self, child):
        self.children.append(child)

root = TreeNode("A")
c1 = TreeNode("B")
c2 = TreeNode("C")
root.add_child(c1)
root.add_child(c2)

c3 = TreeNode("D")
c1.add_child(c3)
`
			},
			{
				id: "functions",
				title: "Example - Function Calls",
				userCode: `def add(a, b):
    return a + b

result = add(3, 5)`
			},{
				id: "recursion",
				title: "Example - Recursion",
				userCode: `def fib(n):
	if n <= 1:
		return n
	else:
		return (fib(n-1) + fib(n-2))

res = fib(6)`
			}

		]
	},{
		groupName: 'Algorithms',
		items: [
			{
				id: "bubbleSort",
				title: "Example - Bubble Sort",
				userCode: `numbers = [64, 34, 25, 12, 5]

# Bubble sort
for i in range(len(numbers)):
    for j in range(0, len(numbers) - i - 1):
        if numbers[j] > numbers[j + 1]:
            # Swap
            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]`
			},
			{
				id: "insertionSort",
				title: "Example - Insertion Sort",
				userCode: `numbers = [64, 34, 25, 12, 5]

# Insertion sort

for i in range(1, len(numbers)):
    j = i

    while j > 0 and numbers[j] < numbers[j - 1]:
        numbers[j], numbers[j - 1] = numbers[j - 1], numbers[j]
        j -= 1`
			},
			{
				id: "binarySearch",
				title: "Example - Binary Search",
				userCode:`def binary_search(arr, target):
    l = 0
    r = len(arr) - 1

    while l <= r:
        mid = (l + r) // 2

        if arr[mid] == target:
            return mid

        elif arr[mid] < target:
            l = mid + 1

        else:
            r = mid - 1

    return -1

arr = [23, 1, 9, 12, 5, 25, 2, 3]
location = binary_search(arr, 25)
				`
			},{
				id: "BFS",
				title: "Example - Breadth First Search",
				userCode: `
				`
			}
		]
	},
];

export { pythonExamples };
