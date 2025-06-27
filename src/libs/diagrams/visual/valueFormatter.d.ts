/**
 * Formats a value for display in visual diagrams.
 * Handles special cases for null values and quoted strings.
 *
 * @param value - The raw value from the parsed diagram
 * @returns The formatted value for display
 */
export declare const formatValue: (value: string | number) => string;
/**
 * Checks if an arrow label should be displayed.
 *
 * @param arrowLabel - The arrow label value
 * @returns True if the arrow label should be displayed, false otherwise
 */
export declare const shouldDisplayArrowLabel: (arrowLabel?: string) => boolean;
