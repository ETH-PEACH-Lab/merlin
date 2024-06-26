import {
  __name as __name2
} from "./chunk-W36MXDCD.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/mermaid-parser.core.mjs
var parsers = {};
var initializers = {
  info: async () => {
    const { createInfoServices: createInfoServices2 } = await import("./info-3FMU5OPA-M447BGGY.mjs");
    const parser = createInfoServices2().Info.parser.LangiumParser;
    parsers["info"] = parser;
  },
  packet: async () => {
    const { createPacketServices: createPacketServices2 } = await import("./packet-IC6RDDWZ-W2Y2RW3V.mjs");
    const parser = createPacketServices2().Packet.parser.LangiumParser;
    parsers["packet"] = parser;
  },
  pie: async () => {
    const { createPieServices: createPieServices2 } = await import("./pie-VNFFLFOH-PLK4MMY7.mjs");
    const parser = createPieServices2().Pie.parser.LangiumParser;
    parsers["pie"] = parser;
  },
  array: async () => {
    const { createArrayServices: createArrayServices2 } = await import("./array-BDTRGUCI-FESGSWSB.mjs");
    const parser = createArrayServices2().Array.parser.LangiumParser;
    parsers["array"] = parser;
  },
  matrix: async () => {
    const { createMatrixServices } = await import("./matrix-JXUSWAPV-HMUWDCID.mjs");
    const parser = createMatrixServices().Matrix.parser.LangiumParser;
    parsers["matrix"] = parser;
  },
  testslides: async () => {
    const { createTestSlidesServices } = await import("./testslides-W6CDRBCU-4KKXXQ5A.mjs");
    const parser = createTestSlidesServices().TestSlides.parser.LangiumParser;
    parsers["testslides"] = parser;
  },
  visslides: async () => {
    const { createVisSlidesServices } = await import("./visslides-WM35EBDC-XAPT75SO.mjs");
    const parser = createVisSlidesServices().VisSlides.parser.LangiumParser;
    parsers["visslides"] = parser;
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
