// This file defines some functions to handle GUI Editor changes and merging commands, it operates on the parsed code structure to create optimized commands for value updates.

/**
 * Creates optimized commands for array, matrix, and position field value updates
 */
export function createOptimizedCommand(
  relevantCommands,
  componentName,
  fieldKey,
  coordinates,
  value,
  componentDefinition = null,
) {
  // Handle position field updates
  if (fieldKey === "position") {
    return createOptimizedPositionCommand(
      relevantCommands,
      componentName,
      value,
    );
  }

  if (componentDefinition.type === "architecture") {
    if (coordinates.isArchitectureMatrix) {
      return createOptimizedArchitectureCommand2d(
        relevantCommands,
        componentName,
        fieldKey,
        coordinates.row,
        coordinates.col,
        value,
        componentDefinition,
      );
    } else {
      return createOptimizedArchitectureCommand1d(
        relevantCommands,
        componentName,
        fieldKey,
        coordinates.index,
        value,
        componentDefinition,
      );
    }
  }

  if (componentDefinition.type === "neuralnetwork") {
    if (coordinates.isNeuralMatrix) {
      return createOptimizedNeuralNetworkCommandNeurons(
        relevantCommands,
        componentName,
        fieldKey,
        coordinates.row,
        coordinates.col,
        value,
        componentDefinition,
      );
    } else {
      return createOptimizedNeuralNetworkCommandLayers(
        relevantCommands,
        componentName,
        fieldKey,
        coordinates.index,
        value,
        componentDefinition,
      );
    }
  }

  // Handle global text properties (no coordinates)
  if (!coordinates) {
    return createOptimizedGlobalCommand(
      relevantCommands,
      componentName,
      fieldKey,
      value,
    );
  }

  const isMatrix = coordinates.isMatrix;

  if (isMatrix) {
    return createOptimizedMatrixCommand(
      relevantCommands,
      componentName,
      fieldKey,
      coordinates.row,
      coordinates.col,
      value,
    );
  } else {
    return createOptimizedArrayCommand(
      relevantCommands,
      componentName,
      fieldKey,
      coordinates.index,
      value,
      componentDefinition,
    );
  }
}

/**
 * Finds commands that affect a specific component and field on a page
 */
export function findRelevantCommands(
  commands,
  pageStartIndex,
  pageEndIndex,
  componentName,
  fieldKey,
  isMatrix = false,
  isNeuralMatrix = false,
  coordinates = null,
  currentComponent,
) {
  const relevantCommands = [];
  const commandsToRemove = [];

  // Handle position field commands
  if (fieldKey === "position") {
    const targetTypes = ["show"];

    for (let i = pageStartIndex; i < pageEndIndex; i++) {
      const cmd = commands[i];
      if (targetTypes.includes(cmd.type) && cmd.value === componentName) {
        relevantCommands.push(cmd);
        commandsToRemove.push(i);
      }
    }

    return { relevantCommands, commandsToRemove };
  }

  // Check if this is a global property (coordinates is null)
  if (coordinates === null) {
    // For global properties, look for simple set commands (without index)
    const targetTypes = ["set"];

    for (let i = pageStartIndex; i < pageEndIndex; i++) {
      const cmd = commands[i];
      if (
        targetTypes.includes(cmd.type) &&
        cmd.name === componentName &&
        cmd.target === fieldKey &&
        // Global set commands have args as direct value, not object with index
        (typeof cmd.args !== "object" || !cmd.args.hasOwnProperty("index"))
      ) {
        relevantCommands.push(cmd);
        commandsToRemove.push(i);
      }
    }

    return { relevantCommands, commandsToRemove };
  }

  /* console.log(`commands: ${JSON.stringify(commands)}}`);
  console.log(`componentName: ${componentName}`);
  console.log(`fieldKey: ${fieldKey}`);
  console.log(`coordinates: ${JSON.stringify(coordinates)}`);
  console.log(`currentComponent: ${JSON.stringify(currentComponent)}`);*/

  const targetTypesNeural = isNeuralMatrix
    ? [
        "set_neuralnetwork_neuron_setNeuron",
        "set_neuralnetwork_neuron_setNeuronColor",
        "set_neuralnetwork_neurons_multiple",
      ]
    : ["set_neuralnetwork_layer_multiple", "set_neuralnetwork_layer"];

  const targetTypesMatrix = isMatrix
    ? ["set_matrix", "set_matrix_multiple"]
    : ["set", "set_multiple"];

  const targetType =
    currentComponent.type === "neuralnetwork"
      ? targetTypesNeural
      : targetTypesMatrix;

  for (let i = pageStartIndex; i < pageEndIndex; i++) {
    const cmd = commands[i];
    if (targetType.includes(cmd.type) && cmd.name === componentName) {
      relevantCommands.push(cmd);
      commandsToRemove.push(i);
    }
  }

  return { relevantCommands, commandsToRemove };
}

