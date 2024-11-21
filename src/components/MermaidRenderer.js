import React, { useEffect, useRef } from "react";
import mermaid from "../libs/mermaid.esm.mjs";
import { ElementEditor } from "./ElementEditor";

const MermaidRenderer = ({
  text,
  update,
  exampleSvg,
  setTotalPages,
  setSvgContent,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "forest",
      logLevel: 5,
    });

    const renderMermaid = async () => {
      if (ref.current && text !== "") {
        try {
          if (exampleSvg) {
            // Use the provided exampleSvg if available
            ref.current.innerHTML = exampleSvg;
            update(ref.current);
            // setupNavigation(ref.current.querySelector('svg'));
          } else {
            const { svg } = await mermaid.mermaidAPI.render("preview", text);
            // const svg_element = document.getElementById('preview');
            // console.log("mermaidRenderer svg_element: ", svg);
            // const totalPages = svg.querySelectorAll('g.page').length;
            // console.log("mermaidRenderer totalPages: ", totalPages);
            // setTotalPages(totalPages);
            setSvgContent(svg);
            ref.current.innerHTML = svg;
            update(ref.current);
            // Set up navigation after rendering the SVG
            // setupNavigation(ref.current.querySelector('svg'));
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
  }, [text, exampleSvg]);

  const setupNavigation = (svg) => {
    console.log("setupNavigation svg:\n", svg);
    if (!svg) return;

    // let currentPage = 0;
    const pages = svg.querySelectorAll("g.page");
    // const totalPages = pages.length;
    let playInterval = null;

    function renderPage(pageIndex) {
      pages.forEach((page) => {
        page.style.display = "none";
      });
      pages[pageIndex].style.display = "inline";

      // const prevButton = svg.querySelector('#prevButton');
      // const nextButton = svg.querySelector('#nextButton');

      // if (prevButton) prevButton.setAttribute('fill', pageIndex > 0 ? '#007bff' : '#c0c0c0');
      // if (nextButton) nextButton.setAttribute('fill', pageIndex < totalPages - 1 ? '#007bff' : '#c0c0c0');

      // const pageIndicator = svg.querySelector('#pageIndicator');
      // if (pageIndicator) {
      //   pageIndicator.textContent = `${pageIndex + 1} / ${totalPages}`;
      // }
    }

    renderPage(currentPage);
  };

  return <div ref={ref} className="mermaid-container" />;
};

export default MermaidRenderer;
