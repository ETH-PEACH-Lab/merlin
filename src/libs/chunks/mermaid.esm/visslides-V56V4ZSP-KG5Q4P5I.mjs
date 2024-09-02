import {
  AbstractMermaidTokenBuilder,
  CommonValueConverter,
  EmptyFileSystem,
  MermaidGeneratedSharedModule,
  VisSlidesDiagramGeneratedModule,
  __name as __name2,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
  lib_exports
} from "./chunk-VFA2SCRM.mjs";
import "./chunk-A4EGXCE3.mjs";
import "./chunk-3FCBLY7Z.mjs";
import "./chunk-TNAZEAIZ.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/chunks/mermaid-parser.core/visslides-V56V4ZSP.mjs
var VisSlidesTokenBuilder = class extends AbstractMermaidTokenBuilder {
  static {
    __name(this, "VisSlidesTokenBuilder");
  }
  static {
    __name2(this, "VisSlidesTokenBuilder");
  }
  constructor() {
    super(["VisSlides"]);
  }
};
var VisSlidesModule = {
  parser: {
    TokenBuilder: () => new VisSlidesTokenBuilder(),
    ValueConverter: () => new CommonValueConverter()
  }
};
function createVisSlidesServices(context = EmptyFileSystem) {
  const shared = inject(
    createDefaultSharedCoreModule(context),
    MermaidGeneratedSharedModule
  );
  const VisSlides = inject(
    createDefaultCoreModule({ shared }),
    VisSlidesDiagramGeneratedModule,
    VisSlidesModule
  );
  shared.ServiceRegistry.register(VisSlides);
  return { shared, VisSlides };
}
__name(createVisSlidesServices, "createVisSlidesServices");
__name2(createVisSlidesServices, "createVisSlidesServices");
export {
  VisSlidesModule,
  createVisSlidesServices
};