/**
 * Internal function for global command optimization (properties without coordinates)
 */
function createOptimizedGlobalCommand(
  relevantCommands,
  componentName,
  fieldKey,
  value,
) {
  // For global properties, we just create a single command
  // No need to merge multiple commands since it's a single value

  // If value is null, undefined, or empty string, don't create a command (effectively clearing the property)
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "null"
  ) {
    return null;
  }

  return {
    type: "set",
    target: fieldKey,
    args: value, // For global properties, args is just the value, not an object with index
    name: componentName,
    line: 0,
    col: 0,
  };
}

function createOptimizedArchitectureCommand1d(
  relevantCommands,
  componentName,
  fieldKey,
  index,
  value,
  componentDefinition,
) {
  /*console.log("createOptimizedArchitectureCommand");
  console.log("relevantCommands");
  console.log(relevantCommands);
  console.log("componentName");
  console.log(componentName);
  console.log("fieldKey");
  console.log(fieldKey);
  console.log("index");
  console.log(index);
  console.log("value");
  console.log(value);
  console.log("componentDefinition");
  console.log(componentDefinition);*/
  const result = [];

  if (
    fieldKey === "value" ||
    fieldKey === "color" ||
    fieldKey === "shapeEdge" ||
    fieldKey === "layout" ||
    fieldKey === "annotation" ||
    fieldKey === "layout"
  ) {
    const blockLength = componentDefinition.body?.blocks.length ?? 0;

    if (index < blockLength) {
      const blockId = componentDefinition.body.blocks[index].id.name;
      if (fieldKey === "color" || fieldKey === "layout") {
        result.push({
          type: fieldKey === "color" ? "set_block_color" : "set_block_layout",
          args: {
            index: blockId,
            value,
          },
          name: componentName,
          line: 0,
          col: 0,
        });
      } else if (fieldKey === "annotation") {
        if (
          value.value !== undefined &&
          value.value !== null &&
          value.side !== undefined &&
          value.side !== null
        ) {
          result.push({
            type: "set_block_annotation",
            args: {
              block: blockId,
              second: value.side,
              third: value.value,
            },
            name: componentName,
            line: 0,
            col: 0,
          });
        }
      }
    } else if (index >= blockLength) {
      let type;
      if (fieldKey === "value") {
        type = "set_edge_label";
      } else if (fieldKey === "color") {
        type = "set_edge_color";
      } else if (fieldKey === "shapeEdge") {
        type = "set_edge_shape";
      }
      result.push({
        type,
        args: {
          block: "diagram",
          second: index - blockLength,
          third: value,
        },
        name: componentName,
        line: 0,
        col: 0,
      });
    }
  }

  return result;
}

