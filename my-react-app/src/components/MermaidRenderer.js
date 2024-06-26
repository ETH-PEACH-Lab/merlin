// src/components/MermaidRenderer.js
import React, { useEffect, useRef } from 'react';
// Import your local Mermaid file
import mermaid from '../libs/mermaid.esm.mjs';

const MermaidRenderer = ({ text }) => {
  const ref = useRef(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      securityLevel: 'loose',
      theme: 'forest',
      logLevel: 5,
    });

    const renderMermaid = async () => {
      if (ref.current && text !== '') {
        try {
          const { svg } = await mermaid.mermaidAPI.render('preview', text);
          ref.current.innerHTML = svg;
        } catch (error) {
          console.error('Mermaid render error:', error);
        }
      }
    };

    renderMermaid();

    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [text]);

  console.log(<div ref={ref} className="mermaid-container" />);
  return <div ref={ref} className="mermaid-container" />;
};

export default MermaidRenderer;
