import {
  populateCommonDb
} from "./chunk-6TDVKNU6.mjs";
import {
  parse
} from "./chunk-V7KSJIH7.mjs";
import "./chunk-QFM4PBJA.mjs";
import "./chunk-LLWSOXWR.mjs";
import "./chunk-P44F2J5Q.mjs";
import "./chunk-E7YXXU3B.mjs";
import "./chunk-XT7J2WWX.mjs";
import "./chunk-PK2EPYDH.mjs";
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
                color: e.color,
                arrow: e.arrowLabel !== void 0 && e.arrowLabel !== null,
                //if with arrow then True, else False
                arrowLabel: e.arrowLabel
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
              color: element.color,
              arrow: element.arrowLabel !== void 0 && element.arrowLabel !== null,
              //if with arrow then True, else False
              arrowLabel: element.arrowLabel
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
                  hidden: (element.hidden || "").toLowerCase() == "true"
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

// src/diagrams/visual/getColor.ts
var getColor = /* @__PURE__ */ __name((color, transparency = 0.6) => {
  if (isValidHexColor(color)) {
    return color || "null";
  }
  const colorMap = {
    black: "#000000",
    white: "#FFFFFF",
    red: "#FF0000",
    green: "#008000",
    blue: "#0000FF",
    yellow: "#FFFF00",
    cyan: "#00FFFF",
    magenta: "#FF00FF",
    gray: "#808080",
    grey: "#808080",
    // Allow British spelling
    maroon: "#800000",
    olive: "#808000",
    purple: "#800080",
    teal: "#008080",
    navy: "#000080",
    orange: "#FFA500",
    pink: "#FFC0CB",
    brown: "#A52A2A",
    aqua: "#00FFFF",
    lime: "#00FF00",
    gold: "#FFD700",
    silver: "#C0C0C0",
    beige: "#F5F5DC",
    coral: "#FF7F50",
    chocolate: "#D2691E",
    crimson: "#DC143C",
    indigo: "#4B0082",
    khaki: "#F0E68C",
    lavender: "#E6E6FA",
    orchid: "#DA70D6",
    plum: "#DDA0DD",
    salmon: "#FA8072",
    sienna: "#A0522D",
    turquoise: "#40E0D0",
    violet: "#EE82EE",
    wheat: "#F5DEB3",
    azure: "#F0FFFF",
    ivory: "#FFFFF0",
    mintcream: "#F5FFFA",
    snow: "#FFFAFA",
    goldenrod: "#DAA520",
    tomato: "#FF6347",
    slateblue: "#6A5ACD",
    darkgreen: "#006400",
    darkblue: "#00008B",
    darkred: "#8B0000",
    darkorange: "#FF8C00",
    darkviolet: "#9400D3",
    darkkhaki: "#BDB76B",
    lightblue: "#ADD8E6",
    lightgreen: "#90EE90",
    lightcoral: "#F08080",
    lightgray: "#D3D3D3",
    lightgrey: "#D3D3D3"
    // British spelling
  };
  const lowerColor = color ? color.toLowerCase() : "";
  if (lowerColor in colorMap) {
    const hexColor = colorMap[lowerColor];
    const rgbaColor = hexToRgba(hexColor, transparency);
    return rgbaColor;
  } else {
    return "white";
  }
}, "getColor");
function isValidHexColor(color) {
  if (!color) {
    return false;
  }
  const hexColorRegex = /^#([\dA-Fa-f]{3}){1,2}$/;
  return hexColorRegex.test(color);
}
__name(isValidHexColor, "isValidHexColor");
var hexToRgba = /* @__PURE__ */ __name((hex, alpha) => {
  hex = hex.replace(/^#/, "");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}, "hexToRgba");

// src/diagrams/visual/drawArrayDiagram.ts
var drawArrayDiagram = /* @__PURE__ */ __name((svg, arrayDiagram, yOffset, config, component_id) => {
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
  const group = svg.append("g").attr("class", "component").attr("id", `component_${component_id}`).attr("transform", `translate(${xOffset}, ${yOffset + 40})`);
  let unit_id = 0;
  arrayDiagram.elements.forEach((element, index) => {
    drawElement(
      group,
      element,
      index,
      config,
      arrayDiagram.showIndex || false,
      unit_id
    );
    unit_id += 1;
  });
  if (arrayDiagram.label) {
    const labelYPosition = label_Y;
    const labelXPosition = label_X;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", config.labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrayDiagramLabel").text(arrayDiagram.label);
  }
}, "drawArrayDiagram");
var drawElement = /* @__PURE__ */ __name((svg, element, index, { labelColor, labelFontSize }, showIndex, unit_id) => {
  const indexFontSize = "16";
  const elementFontSize = "16";
  const group = svg.append("g");
  group.attr("class", "unit").attr("id", `unit_${unit_id}`);
  const elementSize = 40;
  const elementX = index * elementSize;
  const elementY = 50;
  const fillColor = getColor(element.color);
  if (element.arrow && element.arrowLabel !== "null") {
    const arrowYStart = elementY - 40;
    const arrowYEnd = elementY - 10;
    group.append("line").attr("x1", elementX + 20).attr("y1", arrowYStart).attr("x2", elementX + 20).attr("y2", arrowYEnd).attr("stroke", "black").attr("stroke-width", "1.5").attr("marker-end", "url(#arrowhead)");
    if (element.arrowLabel && element.arrowLabel !== "null") {
      group.append("text").attr("x", elementX + 20).attr("y", arrowYStart - 20).attr("fill", labelColor).attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrowContext").text(element.arrowLabel);
    }
  }
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", elementSize).attr("height", elementSize).style("fill", fillColor).attr("stroke", "#000000").attr("stroke-width", "2px").attr("class", "arrayElement");
  group.append("text").attr("x", elementX + elementSize / 2).attr("y", elementY + elementSize / 2).attr("fill", labelColor).attr("font-size", elementFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value);
  if (showIndex) {
    group.append("text").attr("x", elementX + elementSize / 2).attr("y", elementY + elementSize + 20).attr("fill", labelColor).attr("font-size", indexFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "indexLabel").text(index);
  }
}, "drawElement");

// src/diagrams/visual/drawMatrixDiagram.ts
var drawMatrixDiagram = /* @__PURE__ */ __name((svg, matrixDiagram, yOffset, config, component_id) => {
  const xOffset = 50;
  const titleOffset = matrixDiagram.title ? 100 : 0;
  const group = svg.append("g");
  group.attr("transform", `translate(0, ${yOffset})`).attr("class", "component").attr("id", `component_${component_id}`);
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
  group.attr("class", "unit").attr("id", `unit_(${rowIndex},${colIndex})`);
  const elementX = colIndex * 50;
  const elementY = rowIndex * 50;
  const borderColor = "#000000";
  const borderWidth = "1.2px";
  const fillColor = getColor(element.color);
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 50).attr("height", 50).style("fill", fillColor).attr("stroke", borderColor).attr("stroke-width", borderWidth).attr("class", "matrixElement");
  group.append("text").attr("x", elementX + 25).attr("y", elementY + 25).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value.toString());
  if (element.arrow && element.arrowLabel !== "null") {
    group.append("circle").attr("cx", elementX + 25).attr("cy", elementY + 25).attr("r", 23).attr("stroke", "red").attr("stroke-width", "2").attr("fill", "none");
    group.append("text").attr("x", elementX + 52).attr("y", elementY + 25).attr("fill", "red").attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "start").attr("class", "arrowLabel").text(element.arrowLabel || "");
  }
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

// src/diagrams/visual/drawStackDiagram.ts
var drawStackDiagram = /* @__PURE__ */ __name((svg, stackDiagram, yOffset, component_id) => {
  svg.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "6").attr("markerHeight", "6").attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
  const group = svg.append("g");
  group.attr("transform", `translate(250, ${yOffset})`).attr("class", "component").attr("id", `component_${component_id}`);
  const stackHeight = stackDiagram.size * 40;
  drawFramework(group, 300, 0, 70, stackHeight);
  let unit_id = 0;
  stackDiagram.elements.forEach((element, index) => {
    const positionIndex = stackDiagram.size - stackDiagram.elements.length + index;
    drawElement3(group, element, positionIndex, unit_id);
    unit_id += 1;
  });
  if (stackDiagram.label) {
    const totalHeight = stackHeight + 40;
    const labelYPosition = totalHeight + 20;
    const labelXPosition = 335;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "stackDiagramLabel").text(stackDiagram.label);
  }
}, "drawStackDiagram");
var drawElement3 = /* @__PURE__ */ __name((svg, element, positionIndex, unit_id) => {
  const group = svg.append("g");
  group.attr("class", "unit").attr("id", `unit_${unit_id}`);
  const elementX = 300;
  const elementY = positionIndex * 40;
  const fillColor = getColor(element.color);
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 70).attr("height", 40).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "stackElement");
  if (element.arrow && element.arrowLabel !== "null") {
    const arrowXStart = elementX + 80;
    const arrowXEnd = arrowXStart + 40;
    group.append("line").attr("x1", arrowXEnd).attr("y1", elementY + 20).attr("x2", arrowXStart).attr("y2", elementY + 20).attr("stroke", "black").attr("stroke-width", "1.5").attr("marker-end", "url(#arrowhead)");
    if (element.arrowLabel && element.arrowLabel !== "null") {
      group.append("text").attr("x", arrowXEnd + 10).attr("y", elementY + 20).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "start").attr("class", "arrowContext").text(element.arrowLabel);
    }
  }
  group.append("text").attr("x", elementX + 35).attr("y", elementY + 20).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value);
}, "drawElement");
var drawFramework = /* @__PURE__ */ __name((svg, x, y, width, height) => {
  const borderColor = "#000000";
  const borderWidth = 2;
  svg.append("line").attr("x1", x).attr("y1", y).attr("x2", x).attr("y2", y + height).attr("stroke", borderColor).attr("stroke-width", borderWidth);
  svg.append("line").attr("x1", x + width).attr("y1", y).attr("x2", x + width).attr("y2", y + height).attr("stroke", borderColor).attr("stroke-width", borderWidth);
  svg.append("line").attr("x1", x).attr("y1", y + height).attr("x2", x + width).attr("y2", y + height).attr("stroke", borderColor).attr("stroke-width", borderWidth);
}, "drawFramework");

