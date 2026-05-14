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
  Tab,
} from "@mui/material";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

const DEFAULT_LAYER_COLOR = "#C8E3F5";
const DEFAULT_LAYER_STROKE = "#000000";

const NeuralNetworkGuiPanel = ({ value, onChange }) => {
  const isGuiEditingRef = useRef(false);

  const [tab, setTab] = useState(0);
  const [showBias, setShowBias] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [labelPosition, setLabelPosition] = useState("bottom");
  const [showWeights, setShowWeights] = useState(true);
  const [showArrowheads, setShowArrowheads] = useState(true);
  const [edgeWidth, setEdgeWidth] = useState(0.3);
  const [edgeColor, setEdgeColor] = useState("red");
  const [layerSpacing, setLayerSpacing] = useState(125);
  const [neuronSpacing, setNeuronSpacing] = useState(125);
  const [layerStrokes, setLayerStrokes] = useState([]);
  const [layers, setLayers] = useState([]);
  const [layerNames, setLayerNames] = useState([]);
  const [layerColors, setLayerColors] = useState([]);
  const [neuronColorsText, setNeuronColorsText] = useState("[]");

  const extractDslValue = (code, key) => {
    const regex = new RegExp(`${key}\\s*:\\s*([^\\n]+)`);
    const match = code.match(regex);
    return match ? match[1].trim() : null;
  };

  const parseJsonValue = (raw, fallback) => {
    if (!raw) return fallback;

    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const parseStringValue = (raw, fallback) => {
    if (!raw) return fallback;

    return raw.replace(/^["']|["']$/g, "").trim();
  };

  const parseNumberValue = (raw, fallback) => {
    if (!raw) return fallback;

    const number = Number(raw);
    return Number.isFinite(number) ? number : fallback;
  };

  const parseBooleanValue = (raw, fallback) => {
    if (!raw) return fallback;

    if (raw === "true") return true;
    if (raw === "false") return false;

    return fallback;
  };

  const buildNeuronsDsl = (counts) => {
    return counts.map((count) => {
      const number = Number(count);

      return Array.from(
        { length: Number.isFinite(number) && number > 0 ? number : 0 },
        () => null,
      );
    });
  };

  const buildNeuralNetworkCode = ({
    nextLayers = layers,
    nextLayerNames = layerNames,
    nextLayerColors = layerColors,
    nextLayerStrokes = layerStrokes,
    nextNeuronColorsText = neuronColorsText,
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
    return `neuralnetwork nn = {
\tlayers: ${JSON.stringify(nextLayerNames)}
\tneurons: ${JSON.stringify(buildNeuronsDsl(nextLayers))}
\tlayerColors: ${JSON.stringify(nextLayerColors)}
\tneuronColors: ${nextNeuronColorsText}
\tshowBias: ${nextShowBias}
\tshowLabels: ${nextShowLabels}
\tlabelPosition: ${nextLabelPosition}
\tshowWeights: ${nextShowWeights}
\tshowArrowheads: ${nextShowArrowheads}
\tedgeWidth: ${nextEdgeWidth}
\tedgeColor: "${nextEdgeColor}"
\tlayerSpacing: ${nextLayerSpacing}
\tneuronSpacing: ${nextNeuronSpacing}
\tlayerStrokes: ${JSON.stringify(nextLayerStrokes)}
}

page
show nn`;
  };

  const updateCode = (nextState = {}) => {
    isGuiEditingRef.current = true;
    onChange(buildNeuralNetworkCode(nextState));
  };

  useEffect(() => {
    if (isGuiEditingRef.current) {
      isGuiEditingRef.current = false;
      return;
    }

    if (!value) return;

    const networkMatch = value.match(
      /neuralnetwork\s+\w+\s*=\s*\{([\s\S]*?)\}/,
    );
    if (!networkMatch) return;

    const body = networkMatch[1];

    const parsedLayerNames = parseJsonValue(
      extractDslValue(body, "layers"),
      [],
    );

    const parsedNeurons = parseJsonValue(extractDslValue(body, "neurons"), []);

    const parsedLayerColors = parseJsonValue(
      extractDslValue(body, "layerColors"),
      [],
    );

    const parsedLayerStrokes = parseJsonValue(
      extractDslValue(body, "layerStrokes"),
      [],
    );

    const rawNeuronColors = extractDslValue(body, "neuronColors");

    setLayerNames(Array.isArray(parsedLayerNames) ? parsedLayerNames : []);

    setLayers(
      Array.isArray(parsedNeurons)
        ? parsedNeurons.map((layer) =>
            Array.isArray(layer) ? layer.length : 0,
          )
        : [],
    );

    setLayerColors(Array.isArray(parsedLayerColors) ? parsedLayerColors : []);
    setLayerStrokes(
      Array.isArray(parsedLayerStrokes) ? parsedLayerStrokes : [],
    );

    if (rawNeuronColors) {
      setNeuronColorsText(rawNeuronColors);
    }

    setShowBias(parseBooleanValue(extractDslValue(body, "showBias"), true));
    setShowLabels(parseBooleanValue(extractDslValue(body, "showLabels"), true));

    setLabelPosition(
      parseStringValue(extractDslValue(body, "labelPosition"), "bottom"),
    );

    setShowWeights(
      parseBooleanValue(extractDslValue(body, "showWeights"), true),
    );

    setShowArrowheads(
      parseBooleanValue(extractDslValue(body, "showArrowheads"), true),
    );

    setEdgeWidth(parseNumberValue(extractDslValue(body, "edgeWidth"), 0.3));
    setEdgeColor(parseStringValue(extractDslValue(body, "edgeColor"), "red"));

    setLayerSpacing(
      parseNumberValue(extractDslValue(body, "layerSpacing"), 125),
    );
    setNeuronSpacing(
      parseNumberValue(extractDslValue(body, "neuronSpacing"), 125),
    );
  }, [value]);

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

    setLayers(nextLayers);
    updateCode({ nextLayers });
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

    setLayers(nextLayers);
    setLayerNames(nextLayerNames);
    setLayerColors(nextLayerColors);
    setLayerStrokes(nextLayerStrokes);

    updateCode({
      nextLayers,
      nextLayerNames,
      nextLayerColors,
      nextLayerStrokes,
    });
  };

  const addLayer = () => {
    const nextIndex = layers.length + 1;

    const nextLayers = [...layers, 1];
    const nextLayerNames = [...layerNames, `layer ${nextIndex}`];
    const nextLayerColors = [...layerColors, DEFAULT_LAYER_COLOR];
    const nextLayerStrokes = [...layerStrokes, DEFAULT_LAYER_STROKE];

    setLayers(nextLayers);
    setLayerNames(nextLayerNames);
    setLayerColors(nextLayerColors);
    setLayerStrokes(nextLayerStrokes);

    updateCode({
      nextLayers,
      nextLayerNames,
      nextLayerColors,
      nextLayerStrokes,
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
                value={edgeWidth}
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
                value={edgeColor || "#ff0000"}
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
                value={layerSpacing}
                min={20}
                max={250}
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
                value={neuronSpacing}
                min={20}
                max={250}
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
