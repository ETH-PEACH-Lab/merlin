import download from "downloadjs";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import JSZip from "jszip";
import PptxGenJS from "pptxgenjs";
import mermaid from '@eth-peach-lab/mermaid-merlin/packages/mermaid/dist/mermaid.esm.mjs';
import GIF from 'gif.js';

// Export configuration constants
const EXPORT_CONFIGS = {
  png: {
    width: 3840,  // 4x resolution (2160p)
    height: 2160,
    renderAt: 0.25, // Render at quarter resolution then upscale
    useHighDPI: true
  },
  pdf: {
    width: 1920,
    height: 1080,
    renderAt: 0.5,
    orientation: 'landscape',
  },
  svg: {
    width: 960,
    height: 540,
    renderAt: 1.0 // No scaling for SVG
  },
  pptx: {
    width: 1920,
    height: 1440,
    renderAt: 0.5,
    slideWidth: 10,
    slideHeight: 7.5
  },
  html: {
    width: 960,
    height: 540,
    renderAt: 1.0 // No scaling for HTML
  },
  video: {
    width: 1920,
    height: 1080,
    renderAt: 0.5,
    frameDuration: 1000, // Duration per frame in milliseconds (1 second)
    fps: 30, // Frames per second for video
    format: 'mp4' // Video format (webm, mp4)
  },
  gif: {
    width: 1920,
    height: 1080,
    renderAt: 0.5,
    frameDuration: 1000, // Duration per frame in milliseconds (1 second)
    quality: 10, // GIF quality (1-20, lower is better quality)
    repeat: 0 // 0 = infinite loop, >0 = number of loops
  }
};

// Helper function to extract individual pages from multi-page SVG
export const extractPages = (svg) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = doc.querySelector('svg');

  if (!svgElement) return [];

  const pages = svgElement.querySelectorAll('g.page');
  return Array.from(pages).map((page, index) => {
    // Clone the SVG element
    const clonedSvg = svgElement.cloneNode(true);

    // Hide all pages
    const clonedPages = clonedSvg.querySelectorAll('g.page');
    clonedPages.forEach(p => p.setAttribute('display', 'none'));

    // Show only the current page
    const currentPage = clonedPages[index];
    if (currentPage) {
      currentPage.setAttribute('display', 'inline');
    }

    return {
      pageNumber: index + 1,
      svg: new XMLSerializer().serializeToString(clonedSvg)
    };
  });
};

// Helper function to get pages to export based on config
const getPagesToExport = (fullSvg, config) => {
  // First, extract all pages from the SVG
  const allExtractedPages = extractPages(fullSvg);
  
  // If no pages were extracted (single page diagram), create a single page entry
  if (allExtractedPages.length === 0) {
    return [{ pageNumber: 1, svg: fullSvg }];
  }
  
  // If no custom page selection is specified, return all pages
  if (!config || !config.pageSelection) {
    return allExtractedPages;
  }
  
  // Handle different page selection modes
  if (config.pageSelection === 'all') {
    return allExtractedPages;
  } else if (config.pageSelection === 'single') {
    const pageIndex = (config.selectedPage || 1) - 1;
    if (pageIndex >= 0 && pageIndex < allExtractedPages.length) {
      const selectedPage = [allExtractedPages[pageIndex]];
      return selectedPage;
    }
    return allExtractedPages.length > 0 ? [allExtractedPages[0]] : [{ pageNumber: 1, svg: fullSvg }];
  } else if (config.pageSelection === 'range') {
    const startIndex = Math.max(0, (config.rangeStart || 1) - 1);
    const endIndex = Math.min(allExtractedPages.length - 1, (config.rangeEnd || allExtractedPages.length) - 1);
    const rangePages = allExtractedPages.slice(startIndex, endIndex + 1);
    return rangePages;
  }
  
  // Fallback to all pages
  console.error('getPagesToExport: Fallback to all pages');
  return allExtractedPages;
};