function createOptimizedArchitectureCommand2d(
  relevantCommands,
  componentName,
  fieldKey,
  row,
  col,
  value,
  componentDefinition,
) {
  /*console.log("createOptimizedArchitectureCommandBlock");
  console.log("relevantCommands");
  console.log(relevantCommands);
  console.log("componentName");
  console.log(componentName);
  console.log("fieldKey");
  console.log(fieldKey);
  console.log("row");
  console.log(row);
  console.log("col");
  console.log(col);
  console.log("value");
  console.log(value);
  console.log("componentDefinition");
  console.log(componentDefinition);*/
  const result = [];

  if (
    fieldKey === "value" ||
    fieldKey === "color" ||
    fieldKey === "stroke" ||
    fieldKey === "annotation" ||
    fieldKey === "shapeEdge" ||
    fieldKey === "layout" ||
    fieldKey === "shapeStacked" ||
    fieldKey === "shapeFlatten"
  ) {
    const blockId = componentDefinition.body.blocks[row].id.name;
    const nodesLength =
      componentDefinition.body?.blocks?.[row]?.nodes?.length ?? 0;
    const edgesLength =
      componentDefinition.body?.blocks?.[row]?.edges?.length ?? 0;
    let id;
    let type;

    if (col < nodesLength) {
      id = componentDefinition.body.blocks[row].nodes[col].id.name;
      if (fieldKey === "value") {
        type = "set_node_label";
      } else if (fieldKey === "color") {
        type = "set_node_color";
      } else if (fieldKey === "stroke") {
        type = "set_node_stroke";
      } else if (fieldKey === "annotation") {
        type = "set_node_annotation";
      } else if (fieldKey === "shapeStacked" || fieldKey === "shapeFlatten") {
        type = "set_node_shape";
      }
    } else if (nodesLength <= col && col < edgesLength + nodesLength) {
      id =
        componentDefinition.body.blocks[row].edges[col - nodesLength].id.name;
      if (fieldKey === "value") {
        type = "set_edge_label";
      } else if (fieldKey === "color") {
        type = "set_edge_color";
      } else if (fieldKey === "shapeEdge") {
        type = "set_edge_shape";
      }
    } else if (col >= nodesLength + edgesLength) {
      id =
        componentDefinition.body.blocks[row].groups[
          col - nodesLength - edgesLength
        ].id.name;
      if (fieldKey === "layout") {
        type = "set_group_layout";
      } else if (fieldKey === "color") {
        type = "set_group_color";
      } else if (fieldKey === "annotation") {
        type = "set_group_annotation";
      }
    }

    if (fieldKey === "annotation") {
      if (
        value.value !== undefined &&
        value.value !== null &&
        value.side !== undefined &&
        value.side !== null
      ) {
        result.push({
          type,
          args: {
            block: blockId,
            second: id,
            third: value.side,
            fourth: value.value,
          },
          name: componentName,
          line: 0,
          col: 0,
        });
      }
    } else if (fieldKey === "shapeStacked") {
      if (
        value.depth !== undefined &&
        value.depth !== null &&
        value.height !== undefined &&
        value.height !== null &&
        value.width !== undefined &&
        value.width !== null &&
        value.depth >= 0 &&
        value.height >= 0 &&
        value.width >= 0
      ) {
        result.push({
          args: {
            block: blockId,
            second: id,
            third: value,
          },
          name: componentName,
          line: 0,
          col: 0,
        });
      }
    } else if (fieldKey === "shapeFlatten") {
      if (
        value.rows !== undefined &&
        value.rows !== null &&
        value.columns !== undefined &&
        value.columns !== null &&
        value.rows >= 0 &&
        value.columns >= 0
      ) {
        result.push({
          type,
          args: {
            block: blockId,
            second: id,
            third: value,
          },
          name: componentName,
          line: 0,
          col: 0,
        });
      }
    } else {
      result.push({
        type,
        args: {
          block: blockId,
          second: id,
          third: value,
        },
        name: componentName,
        line: 0,
        col: 0,
      });
    }
  }

  return result;
}

