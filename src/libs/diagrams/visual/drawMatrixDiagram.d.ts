import type { MatrixDiagram } from './types.js';
import type { MatrixDiagramConfig } from '../../config.type.js';
import type { SVG } from '../../diagram-api/types.js';
export declare const drawMatrixDiagram: (svg: SVG, matrixDiagram: MatrixDiagram, yOffset: number, config: Required<MatrixDiagramConfig>, component_id: number) => void;