// Helper function to render SVG to PNG with upscaling
export const svgToPng = async (svgString, config) => {
  return new Promise((resolve, reject) => {
    try {
      // Create an image element
      const img = new Image();
      
      // Create a canvas for output
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set high DPI scaling
      const dpr = config.useHighDPI ? (window.devicePixelRatio || 1) : 1;
      
      // Use final output dimensions
      const finalWidth = config.width;
      const finalHeight = config.height;

      img.onload = () => {
        try {
          // Set canvas dimensions
          canvas.width = finalWidth * dpr;
          canvas.height = finalHeight * dpr;
          
          // Scale context to match DPI
          ctx.scale(dpr, dpr);
          
          // Set canvas display size
          canvas.style.width = finalWidth + 'px';
          canvas.style.height = finalHeight + 'px';

          // Fill with white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, finalWidth, finalHeight);

          // Calculate scaling to fit image within canvas while maintaining aspect ratio
          const imgAspect = img.naturalWidth / img.naturalHeight;
          const canvasAspect = finalWidth / finalHeight;
          
          let drawWidth, drawHeight, drawX, drawY;
          
          if (imgAspect > canvasAspect) {
            // Image is wider, fit to width
            drawWidth = finalWidth;
            drawHeight = finalWidth / imgAspect;
            drawX = 0;
            drawY = (finalHeight - drawHeight) / 2;
          } else {
            // Image is taller, fit to height
            drawHeight = finalHeight;
            drawWidth = finalHeight * imgAspect;
            drawX = (finalWidth - drawWidth) / 2;
            drawY = 0;
          }

          // Enable image smoothing for better upscaling quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw the image centered and scaled
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

          // Convert to data URL with maximum quality
          const dataUrl = canvas.toDataURL('image/png', 1.0);
          resolve(dataUrl);
        } catch (error) {
          console.error('Error in img.onload:', error);
          reject(error);
        }
      };

      img.onerror = (error) => {
        console.error('Image load error:', error);
        reject(new Error('Failed to load SVG image'));
      };

      // Use data URL instead of blob URL to avoid CSP issues
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
      img.src = svgDataUrl;

    } catch (error) {
      console.error('Error in svgToPng:', error);
      reject(error);
    }
  });
};

// Function to inject custom size into Merlin code
export const createMermaidWithCustomSize = (compiledMerlin, width, height) => {
  const lines = compiledMerlin.split('\n');
  
  // Find the size line and replace it, or add it after "visual"
  let visualLineIndex = lines.findIndex(line => line.startsWith('visual'));
  let sizeLineIndex = lines.findIndex(line => line.startsWith('size:'));

  // Add at top if no visual line found
  if (visualLineIndex === -1) {
    lines.unshift('visual');
  }
  if (sizeLineIndex === -1) {
    // Add it below the visual line if it exists
    if (visualLineIndex !== -1) {
      lines.splice(visualLineIndex + 1, 0, `size: (${width},${height})`);
    }
  } else {
    // Replace existing size line
    lines[sizeLineIndex] = `size: (${width},${height})`; 
  } 
 
  return lines.join('\n'); 
}; 
 
// Export as PNG (single or multiple pages) with upscaling 
export const exportPNG = async (compiledMerlin, pages, mermaidRef, config = EXPORT_CONFIGS.png, onProgress = null) => { 

  try {
    // Initialize mermaid with custom configuration
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    // Render at specified resolution
    const renderWidth = Math.round(config.width * config.renderAt);
    const renderHeight = Math.round(config.height * config.renderAt);
    const customMerlin = createMermaidWithCustomSize(compiledMerlin, renderWidth, renderHeight);
    const { svg: fullSvg } = await mermaid.mermaidAPI.render("export-preview", customMerlin);
    
    const extractedPages = getPagesToExport(fullSvg, config);

    if (extractedPages.length === 0) {
      throw new Error('No pages found in SVG');
    }

    // For single page, download directly
    if (extractedPages.length === 1) {
      if (onProgress) onProgress(0, 1, 'Processing page 1...');
      const pngDataUrl = await svgToPng(extractedPages[0].svg, config);
      if (pngDataUrl) {
        // Convert data URL to blob and download
        const base64Data = pngDataUrl.split(',')[1];
        const blob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], { type: 'image/png' });
        download(blob, "diagram.png", "image/png");
      }
      if (onProgress) onProgress(1, 1, 'Complete!');
      return;
    }

    // Export as ZIP with multiple PNGs
    const zip = new JSZip();

    for (let i = 0; i < extractedPages.length; i++) {
      const page = extractedPages[i];
      if (onProgress) onProgress(i, extractedPages.length, `Processing page ${page.pageNumber}...`);
      
      const pngDataUrl = await svgToPng(page.svg, config);
      if (pngDataUrl) {
        const pngData = pngDataUrl.split(',')[1]; // Remove data:image/png;base64,
        zip.file(`page_${page.pageNumber}.png`, pngData, { base64: true });
      }
    }

    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Creating ZIP file...');
    const zipContent = await zip.generateAsync({ type: "blob" });
    download(zipContent, "diagram_pages.zip", "application/zip");
    
    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Complete!');

  } catch (error) {
    console.error("PNG Export error:", error);
    throw error;
  }
};

