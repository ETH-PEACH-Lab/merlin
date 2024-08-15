import {
  populateCommonDb
} from "./chunk-6TDVKNU6.mjs";
import {
  parse
} from "./chunk-U5ICLL4I.mjs";
import "./chunk-2F4TJHAZ.mjs";
import "./chunk-R6VZ7MLL.mjs";
import "./chunk-RC5JYBIS.mjs";
import "./chunk-LKACUY5P.mjs";
import "./chunk-MFAOG3JX.mjs";
import "./chunk-HKFA4ZNF.mjs";
import {
  selectSvgElement
} from "./chunk-2GTEEQBD.mjs";
import "./chunk-A4EGXCE3.mjs";
import "./chunk-3FCBLY7Z.mjs";
import {
  cleanAndMerge
} from "./chunk-PBHS5J4T.mjs";
import "./chunk-A6W4AWM4.mjs";
import {
  clear,
  configureSvgSize,
  defaultConfig_default,
  getAccDescription,
  getAccTitle,
  getConfig,
  getDiagramTitle,
  log,
  select_default,
  setAccDescription,
  setAccTitle,
  setDiagramTitle
} from "./chunk-655LXKCO.mjs";
import "./chunk-TNAZEAIZ.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// src/diagrams/visual/db.ts
var defaultVisualData = [];
var data = [...defaultVisualData];
var DEFAULT_VISUAL_CONFIG = defaultConfig_default.visual;
var getConfig2 = /* @__PURE__ */ __name(() => {
  return cleanAndMerge({
    ...DEFAULT_VISUAL_CONFIG,
    ...getConfig().visual
  });
}, "getConfig");
var getPages = /* @__PURE__ */ __name(() => data, "getPages");
var addPage = /* @__PURE__ */ __name((page) => {
  data.push(page);
}, "addPage");
var clear2 = /* @__PURE__ */ __name(() => {
  clear();
  data = [...defaultVisualData];
}, "clear");
var db = {
  getPages,
  addPage,
  getConfig: getConfig2,
  clear: clear2,
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription
};

// src/diagrams/visual/parser.ts
var populate = /* @__PURE__ */ __name((ast) => {
  populateCommonDb(ast, db);
  for (const page of ast.pages) {
    const subDiagrams = page.subDiagrams.map((subDiagram) => {
      switch (subDiagram.diagramType) {
        case "array":
          return {
            type: "array",
            orientation: subDiagram.orientation,
            title: subDiagram.title,
            showIndex: subDiagram.showIndex,
            label: subDiagram.label,
            elements: subDiagram.elements.map((e) => ({
              value: e.value,
              color: e.color,
              arrow: e.arrowLabel !== void 0 && e.arrowLabel !== null,
              //if with arrow then True, else False
              arrowLabel: e.arrowLabel
            }))
          };
        case "matrix":
          return {
            type: "matrix",
            title: subDiagram.title,
            rows: subDiagram.rows.map((row) => ({
              elements: row.elements.map((e) => ({
                value: e.value,
                color: e.color
              }))
            })),
            showIndex: subDiagram.showIndex,
            label: subDiagram.label
          };
        case "stack":
          return {
            type: "stack",
            orientation: subDiagram.orientation,
            title: subDiagram.title,
            showIndex: subDiagram.showIndex,
            label: subDiagram.label,
            size: subDiagram.size,
            elements: subDiagram.elements.map((e) => ({
              value: e.value,
              color: e.color,
              arrow: e.arrowLabel !== void 0 && e.arrowLabel !== null,
              //if with arrow then True, else False
              arrowLabel: e.arrowLabel
            }))
          };
        case "tree":
          return {
            type: "tree",
            title: subDiagram.title,
            label: subDiagram.label,
            elements: subDiagram.elements.map((element) => ({
              nodeId: element.nodeId,
              left: element.left == "None" ? void 0 : element.left,
              right: element.right == "None" ? void 0 : element.right,
              value: element.value,
              color: element.color
            }))
          };
        case "graph":
          return {
            type: "graph",
            title: subDiagram.title,
            label: subDiagram.label,
            elements: subDiagram.elements.map((element) => {
              if (element.$type == "NodeDefinition") {
                return {
                  type: "node",
                  nodeId: element.nodeId,
                  value: element.value,
                  color: element.color,
                  arrow: element.arrowLabel !== void 0 && element.arrowLabel !== null,
                  arrowLabel: element.arrowLabel,
                  hidden: element.hidden
                };
              } else if (element.$type == "EdgeDefinition") {
                return {
                  type: "edge",
                  start: element.start,
                  end: element.end,
                  value: element.value,
                  color: element.color
                };
              } else {
                throw new Error("Unknown graph element type");
              }
            })
          };
        case "linkedList":
          return {
            type: "linkedList",
            title: subDiagram.title,
            label: subDiagram.label,
            elements: subDiagram.elements.map((e) => ({
              value: e.value,
              color: e.color,
              arrow: e.arrowLabel ? true : false,
              arrowLabel: e.arrowLabel
            }))
          };
        case "text":
          return {
            type: "text",
            title: subDiagram.title,
            elements: subDiagram.elements.map((e) => e.value)
          };
        default:
          throw new Error(`Unknown diagram type: ${subDiagram.diagramType}`);
      }
    });
    db.addPage({ subDiagrams });
  }
}, "populate");
var parser = {
  parse: async (input) => {
    const ast = await parse("visual", input);
    log.debug(ast);
    populate(ast);
  }
};

