import { formatNullValue } from "../compiler.mjs";
import { formatPositionForOutput } from "../../utils/positionUtils.mjs";
const INHERIT_LAYER_COLOR = "layerColor";
export function generateNeuralNetwork(neuralNetworkComponent, layout = [3, 3]) {
  let result = "neural-network\n";

  // Add position information if available
  result += formatPositionForOutput(neuralNetworkComponent.position, layout);
  result += neuralNetworkComponent.body.showWeights ? "showWeights\n" : "";
  result += neuralNetworkComponent.body.showLabels ? "showLabels\n" : "";
  result += neuralNetworkComponent.body.labelPosition
    ? `positionLabels: ${neuralNetworkComponent.body.labelPosition}\n`
    : "";
  result += neuralNetworkComponent.body.showArrowheads
    ? "showArrowheads\n"
    : "";
  result += neuralNetworkComponent.body.showBias ? "showBias\n" : "";

  if (
    neuralNetworkComponent.body.edgeWidth !== undefined &&
    neuralNetworkComponent.body.edgeWidth !== null
  ) {
    if (
      neuralNetworkComponent.body.edgeWidth.number > 1 ||
      neuralNetworkComponent.body.edgeWidth.number < 0
    ) {
      throw new Error(
        `edgeWidth at line ${neuralNetworkComponent.body.edgeWidth.line}, column ${neuralNetworkComponent.body.edgeWidth.col} must be a number between [0,1]`,
      );
    }
  }

  result +=
    neuralNetworkComponent.body.edgeWidth !== undefined &&
    neuralNetworkComponent.body.edgeWidth !== null
      ? `edgeWidth: ${neuralNetworkComponent.body.edgeWidth.number}\n`
      : "";

  result += neuralNetworkComponent.body.edgeColor
    ? `edgeColor: "${neuralNetworkComponent.body.edgeColor}"\n`
    : "";

  result +=
    neuralNetworkComponent.body.layerSpacing !== undefined &&
    neuralNetworkComponent.body.layerSpacing !== null
      ? `layerSpacing: ${neuralNetworkComponent.body.layerSpacing}\n`
      : "";

  result +=
    neuralNetworkComponent.body.neuronSpacing !== undefined &&
    neuralNetworkComponent.body.neuronSpacing !== null
      ? `neuronSpacing: ${neuralNetworkComponent.body.neuronSpacing}\n`
      : "";

  result += "@\n";

  // const structure = neuralNetworkComponent.body.structure || [];
  const layers = neuralNetworkComponent.body.layers;
  const neurons = neuralNetworkComponent.body.neurons;
  const layerColors = neuralNetworkComponent.body.layerColors;
  const layerStrokes = neuralNetworkComponent.body.layerStrokes;
  const colorNeurons = neuralNetworkComponent.body.neuronColors;

  function resolveNeuronColor(row, col) {
    const storedNeuronColor =
      neuralNetworkComponent.body.neuronColors?.[row]?.[col];
    const layerColor = neuralNetworkComponent.body.layerColors?.[row] ?? null;

    if (storedNeuronColor === INHERIT_LAYER_COLOR) {
      return layerColor ?? "white";
    }
    return formatNullValue(storedNeuronColor);
  }
  if (neurons) {
    for (let i = 0; i < neurons.length; i++) {
      if (!layers) {
        result += "null";
      } else {
        result +=
          typeof layers[i] === "string"
            ? `"${formatNullValue(layers[i])}"`
            : formatNullValue(layers[i]);
      }
      layerColors
        ? (result += ` {color: "${formatNullValue(layerColors[i])}"`)
        : "";

      layerStrokes
        ? (result += `, stroke: "${formatNullValue(layerStrokes[i])}"}`)
        : layerColors
          ? (result += "}")
          : "";

      for (let j = 0; j < neurons[i].length; j++) {
        const valueNeurons =
          typeof neurons[i][j] === "string"
            ? `"${formatNullValue(neurons[i][j])}"`
            : formatNullValue(neurons[i][j]);
        result +=
          neurons[i][j] === "" ? ` "${neurons[i][j]}"` : ` ${valueNeurons}`;
        colorNeurons?.[i]?.[j] !== undefined
          ? (result += ` {color: "${resolveNeuronColor(i, j)}"}`)
          : "";
      }

      result += "\n";
    }
  }
  result += "@\n";
  return result;
}
