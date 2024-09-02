import {
  AbstractMermaidTokenBuilder,
  ArrayDiagramGeneratedModule,
  CommonValueConverter,
  EmptyFileSystem,
  MermaidGeneratedSharedModule,
  __name as __name2,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
  lib_exports
} from "./chunk-PK2EPYDH.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/chunks/mermaid-parser.core/chunk-PFMMNUAO.mjs
var ArrayTokenBuilder = class extends AbstractMermaidTokenBuilder {
  static {
    __name(this, "ArrayTokenBuilder");
  }
  static {
    __name2(this, "ArrayTokenBuilder");
  }
  constructor() {
    super(["Array"]);
  }
};
var ArrayModule = {
  parser: {
    TokenBuilder: () => new ArrayTokenBuilder(),
    ValueConverter: () => new CommonValueConverter()
  }
};
function createArrayServices(context = EmptyFileSystem) {
  const shared = inject(
    createDefaultSharedCoreModule(context),
    MermaidGeneratedSharedModule
  );
  const Array = inject(
    createDefaultCoreModule({ shared }),
    ArrayDiagramGeneratedModule,
    ArrayModule
  );
  shared.ServiceRegistry.register(Array);
  return { shared, Array };
}
__name(createArrayServices, "createArrayServices");
__name2(createArrayServices, "createArrayServices");

export {
  ArrayModule,
  createArrayServices
};
