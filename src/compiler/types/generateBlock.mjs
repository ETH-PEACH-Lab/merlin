import { formatPositionForOutput } from "../../utils/positionUtils.mjs";
import { formatNullValue } from "../compiler.mjs";

export function generateBlock(blockComponent, layout = [3, 3]) {
  const out = [];
  out.push("architecture\n");
  const blocks = new Map();
  const diagramUseId = new Map();

  const allowedNumberFontWeight = new Set([
    100, 200, 300, 400, 500, 600, 700, 800, 900,
  ]);

  const NODE_ALLOWED_FIELDS_BY_TYPE = {
    text: new Set([
      "type",
      "labelText",
      "labelOrientation",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "annotationGap",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
    ]),
    rect: new Set([
      "type",
      "labelText",
      "labelOrientation",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "size",
      "shape",
      "color",
      "strokeColor",
      "strokeStyle",
      "strokeWidth",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "annotationGap",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
    ]),
    arrow: new Set([
      "type",
      "labelText",
      "labelOrientation",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "size",
      "color",
      "strokeColor",
      "strokeStyle",
      "strokeWidth",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "annotationGap",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
    ]),
    trapezoid: new Set([
      "type",
      "labelText",
      "labelOrientation",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "annotationGap",
      "size",
      "color",
      "strokeColor",
      "strokeStyle",
      "strokeWidth",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
      "direction",
    ]),
    circle: new Set([
      "type",
      "labelText",
      "labelOrientation",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "size",
      "color",
      "strokeColor",
      "strokeStyle",
      "strokeWidth",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "annotationGap",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
    ]),
    stacked: new Set([
      "type",
      "shape",
      "kernelSize",
      "filterSpacing",
      "labelText",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
      "color",
      "strokeColor",
      "strokeStyle",
      "strokeWidth",
      "outerStrokeColor",
      "outerStrokeStyle",
      "outerStrokeWidth",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "annotationGap",
      "size",
    ]),
    flatten: new Set([
      "type",
      "shape",
      "labelText",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
      "color",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "annotationGap",
      "size",
    ]),
    fullyConnected: new Set([
      "type",
      "shape",
      "labelText",
      "labelFontColor",
      "labelFontFamily",
      "labelFontSize",
      "labelFontWeight",
      "labelFontStyle",
      "subLabelText",
      "subLabelFontColor",
      "subLabelFontFamily",
      "subLabelFontSize",
      "subLabelFontWeight",
      "subLabelFontStyle",
      "opLabelText",
      "opLabelFontColor",
      "opLabelFontFamily",
      "opLabelFontSize",
      "opLabelFontWeight",
      "opLabelFontStyle",
      "opLabelSubtext",
      "color",
      "outputLabels",
      "annotations",
      "annotationFontFamily",
      "annotationFontSize",
      "annotationFontWeight",
      "annotationFontStyle",
      "annotationFontColor",
      "annotationGap",
      "size",
    ]),
  };
  function getPresentNodeFields(node) {
    const present = [];

    if (node.type !== undefined && node.type !== null) present.push("type");
    if (node.labelText !== undefined && node.labelText !== null)
      present.push("labelText");
    if (node.labelOrientation !== undefined && node.labelOrientation !== null) {
      present.push("labelOrientation");
    }
    if (node.labelFontColor !== undefined && node.labelFontColor !== null)
      present.push("labelFontColor");
    if (node.labelFontFamily !== undefined && node.labelFontFamily !== null)
      present.push("labelFontFamily");
    if (node.labelFontSize !== undefined && node.labelFontSize !== null)
      present.push("labelFontSize");
    if (node.labelFontWeight !== undefined && node.labelFontWeight !== null)
      present.push("labelFontWeight");
    if (node.labelFontStyle !== undefined && node.labelFontStyle !== null)
      present.push("labelFontStyle");

    if (node.subLabelText !== undefined && node.subLabelText !== null)
      present.push("subLabelText");
    if (node.subLabelFontColor !== undefined && node.subLabelFontColor !== null)
      present.push("subLabelFontColor");
    if (
      node.subLabelFontFamily !== undefined &&
      node.subLabelFontFamily !== null
    )
      present.push("subLabelFontFamily");
    if (node.subLabelFontSize !== undefined && node.subLabelFontSize !== null)
      present.push("subLabelFontSize");
    if (
      node.subLabelFontWeight !== undefined &&
      node.subLabelFontWeight !== null
    )
      present.push("subLabelFontWeight");
    if (node.subLabelFontStyle !== undefined && node.subLabelFontStyle !== null)
      present.push("subLabelFontStyle");

    if (node.opLabelText !== undefined && node.opLabelText !== null)
      present.push("opLabelText");
    if (node.opLabelFontColor !== undefined && node.opLabelFontColor !== null)
      present.push("opLabelFontColor");
    if (node.opLabelFontFamily !== undefined && node.opLabelFontFamily !== null)
      present.push("opLabelFontFamily");
    if (node.opLabelFontSize !== undefined && node.opLabelFontSize !== null)
      present.push("opLabelFontSize");
    if (node.opLabelFontWeight !== undefined && node.opLabelFontWeight !== null)
      present.push("opLabelFontWeight");
    if (node.opLabelFontStyle !== undefined && node.opLabelFontStyle !== null)
      present.push("opLabelFontStyle");
    if (node.opLabelSubtext !== undefined && node.opLabelSubtext !== null)
      present.push("opLabelSubtext");

    if (node.size !== undefined && node.size !== null) present.push("size");
    if (node.color !== undefined && node.color !== null) present.push("color");

    if (node.direction !== undefined && node.direction !== null)
      present.push("direction");
    if (node.strokeColor !== undefined && node.strokeColor !== null)
      present.push("strokeColor");
    if (node.strokeStyle !== undefined && node.strokeStyle !== null)
      present.push("strokeStyle");
    if (node.strokeWidth !== undefined && node.strokeWidth !== null)
      present.push("strokeWidth");
    if (node.outerStrokeColor !== undefined && node.outerStrokeColor !== null)
      present.push("outerStrokeColor");
    if (node.outerStrokeStyle !== undefined && node.outerStrokeStyle !== null)
      present.push("outerStrokeStyle");
    if (node.outerStrokeWidth !== undefined && node.outerStrokeWidth !== null)
      present.push("outerStrokeWidth");
    if (node.annotations !== undefined && node.annotations !== null)
      present.push("annotations");

    if (
      node.annotationFontFamily !== undefined &&
      node.annotationFontFamily !== null
    )
      present.push("annotationFontFamily");
    if (
      node.annotationFontSize !== undefined &&
      node.annotationFontSize !== null
    )
      present.push("annotationFontSize");
    if (
      node.annotationFontWeight !== undefined &&
      node.annotationFontWeight !== null
    )
      present.push("annotationFontWeight");

    if (
      node.annotationFontStyle !== undefined &&
      node.annotationFontStyle !== null
    )
      present.push("annotationFontStyle");

    if (
      node.annotationFontColor !== undefined &&
      node.annotationFontColor !== null
    )
      present.push("annotationFontColor");

    if (node.annotationGap !== undefined && node.annotationGap !== null) {
      present.push("annotationGap");
    }

    if (node.shape !== undefined && node.shape !== null) present.push("shape");
    if (node.kernelSize !== undefined && node.kernelSize !== null)
      present.push("kernelSize");
    if (node.filterSpacing !== undefined && node.filterSpacing !== null)
      present.push("filterSpacing");
    if (node.outputLabels !== undefined && node.outputLabels !== null)
      present.push("outputLabels");

    return present;
  }
  // filling set up
  for (const block of blockComponent.body.blocks ?? []) {
    if (!blocks.has(block.id.name)) {
      blocks.set(block.id.name, {
        nodes: new Set(),
        edges: new Set(),
        groups: new Map(),
      });
    } else {
      throw new Error(
        `Duplicated block ID: ${block.id.name} at line ${block.id.line}, column ${block.id.col}.`,
      );
    }

    if (block.fontWeight !== undefined && block.fontWeight !== null) {
      if (!allowedNumberFontWeight.has(block.fontWeight.number)) {
        throw new Error(
          `Invalid value for "Block Font Weight" at line ${block.fontWeight.line}, column ${block.fontWeight.col}: block.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${block.fontWeight.number}.`,
        );
      }
    }

    for (const node of block?.nodes ?? []) {
      const blockTemp = blocks.get(block.id.name);
      if (!blockTemp.nodes.has(node.id.name)) {
        blockTemp.nodes.add(node.id.name);
      } else {
        throw new Error(
          `Duplicated node ID: ${node.id.name} at line ${node.id.line}, column ${node.id.col}.`,
        );
      }
    }
    for (const edge of block?.edges ?? []) {
      const blockTemp = blocks.get(block.id.name);
      if (!blockTemp.edges.has(edge.id.name)) {
        blockTemp.edges.add(edge.id.name);
      } else {
        throw new Error(
          `Duplicated edge ID: ${edge.id.name} at line ${edge.id.line}, column ${edge.id.col}.`,
        );
      }
    }
    for (const group of block?.groups ?? []) {
      const blockTemp = blocks.get(block.id.name);
      if (!blockTemp.groups.has(group.id.name)) {
        blockTemp.groups.set(group.id.name, new Set());
      } else {
        throw new Error(
          `Duplicated group ID: ${group.id.name} at line ${group.id.line}, column ${group.id.col}.`,
        );
      }
    }
  }

  if (blockComponent.body.diagram) {
    const diagram = blockComponent.body.diagram;
    if (diagram.uses) {
      for (const use of diagram.uses) {
        if (!blocks.has(use.block.name)) {
          throw new Error(
            `Unknown block "${use.block.name}" at line ${use.block.line}, column ${use.block.col}. 
"${use.block.name}" has not been defined as a block.`,
          );
        }

        if (!diagramUseId.has(use.id.name)) {
          diagramUseId.set(use.id.name, new Set());
        }
        diagramUseId.get(use.id.name).add(use.block.name);
      }
    }
  }

  for (const block of blockComponent.body.blocks ?? []) {
    if (
      block.annotationFontWeight !== undefined &&
      block.annotationFontWeight !== null
    ) {
      if (!allowedNumberFontWeight.has(block.annotationFontWeight.number)) {
        throw new Error(
          `Invalid value for "Annotation Font Weight" at line ${block.annotationFontWeight.line}, column ${block.annotationFontWeight.col}: annotation.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${block.annotationFontWeight.number}.`,
        );
      }
    }

    for (const node of block?.nodes ?? []) {
      if (node.type === undefined || node.type === null) {
        throw new Error(
          `Invalid node "${node.id.name}" at line ${node.id.line}, column ${node.id.col} — required field "type" is missing.`,
        );
      }

      const allowed = NODE_ALLOWED_FIELDS_BY_TYPE[node.type];
      for (const field of getPresentNodeFields(node)) {
        if (!allowed.has(field)) {
          throw new Error(
            `Field "${field}" is not allowed for node type "${node.type}" in node "${node.id.name}" at line ${node.id.line}, column ${node.id.col}.`,
          );
        }
      }

      if (node.labelFontWeight) {
        if (!allowedNumberFontWeight.has(node.labelFontWeight.number)) {
          throw new Error(
            `Invalid value for "Font Weight" at line ${node.labelFontWeight.line}, column ${node.labelFontWeight.col}: label.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${node.labelFontWeight.number}.`,
          );
        }
      }
      if (node.subLabelFontWeight) {
        if (!allowedNumberFontWeight.has(node.subLabelFontWeight.number)) {
          throw new Error(
            `Invalid value for "Font Weight" at line ${node.subLabelFontWeight.line}, column ${node.subLabelFontWeight.col}: subLabel.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${node.subLabelFontWeight.number}.`,
          );
        }
      }
      if (node.opLabelFontWeight) {
        if (!allowedNumberFontWeight.has(node.opLabelFontWeight.number)) {
          throw new Error(
            `Invalid value for "Font Weight" at line ${node.opLabelFontWeight.line}, column ${node.opLabelFontWeight.col}: label.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${node.opLabelFontWeight.number}.`,
          );
        }
      }
      if (node.annotationFontWeight) {
        if (!allowedNumberFontWeight.has(node.annotationFontWeight.number)) {
          throw new Error(
            `Invalid value for "Annotation Font Weight" at line ${node.annotationFontWeight.line}, column ${node.annotationFontWeight.col}: annotation.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${node.annotationFontWeight.number}.`,
          );
        }
      }
      if (
        node.type === "flatten" ||
        node.type === "fullyConnected" ||
        node.type === "stacked"
      ) {
        if (node.shape === undefined || node.shape === null) {
          throw new Error(
            `Invalid node "${node.id.name}" at line ${node.id.line}, column ${node.id.col} — required field "shape" is missing.`,
          );
        }
      }
    }

    for (const edge of block?.edges ?? []) {
      const blockTemp = blocks.get(block.id.name);

      if (edge.from.edge?.name === edge.id.name) {
        throw new Error(
          `Invalid edge reference: edge "${edge.from.edge.name}" references itself at line ${edge.from.edge.line}, column ${edge.from.edge.col}.`,
        );
      }
      if (edge.from.edge?.name !== undefined) {
        if (!blockTemp.edges.has(edge.from.edge.name)) {
          const validEdges = [...blockTemp.edges].join(", ");
          throw new Error(
            `Unknown edge "${edge.from.edge.name}" at line ${edge.from.edge.line}, column ${edge.from.edge.col}. 
Edge "${edge.from.edge.name}" has not been defined in block ${block.id.name} edges.
Available edges: ${validEdges === "" ? "none" : validEdges}.`,
          );
        }
      }
      if (edge.from.node?.name !== undefined) {
        if (
          !blockTemp.nodes.has(edge.from.node.name) &&
          !blockTemp.groups.has(edge.from.node.name)
        ) {
          const validGroups = [...(blockTemp?.groups?.keys() ?? [])].join(", ");
          const validNodes = [...blockTemp?.nodes].join(", ");
          throw new Error(
            `Unknown node/group "${edge.from.node.name}" at line ${edge.from.node.line}, column ${edge.from.node.col}. 
Node/Group "${edge.from.node.name}" has not been defined in block ${block.id.name} nodes/groups.
Available nodes: ${validNodes === "" ? "none" : validNodes}
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
          );
        }
      }

      if (edge.to.edge?.name !== undefined) {
        if (!blockTemp.edges.has(edge.to.edge.name)) {
          const validEdges = [...blockTemp.edges].join(", ");
          throw new Error(
            `Unknown edge "${edge.to.edge.name}" at line ${edge.to.edge.line}, column ${edge.to.edge.col}. 
Edge "${edge.to.edge.name}" has not been defined in block ${block.id.name} edges.
Available edges: ${validEdges === "" ? "none" : validEdges}.`,
          );
        }
      }
      if (edge.to.node?.name !== undefined) {
        if (
          !blockTemp.nodes.has(edge.to.node.name) &&
          !blockTemp.groups.has(edge.to.node.name)
        ) {
          const validGroups = [...(blockTemp?.groups?.keys() ?? [])].join(", ");
          const validNodes = [...blockTemp?.nodes].join(", ");
          throw new Error(
            `Unknown node/group "${edge.to.node.name}" at line ${edge.to.node.line}, column ${edge.to.node.col}. 
Node/Group "${edge.to.node.name}" has not been defined in block ${block.id.name} nodes/groups.
Available nodes: ${validNodes === "" ? "none" : validNodes}
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
          );
        }
      }
      if (edge.from.portIndex) {
        if (edge.from.portIndex.number < 0 || edge.from.portIndex.number > 10) {
          throw new Error(
            `Invalid portIndex value at line ${edge.from.portIndex.line}, column ${edge.from.portIndex.col} — expected 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 or 10`,
          );
        }
      }
      if (edge.to.portIndex) {
        if (edge.to.portIndex.number < 0 || edge.to.portIndex.number > 10) {
          throw new Error(
            `Invalid portIndex value at line ${edge.to.portIndex.line}, column ${edge.to.portIndex.col} — expected 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 or 10`,
          );
        }
      }
      if (edge.labelFontWeight) {
        if (!allowedNumberFontWeight.has(edge.labelFontWeight.number)) {
          throw new Error(
            `Invalid value for "Font Weight" at line ${edge.labelFontWeight.line}, column ${edge.labelFontWeight.col}: label.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${edge.labelFontWeight.number}.`,
          );
        }
      }
      if (edge.arrowheads) {
        if (edge.shape === "arc" && edge.arrowheads.number > 1) {
          throw new Error(
            `Invalid arrowhead count for edge "${edge.id.name}" at line ${edge.id.line}, column ${edge.id.col}: shape "arc" supports only 0 or 1 arrowhead.`,
          );
        }
        if (edge.arrowheads.number < 0 || edge.arrowheads.number > 3) {
          throw new Error(
            `Invalid arrowheads value at line ${edge.arrowheads.line}, column ${edge.arrowheads.col} — expected 0, 1, 2 or 3`,
          );
        }
      }
      if (edge.edgeAnchorOffset) {
        if (edge.edgeAnchorOffset.length > 2) {
          throw new Error(
            `Invalid "edgeAnchorOffset" for edge "${edge.id.name}" at line ${edge.id.line}, column ${edge.id.col}: "edgeAnchorOffset" must be an Array of length 1 or 2.`,
          );
        }
      }
    }

    for (const group of block?.groups ?? []) {
      const blockTemp = blocks.get(block.id.name);

      if (group.members) {
        for (const member of group.members) {
          if (group.id.name === member.name) {
            throw new Error(
              `Invalid member reference: member "${member.name}" references itself at line ${member.line}, column ${member.col}.`,
            );
          }
          if (blockTemp.edges.has(member.name)) {
            const validGroups = [...(blockTemp?.groups?.keys() ?? [])].join(
              ", ",
            );
            const validNodes = [...blockTemp?.nodes].join(", ");
            throw new Error(
              `Invalid member "${member.name}" at line ${member.line}, column ${member.col}.
Members must be nodes or groups; edges are not allowed.
Available nodes: ${validNodes === "" ? "none" : validNodes}.
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
            );
          }
          if (
            !blockTemp.nodes.has(member.name) &&
            !blockTemp.groups.has(member.name)
          ) {
            const blockGroups = [...(blockTemp?.groups?.keys() ?? [])].filter(
              (item) => item !== group.id.name,
            );
            const validGroups = blockGroups.join(", ");
            const validNodes = [...blockTemp?.nodes].join(", ");
            throw new Error(
              `Unknown member "${member.name}" at line ${member.line}, column ${member.col}. 
Member "${member.name}" has not been defined in block ${block.id.name} nodes or groups.
Available nodes: ${validNodes === "" ? "none" : validNodes}.
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
            );
          }
        }
        const groupSet = blockTemp.groups.get(group.id.name);
        for (const member of group.members) {
          groupSet.add(member.name);
        }
      } else {
        throw new Error(
          `Members of group "${group.id.name}" in block "${block.id.name}" at line ${group.id.line}, column ${group.id.col} are not defined.`,
        );
      }

      if (group.anchorSource && !group.anchorTarget) {
        throw new Error(
          `Invalid anchor configuration for group "${group.id.name}" at line ${group.id.line}, column ${group.id.col}: anchor.source is defined, but anchor.target is missing.`,
        );
      } else if (!group.anchorSource && group.anchorTarget) {
        throw new Error(
          `Invalid anchor configuration for group "${group.id.name}" at line ${group.id.line}, column ${group.id.col}: anchor.target is defined, but anchor.source is missing.`,
        );
      }

      if (group.anchorSource && group.anchorTarget) {
        const allMembers = new Set();

        function recAnchor(x) {
          allMembers.add(x);
          if (!blockTemp.groups.has(x)) {
            return;
          }

          for (const member of [...blockTemp.groups.get(x)]) {
            allMembers.add(member);
            recAnchor(member);
          }
        }

        for (const member of group.members) {
          recAnchor(member.name);
        }

        if (!allMembers.has(group.anchorSource.name)) {
          const validMembers = [...allMembers].join(", ");
          throw new Error(
            `Invalid anchor.source "${group.anchorSource.name}" at line ${group.id.line}, column ${group.anchorSource.col}.
anchor.source "${group.anchorSource.name}" must be one of this items: ${validMembers}.`,
          );
        }

        if (!allMembers.has(group.anchorTarget.name)) {
          const validMembers = [...allMembers].join(", ");
          throw new Error(
            `Invalid anchor.target "${group.anchorTarget.name}" at line ${group.anchorTarget.line}, column ${group.anchorTarget.col}.
anchor.target "${group.anchorTarget.name}" must be one of this items: ${validMembers}.`,
          );
        }
      }

      if (group.markerLabelFontWeight) {
        if (!allowedNumberFontWeight.has(group.markerLabelFontWeight.number)) {
          throw new Error(
            `Invalid value for "Font Weight" at line ${group.markerLabelFontWeight.line}, column ${group.markerLabelFontWeight.col}: marker.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${group.markerLabelFontWeight.number}.`,
          );
        }
      }
      if (group.annotationFontWeight) {
        if (!allowedNumberFontWeight.has(group.annotationFontWeight.number)) {
          throw new Error(
            `Invalid value for "Annotation Font Weight" at line ${group.annotationFontWeight.line}, column ${group.annotationFontWeight.col}: annotation.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${group.annotationFontWeight.number}.`,
          );
        }
      }
    }
  }
  if (blockComponent.body.diagram) {
    const diagram = blockComponent.body.diagram;

    if (diagram.rotateRight) {
      if (diagram.rotateRight.number < 0 || diagram.rotateRight.number > 4) {
        throw new Error(
          `Invalid rotateRight value at line ${diagram.rotateRight.line}, column ${diagram.rotateRight.col} — expected 0, 1, 2, 3 or 4`,
        );
      }
    }

    if (diagram.connects) {
      for (const connect of diagram.connects) {
        if (!diagramUseId.has(connect.from.block.name)) {
          const validUseId = [...(diagramUseId?.keys() ?? [])].join(", ");

          throw new Error(
            `Unknown use ID: "${connect.from.block.name}" at line ${connect.from.block.line}, column ${connect.from.block.col}. 
"${connect.from.block.name}" has not been defined in uses.
Available uses: ${validUseId === "" ? "none" : validUseId}.`,
          );
        } else {
          for (const blockName of diagramUseId.get(connect.from.block.name)) {
            if (connect.from.edge?.name !== undefined) {
              const edgeName = connect.from.edge?.name;
              const block = blocks.get(blockName);
              if (!block.edges.has(edgeName)) {
                const valid = [...block.edges].join(", ");
                throw new Error(
                  `Unknown edge "${connect.from.edge.name}" at line ${connect.from.edge.line}, column ${connect.from.edge.col}. 
Edge "${connect.from.edge.name}" has not been defined in block ${blockName} edges.
Available edges: ${valid === "" ? "none" : valid}.`,
                );
              }
            }

            if (connect.from.node?.name !== undefined) {
              const nodeName = connect.from.node?.name;
              const block = blocks.get(blockName);
              if (!block.nodes.has(nodeName) && !block.groups.has(nodeName)) {
                const validNodes = [...block?.nodes].join(", ");
                const validGroups = [...(block?.groups?.keys() ?? [])].join(
                  ", ",
                );
                throw new Error(
                  `Unknown node/group "${connect.from.node.name}" at line ${connect.from.node.line}, column ${connect.from.node.col}. 
Node/Group "${connect.from.node.name}" has not been defined in block ${blockName} nodes/groups.
Available nodes: ${validNodes === "" ? "none" : validNodes}
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
                );
              }
            }
          }
        }
        if (!diagramUseId.has(connect.to.block.name)) {
          const validUseId = [...(diagramUseId?.keys() ?? [])].join(", ");
          throw new Error(
            `Unknown use ID: "${connect.to.block.name}" at line ${connect.to.block.line}, column ${connect.to.block.col}. 
"${connect.to.block.name}" has not been defined in uses.
Available uses: ${validUseId === "" ? "none" : validUseId}.`,
          );
        } else {
          for (const blockName of diagramUseId.get(connect.to.block.name)) {
            if (connect.to.edge?.name !== undefined) {
              const edgeName = connect.to.edge?.name;
              const block = blocks.get(blockName);
              if (!block.edges.has(edgeName)) {
                const valid = [...block.edges].join(", ");
                throw new Error(
                  `Unknown edge "${connect.to.edge.name}" at line ${connect.to.edge.line}, column ${connect.to.edge.col}. 
Edge "${connect.to.edge.name}" has not been defined in block ${blockName} edges.
Available edges: ${valid === "" ? "none" : valid}.`,
                );
              }
            }

            if (connect.to.node?.name !== undefined) {
              const nodeName = connect.to.node?.name;
              const block = blocks.get(blockName);
              if (!block.nodes.has(nodeName) && !block.groups.has(nodeName)) {
                const validNodes = [...block?.nodes].join(", ");
                const validGroups = [...(block?.groups?.keys() ?? [])].join(
                  ", ",
                );
                throw new Error(
                  `Unknown node/group "${connect.to.node.name}" at line ${connect.to.node.line}, column ${connect.to.node.col}. 
Node/Group "${connect.to.node.name}" has not been defined in block ${blockName} nodes/groups.
Available nodes: ${validNodes === "" ? "none" : validNodes}
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
                );
              }
            }
          }
        }
        if (connect.from.portIndex) {
          if (
            connect.from.portIndex.number < 0 ||
            connect.from.portIndex.number > 10
          ) {
            throw new Error(
              `Invalid portIndex value at line ${connect.from.portIndex.line}, column ${connect.from.portIndex.col} — expected 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 or 10`,
            );
          }
        }
        if (connect.to.portIndex) {
          if (
            connect.to.portIndex.number < 0 ||
            connect.to.portIndex.number > 10
          ) {
            throw new Error(
              `Invalid portIndex value at line ${connect.to.portIndex.line}, column ${connect.to.portIndex.col} — expected 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 or 10`,
            );
          }
        }

        if (
          connect.labelFontWeight !== undefined &&
          connect.labelFontWeight !== null
        ) {
          if (!allowedNumberFontWeight.has(connect.labelFontWeight.number)) {
            throw new Error(
              `Invalid value for "Font Weight" at line ${connect.labelFontWeight.line}, column ${connect.labelFontWeight.col}: label.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${connect.labelFontWeight.number}.`,
            );
          }
        }
        if (connect.arrowheads) {
          if (connect.arrowheads.number < 0 || connect.arrowheads.number > 3) {
            throw new Error(
              `Invalid arrowheads value at line ${connect.arrowheads.line}, column ${connect.arrowheads.col} — expected 0, 1, 2 or 3`,
            );
          }
        }
        if (connect.edgeAnchorOffset) {
          if (connect.edgeAnchorOffset.length > 2) {
            throw new Error(
              `Invalid "edgeAnchorOffset" for connect: "edgeAnchorOffset" must be an Array of length 1 or 2.`,
            );
          }
        }
      }
    }

    if (
      diagram.annotationFontWeight !== undefined &&
      diagram.annotationFontWeight !== null
    ) {
      if (!allowedNumberFontWeight.has(diagram.annotationFontWeight.number)) {
        throw new Error(
          `Invalid value for "Annotation Font Weight" at line ${diagram.annotationFontWeight.line}, column ${diagram.annotationFontWeight.col}: annotation.fontWeight must be one of 100, 200, 300, 400, 500, 600, 700, 800, or 900, but got ${diagram.annotationFontWeight.number}.`,
        );
      }
    }
  }

  function generateSubLabel(node) {
    out.push(
      node.subLabelText !== undefined && node.subLabelText !== null
        ? `subLabel.text: "${formatNullValue(node.subLabelText)}" `
        : "",
    );

    out.push(
      node.subLabelFontColor !== undefined && node.subLabelFontColor !== null
        ? `subLabel.fontColor: "${formatNullValue(node.subLabelFontColor)}" `
        : "",
    );

    out.push(
      node.subLabelFontFamily !== undefined && node.subLabelFontFamily !== null
        ? `subLabel.fontFamily: "${formatNullValue(node.subLabelFontFamily)}" `
        : "",
    );

    out.push(
      node.subLabelFontSize !== undefined && node.subLabelFontSize !== null
        ? `subLabel.fontSize: ${node.subLabelFontSize} `
        : "",
    );

    out.push(
      node.subLabelFontWeight
        ? `subLabel.fontWeight: ${node.subLabelFontWeight.number} `
        : "",
    );

    out.push(
      node.subLabelFontStyle
        ? `subLabel.fontStyle: ${node.subLabelFontStyle} `
        : "",
    );
  }

  out.push(formatPositionForOutput(blockComponent.position, layout));
  out.push(
    blockComponent.body.title ? `title: "${blockComponent.body.title}"\n` : "",
  );

  out.push("@\n");

  for (const block of blockComponent.body.blocks ?? []) {
    if (block.hidden === undefined) {
      out.push(`block ${block.id.name}\n`);
    }

    if (block.hidden === undefined) {
      out.push(block.layout ? `layout: ${block.layout}\n` : "");
      out.push(
        block.gap !== undefined && block.gap !== null
          ? `gap: ${block.gap}\n`
          : "",
      );
      out.push(
        block.size ? `size: (${block.size[0]}, ${block.size[1]})\n` : "",
      );
      out.push(
        block.color !== undefined && block.color !== null
          ? `color: "${block.color}"\n`
          : "",
      );
      out.push(
        block.strokeColor !== undefined && block.strokeColor !== null
          ? `stroke.color: "${formatNullValue(block.strokeColor)}" `
          : "",
      );
      out.push(block.strokeStyle ? `stroke.style: ${block.strokeStyle} ` : "");
      out.push(
        block.strokeWidth !== undefined && block.strokeWidth !== null
          ? `stroke.width: ${block.strokeWidth} `
          : "",
      );
      out.push(block.shape ? `shape: ${block.shape}\n` : "");

      out.push(
        block.fontColor !== undefined && block.fontColor !== null
          ? `block.fontColor: "${formatNullValue(block.fontColor)}" `
          : "",
      );

      out.push(
        block.fontFamily !== undefined && block.fontFamily !== null
          ? `block.fontFamily: "${formatNullValue(block.fontFamily)}" `
          : "",
      );

      out.push(
        block.fontSize !== undefined && block.fontSize !== null
          ? `block.fontSize: ${block.fontSize} `
          : "",
      );

      out.push(
        block.fontWeight !== undefined && block.fontWeight !== null
          ? `block.fontWeight: ${block.fontWeight.number} `
          : "",
      );

      out.push(
        block.fontStyle !== undefined && block.fontStyle !== null
          ? `block.fontStyle: ${block.fontStyle} `
          : "",
      );

      if (
        (block.fontColor !== undefined && block.fontColor !== null) ||
        (block.fontFamily !== undefined && block.fontFamily !== null) ||
        (block.fontSize !== undefined && block.fontSize !== null) ||
        (block.fontWeight !== undefined && block.fontWeight !== null) ||
        (block.fontStyle !== undefined && block.fontStyle !== null)
      ) {
        out.push("\n");
      }

      if (block.annotations) {
        for (const annotation of block.annotations) {
          if (annotation.value !== undefined && annotation.value !== null) {
            out.push(
              `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `,
            );

            out.push(
              annotation.shiftLeft !== undefined &&
                annotation.shiftLeft !== null
                ? `.shift.left: ${annotation.shiftLeft} `
                : "",
            );
            out.push(
              annotation.shiftRight !== undefined &&
                annotation.shiftRight !== null
                ? `.shift.right: ${annotation.shiftRight} `
                : "",
            );

            out.push(
              annotation.shiftBottom !== undefined &&
                annotation.shiftBottom !== null
                ? `.shift.bottom: ${annotation.shiftBottom} `
                : "",
            );
            out.push(
              annotation.shiftTop !== undefined && annotation.shiftTop !== null
                ? `.shift.top: ${annotation.shiftTop} `
                : "",
            );
          }
        }
      }

      out.push(
        block.annotationGap !== undefined && block.annotationGap !== null
          ? `annotation.gap: ${block.annotationGap} `
          : "",
      );

      out.push(
        block.annotationFontFamily !== undefined &&
          block.annotationFontFamily !== null
          ? `annotation.fontFamily: "${formatNullValue(block.annotationFontFamily)}" `
          : "",
      );

      out.push(
        block.annotationFontSize !== undefined &&
          block.annotationFontSize !== null
          ? `annotation.fontSize: ${block.annotationFontSize} `
          : "",
      );

      out.push(
        block.annotationFontWeight !== undefined &&
          block.annotationFontWeight !== null
          ? `annotation.fontWeight: ${block.annotationFontWeight.number} `
          : "",
      );

      out.push(
        block.annotationFontStyle
          ? `annotation.fontStyle: ${block.annotationFontStyle} `
          : "",
      );

      out.push(
        block.annotationFontColor !== undefined &&
          block.annotationFontColor !== null
          ? `annotation.fontColor: "${formatNullValue(block.annotationFontColor)}" `
          : "",
      );

      if (block.annotations) {
        out.push("\n");
      }

      out.push("\n");
    }

    if (block.nodes) {
      if (block.hidden === undefined) {
        out.push("nodes\n");
      }
      for (const node of block.nodes) {
        if (block.hidden === undefined && node.hidden === undefined) {
          out.push(`${node.type} ${node.id.name} `);

          if (
            node.type === "flatten" ||
            node.type === "stacked" ||
            node.type === "fullyConnected"
          ) {
            const shapeTextFullyConnected = node.outputLabels
              ? `shape: {${node.shape[0].join(", ")}: {${node.outputLabels.map((x) => JSON.stringify(formatNullValue(x))).join(", ")}}} `
              : `shape: {${node.shape[0].join(", ")}}`;

            out.push(
              node.shape
                ? node.type === "flatten"
                  ? `shape: ${node.shape[0][0]}x${node.shape[0][1]} `
                  : node.type === "stacked"
                    ? `shape: ${node.shape[0][0]}x${node.shape[0][1]}x${node.shape[0][2]} `
                    : shapeTextFullyConnected
                : "",
            );
          }
          out.push(
            node.kernelSize
              ? `kernelSize: ${node.kernelSize[0]}x${node.kernelSize[1]} `
              : "",
          );
          out.push(
            node.filterSpacing !== undefined && node.filterSpacing !== null
              ? `filterSpacing: ${node.filterSpacing} `
              : "",
          );

          out.push(
            node.labelText !== undefined && node.labelText !== null
              ? `label.text: "${formatNullValue(node.labelText)}" `
              : "",
          );

          out.push(
            node.labelOrientation
              ? `label.orientation: (${node.labelOrientation[0]},${node.labelOrientation[1]}) `
              : "",
          );

          out.push(
            node.labelFontColor !== undefined && node.labelFontColor !== null
              ? `label.fontColor: "${formatNullValue(node.labelFontColor)}" `
              : "",
          );

          out.push(
            node.labelFontFamily !== undefined && node.labelFontFamily !== null
              ? `label.fontFamily: "${formatNullValue(node.labelFontFamily)}" `
              : "",
          );

          out.push(
            node.labelFontSize !== undefined && node.labelFontSize !== null
              ? `label.fontSize: ${node.labelFontSize} `
              : "",
          );

          out.push(
            node.labelFontWeight
              ? `label.fontWeight: ${node.labelFontWeight.number} `
              : "",
          );

          out.push(
            node.labelFontStyle
              ? `label.fontStyle: ${node.labelFontStyle} `
              : "",
          );

          generateSubLabel(node);

          out.push(
            node.opLabelText !== undefined && node.opLabelText !== null
              ? `opLabel.text: "${formatNullValue(node.opLabelText)}" `
              : "",
          );

          out.push(
            node.opLabelFontColor !== undefined &&
              node.opLabelFontColor !== null
              ? `opLabel.fontColor: "${formatNullValue(node.opLabelFontColor)}" `
              : "",
          );

          out.push(
            node.opLabelFontFamily !== undefined &&
              node.opLabelFontFamily !== null
              ? `opLabel.fontFamily: "${formatNullValue(node.opLabelFontFamily)}" `
              : "",
          );

          out.push(
            node.opLabelFontSize !== undefined && node.opLabelFontSize !== null
              ? `opLabel.fontSize: ${node.opLabelFontSize} `
              : "",
          );

          out.push(
            node.opLabelFontWeight
              ? `opLabel.fontWeight: ${node.opLabelFontWeight.number} `
              : "",
          );

          out.push(
            node.opLabelFontStyle
              ? `opLabel.fontStyle: ${node.opLabelFontStyle} `
              : "",
          );

          out.push(
            node.opLabelSubtext !== undefined && node.opLabelSubtext !== null
              ? `opLabel.subtext: "${formatNullValue(node.opLabelSubtext)}" `
              : "",
          );

          if (node.annotations) {
            for (const annotation of node.annotations) {
              if (annotation.value !== undefined && annotation.value !== null) {
                out.push(
                  `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `,
                );

                out.push(
                  annotation.shiftLeft !== undefined &&
                    annotation.shiftLeft !== null
                    ? `.shift.left: ${annotation.shiftLeft} `
                    : "",
                );
                out.push(
                  annotation.shiftRight !== undefined &&
                    annotation.shiftRight !== null
                    ? `.shift.right: ${annotation.shiftRight} `
                    : "",
                );

                out.push(
                  annotation.shiftBottom !== undefined &&
                    annotation.shiftBottom !== null
                    ? `.shift.bottom: ${annotation.shiftBottom} `
                    : "",
                );
                out.push(
                  annotation.shiftTop !== undefined &&
                    annotation.shiftTop !== null
                    ? `.shift.top: ${annotation.shiftTop} `
                    : "",
                );
              }
            }
          }

          out.push(
            node.annotationGap !== undefined && node.annotationGap !== null
              ? `annotation.gap: ${node.annotationGap} `
              : "",
          );

          out.push(
            node.annotationFontFamily !== undefined &&
              node.annotationFontFamily !== null
              ? `annotation.fontFamily: "${formatNullValue(node.annotationFontFamily)}" `
              : "",
          );

          out.push(
            node.annotationFontSize !== undefined &&
              node.annotationFontSize !== null
              ? `annotation.fontSize: ${node.annotationFontSize} `
              : "",
          );

          out.push(
            node.annotationFontWeight
              ? `annotation.fontWeight: ${node.annotationFontWeight.number} `
              : "",
          );
          out.push(
            node.annotationFontStyle
              ? `annotation.fontStyle: ${node.annotationFontStyle} `
              : "",
          );
          out.push(
            node.annotationFontColor !== undefined &&
              node.annotationFontColor !== null
              ? `annotation.fontColor: "${formatNullValue(node.annotationFontColor)}" `
              : "",
          );

          out.push(node.size ? `size: (${node.size[0]},${node.size[1]}) ` : "");

          if (node.type === "rect") {
            out.push(node.shape ? `shape: ${node.shape} ` : "");
          }

          out.push(
            node.color !== undefined && node.color !== null
              ? node.type === "flatten"
                ? `color: "${formatNullValue(node.color[0])}" `
                : node.type === "fullyConnected"
                  ? `color: {${node.color[0].map((value) => JSON.stringify(formatNullValue(value))).join(", ")}}`
                  : `color: "${formatNullValue(node.color)}" `
              : "",
          );

          out.push(
            node.strokeColor !== undefined && node.strokeColor !== null
              ? `stroke.color: "${formatNullValue(node.strokeColor)}" `
              : "",
          );
          out.push(
            node.strokeStyle ? `stroke.style: ${node.strokeStyle} ` : "",
          );
          out.push(
            node.strokeWidth !== undefined && node.strokeWidth !== null
              ? `stroke.width: ${node.strokeWidth} `
              : "",
          );
          out.push(
            node.outerStrokeColor !== undefined &&
              node.outerStrokeColor !== null
              ? `outerStroke.color: "${formatNullValue(node.outerStrokeColor)}" `
              : "",
          );
          out.push(
            node.outerStrokeStyle
              ? `outerStroke.style: ${node.outerStrokeStyle} `
              : "",
          );
          out.push(
            node.outerStrokeWidth !== undefined &&
              node.outerStrokeWidth !== null
              ? `outerStroke.width: ${node.outerStrokeWidth} `
              : "",
          );
          out.push(
            node.direction !== undefined && node.direction !== null
              ? `direction: ${node.direction} `
              : "",
          );
          out.push("\n");
        }
      }
    }

    if (block.edges) {
      if (block.hidden === undefined) {
        out.push("\nedges\n");
      }
      for (const edge of block.edges) {
        if (block.hidden === undefined && edge.hidden === undefined) {
          out.push(
            `${edge.id.name}: ${edge.from.edge?.name ?? edge.from.node.name}.${edge.from.edgeAnchor ?? edge.from.nodeAnchor}`,
          );

          out.push(
            edge.from.portIndex !== undefined && edge.from.portIndex !== null
              ? `[${edge.from.portIndex.number}]`
              : "",
          );

          out.push(" -> ");
          out.push(
            `${edge.to.edge?.name ?? edge.to.node.name}.${edge.to.edgeAnchor ?? edge.to.nodeAnchor}`,
          );

          out.push(
            edge.to.portIndex !== undefined && edge.to.portIndex !== null
              ? `[${edge.to.portIndex.number}] `
              : " ",
          );

          out.push(
            edge.labelText !== undefined && edge.labelText !== null
              ? `label.text: "${formatNullValue(edge.labelText)}" `
              : "",
          );

          out.push(
            edge.labelFontColor !== undefined && edge.labelFontColor !== null
              ? `label.fontColor: "${formatNullValue(edge.labelFontColor)}" `
              : "",
          );

          out.push(
            edge.labelFontFamily !== undefined && edge.labelFontFamily !== null
              ? `label.fontFamily: "${formatNullValue(edge.labelFontFamily)}" `
              : "",
          );

          out.push(
            edge.labelFontSize !== undefined && edge.labelFontSize !== null
              ? `label.fontSize: ${edge.labelFontSize} `
              : "",
          );

          out.push(
            edge.labelFontWeight !== undefined && edge.labelFontWeight !== null
              ? `label.fontWeight: ${edge.labelFontWeight.number} `
              : "",
          );

          out.push(
            edge.labelFontStyle !== undefined && edge.labelFontStyle !== null
              ? `label.fontStyle: ${edge.labelFontStyle} `
              : "",
          );

          out.push(
            edge.labelShiftLeft !== undefined && edge.labelShiftLeft !== null
              ? `label.shift.left: ${edge.labelShiftLeft} `
              : "",
          );

          out.push(
            edge.labelShiftRight !== undefined && edge.labelShiftRight !== null
              ? `label.shift.right: ${edge.labelShiftRight} `
              : "",
          );

          out.push(
            edge.labelShiftTop !== undefined && edge.labelShiftTop !== null
              ? `label.shift.top: ${edge.labelShiftTop} `
              : "",
          );

          out.push(
            edge.labelShiftBottom !== undefined &&
              edge.labelShiftBottom !== null
              ? `label.shift.bottom: ${edge.labelShiftBottom} `
              : "",
          );

          out.push(edge.shape ? `shape: ${edge.shape} ` : "");
          out.push(edge.style ? `style: ${edge.style} ` : "");
          out.push(edge.transition ? `transition: ${edge.transition} ` : "");
          out.push(
            edge.color !== undefined && edge.color !== null
              ? `color: "${formatNullValue(edge.color)}" `
              : "",
          );

          out.push(
            edge.arrowheads ? `arrowheads: ${edge.arrowheads.number} ` : "",
          );
          out.push(
            edge.gap !== undefined && edge.gap !== null
              ? `gap: ${edge.gap} `
              : "",
          );

          out.push(
            edge.alignToIndexedPort !== undefined &&
              edge.alignToIndexedPort !== null
              ? `alignToIndexedPort: ${edge.alignToIndexedPort} `
              : "",
          );
          if (edge.edgeAnchorOffset) {
            out.push(
              edge.edgeAnchorOffset[0] !== undefined &&
                edge.edgeAnchorOffset[0] !== null
                ? `fromEdgeAnchorOffset: ${edge.edgeAnchorOffset[0]} `
                : "",
            );

            out.push(
              edge.edgeAnchorOffset[1] !== undefined &&
                edge.edgeAnchorOffset[1] !== null
                ? `toEdgeAnchorOffset: ${edge.edgeAnchorOffset[1]} `
                : "",
            );
          }

          out.push(
            edge.curveHeight !== undefined && edge.curveHeight !== null
              ? `curveHeight: ${edge.curveHeight} `
              : "",
          );

          out.push(
            edge.width !== undefined && edge.width !== null
              ? `width: ${edge.width} `
              : "",
          );

          out.push(
            edge.bidirectional !== undefined && edge.bidirectional !== null
              ? `bidirectional: ${edge.bidirectional} `
              : "",
          );

          out.push(
            edge.headOnly !== undefined && edge.headOnly !== null
              ? `headOnly: ${edge.headOnly} `
              : "",
          );

          out.push("\n");
        }
      }
    }

    if (block.groups) {
      if (block.hidden === undefined) {
        out.push("\ngroups\n");
      }
      for (const group of block.groups) {
        if (block.hidden === undefined && group.hidden === undefined) {
          out.push(`${group.id.name}: `);
        }

        if (group.members) {
          for (const member of group.members) {
            if (
              block.hidden === undefined &&
              member.hidden === undefined &&
              group.hidden === undefined
            ) {
              out.push(`${member.name} `);
            }
          }
        }

        if (block.hidden === undefined && group.hidden === undefined) {
          out.push(group.layout ? `layout: ${group.layout} ` : "");
          /*if (group.anchor?.hidden === undefined) {
            out.push(group.anchor ? `anchor: ${group.anchor.name} ` : "");
          }*/

          out.push(
            group.anchorSource
              ? `anchor.source: ${group.anchorSource.name} `
              : "",
          );

          out.push(
            group.anchorTarget
              ? `anchor.target: ${group.anchorTarget.name} `
              : "",
          );

          out.push(
            group.gap !== undefined && group.gap !== null
              ? `gap: ${group.gap} `
              : "",
          );
          out.push(
            group.color !== undefined && group.color !== null
              ? `color: "${formatNullValue(group.color)}" `
              : "",
          );

          out.push(
            group.colorBoxAdjustments
              ? `colorBoxAdjustments: (${group.colorBoxAdjustments[0]},${group.colorBoxAdjustments[1]},${group.colorBoxAdjustments[2]},${group.colorBoxAdjustments[3]}) `
              : "",
          );

          out.push(
            group.strokeColor !== undefined && group.strokeColor !== null
              ? `stroke.color: "${formatNullValue(group.strokeColor)}" `
              : "",
          );
          out.push(
            group.strokeStyle ? `stroke.style: ${group.strokeStyle} ` : "",
          );
          out.push(
            group.strokeWidth !== undefined && group.strokeWidth !== null
              ? `stroke.width: ${group.strokeWidth} `
              : "",
          );

          out.push(group.markerType ? `marker.type: ${group.markerType} ` : "");

          out.push(
            group.markerColor !== undefined && group.markerColor !== null
              ? `marker.color: "${group.markerColor}" `
              : "",
          );

          out.push(
            group.markerPosition
              ? `marker.position: ${group.markerPosition} `
              : "",
          );

          out.push(
            group.markerLabelText !== undefined &&
              group.markerLabelText !== null
              ? `marker.text: "${formatNullValue(group.markerLabelText)}" `
              : "",
          );

          out.push(
            group.markerLabelFontColor !== undefined &&
              group.markerLabelFontColor !== null
              ? `marker.fontColor: "${formatNullValue(group.markerLabelFontColor)}" `
              : "",
          );

          out.push(
            group.markerLabelFontFamily !== undefined &&
              group.markerLabelFontFamily !== null
              ? `marker.fontFamily: "${formatNullValue(group.markerLabelFontFamily)}" `
              : "",
          );

          out.push(
            group.markerLabelFontSize !== undefined &&
              group.markerLabelFontSize !== null
              ? `marker.fontSize: ${group.markerLabelFontSize} `
              : "",
          );

          out.push(
            group.markerLabelFontWeight
              ? `marker.fontWeight: ${group.markerLabelFontWeight.number} `
              : "",
          );

          out.push(
            group.markerLabelFontStyle
              ? `marker.fontStyle: ${group.markerLabelFontStyle} `
              : "",
          );

          out.push(
            group.markerLeft !== undefined && group.markerLeft !== null
              ? `marker.left: ${group.markerLeft} `
              : "",
          );

          out.push(
            group.markerRight !== undefined && group.markerRight !== null
              ? `marker.right: ${group.markerRight} `
              : "",
          );

          out.push(
            group.markerBottom !== undefined && group.markerBottom !== null
              ? `marker.bottom: ${group.markerBottom} `
              : "",
          );

          out.push(
            group.markerTop !== undefined && group.markerTop !== null
              ? `marker.top: ${group.markerTop} `
              : "",
          );

          if (group.annotations) {
            for (const annotation of group.annotations) {
              if (annotation.value !== undefined && annotation.value !== null) {
                out.push(
                  `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `,
                );

                out.push(
                  annotation.shiftLeft !== undefined &&
                    annotation.shiftLeft !== null
                    ? `.shift.left: ${annotation.shiftLeft} `
                    : "",
                );
                out.push(
                  annotation.shiftRight !== undefined &&
                    annotation.shiftRight !== null
                    ? `.shift.right: ${annotation.shiftRight} `
                    : "",
                );

                out.push(
                  annotation.shiftBottom !== undefined &&
                    annotation.shiftBottom !== null
                    ? `.shift.bottom: ${annotation.shiftBottom} `
                    : "",
                );
                out.push(
                  annotation.shiftTop !== undefined &&
                    annotation.shiftTop !== null
                    ? `.shift.top: ${annotation.shiftTop} `
                    : "",
                );
              }
            }
          }

          out.push(
            group.annotationGap !== undefined && group.annotationGap !== null
              ? `annotation.gap: ${group.annotationGap} `
              : "",
          );

          out.push(
            group.annotationFontFamily !== undefined &&
              group.annotationFontFamily !== null
              ? `annotation.fontFamily: "${formatNullValue(group.annotationFontFamily)}" `
              : "",
          );

          out.push(
            group.annotationFontSize !== undefined &&
              group.annotationFontSize !== null
              ? `annotation.fontSize: ${group.annotationFontSize} `
              : "",
          );

          out.push(
            group.annotationFontWeight !== undefined &&
              group.annotationFontWeight !== null
              ? `annotation.fontWeight: ${group.annotationFontWeight.number} `
              : "",
          );
          out.push(
            group.annotationFontStyle !== undefined &&
              group.annotationFontStyle !== null
              ? `annotation.fontStyle: ${group.annotationFontStyle} `
              : "",
          );
          out.push(
            group.annotationFontColor !== undefined &&
              group.annotationFontColor !== null
              ? `annotation.fontColor: "${formatNullValue(group.annotationFontColor)}" `
              : "",
          );

          out.push(
            group.align !== undefined && group.align !== null
              ? `align: ${group.align} `
              : "",
          );

          out.push(group.shape ? `shape: ${group.shape} ` : "");

          out.push(
            group.shiftLeft !== undefined && group.shiftLeft !== null
              ? `shift.left: ${group.shiftLeft} `
              : "",
          );
          out.push(
            group.shiftRight !== undefined && group.shiftRight !== null
              ? `shift.right: ${group.shiftRight} `
              : "",
          );

          out.push(
            group.shiftBottom !== undefined && group.shiftBottom !== null
              ? `shift.bottom: ${group.shiftBottom} `
              : "",
          );
          out.push(
            group.shiftTop !== undefined && group.shiftTop !== null
              ? `shift.top: ${group.shiftTop} `
              : "",
          );

          out.push("\n");
        }
      }
    }

    if (block.hidden === undefined) {
      out.push("\n");
    }
  }

  if (blockComponent.body.diagram) {
    const diagram = blockComponent.body.diagram;
    out.push("diagram\n");
    out.push(diagram.layout ? `layout: ${diagram.layout}\n` : "");
    out.push(
      diagram.gap !== undefined && diagram.gap !== null
        ? `gap: ${diagram.gap}\n`
        : "",
    );

    out.push(
      diagram.rotateRight ? `rotateRight: ${diagram.rotateRight.number}\n` : "",
    );
    out.push(diagram.uses ? "use: " : "");

    if (diagram.uses) {
      for (const use of diagram.uses) {
        if (use.hidden === undefined) {
          out.push(`${use.id.name}: ${use.block.name} `);
          out.push(use.anchor ? `anchor: ${use.anchor.name} ` : "");
        }
      }
    }

    out.push("\n");

    out.push(diagram.connects ? "connect: " : "");

    if (diagram.connects) {
      for (const connect of diagram.connects) {
        if (connect.hidden === undefined) {
          out.push(
            `${connect.from.block.name}.${connect.from.edge?.name ?? connect.from.node.name}.${connect.from.edgeAnchor ?? connect.from.nodeAnchor}`,
          );

          out.push(
            connect.from.portIndex !== undefined
              ? connect.from.portIndex !== null
                ? `[${connect.from.portIndex.number}]`
                : ""
              : "",
          );
          out.push(" -> ");
          out.push(
            `${connect.to.block.name}.${connect.to.edge?.name ?? connect.to.node.name}.${connect.to.edgeAnchor ?? connect.to.nodeAnchor}`,
          );

          out.push(
            connect.to.portIndex !== undefined
              ? connect.to.portIndex !== null
                ? `[${connect.to.portIndex.number}] `
                : " "
              : "",
          );
          out.push(connect.shape ? `shape: ${connect.shape} ` : "");
          out.push(connect.style ? `style: ${connect.style} ` : "");
          out.push(
            connect.transition ? `transition: ${connect.transition} ` : "",
          );
          out.push(
            connect.color !== undefined && connect.color !== null
              ? `color: "${formatNullValue(connect.color)}" `
              : "",
          );
          out.push(
            connect.labelText !== undefined && connect.labelText !== null
              ? `label.text: "${formatNullValue(connect.labelText)}" `
              : "",
          );

          out.push(
            connect.labelFontColor !== undefined &&
              connect.labelFontColor !== null
              ? `label.fontColor: "${formatNullValue(connect.labelFontColor)}" `
              : "",
          );

          out.push(
            connect.labelFontFamily !== undefined &&
              connect.labelFontFamily !== null
              ? `label.fontFamily: "${formatNullValue(connect.labelFontFamily)}" `
              : "",
          );

          out.push(
            connect.labelFontSize !== undefined &&
              connect.labelFontSize !== null
              ? `label.fontSize: ${connect.labelFontSize} `
              : "",
          );

          out.push(
            connect.labelFontWeight !== undefined &&
              connect.labelFontWeight !== null
              ? `label.fontWeight: ${connect.labelFontWeight.number} `
              : "",
          );

          out.push(
            connect.labelFontStyle !== undefined &&
              connect.labelFontStyle !== null
              ? `label.fontStyle: ${connect.labelFontStyle} `
              : "",
          );

          out.push(
            connect.labelShiftLeft !== undefined &&
              connect.labelShiftLeft !== null
              ? `label.shift.left: ${connect.labelShiftLeft} `
              : "",
          );

          out.push(
            connect.labelShiftRight !== undefined &&
              connect.labelShiftRight !== null
              ? `label.shift.right: ${connect.labelShiftRight} `
              : "",
          );

          out.push(
            connect.labelShiftTop !== undefined &&
              connect.labelShiftTop !== null
              ? `label.shift.top: ${connect.labelShiftTop} `
              : "",
          );

          out.push(
            connect.labelShiftBottom !== undefined &&
              connect.labelShiftBottom !== null
              ? `label.shift.bottom: ${connect.labelShiftBottom} `
              : "",
          );

          out.push(
            connect.arrowheads
              ? `arrowheads: ${connect.arrowheads.number} `
              : "",
          );

          out.push(
            connect.gap !== undefined && connect.gap !== null
              ? `gap: ${connect.gap} `
              : "",
          );

          out.push(
            connect.alignToIndexedPort !== undefined &&
              connect.alignToIndexedPort !== null
              ? `alignToIndexedPort: ${connect.alignToIndexedPort} `
              : "",
          );

          if (connect.edgeAnchorOffset) {
            out.push(
              connect.edgeAnchorOffset[0] !== undefined &&
                connect.edgeAnchorOffset[0] !== null
                ? `fromEdgeAnchorOffset: ${connect.edgeAnchorOffset[0]} `
                : "",
            );

            out.push(
              connect.edgeAnchorOffset[1] !== undefined &&
                connect.edgeAnchorOffset[1] !== null
                ? `toEdgeAnchorOffset: ${connect.edgeAnchorOffset[1]} `
                : "",
            );
          }

          out.push(
            connect.curveHeight !== undefined && connect.curveHeight !== null
              ? `curveHeight: ${connect.curveHeight} `
              : "",
          );

          out.push(
            connect.width !== undefined && connect.width !== null
              ? `width: ${connect.width} `
              : "",
          );

          out.push(
            connect.bidirectional !== undefined &&
              connect.bidirectional !== null
              ? `bidirectional: ${connect.bidirectional} `
              : "",
          );

          out.push(
            connect.headOnly !== undefined && connect.headOnly !== null
              ? `headOnly: ${connect.headOnly} `
              : "",
          );
        }
      }
    }

    if (diagram.annotations) {
      for (const annotation of diagram.annotations) {
        if (annotation.value !== undefined && annotation.value !== null) {
          out.push(
            `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `,
          );

          out.push(
            annotation.shiftLeft !== undefined && annotation.shiftLeft !== null
              ? `.shift.left: ${annotation.shiftLeft} `
              : "",
          );
          out.push(
            annotation.shiftRight !== undefined &&
              annotation.shiftRight !== null
              ? `.shift.right: ${annotation.shiftRight} `
              : "",
          );

          out.push(
            annotation.shiftBottom !== undefined &&
              annotation.shiftBottom !== null
              ? `.shift.bottom: ${annotation.shiftBottom} `
              : "",
          );
          out.push(
            annotation.shiftTop !== undefined && annotation.shiftTop !== null
              ? `.shift.top: ${annotation.shiftTop} `
              : "",
          );
        }
      }
    }

    out.push(
      diagram.annotationGap !== undefined && diagram.annotationGap !== null
        ? `annotation.gap: ${diagram.annotationGap} `
        : "",
    );

    out.push(
      diagram.annotationFontFamily !== undefined &&
        diagram.annotationFontFamily !== null
        ? `annotation.fontFamily: "${formatNullValue(diagram.annotationFontFamily)}" `
        : "",
    );

    out.push(
      diagram.annotationFontSize !== undefined &&
        diagram.annotationFontSize !== null
        ? `annotation.fontSize: ${diagram.annotationFontSize} `
        : "",
    );

    out.push(
      diagram.annotationFontWeight !== undefined &&
        diagram.annotationFontWeight !== null
        ? `annotation.fontWeight: ${diagram.annotationFontWeight.number} `
        : "",
    );
    out.push(
      diagram.annotationFontStyle !== undefined &&
        diagram.annotationFontStyle !== null
        ? `annotation.fontStyle: ${diagram.annotationFontStyle} `
        : "",
    );
    out.push(
      diagram.annotationFontColor !== undefined &&
        diagram.annotationFontColor !== null
        ? `annotation.fontColor: "${formatNullValue(diagram.annotationFontColor)}" `
        : "",
    );

    out.push("\n");
  }

  out.push("@\n");
  return out.join("");
}