// src/diagrams/visual/drawArrayDiagram.ts
var drawArrayDiagram = /* @__PURE__ */ __name((svg, arrayDiagram, yOffset, config) => {
  svg.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "6").attr("markerHeight", "6").attr("orient", "auto-start-reverse").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
  const titleFontSize = "16";
  const title_X = 100;
  const title_Y = 20;
  const labelFontSize = "16";
  const label_X = 100;
  const label_Y = 160;
  if (arrayDiagram.title) {
    svg.append("text").attr("x", title_X).attr("y", title_Y).attr("fill", config.labelColor).attr("font-size", titleFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrayDiagramTitle").text(arrayDiagram.title);
  }
  const xOffset = 50;
  const group = svg.append("g").attr("transform", `translate(${xOffset}, ${yOffset + 40})`);
  arrayDiagram.elements.forEach((element, index) => {
    drawElement(group, element, index, config, arrayDiagram.showIndex || false);
  });
  if (arrayDiagram.label) {
    const labelYPosition = label_Y;
    const labelXPosition = label_X;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", config.labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrayDiagramLabel").text(arrayDiagram.label);
  }
}, "drawArrayDiagram");
var drawElement = /* @__PURE__ */ __name((svg, element, index, { labelColor, labelFontSize }, showIndex) => {
  const indexFontSize = "16";
  const elementFontSize = "16";
  const group = svg.append("g");
  const elementSize = 40;
  const elementX = index * elementSize;
  const elementY = 50;
  const fillColor = getColor(element.color);
  if (element.arrow) {
    const arrowYStart = elementY - 40;
    const arrowYEnd = elementY - 10;
    group.append("line").attr("x1", elementX + 20).attr("y1", arrowYStart).attr("x2", elementX + 20).attr("y2", arrowYEnd).attr("stroke", "black").attr("stroke-width", "1.5").attr("marker-end", "url(#arrowhead)");
    if (element.arrowLabel) {
      group.append("text").attr("x", elementX + 20).attr("y", arrowYStart - 20).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrowContext").text(element.arrowLabel);
    }
  }
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", elementSize).attr("height", elementSize).style("fill", fillColor).attr("stroke", "#000000").attr("stroke-width", "2px").attr("class", "arrayElement");
  group.append("text").attr("x", elementX + elementSize / 2).attr("y", elementY + elementSize / 2).attr("fill", labelColor).attr("font-size", elementFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value);
  if (showIndex) {
    group.append("text").attr("x", elementX + elementSize / 2).attr("y", elementY + elementSize + 20).attr("fill", labelColor).attr("font-size", indexFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "indexLabel").text(index);
  }
}, "drawElement");
var getColor = /* @__PURE__ */ __name((color) => {
  switch (color) {
    case "blue":
      return "rgba(0, 0, 255, 0.3)";
    case "green":
      return "rgba(0, 255, 0, 0.3)";
    case "red":
      return "rgba(255, 0, 0, 0.3)";
    default:
      return "none";
  }
}, "getColor");