// src/diagrams/visual/drawGraphDiagram.ts
var drawGraphDiagram = /* @__PURE__ */ __name((svg, graphDiagram, yOffset, component_id) => {
  const group = svg.append("g");
  group.attr("transform", `translate(0, ${yOffset})`).attr("class", "component").attr("id", `component_${component_id}`);
  group.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "4").attr("markerHeight", "5").attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
  const graphNodes = graphDiagram.elements.filter((ele) => ele.type == "node");
  const hiddenNodeIds = new Set(
    graphNodes.filter((node) => node.hidden).map((node) => node.nodeId)
  );
  const visibleGraphNodes = graphNodes.filter((node) => !node.hidden);
  const graphEdges = graphDiagram.elements.filter(
    (ele) => ele.type == "edge" && !hiddenNodeIds.has(ele.start) && !hiddenNodeIds.has(ele.end)
  );
  const nodePositions = calculateNodePositions(graphNodes || []);
  if (graphEdges) {
    graphEdges.forEach((edge) => {
      drawEdge(group, edge, nodePositions);
    });
  }
  if (visibleGraphNodes) {
    let unit_id = 0;
    visibleGraphNodes.forEach((node) => {
      drawNode(group, node, nodePositions[node.nodeId], unit_id);
      unit_id += 1;
    });
  }
  if (graphDiagram.label) {
    const labelYPosition = visibleGraphNodes ? Math.ceil(visibleGraphNodes.length / 3) * 100 + 70 : 100;
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
var drawNode = /* @__PURE__ */ __name((svg, node, position, unit_id) => {
  if (node.hidden) {
    return;
  }
  const nodeX = position.x;
  const nodeY = position.y;
  const fillColor = getColor(node.color);
  const group = svg.append("g");
  group.attr("class", "unit").attr("id", `unit_${unit_id}`);
  group.append("circle").attr("cx", nodeX).attr("cy", nodeY).attr("r", 20).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "graphNode");
  group.append("text").attr("x", nodeX).attr("y", nodeY).attr("dy", ".35em").attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "nodeLabel").text(node.value || node.nodeId);
  if (node.arrow && node.arrowLabel !== "null") {
    const arrowXStart = nodeX + 45;
    const arrowXEnd = nodeX + 25;
    group.append("line").attr("x1", arrowXStart).attr("y1", nodeY).attr("x2", arrowXEnd).attr("y2", nodeY).attr("stroke", "black").attr("stroke-width", "2").attr("marker-end", "url(#arrowhead)");
    group.append("text").attr("x", arrowXStart + 5).attr("y", nodeY).attr("fill", "black").attr("font-size", "14").attr("dominant-baseline", "middle").attr("text-anchor", "start").attr("class", "arrowLabel").text(node.arrowLabel || "");
  }
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
    svg.append("line").attr("x1", startX || 0).attr("y1", startY || 0).attr("x2", endX || 0).attr("y2", endY || 0).attr("stroke", strokeColor).attr("stroke-width", "2");
    if (edge.value) {
      svg.append("text").attr("x", (startX + endX) / 2).attr("y", (startY + endY) / 2).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "edgeLabel").text(edge.value);
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

// src/diagrams/visual/drawTreeDiagram.ts
var drawTreeDiagram = /* @__PURE__ */ __name((svg, treeDiagram, yOffset, component_id) => {
  const group = svg.append("g");
  group.attr("transform", `translate(0, ${yOffset})`).attr("class", "component").attr("id", `component_${component_id}`);
  group.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "4").attr("markerHeight", "5").attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
  const treeNodes = treeDiagram.elements || [];
  const treeEdges = calculateTreeEdges(treeNodes);
  const nodePositions = calculateNodePositions2(treeNodes);
  if (treeEdges) {
    treeEdges.forEach((edge) => {
      drawEdge2(group, edge, nodePositions);
    });
  }
  if (treeNodes) {
    let unit_id = 0;
    treeNodes.forEach((node) => {
      drawNode2(group, node, nodePositions[node.nodeId], unit_id);
      unit_id += 1;
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
  const maxDepth = calculateMaxDepth(nodes);
  const maxDistance = maxDepth > 2 ? 100 : 70;
  const currentY = 0;
  const calculatePosition = /* @__PURE__ */ __name((node, currentX, depth) => {
    const adjustedSiblingDistance = maxDistance - depth * (maxDistance / maxDepth);
    const x = currentX;
    const y = currentY + depth * levelHeight;
    positions[node.nodeId] = { x, y };
    const leftChild = nodes.find((n) => n.nodeId === node.left);
    const rightChild = nodes.find((n) => n.nodeId === node.right);
    if (leftChild) {
      calculatePosition(leftChild, x - adjustedSiblingDistance, depth + 1);
    }
    if (rightChild) {
      calculatePosition(rightChild, x + adjustedSiblingDistance, depth + 1);
    }
  }, "calculatePosition");
  const rootNode = nodes.find((node) => !node.parentId);
  if (rootNode) {
    calculatePosition(rootNode, 150, 0);
  }
  return positions;
}, "calculateNodePositions");
var calculateMaxDepth = /* @__PURE__ */ __name((nodes) => {
  const findDepth = /* @__PURE__ */ __name((node, depth) => {
    const leftChild = nodes.find((n) => n.nodeId === node.left);
    const rightChild = nodes.find((n) => n.nodeId === node.right);
    const leftDepth = leftChild ? findDepth(leftChild, depth + 1) : depth;
    const rightDepth = rightChild ? findDepth(rightChild, depth + 1) : depth;
    return Math.max(leftDepth, rightDepth);
  }, "findDepth");
  const rootNode = nodes.find((node) => !node.parentId);
  if (rootNode) {
    return findDepth(rootNode, 0);
  }
  return 0;
}, "calculateMaxDepth");
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
var drawNode2 = /* @__PURE__ */ __name((svg, node, position, unit_id) => {
  const nodeX = position.x;
  const nodeY = position.y;
  const fillColor = getColor(node.color);
  const group = svg.append("g");
  group.attr("class", "unit").attr("id", `unit_${unit_id}`);
  group.append("circle").attr("cx", nodeX).attr("cy", nodeY).attr("r", 20).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "treeNode");
  group.append("text").attr("x", nodeX).attr("y", nodeY).attr("dy", ".35em").attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "nodeLabel").text(node.value || node.nodeId);
  if (node.arrow && node.arrowLabel !== "null") {
    const arrowXStart = nodeX + 45;
    const arrowXEnd = nodeX + 25;
    group.append("line").attr("x1", arrowXStart).attr("y1", nodeY).attr("x2", arrowXEnd).attr("y2", nodeY).attr("stroke", "black").attr("stroke-width", "2").attr("marker-end", "url(#arrowhead)");
    group.append("text").attr("x", arrowXStart + 5).attr("y", nodeY).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "start").attr("class", "arrowLabel").text(node.arrowLabel);
  }
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
      svg.append("text").attr("x", (startX + endX) / 2).attr("y", (startY + endY) / 2).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "edgeLabel").text(edge.value);
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

// src/diagrams/visual/drawLinkedListDiagram.ts
var drawLinkedListDiagram = /* @__PURE__ */ __name((svg, linkedListDiagram, yOffset, component_id) => {
  const group = svg.append("g");
  group.attr("transform", `translate(0, ${yOffset})`).attr("class", "component").attr("id", `component_${component_id}`);
  group.append("defs").append("marker").attr("id", "arrowhead_node").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "5").attr("markerHeight", "6").attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
  group.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "3").attr("markerHeight", "5").attr("orient", "auto").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
  const linkedListNodes = linkedListDiagram.elements;
  const nodePositions = calculateNodePositions3(linkedListNodes || []);
  let unit_id = 0;
  if (linkedListNodes) {
    linkedListNodes.forEach((node, index) => {
      drawNode3(
        group,
        node,
        nodePositions[index],
        index < linkedListNodes.length - 1,
        unit_id
      );
      unit_id += 1;
    });
  }
  if (linkedListDiagram.label) {
    const labelYPosition = 100;
    const labelXPosition = 150;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "18").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "linkedListDiagramLabel").text(linkedListDiagram.label);
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
var drawNode3 = /* @__PURE__ */ __name((svg, node, position, hasNext, unit_id) => {
  const nodeX = position.x;
  const nodeY = position.y;
  const fillColor = getColor(node.color);
  const group = svg.append("g");
  group.attr("class", "unit").attr("id", `unit_${unit_id}`);
  group.append("rect").attr("x", nodeX).attr("y", nodeY).attr("width", 60).attr("height", 30).style("fill", fillColor).attr("stroke", "black").attr("stroke-width", "1").attr("class", "linkedListNode");
  group.append("text").attr("x", nodeX + 30).attr("y", nodeY + 15).attr("dy", ".35em").attr("fill", "black").attr("font-size", "18").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "nodeLabel").text(node.value);
  if (node.arrowLabel !== "null") {
    const arrowYStart = nodeY - 30;
    const arrowYEnd = nodeY - 10;
    group.append("line").attr("x1", nodeX + 30).attr("y1", arrowYStart).attr("x2", nodeX + 30).attr("y2", arrowYEnd).attr("stroke", "black").attr("stroke-width", "2").attr("marker-end", "url(#arrowhead)");
    group.append("text").attr("x", nodeX + 30).attr("y", arrowYStart - 10).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "arrowLabel").text(node.arrowLabel || "");
  }
  if (hasNext) {
    group.append("line").attr("x1", nodeX + 60).attr("y1", nodeY + 15).attr("x2", nodeX + 60 + 55).attr("y2", nodeY + 15).attr("stroke", "black").attr("stroke-width", "2").attr("marker-end", "url(#arrowhead_node)");
  }
}, "drawNode");

