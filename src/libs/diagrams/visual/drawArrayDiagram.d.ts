import type { ArrayDiagram } from './types.js';
import type { ArrayDiagramConfig } from '../../config.type.js';
import type { SVG } from '../../diagram-api/types.js';
export declare const drawArrayDiagram: (svg: SVG, arrayDiagram: ArrayDiagram, yOffset: number, config: Required<ArrayDiagramConfig>, component_id: number) => void;
