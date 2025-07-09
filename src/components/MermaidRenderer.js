import React, { useEffect, useRef } from "react";
import mermaid from '@eth-peach-lab/mermaid-merlin/packages/mermaid/dist/mermaid.esm.mjs'
import { ElementEditor } from "./ElementEditor";

const MermaidRenderer = ({
  text,
  update,
  exampleSvg,
  setSvgContent,
  currentPage,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    const setPage = (svg, pageIndex) => {
      // Create a temporary DOM element to parse the SVG
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, 'image/svg+xml');
      const svgElement = doc.querySelector('svg');
      
      if (!svgElement) return svg;
      
      // Find all page elements
      const pages = svgElement.querySelectorAll('g.page');
      
      // Set all pages to display none
      pages.forEach(page => {
        page.setAttribute('display', 'none');
      });

      // Show the specified page if it exists
      if (pages[pageIndex]) {
        pages[pageIndex].setAttribute('display', 'inline');
      }
      
      // Return the modified SVG as string
      return new XMLSerializer().serializeToString(svgElement);
    };

    const renderMermaid = async () => {
      if (ref.current && text !== "") {
        try {
          if (exampleSvg) {
            // Use the provided exampleSvg if available
            ref.current.innerHTML = exampleSvg;
            update(ref.current);
          } else if (text) {
            const { svg } = await mermaid.mermaidAPI.render("preview", text);
            ref.current.innerHTML = setPage(svg, currentPage - 1);
            update(ref.current);
          }
        } catch (error) {
          console.error("Mermaid render error:", error);
        }
      }
    };

    renderMermaid();

    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [text, exampleSvg, currentPage]);

  return <div ref={ref} className="mermaid-container" />;
};

export default MermaidRenderer;
