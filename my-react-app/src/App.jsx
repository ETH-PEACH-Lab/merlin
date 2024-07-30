import React, { useState, useRef, useEffect } from "react";
import "./components/NavigationBar.css";
import NavigationBar from "./components/NavigationBar";
import EditorSection from "./components/EditorSection";
import RendererSection from "./components/RendererSection";
import "./index.css";
import download from "downloadjs";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { examples } from "./examples"; // Import the generated examples file
import "./App.css"; // Import the new CSS file for the top bar

// Import the image directly
import appIcon from "./public/empty.png";

// Import the DSL parser and translator
import { parseDSL, convertToMermaid } from "./dslParser";

const App = () => {
  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [code1, setCode1] = useState("// Code Editor 1");
  const [mermaidCode, setMermaidCode] = useState("");
  const [activeTab, setActiveTab] = useState("examples"); // State for active tab
  const [savedItems, setSavedItems] = useState([]); // State for saved items

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);
  const navBarWidth = Math.max(Math.min(window.innerWidth / 10, 220), 200);

  useEffect(() => {
    loadSavedItems();
  }, []);

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

  const handleEditor1Change = (value) => {
    setCode1(value);
    try {
      const parsedDSL = parseDSL(value);
      const mermaidCode = convertToMermaid(parsedDSL);
      setMermaidCode(mermaidCode);
    } catch (error) {
      setMermaidCode("// Invalid DSL format");
    }
  };

  const handleSelectExample = (item) => {
    setCode1(item.userCode);
    setMermaidCode(item.renderCode);
  };

  const handleSave = () => {
    const timestamp = new Date().toISOString();
    const cookieName = `diagram_${timestamp}`;
    const newSavedItem = {
      code1,
      mermaidCode,
      timestamp,
    };

    // Save new item to cookies
    document.cookie = `${cookieName}=${JSON.stringify(newSavedItem)}; max-age=31536000; path=/`;

    // Update saved items state
    setSavedItems((prevItems) => {
      const updatedItems = [...prevItems, newSavedItem];
      if (updatedItems.length > 20) {
        // Remove oldest item if more than 20
        const oldestItem = updatedItems.shift();
        document.cookie = `${oldestItem.timestamp}=; max-age=0; path=/`; // Delete the cookie
      }
      // Sort items in descending order
      updatedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return updatedItems;
    });

    // Show alert
    alert("Diagram saved successfully!");
  };

  const loadSavedItems = () => {
    const cookies = document.cookie.split("; ");
    const loadedItems = cookies
      .map((cookie) => {
        const [name, value] = cookie.split("=");
        if (name.startsWith("diagram_")) {
          return JSON.parse(decodeURIComponent(value));
        }
        return null;
      })
      .filter((item) => item !== null);

    // Sort items in descending order
    loadedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setSavedItems(loadedItems);
  };

  const handleSelectSavedItem = (item) => {
    setCode1(item.code1);
    setMermaidCode(item.mermaidCode);
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
          <a
            href="https://eth-peach-lab.github.io/intuition-visualisation/"
            className="top-nav-link"
          >
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
          savedItems={savedItems}
          onSelect={activeTab === "examples" ? handleSelectExample : handleSelectSavedItem}
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
          <EditorSection
            code1={code1}
            mermaidCode={mermaidCode}
            editor1Height={editor1Height}
            leftWidth={leftWidth}
            handleEditor1Change={handleEditor1Change}
            setEditor1Height={setEditor1Height}
            setMermaidCode={setMermaidCode}
            handleMouseDown={handleMouseDown}

          />
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
          <RendererSection
            mermaidCode={mermaidCode}
            handleDownload={handleDownload}
            handleExport={handleExport}
            handleSave={handleSave}
            mermaidRef={mermaidRef}
            updateCode={setCode1}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
