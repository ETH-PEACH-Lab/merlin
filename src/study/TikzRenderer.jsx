import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useStudy } from "./StudyContext";
import { getAssetPath } from "../utils/assetPath";

/**
 * Enhanced TikZ Renderer with comprehensive error detection
 * 
 * This component now captures multiple types of TikZ errors:
 * 
 * 1. CODE-LEVEL ERRORS (detected before rendering):
 *    - Unmatched braces
 *    - Missing semicolons after draw commands
 *    - Potentially undefined TikZ commands
 * 
 * 2. CONSOLE ERRORS (from TikZ compilation):
 *    - LaTeX compilation errors
 *    - Package errors
 *    - Undefined control sequences
 * 
 * 3. VISUAL ERRORS (detected in rendered output):
 *    - Broken images (including specific patterns like //invalid.site/img-not-found.png)
 *    - Error text in the output
 *    - Empty or minimal output
 *    - Suspicious image sources
 *    - HTML error patterns
 * 
 * All errors are logged to PostHog for analytics and debugging.
 */

// 1:1 with tikzjax-live: load fonts and tikzjax once, then use script[type="text/tikz"] updates with a 500ms debounce window
const ensureTikzJax = () => new Promise((resolve) => {
  if (window.TikzJax || window.tikzjax) return resolve();
  
  console.log('TikZ: Loading fonts and tikzjax...');
  // Fallback to raw GitHub if local assets are missing (use main branch)
  const cdnBase = 'https://raw.githubusercontent.com/bill-ion/tikzjax-live/refs/heads/main/dist';
  
  if (!document.querySelector('link[data-tikzjax-fonts]')) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.type = 'text/css';
    // Load local copy copied by webpack from study assets
    const fontsPath = getAssetPath('study/tikzjax/fonts.css');
    l.href = fontsPath;
    l.setAttribute('data-tikzjax-fonts', '1');
    console.log('TikZ: Loading fonts from:', fontsPath);
    l.onerror = () => {
      if (l.getAttribute('data-cdn-tried')) return; // avoid loop
      const cdnHref = `${cdnBase}/fonts.css`;
      console.warn('TikZ: Local fonts.css failed, falling back to CDN:', cdnHref);
      l.setAttribute('data-cdn-tried', '1');
      l.href = cdnHref;
    };
    document.head.appendChild(l);
  }
  
  const existing = document.querySelector('script[data-tikzjax]');
  if (existing) {
    existing.addEventListener('load', () => resolve(), { once: true });
    return;
  }
  
  const s = document.createElement('script');
  // Load local tikzjax build copied by webpack (under study)
  const scriptPath = getAssetPath('study/tikzjax/tikzjax.js');
  s.src = scriptPath;
  s.async = true;
  s.setAttribute('data-tikzjax', '1');
  console.log('TikZ: Loading script from:', scriptPath);
  s.onerror = () => {
    if (s.getAttribute('data-cdn-tried')) return; // avoid loop
    const cdnSrc = `${cdnBase}/tikzjax.js`;
    console.warn('TikZ: Local tikzjax.js failed, falling back to CDN:', cdnSrc);
    s.setAttribute('data-cdn-tried', '1');
    s.src = cdnSrc;
  };
  s.onload = () => resolve();
  document.head.appendChild(s);
});

