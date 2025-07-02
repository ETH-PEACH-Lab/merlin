import {
  __name
} from "./chunk-N5XDFYNB.mjs";

// src/diagrams/common/populateCommonDb.ts
function populateCommonDb(ast, db) {
  if ("accDescr" in ast && ast.accDescr) {
    db.setAccDescription?.(ast.accDescr);
  }
  if ("accTitle" in ast && ast.accTitle) {
    db.setAccTitle?.(ast.accTitle);
  }
  if ("title" in ast && ast.title) {
    db.setDiagramTitle?.(ast.title);
  }
}
__name(populateCommonDb, "populateCommonDb");

export {
  populateCommonDb
};
