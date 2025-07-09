import { formatNodeName, formatNullValue } from '../compiler.mjs';
import { formatPositionForOutput } from '../positionUtils.mjs';

export function generateArray(arrayComponent, layout = [3, 3]) {
  let result = "array\n";
  
  // Add position information if available
  result += formatPositionForOutput(arrayComponent.position, layout);
  
  result += "@\n";

  const structure = arrayComponent.body.structure || [];
  const color = arrayComponent.body.color || [];
  const value = arrayComponent.body.value || [];
  const arrow = arrayComponent.body.arrow || [];

  // Determine the effective length of the array.
  // Prioritize 'value' if it has elements, otherwise use 'structure'.
  const arrayLength = value.length > 0 ? value.length : structure.length;

  for (let i = 0; i < arrayLength; i++) {
    // Determine the content for the cell.
    // Prefer value[i] if it's defined, otherwise structure[i].
    // Default to an empty string if neither is defined to avoid "undefined" in output.
    const cellDisplayValue = value[i] !== undefined ? value[i] : (structure[i] !== undefined ? structure[i] : "");
    
    result += `${formatNodeName(cellDisplayValue)}`;
    result += ` {color:"${formatNullValue(color[i] || null)}"`;
    
    // Ensure 'empty' is treated as a string literal for comparison.
    const arrowValue = arrow[i] === 'empty' ? "" : formatNullValue(arrow[i] || null);
    result += `, arrow:"${arrowValue}"`;
    result += `}\n`;
  }
  result += "@\n";
  return result;
}
