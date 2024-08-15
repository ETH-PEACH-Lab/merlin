import type { ArrayDiagramConfig } from '../../config.type.js';
import type { DiagramDBBase } from '../../diagram-api/types.js';
export interface ArrayElement {
    index: number;
    value: any;
    arrow?: boolean;
    context?: string;
    color?: string;
}
export interface ArrayDB extends DiagramDBBase<ArrayDiagramConfig> {
    addElement: (element: ArrayElement) => void;
    getArray: () => ArrayElement[];
}
export interface ArrayStyleOptions {
    elementFontSize?: string;
    indexColor?: string;
    valueColor?: string;
    elementStrokeColor?: string;
    elementStrokeWidth?: string;
    elementFillColor?: string;
}
export interface ArrayData {
    elements: ArrayElement[];
}