// Export as PDF (single or multiple pages in landscape) with vector preservation attempt
export const exportPDF = async (compiledMerlin, pages, mermaidRef, config = EXPORT_CONFIGS.pdf, onProgress = null) => {
  
  try {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    // Render at specified resolution
    const renderWidth = Math.round(config.width * config.renderAt);
    const renderHeight = Math.round(config.height * config.renderAt);
    const customMerlin = createMermaidWithCustomSize(compiledMerlin, renderWidth, renderHeight);
    const { svg: fullSvg } = await mermaid.mermaidAPI.render("export-preview", customMerlin);
    const extractedPages = getPagesToExport(fullSvg, config);

    if (extractedPages.length === 0) {
      throw new Error('No pages found in SVG');
    }

    // Create landscape PDF
    const pdf = new jsPDF({
      orientation: config.orientation,
      unit: 'px',
      format: [config.width, config.height]
    });

    for (let i = 0; i < extractedPages.length; i++) {
      const page = extractedPages[i];
      if (onProgress) onProgress(i, extractedPages.length, `Processing PDF page ${page.pageNumber}...`);

      if (i > 0) {
        pdf.addPage([config.width, config.height], config.orientation);
      }

      // Use high resolution PNG for better PDF quality
      const pngDataUrl = await svgToPng(page.svg, {
        width: config.width,
        height: config.height,
        useHighDPI: true
      });

      if (pngDataUrl) {
        pdf.addImage(pngDataUrl, "PNG", 0, 0, config.width, config.height);
      }
    }

    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Saving PDF...');
    pdf.save("diagram.pdf");
    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Complete!');

  } catch (error) {
    console.error("PDF Export error:", error);
    throw error;
  }
};

// Export as SVG (single or multiple pages) without scaling
export const exportSVG = async (compiledMerlin, pages, mermaidRef, config = EXPORT_CONFIGS.svg, onProgress = null) => {
  
  try {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    // Use native resolution for SVG exports
    const customMerlin = createMermaidWithCustomSize(compiledMerlin, config.width, config.height);
    const { svg: fullSvg } = await mermaid.mermaidAPI.render("export-preview", customMerlin);
    
    const extractedPages = getPagesToExport(fullSvg, config);

    // Single page export - download directly (not as ZIP)
    if (extractedPages.length === 0 || extractedPages.length === 1) {
      if (onProgress) onProgress(1, 1, 'Saving SVG...');
      const svgToExport = extractedPages.length === 1 ? extractedPages[0].svg : fullSvg;
      const blob = new Blob([svgToExport], { type: "image/svg+xml" });
      download(blob, "diagram.svg", "image/svg+xml");
      if (onProgress) onProgress(1, 1, 'Complete!');
      return;
    }

    // Multi-page export as ZIP
    const zip = new JSZip();

    for (let i = 0; i < extractedPages.length; i++) {
      const page = extractedPages[i];
      if (onProgress) onProgress(i, extractedPages.length, `Processing SVG page ${page.pageNumber}...`);
      zip.file(`page_${page.pageNumber}.svg`, page.svg);
    }

    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Creating ZIP file...');
    const zipContent = await zip.generateAsync({ type: "blob" });
    download(zipContent, "diagram_pages.zip", "application/zip");
    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Complete!');

  } catch (error) {
    console.error("SVG Export error:", error);
    throw error;
  }
};