// src/diagrams/visual/drawMatrixDiagram.ts
var drawMatrixDiagram = /* @__PURE__ */ __name((svg, matrixDiagram, yOffset, config) => {
  const xOffset = 50;
  const titleOffset = matrixDiagram.title ? 100 : 0;
  const group = svg.append("g").attr("transform", `translate(${xOffset}, ${yOffset + titleOffset})`);
  const rowCount = matrixDiagram.rows.length;
  const colCount = Math.max(...matrixDiagram.rows.map((row) => row.elements.length));
  if (matrixDiagram.title) {
    svg.append("text").attr("x", xOffset).attr("y", yOffset).attr("fill", config.labelColor).attr("font-size", config.labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "start").attr("class", "diagramTitle").text(matrixDiagram.title);
  }
  matrixDiagram.rows.forEach((row, rowIndex) => {
    row.elements.forEach((element, colIndex) => {
      drawElement2(group, element, rowIndex, colIndex, config);
      drawGrid(group, rowIndex, colIndex, config);
    });
  });
  if (matrixDiagram.label) {
    const labelYPosition = rowCount * 50 + 50;
    const labelXPosition = colCount * 25;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", config.labelColor).attr("font-size", config.labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrayDiagramLabel").text(matrixDiagram.label);
  }
  if (matrixDiagram.showIndex) {
    addIndices(group, rowCount, colCount, config);
  }
}, "drawMatrixDiagram");
var drawElement2 = /* @__PURE__ */ __name((svg, element, rowIndex, colIndex, { labelColor, labelFontSize }) => {
  const group = svg.append("g");
  const elementX = colIndex * 50;
  const elementY = rowIndex * 50;
  const borderColor = "#000000";
  const borderWidth = "1.2px";
  const fillColor = getColor2(element.color);
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 50).attr("height", 50).style("fill", fillColor).attr("stroke", borderColor).attr("stroke-width", borderWidth).attr("class", "matrixElement");
  group.append("text").attr("x", elementX + 25).attr("y", elementY + 25).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value.toString());
}, "drawElement");
var addIndices = /* @__PURE__ */ __name((svg, rowCount, colCount, { labelColor, labelFontSize }) => {
  const indexGroup = svg.append("g");
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    indexGroup.append("text").attr("x", -10).attr("y", rowIndex * 50 + 25).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "rowIndex").text(rowIndex.toString());
  }
  for (let colIndex = 0; colIndex < colCount; colIndex++) {
    indexGroup.append("text").attr("x", colIndex * 50 + 25).attr("y", -10).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "colIndex").text(colIndex.toString());
  }
}, "addIndices");
var drawGrid = /* @__PURE__ */ __name((svg, rowIndex, colIndex, { borderColor, borderWidth }) => {
  const gridGroup = svg.append("g");
  const x = colIndex * 50;
  const y = rowIndex * 50;
  gridGroup.append("rect").attr("x", x).attr("y", y).attr("width", 50).attr("height", 50).attr("stroke", borderColor).attr("stroke-width", borderWidth).attr("fill", "none");
}, "drawGrid");
var getColor2 = /* @__PURE__ */ __name((color) => {
  switch (color) {
    case "blue":
      return "rgba(0, 0, 255, 0.3)";
    case "green":
      return "rgba(0, 255, 0, 0.3)";
    case "red":
      return "rgba(255, 0, 0, 0.3)";
    default:
      return "none";
  }
}, "getColor");

// src/diagrams/visual/drawStackDiagram.ts
var drawStackDiagram = /* @__PURE__ */ __name((svg, stackDiagram, yOffset) => {
  const group = svg.append("g").attr("transform", `translate(0, ${yOffset})`);
  const stackHeight = stackDiagram.size * 40;
  drawFramework(group, 50, 0, 70, stackHeight);
  stackDiagram.elements.forEach((element, index) => {
    const positionIndex = stackDiagram.size - stackDiagram.elements.length + index;
    drawElement3(group, element, positionIndex);
  });
  if (stackDiagram.label) {
    const totalHeight = stackHeight + 40;
    const labelYPosition = totalHeight + 20;
    const labelXPosition = 85;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "stackDiagramLabel").text(stackDiagram.label);
  }
}, "drawStackDiagram");
var drawElement3 = /* @__PURE__ */ __name((svg, element, positionIndex) => {
  const group = svg.append("g");
  const elementX = 50;
  const elementY = positionIndex * 40;
  const fillColor = getColor3(element.color);
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 70).attr("height", 40).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "stackElement");
  group.append("text").attr("x", elementX + 35).attr("y", elementY + 20).attr("fill", "black").attr("font-size", "12").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value);
}, "drawElement");
var drawFramework = /* @__PURE__ */ __name((svg, x, y, width, height) => {
  const borderColor = "#000000";
  const borderWidth = 2;
  svg.append("line").attr("x1", x).attr("y1", y).attr("x2", x).attr("y2", y + height).attr("stroke", borderColor).attr("stroke-width", borderWidth);
  svg.append("line").attr("x1", x + width).attr("y1", y).attr("x2", x + width).attr("y2", y + height).attr("stroke", borderColor).attr("stroke-width", borderWidth);
  svg.append("line").attr("x1", x).attr("y1", y + height).attr("x2", x + width).attr("y2", y + height).attr("stroke", borderColor).attr("stroke-width", borderWidth);
}, "drawFramework");
var getColor3 = /* @__PURE__ */ __name((color) => {
  switch (color) {
    case "blue":
      return "rgba(0, 0, 255, 0.3)";
    case "green":
      return "rgba(0, 255, 0, 0.3)";
    case "red":
      return "rgba(255, 0, 0, 0.3)";
    default:
      return "none";
  }
}, "getColor");

