import {
  AbstractMermaidTokenBuilder,
  CommonValueConverter,
  EmptyFileSystem,
  MatrixDiagramGeneratedModule,
  MermaidGeneratedSharedModule,
  __name as __name2,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
  lib_exports
} from "./chunk-SZXGS323.mjs";
import "./chunk-A4EGXCE3.mjs";
import "./chunk-3FCBLY7Z.mjs";
import "./chunk-TNAZEAIZ.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/chunks/mermaid-parser.core/matrix-P3AXU6OI.mjs
var MatrixTokenBuilder = class extends AbstractMermaidTokenBuilder {
  static {
    __name(this, "MatrixTokenBuilder");
  }
  static {
    __name2(this, "MatrixTokenBuilder");
  }
  constructor() {
    super(["Matrix"]);
  }
};
var MatrixModule = {
  parser: {
    TokenBuilder: () => new MatrixTokenBuilder(),
    ValueConverter: () => new CommonValueConverter()
  }
};
function createMatrixServices(context = EmptyFileSystem) {
  const shared = inject(
    createDefaultSharedCoreModule(context),
    MermaidGeneratedSharedModule
  );
  const Matrix = inject(
    createDefaultCoreModule({ shared }),
    MatrixDiagramGeneratedModule,
    MatrixModule
  );
  shared.ServiceRegistry.register(Matrix);
  return { shared, Matrix };
}
__name(createMatrixServices, "createMatrixServices");
__name2(createMatrixServices, "createMatrixServices");
export {
  MatrixModule,
  createMatrixServices
};
