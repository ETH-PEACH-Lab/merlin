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
				id: "sorting",
				title: "Example - Sorting Algorithm",
				userCode: `numbers = [64, 34, 25, 12, 5]

# Bubble sort
for i in range(len(numbers)):
    for j in range(0, len(numbers) - i - 1):
        if numbers[j] > numbers[j + 1]:
            # Swap
            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]`
			},
		]
	},
];

export { pythonExamples };