// src/diagrams/visual/drawGraphDiagram.ts
var drawGraphDiagram = /* @__PURE__ */ __name((svg, graphDiagram, yOffset) => {
  const group = svg.append("g").attr("transform", `translate(0, ${yOffset})`);
  const graphNodes = graphDiagram.elements.filter((ele) => ele.type == "node");
  const graphEdges = graphDiagram.elements.filter((ele) => ele.type == "edge");
  const nodePositions = calculateNodePositions(graphNodes || []);
  if (graphEdges) {
    graphEdges.forEach((edge) => {
      drawEdge(group, edge, nodePositions);
    });
  }
  if (graphNodes) {
    graphNodes.forEach((node) => {
      drawNode(group, node, nodePositions[node.nodeId]);
    });
  }
  if (graphDiagram.label) {
    const labelYPosition = graphNodes ? Math.ceil(graphNodes.length / 3) * 100 + 70 : 100;
    const labelXPosition = 150;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "graphDiagramLabel").text(graphDiagram.label);
  }
}, "drawGraphDiagram");
var calculateNodePositions = /* @__PURE__ */ __name((nodes) => {
  const positions = {};
  const radius = 100;
  const centerX = 150;
  const centerY = 150;
  const angleIncrement = 2 * Math.PI / nodes.length;
  nodes.forEach((node, index) => {
    const angle = index * angleIncrement;
    positions[node.nodeId] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  });
  return positions;
}, "calculateNodePositions");
var drawNode = /* @__PURE__ */ __name((svg, node, position) => {
  const nodeX = position.x;
  const nodeY = position.y;
  const fillColor = getColor4(node.color);
  svg.append("circle").attr("cx", nodeX).attr("cy", nodeY).attr("r", 20).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "graphNode");
  svg.append("text").attr("x", nodeX).attr("y", nodeY).attr("dy", ".35em").attr("fill", "black").attr("font-size", "12").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "nodeLabel").text(node.value || node.nodeId);
}, "drawNode");
var drawEdge = /* @__PURE__ */ __name((svg, edge, nodePositions) => {
  const startNodePosition = nodePositions[edge.start];
  const endNodePosition = nodePositions[edge.end];
  if (startNodePosition && endNodePosition) {
    const { startX, startY, endX, endY } = calculateEdgePosition(
      startNodePosition,
      endNodePosition
    );
    const strokeColor = edge.color || "black";
    svg.append("line").attr("x1", startX).attr("y1", startY).attr("x2", endX).attr("y2", endY).attr("stroke", strokeColor).attr("stroke-width", "2");
    if (edge.value) {
      svg.append("text").attr("x", (startX + endX) / 2).attr("y", (startY + endY) / 2).attr("fill", "black").attr("font-size", "12").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "edgeLabel").text(edge.value);
    }
  }
}, "drawEdge");
var calculateEdgePosition = /* @__PURE__ */ __name((start, end) => {
  const radius = 20;
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const offsetX = deltaX * radius / distance;
  const offsetY = deltaY * radius / distance;
  return {
    startX: start.x + offsetX,
    startY: start.y + offsetY,
    endX: end.x - offsetX,
    endY: end.y - offsetY
  };
}, "calculateEdgePosition");
var getColor4 = /* @__PURE__ */ __name((color) => {
  switch (color) {
    case "blue":
      return "rgba(0, 0, 255, 0.3)";
    case "green":
      return "rgba(0, 255, 0, 0.3)";
    case "red":
      return "rgba(255, 0, 0, 0.3)";
    default:
      return "none";
  }
}, "getColor");

