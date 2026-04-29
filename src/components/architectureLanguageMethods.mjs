function isCompletedNumber(text) {
  return /^-?\d+(\.\d+)?$/.test(String(text ?? "").trim());
}

function isCompletedBareIdentifier(text) {
  return /^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(String(text ?? "").trim());
}
function isCompletedQuotedString(text) {
  const v = String(text ?? "").trim();
  return (
    (v.startsWith('"') && v.endsWith('"') && v.length >= 2) ||
    (v.startsWith("'") && v.endsWith("'") && v.length >= 2)
  );
}

function isCompletedLabelOrientationValue(text) {
  const v = String(text ?? "").trim();
  return /^\(\s*vertical\s*,\s*(left|right)\s*\)$/.test(v);
}

function isCompletedScalarValue(text, options = {}) {
  const {
    allowNull = false,
    allowBoolean = false,
    allowNumber = false,
    allowQuotedString = false,
    allowBareIdentifier = false,
    allowedBareWords = [],
  } = options;

  const v = String(text ?? "").trim();
  if (!v) return false;

  if (allowNull && v === "null") return true;
  if (allowBoolean && (v === "true" || v === "false")) return true;
  if (allowNumber && isCompletedNumber(v)) return true;
  if (allowQuotedString && isCompletedQuotedString(v)) return true;
  if (allowBareIdentifier && isCompletedBareIdentifier(v)) return true;
  if (allowedBareWords.includes(v)) return true;

  return false;
}

function isInsideLabelOrientationFirstSlot(valueText) {
  const v = String(valueText ?? "");
  return /^\s*\(\s*[a-zA-Z_]*\s*$/.test(v);
}
function isInsideLabelOrientationSecondSlot(valueText) {
  const v = String(valueText ?? "");
  return /^\s*\(\s*vertical\s*,\s*[a-zA-Z_]*\s*$/.test(v);
}

function parseDiagramUseEntry(text) {
  const trimmed = String(text || "").trim();

  const match = trimmed.match(
    /^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)(?:\s+anchor\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*))?\s*$/,
  );

  if (!match) return null;

  const [, alias, blockName, anchor] = match;

  return {
    alias,
    block: blockName,
    anchor: anchor || null,
  };
}

function countToken(text, token) {
  return (text.match(new RegExp(`\\${token}`, "g")) || []).length;
}

export function getArchitectureItemNameState(rawCurrentItemText) {
  const text = rawCurrentItemText || "";

  const nameOnlyMatch = text.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)$/);
  const nameThenSpaceMatch = text.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+$/);
  const nameThenEqualsMatch = text.match(
    /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/,
  );

  return {
    isNameOnly: !!nameOnlyMatch,
    isNameThenSpace: !!nameThenSpaceMatch,
    isAfterEquals: !!nameThenEqualsMatch,
    itemName:
      nameThenEqualsMatch?.[1] ??
      nameThenSpaceMatch?.[1] ??
      nameOnlyMatch?.[1] ??
      null,
    afterEqualsText: nameThenEqualsMatch?.[2] ?? "",
  };
}

function hasEdgeAnchorEndpointInArchitectureEdgeText(text) {
  return /\b[a-zA-Z_][a-zA-Z0-9_]*\.(start|mid|end)\b/.test(String(text || ""));
}

function hasEdgeAnchorEndpointInDiagramConnectText(text) {
  return /\b[a-zA-Z_][a-zA-Z0-9_]*\.[a-zA-Z_][a-zA-Z0-9_]*\.(start|mid|end)\b/.test(
    String(text || ""),
  );
}

function getArchitectureEdgeMemberCandidates(block, currentEdgeName = null) {
  return {
    nodeNames: block?.nodes || [],
    groupNames: block?.groups || [],
    edgeNames: (block?.edges || []).filter((name) => name !== currentEdgeName),
  };
}

function getInlineBarePropValue(text, key) {
  const escaped = key.replace(/\./g, "\\.");
  const match = String(text || "").match(
    new RegExp(`\\b${escaped}\\s*:\\s*([a-zA-Z_][a-zA-Z0-9_]*)`),
  );
  return match?.[1] ?? null;
}

function getInlinePropValue(text, key) {
  const escaped = key.replace(/\./g, "\\.");
  const match = String(text || "").match(
    new RegExp(`\\b${escaped}\\s*:\\s*([a-zA-Z_][a-zA-Z0-9_]*)`),
  );
  return match?.[1] ?? null;
}

