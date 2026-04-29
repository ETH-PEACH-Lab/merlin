// re-construct DSL (Merlin Lite) from parsed DSL

export default function reconstructDSL(parsedDSL) {
  const lines = [];

  // Process definitions
  if (parsedDSL.defs) {
    parsedDSL.defs.forEach((def) => {
      if (def.type === "comment") {
        if (shouldAddEmptyLine(lines)) {
          lines.push("");
        }
        lines.push(`// ${def.content}`);
      } else {
        lines.push(reconstructDefinition(def));
      }
    });
    // Empty line after definitionsx
    lines.push("");
  }

  // Process commands
  if (parsedDSL.cmds) {
    parsedDSL.cmds.forEach((cmd) => {
      if (cmd.type === "comment") {
        if (shouldAddEmptyLine(lines)) {
          lines.push("");
        }
        lines.push(`// ${cmd.content}`);
      } else {
        const reconstructed = reconstructCommand(cmd);
        //   console.log(reconstructed);
        if (reconstructed) {
          lines.push(reconstructed);
        }
      }
    });
  }

  return lines.join("\n").trim();
}

function shouldAddEmptyLine(lines) {
  const prevLine = lines[lines.length - 1];
  return (
    lines.length > 0 &&
    !prevLine.startsWith("// ") &&
    !prevLine.startsWith("page") &&
    prevLine !== ""
  );
}

function normalizeDSLText(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t");
}

function escapeDSLString(value) {
  if (value === null || value === undefined) return "";

  const normalized = normalizeDSLText(value);

  return normalized
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/"/g, '\\"');
}
function generateSubLabel(node, result) {
  if (node.subLabelText !== undefined && node.subLabelText !== null) {
    result += ` subLabel.text: "${escapeDSLString(node.subLabelText)}"`;
  }

  if (node.subLabelFontColor !== undefined && node.subLabelFontColor !== null) {
    result += ` subLabel.fontColor: "${node.subLabelFontColor}"`;
  }

  if (
    node.subLabelFontFamily !== undefined &&
    node.subLabelFontFamily !== null
  ) {
    result += ` subLabel.fontFamily: "${node.subLabelFontFamily}"`;
  }

  if (node.subLabelFontSize !== undefined && node.subLabelFontSize !== null) {
    result += ` subLabel.fontSize: ${node.subLabelFontSize}`;
  }

  if (node.subLabelFontWeight) {
    result += ` subLabel.fontWeight: ${node.subLabelFontWeight.number}`;
  }

  if (node.subLabelFontStyle) {
    result += ` subLabel.fontStyle: ${node.subLabelFontStyle}`;
  }

  return result;
}

