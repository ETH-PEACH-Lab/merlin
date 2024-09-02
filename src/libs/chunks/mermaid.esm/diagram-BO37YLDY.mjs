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

// src/diagrams/testslides/db.ts
var defaultTestSlidesData = {
  slides: []
};
var data = structuredClone(defaultTestSlidesData);
var DEFAULT_ARRAY_CONFIG = defaultConfig_default.array;
var getConfig2 = /* @__PURE__ */ __name(() => {
  return cleanAndMerge({
    ...DEFAULT_ARRAY_CONFIG,
    ...getConfig().array
  });
}, "getConfig");
var getSlides = /* @__PURE__ */ __name(() => data.slides, "getSlides");
var addSlide = /* @__PURE__ */ __name((slide) => {
  data.slides.push(slide);
}, "addSlide");
var clear2 = /* @__PURE__ */ __name(() => {
  clear();
  data = structuredClone(defaultTestSlidesData);
}, "clear");
var db = {
  addSlide,
  getSlides,
  getConfig: getConfig2,
  clear: clear2,
  setAccTitle,
  getAccTitle,
  setDiagramTitle,
  getDiagramTitle,
  getAccDescription,
  setAccDescription
};

// src/diagrams/testslides/parser.ts
var populate = /* @__PURE__ */ __name((ast) => {
  populateCommonDb(ast, db);
  for (const slide of ast.pages) {
    const elements = slide.elements.map((e) => ({
      value: e.value,
      arrow: e.arrow === "arrow",
      context: e.context,
      color: e.color
    }));
    db.addSlide({ showIndex: !!slide.showIndex, elements });
  }
}, "populate");
var parser = {
  parse: async (input) => {
    const ast = await parse("testslides", input);
    log.debug(ast);
    populate(ast);
  }
};