function createOptimizedNeuralNetworkCommandLayers(
  relevantCommands,
  componentName,
  fieldKey,
  index,
  value,
  componentDefinition,
) {
  /*console.log(`relevantCommands: ${JSON.stringify(relevantCommands)}}`);
  console.log(`componentName: ${componentName}`);
  console.log(`fieldKey: ${fieldKey}`);
  console.log(`index: ${index}`);
  console.log(`value: ${value}`);*/

  const mergedModificationsColors = new Map();
  const mergedModificationsLayers = new Map();
  const result = [];

  for (const cmd of relevantCommands) {
    if (cmd.type === "set_neuralnetwork_layer") {
      if (cmd.target === "layers") {
        if (value !== "_" && value !== undefined) {
          mergedModificationsLayers.set(cmd.args.index, cmd.args.value);
        }
      }

      if (cmd.target === "layerColors") {
        if (value !== "_" && value !== undefined) {
          mergedModificationsColors.set(cmd.args.index, cmd.args.value);
        }
      }
    }
    if (cmd.type === "set_neuralnetwork_layer_multiple") {
      if (cmd.target === "layers") {
        cmd.args.forEach((val, index) => {
          if (val !== "_" && val !== undefined) {
            mergedModificationsLayers.set(index, val);
          }
        });
      }

      if (cmd.target === "layerColors") {
        cmd.args.forEach((val, index) => {
          if (val !== "_" && val !== undefined) {
            mergedModificationsColors.set(index, val);
          }
        });
      }
    }
  }

  if (fieldKey === "value") {
    mergedModificationsLayers.set(index, value);
  }
  if (fieldKey === "color") {
    mergedModificationsColors.set(index, value);
  }

  if (
    mergedModificationsColors.size === 0 &&
    mergedModificationsLayers.size === 0
  ) {
    return [];
  }

  if (
    mergedModificationsColors.size === 1 &&
    !(value === "_" || value === undefined)
  ) {
    const [[key, valueMerged]] = mergedModificationsColors;

    result.push({
      type: "set_neuralnetwork_layer",
      target: "layerColors",
      args: {
        index: key,
        value: valueMerged,
      },
      name: componentName,
      line: 0,
      col: 0,
    });
  }
  if (
    mergedModificationsColors.size > 1 &&
    !(value === "_" || value === undefined)
  ) {
    const length = componentDefinition.body.neurons.length;

    const arrayColor = Array(length).fill("_");

    for (const [key, val] of mergedModificationsColors) {
      arrayColor[key] = val;
    }

    result.push({
      type: "set_neuralnetwork_layer_multiple",
      target: "layerColors",
      args: arrayColor,
      name: componentName,
      line: 0,
      col: 0,
    });
  }

  if (
    mergedModificationsLayers.size === 1 &&
    !(value === "_" || value === undefined)
  ) {
    const [[key, valueMerged]] = mergedModificationsLayers;

    result.push({
      type: "set_neuralnetwork_layer",
      target: "layers",
      args: {
        index: key,
        value: valueMerged,
      },
      name: componentName,
      line: 0,
      col: 0,
    });
  }
  if (
    mergedModificationsLayers.size > 1 &&
    !(value === "_" || value === undefined)
  ) {
    const length = componentDefinition.body.neurons.length;

    const arrayLayers = Array(length).fill("_");

    for (const [key, val] of mergedModificationsLayers) {
      arrayLayers[key] = val;
    }

    result.push({
      type: "set_neuralnetwork_layer_multiple",
      target: "layers",
      args: arrayLayers,
      name: componentName,
      line: 0,
      col: 0,
    });
  }

  return result;
}