function reconstructArchitectureBody(body) {
  let result = "";

  const bodyEntries = Object.entries(body);

  for (const [bodyIndex, [key, value]] of bodyEntries.entries()) {
    const isLastBodyEntry = bodyIndex === bodyEntries.length - 1;

    if (key === "blocks") {
      for (const [blockIndex, block] of body.blocks.entries()) {
        const isLastBlock = blockIndex === body.blocks.length - 1;

        result += `\tblock ${block.id.name}: [\n`;

        const blockEntries = Object.entries(block);

        for (const [index2, [key2, value2]] of blockEntries.entries()) {
          const isLastBlockEntry = index2 === blockEntries.length - 1;

          if (key2 === "id") {
            continue;
          } else if (key2 === "nodes") {
            result += `\t\tnodes: [\n`;

            for (const [nodeIndex, node] of value2.entries()) {
              const isLastNode = nodeIndex === value2.length - 1;

              result += `\t\t\t${node.id.name} = type: ${node.type}`;

              if (node.type === "text") {
                if (node.labelText !== undefined && node.labelText !== null) {
                  result += ` label.text: "${escapeDSLString(node.labelText)}"`;
                }
                if (node.labelOrientation) {
                  result += ` label.orientation: (${node.labelOrientation[0]},${node.labelOrientation[1]})`;
                }

                if (
                  node.labelFontColor !== undefined &&
                  node.labelFontColor !== null
                ) {
                  result += ` label.fontColor: "${node.labelFontColor}"`;
                }

                if (
                  node.labelFontFamily !== undefined &&
                  node.labelFontFamily !== null
                ) {
                  result += ` label.fontFamily: "${node.labelFontFamily}"`;
                }

                if (
                  node.labelFontSize !== undefined &&
                  node.labelFontSize !== null
                ) {
                  result += ` label.fontSize: ${node.labelFontSize}`;
                }

                if (node.labelFontWeight) {
                  result += ` label.fontWeight: ${node.labelFontWeight.number}`;
                }

                if (node.labelFontStyle) {
                  result += ` label.fontStyle: ${node.labelFontStyle}`;
                }

                result = generateSubLabel(node, result);

                if (
                  node.opLabelText !== undefined &&
                  node.opLabelText !== null
                ) {
                  result += ` opLabel.text: "${escapeDSLString(node.opLabelText)}"`;
                }

                if (
                  node.opLabelFontColor !== undefined &&
                  node.opLabelFontColor !== null
                ) {
                  result += ` opLabel.fontColor: "${node.opLabelFontColor}"`;
                }

                if (
                  node.opLabelFontFamily !== undefined &&
                  node.opLabelFontFamily !== null
                ) {
                  result += ` opLabel.fontFamily: "${node.opLabelFontFamily}"`;
                }

                if (
                  node.opLabelFontSize !== undefined &&
                  node.opLabelFontSize !== null
                ) {
                  result += ` opLabel.fontSize: ${node.opLabelFontSize}`;
                }

                if (node.opLabelFontWeight) {
                  result += ` opLabel.fontWeight: ${node.opLabelFontWeight.number}`;
                }

                if (node.opLabelFontStyle) {
                  result += ` opLabel.fontStyle: ${node.opLabelFontStyle}`;
                }

                if (
                  node.opLabelSubtext !== undefined &&
                  node.opLabelSubtext !== null
                ) {
                  result += ` opLabel.subtext: "${escapeDSLString(node.opLabelSubtext)}"`;
                }

                if (node.annotations) {
                  for (const annotation of node.annotations) {
                    result += ` annotation.${annotation.side}: "${annotation.value.length === 1 ? escapeDSLString(annotation.value[0]) : escapeDSLString(annotation.value)}"`;
                    if (
                      annotation.shiftTop !== undefined &&
                      annotation.shiftTop !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.top: ${annotation.shiftTop}`;
                    }

                    if (
                      annotation.shiftBottom !== undefined &&
                      annotation.shiftBottom !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.bottom: ${annotation.shiftBottom}`;
                    }
                    if (
                      annotation.shiftLeft !== undefined &&
                      annotation.shiftLeft !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.left: ${annotation.shiftLeft}`;
                    }
                    if (
                      annotation.shiftRight !== undefined &&
                      annotation.shiftRight !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.right: ${annotation.shiftRight}`;
                    }
                  }
                }

                if (
                  node.annotationGap !== undefined &&
                  node.annotationGap !== null
                ) {
                  result += ` annotation.gap: ${node.annotationGap}`;
                }

                if (
                  node.annotationFontFamily !== undefined &&
                  node.annotationFontFamily !== null
                ) {
                  result += ` annotation.fontFamily: "${node.annotationFontFamily}"`;
                }

                if (
                  node.annotationFontSize !== undefined &&
                  node.annotationFontSize !== null
                ) {
                  result += ` annotation.fontSize: ${node.annotationFontSize}`;
                }

                if (node.annotationFontWeight) {
                  result += ` annotation.fontWeight: ${node.annotationFontWeight.number}`;
                }

                if (node.annotationFontStyle) {
                  result += ` annotation.fontStyle: ${node.annotationFontStyle}`;
                }

                if (
                  node.annotationFontColor !== undefined &&
                  node.annotationFontColor !== null
                ) {
                  result += ` annotation.fontColor: "${node.annotationFontColor}"`;
                }

                if (node.color) {
                  result += ` color: "${node.color}"`;
                }
              } else if (
                node.type === "rect" ||
                node.type === "circle" ||
                node.type === "arrow" ||
                node.type === "trapezoid"
              ) {
                if (node.labelText !== undefined && node.labelText !== null) {
                  result += ` label.text: "${escapeDSLString(node.labelText)}"`;
                }
                if (node.labelOrientation) {
                  result += ` label.orientation: (${node.labelOrientation[0]},${node.labelOrientation[1]})`;
                }

                if (
                  node.labelFontColor !== undefined &&
                  node.labelFontColor !== null
                ) {
                  result += ` label.fontColor: "${node.labelFontColor}"`;
                }

                if (
                  node.labelFontFamily !== undefined &&
                  node.labelFontFamily !== null
                ) {
                  result += ` label.fontFamily: "${node.labelFontFamily}"`;
                }

                if (
                  node.labelFontSize !== undefined &&
                  node.labelFontSize !== null
                ) {
                  result += ` label.fontSize: ${node.labelFontSize}`;
                }

                if (node.labelFontWeight) {
                  result += ` label.fontWeight: ${node.labelFontWeight.number}`;
                }

                if (node.labelFontStyle) {
                  result += ` label.fontStyle: ${node.labelFontStyle}`;
                }

                result = generateSubLabel(node, result);

                if (
                  node.opLabelText !== undefined &&
                  node.opLabelText !== null
                ) {
                  result += ` opLabel.text: "${escapeDSLString(node.opLabelText)}"`;
                }

                if (
                  node.opLabelFontColor !== undefined &&
                  node.opLabelFontColor !== null
                ) {
                  result += ` opLabel.fontColor: "${node.opLabelFontColor}"`;
                }

                if (
                  node.opLabelFontFamily !== undefined &&
                  node.opLabelFontFamily !== null
                ) {
                  result += ` opLabel.fontFamily: "${node.opLabelFontFamily}"`;
                }

                if (
                  node.opLabelFontSize !== undefined &&
                  node.opLabelFontSize !== null
                ) {
                  result += ` opLabel.fontSize: ${node.opLabelFontSize}`;
                }

                if (node.opLabelFontWeight) {
                  result += ` opLabel.fontWeight: ${node.opLabelFontWeight.number}`;
                }

                if (node.opLabelFontStyle) {
                  result += ` opLabel.fontStyle: ${node.opLabelFontStyle}`;
                }

                if (
                  node.opLabelSubtext !== undefined &&
                  node.opLabelSubtext !== null
                ) {
                  result += ` opLabel.subtext: "${escapeDSLString(node.opLabelSubtext)}"`;
                }

                if (node.annotations) {
                  for (const annotation of node.annotations) {
                    result += ` annotation.${annotation.side}: "${annotation.value.length === 1 ? escapeDSLString(annotation.value[0]) : escapeDSLString(annotation.value)}"`;

                    if (
                      annotation.shiftTop !== undefined &&
                      annotation.shiftTop !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.top: ${annotation.shiftTop}`;
                    }

                    if (
                      annotation.shiftBottom !== undefined &&
                      annotation.shiftBottom !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.bottom: ${annotation.shiftBottom}`;
                    }
                    if (
                      annotation.shiftLeft !== undefined &&
                      annotation.shiftLeft !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.left: ${annotation.shiftLeft}`;
                    }
                    if (
                      annotation.shiftRight !== undefined &&
                      annotation.shiftRight !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.right: ${annotation.shiftRight}`;
                    }
                  }
                }

                if (
                  node.annotationGap !== undefined &&
                  node.annotationGap !== null
                ) {
                  result += ` annotation.gap: ${node.annotationGap}`;
                }

                if (
                  node.annotationFontFamily !== undefined &&
                  node.annotationFontFamily !== null
                ) {
                  result += ` annotation.fontFamily: "${node.annotationFontFamily}"`;
                }

                if (
                  node.annotationFontSize !== undefined &&
                  node.annotationFontSize !== null
                ) {
                  result += ` annotation.fontSize: ${node.annotationFontSize}`;
                }

                if (node.annotationFontWeight) {
                  result += ` annotation.fontWeight: ${node.annotationFontWeight.number}`;
                }

                if (node.annotationFontStyle) {
                  result += ` annotation.fontStyle: ${node.annotationFontStyle}`;
                }

                if (
                  node.annotationFontColor !== undefined &&
                  node.annotationFontColor !== null
                ) {
                  result += ` annotation.fontColor: "${node.annotationFontColor}"`;
                }

                if (node.size) {
                  result += ` size: (${node.size[0]}, ${node.size[1]})`;
                }

                if (node.shape) {
                  result += ` shape: ${node.shape}`;
                }

                if (node.color) {
                  result += ` color: "${node.color}"`;
                }

                if (
                  node.strokeColor !== undefined &&
                  node.strokeColor !== null
                ) {
                  result += ` stroke.color: "${node.strokeColor}"`;
                }

                if (node.strokeStyle) {
                  result += ` stroke.style: ${node.strokeStyle}`;
                }

                if (
                  node.strokeWidth !== undefined &&
                  node.strokeWidth !== null
                ) {
                  result += ` stroke.width: ${node.strokeWidth}`;
                }
                if (node.direction) {
                  result += ` direction: ${node.direction}`;
                }
              } else if (node.type === "stacked") {
                if (node.shape) {
                  result += ` shape: ${node.shape[0][0]}x${node.shape[0][1]}x${node.shape[0][2]}`;
                }

                if (node.kernelSize) {
                  result += ` kernelSize: ${node.kernelSize[0]}x${node.kernelSize[1]}`;
                }

                if (
                  node.filterSpacing !== undefined &&
                  node.filterSpacing !== null
                ) {
                  result += ` filterSpacing: ${node.filterSpacing}`;
                }

                if (node.labelText !== undefined && node.labelText !== null) {
                  result += ` label.text: "${escapeDSLString(node.labelText)}"`;
                }

                if (
                  node.labelFontColor !== undefined &&
                  node.labelFontColor !== null
                ) {
                  result += ` label.fontColor: "${node.labelFontColor}"`;
                }

                if (
                  node.labelFontFamily !== undefined &&
                  node.labelFontFamily !== null
                ) {
                  result += ` label.fontFamily: "${node.labelFontFamily}"`;
                }

                if (
                  node.labelFontSize !== undefined &&
                  node.labelFontSize !== null
                ) {
                  result += ` label.fontSize: ${node.labelFontSize}`;
                }

                if (node.labelFontWeight) {
                  result += ` label.fontWeight: ${node.labelFontWeight.number}`;
                }

                if (node.labelFontStyle) {
                  result += ` label.fontStyle: ${node.labelFontStyle}`;
                }
                result = generateSubLabel(node, result);
                if (
                  node.opLabelText !== undefined &&
                  node.opLabelText !== null
                ) {
                  result += ` opLabel.text: "${escapeDSLString(node.opLabelText)}"`;
                }

                if (
                  node.opLabelFontColor !== undefined &&
                  node.opLabelFontColor !== null
                ) {
                  result += ` opLabel.fontColor: "${node.opLabelFontColor}"`;
                }

                if (
                  node.opLabelFontFamily !== undefined &&
                  node.opLabelFontFamily !== null
                ) {
                  result += ` opLabel.fontFamily: "${node.opLabelFontFamily}"`;
                }

                if (
                  node.opLabelFontSize !== undefined &&
                  node.opLabelFontSize !== null
                ) {
                  result += ` opLabel.fontSize: ${node.opLabelFontSize}`;
                }

                if (node.opLabelFontWeight) {
                  result += ` opLabel.fontWeight: ${node.opLabelFontWeight.number}`;
                }

                if (node.opLabelFontStyle) {
                  result += ` opLabel.fontStyle: ${node.opLabelFontStyle}`;
                }

                if (
                  node.opLabelSubtext !== undefined &&
                  node.opLabelSubtext !== null
                ) {
                  result += ` opLabel.subtext: "${node.opLabelSubtext}"`;
                }

                if (node.annotations) {
                  for (const annotation of node.annotations) {
                    result += ` annotation.${annotation.side}: "${escapeDSLString(annotation.value)}"`;

                    if (
                      annotation.shiftTop !== undefined &&
                      annotation.shiftTop !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.top: ${annotation.shiftTop}`;
                    }

                    if (
                      annotation.shiftBottom !== undefined &&
                      annotation.shiftBottom !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.bottom: ${annotation.shiftBottom}`;
                    }
                    if (
                      annotation.shiftLeft !== undefined &&
                      annotation.shiftLeft !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.left: ${annotation.shiftLeft}`;
                    }
                    if (
                      annotation.shiftRight !== undefined &&
                      annotation.shiftRight !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.right: ${annotation.shiftRight}`;
                    }
                  }
                }

                if (
                  node.annotationGap !== undefined &&
                  node.annotationGap !== null
                ) {
                  result += ` annotation.gap: ${node.annotationGap}`;
                }

                if (
                  node.annotationFontFamily !== undefined &&
                  node.annotationFontFamily !== null
                ) {
                  result += ` annotation.fontFamily: "${node.annotationFontFamily}"`;
                }

                if (
                  node.annotationFontSize !== undefined &&
                  node.annotationFontSize !== null
                ) {
                  result += ` annotation.fontSize: ${node.annotationFontSize}`;
                }

                if (node.annotationFontWeight) {
                  result += ` annotation.fontWeight: ${node.annotationFontWeight.number}`;
                }

                if (node.annotationFontStyle) {
                  result += ` annotation.fontStyle: ${node.annotationFontStyle}`;
                }

                if (
                  node.annotationFontColor !== undefined &&
                  node.annotationFontColor !== null
                ) {
                  result += ` annotation.fontColor: "${node.annotationFontColor}"`;
                }

                if (node.size) {
                  result += ` size: (${node.size[0]}, ${node.size[1]})`;
                }

                if (node.color) {
                  result += ` color: "${node.color}"`;
                }

                if (
                  node.strokeColor !== undefined &&
                  node.strokeColor !== null
                ) {
                  result += ` stroke.color: "${node.strokeColor}"`;
                }

                if (node.strokeStyle) {
                  result += ` stroke.style: ${node.strokeStyle}`;
                }

                if (
                  node.strokeWidth !== undefined &&
                  node.strokeWidth !== null
                ) {
                  result += ` stroke.width: ${node.strokeWidth}`;
                }

                if (
                  node.outerStrokeColor !== undefined &&
                  node.outerStrokeColor !== null
                ) {
                  result += ` outerStroke.color: "${node.outerStrokeColor}"`;
                }

                if (node.outerStrokeStyle) {
                  result += ` outerStroke.style: ${node.outerStrokeStyle}`;
                }

                if (
                  node.outerStrokeWidth !== undefined &&
                  node.outerStrokeWidth !== null
                ) {
                  result += `outerStroke.width: ${node.outerStrokeWidth}`;
                }
              } else if (node.type === "flatten") {
                if (node.shape) {
                  result += ` shape: ${node.shape[0][0]}x${node.shape[0][1]}`;
                }

                if (node.labelText !== undefined && node.labelText !== null) {
                  result += ` label.text: "${escapeDSLString(node.labelText)}"`;
                }

                if (
                  node.labelFontColor !== undefined &&
                  node.labelFontColor !== null
                ) {
                  result += ` label.fontColor: "${node.labelFontColor}"`;
                }

                if (
                  node.labelFontFamily !== undefined &&
                  node.labelFontFamily !== null
                ) {
                  result += ` label.fontFamily: "${node.labelFontFamily}"`;
                }

                if (
                  node.labelFontSize !== undefined &&
                  node.labelFontSize !== null
                ) {
                  result += ` label.fontSize: ${node.labelFontSize}`;
                }

                if (node.labelFontWeight) {
                  result += ` label.fontWeight: ${node.labelFontWeight.number}`;
                }

                if (node.labelFontStyle) {
                  result += ` label.fontStyle: ${node.labelFontStyle}`;
                }
                result = generateSubLabel(node, result);

                if (
                  node.opLabelText !== undefined &&
                  node.opLabelText !== null
                ) {
                  result += ` opLabel.text: "${escapeDSLString(node.opLabelText)}"`;
                }

                if (
                  node.opLabelFontColor !== undefined &&
                  node.opLabelFontColor !== null
                ) {
                  result += ` opLabel.fontColor: "${node.opLabelFontColor}"`;
                }

                if (
                  node.opLabelFontFamily !== undefined &&
                  node.opLabelFontFamily !== null
                ) {
                  result += ` opLabel.fontFamily: "${node.opLabelFontFamily}"`;
                }

                if (
                  node.opLabelFontSize !== undefined &&
                  node.opLabelFontSize !== null
                ) {
                  result += ` opLabel.fontSize: ${node.opLabelFontSize}`;
                }

                if (node.opLabelFontWeight) {
                  result += ` opLabel.fontWeight: ${node.opLabelFontWeight.number}`;
                }

                if (node.opLabelFontStyle) {
                  result += ` opLabel.fontStyle: ${node.opLabelFontStyle}`;
                }

                if (
                  node.opLabelSubtext !== undefined &&
                  node.opLabelSubtext !== null
                ) {
                  result += ` opLabel.subtext: "${node.opLabelSubtext}"`;
                }

                if (node.annotations) {
                  for (const annotation of node.annotations) {
                    result += ` annotation.${annotation.side}: "${annotation.value.length === 1 ? escapeDSLString(annotation.value[0]) : escapeDSLString(annotation.value)}"`;
                    if (
                      annotation.shiftTop !== undefined &&
                      annotation.shiftTop !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.top: ${annotation.shiftTop}`;
                    }

                    if (
                      annotation.shiftBottom !== undefined &&
                      annotation.shiftBottom !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.bottom: ${annotation.shiftBottom}`;
                    }
                    if (
                      annotation.shiftLeft !== undefined &&
                      annotation.shiftLeft !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.left: ${annotation.shiftLeft}`;
                    }
                    if (
                      annotation.shiftRight !== undefined &&
                      annotation.shiftRight !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.right: ${annotation.shiftRight}`;
                    }
                  }
                }

                if (
                  node.annotationGap !== undefined &&
                  node.annotationGap !== null
                ) {
                  result += ` annotation.gap: ${node.annotationGap}`;
                }

                if (
                  node.annotationFontFamily !== undefined &&
                  node.annotationFontFamily !== null
                ) {
                  result += ` annotation.fontFamily: "${node.annotationFontFamily}"`;
                }

                if (
                  node.annotationFontSize !== undefined &&
                  node.annotationFontSize !== null
                ) {
                  result += ` annotation.fontSize: ${node.annotationFontSize}`;
                }

                if (node.annotationFontWeight) {
                  result += ` annotation.fontWeight: ${node.annotationFontWeight.number}`;
                }

                if (node.annotationFontStyle) {
                  result += ` annotation.fontStyle: ${node.annotationFontStyle}`;
                }

                if (
                  node.annotationFontColor !== undefined &&
                  node.annotationFontColor !== null
                ) {
                  result += ` annotation.fontColor: "${node.annotationFontColor}"`;
                }

                if (node.size) {
                  result += ` size: (${node.size[0]}, ${node.size[1]})`;
                }

                if (node.color) {
                  result += ` color: "${node.color}"`;
                }
              } else if (node.type === "fullyConnected") {
                if (node.shape) {
                  result += ` shape: [`;

                  for (let i = 0; i < node.shape[0].length; i++) {
                    result += `${node.shape[0][i]}`;
                    if (i !== node.shape[0].length - 1) {
                      result += `, `;
                    }
                  }

                  result += `]`;
                }
                if (node.labelText !== undefined && node.labelText !== null) {
                  result += ` label.text: "${escapeDSLString(node.labelText)}"`;
                }

                if (
                  node.labelFontColor !== undefined &&
                  node.labelFontColor !== null
                ) {
                  result += ` label.fontColor: "${node.labelFontColor}"`;
                }

                if (
                  node.labelFontFamily !== undefined &&
                  node.labelFontFamily !== null
                ) {
                  result += ` label.fontFamily: "${node.labelFontFamily}"`;
                }

                if (
                  node.labelFontSize !== undefined &&
                  node.labelFontSize !== null
                ) {
                  result += ` label.fontSize: ${node.labelFontSize}`;
                }

                if (node.labelFontWeight) {
                  result += ` label.fontWeight: ${node.labelFontWeight.number}`;
                }

                if (node.labelFontStyle) {
                  result += ` label.fontStyle: ${node.labelFontStyle}`;
                }
                result = generateSubLabel(node, result);
                if (
                  node.opLabelText !== undefined &&
                  node.opLabelText !== null
                ) {
                  result += ` opLabel.text: "${escapeDSLString(node.opLabelText)}"`;
                }

                if (
                  node.opLabelFontColor !== undefined &&
                  node.opLabelFontColor !== null
                ) {
                  result += ` opLabel.fontColor: "${node.opLabelFontColor}"`;
                }

                if (
                  node.opLabelFontFamily !== undefined &&
                  node.opLabelFontFamily !== null
                ) {
                  result += ` opLabel.fontFamily: "${node.opLabelFontFamily}"`;
                }

                if (
                  node.opLabelFontSize !== undefined &&
                  node.opLabelFontSize !== null
                ) {
                  result += ` opLabel.fontSize: ${node.opLabelFontSize}`;
                }

                if (node.opLabelFontWeight) {
                  result += ` opLabel.fontWeight: ${node.opLabelFontWeight.number}`;
                }

                if (node.opLabelFontStyle) {
                  result += ` opLabel.fontStyle: ${node.opLabelFontStyle}`;
                }

                if (
                  node.opLabelSubtext !== undefined &&
                  node.opLabelSubtext !== null
                ) {
                  result += ` opLabel.subtext: "${node.opLabelSubtext}"`;
                }

                if (node.outputLabels) {
                  result += ` outputLabels: [`;

                  for (let i = 0; i < node.outputLabels.length; i++) {
                    result += `"${escapeDSLString(node.outputLabels[i])}"`;
                    if (i !== node.outputLabels.length - 1) {
                      result += `, `;
                    }
                  }

                  result += `]`;
                }

                if (node.annotations) {
                  for (const annotation of node.annotations) {
                    result += ` annotation.${annotation.side}: "${annotation.value.length === 1 ? escapeDSLString(annotation.value[0]) : escapeDSLString(annotation.value)}"`;
                    if (
                      annotation.shiftTop !== undefined &&
                      annotation.shiftTop !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.top: ${annotation.shiftTop}`;
                    }

                    if (
                      annotation.shiftBottom !== undefined &&
                      annotation.shiftBottom !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.bottom: ${annotation.shiftBottom}`;
                    }
                    if (
                      annotation.shiftLeft !== undefined &&
                      annotation.shiftLeft !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.left: ${annotation.shiftLeft}`;
                    }
                    if (
                      annotation.shiftRight !== undefined &&
                      annotation.shiftRight !== null
                    ) {
                      result += ` annotation.${annotation.side}.shift.right: ${annotation.shiftRight}`;
                    }
                  }
                }

                if (
                  node.annotationGap !== undefined &&
                  node.annotationGap !== null
                ) {
                  result += ` annotation.gap: ${node.annotationGap}`;
                }

                if (
                  node.annotationFontFamily !== undefined &&
                  node.annotationFontFamily !== null
                ) {
                  result += ` annotation.fontFamily: "${node.annotationFontFamily}"`;
                }

                if (
                  node.annotationFontSize !== undefined &&
                  node.annotationFontSize !== null
                ) {
                  result += ` annotation.fontSize: ${node.annotationFontSize}`;
                }

                if (node.annotationFontWeight) {
                  result += ` annotation.fontWeight: ${node.annotationFontWeight.number}`;
                }

                if (node.annotationFontStyle) {
                  result += ` annotation.fontStyle: ${node.annotationFontStyle}`;
                }

                if (
                  node.annotationFontColor !== undefined &&
                  node.annotationFontColor !== null
                ) {
                  result += ` annotation.fontColor: "${node.annotationFontColor}"`;
                }

                if (node.size) {
                  result += ` size: (${node.size[0]}, ${node.size[1]})`;
                }

                if (node.color) {
                  result += ` color: [`;

                  for (let i = 0; i < node.color[0].length; i++) {
                    result += `"${node.color[0][i]}"`;
                    if (i !== node.color[0].length - 1) {
                      result += `, `;
                    }
                  }

                  result += `]`;
                }
              }

              if (!isLastNode) {
                result += `,`;
              }

              result += `\n`;
            }

            result += `\t\t]`;
            if (!isLastBlockEntry) result += `,`;
            result += `\n`;
          } else if (key2 === "edges") {
            result += `\t\tedges: [\n`;

            for (const [edgeIndex, edge] of value2.entries()) {
              const isLastEdge = edgeIndex === value2.length - 1;

              result += `\t\t\t${edge.id.name} = `;

              if (edge.from.node) {
                result += `${edge.from.node.name}.${edge.from.nodeAnchor}`;
                if (
                  edge.from.portIndex !== undefined &&
                  edge.from.portIndex !== null
                ) {
                  result += `[${edge.from.portIndex.number}]`;
                }
              } else if (edge.from.edge) {
                result += `${edge.from.edge.name}.${edge.from.edgeAnchor}`;
              }

              result += ` -> `;

              if (edge.to.node) {
                result += `${edge.to.node.name}.${edge.to.nodeAnchor}`;
                if (
                  edge.to.portIndex !== undefined &&
                  edge.to.portIndex !== null
                ) {
                  result += `[${edge.to.portIndex.number}]`;
                }
              } else if (edge.to.edge) {
                result += `${edge.to.edge.name}.${edge.to.edgeAnchor}`;
              }

              if (edge.labelText !== undefined && edge.labelText !== null) {
                result += ` label.text: "${escapeDSLString(edge.labelText)}"`;
              }

              if (
                edge.labelFontColor !== undefined &&
                edge.labelFontColor !== null
              ) {
                result += ` label.fontColor: "${edge.labelFontColor}"`;
              }

              if (
                edge.labelFontFamily !== undefined &&
                edge.labelFontFamily !== null
              ) {
                result += ` label.fontFamily: "${edge.labelFontFamily}"`;
              }

              if (
                edge.labelFontSize !== undefined &&
                edge.labelFontSize !== null
              ) {
                result += ` label.fontSize: ${edge.labelFontSize}`;
              }

              if (edge.labelFontWeight) {
                result += ` label.fontWeight: ${edge.labelFontWeight.number}`;
              }

              if (
                edge.labelFontStyle !== undefined &&
                edge.labelFontStyle !== null
              ) {
                result += ` label.fontStyle: ${edge.labelFontStyle}`;
              }

              if (
                edge.labelShiftTop !== undefined &&
                edge.labelShiftTop !== null
              ) {
                result += ` label.shift.top: ${edge.labelShiftTop}`;
              }

              if (
                edge.labelShiftBottom !== undefined &&
                edge.labelShiftBottom !== null
              ) {
                result += ` label.shift.bottom: ${edge.labelShiftBottom}`;
              }

              if (
                edge.labelShiftLeft !== undefined &&
                edge.labelShiftLeft !== null
              ) {
                result += ` label.shift.left: ${edge.labelShiftLeft}`;
              }
              if (
                edge.labelShiftRight !== undefined &&
                edge.labelShiftRight !== null
              ) {
                result += ` label.shift.right: ${edge.labelShiftRight}`;
              }

              if (edge.shape) {
                result += ` shape: ${edge.shape}`;
              }

              if (edge.curveHeight !== undefined && edge.curveHeight !== null) {
                result += ` curveHeight: ${edge.curveHeight}`;
              }

              if (edge.width !== undefined && edge.width !== null) {
                result += ` width: ${edge.width}`;
              }

              if (
                edge.bidirectional !== undefined &&
                edge.bidirectional !== null
              ) {
                result += ` bidirectional: ${edge.bidirectional}`;
              }

              if (edge.headOnly !== undefined && edge.headOnly !== null) {
                result += ` headOnly: ${edge.headOnly}`;
              }

              if (edge.style) {
                result += ` style: ${edge.style}`;
              }

              if (edge.gap !== undefined && edge.gap !== null) {
                result += ` gap: ${edge.gap}`;
              }

              if (edge.transition) {
                result += ` transition: ${edge.transition}`;
              }

              if (edge.arrowheads !== undefined && edge.arrowheads !== null) {
                result += ` arrowheads: ${edge.arrowheads.number}`;
              }

              if (edge.edgeAnchorOffset) {
                result += ` edgeAnchorOffset: [${edge.edgeAnchorOffset[0]},${edge.edgeAnchorOffset[1]}]`;
              }

              if (
                edge.alignToIndexedPort !== undefined &&
                edge.alignToIndexedPort !== null
              ) {
                result += ` alignToIndexedPort: ${edge.alignToIndexedPort}`;
              }

              if (edge.color !== undefined && edge.color !== null) {
                result += ` color: "${edge.color.length === 1 ? edge.color[0] : edge.color}"`;
              }

              if (!isLastEdge) {
                result += `,`;
              }

              result += `\n`;
            }

            result += `\t\t]`;
            if (!isLastBlockEntry) result += `,`;
            result += `\n`;
          } else if (key2 === "groups") {
            result += `\t\tgroups: [\n`;

            for (const [groupIndex, group] of value2.entries()) {
              const isLastGroup = groupIndex === value2.length - 1;

              result += `\t\t\t${group.id.name} = members: [`;

              for (const [memberIndex, member] of group.members.entries()) {
                result += member.name;
                if (memberIndex !== group.members.length - 1) {
                  result += `, `;
                }
              }

              result += `]`;

              if (group.layout !== undefined && group.layout !== null) {
                result += ` layout: ${group.layout}`;
              }

              if (group.gap !== undefined && group.gap !== null) {
                result += ` gap: ${group.gap}`;
              }

              if (group.color !== undefined && group.color !== null) {
                result += ` color: "${group.color.length === 1 ? group.color[0] : group.color}"`;
              }

              if (group.colorBoxAdjustments) {
                result += ` colorBoxAdjustments: (${group.colorBoxAdjustments[0]},${group.colorBoxAdjustments[1]},${group.colorBoxAdjustments[2]},${group.colorBoxAdjustments[3]})`;
              }

              if (
                group.strokeColor !== undefined &&
                group.strokeColor !== null
              ) {
                result += ` stroke.color: "${group.strokeColor}"`;
              }

              if (group.strokeStyle) {
                result += ` stroke.style: ${group.strokeStyle}`;
              }

              if (
                group.strokeWidth !== undefined &&
                group.strokeWidth !== null
              ) {
                result += ` stroke.width: ${group.strokeWidth}`;
              }
              if (group.anchorSource) {
                result += ` anchor.source: ${group.anchorSource.name}`;
              }

              if (group.anchorTarget) {
                result += ` anchor.target: ${group.anchorTarget.name}`;
              }

              if (group.align !== undefined && group.align !== null) {
                result += ` align: ${group.align}`;
              }

              if (group.shape) {
                result += ` shape: ${group.shape}`;
              }

              if (group.shiftTop !== undefined && group.shiftTop !== null) {
                result += ` shift.top: ${group.shiftTop}`;
              }

              if (
                group.shiftBottom !== undefined &&
                group.shiftBottom !== null
              ) {
                result += ` shift.bottom: ${group.shiftBottom}`;
              }

              if (group.shiftLeft !== undefined && group.shiftLeft !== null) {
                result += ` shift.left: ${group.shiftLeft}`;
              }

              if (group.shiftRight !== undefined && group.shiftRight !== null) {
                result += ` shift.right: ${group.shiftRight}`;
              }

              if (group.annotations) {
                for (const annotation of group.annotations) {
                  result += ` annotation.${annotation.side}: "${annotation.value.length === 1 ? escapeDSLString(annotation.value[0]) : escapeDSLString(annotation.value)}"`;
                  if (
                    annotation.shiftTop !== undefined &&
                    annotation.shiftTop !== null
                  ) {
                    result += ` annotation.${annotation.side}.shift.top: ${annotation.shiftTop}`;
                  }

                  if (
                    annotation.shiftBottom !== undefined &&
                    annotation.shiftBottom !== null
                  ) {
                    result += ` annotation.${annotation.side}.shift.bottom: ${annotation.shiftBottom}`;
                  }
                  if (
                    annotation.shiftLeft !== undefined &&
                    annotation.shiftLeft !== null
                  ) {
                    result += ` annotation.${annotation.side}.shift.left: ${annotation.shiftLeft}`;
                  }
                  if (
                    annotation.shiftRight !== undefined &&
                    annotation.shiftRight !== null
                  ) {
                    result += ` annotation.${annotation.side}.shift.right: ${annotation.shiftRight}`;
                  }
                }
              }

              if (
                group.annotationGap !== undefined &&
                group.annotationGap !== null
              ) {
                result += ` annotation.gap: ${group.annotationGap}`;
              }

              if (
                group.annotationFontFamily !== undefined &&
                group.annotationFontFamily !== null
              ) {
                result += ` annotation.fontFamily: "${group.annotationFontFamily}"`;
              }

              if (
                group.annotationFontSize !== undefined &&
                group.annotationFontSize !== null
              ) {
                result += ` annotation.fontSize: ${group.annotationFontSize}`;
              }

              if (group.annotationFontWeight) {
                result += ` annotation.fontWeight: ${group.annotationFontWeight.number}`;
              }

              if (group.annotationFontStyle) {
                result += ` annotation.fontStyle: ${group.annotationFontStyle}`;
              }

              if (
                group.annotationFontColor !== undefined &&
                group.annotationFontColor !== null
              ) {
                result += ` annotation.fontColor: "${group.annotationFontColor}"`;
              }

              if (group.markerType) {
                result += ` marker.type: ${group.markerType}`;
              }

              if (
                group.markerColor !== undefined &&
                group.markerColor !== null
              ) {
                result += ` marker.color: "${group.markerColor}"`;
              }

              if (group.markerPosition) {
                result += ` marker.position: ${group.markerPosition}`;
              }

              if (
                group.markerLabelText !== undefined &&
                group.markerLabelText !== null
              ) {
                result += ` marker.text: "${escapeDSLString(group.markerLabelText)}"`;
              }

              if (
                group.markerLabelFontColor !== undefined &&
                group.markerLabelFontColor !== null
              ) {
                result += ` marker.fontColor: "${group.markerLabelFontColor}"`;
              }

              if (
                group.markerLabelFontFamily !== undefined &&
                group.markerLabelFontFamily !== null
              ) {
                result += ` marker.fontFamily: "${group.markerLabelFontFamily}"`;
              }

              if (
                group.markerLabelFontSize !== undefined &&
                group.markerLabelFontSize !== null
              ) {
                result += ` marker.fontSize: ${group.markerLabelFontSize}`;
              }

              if (group.markerLabelFontWeight) {
                result += ` marker.fontWeight: ${group.markerLabelFontWeight.number}`;
              }

              if (group.markerLabelFontStyle) {
                result += ` marker.fontStyle: ${group.markerLabelFontStyle}`;
              }

              if (group.markerTop !== undefined && group.markerTop !== null) {
                result += ` marker.shift.top: ${group.markerTop}`;
              }
              if (
                group.markerBottom !== undefined &&
                group.markerBottom !== null
              ) {
                result += ` marker.shift.bottom: ${group.markerBottom}`;
              }

              if (group.markerLeft !== undefined && group.markerLeft !== null) {
                result += ` marker.shift.left: ${group.markerLeft}`;
              }

              if (
                group.markerRight !== undefined &&
                group.markerRight !== null
              ) {
                result += ` marker.shift.right: ${group.markerRight}`;
              }

              if (!isLastGroup) {
                result += `,`;
              }

              result += `\n`;
            }

            result += `\t\t]`;
            if (!isLastBlockEntry) result += `,`;
            result += `\n`;
          } else if (key2 === "annotations") {
            for (let i = 0; i < value2.length; i++) {
              const annotation = value2[i];

              const shiftEntries = [
                ["left", annotation.shiftLeft],
                ["right", annotation.shiftRight],
                ["top", annotation.shiftTop],
                ["bottom", annotation.shiftBottom],
              ].filter(([, v]) => v !== undefined && v !== null);

              const lines = [];

              if (annotation.value !== undefined) {
                lines.push(
                  `\t\tannotation.${annotation.side}: "${
                    annotation.value.length === 1
                      ? escapeDSLString(annotation.value[0])
                      : escapeDSLString(annotation.value)
                  }"`,
                );
              }

              for (const [shiftSide, shiftValue] of shiftEntries) {
                lines.push(
                  `\t\tannotation.${annotation.side}.shift.${shiftSide}: ${shiftValue}`,
                );
              }

              for (let j = 0; j < lines.length; j++) {
                const isLastLineOfAnnotation = j === lines.length - 1;
                const isLastAnnotation = i === value2.length - 1;
                const needsComma =
                  !isLastAnnotation ||
                  !isLastLineOfAnnotation ||
                  !isLastBlockEntry;

                result += lines[j];

                if (needsComma) {
                  result += `,`;
                }

                result += `\n`;
              }
            }
          } else if (
            key2 === "annotationFontFamily" ||
            key2 === "annotationFontSize" ||
            key2 === "annotationFontWeight" ||
            key2 === "annotationFontStyle" ||
            key2 === "annotationFontColor" ||
            key2 === "annotationGap" ||
            key2 === "fontColor" ||
            key2 === "fontFamily" ||
            key2 === "fontSize" ||
            key2 === "fontWeight" ||
            key2 === "fontStyle"
          ) {
            if (key2 === "annotationFontWeight") {
              result += `\t\tannotation.fontWeight: ${value2.number}`;
            } else if (key2 === "annotationFontFamily") {
              result += `\t\tannotation.fontFamily: "${value2}"`;
            } else if (key2 === "annotationFontSize") {
              result += `\t\tannotation.fontSize: ${value2}`;
            } else if (key2 === "annotationFontStyle") {
              result += `\t\tannotation.fontStyle: ${value2}`;
            } else if (key2 === "annotationFontColor") {
              result += `\t\tannotation.fontColor: "${value2}"`;
            } else if (key2 === "fontColor") {
              result += `\t\tfontColor: "${value2}"`;
            } else if (key2 === "fontFamily") {
              result += `\t\tfontFamily: "${value2}"`;
            } else if (key2 === "fontSize") {
              result += `\t\tfontSize: ${value2}`;
            } else if (key2 === "fontWeight") {
              result += `\t\tfontWeight: ${value2.number}`;
            } else if (key2 === "fontStyle") {
              result += `\t\tfontStyle: ${value2}`;
            } else {
              result += `\t\tannotation.gap: ${value2}`;
            }
            if (!isLastBlockEntry) result += `,`;
            result += `\n`;
          } else {
            result += `\t\t${key2}: `;

            if (Array.isArray(value2)) {
              if (value2.length === 1) {
                result += `${JSON.stringify(value2[0])}`;
              } else {
                result += `(${value2[0]}, ${value2[1]})`;
              }
            } else {
              const bool = key2 === "layout" || key2 === "shape";
              result += `${bool ? value2 : JSON.stringify(value2)}`;
            }

            if (!isLastBlockEntry) {
              result += `,`;
            }

            result += `\n`;
          }
        }

        result += `\t]`;
        if (!isLastBlock || !isLastBodyEntry) {
          result += `,`;
        }
        result += `\n`;
      }
    } else if (key === "diagram") {
      result += `\tdiagram: [\n`;

      const diagramEntries = Object.entries(value);

      for (const [diagramIndex, [key2, value2]] of diagramEntries.entries()) {
        const isLastDiagramEntry = diagramIndex === diagramEntries.length - 1;

        if (key2 === "uses") {
          result += `\t\tuses: [`;

          for (const [useIndex, use] of value2.entries()) {
            result += `${use.id.name} = ${use.block.name}`;
            result += use.anchor ? ` anchor: ${use.anchor.name}` : "";
            if (useIndex !== value2.length - 1) {
              result += `, `;
            }
          }

          result += `]`;
          if (!isLastDiagramEntry) result += `,`;
          result += `\n`;
        } else if (key2 === "connects") {
          result += `\t\tconnects: [\n`;

          for (const [connectIndex, connect] of value2.entries()) {
            const isLastConnect = connectIndex === value2.length - 1;

            result += `\t\t\t`;
            result += `${connect.from.block.name}.${connect.from.node.name}.${connect.from.nodeAnchor}`;

            if (connect.from.portIndex) {
              result += `[${connect.from.portIndex.number}]`;
            }

            result += ` -> `;

            result += `${connect.to.block.name}.${connect.to.node.name}.${connect.to.nodeAnchor}`;

            if (connect.to.portIndex) {
              result += `[${connect.to.portIndex.number}]`;
            }

            if (connect.labelText !== undefined && connect.labelText !== null) {
              result += ` label.text: "${escapeDSLString(connect.labelText)}"`;
            }

            if (
              connect.labelFontColor !== undefined &&
              connect.labelFontColor !== null
            ) {
              result += ` label.fontColor: "${connect.labelFontColor}"`;
            }

            if (
              connect.labelFontFamily !== undefined &&
              connect.labelFontFamily !== null
            ) {
              result += ` label.fontFamily: "${connect.labelFontFamily}"`;
            }

            if (
              connect.labelFontSize !== undefined &&
              connect.labelFontSize !== null
            ) {
              result += ` label.fontSize: ${connect.labelFontSize}`;
            }

            if (connect.labelFontWeight) {
              result += ` label.fontWeight: ${connect.labelFontWeight.number}`;
            }

            if (
              connect.labelFontStyle !== undefined &&
              connect.labelFontStyle !== null
            ) {
              result += ` label.fontStyle: ${connect.labelFontStyle}`;
            }

            if (
              connect.labelShiftTop !== undefined &&
              connect.labelShiftTop !== null
            ) {
              result += ` label.shift.top: ${connect.labelShiftTop}`;
            }

            if (
              connect.labelShiftBottom !== undefined &&
              connect.labelShiftBottom !== null
            ) {
              result += ` label.shift.bottom: ${connect.labelShiftBottom}`;
            }

            if (
              connect.labelShiftLeft !== undefined &&
              connect.labelShiftLeft !== null
            ) {
              result += ` label.shift.left: ${connect.labelShiftLeft}`;
            }
            if (
              connect.labelShiftRight !== undefined &&
              connect.labelShiftRight !== null
            ) {
              result += ` label.shift.right: ${connect.labelShiftRight}`;
            }

            if (connect.shape) {
              result += ` shape: ${connect.shape}`;
            }

            if (
              connect.curveHeight !== undefined &&
              connect.curveHeight !== null
            ) {
              result += ` curveHeight: ${connect.curveHeight}`;
            }

            if (connect.width !== undefined && connect.width !== null) {
              result += ` width: ${connect.width}`;
            }

            if (
              connect.bidirectional !== undefined &&
              connect.bidirectional !== null
            ) {
              result += ` bidirectional: ${connect.bidirectional}`;
            }

            if (connect.headOnly !== undefined && connect.headOnly !== null) {
              result += ` headOnly: ${connect.headOnly}`;
            }

            if (connect.style) {
              result += ` style: ${connect.style}`;
            }

            if (connect.arrowheads) {
              result += ` arrowheads: ${connect.arrowheads.number}`;
            }

            if (
              connect.alignToIndexedPort !== undefined &&
              connect.alignToIndexedPort !== null
            ) {
              result += ` alignToIndexedPort: ${connect.alignToIndexedPort}`;
            }

            if (connect.edgeAnchorOffset) {
              result += ` edgeAnchorOffset: [${connect.edgeAnchorOffset[0]},${connect.edgeAnchorOffset[1]}]`;
            }

            if (
              connect.transition !== undefined &&
              connect.transition !== null
            ) {
              result += ` transition: ${connect.transition}`;
            }

            if (connect.gap !== undefined && connect.gap !== null) {
              result += ` gap: ${connect.gap}`;
            }

            if (connect.color !== undefined && connect.color !== null) {
              result += ` color: "${connect.color}"`;
            }

            if (!isLastConnect) {
              result += `,`;
            }

            result += `\n`;
          }

          result += `\t\t]`;
          if (!isLastDiagramEntry) result += `,`;
          result += `\n`;
        } else if (key2 === "annotations") {
          for (let i = 0; i < value2.length; i++) {
            const annotation = value2[i];

            const shiftEntries = [
              ["left", annotation.shiftLeft],
              ["right", annotation.shiftRight],
              ["top", annotation.shiftTop],
              ["bottom", annotation.shiftBottom],
            ].filter(([, v]) => v !== undefined && v !== null);

            const lines = [];

            if (annotation.value !== undefined) {
              lines.push(
                `\t\tannotation.${annotation.side}: "${
                  annotation.value.length === 1
                    ? escapeDSLString(annotation.value[0])
                    : escapeDSLString(annotation.value)
                }"`,
              );
            }

            for (const [shiftSide, shiftValue] of shiftEntries) {
              lines.push(
                `\t\tannotation.${annotation.side}.shift.${shiftSide}: ${shiftValue}`,
              );
            }

            for (let j = 0; j < lines.length; j++) {
              const isLastAnnotation = i === value2.length - 1;
              const isLastLineOfAnnotation = j === lines.length - 1;
              const needsComma =
                !isLastAnnotation ||
                !isLastLineOfAnnotation ||
                !isLastDiagramEntry;

              result += lines[j];

              if (needsComma) {
                result += `,`;
              }

              result += `\n`;
            }
          }
        } else if (
          key2 === "annotationFontFamily" ||
          key2 === "annotationFontSize" ||
          key2 === "annotationFontWeight" ||
          key2 === "annotationFontStyle" ||
          key2 === "annotationFontColor" ||
          key2 === "annotationGap"
        ) {
          if (key2 === "annotationFontWeight") {
            result += `\t\tannotation.fontWeight: ${value2.number}`;
          } else if (key2 === "annotationFontFamily") {
            result += `\t\tannotation.fontFamily: "${value2}"`;
          } else if (key2 === "annotationFontSize") {
            result += `\t\tannotation.fontSize: ${value2}`;
          } else if (key2 === "annotationFontStyle") {
            result += `\t\tannotation.fontStyle: ${value2}`;
          } else if (key2 === "annotationFontColor") {
            result += `\t\tannotation.fontColor: "${value2}"`;
          } else {
            result += `\t\tannotation.gap: ${value2}`;
          }

          if (!isLastDiagramEntry) result += `,`;
          result += `\n`;
        } else if (key2 === "rotateRight") {
          result += `\t\trotateRight: ${value2.number}\n`;
        } else {
          result += `\t\t${key2}: ${value2}`;
          if (!isLastDiagramEntry) result += `,`;
          result += `\n`;
        }
      }
      result += `\t]`;
      if (!isLastBodyEntry) result += `,`;
      result += `\n`;
    } else {
      result += `\t${key}: ${JSON.stringify(value)}`;
      if (!isLastBodyEntry) {
        result += `,`;
      }
      result += `\n`;
    }
  }

  return result;
}

