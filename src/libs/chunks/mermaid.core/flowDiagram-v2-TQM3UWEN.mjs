import {
  flowDb_default,
  flowRenderer_v2_default,
  flow_default,
  styles_default
} from "./chunk-4NWGCCLR.mjs";
import "./chunk-ULPBZ3K6.mjs";
import "./chunk-5X4HRC2J.mjs";
import "./chunk-C3DCWXDX.mjs";
import "./chunk-MTHQ7WA2.mjs";
import {
  setConfig2 as setConfig
} from "./chunk-UVG54GTT.mjs";

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