function createOptimizedNeuralNetworkCommandNeurons(
  relevantCommands,
  componentName,
  fieldKey,
  row,
  col,
  value,
  componentDefinition,
) {
  const mergedModificationsColors = new Map();
  const mergedModificationsNeurons = new Map();

  const result = [];

  // Process existing commands in order
  for (const cmd of relevantCommands) {
    if (cmd.type === "set_neuralnetwork_neuron_setNeuronColor") {
      if (value !== "_" && value !== undefined) {
        const key = `${cmd.args.row},${cmd.args.col}`;
        mergedModificationsColors.set(key, cmd.args.value);
      }
    }

    if (cmd.type === "set_neuralnetwork_neuron_setNeuron") {
      if (value !== "_" && value !== undefined) {
        const key = `${cmd.args.row},${cmd.args.col}`;
        mergedModificationsNeurons.set(key, cmd.args.value);
      }
    }

    if (cmd.type === "set_neuralnetwork_neurons_multiple") {
      if (cmd.target === "neurons") {
        cmd.args.forEach((rowArray, rowIdx) => {
          rowArray.forEach((val, colIdx) => {
            if (val !== "_" && val !== undefined) {
              const key = `${rowIdx},${colIdx}`;
              mergedModificationsNeurons.set(key, val);
            }
          });
        });
      }

      if (cmd.target === "neuronColors") {
        cmd.args.forEach((rowArray, rowIdx) => {
          rowArray.forEach((val, colIdx) => {
            if (val !== "_" && val != undefined) {
              const key = `${rowIdx},${colIdx}`;
              mergedModificationsColors.set(key, val);
            }
          });
        });
      }
    }
  }

  const key = `${row},${col}`;
  if (fieldKey === "value") {
    mergedModificationsNeurons.set(key, value);
  }
  if (fieldKey === "color") {
    mergedModificationsColors.set(key, value);
  }

  if (
    mergedModificationsColors.size === 0 &&
    mergedModificationsNeurons.size === 0
  ) {
    return [];
  }

  if (
    mergedModificationsColors.size === 1 &&
    !(value === "_" || value === undefined)
  ) {
    const [[key, valueMerged]] = mergedModificationsColors;
    const [rowMerged, colMerged] = key.split(",").map(Number);

    result.push({
      type: "set_neuralnetwork_neuron_setNeuronColor",
      target: "neuronColor",
      args: {
        row: rowMerged,
        col: colMerged,
        value: valueMerged,
      },
      name: componentName,
      line: 0,
      col: 0,
    });
  }
  if (
    mergedModificationsColors.size > 1 &&
    !(value === "_" || value === undefined)
  ) {
    const args = [];

    for (const element of componentDefinition.body.neurons) {
      const column = Array(element.length).fill("_");
      args.push(column);
    }

    for (const [key, val] of mergedModificationsColors) {
      const [r, c] = key.split(",").map(Number);
      args[r][c] = val;
    }

    result.push({
      type: "set_neuralnetwork_neurons_multiple",
      target: "neuronColors",
      args,
      name: componentName,
      line: 0,
      col: 0,
    });
  }

  if (
    mergedModificationsNeurons.size === 1 &&
    !(value === "_" || value === undefined)
  ) {
    const [[key, valueMerged]] = mergedModificationsNeurons;
    const [rowMerged, colMerged] = key.split(",").map(Number);

    result.push({
      type: "set_neuralnetwork_neuron_setNeuron",
      target: "neurons",
      args: {
        row: rowMerged,
        col: colMerged,
        value: Number.isNaN(Number(valueMerged))
          ? valueMerged
          : Number(valueMerged),
      },
      name: componentName,
      line: 0,
      col: 0,
    });
  }

  if (
    mergedModificationsNeurons.size > 1 &&
    !(value === "_" || value === undefined)
  ) {
    const args = [];

    for (const element of componentDefinition.body.neurons) {
      const column = Array(element.length).fill("_");
      args.push(column);
    }

    for (const [key, val] of mergedModificationsNeurons) {
      const [r, c] = key.split(",").map(Number);
      args[r][c] = val;
    }

    result.push({
      type: "set_neuralnetwork_neurons_multiple",
      target: "neurons",
      args,
      name: componentName,
      line: 0,
      col: 0,
    });
  }

  return result;
}
/**
 * Internal function for array command optimization
 */