function reconstructDefinition(def) {
  const { type, name, body } = def;
  if (!body) {
    console.error(`Error: No body found in definition for ${type} ${name}`);
    return `${type} ${name} = {}\n`;
  }

  let result = `${type} ${name} = {\n`;

  if (type !== "architecture") {
    for (const [key, value] of Object.entries(body)) {
      result += `\t${key}: ${formatValues(key, value, type)}\n`;
    }
  } else {
    result += reconstructArchitectureBody(body);
  }

  result += "}";
  return result;
}

function getMethodName(action, target, isPlural = false) {
  // Handle special cases for singular forms
  const singularMap = {
    nodes: "Node",
    edges: "Edge",
    children: "Child",
    values: "Value",
    colors: "Color",
    arrows: "Arrow",
    hidden: "Hidden",
    fontSize: "FontSize",
    fontWeight: "FontWeight",
    fontFamily: "FontFamily",
    align: "Align",
    lineSpacing: "LineSpacing",
    width: "Width",
    height: "Height",
  };

  // Handle special plural cases that don't follow standard rules
  const pluralExceptions = {
    hidden: "Hidden", // hidden stays the same in plural
    fontSize: "FontSizes", // fontSize -> FontSizes
    fontWeight: "FontWeights", // fontWeight -> FontWeights
    fontFamily: "FontFamilies", // fontFamily -> FontFamilies
    align: "Aligns", // align -> Aligns
  };

  let targetName;
  if (isPlural) {
    if (pluralExceptions[target]) {
      targetName = pluralExceptions[target];
    } else if (singularMap[target]) {
      targetName = singularMap[target] + "s";
    } else {
      targetName = capitalize(target) + "s";
    }
  } else {
    if (singularMap[target]) {
      targetName = singularMap[target];
    } else {
      targetName = capitalize(target);
    }
  }

  return `${action}${targetName}`;
}

