import {
  flowDb_default,
  flowRenderer_v2_default,
  flow_default,
  styles_default
} from "./chunk-B6C7KQCY.mjs";
import "./chunk-GFOEUGCY.mjs";
import "./chunk-7XWUQRFC.mjs";
import "./chunk-RRMTGXNA.mjs";
import "./chunk-5PZZPJGE.mjs";
import "./chunk-OGS7N5JW.mjs";
import "./chunk-EO55GW7M.mjs";
import "./chunk-A4EGXCE3.mjs";
import "./chunk-3FCBLY7Z.mjs";
import "./chunk-QPZHDOHB.mjs";
import "./chunk-A6W4AWM4.mjs";
import {
  setConfig2 as setConfig
} from "./chunk-A5IDYFDB.mjs";
import "./chunk-TNAZEAIZ.mjs";
import "./chunk-N5XDFYNB.mjs";

// src/diagrams/flowchart/flowDiagram-v2.ts
var diagram = {
  parser: flow_default,
  db: flowDb_default,
  renderer: flowRenderer_v2_default,
  styles: styles_default,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    flowRenderer_v2_default.setConf(cnf.flowchart);
    flowDb_default.clear();
    flowDb_default.setGen("gen-2");
  }
};
export {
  diagram
};