function createOptimizedArrayCommand(
  relevantCommands,
  componentName,
  fieldKey,
  idx,
  value,
  componentDefinition = null,
) {
  // Create a merged state of all modifications
  const mergedModifications = new Map(); // index -> value

  // Process existing commands in order
  for (const cmd of relevantCommands) {
    if (cmd.type === "set") {
      const index = cmd.args.index;
      const cmdValue = cmd.args.value;
      mergedModifications.set(index, cmdValue);
    } else if (cmd.type === "set_multiple") {
      if (Array.isArray(cmd.args)) {
        cmd.args.forEach((val, idx) => {
          if (val !== "_") {
            mergedModifications.set(idx, val);
          }
        });
      } else {
        // Handle object format
        for (const [key, val] of Object.entries(cmd.args)) {
          if (val !== "_") {
            mergedModifications.set(key, val);
          }
        }
      }
    }
  }
  // Handle the new modification
  if (value === "_" || value === undefined) {
    // Remove the modification (undo/clear)
    mergedModifications.delete(idx);
  } else {
    // Add the new modification
    mergedModifications.set(idx, value);
  }
  // Determine the new command to add
  if (mergedModifications.size === 0) {
    // No modifications left, don't add any command
    return null;
  } else if (
    mergedModifications.size === 1 &&
    mergedModifications.has(idx) &&
    !(value === "_" || value === undefined)
  ) {
    // Only one modification, use "set"
    return {
      type: "set",
      target: fieldKey,
      args: {
        index: idx,
        value: value,
      },
      name: componentName,
      line: 0,
      col: 0,
    };
  } else {
    // Multiple modifications, use "set_multiple"
    const keys = Array.from(mergedModifications.keys());

    // Special handling for array fields that should always output arrays
    if (
      fieldKey === "arrows" ||
      fieldKey === "arrow" ||
      fieldKey === "colors" ||
      fieldKey === "color"
    ) {
      // For trees/graphs with node-based indexing, we need to map node names to indices
      const nodeToIndexMap = new Map();
      let maxArraySize = 0;

      // If we have component definition with nodes, use it for mapping
      if (
        componentDefinition &&
        componentDefinition.body &&
        componentDefinition.body.nodes
      ) {
        const nodes = componentDefinition.body.nodes;
        nodes.forEach((nodeName, index) => {
          nodeToIndexMap.set(nodeName, index);
        });
        maxArraySize = nodes.length;
      } else {
        // Fallback: analyze existing commands to understand the node structure
        for (const cmd of relevantCommands) {
          if (cmd.type === "set" && typeof cmd.args.index === "number") {
            maxArraySize = Math.max(maxArraySize, cmd.args.index + 1);
          } else if (cmd.type === "set_multiple" && Array.isArray(cmd.args)) {
            maxArraySize = Math.max(maxArraySize, cmd.args.length);
          }
        }

        // For unknown node names, assign them to the next available indices
        let nextIndex = maxArraySize;
        for (const [key, val] of mergedModifications) {
          if (isNaN(key) || !Number.isInteger(Number(key))) {
            if (!nodeToIndexMap.has(key)) {
              nodeToIndexMap.set(key, nextIndex);
              nextIndex++;
            }
          }
        }
        maxArraySize = Math.max(maxArraySize, nextIndex);
      }

      // Also consider the current modifications to expand array size if needed
      for (const [key, val] of mergedModifications) {
        if (!isNaN(key) && Number.isInteger(Number(key))) {
          maxArraySize = Math.max(maxArraySize, Number(key) + 1);
        }
      }

      const args = new Array(maxArraySize).fill("_");

      // Fill in all modifications using resolved indices
      for (const [key, val] of mergedModifications) {
        let index;
        if (!isNaN(key) && Number.isInteger(Number(key))) {
          index = Number(key);
        } else {
          index = nodeToIndexMap.get(key);
        }

        if (index !== undefined && index >= 0 && index < args.length) {
          args[index] = val;
        }
      }

      return {
        type: "set_multiple",
        target: fieldKey,
        args: args,
        name: componentName,
        line: 0,
        col: 0,
      };
    }

    const allNumeric = keys.every(
      (k) =>
        typeof k === "number" || (!isNaN(k) && Number.isInteger(Number(k))),
    );

    if (allNumeric) {
      // All keys are numeric, use array format
      const numericKeys = keys.map(Number);
      const maxIndex = Math.max(...numericKeys);
      const args = new Array(maxIndex + 1).fill("_");

      // Fill in the modifications
      for (const [index, val] of mergedModifications) {
        args[Number(index)] = val;
      }

      return {
        type: "set_multiple",
        target: fieldKey,
        args: args,
        name: componentName,
        line: 0,
        col: 0,
      };
    } else {
      // Mixed or string keys, use object format
      const args = {};
      for (const [key, val] of mergedModifications) {
        args[key] = val;
      }

      return {
        type: "set_multiple",
        target: fieldKey,
        args: args,
        name: componentName,
        line: 0,
        col: 0,
      };
    }
  }
}

/**
 * Internal function for matrix command optimization
 */
