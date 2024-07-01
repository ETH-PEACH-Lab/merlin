import React, { useState, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import MermaidRenderer from './components/MermaidRenderer';
import { ResizableBox } from 'react-resizable';
import 'monaco-editor/min/vs/editor/editor.main.css';
import 'react-resizable/css/styles.css';
import './index.css';
import download from 'downloadjs';

const predefinedInputs = {
  timeline: `timeline
    title History of Social Media Platform
    2002 : LinkedIn
    2004 : Facebook
         : Google
    2005 : Youtube
    2006 : Twitter`,
  class: `---
title: Animal example
---
classDiagram
    note "From Duck till Zebra"
    Animal <|-- Duck
    note for Duck "can fly\ncan swim\ncan dive\ncan help in debugging"
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }
`,
  state: `---
title: Simple sample
---
stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
`,
visslides:`
visslides
page
array
@ 1 &blue&
@ 2
@ 3
matrix
@ 
1,2
3,4
@
page
array
@ 1
@ 2 &blue&
@ 3
@ 4
matrix
@ 
1,2,3
4,5,6
@
page
array
@ 1
@ 2 
@ 3 &blue&
@ 4
matrix
@ 
1,2,3
4,5,6
@
page
array
@ 1
@ 2 
@ 3 
@ 4 &blue&
matrix
@ 
1,2,3
4,5,6
@
`,
  // Add more predefined inputs here
};

const App = () => {
  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [code1, setCode1] = useState('// Code Editor 1: user input');
  const [mermaidCode, setMermaidCode] = useState('// Code Editor 2: mermaid input');

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);

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

  const handleEditor1Change = (value) => {
    setCode1(value);
    if (predefinedInputs[value.trim()]) {
      setMermaidCode(predefinedInputs[value.trim()]);
    } else {
      setMermaidCode('');
    }
  };

  return (
    <div ref={containerRef} style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
                height: '20px', // Match the increased height in CSS
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
          width: '5px', // Match the width in CSS
          cursor: 'col-resize',
          backgroundColor: '#666',
          position: 'relative',
          zIndex: 1,
        }}
        onMouseDown={handleMouseDown}
      />
      <div style={{ width: `calc(100% - ${leftWidth}px)`, padding: '10px', overflow: 'auto', position: 'relative' }}>
        <button
          onClick={handleDownload}
          className="download-button"
        >
          Download SVG
        </button>
        <div ref={mermaidRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <MermaidRenderer text={mermaidCode} />
        </div>
      </div>
    </div>
  );
};

export default App;