// Export as PPTX with proper slide sizing and high resolution
export const exportPPTX = async (compiledMerlin, pages, config = EXPORT_CONFIGS.pptx, onProgress = null) => {
  
  try {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    // Render at specified resolution
    const renderWidth = Math.round(config.width * config.renderAt);
    const renderHeight = Math.round(config.height * config.renderAt);
    const customMerlin = createMermaidWithCustomSize(compiledMerlin, renderWidth, renderHeight);
    const { svg: fullSvg } = await mermaid.mermaidAPI.render("export-preview", customMerlin);
    
    const extractedPages = getPagesToExport(fullSvg, config);

    if (extractedPages.length === 0) {
      throw new Error('No pages found in SVG');
    }

    // Create PPTX with proper slide dimensions
    const pptx = new PptxGenJS();
    pptx.defineLayout({ name: 'LAYOUT_WIDE', width: config.slideWidth, height: config.slideHeight });
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = "Merlin Editor";
    pptx.title = "Merlin Diagram";
    pptx.subject = "Multi-page diagram export";

    for (let i = 0; i < extractedPages.length; i++) {
      const page = extractedPages[i];
      if (onProgress) onProgress(i, extractedPages.length, `Processing PPTX page ${page.pageNumber}...`);
      
      const slide = pptx.addSlide();
      
      // Use high resolution PNG for better quality in slides
      const pngDataUrl = await svgToPng(page.svg, {
        width: config.width,
        height: config.height,
        useHighDPI: true
      });

      if (pngDataUrl) {
        slide.addImage({
          data: pngDataUrl,
          x: 0,
          y: 0,
          w: config.slideWidth,
          h: config.slideHeight,
          sizing: {
            type: 'contain',
            w: config.slideWidth,
            h: config.slideHeight
          }
        });
      }
    }

    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Saving PPTX...');
    await pptx.writeFile({ fileName: "diagram.pptx" });
    if (onProgress) onProgress(extractedPages.length, extractedPages.length, 'Complete!');

  } catch (error) {
    console.error("PPTX Export error:", error);
    throw error;
  }
};