// Helper function to get method name from command for type checking
export function getMethodNameFromCommand(command) {
  switch (command.type) {
    case "set":
      return getMethodName("set", command.target, false);
    case "set_multiple":
      return getMethodName("set", command.target, true);
    case "set_matrix":
      return getMethodName("set", command.target, false);
    case "set_matrix_multiple":
      return getMethodName("set", command.target, true);
    case "add":
      return getMethodName("add", command.target, false);
    case "insert":
      return getMethodName("insert", command.target, false);
    case "remove":
      return getMethodName("remove", command.target, false);
    case "remove_at":
      return "removeAt";
    case "remove_subtree":
      return "removeSubtree";
    case "add_child":
      return "addChild";
    case "set_child":
      return "setChild";
    case "add_matrix_row":
      return "addRow";
    case "add_matrix_column":
      return "addColumn";
    case "remove_matrix_row":
      return "removeRow";
    case "remove_matrix_column":
      return "removeColumn";
    case "add_matrix_border":
      return "addBorder";
    case "insert_matrix_row":
      return "insertRow";
    case "insert_matrix_column":
      return "insertColumn";

    case "set_text":
      return "setText";
    case "set_chained":
      // For chained commands, we need to get the target method name
      const targetMethodMap = {
        fontSize: "setFontSize",
        color: "setColor",
        fontWeight: "setFontWeight",
        fontFamily: "setFontFamily",
        align: "setAlign",
        value: "setValue",
        lineSpacing: "setLineSpacing",
        width: "setWidth",
        height: "setHeight",
      };
      return targetMethodMap[command.target] || command.target;
    default:
      return null;
  }
}