function createOptimizedMatrixCommand(
  relevantCommands,
  componentName,
  fieldKey,
  row,
  col,
  value,
) {
  // Create a merged state of all modifications
  const mergedModifications = new Map(); // "row,col" -> value

  // Process existing commands in order
  for (const cmd of relevantCommands) {
    if (cmd.type === "set_matrix") {
      const key = `${cmd.args.row},${cmd.args.col}`;
      mergedModifications.set(key, cmd.args.value);
    } else if (cmd.type === "set_matrix_multiple") {
      // Process 2D array
      cmd.args.forEach((rowArray, rowIdx) => {
        rowArray.forEach((val, colIdx) => {
          if (val !== "_") {
            const key = `${rowIdx},${colIdx}`;
            mergedModifications.set(key, val);
          }
        });
      });
    }
  }

  // Handle the new modification
  const currentKey = `${row},${col}`;
  if (value === "_" || value === undefined) {
    // Remove the modification (undo/clear)
    mergedModifications.delete(currentKey);
  } else {
    // Add the new modification
    mergedModifications.set(currentKey, value);
  }

  // Determine the new command to add
  if (mergedModifications.size === 0) {
    // No modifications left, don't add any command
    return null;
  } else if (
    mergedModifications.size === 1 &&
    mergedModifications.has(currentKey) &&
    !(value === "_" || value === undefined)
  ) {
    // Only one modification, use "set_matrix"
    return {
      type: "set_matrix",
      target: fieldKey,
      args: {
        row: row,
        col: col,
        value: value,
      },
      name: componentName,
      line: 0,
      col: 0,
    };
  } else {
    // Multiple modifications, use "set_matrix_multiple"
    // Find the maximum dimensions
    const coordinates = Array.from(mergedModifications.keys()).map((key) => {
      const [r, c] = key.split(",").map(Number);
      return { row: r, col: c };
    });

    const maxRow = Math.max(...coordinates.map((coord) => coord.row));
    const maxCol = Math.max(...coordinates.map((coord) => coord.col));

    // Create 2D array filled with "_"
    const args = Array(maxRow + 1)
      .fill(null)
      .map(() => Array(maxCol + 1).fill("_"));

    // Fill in the modifications
    for (const [key, val] of mergedModifications) {
      const [r, c] = key.split(",").map(Number);
      args[r][c] = val;
    }

    return {
      type: "set_matrix_multiple",
      target: fieldKey,
      args: args,
      name: componentName,
      line: 0,
      col: 0,
    };
  }
}

/**
 * Internal function for position command optimization
 */
function createOptimizedPositionCommand(
  relevantCommands,
  componentName,
  value,
) {
  // Find the most recent show command for this component
  let baseShowCommand = null;

  for (const cmd of relevantCommands) {
    if (cmd.type === "show" && cmd.value === componentName) {
      baseShowCommand = cmd;
    }
  }

  // Create the base command structure, preserving existing properties if available
  const newCommand = {
    type: "show",
    value: componentName,
    line: baseShowCommand?.line || 0,
    col: baseShowCommand?.col || 0,
  };

  // Preserve any other properties from the base command (except position)
  if (baseShowCommand) {
    Object.keys(baseShowCommand).forEach((key) => {
      if (
        key !== "type" &&
        key !== "value" &&
        key !== "position" &&
        key !== "line" &&
        key !== "col"
      ) {
        newCommand[key] = baseShowCommand[key];
      }
    });
  }

  // Handle position value
  if (value && value.trim() !== "") {
    newCommand.position = parsePositionValue(value);
  }
  // If no position value, the command will not have a position property (removing position)

  return newCommand;
}

/**
 * Parse position value from string to proper structure expected by reconstructor
 */
function parsePositionValue(value) {
  if (!value || typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  // Handle position keywords (like "center", "top-left", "tl")
  const keywordMatch = trimmed.match(/^([a-zA-Z]+(?:-[a-zA-Z]+)?)$/);
  if (keywordMatch) {
    return {
      type: "keyword",
      value: keywordMatch[1],
      line: 0,
      col: 0,
    };
  }

  // Handle coordinate tuple format "(x,y)" where x or y can be ranges
  const tupleMatch = trimmed.match(/^\(([^,]+),\s*([^)]+)\)$/);
  if (tupleMatch) {
    const xStr = tupleMatch[1].trim();
    const yStr = tupleMatch[2].trim();

    const parsePositionComponent = (str) => {
      // Check for range format like "0..1"
      const rangeMatch = str.match(/^(\d+)\.\.(\d+)$/);
      if (rangeMatch) {
        return {
          type: "range",
          start: parseInt(rangeMatch[1]),
          end: parseInt(rangeMatch[2]),
        };
      }
      // Simple number
      const numMatch = str.match(/^\d+$/);
      if (numMatch) {
        return parseInt(str);
      }
      // Return as-is if not recognized
      return str;
    };

    return [parsePositionComponent(xStr), parsePositionComponent(yStr)];
  }

  // If we can't parse it, return as-is
  return value;
}

/**
 * Creates optimized commands for matrix structure modifications
 */
export function createOptimizedMatrixStructureCommand(
  componentName,
  commandType,
  index,
) {
  return {
    type: commandType,
    target: "value", // Matrix structural changes affect all properties
    args: index,
    name: componentName,
    line: 0,
    col: 0,
  };
}