// src/diagrams/visual/drawTreeDiagram.ts
var drawTreeDiagram = /* @__PURE__ */ __name((svg, treeDiagram, yOffset) => {
  const group = svg.append("g").attr("transform", `translate(0, ${yOffset})`);
  const treeNodes = treeDiagram.elements || [];
  const treeEdges = calculateTreeEdges(treeNodes);
  const nodePositions = calculateNodePositions2(treeNodes);
  if (treeEdges) {
    treeEdges.forEach((edge) => {
      drawEdge2(group, edge, nodePositions);
    });
  }
  if (treeNodes) {
    treeNodes.forEach((node) => {
      drawNode2(group, node, nodePositions[node.nodeId]);
    });
  }
  if (treeDiagram.label) {
    const labelYPosition = treeNodes ? Math.ceil(treeNodes.length / 3) * 100 + 70 : 100;
    const labelXPosition = 150;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "treeDiagramLabel").text(treeDiagram.label);
  }
}, "drawTreeDiagram");
var calculateNodePositions2 = /* @__PURE__ */ __name((nodes) => {
  const positions = {};
  const levelHeight = 100;
  const siblingDistance = 50;
  const currentY = 0;
  const calculatePosition = /* @__PURE__ */ __name((node, currentX, depth) => {
    const x = currentX;
    const y = currentY + depth * levelHeight;
    positions[node.nodeId] = { x, y };
    const leftChild = nodes.find((n) => n.nodeId === node.left);
    const rightChild = nodes.find((n) => n.nodeId === node.right);
    if (leftChild) {
      calculatePosition(leftChild, x - siblingDistance, depth + 1);
    }
    if (rightChild) {
      calculatePosition(rightChild, x + siblingDistance, depth + 1);
    }
  }, "calculatePosition");
  const rootNode = nodes.find((node) => !node.parentId);
  if (rootNode) {
    calculatePosition(rootNode, 150, 0);
  }
  return positions;
}, "calculateNodePositions");
var calculateTreeEdges = /* @__PURE__ */ __name((nodes) => {
  const edges = [];
  nodes.forEach((node) => {
    if (node.left) {
      edges.push({ start: node.nodeId, end: node.left });
    }
    if (node.right) {
      edges.push({ start: node.nodeId, end: node.right });
    }
  });
  return edges;
}, "calculateTreeEdges");
var drawNode2 = /* @__PURE__ */ __name((svg, node, position) => {
  const nodeX = position.x;
  const nodeY = position.y;
  const fillColor = getColor5(node.color);
  svg.append("circle").attr("cx", nodeX).attr("cy", nodeY).attr("r", 20).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "treeNode");
  svg.append("text").attr("x", nodeX).attr("y", nodeY).attr("dy", ".35em").attr("fill", "black").attr("font-size", "12").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "nodeLabel").text(node.value || node.nodeId);
}, "drawNode");
var drawEdge2 = /* @__PURE__ */ __name((svg, edge, nodePositions) => {
  const startNodePosition = nodePositions[edge.start];
  const endNodePosition = nodePositions[edge.end];
  if (startNodePosition && endNodePosition) {
    const { startX, startY, endX, endY } = calculateEdgePosition2(
      startNodePosition,
      endNodePosition
    );
    const strokeColor = edge.color || "black";
    svg.append("line").attr("x1", startX).attr("y1", startY).attr("x2", endX).attr("y2", endY).attr("stroke", strokeColor).attr("stroke-width", "2");
    if (edge.value) {
      svg.append("text").attr("x", (startX + endX) / 2).attr("y", (startY + endY) / 2).attr("fill", "black").attr("font-size", "12").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "edgeLabel").text(edge.value);
    }
  }
}, "drawEdge");
var calculateEdgePosition2 = /* @__PURE__ */ __name((start, end) => {
  const radius = 20;
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const offsetX = deltaX * radius / distance;
  const offsetY = deltaY * radius / distance;
  return {
    startX: start.x + offsetX,
    startY: start.y + offsetY,
    endX: end.x - offsetX,
    endY: end.y - offsetY
  };
}, "calculateEdgePosition");
var getColor5 = /* @__PURE__ */ __name((color) => {
  switch (color) {
    case "blue":
      return "rgba(0, 0, 255, 0.3)";
    case "green":
      return "rgba(0, 255, 0, 0.3)";
    case "red":
      return "rgba(255, 0, 0, 0.3)";
    default:
      return "none";
  }
}, "getColor");