// Export as HTML with navigation controls and native resolution
export const exportHTML = async (compiledMerlin, pages, config = EXPORT_CONFIGS.html, onProgress = null) => {
  
  try {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    // Use native resolution for HTML exports
    const customMerlin = createMermaidWithCustomSize(compiledMerlin, config.width, config.height);
    const { svg: fullSvg } = await mermaid.mermaidAPI.render("export-preview", customMerlin);
    
    const extractedPages = getPagesToExport(fullSvg, config);
    const totalPages = extractedPages.length;

    if (onProgress) onProgress(1, 1, 'Creating HTML...');

    // For single-page SVG, ensure <g class="page"> is visible by setting style="display:inline"
    let svgToUse = fullSvg;
    if (totalPages === 1) {
      // Replace display="inline" with style="display:inline" on the <g class="page"> element
      svgToUse = fullSvg.replace(/(<g[^>]*class=["']page["'][^>]*)(display=["']inline["'])/i, (match, p1) => {
        // Remove display attribute and add style
        return p1.replace(/\sdisplay=["']inline["']/i, '') + ' style="display:inline"';
      });
    }

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Merlin Diagram</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 20px; 
      background: white; 
      overflow-x: auto;
    }
    .container { 
      max-width: ${config.width}px; 
      margin: 0 auto; 
    }
    .controls { 
      margin-bottom: 20px; 
      text-align: center; 
      position: sticky;
      top: 0;
      background: white;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      z-index: 100;
    }
    button { 
      padding: 10px 20px; 
      margin: 0 5px; 
      cursor: pointer; 
      background: #007bff; 
      color: white; 
      border: none; 
      border-radius: 4px; 
    }
    button:hover { background: #0056b3; }
    button:disabled { background: #ccc; cursor: not-allowed; }
    .page-info { margin: 0 20px; font-weight: bold; }
    .svg-container { 
      text-align: center; 
      border: 1px solid #ccc; 
      padding: 20px; 
      background: white;
      min-height: ${config.height}px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .svg-container svg {
      max-width: 100%;
      height: auto;
    }
    .page { display: none; }
    .page.active { display: inline; }
    @media (max-width: 768px) {
      .container { margin: 10px; }
      .controls { margin-bottom: 10px; }
      button { padding: 8px 16px; font-size: 14px; }
    }
  </style>
</head>
<body>
  <div class="container">
    ${totalPages > 1 ? `
    <div class="controls">
      <button id="prev-btn" onclick="previousPage()">Previous</button>
      <span class="page-info">Page <span id="current-page">1</span> of <span id="total-pages">${totalPages}</span></span>
      <button id="next-btn" onclick="nextPage()">Next</button>
    </div>` : ''}
    <div class="svg-container">
      ${svgToUse}
    </div>
  </div>
  
  <script>
    let currentPage = 1;
    const totalPages = ${totalPages};
    
    function updateButtons() {
      const prevBtn = document.getElementById('prev-btn');
      const nextBtn = document.getElementById('next-btn');
      
      if (prevBtn && nextBtn) {
        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
      }
    }
    
    function showPage(pageNumber) {
      const pages = document.querySelectorAll('g.page');
      pages.forEach((page, index) => {
        if (index + 1 === pageNumber) {
          page.style.display = 'inline';
        } else {
          page.style.display = 'none';
        }
      });
      
      const currentPageEl = document.getElementById('current-page');
      if (currentPageEl) {
        currentPageEl.textContent = pageNumber;
      }
      currentPage = pageNumber;
      updateButtons();
    }
    
    function previousPage() {
      if (currentPage > 1) {
        showPage(currentPage - 1);
      }
    }
    
    function nextPage() {
      if (currentPage < totalPages) {
        showPage(currentPage + 1);
      }
    }
    
    // Initialize - show first page if multiple pages exist
    document.addEventListener('DOMContentLoaded', function() {
      if (totalPages > 1) {
        showPage(1);
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        previousPage();
      } else if (e.key === 'ArrowRight') {
        nextPage();
      }
    });
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    download(blob, "diagram.html", "text/html");
    if (onProgress) onProgress(1, 1, 'Complete!');

  } catch (error) {
    console.error("HTML Export error:", error);
    throw error;
  }
};

// Export as Video (MP4/WebM) with frame transitions
export const exportVideo = async (compiledMerlin, pages, config = EXPORT_CONFIGS.video, onProgress = null) => {
  
  try {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    // Render at specified resolution
    const renderWidth = Math.round(config.width * config.renderAt);
    const renderHeight = Math.round(config.height * config.renderAt);
    const customMerlin = createMermaidWithCustomSize(compiledMerlin, renderWidth, renderHeight);
    const { svg: fullSvg } = await mermaid.mermaidAPI.render("export-preview", customMerlin);
    
    const extractedPages = getPagesToExport(fullSvg, config);

    if (extractedPages.length === 0) {
      throw new Error('No pages found in SVG - cannot create video');
    }

    if (extractedPages.length === 1) {
      throw new Error('Video export requires multiple pages');
    }

    if (onProgress) onProgress(0, extractedPages.length + 1, 'Converting pages to frames...');

    // Convert all pages to PNG frames
    const frames = [];
    for (let i = 0; i < extractedPages.length; i++) {
      const page = extractedPages[i];
      if (onProgress) onProgress(i, extractedPages.length + 1, `Converting page ${page.pageNumber} to frame...`);
      
      const pngDataUrl = await svgToPng(page.svg, {
        width: config.width,
        height: config.height,
        useHighDPI: true
      });

      if (pngDataUrl) {
        frames.push({
          dataUrl: pngDataUrl,
          pageNumber: page.pageNumber
        });
      }
    }

    if (frames.length === 0) {
      throw new Error('Failed to convert pages to frames');
    }

    if (onProgress) onProgress(extractedPages.length, extractedPages.length + 1, 'Creating video...');

    // Create video using MediaRecorder API and Canvas
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    const ctx = canvas.getContext('2d');

    // Create a video stream from the canvas
    const stream = canvas.captureStream(config.fps);
    
    // Use more universally compatible codecs
    let mimeType;
    if (config.format === 'mp4') {
      // For MP4, try H.264 codec which is more universally supported
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        mimeType = 'video/mp4;codecs=avc1';
      } else if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else {
        // Fallback to WebM with VP8 (more compatible than VP9)
        mimeType = 'video/webm;codecs=vp8';
      }
    } else {
      // For WebM, prefer VP8 over VP9 for better compatibility
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else {
        mimeType = 'video/webm';
      }
    }
    
    const mediaRecorder = new MediaRecorder(stream, { mimeType });

    const chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: mimeType
        });
        
        // Determine file extension based on actual codec used
        let fileName;
        if (mimeType.includes('mp4') || config.format === 'mp4') {
          fileName = 'diagram.mp4';
        } else {
          fileName = 'diagram.webm';
        }
        
        download(blob, fileName, blob.type);
        
        if (onProgress) onProgress(extractedPages.length + 1, extractedPages.length + 1, 'Complete!');
        resolve();
      };

      mediaRecorder.onerror = (error) => {
        console.error('MediaRecorder error:', error);
        reject(new Error('Failed to create video'));
      };

      // Start recording
      mediaRecorder.start();

      let currentFrameIndex = 0;
      const frameDuration = config.frameDuration || 1000; // milliseconds
      
      const drawFrame = async () => {
        if (currentFrameIndex >= frames.length) {
          // Finished all frames, stop recording
          mediaRecorder.stop();
          return;
        }

        const frame = frames[currentFrameIndex];
        
        // Load and draw the image
        const img = new Image();
        img.onload = () => {
          // Clear canvas
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw the frame centered
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const canvasAspectRatio = canvas.width / canvas.height;
          
          let drawWidth, drawHeight, drawX, drawY;
          
          if (aspectRatio > canvasAspectRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / aspectRatio;
            drawX = 0;
            drawY = (canvas.height - drawHeight) / 2;
          } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * aspectRatio;
            drawX = (canvas.width - drawWidth) / 2;
            drawY = 0;
          }
          
          ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
          
          // Move to next frame after the specified duration
          currentFrameIndex++;
          setTimeout(drawFrame, frameDuration);
        };
        
        img.onerror = () => {
          console.error('Failed to load frame:', currentFrameIndex);
          currentFrameIndex++;
          setTimeout(drawFrame, 100); // Try next frame quickly
        };
        
        img.src = frame.dataUrl;
      };

      // Start drawing frames
      drawFrame();
    });

  } catch (error) {
    console.error("Video Export error:", error);
    throw error;
  }
};

