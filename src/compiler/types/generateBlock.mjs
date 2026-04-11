import { formatPositionForOutput } from "../../utils/positionUtils.mjs";
import { formatNullValue } from "../compiler.mjs";

export function generateBlock(blockComponent, layout = [3, 3]) {
  let result = "architecture\n";
  const blocks = new Map();
  const diagramUseId = new Map();

  const NODE_ALLOWED_FIELDS_BY_TYPE = {
    text: new Set([
      "type",
      "label",
      "labelOrientation",
      "labelSubtext",
      "color",
      "annotations",
      "opLabel",
      "opLabelSubtext",
    ]),
    rect: new Set([
      "type",
      "label",
      "labelOrientation",
      "labelSubtext",
      "size",
      "style",
      "color",
      "stroke",
      "annotations",
      "opLabel",
      "opLabelSubtext",
    ]),
    circle: new Set([
      "type",
      "label",
      "labelOrientation",
      "labelSubtext",
      "size",
      "style",
      "color",
      "stroke",
      "annotations",
      "opLabel",
      "opLabelSubtext",
    ]),
    stacked: new Set([
      "type",
      "shape",
      "kernelSize",
      "label",
      "labelSubtext",
      "opLabel",
      "opLabelSubtext",
      "color",
      "annotations",
      "size",
    ]),
    flatten: new Set([
      "type",
      "shape",
      "label",
      "labelSubtext",
      "opLabel",
      "opLabelSubtext",
      "color",
      "annotations",
      "size",
    ]),
    fullyConnected: new Set([
      "type",
      "shape",
      "label",
      "labelSubtext",
      "opLabel",
      "opLabelSubtext",
      "color",
      "outputLabels",
      "annotations",
      "size",
    ]),
  };

  function getPresentNodeFields(node) {
    const present = [];

    if (node.type !== undefined && node.type !== null) present.push("type");
    if (node.label !== undefined && node.label !== null) present.push("label");
    if (node.labelSubtext !== undefined && node.labelSubtext !== null)
      present.push("labelSubtext");
    if (node.labelOrientation !== undefined && node.labelOrientation !== null) {
      present.push("labelOrientation");
    }
    if (node.size !== undefined && node.size !== null) present.push("size");
    if (node.style !== undefined && node.style !== null) present.push("style");
    if (node.color !== undefined && node.color !== null) present.push("color");
    if (node.stroke !== undefined && node.stroke !== null)
      present.push("stroke");
    if (node.annotations !== undefined && node.annotations !== null)
      present.push("annotations");
    if (node.opLabel !== undefined && node.opLabel !== null)
      present.push("opLabel");
    if (node.opLabelSubtext !== undefined && node.opLabelSubtext !== null) {
      present.push("opLabelSubtext");
    }
    if (node.shape !== undefined && node.shape !== null) present.push("shape");
    if (node.kernelSize !== undefined && node.kernelSize !== null)
      present.push("kernelSize");
    if (node.outputLabels !== undefined && node.outputLabels !== null)
      present.push("outputLabels");

    return present;
  }

  function validateNodeFields(node) {
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
  }

  result += formatPositionForOutput(blockComponent.position, layout);
  result += blockComponent.body.title
    ? `title: "${blockComponent.body.title}"\n`
    : "";

  result += "@\n";

  for (const block of blockComponent.body.blocks ?? []) {
    if (block.hidden === undefined) {
      result += `block ${block.id.name}\n`;
    }

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

    if (block.hidden === undefined) {
      result += block.layout ? `layout: ${block.layout}\n` : "";
      result += block.gap ? `gap: ${block.gap}\n` : "";
      result += block.color ? `color: "${block.color}"\n` : "";
      result += block.style ? `style: ${block.style}\n` : "";
      if (block.annotations) {
        for (const annotation of block.annotations) {
          result += annotation.value
            ? `annotation.${annotation.side}: "${annotation.value}"\n`
            : "";
        }
      }
    }

    if (block.nodes) {
      if (block.hidden === undefined) {
        result += "\nnodes\n";
      }
      for (const node of block.nodes) {
        if (!blocks.get(block.id.name).nodes.has(node.id.name)) {
          blocks.get(block.id.name).nodes.add(node.id.name);
        } else {
          throw new Error(
            `Duplicated node ID: ${node.id.name} at line ${node.id.line}, column ${node.id.col}.`,
          );
        }

        if (block.hidden === undefined && node.hidden === undefined) {
          validateNodeFields(node);
          if (
            node.type === "text" ||
            node.type === "rect" ||
            node.type === "circle"
          ) {
            result += `${node.type} ${node.id.name} `;

            result += node.label
              ? `label: "${formatNullValue(node.label[0])}" `
              : "";
            result += node.labelOrientation
              ? `label.orientation: ${node.labelOrientation} `
              : "";
            result += node.labelSubtext
              ? `labelSubtext: "${formatNullValue(node.labelSubtext[0])}" `
              : "";

            result += node.opLabel
              ? `opLabel: "${formatNullValue(node.opLabel[0])}" `
              : "";
            result += node.opLabelSubtext
              ? `opLabelSubtext: "${formatNullValue(node.opLabelSubtext[0])}" `
              : "";

            if (node.annotations) {
              for (const annotation of node.annotations) {
                result += `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `;
              }
            }
            result += node.size
              ? `size: (${node.size[0]},${node.size[1]}) `
              : "";
            result += node.style ? `style: ${node.style} ` : "";
            result += node.color
              ? `color: "${formatNullValue(node.color[0])}" `
              : "";
            result += node.stroke
              ? `stroke: "${formatNullValue(node.stroke[0])}" `
              : "";
            result += "\n";
          } else if (
            node.type === "flatten" ||
            node.type === "fullyConnected"
          ) {
            result += `${node.type} ${node.id.name} `;

            if (node.shape === undefined || node.shape === null) {
              throw new Error(
                `Invalid node "${node.id.name}" at line ${node.id.line}, column ${node.id.col} — required field "shape" is missing.`,
              );
            }
            const shapeTextFullyConnected = node.outputLabels
              ? `shape: {${node.shape[0].join(", ")}: {${node.outputLabels.map((x) => JSON.stringify(formatNullValue(x))).join(", ")}}} `
              : `shape: {${node.shape[0].join(", ")}}`;

            result += node.shape
              ? node.type === "flatten"
                ? `shape: ${node.shape[0][0]}x${node.shape[0][1]} `
                : shapeTextFullyConnected
              : "";

            result += node.label
              ? `label: "${formatNullValue(node.label[0])}" `
              : "";

            result += node.labelSubtext
              ? `labelSubtext: "${formatNullValue(node.labelSubtext[0])}" `
              : "";

            result += node.opLabel
              ? `opLabel: "${formatNullValue(node.opLabel[0])}" `
              : "";

            result += node.opLabelSubtext
              ? `opLabelSubtext: "${formatNullValue(node.opLabelSubtext[0])}" `
              : "";

            if (node.annotations) {
              for (const annotation of node.annotations) {
                result += `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `;
              }
            }
            result += node.size
              ? `size: (${node.size[0]},${node.size[1]}) `
              : "";

            result += node.color
              ? node.type === "flatten"
                ? `color: "${formatNullValue(node.color[0])}" `
                : `color: {${node.color[0].map((value) => JSON.stringify(formatNullValue(value))).join(", ")}}`
              : "";

            result += "\n";
          } else {
            result += `${node.type} ${node.id.name} `;

            if (node.shape === undefined || node.shape === null) {
              throw new Error(
                `Invalid node "${node.id.name}" at line ${node.id.line}, column ${node.id.col} — required field "shape" is missing.`,
              );
            }

            result += node.shape
              ? `shape: ${node.shape[0][0]}x${node.shape[0][1]}x${node.shape[0][2]} `
              : "";
            result += node.kernelSize
              ? `kernelSize: ${node.kernelSize[0]}x${node.kernelSize[1]} `
              : "";
            result += node.label
              ? `label: "${formatNullValue(node.label[0])}" `
              : "";

            result += node.labelSubtext
              ? `labelSubtext: "${formatNullValue(node.labelSubtext[0])}" `
              : "";

            result += node.opLabel
              ? `opLabel: "${formatNullValue(node.opLabel[0])}" `
              : "";

            result += node.opLabelSubtext
              ? `opLabelSubtext: "${formatNullValue(node.opLabelSubtext[0])}" `
              : "";

            if (node.annotations) {
              for (const annotation of node.annotations) {
                result += `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `;
              }
            }
            result += node.size
              ? `size: (${node.size[0]},${node.size[1]}) `
              : "";
            result += node.color
              ? `color: "${formatNullValue(node.color[0])}" `
              : "";
            result += "\n";
          }
        }
      }
    }

    if (block.edges) {
      if (block.hidden === undefined) {
        result += "\nedges\n";
      }
      for (const edge of block.edges) {
        if (!blocks.get(block.id.name).edges.has(edge.id.name)) {
          blocks.get(block.id.name).edges.add(edge.id.name);
        } else {
          throw new Error(
            `Duplicated edge ID: ${edge.id.name} at line ${edge.id.line}, column ${edge.id.col}.`,
          );
        }
        if (edge.from.edge?.name === edge.id.name) {
          throw new Error(
            `Invalid edge reference: edge "${edge.from.edge.name}" references itself at line ${edge.from.edge.line}, column ${edge.from.edge.col}.`,
          );
        }

        if (edge.to.edge?.name === edge.id.name) {
          throw new Error(
            `Invalid edge reference: edge "${edge.to.edge.name}" references itself at line ${edge.to.edge.line}, column ${edge.to.edge.col}.`,
          );
        }
        if (edge.from.edge?.name !== undefined) {
          if (!blocks.get(block.id.name).edges.has(edge.from.edge.name)) {
            const blockEdges = blocks.get(block.id.name).edges;
            const valid = [...blockEdges].join(", ");
            throw new Error(
              `Unknown edge "${edge.from.edge.name}" at line ${edge.from.edge.line}, column ${edge.from.edge.col}. 
Edge "${edge.from.edge.name}" has not been defined in block ${block.id.name} edges.
Available edges: ${valid === "" ? "none" : valid}}.`,
            );
          }
        }

        if (edge.from.node?.name !== undefined) {
          if (!blocks.get(block.id.name).nodes.has(edge.from.node.name)) {
            const blockNodes = blocks.get(block.id.name).nodes;
            const valid = [...blockNodes].join(", ");
            throw new Error(
              `Unknown node "${edge.from.node.name}" at line ${edge.from.node.line}, column ${edge.from.node.col}. 
Node "${edge.from.node.name}" has not been defined in block ${block.id.name} nodes.
Available nodes: ${valid === "" ? "none" : valid}.`,
            );
          }
        }

        if (edge.to.edge?.name !== undefined) {
          if (!blocks.get(block.id.name).edges.has(edge.to.edge.name)) {
            const blockEdges = blocks.get(block.id.name).edges;
            const valid = [...blockEdges].join(", ");
            throw new Error(
              `Unknown edge "${edge.to.edge.name}" at line ${edge.to.edge.line}, column ${edge.to.edge.col}. 
Edge "${edge.to.edge.name}" has not been defined in block ${block.id.name} edges.
Available edges: ${valid === "" ? "none" : valid}.`,
            );
          }
        }

        if (edge.to.node?.name !== undefined) {
          if (!blocks.get(block.id.name).nodes.has(edge.to.node.name)) {
            const blockNodes = blocks.get(block.id.name).nodes;
            const valid = [...blockNodes].join(", ");
            throw new Error(
              `Unknown node "${edge.to.node.name}" at line ${edge.to.node.line}, column ${edge.to.node.col}. 
Node "${edge.to.node.name}" has not been defined in block ${block.id.name} nodes.
Available nodes: ${valid === "" ? "none" : valid}.`,
            );
          }
        }

        blocks.get(block.id.name).edges.add(edge.id.name);

        if (block.hidden === undefined && edge.hidden === undefined) {
          result += `${edge.id.name}: ${edge.from.edge?.name ?? edge.from.node.name}.${edge.from.edgeAnchor ?? edge.from.nodeAnchor}`;
          if (edge.from.portIndex) {
            if (
              edge.from.portIndex.number < 0 ||
              edge.from.portIndex.number > 4
            ) {
              throw new Error(
                `Invalid portIndex value at line ${edge.from.portIndex.line}, column ${edge.from.portIndex.col} — expected 0, 1, 2, 3 or 4.`,
              );
            }
          }
          result +=
            edge.from.portIndex !== undefined && edge.from.portIndex !== null
              ? `[${edge.from.portIndex.number}]`
              : "";

          result += " -> ";
          result += `${edge.to.edge?.name ?? edge.to.node.name}.${edge.to.edgeAnchor ?? edge.to.nodeAnchor}`;

          if (edge.to.portIndex) {
            if (edge.to.portIndex.number < 0 || edge.to.portIndex.number > 4) {
              throw new Error(
                `Invalid portIndex value at line ${edge.to.portIndex.line}, column ${edge.to.portIndex.col} — expected 0, 1, 2, 3 or 4.`,
              );
            }
          }
          result +=
            edge.to.portIndex !== undefined && edge.to.portIndex !== null
              ? `[${edge.to.portIndex.number}] `
              : " ";

          result += edge.label
            ? `label: "${formatNullValue(edge.label)}" `
            : "";
          result += edge.style ? `style: ${edge.style} ` : "";
          result += edge.transition ? `transition: ${edge.transition} ` : "";
          result += edge.color
            ? `color: "${formatNullValue(edge.color)}" `
            : "";
          if (edge.arrowheads) {
            if (edge.arrowheads.number < 0 || edge.arrowheads.number > 3) {
              throw new Error(
                `Invalid arrowheads value at line ${edge.arrowheads.line}, column ${edge.arrowheads.col} — expected 0, 1, 2 or 3`,
              );
            }
          }
          result += edge.arrowheads
            ? `arrowheads: ${edge.arrowheads.number} `
            : "";
          result += edge.gap ? `gap: ${edge.gap} ` : "";
          result += "\n";
        }
      }
    }

    if (block.groups) {
      if (block.hidden === undefined) {
        result += "\ngroups\n";
      }
      for (const group of block.groups) {
        if (block.hidden === undefined && group.hidden === undefined) {
          result += `${group.id.name}: `;
        }

        if (!blocks.get(block.id.name).groups.has(group.id.name)) {
          blocks.get(block.id.name).groups.set(group.id.name, new Set());
        } else {
          throw new Error(
            `Duplicated group ID: ${group.id.name} at line ${group.id.line}, column ${group.id.col}.`,
          );
        }

        if (group.members) {
          const groupMemberNames = group.members.map((item) => item.name);
          const groupSet = blocks.get(block.id.name).groups.get(group.id.name);
          groupMemberNames.forEach((name) => groupSet.add(name));

          for (const member of group.members) {
            if (group.id.name === member.name) {
              throw new Error(
                `Invalid member reference: member "${member.name}" references itself at line ${member.line}, column ${member.col}.`,
              );
            }
            if (blocks.get(block.id.name).edges.has(member.name)) {
              const blockGroups = blocks.get(block.id.name).groups.keys();
              const blockNodes = blocks.get(block.id.name).nodes;
              const validGroups = [...blockGroups].join(", ");
              const validNodes = [...blockNodes].join(", ");
              throw new Error(
                `Invalid member "${member.name}" at line ${member.line}, column ${member.col}.
Members must be nodes or groups; edges are not allowed.
Available nodes: ${validNodes === "" ? "none" : validNodes}.
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
              );
            }
            if (
              !blocks.get(block.id.name).nodes.has(member.name) &&
              !blocks.get(block.id.name).groups.has(member.name)
            ) {
              const blockGroups = blocks
                .get(block.id.name)
                .groups.keys()
                .filter((item) => item !== group.id.name);

              const blockNodes = blocks.get(block.id.name).nodes;
              const validGroups = [...blockGroups].join(", ");
              const validNodes = [...blockNodes].join(", ");
              throw new Error(
                `Unknown member "${member.name}" at line ${member.line}, column ${member.col}. 
Member "${member.name}" has not been defined in block ${block.id.name} nodes or groups.
Available nodes: ${validNodes === "" ? "none" : validNodes}.
Available groups: ${validGroups === "" ? "none" : validGroups}.`,
              );
            }

            if (
              block.hidden === undefined &&
              member.hidden === undefined &&
              group.hidden === undefined
            ) {
              result += `${member.name} `;
            }
          }
        } else {
          throw new Error(
            `Members of group "${group.id.name}" in block "${block.id.name}" at line ${group.id.line}, column ${group.id.col} are not defined.`,
          );
        }

        if (group.anchor) {
          if (
            !blocks
              .get(block.id.name)
              .groups.get(group.id.name)
              .has(group.anchor.name)
          ) {
            const validMembers = [
              ...blocks.get(block.id.name).groups.get(group.id.name),
            ].join(", ");
            throw new Error(
              `Invalid Anchor "${group.anchor.name}" at line ${group.anchor.line}, column ${group.anchor.col}.
Anchor "${group.anchor.name}" must be one of the members: ${validMembers}.`,
            );
          }
        }

        if (block.hidden === undefined && group.hidden === undefined) {
          result += group.layout ? `layout: ${group.layout} ` : "";
          if (group.anchor?.hidden === undefined) {
            result += group.anchor ? `anchor: ${group.anchor.name} ` : "";
          }

          result += group.gap ? `gap: ${group.gap} ` : "";
          result += group.color
            ? `color: "${formatNullValue(group.color)}" `
            : "";
          result += group.stroke
            ? `stroke: "${formatNullValue(group.stroke)}" `
            : "";
          result += group.markerType ? `markerType: ${group.markerType} ` : "";
          result += group.markerLabel
            ? `markerLabel: "${formatNullValue(group.markerLabel[0])}" `
            : "";
          result += group.markerLabel
            ? `markerPosition: ${group.markerPosition} `
            : "";

          if (group.annotations) {
            for (const annotation of group.annotations) {
              result += annotation.value
                ? `annotation.${annotation.side}: "${formatNullValue(annotation.value)}" `
                : "";
            }
          }

          result += group.colorBoxSize
            ? `colorBoxSize: (${group.colorBoxSize[0]},${group.colorBoxSize[1]}) `
            : "";

          result += "\n";
        }
      }
    }

    if (block.hidden === undefined) {
      result += "\n";
    }
  }

  if (blockComponent.body.diagram) {
    const diagram = blockComponent.body.diagram;
    result += "diagram\n";
    result += diagram.layout ? `layout: ${diagram.layout}\n` : "";
    result +=
      diagram.gap !== undefined && diagram.gamp !== null
        ? `gap: ${diagram.gap}\n`
        : "";
    result += diagram.uses ? "use: " : "";

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

        if (use.hidden === undefined) {
          result += `${use.id.name}: ${use.block.name} `;
          result += use.anchor ? `anchor: ${use.anchor.name} ` : "";
        }
      }
    }

    result += "\n";

    result += diagram.connects ? "connect: " : "";

    if (diagram.connects) {
      for (const connect of diagram.connects) {
        if (!diagramUseId.has(connect.from.block.name)) {
          const validUseId = [...diagramUseId.keys()].join(", ");

          throw new Error(
            `Unknown use ID: "${connect.from.block.name}" at line ${connect.from.block.line}, column ${connect.from.block.col}. 
"${connect.from.block.name}" has not been defined in uses.
Available uses: ${validUseId === "" ? "none" : validUseId}.`,
          );
        } else {
          for (const blockName of diagramUseId.get(connect.from.block.name)) {
            if (connect.from.edge?.name !== undefined) {
              const edgeName = connect.from.edge?.name;
              if (!blocks.get(blockName).edges.has(edgeName)) {
                const valid = [...blocks.get(blockName).edges].join(", ");
                throw new Error(
                  `Unknown edge "${connect.from.edge.name}" at line ${connect.from.edge.line}, column ${connect.from.edge.col}. 
Edge "${connect.from.edge.name}" has not been defined in block ${blockName} edges.
Available edges: ${valid === "" ? "none" : valid}.`,
                );
              }
            }

            if (connect.from.node?.name !== undefined) {
              const nodeName = connect.from.node?.name;
              if (!blocks.get(blockName).nodes.has(nodeName)) {
                const valid = [...blocks.get(blockName).nodes].join(", ");
                throw new Error(
                  `Unknown node "${connect.from.node.name}" at line ${connect.from.node.line}, column ${connect.from.node.col}. 
Node "${connect.from.node.name}" has not been defined in block ${blockName} nodes.
Available nodes: ${valid === "" ? "none" : valid}.`,
                );
              }
            }
          }
        }

        if (!diagramUseId.has(connect.to.block.name)) {
          const validUseId = [...diagramUseId.keys()].join(", ");
          throw new Error(
            `Unknown use ID: "${connect.to.block.name}" at line ${connect.to.block.line}, column ${connect.to.block.col}. 
"${connect.to.block.name}" has not been defined in uses.
Available uses: ${validUseId === "" ? "none" : validUseId}.`,
          );
        } else {
          for (const blockName of diagramUseId.get(connect.to.block.name)) {
            if (connect.to.edge?.name !== undefined) {
              const edgeName = connect.to.edge?.name;
              if (!blocks.get(blockName).edges.has(edgeName)) {
                const valid = [...blocks.get(blockName).edges].join(", ");
                throw new Error(
                  `Unknown edge "${connect.to.edge.name}" at line ${connect.to.edge.line}, column ${connect.to.edge.col}. 
Edge "${connect.to.edge.name}" has not been defined in block ${blockName} edges.
Available edges: ${valid === "" ? "none" : valid}.`,
                );
              }
            }

            if (connect.to.node?.name !== undefined) {
              const nodeName = connect.to.node?.name;
              if (!blocks.get(blockName).nodes.has(nodeName)) {
                const valid = [...blocks.get(blockName).nodes].join(", ");
                throw new Error(
                  `Unknown node "${connect.to.node.name}" at line ${connect.to.node.line}, column ${connect.to.node.col}. 
Node "${connect.to.node.name}" has not been defined in block ${blockName} nodes.
Available nodes: ${valid === "" ? "none" : valid}.`,
                );
              }
            }
          }
        }

        if (connect.hidden === undefined) {
          result += `${connect.from.block.name}.${connect.from.edge?.name ?? connect.from.node.name}.${connect.from.edgeAnchor ?? connect.from.nodeAnchor}`;
          if (connect.from.portIndex) {
            if (
              connect.from.portIndex.number < 0 ||
              connect.from.portIndex.number > 4
            ) {
              throw new Error(
                `Invalid portIndex value at line ${connect.from.portIndex.line}, column ${connect.from.portIndex.col} — expected 0, 1, 2, 3 or 4.`,
              );
            }
          }
          result +=
            connect.from.portIndex !== undefined
              ? connect.from.portIndex !== null
                ? `[${connect.from.portIndex.number}]`
                : ""
              : "";
          result += " -> ";
          result += `${connect.to.block.name}.${connect.to.edge?.name ?? connect.to.node.name}.${connect.to.edgeAnchor ?? connect.to.nodeAnchor}`;

          if (connect.to.portIndex) {
            if (
              connect.to.portIndex.number < 0 ||
              connect.to.portIndex.number > 4
            ) {
              throw new Error(
                `Invalid portIndex value at line ${connect.to.portIndex.line}, column ${connect.to.portIndex.col} — expected 0, 1, 2, 3 or 4.`,
              );
            }
          }
          result +=
            connect.to.portIndex !== undefined
              ? connect.to.portIndex !== null
                ? `[${connect.to.portIndex.number}] `
                : " "
              : "";
          result += connect.style ? `style: ${connect.style} ` : "";
          result += connect.transition
            ? `transition: ${connect.transition} `
            : "";
          result += connect.color
            ? `color: "${formatNullValue(connect.color)}" `
            : "";
          result += connect.label
            ? `label: "${formatNullValue(connect.label)}" `
            : "";
          if (connect.arrowheads) {
            if (
              connect.arrowheads.number < 0 ||
              connect.arrowheads.number > 3
            ) {
              throw new Error(
                `Invalid arrowheads value at line ${connect.arrowheads.line}, column ${connect.arrowheads.col} — expected 0, 1, 2 or 3`,
              );
            }
          }
          result += connect.arrowheads
            ? `arrowheads: ${connect.arrowheads.number} `
            : "";

          result += connect.gap ? `gap: ${connect.gap} ` : "";
        }
      }
    }

    result += "\n";
  }

  result += "@\n";
  return result;
}
