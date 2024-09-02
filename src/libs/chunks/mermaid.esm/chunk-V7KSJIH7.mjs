import {
  __name as __name2
} from "./chunk-PK2EPYDH.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/mermaid-parser.core.mjs
var parsers = {};
var initializers = {
  info: async () => {
    const { createInfoServices: createInfoServices2 } = await import("./info-3QRC4Q3Q-JPQF576G.mjs");
    const parser = createInfoServices2().Info.parser.LangiumParser;
    parsers["info"] = parser;
  },
  packet: async () => {
    const { createPacketServices: createPacketServices2 } = await import("./packet-EPJL4FQO-NOBVKY4A.mjs");
    const parser = createPacketServices2().Packet.parser.LangiumParser;
    parsers["packet"] = parser;
  },
  pie: async () => {
    const { createPieServices: createPieServices2 } = await import("./pie-7AUQRDU3-UEO2FAEK.mjs");
    const parser = createPieServices2().Pie.parser.LangiumParser;
    parsers["pie"] = parser;
  },
  array: async () => {
    const { createArrayServices: createArrayServices2 } = await import("./array-W2O53RHG-4GH4WFOP.mjs");
    const parser = createArrayServices2().Array.parser.LangiumParser;
    parsers["array"] = parser;
  },
  matrix: async () => {
    const { createMatrixServices } = await import("./matrix-63JP7QMH-57UU75TZ.mjs");
    const parser = createMatrixServices().Matrix.parser.LangiumParser;
    parsers["matrix"] = parser;
  },
  testslides: async () => {
    const { createTestSlidesServices } = await import("./testslides-HKJCLVXD-CJQLTU6X.mjs");
    const parser = createTestSlidesServices().TestSlides.parser.LangiumParser;
    parsers["testslides"] = parser;
  },
  visslides: async () => {
    const { createVisSlidesServices } = await import("./visslides-PENJW4VS-LQWEDPDL.mjs");
    const parser = createVisSlidesServices().VisSlides.parser.LangiumParser;
    parsers["visslides"] = parser;
  },
  visual: async () => {
    const { createVisualDiagramServices: createVisualDiagramServices2 } = await import("./visual-BAYL4U6S-KFMT5UFR.mjs");
    const parser = createVisualDiagramServices2().VisualDiagram.parser.LangiumParser;
    parsers["visual"] = parser;
  }
};
async function parse(diagramType, text) {
  const initializer = initializers[diagramType];
  if (!initializer) {
    throw new Error(`Unknown diagram type: ${diagramType}`);
  }
  if (!parsers[diagramType]) {
    await initializer();
  }
  const parser = parsers[diagramType];
  const result = parser.parse(text);
  if (result.lexerErrors.length > 0 || result.parserErrors.length > 0) {
    throw new MermaidParseError(result);
  }
  return result.value;
}
__name(parse, "parse");
__name2(parse, "parse");
var MermaidParseError = class extends Error {
  static {
    __name(this, "MermaidParseError");
  }
  constructor(result) {
    const lexerErrors = result.lexerErrors.map((err) => err.message).join("\n");
    const parserErrors = result.parserErrors.map((err) => err.message).join("\n");
    super(`Parsing failed: ${lexerErrors} ${parserErrors}`);
    this.result = result;
  }
  static {
    __name2(this, "MermaidParseError");
  }
};

export {
  parse
};
