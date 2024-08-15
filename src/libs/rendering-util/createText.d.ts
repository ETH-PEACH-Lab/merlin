import type { MermaidConfig } from '../config.type.js';
import type { Group } from '../diagram-api/types.js';
export declare function computeDimensionOfText(parentNode: Group, lineHeight: number, text: string): DOMRect | undefined;
/**
 * Convert fontawesome labels into fontawesome icons by using a regex pattern
 * @param text - The raw string to convert
 * @returns string with fontawesome icons as i tags
 */
export declare function replaceIconSubstring(text: string): string;
export declare const createText: (el: any, text: string | undefined, { style, isTitle, classes, useHtmlLabels, isNode, width, addSvgBackground, }: {
    style?: string | undefined;
    isTitle?: boolean | undefined;
    classes?: string | undefined;
    useHtmlLabels?: boolean | undefined;
    isNode?: boolean | undefined;
    width?: number | undefined;
    addSvgBackground?: boolean | undefined;
} | undefined, config: MermaidConfig) => any;