// Simple GIF encoder using gif.js library
const createGIF = async (frames, config) => {
  return new Promise((resolve, reject) => {
    // Temporarily suppress console errors for worker loading
    const originalError = console.error;
    console.error = (...args) => {
      // Filter out gif.worker.js 404 errors
      if (args.some(arg => typeof arg === 'string' && arg.includes('gif.worker.js'))) {
        return; // Suppress this specific error
      }
      originalError.apply(console, args);
    };

    // Initialize GIF encoder
    const gif = new GIF({
      workers: 2, // Use workers for better performance
      quality: config.quality || 10, // 1-20, lower is better quality
      width: config.width,
      height: config.height,
      repeat: config.repeat || 0, // 0 = infinite loop
      background: '#ffffff',
      debug: false
    });

    // Restore console.error after a short delay
    setTimeout(() => {
      console.error = originalError;
    }, 1000);

    let loadedFrames = 0;

    // Add frames to the GIF
    frames.forEach((frame, index) => {
      const img = new Image();
      img.onload = () => {
        // Create a canvas to draw the image
        const canvas = document.createElement('canvas');
        canvas.width = config.width;
        canvas.height = config.height;
        const ctx = canvas.getContext('2d');
        
        // Fill with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the frame centered
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (aspectRatio > canvasAspectRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / aspectRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          drawWidth = canvas.height * aspectRatio;
          drawHeight = canvas.height;
          drawX = (canvas.width - drawWidth) / 2;
          drawY = 0;
        }
        
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        
        // Add frame to GIF with delay
        gif.addFrame(canvas, {
          delay: config.frameDuration || 1000
        });
        
        loadedFrames++;
        
        // If this is the last frame, render the GIF
        if (loadedFrames === frames.length) {
          gif.on('finished', function(blob) {
            resolve(blob);
          });
          
          gif.on('abort', function() {
            reject(new Error('GIF creation was aborted'));
          });
          
          gif.render();
        }
      };
      
      img.onerror = () => reject(new Error(`Failed to load frame ${index}`));
      img.src = frame.dataUrl;
    });
  });
};


