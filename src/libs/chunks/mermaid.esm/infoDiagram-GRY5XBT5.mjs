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
  version
} from "./chunk-VTTWHFUM.mjs";
import {
  selectSvgElement
} from "./chunk-2GTEEQBD.mjs";
import "./chunk-A4EGXCE3.mjs";
import "./chunk-3FCBLY7Z.mjs";
import {
  configureSvgSize,
  log
} from "./chunk-655LXKCO.mjs";
import "./chunk-TNAZEAIZ.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// src/diagrams/info/infoParser.ts
var parser = {
  parse: async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }
};

// src/diagrams/info/infoDb.ts
var DEFAULT_INFO_DB = { version };
var getVersion = /* @__PURE__ */ __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};

// src/diagrams/info/infoRenderer.ts
var draw = /* @__PURE__ */ __name((text, id, version2) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version2}`);
}, "draw");
var renderer = { draw };

// src/diagrams/info/infoDiagram.ts
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