// src/diagrams/visual/drawLinkedListDiagram.ts
var drawLinkedListDiagram = /* @__PURE__ */ __name((svg, linkedListDiagram, yOffset) => {
  const group = svg.append("g").attr("transform", `translate(0, ${yOffset})`);
  group.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "10").attr("refY", "5").attr("markerWidth", "6").attr("markerHeight", "6").attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
  const linkedListNodes = linkedListDiagram.elements;
  const nodePositions = calculateNodePositions3(linkedListNodes || []);
  if (linkedListNodes) {
    linkedListNodes.forEach((node, index) => {
      drawNode3(
        group,
        node,
        nodePositions[index],
        index < linkedListNodes.length - 1
      );
    });
  }
  if (linkedListDiagram.label) {
    const labelYPosition = 100;
    const labelXPosition = 150;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "linkedListDiagramLabel").text(linkedListDiagram.label);
  }
}, "drawLinkedListDiagram");
var calculateNodePositions3 = /* @__PURE__ */ __name((nodes) => {
  const positions = [];
  const startX = 50;
  const startY = 50;
  const nodeSpacing = 120;
  nodes.forEach((_, index) => {
    positions.push({
      x: startX + index * nodeSpacing,
      y: startY
    });
  });
  return positions;
}, "calculateNodePositions");
var drawNode3 = /* @__PURE__ */ __name((svg, node, position, hasNext) => {
  const nodeX = position.x;
  const nodeY = position.y;
  const fillColor = getColor6(node.color);
  svg.append("rect").attr("x", nodeX).attr("y", nodeY).attr("width", 60).attr("height", 30).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "linkedListNode");
  svg.append("text").attr("x", nodeX + 30).attr("y", nodeY + 15).attr("dy", ".35em").attr("fill", "black").attr("font-size", "12").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "nodeLabel").text(node.value);
  if (node.arrow) {
    svg.append("line").attr("x1", nodeX + 30).attr("y1", nodeY - 30).attr("x2", nodeX + 30).attr("y2", nodeY).attr("stroke", "black").attr("stroke-width", "2").attr("marker-end", "url(#arrowhead)");
    if (node.arrowLabel) {
      svg.append("text").attr("x", nodeX + 30).attr("y", nodeY - 40).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "arrowLabel").text(node.arrowLabel);
    }
  }
  if (hasNext) {
    svg.append("line").attr("x1", nodeX + 60).attr("y1", nodeY + 15).attr("x2", nodeX + 60 + 60).attr("y2", nodeY + 15).attr("stroke", "black").attr("stroke-width", "2").attr("marker-end", "url(#arrowhead)");
  }
}, "drawNode");
var getColor6 = /* @__PURE__ */ __name((color) => {
  switch (color) {
    case "blue":
      return "rgba(0, 0, 255, 0.3)";
    case "green":
      return "rgba(0, 255, 0, 0.3)";
    case "red":
      return "rgba(255, 0, 0, 0.3)";
    default:
      return "white";
  }
}, "getColor");

// src/diagrams/visual/drawTextDiagram.ts
var drawTextDiagram = /* @__PURE__ */ __name((svg, textDiagram, yOffset) => {
  const group = svg.append("g").attr("transform", `translate(0, ${yOffset})`);
  let currentY = 0;
  textDiagram.elements.forEach((element) => {
    currentY = drawElement4(group, element, currentY);
  });
  if (textDiagram.label) {
    const labelYPosition = currentY + 20;
    const labelXPosition = 50;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "textDiagramLabel").text(textDiagram.label);
  }
}, "drawTextDiagram");
var drawElement4 = /* @__PURE__ */ __name((svg, element, startY) => {
  const group = svg.append("g");
  const elementX = 50;
  const lines = element.split("\n");
  lines.forEach((line, lineIndex) => {
    const lineY = startY + lineIndex * 20;
    group.append("text").attr("x", elementX).attr("y", lineY).attr("fill", "black").attr("font-size", "20").attr("dominant-baseline", "hanging").attr("class", "textElement").text(line);
  });
  return startY + lines.length * 20;
}, "drawElement");

