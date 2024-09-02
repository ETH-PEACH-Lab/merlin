import {
  populateCommonDb
} from "./chunk-6TDVKNU6.mjs";
import {
  parse
} from "./chunk-XBXODLO5.mjs";
import "./chunk-WWBOPZSR.mjs";
import "./chunk-XVFD56UG.mjs";
import "./chunk-FZZXLPUA.mjs";
import "./chunk-QMMAA7XF.mjs";
import "./chunk-2VLSPKAO.mjs";
import "./chunk-VFA2SCRM.mjs";
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

// src/diagrams/array/db.ts
var defaultArrayData = {
  elements: []
};
var data = structuredClone(defaultArrayData);
var DEFAULT_ARRAY_CONFIG = defaultConfig_default.array;
var getConfig2 = /* @__PURE__ */ __name(() => {
  return cleanAndMerge({
    ...DEFAULT_ARRAY_CONFIG,
    ...getConfig().array
  });
}, "getConfig");
var getArray = /* @__PURE__ */ __name(() => data.elements, "getArray");
var addElement = /* @__PURE__ */ __name((element) => {
  data.elements.push(element);
}, "addElement");
var clear2 = /* @__PURE__ */ __name(() => {
  clear();
  data = structuredClone(defaultArrayData);
}, "clear");
var db = {
  addElement,
  getArray,
  getConfig: getConfig2,
  clear: clear2,
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription
};

// src/diagrams/array/parser.ts
var populate = /* @__PURE__ */ __name((ast) => {
  populateCommonDb(ast, db);
  for (const element of ast.elements) {
    const index = ast.elements.indexOf(element);
    if (index < 0) {
      throw new Error(`Array index ${index} is invalid. Index must be non-negative.`);
    }
    log.debug(`Array element at index ${index} with value ${element.value}`);
    db.addElement({
      index,
      value: element.value,
      arrow: element.arrow ? true : false,
      // Convert arrow to boolean
      context: element.context || void 0,
      // Add context if it exists
      color: element.color || "none"
      // Add color if it exists, default to 'none'
    });
  }
}, "populate");
var parser = {
  parse: async (input) => {
    const ast = await parse("array", input);
    log.debug(ast);
    populate(ast);
  }
};

// src/diagrams/array/renderer.ts
var showindex_key_word = "showindex";
var draw = /* @__PURE__ */ __name((_text, id, _version, diagram2) => {
  const db2 = diagram2.db;
  const config = db2.getConfig();
  const { elementColor, borderColor, borderWidth, labelColor, labelFontSize } = config;
  const elements = db2.getArray();
  const showIndex = diagram2.text.toLowerCase().includes(showindex_key_word);
  const title = db2.getDiagramTitle();
  const svgHeight = 300;
  const svgWidth = 800;
  const svg = selectSvgElement(id);
  svg.attr("viewbox", `0 0 ${svgWidth} ${svgHeight}`);
  configureSvgSize(svg, svgHeight, svgWidth, config.useMaxWidth);
  defineArrowhead(svg);
  for (const [index, element] of elements.entries()) {
    drawElement(svg, element, index, config, showIndex);
  }
  if (title) {
    svg.append("text").text(title).attr("x", svgWidth / 2).attr("y", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "arrayTitle");
  }
}, "draw");
var drawElement = /* @__PURE__ */ __name((svg, element, index, {
  elementColor,
  borderColor,
  borderWidth,
  labelColor,
  labelFontSize
}, showIndex) => {
  const group = svg.append("g");
  const elementX = index * 50 + 50;
  const elementY = 100;
  const getColor = /* @__PURE__ */ __name((color) => {
    switch (color) {
      case "blue":
        return "rgba(0, 0, 255, 0.3)";
      case "red":
        return "rgba(255, 0, 0, 0.3)";
      case "green":
        return "rgba(0, 255, 0, 0.3)";
      default:
        return "none";
    }
  }, "getColor");
  if (element.arrow) {
    const arrowYStart = elementY - 40;
    const arrowYEnd = elementY - 10;
    group.append("line").attr("x1", elementX + 20).attr("y1", arrowYStart).attr("x2", elementX + 20).attr("y2", arrowYEnd).attr("stroke", "black").attr("marker-end", "url(#arrowhead)");
    if (element.context) {
      group.append("text").attr("x", elementX + 20).attr("y", arrowYStart - 10).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrowContext").text(element.context);
    }
  }
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 40).attr("height", 40).style("fill", getColor(element.color ? element.color : "none")).attr("stroke", "#69b3a2").attr("stroke-width", "3px").attr("class", "arrayElement");
  group.append("text").attr("x", elementX + 20).attr("y", elementY + 20).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value);
  if (showIndex) {
    group.append("text").attr("x", elementX + 20).attr("y", elementY + 60).attr("fill", labelColor).attr("font-size", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "indexLabel").text(index);
  }
}, "drawElement");
var defineArrowhead = /* @__PURE__ */ __name((svg) => {
  svg.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "6").attr("markerHeight", "6").attr("orient", "auto-start-reverse").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
}, "defineArrowhead");
var renderer = { draw };

// src/diagrams/array/styles.ts
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

// src/diagrams/array/diagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles
};
export {
  diagram
};
