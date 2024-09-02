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
  select_default,
  setAccDescription,
  setAccTitle,
  setDiagramTitle
} from "./chunk-655LXKCO.mjs";
import "./chunk-TNAZEAIZ.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// src/diagrams/visslides/db.ts
var defaultVisSlidesData = [];
var data = [...defaultVisSlidesData];
var DEFAULT_VISSLIDES_CONFIG = defaultConfig_default.visslides;
var getConfig2 = /* @__PURE__ */ __name(() => {
  return cleanAndMerge({
    ...DEFAULT_VISSLIDES_CONFIG,
    ...getConfig().visslides
  });
}, "getConfig");
var getPages = /* @__PURE__ */ __name(() => data, "getPages");
var addPage = /* @__PURE__ */ __name((page) => {
  data.push(page);
}, "addPage");
var clear2 = /* @__PURE__ */ __name(() => {
  clear();
  data = [...defaultVisSlidesData];
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

// src/diagrams/visslides/parser.ts
var populate = /* @__PURE__ */ __name((ast) => {
  populateCommonDb(ast, db);
  for (const page of ast.pages) {
    const subDiagrams = page.subDiagrams.map((subDiagram) => {
      if ("elements" in subDiagram) {
        return {
          elements: subDiagram.elements.map((e) => ({
            value: 1
          }))
        };
      } else {
        return {
          rows: subDiagram.rows.map((row) => ({
            elements: row.elements.map((e) => ({
              value: 1
            }))
          }))
        };
      }
    });
    db.addPage({ subDiagrams });
  }
}, "populate");
var parser = {
  parse: async (input) => {
    const ast = await parse("visslides", input);
    log.debug(ast);
    populate(ast);
  }
};

// src/diagrams/visslides/drawArrayDiagram.ts
var drawArrayDiagram = /* @__PURE__ */ __name((svg, arrayDiagram, yOffset, config) => {
  const group = svg.append("g").attr("transform", `translate(0, ${yOffset})`);
  arrayDiagram.elements.forEach((element, index) => {
    drawElement(group, element, index, config, arrayDiagram.showIndex || false);
  });
}, "drawArrayDiagram");
var drawElement = /* @__PURE__ */ __name((svg, element, index, {
  elementColor,
  borderColor,
  borderWidth,
  labelColor,
  labelFontSize
}, showIndex) => {
  const group = svg.append("g");
  const elementX = index * 50 + 50;
  const elementY = 50;
  const fillColor = getColor(element.color);
  if (element.arrow) {
    const arrowYStart = elementY - 40;
    const arrowYEnd = elementY - 10;
    group.append("line").attr("x1", elementX + 20).attr("y1", arrowYStart).attr("x2", elementX + 20).attr("y2", arrowYEnd).attr("stroke", "black").attr("marker-end", "url(#arrowhead)");
    if (element.context) {
      group.append("text").attr("x", elementX + 20).attr("y", arrowYStart - 10).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "hanging").attr("text-anchor", "middle").attr("class", "arrowContext").text(element.context);
    }
  }
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 40).attr("height", 40).style("fill", fillColor).attr("stroke", "#191970").attr("stroke-width", "2px").attr("class", "arrayElement");
  group.append("text").attr("x", elementX + 20).attr("y", elementY + 20).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value);
  if (showIndex) {
    group.append("text").attr("x", elementX + 20).attr("y", elementY + 60).attr("fill", labelColor).attr("font-size", 25).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "indexLabel").text(index);
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

// src/diagrams/visslides/drawMatrixDiagram.ts
var drawMatrixDiagram = /* @__PURE__ */ __name((svg, matrixDiagram, yOffset, config) => {
  const group = svg.append("g").attr("transform", `translate(0, ${yOffset})`);
  matrixDiagram.rows.forEach((row, rowIndex) => {
    row.elements.forEach((element, colIndex) => {
      drawElement2(group, element, rowIndex, colIndex, config);
    });
  });
}, "drawMatrixDiagram");
var drawElement2 = /* @__PURE__ */ __name((svg, element, rowIndex, colIndex, { borderColor, borderWidth, labelColor, labelFontSize }) => {
  const group = svg.append("g");
  const elementX = colIndex * 50 + 50;
  const elementY = rowIndex * 50 + 50;
  const fillColor = getColor2(element.color);
  group.append("rect").attr("x", elementX).attr("y", elementY).attr("width", 48).attr("height", 48).style("fill", fillColor).attr("stroke", "#191970").attr("stroke-width", "1.5px").attr("class", "matrixElement");
  group.append("text").attr("x", elementX + 20).attr("y", elementY + 20).attr("fill", labelColor).attr("font-size", labelFontSize).attr("dominant-baseline", "middle").attr("text-anchor", "middle").attr("class", "elementLabel").text(element.value.toString());
}, "drawElement");
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

// src/diagrams/visslides/renderer.ts
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
      if (subDiagram.elements) {
        drawArrayDiagram(pageGroup, subDiagram, yOffset, config);
        yOffset += 100;
      } else {
        drawMatrixDiagram(
          pageGroup,
          subDiagram,
          yOffset,
          config
        );
        yOffset += 200;
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

// src/diagrams/visslides/styles.ts
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

// src/diagrams/visslides/diagram.ts
var diagram = {
  parser,
  db,
  renderer,
  styles
};
export {
  diagram
};
