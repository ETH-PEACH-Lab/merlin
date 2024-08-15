import type { VisSlidesDiagramConfig } from '../../config.type.js';
import type { DiagramDBBase } from '../../diagram-api/types.js';
export interface ArrayElement {
    value: string | number;
    arrow?: boolean;
    context?: string;
    color?: string;
}
export interface MatrixElement {
    value: string | number;
    color?: string;
}
export interface MatrixRow {
    elements: MatrixElement[];
}
export interface ArrayDiagram {
    elements: ArrayElement[];
    showIndex?: boolean;
}
export interface MatrixDiagram {
    rows: MatrixRow[];
}
export interface VisSlidePage {
    subDiagrams: (ArrayDiagram | MatrixDiagram)[];
}
export interface VisSlidesDB extends DiagramDBBase<VisSlidesDiagramConfig> {
    addPage: (page: VisSlidePage) => void;
    getPages: () => VisSlidePage[];
}
