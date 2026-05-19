import React, { useState, useEffect, useRef } from "react";

import "react-resizable/css/styles.css";
import {
  Box,
  Typography,
  Button,
  Slider,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Divider,
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

import parseText from "../../parser/parseText.mjs";
import reconstructDSL from "../../parser/reconstructor.mjs";

const DEFAULT_LAYER_COLOR = "#C8E3F5";
const DEFAULT_LAYER_STROKE = "#000000";

const cloneMatrix = (value) =>
  Array.isArray(value)
    ? value.map((row) => (Array.isArray(row) ? [...row] : row))
    : [];

const getNeuralNetworkDef = (parsedDSL) =>
  parsedDSL?.defs?.find((def) => def.type === "neuralnetwork") || null;

const normalizeNeuralNetworkState = (state) => {
  const neuronsData = cloneMatrix(state.neuronsData);

  const layerNames = Array.isArray(state.layerNames)
    ? [...state.layerNames]
    : [];

  const layerColors = Array.isArray(state.layerColors)
    ? [...state.layerColors]
    : [];

  const layerStrokes = Array.isArray(state.layerStrokes)
    ? [...state.layerStrokes]
    : [];

  let neuronColors = cloneMatrix(state.neuronColors);

  const maxLayerCount = Math.max(
    layerNames.length,
    neuronsData.length,
    layerColors.length,
    layerStrokes.length,
    neuronColors.length,
  );

  while (layerNames.length < maxLayerCount) {
    layerNames.push(`layer ${layerNames.length + 1}`);
  }

  while (neuronsData.length < maxLayerCount) {
    neuronsData.push([]);
  }

  while (layerColors.length < maxLayerCount) {
    layerColors.push(null);
  }

  while (layerStrokes.length < maxLayerCount) {
    layerStrokes.push(DEFAULT_LAYER_STROKE);
  }

  while (neuronColors.length < maxLayerCount) {
    neuronColors.push([]);
  }

  neuronColors = neuronsData.map((layer, layerIndex) => {
    const colors = Array.isArray(neuronColors[layerIndex])
      ? [...neuronColors[layerIndex]]
      : [];

    while (colors.length < layer.length) {
      colors.push(null);
    }

    return colors.slice(0, layer.length);
  });

  return {
    ...state,
    layerNames,
    layerColors,
    layerStrokes,
    neuronColors,
    neuronsData,
    layers: neuronsData.map((layer) =>
      Array.isArray(layer) ? layer.length : 0,
    ),
    neuronColorsText: JSON.stringify(neuronColors),
  };
};

const getNeuralNetworkStateFromDef = (def) => {
  const body = def?.body || {};
  const neuronsData = cloneMatrix(body.neurons);
  const neuronColors = cloneMatrix(body.neuronColors);

  return normalizeNeuralNetworkState({
    name: def.name,
    layerNames: Array.isArray(body.layers) ? [...body.layers] : [],
    neuronsData,
    layerColors: Array.isArray(body.layerColors) ? [...body.layerColors] : [],
    neuronColors,
    layerStrokes: Array.isArray(body.layerStrokes)
      ? [...body.layerStrokes]
      : [],
    showBias: body.showBias,
    showLabels: body.showLabels,
    labelPosition: body.labelPosition,
    showWeights: body.showWeights,
    showArrowheads: body.showArrowheads,
    edgeWidth:
      body.edgeWidth && typeof body.edgeWidth === "object"
        ? body.edgeWidth.number
        : body.edgeWidth,
    edgeColor: body.edgeColor,
    layerSpacing: body.layerSpacing,
    neuronSpacing: body.neuronSpacing,
  });
};

const getCommandsUntilPage = (cmds = [], pageNumber = 1) => {
  let page = 0;
  const result = [];

  for (const cmd of cmds) {
    if (cmd.type === "page") {
      page += 1;
      continue;
    }

    if (page <= pageNumber) {
      result.push(cmd);
    }
  }

  return result;
};

const isPass = (value) => value === "_";

const mergeListWithPass = (oldList = [], nextList = []) => {
  const result = [...oldList];

  nextList.forEach((value, index) => {
    if (!isPass(value)) {
      result[index] = value;
    }
  });

  return result;
};

const mergeMatrixWithPass = (oldMatrix = [], nextMatrix = []) => {
  const result = cloneMatrix(oldMatrix);

  nextMatrix.forEach((nextRow, rowIndex) => {
    const oldRow = Array.isArray(result[rowIndex]) ? result[rowIndex] : [];
    result[rowIndex] = mergeListWithPass(oldRow, nextRow);
  });

  return result;
};

const applyNeuralNetworkCommands = (baseState, cmds = []) => {
  const state = {
    ...baseState,
    layerNames: [...baseState.layerNames],
    neuronsData: cloneMatrix(baseState.neuronsData),
    layerColors: [...baseState.layerColors],
    neuronColors: cloneMatrix(baseState.neuronColors),
    layerStrokes: [...baseState.layerStrokes],
  };

  const ensureLayer = (layerIndex) => {
    if (layerIndex === undefined || layerIndex === null) return;

    while (state.neuronsData.length <= layerIndex) {
      state.neuronsData.push([]);
      state.layerNames.push(`layer ${state.layerNames.length + 1}`);
      state.layerColors.push(null);
      state.layerStrokes.push(DEFAULT_LAYER_STROKE);
      state.neuronColors.push([]);
    }
  };

  const ensureNeuronColorLayer = (layerIndex) => {
    ensureLayer(layerIndex);

    if (!Array.isArray(state.neuronColors[layerIndex])) {
      state.neuronColors[layerIndex] = [];
    }
  };

  for (const cmd of cmds) {
    if (cmd.name !== state.name) continue;

    switch (cmd.type) {
      case "set_neuralnetwork_neuron_setNeuron": {
        const { row, col, value } = cmd.args;

        ensureLayer(row);

        if (!isPass(value)) {
          state.neuronsData[row][col] = value;
        }

        break;
      }

      case "set_neuralnetwork_neuron_setNeuronColor": {
        const { row, col, value } = cmd.args;

        ensureNeuronColorLayer(row);

        if (!isPass(value)) {
          state.neuronColors[row][col] = value;
        }

        break;
      }

      case "set_neuralnetwork_layer": {
        const { index, value } = cmd.args;

        ensureLayer(index);

        if (isPass(value)) break;

        if (cmd.target === "layers") {
          state.layerNames[index] = value;
        }

        if (cmd.target === "layerColors") {
          state.layerColors[index] = value;
        }

        break;
      }

      case "set_neuralnetwork_neurons_multiple": {
        const matrix = cloneMatrix(cmd.args);

        if (cmd.target === "neurons") {
          state.neuronsData = mergeMatrixWithPass(state.neuronsData, matrix);
        }

        if (cmd.target === "neuronColors") {
          state.neuronColors = mergeMatrixWithPass(state.neuronColors, matrix);
        }

        break;
      }

      case "set_neuralnetwork_layer_multiple": {
        const values = Array.isArray(cmd.args) ? cmd.args : [];

        if (cmd.target === "layers") {
          state.layerNames = mergeListWithPass(state.layerNames, values);
        }

        if (cmd.target === "layerColors") {
          state.layerColors = mergeListWithPass(state.layerColors, values);
        }

        break;
      }

      case "insert_neuralnetwork_addLayer": {
        const layerName =
          Array.isArray(cmd.args?.index) && cmd.args.index.length > 0
            ? cmd.args.index[0]
            : `layer ${state.layerNames.length + 1}`;

        const neurons = Array.isArray(cmd.args?.value)
          ? [...cmd.args.value]
          : [];

        state.layerNames.push(layerName);
        state.neuronsData.push(neurons);
        state.layerColors.push(null);
        state.layerStrokes.push(DEFAULT_LAYER_STROKE);
        state.neuronColors.push(neurons.map(() => null));

        break;
      }

      case "insert_neuralnetwork_addNeurons": {
        const layerIndex = cmd.args.index;
        const neurons = Array.isArray(cmd.args.value) ? cmd.args.value : [];

        ensureLayer(layerIndex);

        state.neuronsData[layerIndex].push(...neurons);

        ensureNeuronColorLayer(layerIndex);
        state.neuronColors[layerIndex].push(...neurons.map(() => null));

        break;
      }

      case "remove_neuralnetwork_removeLayerAt": {
        const index = cmd.args;

        state.layerNames.splice(index, 1);
        state.neuronsData.splice(index, 1);
        state.layerColors.splice(index, 1);
        state.layerStrokes.splice(index, 1);
        state.neuronColors.splice(index, 1);

        break;
      }

      case "remove_neuralnetwork_removeNeuronsFromLayer": {
        const layerIndex = cmd.args?.index;
        const removeValues = Array.isArray(cmd.args?.value)
          ? cmd.args.value
          : [];

        ensureLayer(layerIndex);

        for (const removeValue of removeValues) {
          const neuronIndex = state.neuronsData[layerIndex].findIndex(
            (value) => value === removeValue,
          );

          if (neuronIndex >= 0) {
            state.neuronsData[layerIndex].splice(neuronIndex, 1);

            ensureNeuronColorLayer(layerIndex);
            state.neuronColors[layerIndex].splice(neuronIndex, 1);
          }
        }

        break;
      }

      default:
        break;
    }
  }

  return normalizeNeuralNetworkState(state);
};

const setIfDefined = (object, key, value) => {
  if (value !== undefined && value !== "undefined") {
    object[key] = value;
  } else {
    delete object[key];
  }
};

const NEURAL_NETWORK_MUTATION_TYPES = new Set([
  "set_neuralnetwork_neuron_setNeuron",
  "set_neuralnetwork_neuron_setNeuronColor",
  "set_neuralnetwork_layer",
  "set_neuralnetwork_neurons_multiple",
  "set_neuralnetwork_layer_multiple",
  "insert_neuralnetwork_addNeurons",
  "insert_neuralnetwork_addLayer",
  "remove_neuralnetwork_removeLayerAt",
  "remove_neuralnetwork_removeNeuronsFromLayer",
]);

const removeAppliedNeuralNetworkCommandsUntilPage = (
  cmds = [],
  networkName,
  currentPage = 1,
) => {
  let page = 0;

  return cmds.filter((cmd) => {
    if (cmd.type === "page") {
      page += 1;
      return true;
    }

    const isSameNetwork = cmd.name === networkName;
    const isNeuralNetworkMutation = NEURAL_NETWORK_MUTATION_TYPES.has(cmd.type);
    const isAlreadyAppliedToCurrentPage = page <= currentPage;

    if (
      isSameNetwork &&
      isNeuralNetworkMutation &&
      isAlreadyAppliedToCurrentPage
    ) {
      return false;
    }

    return true;
  });
};

const buildNeuronsFromCounts = (counts, previousNeuronsData = []) => {
  return counts.map((count, layerIndex) => {
    const number = Number(count);
    const size = Number.isFinite(number) && number > 0 ? number : 0;
    const oldLayer = Array.isArray(previousNeuronsData[layerIndex])
      ? previousNeuronsData[layerIndex]
      : [];

    return Array.from({ length: size }, (_, neuronIndex) =>
      oldLayer[neuronIndex] !== undefined ? oldLayer[neuronIndex] : null,
    );
  });
};

const buildNeuronColorsFromCounts = (counts, previousNeuronColors = []) => {
  return counts.map((count, layerIndex) => {
    const number = Number(count);
    const size = Number.isFinite(number) && number > 0 ? number : 0;
    const oldLayer = Array.isArray(previousNeuronColors[layerIndex])
      ? previousNeuronColors[layerIndex]
      : [];

    return Array.from({ length: size }, (_, neuronIndex) =>
      oldLayer[neuronIndex] !== undefined ? oldLayer[neuronIndex] : null,
    );
  });
};

const NeuralNetworkGuiPanel = ({ value, onChange, currentPage = 1 }) => {
  const isGuiEditingRef = useRef(false);

  const [showBias, setShowBias] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [labelPosition, setLabelPosition] = useState("bottom");
  const [showWeights, setShowWeights] = useState(true);
  const [showArrowheads, setShowArrowheads] = useState(true);
  const [edgeWidth, setEdgeWidth] = useState(undefined);
  const [edgeColor, setEdgeColor] = useState(undefined);
  const [layerSpacing, setLayerSpacing] = useState(undefined);
  const [neuronSpacing, setNeuronSpacing] = useState(undefined);
  const [layerStrokes, setLayerStrokes] = useState([]);
  const [layers, setLayers] = useState([]);
  const [layerNames, setLayerNames] = useState([]);
  const [layerColors, setLayerColors] = useState([]);
  const [neuronColorsText, setNeuronColorsText] = useState("[]");
  const [parsedDSL, setParsedDSL] = useState(null);
  const [neuronsData, setNeuronsData] = useState([]);
  const [neuronColors, setNeuronColors] = useState([]);

  const updateCode = ({
    nextLayers = layers,
    nextLayerNames = layerNames,
    nextLayerColors = layerColors,
    nextLayerStrokes = layerStrokes,
    nextNeuronColors = neuronColors,
    nextNeuronsData = null,
    nextShowBias = showBias,
    nextShowLabels = showLabels,
    nextLabelPosition = labelPosition,
    nextShowWeights = showWeights,
    nextShowArrowheads = showArrowheads,
    nextEdgeWidth = edgeWidth,
    nextEdgeColor = edgeColor,
    nextLayerSpacing = layerSpacing,
    nextNeuronSpacing = neuronSpacing,
  } = {}) => {
    if (!parsedDSL) return;

    const networkIndex = parsedDSL.defs.findIndex(
      (def) => def.type === "neuralnetwork",
    );

    if (networkIndex < 0) return;

    const finalNeuronsData =
      nextNeuronsData || buildNeuronsFromCounts(nextLayers, neuronsData);

    const finalNeuronColors = buildNeuronColorsFromCounts(
      finalNeuronsData.map((layer) => layer.length),
      nextNeuronColors,
    );

    const nextBody = {
      ...parsedDSL.defs[networkIndex].body,
    };

    setIfDefined(nextBody, "layers", nextLayerNames);
    setIfDefined(nextBody, "neurons", finalNeuronsData);
    setIfDefined(nextBody, "layerColors", nextLayerColors);
    setIfDefined(nextBody, "neuronColors", finalNeuronColors);
    setIfDefined(nextBody, "showBias", nextShowBias);
    setIfDefined(nextBody, "showLabels", nextShowLabels);
    setIfDefined(nextBody, "labelPosition", nextLabelPosition);
    setIfDefined(nextBody, "showWeights", nextShowWeights);
    setIfDefined(nextBody, "showArrowheads", nextShowArrowheads);
    setIfDefined(
      nextBody,
      "edgeWidth",
      nextEdgeWidth === undefined ? undefined : { number: nextEdgeWidth },
    );
    setIfDefined(nextBody, "edgeColor", nextEdgeColor);
    setIfDefined(nextBody, "layerSpacing", nextLayerSpacing);
    setIfDefined(nextBody, "neuronSpacing", nextNeuronSpacing);
    setIfDefined(nextBody, "layerStrokes", nextLayerStrokes);

    const nextDef = {
      ...parsedDSL.defs[networkIndex],
      body: nextBody,
    };

    const currentNetworkName = parsedDSL.defs[networkIndex].name;

    const nextParsedDSL = {
      ...parsedDSL,
      defs: parsedDSL.defs.map((def, index) =>
        index === networkIndex ? nextDef : def,
      ),
      cmds: removeAppliedNeuralNetworkCommandsUntilPage(
        parsedDSL.cmds || [],
        currentNetworkName,
        currentPage,
      ),
    };

    const nextCode = reconstructDSL(nextParsedDSL);

    isGuiEditingRef.current = true;
    setParsedDSL(nextParsedDSL);
    setNeuronsData(finalNeuronsData);
    setNeuronColors(finalNeuronColors);
    setNeuronColorsText(JSON.stringify(finalNeuronColors));
    onChange(nextCode);
  };

  useEffect(() => {
    if (isGuiEditingRef.current) {
      isGuiEditingRef.current = false;
      return;
    }

    if (!value || typeof value !== "string") return;

    try {
      const nextParsedDSL = parseText(value);
      const networkDef = getNeuralNetworkDef(nextParsedDSL);

      if (!networkDef) return;

      const baseState = getNeuralNetworkStateFromDef(networkDef);

      const commandsForCurrentPage = getCommandsUntilPage(
        nextParsedDSL.cmds || [],
        currentPage,
      );

      const pageState = applyNeuralNetworkCommands(
        baseState,
        commandsForCurrentPage,
      );

      setParsedDSL(nextParsedDSL);
      setLayerNames(pageState.layerNames);
      setLayers(pageState.layers);
      setNeuronsData(pageState.neuronsData);
      setLayerColors(pageState.layerColors);
      setNeuronColors(pageState.neuronColors);
      setNeuronColorsText(pageState.neuronColorsText);
      setLayerStrokes(pageState.layerStrokes);

      setShowBias(pageState.showBias);
      setShowLabels(pageState.showLabels);
      setLabelPosition(pageState.labelPosition);
      setShowWeights(pageState.showWeights);
      setShowArrowheads(pageState.showArrowheads);
      setEdgeWidth(pageState.edgeWidth);
      setEdgeColor(pageState.edgeColor);
      setLayerSpacing(pageState.layerSpacing);
      setNeuronSpacing(pageState.neuronSpacing);
    } catch (error) {
      console.error("Failed to parse neuralnetwork DSL:", error);
    }
  }, [value, currentPage]);

  const updateLayerName = (index, value) => {
    const nextLayerNames = layerNames.map((name, i) =>
      i === index ? value : name,
    );

    setLayerNames(nextLayerNames);
    updateCode({ nextLayerNames });
  };

  const updateLayer = (index, value) => {
    const nextLayers = layers.map((layer, i) => {
      if (i !== index) return layer;

      if (value === "") return "";

      const number = Number(value);

      if (!Number.isFinite(number)) return layer;

      return Math.max(0, number);
    });

    const nextNeuronsData = buildNeuronsFromCounts(nextLayers, neuronsData);
    const nextNeuronColors = buildNeuronColorsFromCounts(
      nextLayers,
      neuronColors,
    );

    setLayers(nextLayers);
    setNeuronsData(nextNeuronsData);
    setNeuronColors(nextNeuronColors);
    setNeuronColorsText(JSON.stringify(nextNeuronColors));

    updateCode({
      nextLayers,
      nextNeuronsData,
      nextNeuronColors,
    });
  };

  const updateLayerColor = (index, value) => {
    const nextLayerColors = [...layerColors];

    nextLayerColors[index] = value;

    setLayerColors(nextLayerColors);
    updateCode({ nextLayerColors });
  };

  const updateLayerStroke = (index, value) => {
    const nextLayerStrokes = [...layerStrokes];

    nextLayerStrokes[index] = value;

    setLayerStrokes(nextLayerStrokes);
    updateCode({ nextLayerStrokes });
  };

  const removeLayer = (index) => {
    const nextLayers = layers.filter((_, i) => i !== index);
    const nextLayerNames = layerNames.filter((_, i) => i !== index);
    const nextLayerColors = layerColors.filter((_, i) => i !== index);
    const nextLayerStrokes = layerStrokes.filter((_, i) => i !== index);
    const nextNeuronsData = neuronsData.filter((_, i) => i !== index);
    const nextNeuronColors = neuronColors.filter((_, i) => i !== index);

    setLayers(nextLayers);
    setLayerNames(nextLayerNames);
    setLayerColors(nextLayerColors);
    setLayerStrokes(nextLayerStrokes);
    setNeuronsData(nextNeuronsData);
    setNeuronColors(nextNeuronColors);
    setNeuronColorsText(JSON.stringify(nextNeuronColors));

    updateCode({
      nextLayers,
      nextLayerNames,
      nextLayerColors,
      nextLayerStrokes,
      nextNeuronsData,
      nextNeuronColors,
    });
  };
  const addLayer = () => {
    const nextIndex = layers.length + 1;

    const nextLayers = [...layers, 1];
    const nextLayerNames = [...layerNames, `layer ${nextIndex}`];
    const nextLayerColors = [...layerColors, DEFAULT_LAYER_COLOR];
    const nextLayerStrokes = [...layerStrokes, DEFAULT_LAYER_STROKE];
    const nextNeuronsData = [...neuronsData, [null]];
    const nextNeuronColors = [...neuronColors, [null]];

    setLayers(nextLayers);
    setLayerNames(nextLayerNames);
    setLayerColors(nextLayerColors);
    setLayerStrokes(nextLayerStrokes);
    setNeuronsData(nextNeuronsData);
    setNeuronColors(nextNeuronColors);
    setNeuronColorsText(JSON.stringify(nextNeuronColors));

    updateCode({
      nextLayers,
      nextLayerNames,
      nextLayerColors,
      nextLayerStrokes,
      nextNeuronsData,
      nextNeuronColors,
    });
  };
  const compactTextFieldSx = {
    "& .MuiInputBase-root": {
      height: 34,
    },
    "& .MuiInputBase-input": {
      color: "#e8e8e8",
      height: 18,
      py: 0.5,
      px: 1.25,
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#202020",
    },
  };

  const compactColorInputStyle = {
    width: 34,
    height: 26,
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
  };

  const guiFontSx = {
    fontFamily: "inherit",
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.43,
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "#181818",
        color: "#e8e8e8",
        boxSizing: "border-box",

        fontFamily: "inherit",
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,

        "& .MuiTypography-root": guiFontSx,
        "& .MuiFormControlLabel-label": guiFontSx,
        "& .MuiInputBase-input": guiFontSx,
        "& .MuiButton-root": {
          ...guiFontSx,
          textTransform: "none",
        },
        "& input": {
          fontFamily: "inherit",
          fontSize: "0.875rem",
        },
      }}
    >
      <Box
        sx={{
          minHeight: "100%",
          width: "100%",
          backgroundColor: "#1f1f1f",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            Architecture
          </Typography>

          <Box sx={{ display: "grid", gap: 0.75 }}>
            {layers.length === 0 && (
              <Typography variant="body2" sx={{ color: "#aaa" }}>
                No layers yet. Add a layer to create a neural network.
              </Typography>
            )}

            {layers.map((layer, index) => (
              <Box
                key={index}
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "32px minmax(130px, 1fr) 58px 34px 34px minmax(110px, 1fr)",
                  alignItems: "center",
                  gap: 0.75,
                }}
              >
                <Button
                  variant="contained"
                  color="inherit"
                  size="small"
                  onClick={() => removeLayer(index)}
                  sx={{
                    minWidth: 32,
                    width: 32,
                    height: 32,
                    p: 0,
                    backgroundColor: "#6f7a82",
                    color: "#fff",
                  }}
                >
                  <RemoveIcon sx={{ fontSize: 18 }} />
                </Button>

                <TextField
                  value={layerNames[index] || ""}
                  onChange={(e) => updateLayerName(index, e.target.value)}
                  placeholder="layer name"
                  size="small"
                  sx={compactTextFieldSx}
                />

                <TextField
                  value={
                    layer === "" || layer === undefined || layer === null
                      ? ""
                      : layer
                  }
                  onChange={(e) => updateLayer(index, e.target.value)}
                  size="small"
                  type="number"
                  sx={compactTextFieldSx}
                />

                <input
                  type="color"
                  value={layerColors[index] || DEFAULT_LAYER_COLOR}
                  onChange={(e) => updateLayerColor(index, e.target.value)}
                  style={compactColorInputStyle}
                />

                <input
                  type="color"
                  title="Layer stroke"
                  value={layerStrokes[index] || DEFAULT_LAYER_STROKE}
                  onChange={(e) => updateLayerStroke(index, e.target.value)}
                  style={compactColorInputStyle}
                />

                <Slider
                  value={layer === "" ? 0 : Math.min(Number(layer) * 5, 100)}
                  onChange={(e, v) =>
                    updateLayer(index, String(Math.round(v / 5)))
                  }
                  size="small"
                />
              </Box>
            ))}

            <Button
              variant="contained"
              size="small"
              onClick={addLayer}
              startIcon={<AddIcon fontSize="small" />}
              sx={{ width: "fit-content" }}
            >
              Add Layer
            </Button>
          </Box>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.12)", my: 2 }} />

          <Box sx={{ display: "grid", gap: 2.25, mt: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.25,
                flexWrap: "wrap",
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showBias}
                    onChange={(e) => {
                      const nextShowBias = e.target.checked;
                      setShowBias(nextShowBias);
                      updateCode({ nextShowBias });
                    }}
                  />
                }
                label="Show Bias"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showLabels}
                    onChange={(e) => {
                      const nextShowLabels = e.target.checked;
                      setShowLabels(nextShowLabels);
                      updateCode({ nextShowLabels });
                    }}
                  />
                }
                label="Show Labels"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showWeights}
                    onChange={(e) => {
                      const nextShowWeights = e.target.checked;
                      setShowWeights(nextShowWeights);
                      updateCode({ nextShowWeights });
                    }}
                  />
                }
                label="Show Weights"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={showArrowheads}
                    onChange={(e) => {
                      const nextShowArrowheads = e.target.checked;
                      setShowArrowheads(nextShowArrowheads);
                      updateCode({ nextShowArrowheads });
                    }}
                  />
                }
                label="Show Arrowheads"
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: "#bdbdbd" }}>
                Label Position
              </Typography>

              <RadioGroup
                row
                value={labelPosition}
                onChange={(e) => {
                  const nextLabelPosition = e.target.value;
                  setLabelPosition(nextLabelPosition);
                  updateCode({ nextLabelPosition });
                }}
              >
                <FormControlLabel
                  value="top"
                  control={<Radio size="small" />}
                  label="top"
                />
                <FormControlLabel
                  value="bottom"
                  control={<Radio size="small" />}
                  label="bottom"
                />
              </RadioGroup>
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: "#bdbdbd" }}>
                Edge Width
              </Typography>

              <Slider
                value={edgeWidth ?? 0.3}
                min={0}
                max={1}
                step={0.1}
                onChange={(e, v) => {
                  const nextEdgeWidth = v;
                  setEdgeWidth(nextEdgeWidth);
                  updateCode({ nextEdgeWidth });
                }}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: "#bdbdbd" }}>
                Edge Color
              </Typography>

              <input
                type="color"
                value={edgeColor || "#000000"}
                onChange={(e) => {
                  const nextEdgeColor = e.target.value;
                  setEdgeColor(nextEdgeColor);
                  updateCode({ nextEdgeColor });
                }}
                style={compactColorInputStyle}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: "#bdbdbd" }}>
                Layer Spacing
              </Typography>

              <Slider
                value={layerSpacing ?? 100}
                min={0}
                max={500}
                step={5}
                onChange={(e, v) => {
                  const nextLayerSpacing = v;
                  setLayerSpacing(nextLayerSpacing);
                  updateCode({ nextLayerSpacing });
                }}
                size="small"
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: "#bdbdbd" }}>
                Neuron Spacing
              </Typography>

              <Slider
                value={neuronSpacing ?? 100}
                min={0}
                max={500}
                step={5}
                onChange={(e, v) => {
                  const nextNeuronSpacing = v;
                  setNeuronSpacing(nextNeuronSpacing);
                  updateCode({ nextNeuronSpacing });
                }}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default NeuralNetworkGuiPanel;
