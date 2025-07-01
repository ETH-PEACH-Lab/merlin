import {
  AbstractMermaidTokenBuilder,
  CommonValueConverter,
  EmptyFileSystem,
  MermaidGeneratedSharedModule,
  TestSlidesDiagramGeneratedModule,
  __name as __name2,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
  lib_exports
} from "./chunk-NLTORHXA.mjs";
import "./chunk-A4EGXCE3.mjs";
import "./chunk-3FCBLY7Z.mjs";
import "./chunk-TNAZEAIZ.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/chunks/mermaid-parser.core/testslides-XDJSCLHD.mjs
var TestSlidesTokenBuilder = class extends AbstractMermaidTokenBuilder {
  static {
    __name(this, "TestSlidesTokenBuilder");
  }
  static {
    __name2(this, "TestSlidesTokenBuilder");
  }
  constructor() {
    super(["TestSlides"]);
  }
};
var TestSlidesModule = {
  parser: {
    TokenBuilder: () => new TestSlidesTokenBuilder(),
    ValueConverter: () => new CommonValueConverter()
  }
};
function createTestSlidesServices(context = EmptyFileSystem) {
  const shared = inject(
    createDefaultSharedCoreModule(context),
    MermaidGeneratedSharedModule
  );
  const TestSlides = inject(
    createDefaultCoreModule({ shared }),
    TestSlidesDiagramGeneratedModule,
    TestSlidesModule
  );
  shared.ServiceRegistry.register(TestSlides);
  return { shared, TestSlides };
}
__name(createTestSlidesServices, "createTestSlidesServices");
__name2(createTestSlidesServices, "createTestSlidesServices");
export {
  TestSlidesModule,
  createTestSlidesServices
};