function parseArchitectureNamespaceAccess(linePrefix) {
  const namespaceCandidates = new Set([
    "label",
    "subLabel",
    "opLabel",
    "annotation",
    "stroke",
    "outerStroke",
    "marker",
    "marker.shift",
    "anchor",
    "shift",

    "annotation.top",
    "annotation.bottom",
    "annotation.left",
    "annotation.right",
    "annotation.top.shift",
    "annotation.bottom.shift",
    "annotation.left.shift",
    "annotation.right.shift",
  ]);

  const match = linePrefix.match(
    /\b((?:label|subLabel|opLabel|stroke|outerStroke|annotation|marker|anchor|shift|block)(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\.?([a-zA-Z_]*)$/,
  );

  if (!match) return null;

  const fullPath = match[1];
  const endsWithDot = /\.$/.test(linePrefix);

  if (endsWithDot && namespaceCandidates.has(fullPath)) {
    return {
      namespace: fullPath,
      memberPrefix: "",
      fullPrefix: `${fullPath}.`,
    };
  }

  if (namespaceCandidates.has(fullPath)) {
    return {
      namespace: fullPath,
      memberPrefix: "",
      fullPrefix: fullPath,
    };
  }

  const lastDot = fullPath.lastIndexOf(".");
  if (lastDot === -1) return null;

  const namespace = fullPath.slice(0, lastDot);
  const memberPrefix = fullPath.slice(lastDot + 1);

  if (!namespaceCandidates.has(namespace)) return null;

  return {
    namespace,
    memberPrefix,
    fullPrefix: fullPath,
  };
}

const CONNECTION_INLINE_PROP_KEYS = [
  "label",
  "label.text",
  "label.fontColor",
  "label.fontFamily",
  "label.fontSize",
  "label.fontWeight",
  "label.fontStyle",
  "shape",
  "style",
  "color",
  "arrowheads",
  "gap",
  "width",
  "curveHeight",
  "transition",
  "alignToIndexedPort",
  "bidirectional",
  "edgeAnchorOffset",
];

const BLOCK_FONT_KEYS = [
  "block.fontFamily",
  "block.fontSize",
  "block.fontWeight",
  "block.fontStyle",
  "block.fontColor",
];

const STROKE_KEYS = ["color", "style", "width"];
const STROKE_PROP_KEYS = STROKE_KEYS.map((k) => `stroke.${k}`);

const ANNOTATION_SIDES = ["top", "bottom", "left", "right"];
const SHIFT_SIDES = ["top", "bottom", "left", "right"];

const ANNOTATION_BASE_KEYS = [
  ...ANNOTATION_SIDES,
  "gap",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "fontColor",
];
export const ANNOTATION_SHIFT_KEYS = ANNOTATION_SIDES.flatMap((side) =>
  SHIFT_SIDES.map((shift) => `${side}.shift.${shift}`),
);

const ANNOTATION_ALL_KEYS = [...ANNOTATION_BASE_KEYS, ...ANNOTATION_SHIFT_KEYS];

export const ANNOTATION_PROP_KEYS = ANNOTATION_ALL_KEYS.map(
  (k) => `annotation.${k}`,
);

export const annotationPropRegex =
  "(?:annotation\\.(?:top|bottom|left|right|gap|fontFamily|fontSize|fontWeight|fontStyle|fontColor|(?:top|bottom|left|right)\\.shift\\.(?:top|bottom|left|right))|block\\.(?:fontFamily|fontSize|fontWeight|fontStyle|fontColor))";

export const annotationNonSidePropRegex =
  "(?:annotation\\.(?:gap|fontFamily|fontSize|fontWeight|fontStyle|fontColor)|block\\.(?:fontFamily|fontSize|fontWeight|fontStyle|fontColor))";

export function getAvailableBlocksForDiagramUses(arch, currentAlias = null) {
  const allBlocks = arch?.blockOrder || [];
  const uses = arch?.diagram?.uses || {};

  const usedBlocks = new Set(
    Object.entries(uses)
      .filter(([alias]) => alias !== currentAlias)
      .map(([, useDef]) => useDef?.block)
      .filter(Boolean),
  );

  return allBlocks.filter((blockName) => !usedBlocks.has(blockName));
}

export function createPropertyOnlySuggestion(
  monaco,
  range,
  {
    label,
    detail,
    documentation,
    sortText,
    valuePrefix = "",
    insertText = null,
  },
) {
  return {
    label,
    kind: monaco.languages.CompletionItemKind.Property,
    insertText: insertText ?? `${label}: ${valuePrefix}`,
    detail,
    documentation,
    range,
    sortText,
  };
}

export function getCurrentDiagramUsesText(model, position) {
  const lines = [];

  for (let i = 1; i <= position.lineNumber; i++) {
    const line = model.getLineContent(i);
    if (i === position.lineNumber) {
      lines.push(line.substring(0, position.column - 1));
    } else {
      lines.push(line);
    }
  }

  let insideArchitecture = false;
  let insideBlock = false;
  let insideDiagram = false;
  let insideUses = false;
  const collected = [];

  for (const rawLine of lines) {
    if (
      !insideArchitecture &&
      /^\s*architecture\s+\w+\s*=\s*\{/.test(rawLine)
    ) {
      insideArchitecture = true;
      continue;
    }

    if (
      insideArchitecture &&
      !insideBlock &&
      !insideDiagram &&
      /^\s*}\s*$/.test(rawLine)
    ) {
      insideArchitecture = false;
      continue;
    }

    if (!insideArchitecture) continue;

    if (!insideDiagram && /^\s*block\s+\w+\s*:\s*\[\s*$/.test(rawLine)) {
      insideBlock = true;
      continue;
    }

    if (insideBlock && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideBlock = false;
      continue;
    }

    if (insideBlock) continue;

    if (!insideDiagram && /^\s*diagram\s*:\s*\[\s*$/.test(rawLine)) {
      insideDiagram = true;
      continue;
    }

    if (!insideDiagram) continue;

    const inlineUsesMatch = rawLine.match(/^\s*uses\s*:\s*\[(.*)$/);
    if (!insideUses && inlineUsesMatch) {
      insideUses = true;
      collected.push(inlineUsesMatch[1]);
      continue;
    }

    if (insideUses) {
      if (/^\s*]\s*,?\s*$/.test(rawLine)) {
        break;
      }
      collected.push(rawLine);
    }
  }

  return collected.join("\n");
}

export function isAfterCompletedTopLevelArchProperty(model, position) {
  const linePrefix = model
    .getLineContent(position.lineNumber)
    .substring(0, position.column - 1);

  if (/,\s*$/.test(linePrefix)) return false;
  if (/\s$/.test(linePrefix)) return false;

  const match = linePrefix.match(/^\s*([a-zA-Z_][a-zA-Z0-9_.]*)\s*:\s*(.*)$/);
  if (!match) return false;

  const valuePart = match[2];

  // still starting / incomplete value
  if (valuePart === "") return false;
  if (/[\[\(\{]\s*$/.test(valuePart)) return false;

  return true;
}

export function splitTopLevelArgs(paramsText) {
  const args = [];
  let current = "";
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 0; i < paramsText.length; i++) {
    const char = paramsText[i];

    if (!inQuotes) {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === "(" || char === "[" || char === "{") {
        depth++;
        current += char;
      } else if (char === ")" || char === "]" || char === "}") {
        depth--;
        current += char;
      } else if (char === "," && depth === 0) {
        args.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    } else {
      current += char;
      if (char === quoteChar && paramsText[i - 1] !== "\\") {
        inQuotes = false;
      }
    }
  }

  if (current.trim() !== "" || paramsText.endsWith(",")) {
    args.push(current.trim());
  }

  return args;
}

export function isImmediatelyAfterCompletedPropertyValue(model, position) {
  const linePrefix = model
    .getLineContent(position.lineNumber)
    .substring(0, position.column - 1);

  if (!/\S$/.test(linePrefix)) return false;
  if (/,\s*$/.test(linePrefix)) return false;

  const match = linePrefix.match(/^\s*[a-zA-Z_][a-zA-Z0-9_.]*\s*:\s*(.*)$/);
  if (!match) return false;

  const valuePart = match[1];
  if (valuePart === "") return false;
  if (/[\[\(\{]\s*$/.test(valuePart)) return false;

  return true;
}

export function shouldShowTopLevelPropertyStarters(model, position) {
  const linePrefix = model
    .getLineContent(position.lineNumber)
    .substring(0, position.column - 1);

  const prevLineContent =
    position.lineNumber > 1
      ? model.getLineContent(position.lineNumber - 1)
      : "";

  const isBlankCurrentLine = /^\s*$/.test(linePrefix);
  const isTypingPropertyPrefix = /^\s*[a-zA-Z_][a-zA-Z0-9_.]*$/.test(
    linePrefix,
  );

  // User explicitly typed a space after something
  const hasTrailingWhitespace = /\s+$/.test(linePrefix);

  // User pressed Enter after a comma on previous line
  const isAfterCommaAndEnter =
    isBlankCurrentLine && /,\s*$/.test(prevLineContent);

  if (isImmediatelyAfterCompletedPropertyValue(model, position)) {
    return false;
  }

  return (
    isBlankCurrentLine ||
    isTypingPropertyPrefix ||
    hasTrailingWhitespace ||
    isAfterCommaAndEnter
  );
}

export function parseMerlinScalar(value) {
  const v = String(value ?? "").trim();

  if (v === "null") return null;
  if (v === "true") return true;
  if (v === "false") return false;

  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }

  if (!Number.isNaN(Number(v)) && v !== "") {
    return Number(v);
  }

  return v;
}

export function getLabelOrientationState(valueText) {
  const v = String(valueText ?? "").trim();

  if (!v.startsWith("(")) {
    return { stage: "none" };
  }

  // Fully complete
  if (/^\(\s*vertical\s*,\s*(left|right)\s*\)$/.test(v)) {
    return { stage: "done" };
  }

  // First slot just accepted/typed completely, waiting for comma
  if (/^\(\s*vertical\s*$/.test(v)) {
    return { stage: "first-complete-waiting-comma" };
  }

  // Editing first slot
  if (/^\(\s*[a-zA-Z_]*\s*$/.test(v)) {
    return { stage: "first-editing" };
  }

  // Just after comma, waiting for second slot
  if (/^\(\s*vertical\s*,\s*$/.test(v)) {
    return { stage: "second-empty" };
  }

  // Second slot just accepted/typed completely, waiting for `)`
  if (/^\(\s*vertical\s*,\s*(left|right)\s*$/.test(v)) {
    return { stage: "second-complete-waiting-close" };
  }

  // Editing second slot
  if (/^\(\s*vertical\s*,\s*[a-zA-Z_]*\s*$/.test(v)) {
    return { stage: "second-editing" };
  }

  return { stage: "none" };
}

export function parseMerlinList(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return [];

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];

  return splitTopLevelArgs(inner).map(parseMerlinScalar);
}
export function parseMerlin2DList(value) {
  const trimmed = value.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return [];

  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];

  return splitTopLevelArgs(inner).map((part) => parseMerlinList(part));
}

export function getAvailableAnchorsForDiagramUse(arch, blockName) {
  if (!arch || !blockName) return [];
  return arch?.blocks?.[blockName]?.nodes || [];
}

export function parseArchitecturesFromContext(model, position) {
  const architecturesByVariable = {};
  const lines = model.getValue().split("\n");

  let currentArchitecture = null;
  let currentBlock = null;
  let currentSection = null;
  let insideArchitecture = false;
  let insideBlock = false;
  let insideNodes = false;
  let insideEdges = false;
  let insideGroups = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // architecture a = {
    let match = rawLine.match(/^\s*architecture\s+(\w+)\s*=\s*\{/);
    if (match) {
      const varName = match[1];
      currentArchitecture = varName;
      architecturesByVariable[varName] = {
        title: null,
        blockOrder: [],
        blocks: {},
        diagram: {
          gap: null,
          layout: null,
          uses: {},
          useOrder: [], // preserve order
          connections: [],
        },
      };
      insideArchitecture = true;
      currentBlock = null;
      currentSection = null;
      continue;
    }

    if (!insideArchitecture) {
      // a.removeGroup(Stem, row1)
      match = rawLine.match(/^\s*(\w+)\.removeGroup\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const groupName = parseMerlinScalar(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        block.groups = block.groups.filter((g) => g !== groupName);
        continue;
      }

      // a.removeBlock(Encoder)
      match = rawLine.match(/^\s*(\w+)\.removeBlock\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const blockName = parseMerlinScalar(argsText);
        if (!blockName || !arch.blocks?.[blockName]) continue;

        delete arch.blocks[blockName];
        arch.blockOrder = (arch.blockOrder || []).filter(
          (b) => b !== blockName,
        );

        const removedAliases = new Set(
          Object.entries(arch.diagram?.uses || {})
            .filter(([, useDef]) => useDef?.block === blockName)
            .map(([alias]) => alias),
        );

        if (arch.diagram) {
          for (const alias of removedAliases) {
            delete arch.diagram.uses[alias];
          }

          arch.diagram.useOrder = (arch.diagram.useOrder || []).filter(
            (alias) => !removedAliases.has(alias),
          );

          arch.diagram.connections = (arch.diagram.connections || []).filter(
            (conn) => {
              const text = String(conn || "");
              for (const alias of removedAliases) {
                if (new RegExp(`\\b${alias}\\.`).test(text)) {
                  return false;
                }
              }
              return true;
            },
          );
        }

        continue;
      }
      // a.removeNode(Stem, conv1)
      match = rawLine.match(/^\s*(\w+)\.removeNode\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const nodeName = parseMerlinScalar(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        block.nodes = block.nodes.filter((n) => n !== nodeName);
        block.hiddenNodes.delete(nodeName);
        continue;
      }

      // a.removeNodes(Stem, [conv1, pool1])
      match = rawLine.match(/^\s*(\w+)\.removeNodes\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const nodeNames = parseMerlinList(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        block.nodes = block.nodes.filter((n) => !nodeNames.includes(n));
        nodeNames.forEach((n) => block.hiddenNodes.delete(n));
        continue;
      }

      // a.hideNode(Stem, conv1)
      match = rawLine.match(/^\s*(\w+)\.hideNode\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const nodeName = parseMerlinScalar(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        if (block.nodes.includes(nodeName)) {
          block.hiddenNodes.add(nodeName);
        }
        continue;
      }

      // a.showNode(Stem, conv1)
      match = rawLine.match(/^\s*(\w+)\.showNode\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const nodeName = parseMerlinScalar(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        block.hiddenNodes.delete(nodeName);
        continue;
      }

      // a.removeEdge(Stem, e3)
      match = rawLine.match(/^\s*(\w+)\.removeEdge\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const edgeName = parseMerlinScalar(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        block.edges = block.edges.filter((e) => e !== edgeName);
        block.hiddenEdges.delete(edgeName);
        continue;
      }

      // a.removeEdges(Stem, [e3, e1])
      match = rawLine.match(/^\s*(\w+)\.removeEdges\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const edgeNames = parseMerlinList(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        block.edges = block.edges.filter((e) => !edgeNames.includes(e));
        edgeNames.forEach((e) => block.hiddenEdges.delete(e));
        continue;
      }

      // a.hideEdge(Stem, e1)
      match = rawLine.match(/^\s*(\w+)\.hideEdge\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const edgeName = parseMerlinScalar(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        if (block.edges.includes(edgeName)) {
          block.hiddenEdges.add(edgeName);
        }
        continue;
      }

      // a.showEdge(Stem, e1)
      match = rawLine.match(/^\s*(\w+)\.showEdge\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const args = splitTopLevelArgs(argsText);
        const blockName = parseMerlinScalar(args[0]);
        const edgeName = parseMerlinScalar(args[1]);
        const block = arch.blocks[blockName];
        if (!block) continue;

        block.hiddenEdges.delete(edgeName);
        continue;
      }

      // a.hideBlock(Stem)
      match = rawLine.match(/^\s*(\w+)\.hideBlock\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const blockName = parseMerlinScalar(argsText);
        const block = arch.blocks[blockName];
        if (block) block.hidden = true;
        continue;
      }

      // a.showBlock(Stem)
      match = rawLine.match(/^\s*(\w+)\.showBlock\((.*)\)\s*$/);
      if (match) {
        const [, varName, argsText] = match;
        const arch = architecturesByVariable[varName];
        if (!arch) continue;

        const blockName = parseMerlinScalar(argsText);
        const block = arch.blocks[blockName];
        if (block) block.hidden = false;
        continue;
      }

      continue;
    }

    // end architecture
    if (insideArchitecture && !insideBlock && rawLine.match(/^\s*}\s*$/)) {
      insideArchitecture = false;
      currentArchitecture = null;
      currentBlock = null;
      currentSection = null;
      continue;
    }

    if (!currentArchitecture) continue;

    const arch = architecturesByVariable[currentArchitecture];

    // title: "Hello"
    match = rawLine.match(/^\s*title:\s*["'](.+?)["']\s*,?\s*$/);
    if (match) {
      arch.title = match[1];
      continue;
    }

    // diagram: [
    if (!insideBlock && rawLine.match(/^\s*diagram\s*:\s*\[\s*$/)) {
      currentSection = "diagram";
      continue;
    }

    // end diagram
    if (currentSection === "diagram" && rawLine.match(/^\s*]\s*,?\s*$/)) {
      currentSection = null;
      continue;
    }

    if (currentSection === "diagram") {
      const diagram = arch.diagram;

      let match;

      match = rawLine.match(/^\s*gap\s*:\s*(\d+(?:\.\d+)?)\s*,?\s*$/);
      if (match) {
        diagram.gap = Number(match[1]);
        continue;
      }

      match = rawLine.match(
        /^\s*layout\s*:\s*(horizontal|vertical|grid)\s*,?\s*$/,
      );
      if (match) {
        diagram.layout = match[1];
        continue;
      }

      // uses: [
      if (rawLine.match(/^\s*uses\s*:\s*\[\s*$/)) {
        currentSection = "diagram-uses";
        continue;
      }

      // uses: [e = Encoder, d = Decoder]
      match = rawLine.match(/^\s*uses\s*:\s*\[(.*)\]\s*,?\s*$/);
      if (match) {
        const items = splitTopLevelArgs(match[1]);
        items.forEach((item) => {
          const parsedUse = parseDiagramUseEntry(item);
          if (parsedUse) {
            const { alias, block, anchor } = parsedUse;
            diagram.uses[alias] = { block, anchor };
            diagram.useOrder = diagram.useOrder.filter((a) => a !== alias);
            diagram.useOrder.push(alias);
          }
        });
        continue;
      }

      // connects: [
      if (rawLine.match(/^\s*connects\s*:\s*\[\s*$/)) {
        currentSection = "diagram-connects";
        continue;
      }

      match = rawLine.match(/^\s*connects\s*:\s*\[(.*)\]\s*,?\s*$/);
      if (match) {
        const items = splitTopLevelArgs(match[1]);
        items.forEach((item) => {
          const trimmed = item.trim();
          if (trimmed) {
            arch.diagram.connections.push(trimmed);
          }
        });
        continue;
      }

      match = rawLine.match(
        new RegExp(`^\\s*(${annotationPropRegex})\\s*:\\s*(.+?)\\s*,?\\s*$`),
      );
      if (match) {
        const [, propName, rawValue] = match;
        if (!diagram.annotations) diagram.annotations = {};
        diagram.annotations[propName.replace(/^annotation\./, "")] =
          parseMerlinScalar(rawValue);
        continue;
      }
    }
    if (currentSection === "diagram-connects") {
      if (rawLine.match(/^\s*]\s*,?\s*$/)) {
        currentSection = "diagram";
        continue;
      }

      const trimmed = rawLine.trim();
      if (trimmed) {
        arch.diagram.connections.push(trimmed.replace(/,\s*$/, ""));
      }
      continue;
    }
    if (currentSection === "diagram-uses") {
      if (rawLine.match(/^\s*]\s*,?\s*$/)) {
        currentSection = "diagram";
        continue;
      }

      const trimmed = rawLine.trim().replace(/,\s*$/, "");
      if (!trimmed) continue;

      const parsedUse = parseDiagramUseEntry(trimmed);

      if (parsedUse) {
        const { alias, block, anchor } = parsedUse;
        const diagram = arch.diagram;

        diagram.uses[alias] = { block, anchor };
        diagram.useOrder = diagram.useOrder.filter((a) => a !== alias);
        diagram.useOrder.push(alias);
      }

      continue;
    }
    // block Encoder: [
    match = rawLine.match(/^\s*block\s+(\w+)\s*:\s*\[\s*$/);
    if (match) {
      const blockName = match[1];
      currentBlock = blockName;
      insideBlock = true;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      currentSection = null;

      arch.blockOrder.push(blockName);
      arch.blocks[blockName] = {
        nodes: [],
        edges: [],
        groups: [],
        groupMembers: {},
        hiddenNodes: new Set(),
        hiddenEdges: new Set(),
        hidden: false,
        blockName,
        nodeTypes: {},
      };
      continue;
    }

    // end block
    if (
      insideBlock &&
      !insideNodes &&
      !insideEdges &&
      !insideGroups &&
      rawLine.match(/^\s*]\s*,?\s*$/)
    ) {
      insideBlock = false;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      currentBlock = null;
      currentSection = null;
      continue;
    }

    if (!insideBlock || !currentBlock) continue;

    const block = arch.blocks[currentBlock];

    // nodes: [
    if (rawLine.match(/^\s*nodes:\s*\[\s*$/)) {
      insideNodes = true;
      insideEdges = false;
      insideGroups = false;
      currentSection = "nodes";
      continue;
    }

    // edges: [
    if (rawLine.match(/^\s*edges:\s*\[\s*$/)) {
      insideNodes = false;
      insideEdges = true;
      insideGroups = false;
      currentSection = "edges";
      continue;
    }

    // groups: [
    if (rawLine.match(/^\s*groups:\s*\[\s*$/)) {
      insideNodes = false;
      insideEdges = false;
      insideGroups = true;
      currentSection = "groups";
      continue;
    }

    // end section
    if (
      (insideNodes || insideEdges || insideGroups) &&
      rawLine.match(/^\s*]\s*,?\s*$/)
    ) {
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      currentSection = null;
      continue;
    }

    if (insideNodes) {
      const nodeMatch = rawLine.match(/^\s*(\w+)\s*=\s*(.*)$/);
      if (nodeMatch) {
        const nodeName = nodeMatch[1];
        const nodeBody = nodeMatch[2] || "";

        block.nodes.push(nodeName);

        const typeMatch = nodeBody.match(
          /\btype\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)/,
        );
        block.nodeTypes[nodeName] = typeMatch ? typeMatch[1] : null;
      }
      continue;
    }

    if (insideEdges) {
      // e1 = ...
      match = rawLine.match(/^\s*(\w+)\s*=\s*/);
      if (match) {
        block.edges.push(match[1]);
      }
      continue;
    }

    if (insideGroups) {
      match = rawLine.match(/^\s*(\w+)\s*=\s*(.*)$/);
      if (match) {
        const groupName = match[1];
        const groupBody = match[2] || "";

        block.groups.push(groupName);

        const membersMatch = groupBody.match(/\bmembers\s*:\s*\[([^\]]*)\]/);
        if (membersMatch) {
          block.groupMembers[groupName] = splitTopLevelArgs(membersMatch[1])
            .map((s) => parseMerlinScalar(s))
            .filter(Boolean);
        } else if (!block.groupMembers[groupName]) {
          block.groupMembers[groupName] = [];
        }
      }
      continue;
    }
  }

  return architecturesByVariable;
}

export function getArchitectureTopLevelContext(model, position) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  const lines = textUntilPosition.split("\n");

  let insideArchitecture = false;
  let architectureName = null;

  let insideBlock = false;
  let insideDiagram = false;
  let insideDiagramConnects = false;
  let insideNodes = false;
  let insideEdges = false;
  let insideGroups = false;

  let usedTopLevelEntries = new Set();

  for (const rawLine of lines) {
    const archMatch = rawLine.match(/^\s*architecture\s+(\w+)\s*=\s*\{/);
    if (!insideArchitecture && archMatch) {
      insideArchitecture = true;
      architectureName = archMatch[1];
      insideBlock = false;
      insideDiagram = false;
      insideDiagramConnects = false;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    if (!insideArchitecture) continue;

    // collect only direct architecture top-level entries
    if (
      !insideBlock &&
      !insideDiagram &&
      !insideNodes &&
      !insideEdges &&
      !insideGroups
    ) {
      if (/^\s*title\s*:/.test(rawLine)) usedTopLevelEntries.add("title");
      if (/^\s*diagram\s*:\s*\[/.test(rawLine))
        usedTopLevelEntries.add("diagram");
      if (/^\s*above\s*:/.test(rawLine)) usedTopLevelEntries.add("above");
      if (/^\s*below\s*:/.test(rawLine)) usedTopLevelEntries.add("below");
      if (/^\s*left\s*:/.test(rawLine)) usedTopLevelEntries.add("left");
      if (/^\s*right\s*:/.test(rawLine)) usedTopLevelEntries.add("right");
    }

    // enter block
    if (
      !insideBlock &&
      !insideDiagram &&
      /^\s*block\s+\w+\s*:\s*\[\s*$/.test(rawLine)
    ) {
      insideBlock = true;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    // enter diagram
    if (
      !insideBlock &&
      !insideDiagram &&
      /^\s*diagram\s*:\s*\[\s*$/.test(rawLine)
    ) {
      insideDiagram = true;
      insideDiagramConnects = false;
      continue;
    }

    // handle nested diagram connects
    if (
      insideDiagram &&
      !insideDiagramConnects &&
      /^\s*connects\s*:\s*\[\s*$/.test(rawLine)
    ) {
      insideDiagramConnects = true;
      continue;
    }

    if (insideDiagramConnects && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideDiagramConnects = false;
      continue;
    }

    // leave diagram only if we're not inside connects
    if (
      insideDiagram &&
      !insideDiagramConnects &&
      /^\s*]\s*,?\s*$/.test(rawLine)
    ) {
      insideDiagram = false;
      continue;
    }

    if (insideBlock) {
      if (/^\s*nodes\s*:\s*\[\s*$/.test(rawLine)) {
        insideNodes = true;
        insideEdges = false;
        insideGroups = false;
        continue;
      }

      if (/^\s*edges\s*:\s*\[\s*$/.test(rawLine)) {
        insideNodes = false;
        insideEdges = true;
        insideGroups = false;
        continue;
      }

      if (/^\s*groups\s*:\s*\[\s*$/.test(rawLine)) {
        insideNodes = false;
        insideEdges = false;
        insideGroups = true;
        continue;
      }

      if (
        (insideNodes || insideEdges || insideGroups) &&
        /^\s*]\s*,?\s*$/.test(rawLine)
      ) {
        insideNodes = false;
        insideEdges = false;
        insideGroups = false;
        continue;
      }

      if (
        !insideNodes &&
        !insideEdges &&
        !insideGroups &&
        /^\s*]\s*,?\s*$/.test(rawLine)
      ) {
        insideBlock = false;
        continue;
      }
    }

    // leave architecture
    if (
      !insideBlock &&
      !insideDiagram &&
      !insideDiagramConnects &&
      !insideNodes &&
      !insideEdges &&
      !insideGroups &&
      /^\s*}\s*$/.test(rawLine)
    ) {
      insideArchitecture = false;
      architectureName = null;
      usedTopLevelEntries = new Set();
      continue;
    }
  }

  return {
    insideArchitectureTopLevel:
      insideArchitecture &&
      !insideBlock &&
      !insideDiagram &&
      !insideDiagramConnects &&
      !insideNodes &&
      !insideEdges &&
      !insideGroups,
    architectureName,
    usedTopLevelEntries,
  };
}

export function getArchitectureBlockContext(model, position) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  const lines = textUntilPosition.split("\n");

  let insideArchitecture = false;
  let architectureBraceDepth = 0;
  let currentArchitectureName = null;

  let insideBlock = false;
  let currentBlockName = null;
  let blockBracketDepth = 0;

  let usedBlockEntries = new Set();

  for (const rawLine of lines) {
    const archMatch = rawLine.match(/^\s*architecture\s+(\w+)\s*=\s*\{/);

    if (!insideArchitecture && archMatch) {
      insideArchitecture = true;
      currentArchitectureName = archMatch[1];
      architectureBraceDepth = 1;

      const rest = rawLine.slice(rawLine.indexOf("{") + 1);
      architectureBraceDepth += countToken(rest, "{") - countToken(rest, "}");
      continue;
    }

    if (!insideArchitecture) continue;

    const blockMatch = rawLine.match(/^\s*block\s+(\w+)\s*:\s*\[\s*$/);

    if (!insideBlock && blockMatch) {
      insideBlock = true;
      currentBlockName = blockMatch[1];
      blockBracketDepth = 1;
      usedBlockEntries = new Set();
      continue;
    }

    if (insideBlock) {
      if (blockBracketDepth === 1) {
        if (/^\s*layout\s*:/.test(rawLine)) usedBlockEntries.add("layout");
        if (/^\s*gap\s*:/.test(rawLine)) usedBlockEntries.add("gap");
        if (/^\s*size\s*:/.test(rawLine)) usedBlockEntries.add("size");
        if (/^\s*color\s*:/.test(rawLine)) usedBlockEntries.add("color");
        if (/^\s*shape\s*:/.test(rawLine)) usedBlockEntries.add("shape");
        if (/^\s*fontFamily\s*:/.test(rawLine))
          usedBlockEntries.add("fontFamily");
        if (/^\s*fontSize\s*:/.test(rawLine)) usedBlockEntries.add("fontSize");
        if (/^\s*fontWeight\s*:/.test(rawLine))
          usedBlockEntries.add("fontWeight");
        if (/^\s*fontStyle\s*:/.test(rawLine))
          usedBlockEntries.add("fontStyle");
        if (/^\s*fontColor\s*:/.test(rawLine))
          usedBlockEntries.add("fontColor");
        if (/^\s*nodes\s*:\s*\[/.test(rawLine)) usedBlockEntries.add("nodes");
        if (/^\s*edges\s*:\s*\[/.test(rawLine)) usedBlockEntries.add("edges");
        if (/^\s*groups\s*:\s*\[/.test(rawLine)) usedBlockEntries.add("groups");

        const strokeMatch = rawLine.match(
          /^\s*stroke\.(color|style|width)\s*:/,
        );
        if (strokeMatch) {
          usedBlockEntries.add(`stroke.${strokeMatch[1]}`);
        }

        const annotationMatch = rawLine.match(
          new RegExp(`^\\s*(${annotationPropRegex})\\s*:`),
        );
        if (annotationMatch) {
          usedBlockEntries.add(annotationMatch[1]);
        }
      }

      blockBracketDepth += countToken(rawLine, "[") - countToken(rawLine, "]");

      if (blockBracketDepth <= 0) {
        insideBlock = false;
        currentBlockName = null;
        blockBracketDepth = 0;
        usedBlockEntries = new Set();
        continue;
      }
    }

    architectureBraceDepth +=
      countToken(rawLine, "{") - countToken(rawLine, "}");

    if (architectureBraceDepth <= 0) {
      insideArchitecture = false;
      architectureBraceDepth = 0;
      currentArchitectureName = null;
      insideBlock = false;
      currentBlockName = null;
      blockBracketDepth = 0;
      usedBlockEntries = new Set();
    }
  }

  return {
    insideArchitectureBlockTopLevel:
      insideArchitecture && insideBlock && blockBracketDepth === 1,
    architectureName: currentArchitectureName,
    blockName: currentBlockName,
    usedBlockEntries,
  };
}

export function getArchitectureEdgeCompletionContext(
  edgeText,
  block,
  currentEdgeName = null,
) {
  const rawText = edgeText || "";
  const text = rawText.trim();

  const { nodeNames, groupNames, edgeNames } =
    getArchitectureEdgeMemberCandidates(block, currentEdgeName);

  const usedProps = getUsedInlineProps(text, CONNECTION_INLINE_PROP_KEYS);
  const hasArrow = /\s*->\s*/.test(text);

  const memberDotMatch = text.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.(\w*)$/);

  const memberAnchorMatch = text.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.(\w*)$/);

  const bareMemberMatch = text.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*$/);

  const endsWithBareMember =
    !!bareMemberMatch &&
    !/([a-zA-Z_][a-zA-Z0-9_]*)\.(\w*)$/.test(text) &&
    !/->\s*$/.test(text);

  const endsWithCompleteAnchoredEndpoint =
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\.(left|right|top|bottom)(?:\[\d+\])?\s*$/.test(
      text,
    );

  const hasEdgeAnchorEndpoint = false;

  const shapeValue = getInlinePropValue(text, "shape");
  const isNotStraight = shapeValue !== "straight";

  return {
    text,
    rawText,
    nodeNames,
    groupNames,
    edgeNames,
    usedProps,
    hasArrow,
    hasEdgeAnchorEndpoint,
    isNotStraight,

    isEmpty: text === "",
    needsTargetEndpoint: /->\s*$/.test(text),
    needsArrow: endsWithCompleteAnchoredEndpoint && !hasArrow,

    memberDotMatch,
    memberAnchorMatch,
    bareMemberMatch,
    endsWithBareMember,

    endsAfterTargetEndpoint: endsWithCompleteAnchoredEndpoint && hasArrow,
  };
}

export function shouldShowArchitectureItemStarters(
  model,
  position,
  rawCurrentItemText,
) {
  const currentLinePrefix = model
    .getLineContent(position.lineNumber)
    .substring(0, position.column - 1);

  const prevLineContent =
    position.lineNumber > 1
      ? model.getLineContent(position.lineNumber - 1)
      : "";

  const trimmedPrefix = (rawCurrentItemText || "").trim();

  const isTypingNamePrefix = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmedPrefix);

  const isBlankCurrentLine = /^\s*$/.test(currentLinePrefix);

  // disallow: directly after "," on the same line
  const isImmediatelyAfterCommaSameLine =
    rawCurrentItemText === "" && /,\s*$/.test(currentLinePrefix);

  // allow: ", " on the same line
  const isAfterCommaAndSpaceSameLine =
    /^\s+$/.test(rawCurrentItemText || "") && /,\s+$/.test(currentLinePrefix);

  // allow: "," then Enter
  const isAfterCommaAndEnter =
    isBlankCurrentLine && /,\s*$/.test(prevLineContent);

  // also allow a fresh blank line when starting the section / item area
  const isFreshBlankLine =
    isBlankCurrentLine &&
    !isAfterCommaAndEnter &&
    !isImmediatelyAfterCommaSameLine;

  return (
    !isImmediatelyAfterCommaSameLine &&
    (isAfterCommaAndSpaceSameLine ||
      isAfterCommaAndEnter ||
      isFreshBlankLine ||
      isTypingNamePrefix)
  );
}

export function getCurrentDiagramConnectText(model, position) {
  const linePrefix = model
    .getLineContent(position.lineNumber)
    .substring(0, position.column - 1);

  // inline case: connects: [e.a.right -> d.b.left, e
  const inlineMatch = linePrefix.match(/^\s*connects\s*:\s*\[(.*)$/);
  if (inlineMatch) {
    return getTrailingTopLevelSegment(inlineMatch[1]);
  }

  // multiline case:
  // connects: [
  //   e.a.right -> d.b.left,
  //   e
  // ]
  return getTrailingTopLevelSegment(linePrefix);
}

export function getTrailingTopLevelSegment(text) {
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";
  let lastCommaIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (!inQuotes) {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
      } else if (char === "(" || char === "[" || char === "{") {
        depth++;
      } else if (char === ")" || char === "]" || char === "}") {
        depth = Math.max(0, depth - 1);
      } else if (char === "," && depth === 0) {
        lastCommaIndex = i;
      }
    } else if (char === quoteChar && text[i - 1] !== "\\") {
      inQuotes = false;
    }
  }

  return text.slice(lastCommaIndex + 1);
}

export function getArchitectureDiagramSectionContext(model, position) {
  const lines = [];

  for (let i = 1; i <= position.lineNumber; i++) {
    lines.push(model.getLineContent(i));
  }

  let insideArchitecture = false;
  let insideBlock = false;
  let insideDiagram = false;
  let insideDiagramConnects = false;
  let insideDiagramUses = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const isCursorLine = i === lines.length - 1;

    if (
      !insideArchitecture &&
      /^\s*architecture\s+\w+\s*=\s*\{/.test(rawLine)
    ) {
      insideArchitecture = true;
      insideBlock = false;
      insideDiagram = false;
      insideDiagramConnects = false;
      insideDiagramUses = false;
      continue;
    }

    if (
      insideArchitecture &&
      !insideBlock &&
      !insideDiagram &&
      /^\s*}\s*$/.test(rawLine)
    ) {
      insideArchitecture = false;
      continue;
    }

    if (!insideArchitecture) continue;

    if (!insideDiagram && /^\s*block\s+\w+\s*:\s*\[\s*$/.test(rawLine)) {
      insideBlock = true;
      continue;
    }

    if (insideBlock && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideBlock = false;
      continue;
    }

    if (insideBlock) continue;

    if (!insideDiagram && /^\s*diagram\s*:\s*\[\s*$/.test(rawLine)) {
      insideDiagram = true;
      insideDiagramConnects = false;
      insideDiagramUses = false;
      continue;
    }

    if (!insideDiagram) continue;

    if (!insideDiagramUses) {
      const usesInlineOpen = /^\s*uses\s*:\s*\[/.test(rawLine);
      const usesInlineClosed = /^\s*uses\s*:\s*\[[\s\S]*]\s*,?\s*$/.test(
        rawLine,
      );

      if (usesInlineOpen && !usesInlineClosed) {
        insideDiagramUses = true;
        continue;
      }
    }

    if (!insideDiagramConnects) {
      const connectsInlineOpen = /^\s*connects\s*:\s*\[/.test(rawLine);
      const connectsInlineClosed =
        /^\s*connects\s*:\s*\[[\s\S]*]\s*,?\s*$/.test(rawLine);

      if (connectsInlineOpen && !connectsInlineClosed) {
        insideDiagramConnects = true;
        continue;
      }
    }

    if (insideDiagramUses && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideDiagramUses = false;
      continue;
    }

    if (insideDiagramConnects && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideDiagramConnects = false;
      continue;
    }

    if (
      !insideDiagramUses &&
      !insideDiagramConnects &&
      /^\s*]\s*,?\s*$/.test(rawLine)
    ) {
      insideDiagram = false;
      continue;
    }
  }

  return {
    insideDiagramTopLevel:
      insideArchitecture &&
      insideDiagram &&
      !insideDiagramConnects &&
      !insideDiagramUses,
    insideDiagramConnects,
    insideDiagramUses,
  };
}
export function getArchitectureDiagramTopLevelContext(model, position) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  const lines = textUntilPosition.split("\n");

  let insideArchitecture = false;
  let insideBlock = false;
  let insideDiagram = false;
  let insideDiagramConnects = false;
  let insideDiagramUses = false;
  let architectureName = null;
  const usedEntries = new Set();

  for (const rawLine of lines) {
    const archMatch = rawLine.match(/^\s*architecture\s+(\w+)\s*=\s*\{/);
    if (!insideArchitecture && archMatch) {
      insideArchitecture = true;
      architectureName = archMatch[1];
      insideBlock = false;
      insideDiagram = false;
      insideDiagramConnects = false;
      insideDiagramUses = false;
      continue;
    }

    if (!insideArchitecture) continue;

    if (!insideDiagram && /^\s*block\s+\w+\s*:\s*\[\s*$/.test(rawLine)) {
      insideBlock = true;
      continue;
    }

    if (insideBlock && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideBlock = false;
      continue;
    }

    if (insideBlock) continue;

    if (!insideDiagram && /^\s*diagram\s*:\s*\[\s*$/.test(rawLine)) {
      insideDiagram = true;
      continue;
    }

    if (insideDiagram && !insideDiagramConnects && !insideDiagramUses) {
      if (/^\s*gap\s*:/.test(rawLine)) usedEntries.add("gap");
      if (/^\s*layout\s*:/.test(rawLine)) usedEntries.add("layout");
      if (/^\s*uses\s*:/.test(rawLine)) usedEntries.add("uses");
      if (/^\s*connects\s*:\s*\[/.test(rawLine)) usedEntries.add("connects");

      const annotationMatch = rawLine.match(
        new RegExp(`^\\s*(${annotationPropRegex})\\s*:`),
      );
      if (annotationMatch) {
        usedEntries.add(annotationMatch[1]);
      }
    }

    if (insideDiagram && !insideDiagramUses) {
      const usesInlineOpen = /^\s*uses\s*:\s*\[/.test(rawLine);
      const usesInlineClosed = /^\s*uses\s*:\s*\[[\s\S]*]\s*,?\s*$/.test(
        rawLine,
      );

      if (usesInlineOpen && !usesInlineClosed) {
        insideDiagramUses = true;
        continue;
      }
    }

    if (insideDiagram && !insideDiagramConnects) {
      const connectsInlineOpen = /^\s*connects\s*:\s*\[/.test(rawLine);
      const connectsInlineClosed =
        /^\s*connects\s*:\s*\[[\s\S]*]\s*,?\s*$/.test(rawLine);

      if (connectsInlineOpen && !connectsInlineClosed) {
        insideDiagramConnects = true;
        continue;
      }
    }
    if (insideDiagramUses && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideDiagramUses = false;
      continue;
    }

    if (insideDiagramConnects && /^\s*]\s*,?\s*$/.test(rawLine)) {
      insideDiagramConnects = false;
      continue;
    }

    if (
      insideDiagram &&
      !insideDiagramConnects &&
      !insideDiagramUses &&
      /^\s*]\s*,?\s*$/.test(rawLine)
    ) {
      insideDiagram = false;
      continue;
    }

    if (!insideBlock && !insideDiagram && /^\s*}\s*$/.test(rawLine)) {
      insideArchitecture = false;
      architectureName = null;
      usedEntries.clear();
    }
  }

  return {
    architectureName,
    insideDiagramTopLevel:
      insideArchitecture &&
      insideDiagram &&
      !insideDiagramConnects &&
      !insideDiagramUses,
    usedEntries,
  };
}
export function getArchitectureNameAtPosition(model, position) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  const lines = textUntilPosition.split("\n");
  let currentArchitecture = null;
  let braceDepth = 0;

  for (const rawLine of lines) {
    const match = rawLine.match(/^\s*architecture\s+(\w+)\s*=\s*\{/);
    if (match) {
      currentArchitecture = match[1];
      braceDepth = 1;
      continue;
    }

    if (currentArchitecture) {
      braceDepth += countToken(rawLine, "{") - countToken(rawLine, "}");
      if (braceDepth <= 0) {
        currentArchitecture = null;
        braceDepth = 0;
      }
    }
  }

  return currentArchitecture;
}

export function getDiagramMemberCandidates(arch, alias) {
  const useDef = arch?.diagram?.uses?.[alias];
  const blockName = useDef?.block ?? null;
  const block = blockName ? arch?.blocks?.[blockName] : null;

  return {
    blockName,
    nodeNames: block?.nodes || [],
    edgeNames: block?.edges || [],
    groupNames: block?.groups || [],
  };
}

export function getDiagramConnectCompletionContext(connectText, arch) {
  const rawText = connectText || "";
  const text = rawText.trim();
  const uses = arch?.diagram?.uses || {};
  const aliases = Object.keys(uses);

  const usedProps = getUsedInlineProps(text, CONNECTION_INLINE_PROP_KEYS);

  const hasArrow = /\s*->\s*/.test(text);

  const aliasDotMatch = text.match(/([a-zA-Z_][a-zA-Z0-9_]*)\.(\w*)$/);

  const aliasMemberAnchorMatch = text.match(
    /([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\.(\w*)$/,
  );

  const bareAliasMatch = text.match(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*$/);

  const endsWithBareAlias =
    !!bareAliasMatch &&
    !/([a-zA-Z_][a-zA-Z0-9_]*)\.(\w*)$/.test(text) &&
    !/->\s*$/.test(text);

  const endsWithCompleteAnchoredEndpoint =
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\.(left|right|top|bottom)(?:\[\d+\])?\s*$/.test(
      text,
    ) ||
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\.([a-zA-Z_][a-zA-Z0-9_]*)\.(start|mid|end)\s*$/.test(
      text,
    );

  let endsWithCompleteMember = false;
  let memberNeedsDot = false;
  let completeMemberInfo = null;

  if (aliasDotMatch) {
    const [, alias, memberPrefix] = aliasDotMatch;
    const { nodeNames, edgeNames, groupNames } = getDiagramMemberCandidates(
      arch,
      alias,
    );

    const isCompleteNode = nodeNames.includes(memberPrefix);
    const isCompleteGroup = groupNames.includes(memberPrefix);
    const isCompleteEdge = edgeNames.includes(memberPrefix);

    if (isCompleteNode || isCompleteGroup || isCompleteEdge) {
      endsWithCompleteMember = true;
      memberNeedsDot = !text.endsWith(".");
      completeMemberInfo = {
        alias,
        memberName: memberPrefix,
        memberKind: isCompleteNode
          ? "node"
          : isCompleteGroup
            ? "group"
            : "edge",
      };
    }
  }
  const hasEdgeAnchorEndpoint = hasEdgeAnchorEndpointInDiagramConnectText(text);

  const endsWithCompleteEndpoint =
    endsWithCompleteAnchoredEndpoint || endsWithCompleteMember;

  const shapeValue = getInlinePropValue(text, "shape");
  const isNotStraight = shapeValue !== "straight";

  return {
    text,
    rawText,
    aliases,
    usedProps,
    hasArrow,
    hasEdgeAnchorEndpoint,
    isNotStraight,

    isEmpty: text === "",

    needsTargetEndpoint: /->\s*$/.test(text),

    needsArrow: endsWithCompleteAnchoredEndpoint && !hasArrow,

    aliasDotMatch,
    aliasMemberAnchorMatch,

    bareAliasMatch,
    endsWithBareAlias,

    endsWithCompleteMember,
    memberNeedsDot,
    completeMemberInfo,

    endsAfterTargetEndpoint: endsWithCompleteEndpoint && hasArrow,
  };
}

export function getArchitectureInlineItemContext(model, position) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  const lines = textUntilPosition.split("\n");

  let insideArchitecture = false;
  let insideBlock = false;
  let insideNodes = false;
  let insideEdges = false;
  let insideGroups = false;

  for (const rawLine of lines) {
    if (
      !insideArchitecture &&
      /^\s*architecture\s+\w+\s*=\s*\{/.test(rawLine)
    ) {
      insideArchitecture = true;
      insideBlock = false;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    if (insideArchitecture && !insideBlock && /^\s*}\s*$/.test(rawLine)) {
      insideArchitecture = false;
      continue;
    }

    if (!insideArchitecture) continue;

    if (/^\s*block\s+\w+\s*:\s*\[\s*$/.test(rawLine)) {
      insideBlock = true;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    if (
      insideBlock &&
      !insideNodes &&
      !insideEdges &&
      !insideGroups &&
      /^\s*]\s*,?\s*$/.test(rawLine)
    ) {
      insideBlock = false;
      continue;
    }

    if (!insideBlock) continue;

    if (/^\s*nodes:\s*\[\s*$/.test(rawLine)) {
      insideNodes = true;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    if (/^\s*edges:\s*\[\s*$/.test(rawLine)) {
      insideNodes = false;
      insideEdges = true;
      insideGroups = false;
      continue;
    }

    if (/^\s*groups:\s*\[\s*$/.test(rawLine)) {
      insideNodes = false;
      insideEdges = false;
      insideGroups = true;
      continue;
    }

    if (
      (insideNodes || insideEdges || insideGroups) &&
      /^\s*]\s*,?\s*$/.test(rawLine)
    ) {
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }
  }

  const currentLineBeforeCursor = lines[lines.length - 1] || "";
  const currentItemText = getTrailingTopLevelSegment(currentLineBeforeCursor);

  const itemMatch = currentItemText.match(
    /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*)$/,
  );

  return {
    section: insideNodes
      ? "nodes"
      : insideEdges
        ? "edges"
        : insideGroups
          ? "groups"
          : null,
    isAfterEquals: !!itemMatch,
    isAtFreshItemStart: currentItemText.trim() === "",
    itemName: itemMatch?.[1] ?? null,
    afterEqualsText: itemMatch?.[2] ?? "",
    currentItemText,
  };
}

export function getAllowedArrowheadValuesForShapeText(text) {
  const shape = getInlineBarePropValue(text, "shape");
  return shape === "arc" ? ["0", "1"] : ["0", "1", "2", "3"];
}

export function getUsedInlineProps(text, keys) {
  const used = new Set();

  keys.forEach((key) => {
    const escaped = key.replace(/\./g, "\\.");
    if (new RegExp(`\\b${escaped}\\s*:`).test(text)) {
      used.add(key);
    }
  });

  return used;
}

export function getArchitectureSectionContext(model, position) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  const lines = textUntilPosition.split("\n");

  let insideArchitecture = false;
  let insideBlock = false;
  let insideNodes = false;
  let insideEdges = false;
  let insideGroups = false;

  for (const rawLine of lines) {
    if (
      !insideArchitecture &&
      /^\s*architecture\s+\w+\s*=\s*\{/.test(rawLine)
    ) {
      insideArchitecture = true;
      insideBlock = false;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    if (insideArchitecture && !insideBlock && /^\s*}\s*$/.test(rawLine)) {
      insideArchitecture = false;
      continue;
    }

    if (!insideArchitecture) continue;

    if (/^\s*block\s+\w+\s*:\s*\[\s*$/.test(rawLine)) {
      insideBlock = true;
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    if (
      insideBlock &&
      !insideNodes &&
      !insideEdges &&
      !insideGroups &&
      /^\s*]\s*,?\s*$/.test(rawLine)
    ) {
      insideBlock = false;
      continue;
    }

    if (!insideBlock) continue;

    if (/^\s*nodes:\s*\[\s*$/.test(rawLine)) {
      insideNodes = true;
      insideEdges = false;
      insideGroups = false;
      continue;
    }

    if (/^\s*edges:\s*\[\s*$/.test(rawLine)) {
      insideNodes = false;
      insideEdges = true;
      insideGroups = false;
      continue;
    }

    if (/^\s*groups:\s*\[\s*$/.test(rawLine)) {
      insideNodes = false;
      insideEdges = false;
      insideGroups = true;
      continue;
    }

    if (
      (insideNodes || insideEdges || insideGroups) &&
      /^\s*]\s*,?\s*$/.test(rawLine)
    ) {
      insideNodes = false;
      insideEdges = false;
      insideGroups = false;
      continue;
    }
  }

  return {
    insideNodes,
    insideEdges,
    insideGroups,
  };
}

export function isImmediatelyAfterInlinePropertyComma(model, position) {
  const linePrefix = model
    .getLineContent(position.lineNumber)
    .substring(0, position.column - 1);

  // Block only this exact state:
  //   layout: vertical,|
  //   style: box,|
  //   type: rect,|
  //
  // Do not block:
  //   layout: vertical, |
  //   layout: vertical,
  //   <next line>
  return /^[ \t]*[a-zA-Z_][a-zA-Z0-9_.]*\s*:\s*.+,$/.test(linePrefix);
}

export function pushAnchorSuggestionsForSource(
  suggestions,
  monaco,
  range,
  sourceName,
  block,
  options = {},
) {
  const {
    prefix = "",
    insertSuffix = "",
    triggerSuggestAfterInsert = false,
  } = options;

  const isNode = (block?.nodes || []).includes(sourceName);
  const isGroup = (block?.groups || []).includes(sourceName);
  const isEdge = (block?.edges || []).includes(sourceName);

  if (isNode || isGroup) {
    ["top", "bottom", "left", "right"]
      .filter((anchor) => anchor.startsWith(prefix))
      .forEach((anchor, index) => {
        suggestions.push({
          label: anchor,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: `${anchor}${insertSuffix}`,
          filterText: anchor,
          detail: isGroup ? "Group anchor" : "Node anchor",
          documentation: `Use ${isGroup ? "group" : "node"} anchor ${sourceName}.${anchor}`,
          range,
          sortText: `000_${isGroup ? "group" : "node"}_anchor_${index}`,
          preselect: index === 0,
          command: triggerSuggestAfterInsert
            ? {
                id: "editor.action.triggerSuggest",
                title: "Trigger suggest",
              }
            : undefined,
        });
      });
  }

  if (isEdge) {
    ["start", "mid", "end"]
      .filter((anchor) => anchor.startsWith(prefix))
      .forEach((anchor, index) => {
        suggestions.push({
          label: anchor,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: `${anchor}${insertSuffix}`,
          filterText: anchor,
          detail: "Edge anchor",
          documentation: `Use edge anchor ${sourceName}.${anchor}`,
          range,
          sortText: `000_edge_anchor_${index}`,
          preselect: index === 0,
          command: triggerSuggestAfterInsert
            ? {
                id: "editor.action.triggerSuggest",
                title: "Trigger suggest",
              }
            : undefined,
        });
      });
  }
}

export function getArchitectureInlineNamespaceContext(model, position) {
  const inlineCtx = getArchitectureInlineItemContext(model, position);
  const blockCtx = getArchitectureBlockContext(model, position);
  const diagramCtx = getArchitectureDiagramSectionContext(model, position);

  // 1) inline item contexts: nodes / edges / groups
  if (inlineCtx.section && inlineCtx.isAfterEquals) {
    const text = inlineCtx.afterEqualsText || "";
    const ns = parseArchitectureNamespaceAccess(text.trimStart());

    if (ns) {
      return {
        section: inlineCtx.section,
        namespace: ns.namespace,
        memberPrefix: ns.memberPrefix,
        fullPrefix: ns.fullPrefix,
      };
    }
  }

  // 2) diagram connects context
  if (diagramCtx.insideDiagramConnects) {
    const connectText = getCurrentDiagramConnectText(model, position);
    const ns = parseArchitectureNamespaceAccess(connectText.trimStart());

    if (ns) {
      return {
        section: "diagramConnects",
        namespace: ns.namespace,
        memberPrefix: ns.memberPrefix,
        fullPrefix: ns.fullPrefix,
      };
    }
  }

  // 3) block top-level context
  if (blockCtx.insideArchitectureBlockTopLevel) {
    const linePrefix = model
      .getLineContent(position.lineNumber)
      .substring(0, position.column - 1);

    const ns = parseArchitectureNamespaceAccess(linePrefix);
    if (ns) {
      return {
        section: "block",
        namespace: ns.namespace,
        memberPrefix: ns.memberPrefix,
        fullPrefix: ns.fullPrefix,
      };
    }
  }

  // 4) diagram top-level context
  if (
    diagramCtx.insideDiagramTopLevel &&
    !diagramCtx.insideDiagramConnects &&
    !diagramCtx.insideDiagramUses
  ) {
    const linePrefix = model
      .getLineContent(position.lineNumber)
      .substring(0, position.column - 1);

    const ns = parseArchitectureNamespaceAccess(linePrefix);
    if (ns) {
      return {
        section: "diagram",
        namespace: ns.namespace,
        memberPrefix: ns.memberPrefix,
        fullPrefix: ns.fullPrefix,
      };
    }
  }

  return null;
}
export function getArchitecturePropertyInsertText(fullName) {
  // namespace-only entries"
  if (
    fullName === "stroke" ||
    fullName === "outerStroke" ||
    fullName === "annotation" ||
    fullName === "label" ||
    fullName === "opLabel" ||
    fullName === "subLabel" ||
    fullName === "marker" ||
    fullName === "marker.shift" ||
    /^annotation\.(top|bottom|left|right)$/.test(fullName) ||
    /^annotation\.(top|bottom|left|right)\.shift$/.test(fullName)
  ) {
    return fullName;
  }

  if (fullName === "shift") {
    return "shift";
  }

  if (/^shift\.(top|bottom|left|right)$/.test(fullName)) {
    return `${fullName}: \${1:15}`;
  }

  if (/^marker\.shift\.(top|bottom|left|right)$/.test(fullName)) {
    return `${fullName}: \${1:15}`;
  }

  if (fullName === "marker.text") {
    return `${fullName}: "\${1:text}"`;
  }

  if (fullName === "marker.fontSize") {
    return `${fullName}: \${1:14}`;
  }

  if (fullName === "subLabel.text") {
    return `${fullName}: "\${1:Text}"`;
  }

  if (fullName === "subLabel.fontSize") {
    return `${fullName}: \${1:15}`;
  }

  // numeric
  if (
    fullName === "stroke.width" ||
    fullName === "outerStroke.width" ||
    /^annotation\.(top|bottom|left|right)\.shift\.(top|bottom|left|right)$/.test(
      fullName,
    )
  ) {
    return `${fullName}: \${1:15}`;
  }

  if (fullName === "block.fontSize") {
    return `${fullName}: \${1:14}`;
  }

  if (fullName === "label.text") {
    return `${fullName}: "\${1:Text}"`;
  }

  if (fullName === "label.fontSize") {
    return `${fullName}: \${1:15}`;
  }

  if (fullName === "label.orientation") {
    return `${fullName}: (\${1:vertical}, \${2:right})`;
  }

  if (fullName === "opLabel.text") {
    return `${fullName}: "\${1:Text}"`;
  }

  if (fullName === "opLabel.subtext") {
    return `${fullName}: "\${1:Text}"`;
  }

  if (fullName === "opLabel.fontSize") {
    return `${fullName}: \${1:15}`;
  }

  if (/^annotation\.(top|bottom|left|right)$/.test(fullName)) {
    return `${fullName}: "\${1:text}"`;
  }

  if (
    fullName === "block.fontFamily" ||
    fullName === "block.fontColor" ||
    fullName === "label.fontFamily" ||
    fullName === "label.fontColor" ||
    fullName === "opLabel.fontFamily" ||
    fullName === "opLabel.fontColor" ||
    fullName === "subLabel.fontFamily" ||
    fullName === "subLabel.fontColor" ||
    fullName === "marker.fontFamily" ||
    fullName === "marker.fontColor"
  ) {
    return `${fullName}: `;
  }

  if (
    fullName === "block.fontWeight" ||
    fullName === "block.fontStyle" ||
    fullName === "label.fontWeight" ||
    fullName === "label.fontStyle" ||
    fullName === "opLabel.fontWeight" ||
    fullName === "opLabel.fontStyle" ||
    fullName === "subLabel.fontWeight" ||
    fullName === "subLabel.fontStyle" ||
    fullName === "marker.fontWeight" ||
    fullName === "marker.fontStyle"
  ) {
    return `${fullName}: `;
  }

  // optional annotation styling defaults
  if (fullName === "annotation.fontSize") {
    return `${fullName}: \${1:14}`;
  }

  if (
    fullName === "annotation.fontFamily" ||
    fullName === "annotation.fontColor"
  ) {
    return `${fullName}: `;
  }

  if (
    fullName === "annotation.fontWeight" ||
    fullName === "annotation.fontStyle"
  ) {
    return `${fullName}: `;
  }

  if (fullName === "annotation.gap") {
    return `${fullName}: \${1:10}`;
  }

  return `${fullName}: `;
}

export function pushEdgeEndpointSourceSuggestions(
  suggestions,
  monaco,
  range,
  block,
  currentEdgeName = null,
  prefix = "",
) {
  const nodeNames = block?.nodes || [];
  const groupNames = block?.groups || [];
  const edgeNames = (block?.edges || []).filter(
    (name) => name !== currentEdgeName,
  );

  nodeNames.forEach((name, index) => {
    suggestions.push({
      label: name,
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: name,
      detail: "Node endpoint source",
      documentation: `Use node ${name} as endpoint source`,
      range,
      sortText: `0edge_node_${index}`,
      filterText: `${prefix}${name}`,
    });
  });

  groupNames.forEach((name, index) => {
    suggestions.push({
      label: name,
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: name,
      detail: "Group endpoint source",
      documentation: `Use group ${name} as endpoint source`,
      range,
      sortText: `1edge_group_${index}`,
      filterText: `${prefix}${name}`,
    });
  });

  edgeNames.forEach((name, index) => {
    suggestions.push({
      label: name,
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: name,
      detail: "Edge endpoint source",
      documentation: `Use existing edge ${name} as endpoint source`,
      range,
      sortText: `2edge_edge_${index}`,
      filterText: `${prefix}${name}`,
    });
  });
}

export function pushConnectionInlineProps(
  suggestions,
  monaco,
  range,
  usedProps,
  {
    detail = "connection property",
    hasEdgeAnchorEndpoint = false,
    isNotStraight = false,
  } = {},
) {
  const items = [
    {
      key: "shape",
      label: "shape",
      insertText: "shape: ",
      documentation: "Set connection shape",
    },
    {
      key: "style",
      label: "style",
      insertText: "style: ",
      documentation: "Set connection style",
    },
    {
      key: "color",
      label: "color",
      insertText: "color: ",
      documentation: "Set connection color",
    },
    {
      key: "label",
      label: "label",
      insertText: "label",
      documentation: "Open label properties",
    },
    {
      key: "arrowheads",
      label: "arrowheads",
      insertText: "arrowheads: ",
      documentation: "Set arrowheads count",
    },
    {
      key: "width",
      label: "width",
      insertText: "width: ${1:40}",
      documentation: "Set width",
      isSnippet: true,
    },
    ...(isNotStraight
      ? [
          {
            key: "curveHeight",
            label: "curveHeight",
            insertText: "curveHeight: ${1:40}",
            documentation: "Set curve height",
            isSnippet: true,
          },
        ]
      : []),
    {
      key: "gap",
      label: "gap",
      insertText: "gap: ${1:10}",
      documentation: "Set gap",
      isSnippet: true,
    },
    {
      key: "transition",
      label: "transition",
      insertText: "transition: ",
      documentation: "Set transition",
    },
    {
      key: "alignToIndexedPort",
      label: "alignToIndexedPort",
      insertText: "alignToIndexedPort: ",
      documentation: "Enable or disable indexed-port alignment",
    },
    {
      key: "bidirectional",
      label: "bidirectional",
      insertText: "bidirectional: ",
      documentation: "Enable or disable bidirectional arrowheads",
    },
    ...(hasEdgeAnchorEndpoint
      ? [
          {
            key: "edgeAnchorOffset",
            label: "edgeAnchorOffset",
            insertText: "edgeAnchorOffset: [${1:10}, ${2:10}]",
            documentation: "Offset from edge anchor point",
            isSnippet: true,
          },
        ]
      : []),
  ];

  items
    .filter((item) => !usedProps.has(item.key))
    .forEach((item, index) => {
      const suggestion = createPropertyOnlySuggestion(monaco, range, {
        label: item.label,
        insertText: item.insertText,
        detail,
        documentation: item.documentation,
        sortText: `2conn_prop_${index}`,
      });

      if (item.isSnippet) {
        suggestion.insertTextRules =
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
      }

      suggestions.push(suggestion);
    });
}

export function pushDiagramAliasSuggestions(
  suggestions,
  monaco,
  range,
  arch,
  prefix = "",
) {
  const aliases = Object.keys(arch?.diagram?.uses || {});
  aliases
    .filter((alias) => !prefix || alias.startsWith(prefix))
    .forEach((alias, index) => {
      suggestions.push({
        label: alias,
        kind: monaco.languages.CompletionItemKind.Variable,
        insertText: alias,
        detail: `Diagram alias for ${arch.diagram.uses[alias]?.block}`,
        documentation: `Use alias ${alias} for block ${arch.diagram.uses[alias]?.block}`,
        range,
        sortText: `0diagram_alias_${index}`,
      });
    });
}

export function shouldSuppressDiagramConnectValueSuggestions(
  attributeName,
  valueText,
  connectCtx,
) {
  const value = String(valueText ?? "").trim();

  if (attributeName === "label.fontStyle") {
    return isCompletedScalarValue(value, {
      allowedBareWords: languageConfig.fontStyles,
    });
  }

  if (
    attributeName === "label.fontFamily" ||
    attributeName === "label.fontColor" ||
    attributeName === "color"
  ) {
    return isCompletedScalarValue(value, {
      allowNull: true,
      allowQuotedString: true,
    });
  }

  if (attributeName === "label.fontWeight") {
    return isCompletedScalarValue(value, {
      allowedBareWords: languageConfig.fontWeightsArch,
      allowNumber: true,
    });
  }

  if (attributeName === "edgeAnchorOffset") {
    return isCompletedNumber(value);
  }

  if (
    attributeName === "alignToIndexedPort" ||
    attributeName === "bidirectional"
  ) {
    return value === "true" || value === "false";
  }

  if (attributeName === "shape") {
    return value === "straight" || value === "bow" || value === "arc";
  }

  if (attributeName === "style") {
    return value === "solid" || value === "dashed" || value === "dotted";
  }

  if (attributeName === "arrowheads") {
    const allowedArrowheads = getAllowedArrowheadValuesForShapeText(
      connectCtx.text,
    );
    return allowedArrowheads.includes(value);
  }
  if (attributeName === "curveHeight") {
    return isCompletedNumber(value);
  }

  if (attributeName === "width") {
    return isCompletedNumber(value);
  }

  if (attributeName === "transition") {
    return (
      value === "default" ||
      value === "featureMap" ||
      value === "flatten" ||
      value === "fullyConnected"
    );
  }

  return false;
}

export function pushNodeInlinePropertySuggestions(
  suggestions,
  monaco,
  range,
  afterEqualsText = "",
) {
  const detectedTypeMatch = afterEqualsText.match(
    /\btype\s*:\s*([a-zA-Z_][a-zA-Z0-9_]*)/,
  );
  const detectedType = detectedTypeMatch?.[1] ?? null;

  const allNodeInlineItems = [
    {
      key: "label",
      label: "label",
      insertText: "label",
      documentation: "Open label properties",
    },
    {
      key: "subLabel",
      label: "subLabel",
      insertText: "subLabel",
      documentation: "Open subLabel properties",
    },
    {
      key: "opLabel",
      label: "opLabel",
      insertText: "opLabel",
      documentation: "Open label properties",
    },
    {
      key: "annotation",
      label: "annotation",
      insertText: "annotation",
      documentation: "Open annotation properties",
    },
    {
      key: "stroke",
      label: "stroke",
      insertText: "stroke",
      documentation: "Open stroke properties",
    },
    {
      key: "outerStroke",
      label: "outerStroke",
      insertText: "outerStroke",
      documentation: "Open outerStroke properties",
    },

    {
      key: "type",
      label: "type",
      insertText: "type: ",
      documentation: "Set node type",
    },

    {
      key: "direction",
      label: "direction",
      insertText: "direction: ",
      documentation: "Set trapezoid direction",
    },
    {
      key: "size",
      label: "size",
      insertText: "size: (${1:120}, ${2:48})",
      documentation: "Set node size",
    },
    {
      key: "shape",
      label: "shape",
      insertText: "shape: ",
      documentation: "Set node shape",
    },
    {
      key: "color",
      label: "color",
      insertText: "color: ",
      documentation: "Set node color",
    },

    {
      key: "kernelSize",
      label: "kernelSize",
      insertText: "kernelSize: ",
      documentation: "Set kernel size",
    },
    {
      key: "filterSpacing",
      label: "filterSpacing",
      insertText: "filterSpacing: ${1:10}",
      documentation: "Set filterSpacing",
    },

    {
      key: "outputLabels",
      label: "outputLabels",
      insertText: 'outputLabels: ["${1:y1}", "${2:y2}", "${3:y3}"]',
      documentation: "Set output labels",
    },
  ];

  const used = getUsedInlineProps(
    afterEqualsText,

    [
      ...allNodeInlineItems.map((item) => item.key),
      "label.text",
      "label.orientation",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.subtext",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "stroke.color",
      "stroke.style",
      "stroke.width",
      "outerStroke.color",
      "outerStroke.style",
      "outerStroke.width",
      ...ANNOTATION_PROP_KEYS,
    ],
  );
  const allowedByType = {
    text: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",

      "type",
      "label.text",
      "label.orientation",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
    ]),
    rect: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",
      "stroke",

      "type",
      "label.text",
      "label.orientation",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
      "size",
      "shape",
      "color",
      "stroke.color",
      "stroke.style",
      "stroke.width",
    ]),
    arrow: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",
      "stroke",

      "type",
      "label.text",
      "label.orientation",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
      "size",
      "color",
      "stroke.color",
      "stroke.style",
      "stroke.width",
    ]),
    circle: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",
      "stroke",

      "type",
      "label.text",
      "label.orientation",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
      "size",
      "color",
      "stroke.color",
      "stroke.style",
      "stroke.width",
    ]),
    trapezoid: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",
      "stroke",

      "type",
      "label.text",
      "label.orientation",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
      "size",
      "color",
      "stroke.color",
      "stroke.style",
      "stroke.width",
      "direction",
    ]),

    stacked: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",
      "stroke",
      "outerStroke",

      "type",
      "shape",
      "kernelSize",
      "filterSpacing",
      "label.text",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
      "size",
      "color",
      "stroke.color",
      "stroke.style",
      "stroke.width",
      "outerStroke.color",
      "outerStroke.style",
      "outerStroke.width",
      "size",
    ]),
    flatten: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",

      "type",
      "shape",
      "label.text",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
      "size",
      "color",
    ]),
    fullyConnected: new Set([
      "label",
      "subLabel",
      "opLabel",
      "annotation",

      "type",
      "shape",
      "label.text",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
      "opLabel.text",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
      "opLabel.subtext",
      "annotations",
      "annotation.fontFamily",
      "annotation.fontSize",
      "annotation.fontWeight",
      "annotation.fontStyle",
      "annotation.fontColor",
      "annotation.gap",
      "size",
      "color",
      "outputLabels",
    ]),
  };

  const allowedKeys = detectedType
    ? allowedByType[detectedType] || new Set(["type"])
    : new Set(["type"]);

  const namespaceChildren = {
    label: [
      "label.text",
      "label.orientation",
      "label.fontColor",
      "label.fontFamily",
      "label.fontSize",
      "label.fontWeight",
      "label.fontStyle",
    ],

    subLabel: [
      "subLabel.text",
      "subLabel.fontColor",
      "subLabel.fontFamily",
      "subLabel.fontSize",
      "subLabel.fontWeight",
      "subLabel.fontStyle",
    ],

    opLabel: [
      "opLabel.text",
      "opLabel.subtext",
      "opLabel.fontColor",
      "opLabel.fontFamily",
      "opLabel.fontSize",
      "opLabel.fontWeight",
      "opLabel.fontStyle",
    ],

    stroke: ["stroke.color", "stroke.style", "stroke.width"],

    outerStroke: [
      "outerStroke.color",
      "outerStroke.style",
      "outerStroke.width",
    ],

    annotation: ANNOTATION_PROP_KEYS,
  };

  const isNamespaceFullyUsed = (namespace) => {
    const children = (namespaceChildren[namespace] || []).filter((key) =>
      allowedKeys.has(key),
    );

    return children.length > 0 && children.every((key) => used.has(key));
  };

  allNodeInlineItems

    .filter((item) => allowedKeys.has(item.key))

    .filter((item) => !used.has(item.key))

    .filter((item) => {
      if (
        item.key === "label" ||
        item.key === "subLabel" ||
        item.key === "opLabel" ||
        item.key === "stroke" ||
        item.key === "outerStroke" ||
        item.key === "annotation"
      ) {
        return !isNamespaceFullyUsed(item.key);
      }

      return true;
    })

    .forEach((item, index) => {
      suggestions.push({
        ...createPropertyOnlySuggestion(monaco, range, {
          label: item.label,

          insertText: item.insertText,

          detail: detectedType
            ? `${detectedType} node property`
            : "node property",

          documentation: item.documentation,

          sortText: `0node_inline_${index}`,
        }),

        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      });
    });
}

export function getUsedTopLevelPropertiesInCurrentDefinition(
  model,
  position,
  componentType,
) {
  const textUntilPosition = model.getValueInRange({
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: position.lineNumber,
    endColumn: position.column,
  });

  const lines = textUntilPosition.split("\n");

  let startLineIndex = -1;

  for (let i = lines.length - 1; i >= 0; i--) {
    const match = lines[i].match(/^\s*([a-zA-Z]+)\s+\w+\s*=\s*\{/);
    if (match && match[1] === componentType) {
      startLineIndex = i;
      break;
    }
  }

  const usedProps = new Set();

  if (startLineIndex === -1) {
    return usedProps;
  }

  for (let i = startLineIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed || trimmed === "}") continue;

    const propMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:/);
    if (propMatch) {
      usedProps.add(propMatch[1]);
    }
  }

  return usedProps;
}

export function shouldSuppressArchitectureInlineValueSuggestions(
  section,
  attributeName,
  valueText,
  languageConfig,
  architectureInlineItemContext,
) {
  const value = String(valueText ?? "");

  if (section === "nodes") {
    if (
      /^annotation\.(top|bottom|left|right)\.shift\.(top|bottom|left|right)$/.test(
        attributeName,
      )
    ) {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }
    if (
      attributeName === "label.fontFamily" ||
      attributeName === "label.fontColor" ||
      attributeName === "annotation.fontFamily" ||
      attributeName === "annotation.fontColor" ||
      attributeName === "opLabel.fontFamily" ||
      attributeName === "opLabel.fontColor" ||
      attributeName === "subLabel.fontFamily" ||
      attributeName === "subLabel.fontColor"
    ) {
      return isCompletedScalarValue(value, {
        allowNull: true,
        allowQuotedString: true,
      });
    }

    if (
      attributeName === "label.fontWeight" ||
      attributeName === "annotation.fontWeight" ||
      attributeName === "opLabel.fontWeight" ||
      attributeName === "subLabel.fontWeight"
    ) {
      return isCompletedScalarValue(value, {
        allowedBareWords: languageConfig.fontWeightsArch,
        allowNumber: true,
      });
    }

    if (
      attributeName === "label.fontStyle" ||
      attributeName === "annotation.fontStyle" ||
      attributeName === "opLabel.fontStyle" ||
      attributeName === "subLabel.fontStyle"
    ) {
      return isCompletedScalarValue(value, {
        allowedBareWords: languageConfig.fontStyles,
      });
    }

    if (attributeName === "kernelSize") {
      return /^\d+x\d+$/.test(String(valueText ?? "").trim());
    }
    if (attributeName === "type") {
      return isCompletedScalarValue(value, {
        allowedBareWords: [
          "rect",
          "circle",
          "arrow",
          "text",
          "stacked",
          "flatten",
          "fullyConnected",
          "trapezoid",
        ],
      });
    }
    if (
      attributeName === "stroke.style" ||
      attributeName === "outerStroke.style"
    ) {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["solid", "dashed", "dotted"],
      });
    }

    if (attributeName === "label.orientation") {
      return isCompletedLabelOrientationValue(value);
    }

    if (attributeName === "shape") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["rounded"],
      });
    }
    if (attributeName === "direction") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["right", "left", "top", "bottom"],
      });
    }

    if (
      attributeName === "stroke.width" ||
      attributeName === "outerStroke.width"
    ) {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }

    if (
      attributeName === "color" ||
      attributeName === "stroke.color" ||
      attributeName === "outerStroke.color" ||
      attributeName === "label.fontColor"
    ) {
      return isCompletedScalarValue(value, {
        allowNull: true,
        allowQuotedString: true,
      });
    }
  }

  if (section === "edges") {
    if (
      attributeName === "label.fontFamily" ||
      attributeName === "label.fontColor"
    ) {
      return isCompletedScalarValue(value, {
        allowNull: true,

        allowQuotedString: true,
      });
    }

    if (attributeName === "label.fontWeight") {
      return isCompletedScalarValue(value, {
        allowedBareWords: languageConfig.fontWeightsArch,

        allowNumber: true,
      });
    }

    if (attributeName === "label.fontStyle") {
      return isCompletedScalarValue(value, {
        allowedBareWords: languageConfig.fontStyles,
      });
    }

    if (attributeName === "label.fontSize") {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }
    if (attributeName === "curveHeight") {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }

    if (attributeName === "width") {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }
    if (attributeName === "edgeAnchorOffset") {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }
    if (
      attributeName === "alignToIndexedPort" ||
      attributeName === "bidirectional"
    ) {
      return isCompletedScalarValue(value, {
        allowBoolean: true,
      });
    }
    if (attributeName === "shape") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["straight", "bow", "arc"],
      });
    }

    if (attributeName === "style") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["solid", "dashed", "dotted"],
      });
    }

    if (attributeName === "arrowheads") {
      const allowedArrowheads = getAllowedArrowheadValuesForShapeText(
        architectureInlineItemContext.afterEqualsText || "",
      );

      return isCompletedScalarValue(value, {
        allowedBareWords: allowedArrowheads,
        allowNumber: true,
      });
    }

    if (attributeName === "color" || attributeName === "label.fontColor") {
      return isCompletedScalarValue(value, {
        allowNull: true,
        allowQuotedString: true,
      });
    }

    if (attributeName === "transition") {
      return isCompletedScalarValue(value, {
        allowedBareWords: [
          "default",
          "featureMap",
          "flatten",
          "fullyConnected",
        ],
      });
    }
  }

  if (section === "groups") {
    if (
      /^annotation\.(top|bottom|left|right)\.shift\.(top|bottom|left|right)$/.test(
        attributeName,
      )
    ) {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }

    if (attributeName === "marker.type") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["bracket", "brace"],
      });
    }

    if (attributeName === "marker.position") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["top", "bottom"],
      });
    }

    if (
      attributeName === "annotation.fontFamily" ||
      attributeName === "annotation.fontColor" ||
      attributeName === "marker.fontFamily" ||
      attributeName === "marker.fontColor" ||
      attributeName === "marker.color"
    ) {
      return isCompletedScalarValue(value, {
        allowNull: true,
        allowQuotedString: true,
      });
    }

    if (
      attributeName === "annotation.fontWeight" ||
      attributeName === "marker.fontWeight"
    ) {
      return isCompletedScalarValue(value, {
        allowedBareWords: languageConfig.fontWeightsArch,
        allowNumber: true,
      });
    }

    if (
      attributeName === "annotation.fontStyle" ||
      attributeName === "marker.fontStyle"
    ) {
      return isCompletedScalarValue(value, {
        allowedBareWords: languageConfig.fontStyles,
      });
    }

    if (attributeName === "align") {
      return isCompletedScalarValue(value, {
        allowBoolean: true,
      });
    }
    if (attributeName === "layout") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["horizontal", "vertical", "grid"],
      });
    }

    if (attributeName === "shape") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["rounded"],
      });
    }
    if (
      attributeName === "anchor.source" ||
      attributeName === "anchor.target"
    ) {
      return isCompletedScalarValue(value, {
        allowBareIdentifier: true,
      });
    }

    if (attributeName === "stroke.color") {
      return isCompletedScalarValue(value, {
        allowNull: true,
        allowQuotedString: true,
      });
    }
    if (attributeName === "stroke.style") {
      return isCompletedScalarValue(value, {
        allowedBareWords: ["solid", "dashed", "dotted"],
      });
    }

    if (attributeName === "stroke.width") {
      return isCompletedScalarValue(value, {
        allowNumber: true,
      });
    }

    if (attributeName === "color" || attributeName === "label.fontColor") {
      return isCompletedScalarValue(value, {
        allowNull: true,
        allowQuotedString: true,
      });
    }
  }

  return false;
}
export function getArrayItemCompletionContext(fullText) {
  let depth = 0;
  let inQuotes = false;
  let quoteChar = "";
  let lastCommaIndex = -1;

  for (let i = 0; i < fullText.length; i++) {
    const ch = fullText[i];

    if (!inQuotes) {
      if (ch === '"' || ch === "'") {
        inQuotes = true;
        quoteChar = ch;
      } else if (ch === "[" || ch === "(" || ch === "{") {
        depth++;
      } else if (ch === "]" || ch === ")" || ch === "}") {
        depth = Math.max(0, depth - 1);
      } else if (ch === "," && depth === 0) {
        lastCommaIndex = i;
      }
    } else if (ch === quoteChar && fullText[i - 1] !== "\\") {
      inQuotes = false;
    }
  }

  const currentSegment = fullText.slice(lastCommaIndex + 1);
  const trimmedSegment = currentSegment.trimStart();

  const quoteMatch = trimmedSegment.match(/^["']([^"']*)$/);
  const unquotedMatch = trimmedSegment.match(/^([a-zA-Z_][a-zA-Z0-9_]*)$/);

  return {
    currentSegment,
    currentPrefix: quoteMatch
      ? quoteMatch[1]
      : unquotedMatch
        ? unquotedMatch[1]
        : "",
    hasOpeningQuote: !!quoteMatch,
    replaceCurrentSegmentStartOffset:
      currentSegment.length - trimmedSegment.length,
  };
}
