import LZString from 'lz-string';

/**
 * Compresses code and creates a shareable URL
 * @param {string} code - The DSL code to compress and share
 * @param {string} baseUrl - The base URL (defaults to current location)
 * @returns {string} - The complete shareable URL
 */
export function createShareableUrl(code, baseUrl = window.location.origin + window.location.pathname) {
    try {
        // Compress the code using LZ-string with Base64 encoding (URL safe)
        const compressed = LZString.compressToBase64(code);
        
        // Create the URL with the compressed code
        const url = new URL(baseUrl);
        url.hash = `/url/merlin/${compressed}`;
        
        return url.toString();
    } catch (error) {
        console.error('Error creating shareable URL:', error);
        return null;
    }
}

/**
 * Extracts and decompresses code from a URL
 * @param {string} url - The URL to extract code from (defaults to current location)
 * @returns {string|null} - The decompressed code or null if not found/invalid
 */
export function extractCodeFromUrl(url = window.location.href) {
    try {
        const urlObj = new URL(url);
        const hash = urlObj.hash;
        
        // Check if the hash matches the expected pattern
        const match = hash.match(/^#\/url\/merlin\/(.+)$/);
        if (!match) {
            return null;
        }
        
        const compressed = match[1];
        
        // Decompress the code
        const decompressed = LZString.decompressFromBase64(compressed);
        
        return decompressed;
    } catch (error) {
        console.error('Error extracting code from URL:', error);
        return null;
    }
}

/**
 * Gets the current URL hash path
 * @returns {string} - The current hash path
 */
export function getCurrentHashPath() {
    return window.location.hash;
}

/**
 * Checks if the current URL contains a shared example
 * @returns {boolean} - True if URL contains a shared example
 */
export function hasSharedExample() {
    return getCurrentHashPath().startsWith('#/url/merlin/');
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - True if successful
 */
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            return result;
        }
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        return false;
    }
}
