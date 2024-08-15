import type { MatrixDiagramConfig } from '../../config.type.js';
import type { DiagramDBBase } from '../../diagram-api/types.js';
export interface MatrixElement {
    value: string | number;
    color?: 'blue' | 'green' | 'red';
}
export interface MatrixRow {
    elements: MatrixElement[];
}
export interface MatrixDB extends DiagramDBBase<MatrixDiagramConfig> {
    addRow: (row: MatrixRow) => void;
    getMatrix: () => MatrixRow[];
}
export interface MatrixStyleOptions {
    elementFontSize?: string;
    borderColor?: string;
    borderWidth?: string;
    elementFillColor?: string;
    labelColor?: string;
    labelFontSize?: string;
}
export interface MatrixData {
    rows: MatrixRow[];
}
