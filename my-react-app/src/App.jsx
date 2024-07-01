import React, { useState, useRef } from "react";
import CodeEditor from "./components/CodeEditor";
import "./components/NavigationBar.css";
import MermaidRenderer from "./components/MermaidRenderer";
import NavigationBar from "./components/NavigationBar";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import "./index.css";
import download from "downloadjs";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { examples } from "./examples"; // Import the generated examples file
import "./App.css"; // Import the new CSS file for the top bar

// Import the image directly
import appIcon from "./public/PEACH.svg";

const App = () => {
  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [code1, setCode1] = useState("// Code Editor 1");
  const [mermaidCode, setMermaidCode] = useState("");
  const [activeTab, setActiveTab] = useState("examples"); // State for active tab

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const navBarWidth = Math.max(Math.min(window.innerWidth / 10, 220), 200);
  console.log(navBarWidth);

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
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDownload = () => {
    if (mermaidRef.current) {
      const svg = mermaidRef.current.innerHTML;
      download(svg, "diagram.svg", "image/svg+xml");
    }
  };

  const handleExport = async (format) => {
    if (mermaidRef.current) {
      const dataUrl = await toPng(mermaidRef.current);
      if (format === "png") {
        download(dataUrl, "diagram.png");
      } else if (format === "pdf") {
        const pdf = new jsPDF();
        pdf.addImage(dataUrl, "PNG", 10, 10, 180, 160);
        pdf.save("diagram.pdf");
      }
    }
  };

  const handleSave = () => {
    const savedData = {
      code1,
      mermaidCode,
    };
    localStorage.setItem("savedDiagram", JSON.stringify(savedData));
    alert("Diagram saved!");
  };

  const handleEditor1Change = (value) => {
    setCode1(value);
    if (examples.find((example) => example.userCode.trim() === value.trim())) {
      setMermaidCode(
        examples.find((example) => example.userCode.trim() === value.trim())
          .renderCode
      );
    } else {
      setMermaidCode("");
    }
  };

  const handleSelectExample = (item) => {
    setCode1(item.userCode);
    setMermaidCode(item.renderCode);
  };

  return (
    <div ref={containerRef} className="container">
      <div className="top-bar">
        <img src={appIcon} alt="App Icon" className="app-icon" />
        <span className="app-name">Intuition Vis</span>
        <nav className="top-nav">
          <a href="#" className="top-nav-link">
            GitHub Repo
          </a>
          <a href="#" className="top-nav-link">
            Docs
          </a>
          <a href="#" className="top-nav-link">
            Tutorial
          </a>
          <a href="https://eth-peach-lab.github.io/intuition-visualisation/" className="top-nav-link">
            Intuition Viewer
          </a>
        </nav>
      </div>
      <div
        style={{
          display: "flex",
          height: "calc(100% - 50px)",
          marginTop: "50px",
        }}
      >
        <NavigationBar
          items={examples}
          onSelect={handleSelectExample}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div
          style={{
            display: "flex",
            height: "100%",
            width: `calc(100% - ${navBarWidth}px)`,
            marginLeft: `0px`,
          }}
        >
          <div
            className="CodeEditorsContent"
            style={{
              width: leftWidth,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              borderRight: "1px solid #ccc",
              position: "relative",
            }}
          >
            <div className="nav-tabs">
              <button className="nav-tab-code-editor">Code Editor</button>
            </div>
            <ResizableBox
              height={editor1Height}
              width={Infinity}
              resizeHandles={["s"]}
              onResizeStop={(e, data) => setEditor1Height(data.size.height)}
              minConstraints={[Infinity, 100]}
              maxConstraints={[Infinity, window.innerHeight - 100]}
              handle={
                <span
                  style={{
                    width: "100%",
                    height: "20px",
                    background: "#666",
                    cursor: "row-resize",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                  }}
                />
              }
            >
              <div style={{ height: "100%" }}>
                <CodeEditor value={code1} onChange={handleEditor1Change} />
              </div>
            </ResizableBox>
            <div
              style={{
                height: `calc(100% - ${editor1Height}px)`,
                overflow: "hidden",
              }}
            >
              <CodeEditor value={mermaidCode} onChange={setMermaidCode} />
            </div>
          </div>
          <div
            style={{
              width: "5px",
              cursor: "col-resize",
              backgroundColor: "#666",
              position: "relative",
              zIndex: 1,
            }}
            onMouseDown={handleMouseDown}
          />
          <div
            className="SvgRenderContent"
            style={{
              width: `calc(100%`,
              overflow: "auto",
              position: "relative",
            }}
          >
            <div className="nav-tabs">
              <button className="nav-tab-svg-render">Diagram Renderer</button>
            </div>
            <div className="buttons-container">
              <button onClick={handleDownload} className="download-button">
                Download SVG
              </button>
              <div className="dropdown">
                <button className="export-button">Export</button>
                <div className="dropdown-content">
                  <button onClick={() => handleExport("png")}>
                    Export as PNG
                  </button>
                  <button onClick={() => handleExport("pdf")}>
                    Export as PDF
                  </button>
                </div>
              </div>
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            </div>
            <div
              ref={mermaidRef}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <MermaidRenderer text={mermaidCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