function isTextComponent(cmd) {
  // For now, check if the command has specific properties that indicate it's for a text component
  // This could be enhanced to actually look up the component type in the parsed DSL
  return (
    (cmd.target === "value" && typeof cmd.args === "string") ||
    (cmd.target === "value" &&
      cmd.args &&
      typeof cmd.args.value === "string") ||
    [
      "fontSize",
      "fontWeight",
      "fontFamily",
      "align",
      "lineSpacing",
      "width",
      "height",
    ].includes(cmd.target)
  );
}

function reconstructCommand(cmd) {
  switch (cmd.type) {
    case "page":
      if (cmd.layout && Array.isArray(cmd.layout) && cmd.layout.length === 2) {
        return `\npage ${cmd.layout[0]}x${cmd.layout[1]}`;
      }
      return "\npage";

    case "show":
      if (cmd.position) {
        return `show ${cmd.value} ${formatPosition(cmd.position)}`;
      }
      return `show ${cmd.value}`;

    case "hide":
      return `hide ${cmd.value}`;

    case "set":
      // Special handling for text components
      if (isTextComponent(cmd)) {
        // Check if it's an indexed operation or direct property setting
        if (cmd.args.index !== undefined) {
          // Array-style operation with index
          const methodName = getMethodNameFromCommand(cmd);
          const index = cmd.args.index;
          const value = formatValue(cmd.args.value, cmd.target);
          return `${cmd.name}.${methodName}(${index}, ${value})`;
        } else {
          //    console.log(cmd);
          // Direct property setting (no index)
          const methodName = getMethodNameFromCommand(cmd);
          const value = formatValue(cmd.args, cmd.target);
          return `${cmd.name}.${methodName}(${value})`;
        }
      } else {
        // Original array-based handling for other components
        const methodName = getMethodNameFromCommand(cmd);
        const index = cmd.args.index;
        const value = formatValue(cmd.args.value, cmd.target);
        return `${cmd.name}.${methodName}(${index}, ${value})`;
      }

    case "set_multiple":
      const pluralMethodName = getMethodNameFromCommand(cmd);
      const values = formatValues(cmd.target, cmd.args);
      return `${cmd.name}.${pluralMethodName}(${values})`;

    case "set_matrix":
      const matrixMethodName = getMethodNameFromCommand(cmd);
      const row = cmd.args.row;
      const col = cmd.args.col;
      const matrixValue = formatValue(cmd.args.value);
      return `${cmd.name}.${matrixMethodName}(${row}, ${col}, ${matrixValue})`;

    case "set_matrix_multiple":
      const matrixMultipleMethodName = getMethodNameFromCommand(cmd);
      const matrixMultipleValue = formatMatrix(cmd.args);
      return `${cmd.name}.${matrixMultipleMethodName}(${matrixMultipleValue})`;
    case "add_child":
      // Handles both addChild(parent-child) and addChild(parent-child, value)
      if (cmd.args && cmd.args.start && cmd.args.end) {
        return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${cmd.args.start}-${cmd.args.end})`;
      } else if (
        cmd.args &&
        cmd.args.index &&
        cmd.args.value !== undefined &&
        cmd.args.index.start &&
        cmd.args.index.end
      ) {
        return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${cmd.args.index.start}-${cmd.args.index.end}, ${formatValue(cmd.args.value)})`;
      }
      return null;

    case "set_child":
      // setChild(child, parent)
      if (cmd.args && cmd.args.start && cmd.args.end) {
        return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${cmd.args.start}-${cmd.args.end})`;
      }
      return null;

    case "add":
      const addMethodName = getMethodNameFromCommand(cmd);

      // Handle special case for nodes with optional value
      if (
        cmd.target === "nodes" &&
        cmd.args &&
        typeof cmd.args === "object" &&
        cmd.args.index !== undefined
      ) {
        const nodeName = formatValue(cmd.args.index, cmd.target);
        const nodeValue = formatValue(cmd.args.value, "");
        return `${cmd.name}.${addMethodName}(${nodeName}, ${nodeValue})`;
      } else {
        const addValue = formatValue(cmd.args, cmd.target);
        return `${cmd.name}.${addMethodName}(${addValue})`;
      }

    case "insert":
      const insertMethodName = getMethodNameFromCommand(cmd);

      // Handle special case for insertNode with optional third parameter
      if (cmd.target === "nodes" && cmd.args.nodeValue !== undefined) {
        const insertIndex = cmd.args.index;
        const insertNodeName = formatValue(cmd.args.value, cmd.target);
        const insertNodeValue = formatValue(cmd.args.nodeValue, "");
        return `${cmd.name}.${insertMethodName}(${insertIndex}, ${insertNodeName}, ${insertNodeValue})`;
      } else {
        const insertIndex = cmd.args.index;
        const insertValue = formatValue(cmd.args.value, cmd.target);

        return `${cmd.name}.${insertMethodName}(${insertIndex}, ${insertValue})`;
      }

    case "remove":
      const removeMethodName = getMethodNameFromCommand(cmd);
      const removeValue = formatValue(cmd.args, cmd.target);
      return `${cmd.name}.${removeMethodName}(${removeValue})`;

    case "remove_at":
      const removeAtIndex = cmd.args;
      return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${removeAtIndex})`;

    case "remove_subtree":
      const subtreeNode = formatValue(cmd.args, cmd.target);
      return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${subtreeNode})`;

    case "add_matrix_row": {
      const method = getMethodNameFromCommand(cmd);
      // Always reconstruct addRow, even with no args
      if (cmd.args === undefined || cmd.args === null) {
        return `${cmd.name}.${method}()`;
      }
      const value = formatValue(cmd.args);
      return `${cmd.name}.${method}([${value}])`;
    }

    case "add_matrix_column": {
      const method = getMethodNameFromCommand(cmd);
      // Always reconstruct addColumn, even with no args
      if (cmd.args === undefined || cmd.args === null) {
        return `${cmd.name}.${method}()`;
      }
      const value = formatValue(cmd.args);
      return `${cmd.name}.${method}([${value}])`;
    }

    case "remove_matrix_row":
      return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${cmd.args})`;

    case "remove_matrix_column":
      return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${cmd.args})`;

    case "add_matrix_border":
      const borderValue = formatValue(cmd.args.index);
      const borderColor = formatValue(cmd.args.value);
      return `${cmd.name}.${getMethodNameFromCommand(cmd)}(${borderValue}, ${borderColor})`;
    case "insert_matrix_row": {
      const methodRow = getMethodNameFromCommand(cmd);
      if (
        cmd.args &&
        cmd.args.index !== undefined &&
        cmd.args.value !== undefined
      ) {
        const valsRow = formatValues("value", cmd.args.value);
        return `${cmd.name}.${methodRow}(${cmd.args.index}, ${valsRow})`;
      }
      const argRow =
        cmd.args !== null && cmd.args !== undefined
          ? formatValue(cmd.args)
          : "";
      return `${cmd.name}.${methodRow}(${argRow})`;
    }
    case "insert_matrix_column": {
      const methodCol = getMethodNameFromCommand(cmd);
      if (
        cmd.args &&
        cmd.args.index !== undefined &&
        cmd.args.value !== undefined
      ) {
        const valsCol = formatValues("value", cmd.args.value);
        return `${cmd.name}.${methodCol}(${cmd.args.index}, ${valsCol})`;
      }
      const argCol =
        cmd.args !== null && cmd.args !== undefined
          ? formatValue(cmd.args)
          : "";
      return `${cmd.name}.${methodCol}(${argCol})`;
    }

    case "set_text": {
      const methodName = getMethodNameFromCommand(cmd);
      const text = formatValue(cmd.args.index); // text comes from index field
      const position = `"${cmd.args.value.value}"`; // position comes from token's value field, wrap in quotes
      return `${cmd.name}.${methodName}(${text}, ${position})`;
    }

    case "set_chained": {
      const methodName = getMethodNameFromCommand(cmd);
      const placement = Array.isArray(cmd.placement)
        ? cmd.placement[0].value
        : cmd.placement;

      // Handle different argument structures for chained commands
      if (cmd.target === "value" && Array.isArray(cmd.args)) {
        // setValue with array
        const values = formatValues("value", cmd.args);
        return `${cmd.name}.${placement}.${methodName}(${values})`;
      } else if (typeof cmd.args === "object" && cmd.args.index !== undefined) {
        // Indexed operation: obj.below.setColor(index, value)
        const index = cmd.args.index;
        const value = formatValue(cmd.args.value, cmd.target);
        return `${cmd.name}.${placement}.${methodName}(${index}, ${value})`;
      } else {
        // Direct operation: obj.below.setFontSize(16)
        const value = formatValue(cmd.args, cmd.target);
        return `${cmd.name}.${placement}.${methodName}(${value})`;
      }
    }

    case "set_block_annotation": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setBlockAnnotation(${block}, ${second}, "${third}")`;
    }

    case "set_block_color": {
      //console.log(cmd.args);
      const { index, value } = cmd.args;
      return `${cmd.name}.setBlockColor(${index}, "${value}")`;
    }

    case "set_block_layout": {
      //  console.log(cmd.args);
      const { index, value } = cmd.args;
      return `${cmd.name}.setBlockLayout(${index}, ${value})`;
    }

    case "block_remove_block": {
      return `${cmd.name}.removeBlock(${cmd.args})`;
    }

    case "set_group_annotation": {
      const { block, second, third, fourth } = cmd.args;
      return `${cmd.name}.setGroupAnnotation(${block}, ${second}, ${third}, "${fourth}")`;
    }

    case "set_group_color": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setGroupColor(${block}, ${second}, "${third}")`;
    }

    case "set_group_layout": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setGroupLayout(${block}, ${second}, ${third})`;
    }

    case "set_node_annotation": {
      const { block, second, third, fourth } = cmd.args;
      return `${cmd.name}.setNodeAnnotation(${block}, ${second}, ${third}, "${fourth}")`;
    }

    case "set_node_stroke": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setNodeStroke(${block}, ${second}, "${third}")`;
    }

    case "set_node_color": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setNodeColor(${block}, ${second}, "${third}")`;
    }
    case "set_edge_color": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setEdgeColor(${block}, ${second}, "${third}")`;
    }

    case "set_node_shape": {
      const { block, second, third } = cmd.args;
      if (
        (third.depth !== undefined &&
          third.height !== undefined &&
          third.width !== undefined) ||
        (third[0] !== undefined &&
          third[1] !== undefined &&
          third[2] !== undefined)
      ) {
        return `${cmd.name}.setNodeShape(${block}, ${second}, ${third.depth ?? third[0]}x${third.height ?? third[1]}x${third.width ?? third[2]})`;
      } else {
        return `${cmd.name}.setNodeShape(${block}, ${second}, ${third.rows ?? third[0]}x${third.columns ?? third[1]})`;
      }
    }

    case "set_node_label": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setNodeLabel(${block}, ${second}, "${third}")`;
    }
    case "set_edge_label": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setEdgeLabel(${block}, ${second}, "${third}")`;
    }

    case "set_edge_shape": {
      const { block, second, third } = cmd.args;
      return `${cmd.name}.setEdgeShape(${block}, ${second}, ${third})`;
    }

    case "block_remove_edge": {
      //  console.log(cmd.args);
      const { index, value } = cmd.args;
      return `${cmd.name}.removeEdge(${index}, ${value})`;
    }
    case "block_remove_node": {
      //  console.log(cmd.args);
      const { index, value } = cmd.args;
      return `${cmd.name}.removeNode(${index}, ${value})`;
    }

    case "block_remove_group": {
      //  console.log(cmd.args);
      const { index, value } = cmd.args;
      return `${cmd.name}.removeGroup(${index}, ${value})`;
    }

    case "set_neuralnetwork_neuron_setNeuron": {
      const { row, col, value } = cmd.args;
      return `${cmd.name}.setNeuron(${row}, ${col}, ${formatValue(value, "")})`;
    }

    case "set_neuralnetwork_neuron_setNeuronColor": {
      const { row, col, value } = cmd.args;
      return `${cmd.name}.setNeuronColor(${row}, ${col}, ${formatValue(value, "")})`;
    }

    case "set_neuralnetwork_layer": {
      const methodName = cmd.target === "layers" ? "setLayer" : "setLayerColor";

      //console.log(`cmd: ${JSON.stringify(cmd)},`);

      const formattedValue = formatValue(cmd.args.value, "");

      return `${cmd.name}.${methodName}(${cmd.args.index}, ${formattedValue})`;
    }

    case "set_neuralnetwork_neurons_multiple": {
      const methodName =
        cmd.target === "neurons" ? "setNeurons" : "setNeuronColors";
      const formatted = formatMatrix(cmd.args);

      return `${cmd.name}.${methodName}(${formatted})`;
    }

    case "set_neuralnetwork_layer_multiple": {
      const methodName =
        cmd.target === "layers" ? "setLayers" : "setLayerColors";

      //console.log(`cmd: ${JSON.stringify(cmd)},`)

      const formatted = formatValue(cmd.args, "");

      return `${cmd.name}.${methodName}(${formatted})`;
    }

    case "insert_neuralnetwork_addNeurons": {
      const methodName = "addNeurons";
      const row = cmd.args.index;

      //console.log(`cmd: ${JSON.stringify(cmd)},`)

      const formatted = formatValue(cmd.args.value, "");

      return `${cmd.name}.${methodName}(${row}, ${formatted})`;
    }

    case "insert_neuralnetwork_addLayer": {
      const methodName = "addLayer";
      const layerName = cmd.args.index[0];

      // console.log(`cmd: ${JSON.stringify(cmd)},`);

      const formatted = formatValue(cmd.args.value, "");

      return `${cmd.name}.${methodName}(${formatValue(layerName, "")}, ${formatted})`;
    }

    case "remove_neuralnetwork_removeLayerAt": {
      //  console.log(cmd);
      const methodName = "removeLayerAt";
      const index = cmd.args;

      // console.log(`cmd: ${JSON.stringify(cmd)},`);

      const formatted = formatValue(index, "");

      return `${cmd.name}.${methodName}(${formatted})`;
    }

    case "remove_neuralnetwork_removeNeuronsFromLayer": {
      const methodName = "removeNeuronsFromLayer";
      const layerIndex = cmd.args?.index;

      const neurons = formatValue(cmd.args.value, "");

      return `${cmd.name}.${methodName}(${layerIndex}, ${neurons})`;
    }
    default:
      console.warn(`Reconstructing unknown command type: ${cmd.type}`);
      return null;
  }
}

export function formatPosition(position) {
  if (!position) {
    return "";
  }

  // Handle keyword-type positions
  if (typeof position === "object" && position.type === "keyword") {
    return position.value;
  }

  // Handle the new shape-based position format
  if (typeof position === "object" && position.originalPosition) {
    position = position.originalPosition;
  }

  // Handle array-type positions (coordinate tuples)
  if (Array.isArray(position)) {
    const [x, y] = position;

    function formatPositionValue(value) {
      if (value && typeof value === "object" && value.type === "range") {
        return `${value.start}..${value.end}`;
      }
      return value;
    }

    const xStr = formatPositionValue(x);
    const yStr = formatPositionValue(y);

    return `(${xStr}, ${yStr})`;
  }

  // For any other format, return as-is (fallback)
  return "";
}

function formatMatrix(matrix) {
  if (!Array.isArray(matrix)) {
    return formatValue(matrix);
  }

  // Handle 2D arrays for matrix
  if (Array.isArray(matrix[0])) {
    return `[${matrix.map((row) => `[${row.map((item) => formatValue(item)).join(", ")}]`).join(", ")}]`;
  }

  // Fallback to regular array formatting
  return `[${matrix.map((item) => formatValue(item)).join(", ")}]`;
}

function formatValues(key, value, type = undefined) {
  if (!Array.isArray(value)) {
    return formatValue(value, key, type);
  }

  if (key === "edgeColor") {
    return `"${value[0]}"`;
  }

  // Handle 2D arrays used by neuralnetwork and matrix-like data
  if (
    ["neurons", "neuronColors", "value", "color", "arrow"].includes(key) &&
    value.some(Array.isArray)
  ) {
    return `[${value
      .map((row) =>
        Array.isArray(row)
          ? `[${row.map((item) => formatValue(item, key)).join(", ")}]`
          : formatValue(row, key),
      )
      .join(", ")}]`;
  }

  switch (key) {
    case "nodes":
      return `[${value.map((item) => formatValue(item, "nodes")).join(", ")}]`;

    case "edges":
      return `[${value.map((edge) => `${edge.start}-${edge.end}`).join(", ")}]`;

    case "children":
      return `[${value
        .map((child) => `${child.start}-${child.end}`)
        .join(", ")}]`;

    default:
      return `[${value.map((item) => formatValue(item, key)).join(", ")}]`;
  }
}

function formatValue(value, target = null, type = undefined) {
  if (Array.isArray(value)) {
    return `[${value.map((v) => formatValue(v, target)).join(", ")}]`;
  }

  if (target === "edgeWidth" && type === "neuralnetwork") return value.number;
  if (target === "labelPosition" && type === "neuralnetwork") return value;
  if (value === "_") return "_";
  if (target === "nodes") return value;
  if (value === null || value === undefined) return "null";
  if (typeof value === "string") return `"${value}"`;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value.toString();

  if (
    value &&
    typeof value === "object" &&
    value.name &&
    !value.start &&
    !value.end
  ) {
    return value.name;
  }

  if (value && typeof value === "object" && value.start && value.end) {
    return `${value.start}-${value.end}`;
  }

  return String(value);
}

function capitalize(str) {
  if (typeof str !== "string" || str.length === 0) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}
