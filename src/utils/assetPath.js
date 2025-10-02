/**
 * Utility function to get the correct asset path for both development and GitHub Pages
 * @param {string} path - The relative path to the asset
 * @returns {string} - The correct asset path
 */
export function getAssetPath(path) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Always prefer relative paths so the app works under any subdirectory
  // (e.g., GitHub Pages /merlin-study/) and locally.
  return `./${cleanPath}`;
}
