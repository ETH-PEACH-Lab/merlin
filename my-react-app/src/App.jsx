// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import CodeEditor from './components/CodeEditor';
import MermaidRenderer from './components/MermaidRenderer';
import NavigationBar from './components/NavigationBar';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './index.css';
import download from 'downloadjs';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

// Import the loaded examples
import examples from './examples';

const App = () => {
  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [code1, setCode1] = useState('// Code Editor 1');
  const [mermaidCode, setMermaidCode] = useState('');

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const navBarWidth = Math.min(window.innerWidth / 10, 220);

  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = leftWidth;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      if (newWidth > 100 && newWidth < window.innerWidth - 100) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDownload = () => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.innerHTML;
      download(svg, 'diagram.svg', 'image/svg+xml');
    }
  };

  const handleExport = async (format) => {
    if (mermaidRef.current) {
      const dataUrl = await toPng(mermaidRef.current);
      if (format === 'png') {
        download(dataUrl, 'diagram.png');
      } else if (format === 'pdf') {
        const pdf = new jsPDF();
        pdf.addImage(dataUrl, 'PNG', 10, 10, 180, 160);
        pdf.save('diagram.pdf');
      }
    }
  };

  const handleEditor1Change = (value) => {
    setCode1(value);
    const example = examples.find((example) => example.userCode.trim() === value.trim());
    if (example) {
      setMermaidCode(example.renderCode);
    } else {
      setMermaidCode('');
    }
  };

  const handleSelectExample = (item) => {
    setCode1(item.userCode);
    setMermaidCode(item.renderCode);
  };

  return (
    <div ref={containerRef} className="container">
      <NavigationBar items={examples} onSelect={handleSelectExample} />
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: `calc(100% - ${navBarWidth}px)`,
          marginLeft: `${navBarWidth}px`,
        }}
      >
        <div
          style={{
            width: leftWidth,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRight: '1px solid #ccc',
            position: 'relative',
          }}
        >
          <ResizableBox
            height={editor1Height}
            width={Infinity}
            resizeHandles={['s']}
            onResizeStop={(e, data) => setEditor1Height(data.size.height)}
            minConstraints={[Infinity, 100]}
            maxConstraints={[Infinity, window.innerHeight - 100]}
            handle={
              <span
                style={{
                  width: '100%',
                  height: '20px',
                  background: '#666',
                  cursor: 'row-resize',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                }}
              />
            }
          >
            <div style={{ height: '100%' }}>
              <CodeEditor value={code1} onChange={handleEditor1Change} />
            </div>
          </ResizableBox>
          <div style={{ height: `calc(100% - ${editor1Height}px)`, overflow: 'hidden' }}>
            <CodeEditor value={mermaidCode} onChange={setMermaidCode} />
          </div>
        </div>
        <div
          style={{
            width: '5px',
            cursor: 'col-resize',
            backgroundColor: '#666',
            position: 'relative',
            zIndex: 1,
          }}
          onMouseDown={handleMouseDown}
        />
        <div style={{ width: `calc(100% - ${leftWidth}px)`, padding: '10px', overflow: 'auto', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <button onClick={handleDownload} className="download-button">
              Download SVG
            </button>
            <div className="dropdown">
              <button className="export-button">Export</button>
              <div className="dropdown-content">
                <button onClick={() => handleExport('png')}>Export as PNG</button>
                <button onClick={() => handleExport('pdf')}>Export as PDF</button>
              </div>
            </div>
          </div>
          <div ref={mermaidRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <MermaidRenderer text={mermaidCode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
