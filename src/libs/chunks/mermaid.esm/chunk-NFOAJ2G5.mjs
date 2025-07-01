import {
  AbstractMermaidTokenBuilder,
  CommonValueConverter,
  EmptyFileSystem,
  MermaidGeneratedSharedModule,
  VisualDiagramGeneratedModule,
  __name as __name2,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
  lib_exports
} from "./chunk-Q44OIVMH.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/chunks/mermaid-parser.core/chunk-2XRMC5SY.mjs
var VisualDiagramTokenBuilder = class extends AbstractMermaidTokenBuilder {
  static {
    __name(this, "VisualDiagramTokenBuilder");
  }
  static {
    __name2(this, "VisualDiagramTokenBuilder");
  }
  constructor() {
    super(["Visual"]);
  }
};
var VisualDiagramModule = {
  parser: {
    TokenBuilder: () => new VisualDiagramTokenBuilder(),
    ValueConverter: () => new CommonValueConverter()
  }
};
function createVisualDiagramServices(context = EmptyFileSystem) {
  const shared = inject(
    createDefaultSharedCoreModule(context),
    MermaidGeneratedSharedModule
  );
  const VisualDiagram = inject(
    createDefaultCoreModule({ shared }),
    VisualDiagramGeneratedModule,
    VisualDiagramModule
  );
  shared.ServiceRegistry.register(VisualDiagram);
  return { shared, VisualDiagram };
}
__name(createVisualDiagramServices, "createVisualDiagramServices");
__name2(createVisualDiagramServices, "createVisualDiagramServices");

export {
  VisualDiagramModule,
  createVisualDiagramServices
};
