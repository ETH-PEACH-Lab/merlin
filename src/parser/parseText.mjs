// This module uses the Nearley parser to parse text input based on a predefined grammar.

import nearley from "nearley";
import grammar from "./parser.js";

export default function parseText(input) {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  parser.feed(input);
  const parsedData = parser.results[0]; // Parsed output
  return parsedData;
}