// src/diagrams/visual/drawTextDiagram.ts
var drawTextDiagram = /* @__PURE__ */ __name((svg, textDiagram, yOffset, component_id) => {
  const group = svg.append("g");
  group.attr("transform", `translate(0, ${yOffset})`).attr("class", "component").attr("id", `component_${component_id}`);
  let currentY = 0;
  let unit_id = 0;
  textDiagram.elements.forEach((element) => {
    currentY = drawElement4(group, element, currentY, unit_id);
    unit_id += 1;
  });
  if (textDiagram.label) {
    const labelYPosition = currentY + 20;
    const labelXPosition = 50;
    group.append("text").attr("x", labelXPosition).attr("y", labelYPosition).attr("fill", "black").attr("font-size", "16").attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "textDiagramLabel").text(textDiagram.label);
  }
}, "drawTextDiagram");
var drawElement4 = /* @__PURE__ */ __name((svg, element, startY, unit_id) => {
  const group = svg.append("g").attr("class", "unit").attr("id", `unit_${unit_id}`);
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
  const currentPage = 0;
  const playInterval = null;
  const renderPage = /* @__PURE__ */ __name((pageIndex) => {
    svg.selectAll("g.page").attr("display", "none");
    svg.select(`#page${pageIndex}`).attr("display", "inline");
    svg.select("#prevButton").attr("fill", pageIndex > 0 ? "#007bff" : "#c0c0c0");
    svg.select("#nextButton").attr("fill", pageIndex < pages.length - 1 ? "#007bff" : "#c0c0c0");
    svg.select("#pageIndicator").text(`${pageIndex + 1} / ${pages.length}`);
  }, "renderPage");
  const drawPage = /* @__PURE__ */ __name((svg2, page, pageIndex) => {
    const pageGroup = svg2.append("g").attr("id", `page${pageIndex}`).attr("class", "page").attr("display", pageIndex === 0 ? "inline" : "none");
    if (title) {
      pageGroup.append("text").text(title).attr("x", svgWidth / 2).attr("y", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "pageTitle");
    }
    let yOffset = 50;
    let component_id = 0;
    for (const subDiagram of page.subDiagrams) {
      switch (subDiagram.type) {
        case "array": {
          drawArrayDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            config,
            component_id
          );
          component_id += 1;
          yOffset += 180;
          break;
        }
        case "matrix": {
          drawMatrixDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            config,
            component_id
          );
          component_id += 1;
          yOffset += 180;
          break;
        }
        case "stack": {
          drawStackDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            component_id
          );
          component_id += 1;
          yOffset += 180;
          break;
        }
        case "graph": {
          drawGraphDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            component_id
          );
          component_id += 1;
          yOffset += 180;
          break;
        }
        case "tree": {
          drawTreeDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            component_id
          );
          component_id += 1;
          yOffset += 180;
          break;
        }
        case "linkedList": {
          drawLinkedListDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            component_id
          );
          component_id += 1;
          yOffset += 180;
          break;
        }
        case "text": {
          drawTextDiagram(
            pageGroup,
            subDiagram,
            yOffset,
            component_id
          );
          component_id += 1;
          yOffset += 180;
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