// src/diagrams/visual/renderer.ts
var draw = /* @__PURE__ */ __name((_text, id, _version, diagram2) => {
  const db2 = diagram2.db;
  const config = db2.getConfig();
  const pages = db2.getPages();
  const title = db2.getDiagramTitle();
  const svgHeight = 800;
  const svgWidth = 1e3;
  const svg = selectSvgElement(id);
  let currentPage = 0;
  let playInterval = null;
  const renderPage = /* @__PURE__ */ __name((pageIndex) => {
    svg.selectAll("g.page").attr("display", "none");
    svg.select(`#page${pageIndex}`).attr("display", "inline");
    svg.select("#prevButton").attr("fill", pageIndex > 0 ? "#007bff" : "#c0c0c0");
    svg.select("#nextButton").attr("fill", pageIndex < pages.length - 1 ? "#007bff" : "#c0c0c0");
    svg.select("#pageIndicator").text(`${pageIndex + 1} / ${pages.length}`);
  }, "renderPage");
  const addNavigationButtons = /* @__PURE__ */ __name((svg2, totalPages) => {
    const buttonGroup = svg2.append("g").attr("class", "navigation-buttons");
    const buttonWidth = 40;
    const buttonHeight = 20;
    const buttonSpacing = 10;
    const buttonsX = svgWidth / 2 - (buttonWidth * 1.5 + buttonSpacing);
    const buttonsY = svgHeight - 60;
    const prevButtonGroup = buttonGroup.append("g").attr("id", "prevButtonGroup").attr("cursor", "pointer");
    prevButtonGroup.append("rect").attr("id", "prevButton").attr("x", buttonsX).attr("y", buttonsY).attr("width", buttonWidth).attr("height", buttonHeight).attr("fill", "#c0c0c0");
    prevButtonGroup.append("text").text("<").attr("x", buttonsX + buttonWidth / 2).attr("y", buttonsY + buttonHeight / 2).attr("fill", "white").attr("text-anchor", "middle").attr("alignment-baseline", "middle");
    const playButtonGroup = buttonGroup.append("g").attr("id", "playButtonGroup").attr("cursor", "pointer");
    playButtonGroup.append("rect").attr("id", "playButton").attr("x", buttonsX + buttonWidth + buttonSpacing).attr("y", buttonsY).attr("width", buttonWidth).attr("height", buttonHeight).attr("fill", "#007bff");
    playButtonGroup.append("text").text("\u25B6").attr("x", buttonsX + buttonWidth + buttonSpacing + buttonWidth / 2).attr("y", buttonsY + buttonHeight / 2).attr("fill", "white").attr("text-anchor", "middle").attr("alignment-baseline", "middle");
    const nextButtonGroup = buttonGroup.append("g").attr("id", "nextButtonGroup").attr("cursor", "pointer");
    nextButtonGroup.append("rect").attr("id", "nextButton").attr("x", buttonsX + 2 * (buttonWidth + buttonSpacing)).attr("y", buttonsY).attr("width", buttonWidth).attr("height", buttonHeight).attr("fill", "#007bff");
    nextButtonGroup.append("text").text(">").attr("x", buttonsX + 2 * (buttonWidth + buttonSpacing) + buttonWidth / 2).attr("y", buttonsY + buttonHeight / 2).attr("fill", "white").attr("text-anchor", "middle").attr("alignment-baseline", "middle");
    buttonGroup.append("text").attr("id", "pageIndicator").attr("x", svgWidth - 50).attr("y", svgHeight - 50).attr("fill", "black").attr("text-anchor", "middle").attr("alignment-baseline", "middle").text(`1 / ${totalPages}`);
    prevButtonGroup.node()?.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage -= 1;
        renderPage(currentPage);
      }
    });
    nextButtonGroup.node()?.addEventListener("click", () => {
      if (currentPage < totalPages - 1) {
        currentPage += 1;
        renderPage(currentPage);
      }
    });
    playButtonGroup.node()?.addEventListener("click", () => {
      if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
        select_default("#playButton text").text("\u25B6");
        select_default("#playButton").attr("fill", "#007bff");
      } else {
        playInterval = 1e3;
        select_default("#playButton text").text("\u275A\u275A");
        select_default("#playButton").attr("fill", "#c0c0c0");
      }
    });
  }, "addNavigationButtons");
  const drawPage = /* @__PURE__ */ __name((svg2, page, pageIndex) => {
    const pageGroup = svg2.append("g").attr("id", `page${pageIndex}`).attr("class", "page").attr("display", pageIndex === 0 ? "inline" : "none");
    if (title) {
      pageGroup.append("text").text(title).attr("x", svgWidth / 2).attr("y", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "pageTitle");
    }
    let yOffset = 50;
    for (const subDiagram of page.subDiagrams) {
      switch (subDiagram.type) {
        case "array": {
          drawArrayDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            config
          );
          yOffset += 250;
          break;
        }
        case "matrix": {
          drawMatrixDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            config
          );
          yOffset += 250;
          break;
        }
        case "stack": {
          drawStackDiagram(pageGroup, subDiagram, yOffset);
          yOffset += 250;
          break;
        }
        case "graph": {
          drawGraphDiagram(pageGroup, subDiagram, yOffset);
          yOffset += 250;
          break;
        }
        case "tree": {
          drawTreeDiagram(pageGroup, subDiagram, yOffset);
          yOffset += 250;
          break;
        }
        case "linkedList": {
          drawLinkedListDiagram(
            pageGroup,
            subDiagram,
            yOffset
          );
          yOffset += 250;
          break;
        }
        case "text": {
          drawTextDiagram(pageGroup, subDiagram, yOffset);
          yOffset += 250;
          break;
        }
        default:
          throw new Error(`Unknown diagram type: ${subDiagram.type}`);
      }
    }
  }, "drawPage");
  svg.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  configureSvgSize(svg, svgHeight, svgWidth, config.useMaxWidth);
  pages.forEach((page, index) => {
    drawPage(svg, page, index);
  });
  addNavigationButtons(svg, pages.length);
  renderPage(currentPage);
  const switchPageScript = `
    (function() {
      const svg = document.getElementById('${id}');
      let currentPage = 0;
      const totalPages = ${pages.length};
      let playInterval = null;

      function renderPage(pageIndex) {
        const pages = svg.querySelectorAll('g.page');
        pages.forEach(page => {
          page.style.display = 'none';
        });
        svg.querySelector('#page' + pageIndex).style.display = 'inline';

        const prevButton = svg.querySelector('#prevButton');
        const nextButton = svg.querySelector('#nextButton');
        
        if (prevButton) prevButton.setAttribute('fill', pageIndex > 0 ? '#007bff' : '#c0c0c0');
        if (nextButton) nextButton.setAttribute('fill', pageIndex < totalPages - 1 ? '#007bff' : '#c0c0c0');

        // Update current page display
        svg.querySelector('#pageIndicator').textContent = (pageIndex + 1) + ' / ' + totalPages;
      }

      svg.querySelector('#prevButtonGroup').addEventListener('click', function() {
        if (currentPage > 0) {
          currentPage -= 1;
          renderPage(currentPage);
        }
      });

      svg.querySelector('#nextButtonGroup').addEventListener('click', function() {
        if (currentPage < totalPages - 1) {
          currentPage += 1;
          renderPage(currentPage);
        }
      });

      svg.querySelector('#playButtonGroup').addEventListener('click', function() {
        if (playInterval) {
          clearInterval(playInterval);
          playInterval = null;
          svg.querySelector('#playButton text').textContent = '\u25B6';
          svg.querySelector('#playButton').setAttribute('fill', '#007bff');
        } else {
          playInterval = setInterval(() => {
            if (currentPage < totalPages - 1) {
              currentPage += 1;
            } else {
              currentPage = 0;
            }
            renderPage(currentPage);
          }, 1000);
          svg.querySelector('#playButton text').textContent = '\u275A\u275A';
          svg.querySelector('#playButton').setAttribute('fill', '#c0c0c0');
        }
      });

      renderPage(currentPage);
    })();
  `;
  svg.append("script").attr("type", "text/javascript").text(switchPageScript);
}, "draw");
var renderer = { draw };

// src/diagrams/visual/styles.ts
var styles = /* @__PURE__ */ __name((options = {}) => {
  log.debug({ options });
  return `
    .element {
      font-size: ${options.array?.elementFontSize ?? "10px"};
      fill: ${options.array?.valueColor ?? "black"};
    }
    .element.index {
      fill: ${options.array?.indexColor ?? "black"};
    }
    .element {
      stroke: ${options.array?.elementStrokeColor ?? "black"};
      stroke-width: ${options.array?.elementStrokeWidth ?? "1"};
      fill: ${options.array?.elementFillColor ?? "#efefef"};
    }
  `;
}, "styles");

// src/diagrams/visual/diagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles
};
export {
  diagram
};