// Export as GIF
export const exportGIF = async (compiledMerlin, pages, config = EXPORT_CONFIGS.gif, onProgress = null) => {
  
  try {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    // Render at specified resolution
    const renderWidth = Math.round(config.width * config.renderAt);
    const renderHeight = Math.round(config.height * config.renderAt);
    const customMerlin = createMermaidWithCustomSize(compiledMerlin, renderWidth, renderHeight);
    const { svg: fullSvg } = await mermaid.mermaidAPI.render("export-preview", customMerlin);
    
    const extractedPages = getPagesToExport(fullSvg, config);

    if (extractedPages.length === 0) {
      throw new Error('No pages found in SVG - cannot create GIF');
    }

    if (extractedPages.length === 1) {
      throw new Error('GIF export requires multiple pages');
    }

    if (onProgress) onProgress(0, extractedPages.length + 1, 'Converting pages to frames...');

    // Convert all pages to PNG frames
    const frames = [];
    for (let i = 0; i < extractedPages.length; i++) {
      const page = extractedPages[i];
      if (onProgress) onProgress(i, extractedPages.length + 1, `Converting page ${page.pageNumber} to frame...`);
      
      const pngDataUrl = await svgToPng(page.svg, {
        width: config.width,
        height: config.height,
        useHighDPI: true
      });

      if (pngDataUrl) {
        frames.push({
          dataUrl: pngDataUrl,
          pageNumber: page.pageNumber
        });
      }
    }

    if (frames.length === 0) {
      throw new Error('Failed to convert pages to frames');
    }

    if (onProgress) onProgress(extractedPages.length, extractedPages.length + 1, 'Creating animated GIF...');

    // Create GIF
    const gifBlob = await createGIF(frames, config);
    download(gifBlob, "diagram_animation.gif", "image/gif");
    
    if (onProgress) onProgress(extractedPages.length + 1, extractedPages.length + 1, 'Complete!');

  } catch (error) {
    console.error("GIF Export error:", error);
    throw error;
  }
};

// Main export handler
export const handleExport = async (format, compiledMerlin, pages, mermaidRef, customConfig = null, onProgress = null) => {

  // If no pages rendered, display error
  if (!compiledMerlin || !pages || pages.length === 0) {
    console.error("No pages rendered for export");
    if (onProgress) onProgress(0, 1, 'No pages rendered for export');
    throw new Error("No pages rendered for export");
  }
  
  try {
    const config = customConfig || EXPORT_CONFIGS[format];
    
    switch (format) {
      case "png":
        await exportPNG(compiledMerlin, pages, mermaidRef, config, onProgress);
        break;
      case "pdf":
        await exportPDF(compiledMerlin, pages, mermaidRef, config, onProgress);
        break;
      case "svg":
        await exportSVG(compiledMerlin, pages, mermaidRef, config, onProgress);
        break;
      case "pptx":
        await exportPPTX(compiledMerlin, pages, config, onProgress);
        break;
      case "html":
        await exportHTML(compiledMerlin, pages, config, onProgress);
        break;
      case "video":
        await exportVideo(compiledMerlin, pages, config, onProgress);
        break;
      case "gif":
        await exportGIF(compiledMerlin, pages, config, onProgress);
        break;
      case "custom":
        // Custom export with dialog will be handled by calling component
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
  } catch (error) {
    console.error(`${format.toUpperCase()} export error:`, error);
    if (onProgress) onProgress(0, 1, `Export failed: ${error.message}`);
    throw error;
  }
};

// Export CONFIGS for external use
export { EXPORT_CONFIGS };
