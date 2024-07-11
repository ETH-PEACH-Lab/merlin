// simple DSL parser demo

export const parseDSL = (dsl) => {
    try {
      return JSON.parse(dsl);
    } catch (error) {
      throw new Error("Invalid DSL format");
    }
  };
  
  export const convertToMermaid = (parsedDSL) => {
    if (!Array.isArray(parsedDSL)) {
      throw new Error("Invalid DSL format");
    }
  
    const slides = parsedDSL.map((page, pageIndex) => {
      const items = page.map((item) => `@ ${item}`).join("\n");
      return `page\narray\n${items}`;
    });
  
    return `visslides\n${slides.join("\n\n")}`;
  };
  