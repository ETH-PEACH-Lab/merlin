import type { ArrayDiagramConfig } from '../../config.type.js';
import type { DiagramDBBase } from '../../diagram-api/types.js';
export interface ArrayElement {
    value: any;
    arrow?: boolean;
    context?: string;
    color?: string;
}
export interface ArraySlide {
    showIndex: boolean;
    elements: ArrayElement[];
}
export interface TestSlidesDiagram {
    accDescr?: string;
    accTitle?: string;
    title?: string;
    pages: ArraySlide[];
}
export interface TestSlidesDB extends DiagramDBBase<ArrayDiagramConfig> {
    addSlide: (slide: ArraySlide) => void;
    getSlides: () => ArraySlide[];
}
export interface TestSlidesData {
    slides: ArraySlide[];
}
