// src/components/MermaidRenderer.js
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

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

  return <div ref={ref} className="mermaid-container" />;
};

export default MermaidRenderer;
