import {
  AbstractMermaidTokenBuilder,
  CommonValueConverter,
  EmptyFileSystem,
  MermaidGeneratedSharedModule,
  PacketGeneratedModule,
  __name as __name2,
  createDefaultCoreModule,
  createDefaultSharedCoreModule,
  inject,
  lib_exports
} from "./chunk-Q44OIVMH.mjs";
import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// ../parser/dist/chunks/mermaid-parser.core/chunk-DFAMI36G.mjs
var PacketTokenBuilder = class extends AbstractMermaidTokenBuilder {
  static {
    __name(this, "PacketTokenBuilder");
  }
  static {
    __name2(this, "PacketTokenBuilder");
  }
  constructor() {
    super(["packet-beta"]);
  }
};
var PacketModule = {
  parser: {
    TokenBuilder: () => new PacketTokenBuilder(),
    ValueConverter: () => new CommonValueConverter()
  }
};
function createPacketServices(context = EmptyFileSystem) {
  const shared = inject(
    createDefaultSharedCoreModule(context),
    MermaidGeneratedSharedModule
  );
  const Packet = inject(
    createDefaultCoreModule({ shared }),
    PacketGeneratedModule,
    PacketModule
  );
  shared.ServiceRegistry.register(Packet);
  return { shared, Packet };
}
__name(createPacketServices, "createPacketServices");
__name2(createPacketServices, "createPacketServices");

export {
  PacketModule,
  createPacketServices
};
