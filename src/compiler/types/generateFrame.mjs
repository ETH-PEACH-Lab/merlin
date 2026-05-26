import { formatNodeName, formatNullValue } from '../compiler.mjs';
import { formatPositionForOutput } from '../../utils/positionUtils.mjs';

export function generateFrame(frameComponent, layout = [3, 3]) {
  let result = "frame\n";
  
  result += formatPositionForOutput(frameComponent.position, layout);
  
  const name = frameComponent.body.name || "frame";
  const variables = Array.isArray(frameComponent.body.variable) 
    ? frameComponent.body.variable 
    : [];
  const values = Array.isArray(frameComponent.body.value) 
    ? frameComponent.body.value 
    : [];
  const colors = Array.isArray(frameComponent.body.color) 
    ? frameComponent.body.color 
    : [];
  
  result += `name: "${formatNullValue(name)}"\n`;
  
  result += "@\n";
  
  for (let i = 0; i < variables.length; i++) {
    result += `${formatNodeName(variables[i])} { value: "${formatNullValue(values[i])}"`;
    
    if (colors[i] !== null && colors[i] !== undefined && colors[i] !== 'null') {
      result += `, color: "${formatNullValue(colors[i])}"`;
    }
    
    result += " }\n";
  }
  
  result += "@\n";
  return result;
}