// src/diagrams/testslides/renderer.ts
var draw = /* @__PURE__ */ __name((_text, id, _version, diagram2) => {
  const db2 = diagram2.db;
  const config = db2.getConfig();
  const slides = db2.getSlides();
  const title = db2.getDiagramTitle();
  const svgHeight = 500;
  const svgWidth = 600;
  const svg = selectSvgElement(id);
  const currentPage = 0;
  const playInterval = null;
  const renderPage = /* @__PURE__ */ __name((pageIndex) => {
    svg.selectAll("g.page").attr("style", "display: none");
    svg.select(`#page${pageIndex}`).attr("style", "display: inline");
    svg.select("#prevButton").attr("fill", pageIndex > 0 ? "#007bff" : "#c0c0c0");
    svg.select("#nextButton").attr("fill", pageIndex < slides.length - 1 ? "#007bff" : "#c0c0c0");
    svg.select("#pageIndicator").text(`${pageIndex + 1} / ${slides.length}`);
  }, "renderPage");
  const addNavigationButtons = /* @__PURE__ */ __name((svg2, totalPages) => {
    const buttonGroup = svg2.append("g").attr("class", "navigation-buttons");
    const prevButtonGroup = buttonGroup.append("g").attr("id", "prevButtonGroup").attr("cursor", "pointer");
    prevButtonGroup.append("rect").attr("id", "prevButton").attr("x", svgWidth / 2 - 120).attr("y", svgHeight - 50).attr("width", 60).attr("height", 30).attr("fill", "#c0c0c0");
    prevButtonGroup.append("text").text("<").attr("x", svgWidth / 2 - 90).attr("y", svgHeight - 30).attr("fill", "white").attr("text-anchor", "middle").attr("alignment-baseline", "middle");
    const nextButtonGroup = buttonGroup.append("g").attr("id", "nextButtonGroup").attr("cursor", "pointer");
    nextButtonGroup.append("rect").attr("id", "nextButton").attr("x", svgWidth / 2 + 60).attr("y", svgHeight - 50).attr("width", 60).attr("height", 30).attr("fill", "#007bff");
    nextButtonGroup.append("text").text(">").attr("x", svgWidth / 2 + 90).attr("y", svgHeight - 30).attr("fill", "white").attr("text-anchor", "middle").attr("alignment-baseline", "middle");
    const playButtonGroup = buttonGroup.append("g").attr("id", "playButtonGroup").attr("cursor", "pointer");
    playButtonGroup.append("rect").attr("id", "playButton").attr("x", svgWidth / 2 - 30).attr("y", svgHeight - 50).attr("width", 60).attr("height", 30).attr("fill", "#007bff");
    playButtonGroup.append("text").text("\u25B6").attr("x", svgWidth / 2).attr("y", svgHeight - 30).attr("fill", "white").attr("text-anchor", "middle").attr("alignment-baseline", "middle");
    buttonGroup.append("text").attr("id", "pageIndicator").attr("x", svgWidth - 50).attr("y", svgHeight - 30).attr("fill", "black").attr("text-anchor", "middle").attr("alignment-baseline", "middle").text(`1 / ${totalPages}`);
  }, "addNavigationButtons");
  const drawSlide = /* @__PURE__ */ __name((svg2, slide, pageIndex) => {
    const pageGroup = svg2.append("g").attr("id", `page${pageIndex}`).attr("class", "page").attr("style", pageIndex === 0 ? "display: inline" : "display: none");
    if (title) {
      pageGroup.append("text").text(title).attr("x", svgWidth / 2).attr("y", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "arrayTitle");
    }
    for (const [index, element] of slide.elements.entries()) {
      drawElement(pageGroup, element, index, config, slide.showIndex);
    }
  }, "drawSlide");
  svg.attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);
  configureSvgSize(svg, svgHeight, svgWidth, config.useMaxWidth);
  defineArrowhead(svg);
  slides.forEach((slide, index) => {
    drawSlide(svg, slide, index);
  });
  addNavigationButtons(svg, slides.length);
  renderPage(currentPage);
  const switchPageScript = `
    const svg = document.getElementById('${id}');
    let currentPage = 0;
    const totalPages = ${slides.length};
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
        svg.querySelector('#playButton').setAttribute('fill', '#007bff');
        svg.querySelector('#playButton text').textContent = '\u25B6';
      } else {
        playInterval = setInterval(() => {
          if (currentPage < totalPages - 1) {
            currentPage += 1;
          } else {
            currentPage = 0;
          }
          renderPage(currentPage);
        }, 1000);
        svg.querySelector('#playButton').setAttribute('fill', '#c0c0c0');
        svg.querySelector('#playButton text').textContent = '\u275A\u275A';
      }
    });

    renderPage(currentPage);
  `;
  svg.append("script").attr("type", "text/ecmascript").text(switchPageScript);
}, "draw");
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
  const fillColor = getColor(element.color);
  if (element.arrow) {
    const arrowYStart = elementY - 40;
    const arrowYEnd = elementY - 10;
    group.append("line").attr("x1", elementX + 20).attr("y1", arrowYStart).attr("x2", elementX + 20).attr("y2", arrowYEnd).attr("stroke", "black").attr("marker-end", "url(#arrowhead)");
    if (element.context) {
      group.append("text").attr("x", elementX + 20).attr("y", arrowYStart - 10).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrowContext").text(element.context);
    }
  }
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 40).attr("height", 40).style("fill", fillColor).attr("stroke", borderColor).attr("stroke-width", borderWidth).attr("class", "arrayElement");
  group.append("text").attr("x", elementX + 20).attr("y", elementY + 20).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value);
  if (showIndex) {
    group.append("text").attr("x", elementX + 20).attr("y", elementY + 60).attr("fill", labelColor).attr("font-size", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "indexLabel").text(index);
  }
}, "drawElement");
var defineArrowhead = /* @__PURE__ */ __name((svg) => {
  svg.append("defs").append("marker").attr("id", "arrowhead").attr("viewBox", "0 0 10 10").attr("refX", "5").attr("refY", "5").attr("markerWidth", "6").attr("markerHeight", "6").attr("orient", "auto-start-reverse").append("path").attr("d", "M 0 0 L 10 5 L 0 10 z").attr("fill", "black");
}, "defineArrowhead");
var renderer = { draw };

// src/diagrams/testslides/styles.ts
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

// src/diagrams/testslides/diagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles
};
export {
  diagram
};