export default function TikzRenderer({ code }) {
  const outputRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const debounceDoRef = useRef(false);
  const readyRef = useRef(false);
  const { phase, currentKind, logEvent, rememberError, notifySuccess } = useStudy();
  const inStudyTask = phase === 'task' && currentKind === 'tikz';
  const observerRef = useRef(null);
  const lastErrorRef = useRef({ ts: 0, hash: '' });
  
  // Add debounce for error logging to avoid immediate logging while user is typing
  const errorLogDebounceRef = useRef(null);
  const pendingErrorsRef = useRef([]);

  // Debounced error logging - only log after user stops typing
  const debouncedLogError = (errorInfo) => {
    // Clear any existing debounce timer
    if (errorLogDebounceRef.current) {
      clearTimeout(errorLogDebounceRef.current);
    }
    
    // Add error to pending list
    pendingErrorsRef.current.push(errorInfo);
    
    // Set timer to log errors after 2 seconds of inactivity
    errorLogDebounceRef.current = setTimeout(() => {
      if (pendingErrorsRef.current.length > 0 && logEvent) {
        // Log all pending errors
        pendingErrorsRef.current.forEach(error => {
          try {
            logEvent('tikz_render_error', error);
          } catch (logError) {
            console.warn('Failed to log error:', logError);
          }
        });
        
        // Clear pending errors
        pendingErrorsRef.current = [];
        
        // Clear timer reference
        errorLogDebounceRef.current = null;
      }
    }, 2000); // Wait 2 seconds after last error detection
  };

  const computeHash = (s) => {
    if (!s || typeof s !== 'string') return '0';
    try {
      let h = 0;
      for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
      return String(h);
    } catch { return '0'; }
  };

  // Detect common TikZ syntax errors in the code
  const detectCodeErrors = (tikzCode) => {
    if (!tikzCode || typeof tikzCode !== 'string' || !tikzCode.trim?.()) return null;
    
    const errors = [];
    const lines = tikzCode.split?.('\n') || [];
    
    // Check for common syntax issues
    lines.forEach((line, index) => {
      const trimmedLine = line?.trim?.() || '';
      if (!trimmedLine || trimmedLine.startsWith?.('%')) return;
      
      // Check for unmatched braces - only if there's a significant mismatch
      const openBraces = (trimmedLine.match?.(/\{/g) || []).length;
      const closeBraces = (trimmedLine.match?.(/\}/g) || []).length;
      if (Math.abs(openBraces - closeBraces) > 1) { // Allow small differences
        errors.push({
          type: 'unmatched_braces',
          line: index + 1,
          lineContent: trimmedLine,
          openBraces,
          closeBraces
        });
      }
      
      // Check for missing semicolons - only for draw commands that clearly need them
      if (trimmedLine.includes?.('\\draw') && trimmedLine.includes?.('--') && !trimmedLine.includes?.(';')) {
        // Only flag if it's a line that should end with semicolon
        if (!trimmedLine.includes?.('\\draw[') && !trimmedLine.includes?.('\\draw(')) {
          errors.push({
            type: 'missing_semicolon',
            line: index + 1,
            lineContent: trimmedLine
          });
        }
      }
      
      // Check for undefined commands - be more conservative
      if (trimmedLine.includes?.('\\') && !trimmedLine.includes?.('\\draw') && !trimmedLine.includes?.('\\fill') && 
          !trimmedLine.includes?.('\\node') && !trimmedLine.includes?.('\\path') && !trimmedLine.includes?.('\\begin') && 
          !trimmedLine.includes?.('\\end') && !trimmedLine.includes?.('\\tikz') && !trimmedLine.includes?.('\\coordinate') && 
          !trimmedLine.includes?.('\\foreach') && !trimmedLine.includes?.('\\def') && !trimmedLine.includes?.('\\newcommand')) {
        
        const command = trimmedLine.match?.(/\\[a-zA-Z]+/)?.[0];
        if (command) {
          // Only flag if it's clearly not a standard TikZ command
          const nonStandardCommands = ['\\invalid', '\\broken', '\\error'];
          if (nonStandardCommands.includes?.(command)) {
            errors.push({
              type: 'potentially_undefined_command',
              line: index + 1,
              lineContent: trimmedLine,
              command
            });
          }
        }
      }
    });
    
    return errors.length > 0 ? errors : null;
  };

  // Detect visual error patterns in the rendered output
  const detectVisualErrors = (outputElement) => {
    if (!outputElement || typeof outputElement.querySelectorAll !== 'function') return null;
    
    const visualErrors = [];
    
    // Check for broken images (like the example you showed)
    const images = outputElement.querySelectorAll?.('img') || [];
    images.forEach((img, index) => {
      if (!img || typeof img.src !== 'string') return;
      const src = img.src || img.getAttribute?.('src') || '';
      if (src && typeof src === 'string') {
        // Check for specific broken image patterns
        if (src.includes?.('invalid') || src.includes?.('not-found') || src.includes?.('error') || 
            src.includes?.('//invalid.site') || src.includes?.('img-not-found.png')) {
          visualErrors.push({
            type: 'broken_image',
            index,
            src: src,
            alt: img.alt || 'no-alt',
            isSpecificError: src.includes?.('//invalid.site') || src.includes?.('img-not-found.png')
          });
        }
        
        // Check for other suspicious image patterns
        if (src.startsWith?.('//') || src.includes?.('localhost') || src.includes?.('127.0.0.1')) {
          visualErrors.push({
            type: 'suspicious_image_src',
            index,
            src: src,
            alt: img.alt || 'no-alt'
          });
        }
      }
    });
    
    // Check for error messages in the output
    const errorTexts = outputElement.querySelectorAll?.('*') || [];
    errorTexts.forEach((element) => {
      if (!element || typeof element.textContent !== 'string') return;
      const text = element.textContent || '';
      if (text && /error|Error|ERROR|failed|Failed|FAILED|undefined|Undefined|UNDEFINED/i.test(text)) {
        visualErrors.push({
          type: 'error_text',
          text: text.substring?.(0, 100) || text,
          tagName: element.tagName || 'unknown',
          className: element.className || ''
        });
      }
    });
    
    // Check for empty or minimal output (might indicate compilation failure)
    const nonScriptElements = Array.from(outputElement.children || []).filter(child => child.tagName !== 'SCRIPT');
    if (nonScriptElements.length === 0) {
      visualErrors.push({
        type: 'empty_output',
        message: 'No rendered content found'
      });
    }
    
    // Check for specific error patterns in the HTML structure
    const htmlContent = outputElement.innerHTML || '';
    if (htmlContent.includes?.('invalid.site') || htmlContent.includes?.('img-not-found.png')) {
      visualErrors.push({
        type: 'html_error_pattern',
        pattern: htmlContent.includes?.('invalid.site') ? 'invalid.site' : 'img-not-found.png',
        htmlSnippet: htmlContent.substring?.(0, 200) || htmlContent
      });
    }
    
    return visualErrors.length > 0 ? visualErrors : null;
  };

  const checkConsoleAndLog = () => {
    if (!inStudyTask || !outputRef.current || typeof outputRef.current.querySelectorAll !== 'function' || !logEvent) return;
    try {
      // Check for code-level syntax errors first
      const codeErrors = code ? detectCodeErrors(code) : null;
      
      // Check console output for errors
      const pre = outputRef.current.querySelector?.('pre.console');
      const consoleText = pre?.textContent || '';
      
      // Check for visual errors and broken elements using the new detection
      const visualErrors = outputRef.current ? detectVisualErrors(outputRef.current) : null;
      const brokenImages = outputRef.current.querySelectorAll?.('img[src*="invalid"], img[src*="not-found"], img[src*="error"]') || [];
      const errorElements = outputRef.current.querySelectorAll?.('.error, .tikz-error, [data-error]') || [];
      const emptyOutput = (outputRef.current.children?.length || 0) === 0 || 
                         ((outputRef.current.children?.length || 0) === 1 && outputRef.current.children?.[0]?.tagName === 'SCRIPT');
      
      // Check for specific TikZ error patterns
      const hasConsoleError = /error|undefined|missing|Undefined control sequence|Package.*Error|LaTeX.*Error|!.*Error/i.test(consoleText);
      const hasVisualError = visualErrors && visualErrors.length > 0 || brokenImages.length > 0 || errorElements.length > 0 || emptyOutput;
      const hasCodeError = codeErrors && codeErrors.length > 0;
      
      if (hasConsoleError || hasVisualError || hasCodeError) {
        // Collect error information
        const errorInfo = {
          codeErrors: hasCodeError ? codeErrors : null,
          visualErrors: visualErrors,
          consoleError: hasConsoleError ? (consoleText.split?.('\n')?.slice?.(0, 6)?.join?.('\n') || consoleText) : null,
          brokenImages: brokenImages.length,
          errorElements: errorElements.length,
          emptyOutput,
          codeLen: (code || '').length,
          outputHTML: outputRef.current?.innerHTML?.substring(0, 500) || '', // First 500 chars for debugging
          errorTypes: []
        };
        
        // Add error type flags
        if (hasCodeError) errorInfo.errorTypes.push('syntax');
        if (hasConsoleError) errorInfo.errorTypes.push('console');
        if (hasVisualError) errorInfo.errorTypes.push('visual');
        
        // Create a unique signature for deduplication
        let errorSignature;
        try {
          errorSignature = JSON.stringify({
            codeErrors: errorInfo.codeErrors?.map?.(e => `${e?.type || 'unknown'}:${e?.line || 'unknown'}`),
            visualErrors: errorInfo.visualErrors?.map?.(e => `${e?.type || 'unknown'}:${e?.src || e?.text || e?.message || 'unknown'}`),
            consoleError: errorInfo.consoleError,
            brokenImages: errorInfo.brokenImages,
            errorElements: errorInfo.errorElements,
            emptyOutput: errorInfo.emptyOutput
          });
        } catch (jsonError) {
          console.warn('Failed to stringify error signature:', jsonError);
          errorSignature = 'error_signature_failed';
        }
        
        const sig = errorSignature ? computeHash(errorSignature) : '0';
        const now = Date.now?.() || 0;
        
        // Avoid logging duplicate errors within 2 seconds
        if (lastErrorRef.current.hash === sig && now - lastErrorRef.current.ts < 2000) return;
        lastErrorRef.current = { ts: now, hash: sig };
        
        // Coordinate error with study environment (do not log yet)
        rememberError && rememberError('tikz', 'tikz_render_error', errorInfo);
        
        // Also log to console for debugging (immediate)
        console.warn('TikZ Render Error Detected (will be logged after inactivity):', errorInfo);
      } else {
        // No errors detected and there is output: count as success and cancel pending error
        if (!emptyOutput) {
          notifySuccess && notifySuccess('tikz');
        }
      }
    } catch (error) {
      console.warn('Error checking TikZ output:', error);
    }
  };

  const update = async () => {
    if (!outputRef.current || typeof outputRef.current.innerHTML !== 'string') return;
    if (!readyRef.current) {
      await ensureTikzJax();
      readyRef.current = true;
    }
    
    // Try to restore content first (only if we have code)
    if (code && code.trim?.()) {
      const restored = restoreTikZContent();
      if (restored) {
            // If restoration was successful, just check for errors
    setTimeout(() => {
      if (outputRef.current) {
        checkConsoleAndLog();
      }
    }, 200);
    return;
      }
    }
    
    // If no code or restoration failed, clear the output
    if (!code || !code.trim?.()) {
      if (outputRef.current) {
        try {
          outputRef.current.innerHTML = '';
        } catch (error) {
          console.warn('Failed to clear TikZ output DOM:', error);
        }
      }
      return;
    }
    
    const s = document.createElement('script');
    s.setAttribute('type', 'text/tikz');
    s.setAttribute('data-show-console', 'true');
    s.textContent = `\n${code}\n  `;
    if (outputRef.current) {
      try {
        outputRef.current.innerHTML = '';
        outputRef.current.appendChild(s);
      } catch (error) {
        console.warn('Failed to update TikZ output DOM:', error);
        return;
      }
    }
    
    // Check for errors multiple times to catch delayed errors
    setTimeout(() => {
      if (outputRef.current) {
        checkConsoleAndLog();
        // Save successful content if no errors detected
        if ((outputRef.current.children?.length || 0) > 1) { // More than just the script tag
          saveTikZContent(outputRef.current.innerHTML);
        }
      }
    }, 200);  // Initial check
    setTimeout(() => {
      if (outputRef.current) {
        checkConsoleAndLog();
      }
    }, 1000); // Check again after 1 second
    setTimeout(() => {
      if (outputRef.current) {
        checkConsoleAndLog();
        // Save content after final check
        if ((outputRef.current.children?.length || 0) > 1) {
          saveTikZContent(outputRef.current.innerHTML);
        }
      }
    }, 3000); // Final check after 3 seconds
  };

  const scheduleUpdateLikeDemo = () => {
    if (debounceTimerRef.current) {
      debounceDoRef.current = true;
      return;
    }
    // Immediate update on first change in the window
    if (outputRef.current && typeof outputRef.current.innerHTML === 'string') {
      update();
    }
    debounceTimerRef.current = setTimeout(() => {
      debounceTimerRef.current = null;
      if (debounceDoRef.current && outputRef.current && typeof outputRef.current.innerHTML === 'string') {
        update();
      }
      debounceDoRef.current = false;
    }, 500);
  };

  // Restore TikZ content from localStorage if available
  const restoreTikZContent = () => {
    if (!code || !outputRef.current || typeof outputRef.current.innerHTML !== 'string') return;
    
    try {
      // Try to restore from localStorage
      const storageKey = `tikz_content_${code ? code.length : 0}_${code ? computeHash(code) : '0'}`;
      let savedContent;
      try {
        savedContent = localStorage.getItem(storageKey);
      } catch (storageError) {
        console.warn('Failed to access localStorage:', storageError);
        return false;
      }
      
      if (savedContent) {
        // Check if the saved content is still valid (not too old)
        let parsed;
        try {
          parsed = JSON.parse(savedContent);
        } catch (parseError) {
          console.warn('Failed to parse saved content:', parseError);
          return false;
        }
        const now = Date.now?.() || 0;
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (parsed && typeof parsed.timestamp === 'number' && now - parsed.timestamp < maxAge && parsed.content && typeof parsed.content === 'string') {
          if (outputRef.current) {
            try {
              outputRef.current.innerHTML = parsed.content;
              console.log('TikZ content restored from localStorage');
              return true;
            } catch (error) {
              console.warn('Failed to restore TikZ content to DOM:', error);
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to restore TikZ content:', error);
    }
    
    return false;
  };

  // Save TikZ content to localStorage
  const saveTikZContent = (content) => {
    if (!code || !content || !code.trim?.() || !outputRef.current || typeof outputRef.current.children !== 'object') return;
    
    try {
      // Only save if we have actual rendered content (not just the script tag)
      const nonScriptElements = Array.from(outputRef.current.children || []).filter(child => child?.tagName !== 'SCRIPT');
      if (nonScriptElements.length === 0) return;
      
      const storageKey = `tikz_content_${code ? code.length : 0}_${code ? computeHash(code) : '0'}`;
      const dataToSave = {
        content: content,
        timestamp: Date.now?.() || 0,
        codeHash: code ? computeHash(code) : '0',
        codeLength: code ? code.length : 0
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        console.log('TikZ content saved to localStorage:', { key: storageKey, elements: nonScriptElements.length });
      } catch (storageError) {
        console.warn('Failed to save TikZ content to localStorage:', storageError);
      }
    } catch (error) {
      console.warn('Failed to save TikZ content:', error);
    }
  };

  useEffect(() => {
    scheduleUpdateLikeDemo();
    // Set up a MutationObserver to detect console output changes
    if (outputRef.current && typeof outputRef.current.querySelectorAll === 'function' && !observerRef.current) {
      observerRef.current = new MutationObserver(() => {
        // Add safety check to ensure the ref is still valid
        if (outputRef.current && typeof outputRef.current.querySelectorAll === 'function') {
          checkConsoleAndLog();
        }
      });
      observerRef.current.observe(outputRef.current, { childList: true, subtree: true });
    }
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      debounceDoRef.current = false;
      if (observerRef.current) { observerRef.current.disconnect(); observerRef.current = null; }
      
      // Clean up error logging debounce timer
      if (errorLogDebounceRef.current) {
        clearTimeout(errorLogDebounceRef.current);
        errorLogDebounceRef.current = null;
      }
      
      // Drop any pending local errors; centralized StudyContext handles logging debounce
      pendingErrorsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 1, py: 0.5, borderBottom: '1px solid #333', bgcolor: '#181818', display: 'flex', gap: 1, alignItems: 'center' }}>
        <Box sx={{ fontSize: 12, opacity: 0.8 }}>TikZ Render</Box>
        <Box sx={{ flex: 1 }} />
        <button onClick={update} style={{ fontSize: 12, padding: '4px 8px' }}>Render</button>
        <Box sx={{ fontSize: 11, opacity: 0.6, ml: 1 }}>(auto render enabled)</Box>
      </Box>
      <Box ref={outputRef} sx={{ 
        width: '100%', 
        flex: 1, 
        overflow: 'auto', 
        bgcolor: '#fff', 
        color: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }} />
    </Box>
  );
}



