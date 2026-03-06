import { formatNodeName, formatNullValue } from "../compiler.mjs";
import { formatPositionForOutput } from "../../utils/positionUtils.mjs";

export function generateNeuralNetwork(neuralNetworkComponent, layout = [3, 3]) {
  let result = "neural-network\n";

  // Add position information if available
  result += formatPositionForOutput(neuralNetworkComponent.position, layout);
  result += neuralNetworkComponent.body.showWeights ? "showWeights\n" : "";
  result += neuralNetworkComponent.body.showLabels ? "showLabels\n" : "";
  result += neuralNetworkComponent.body.labelPosition
    ? `positionLabels:${neuralNetworkComponent.body.labelPosition}\n`
    : "";
  result += neuralNetworkComponent.body.showArrowheads
    ? "showArrowheads\n"
    : "";
  result += neuralNetworkComponent.body.showBias ? "showBias\n" : "";

  result += "@\n";

  // const structure = neuralNetworkComponent.body.structure || [];
  const layers = neuralNetworkComponent.body.layers;
  const neurons = neuralNetworkComponent.body.neurons;
  const colorLayer = neuralNetworkComponent.body.layerColors;
  const colorNeurons = neuralNetworkComponent.body.neuronColors;

  if (neurons) {
    for (let i = 0; i < neurons.length; i++) {
      result += `"${layers[i] ?? null}"`;

      colorLayer ? (result += ` {color: "${colorLayer[i] ?? null}"}`) : "";

      for (let j = 0; j < neurons[i].length; j++) {
        result += ` "${neurons[i][j]}"`;
        colorNeurons?.[i]?.[j] !== undefined
          ? (result += ` {color: "${colorNeurons[i][j]}"}`)
          : "";
      }

      result += "\n";
    }
  }
  result += "@\n";
  return result;
}
