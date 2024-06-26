import {
  parse
} from "./chunk-ORU6WHMI.mjs";
import "./chunk-4M2HHT7F.mjs";
import "./chunk-LHMLTGKR.mjs";
import "./chunk-A7EXJOKM.mjs";
import "./chunk-LFIGFQ5L.mjs";
import "./chunk-W36MXDCD.mjs";
import {
  selectSvgElement
} from "./chunk-O3424EYO.mjs";
import "./chunk-A4EGXCE3.mjs";
import "./chunk-3FCBLY7Z.mjs";
import {
  cleanAndMerge
} from "./chunk-QPZHDOHB.mjs";
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
} from "./chunk-A5IDYFDB.mjs";
import "./chunk-TNAZEAIZ.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// src/diagrams/matrix/db.ts
var defaultMatrixData = {
  rows: []
};
var data = structuredClone(defaultMatrixData);
var DEFAULT_MATRIX_CONFIG = defaultConfig_default.matrix;
var getConfig2 = /* @__PURE__ */ __name(() => {
  return cleanAndMerge({
    ...DEFAULT_MATRIX_CONFIG,
    ...getConfig().matrix
  });
}, "getConfig");
var getMatrix = /* @__PURE__ */ __name(() => data.rows, "getMatrix");
var addRow = /* @__PURE__ */ __name((row) => {
  data.rows.push(row);
}, "addRow");
var clear2 = /* @__PURE__ */ __name(() => {
  clear();
  data = structuredClone(defaultMatrixData);
}, "clear");
var db = {
  addRow,
  getMatrix,
  getConfig: getConfig2,
  clear: clear2,
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription
};

// src/diagrams/matrix/parser.ts
var populate = /* @__PURE__ */ __name((ast) => {
  for (const row of ast.rows) {
    const elements = row.elements.map((e) => ({
      value: e.value,
      color: e.color
    }));
    db.addRow({ elements });
  }
}, "populate");
var parser = {
  parse: async (input) => {
    const ast = await parse("matrix", input);
    log.debug(ast);
    populate(ast);
  }
};

// src/diagrams/matrix/renderer.ts
var draw = /* @__PURE__ */ __name((_text, id, _version, diagram2) => {
  const db2 = diagram2.db;
  const config = db2.getConfig();
  const matrix = db2.getMatrix();
  const title = db2.getDiagramTitle();
  const showIndex = diagram2.text.toLowerCase().includes("showindex");
  const svgHeight = 1600;
  const svgWidth = 1600;
  const svg = selectSvgElement(id);
  svg.attr("viewbox", `0 0 ${svgWidth} ${svgHeight}`);
  configureSvgSize(svg, svgHeight, svgWidth, config.useMaxWidth);
  if (title) {
    svg.append("text").text(title).attr("x", svgWidth / 2).attr("y", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "matrixTitle");
  }
  for (const [rowIndex, row] of matrix.entries()) {
    for (const [colIndex, element] of row.elements.entries()) {
      drawElement(svg, element, rowIndex, colIndex, config, showIndex);
    }
  }
  if (showIndex) {
    drawIndices(svg, matrix.length, matrix[0]?.elements.length || 0, config);
  }
}, "draw");
var getColor = /* @__PURE__ */ __name((color) => {
  switch (color) {
    case "blue":
      return "rgba(0, 0, 255, 0.4)";
    case "green":
      return "rgba(0, 255, 0, 0.4)";
    case "red":
      return "rgba(255, 0, 0, 0.4)";
    default:
      return "none";
  }
}, "getColor");
var drawElement = /* @__PURE__ */ __name((svg, element, rowIndex, colIndex, { borderColor, borderWidth, labelColor, labelFontSize }, showIndex) => {
  const group = svg.append("g");
  const elementX = colIndex * 50 + 50;
  const elementY = rowIndex * 50 + 50;
  const fillColor = getColor(element.color);
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 50).attr("height", 50).style("fill", fillColor).attr("stroke", "blue").attr("stroke-width", 1).attr("class", "matrixElement");
  group.append("text").attr("x", elementX + 20).attr("y", elementY + 20).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value.toString());
}, "drawElement");
var drawIndices = /* @__PURE__ */ __name((svg, rowCount, colCount, { labelColor, labelFontSize }) => {
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    svg.append("text").attr("x", 20).attr("y", rowIndex * 50 + 70).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "indexLabel").text(rowIndex.toString());
  }
  for (let colIndex = 0; colIndex < colCount; colIndex++) {
    svg.append("text").attr("x", colIndex * 50 + 70).attr("y", rowCount * 50 + 70).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "indexLabel").text(colIndex.toString());
  }
}, "drawIndices");
var renderer = { draw };

// src/diagrams/matrix/styles.ts
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

// src/diagrams/matrix/diagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles
};
export {
  diagram
};
