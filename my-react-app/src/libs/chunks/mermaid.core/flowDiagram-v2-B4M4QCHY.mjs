import {
  flowDb_default,
  flowRenderer_v2_default,
  flow_default,
  styles_default
} from "./chunk-7NRE7MSK.mjs";
import "./chunk-I67ACWPE.mjs";
import "./chunk-EREEIM6V.mjs";
import "./chunk-7ASGOVIY.mjs";
import "./chunk-CPAUJB3U.mjs";
import {
  setConfig2 as setConfig
} from "./chunk-HYS3XFRJ.mjs";

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
