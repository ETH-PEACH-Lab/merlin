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
import { Box } from "@mui/material";
import { myParser } from "./parser/myParser";
import { convertDSLtoMermaid } from "./compiler/myCompiler.mjs";
import GUIEditor from "./components/GUIEditor";
import Header from "./components/Header";

// Import the image directly
import appIcon from "./public/empty.png";

// Import the DSL parser and translator
import { parseDSL, convertToMermaid, convertToMermaidNearley } from "./dslCompiler";

const App = () => {
  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [code1, setCode1] = useState("// Code Editor 1");
  const [mermaidCode, setMermaidCode] = useState("");
  const [exampleSvg, setExampleSvg] = useState(null); // New state for example SVG
  const [activeTab, setActiveTab] = useState("examples"); // State for active tab
  const [savedItems, setSavedItems] = useState([]); // State for saved items
  const [inspectorIndex, setInspectorIndex] = useState(null);

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);

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

  const handleExport = async (format) => {
    if (mermaidRef.current) {
      const dataUrl = await toPng(mermaidRef.current);
      if (format === "png") {
        download(dataUrl, "diagram.png");
      } else if (format === "pdf") {
        const pdf = new jsPDF();
        pdf.addImage(dataUrl, "PNG", 10, 10, 180, 160);
        pdf.save("diagram.pdf");
      } else if (format === 'svg') {
        const svg = mermaidRef.current.innerHTML;
        download(svg, "diagram.svg", "image/svg+xml");
      }
    }
  };

  const handleEditor1Change = (value) => {
    setCode1(value);
    try {
      // const parsedDSL = myParser(value);
      // console.log("setCode1 nearley test: ", JSON.stringify(parseDSL), "end");
      const mermaidCode = convertDSLtoMermaid(value);
      console.log('after convert DSL-mermaid:', mermaidCode);
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

  const updateInspector = (unitID, componentID, pageID) => {
    // Update the Inspector based on the given IDs
    if (unitID && componentID && pageID) setInspectorIndex({ unitID, componentID, pageID })
    else setInspectorIndex(null)
  }

  return (
    <div ref={containerRef} className="container">
      <Box sx={{
        display: "flex",
        height: "100vh",
      }}>
        <Box sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}>
          <Header sx={{
            position: {
              md: 'static'
            }
          }} />
        <Box sx={{
            flex: 1,
            display: "flex",
            minHeight: 0,
          }}>
          <NavigationBar
            items={examples}
            savedItems={savedItems}
            onSelect={activeTab === "examples" ? handleSelectExample : handleSelectSavedItem}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <Box component="main" sx={{
              minWidth: 0,
              minHeight: 0,
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}>
              <div
                style={{
                  display: "flex",
                  height: "100%"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
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
              updateInspector={updateInspector}
            />
            <div
              style={{
                width: "5px",
                cursor: "col-resize",
                borderLeft: "solid 1px #666",
                position: "relative",
                zIndex: 1,
              }}
              onMouseDown={handleMouseDown}
            />
            <Box sx={{
                    width: '100%'
                  }}>
                    <RendererSection
                      mermaidCode={mermaidCode}
                      handleExport={handleExport}
                      handleSave={handleSave}
                      mermaidRef={mermaidRef}
                      updateInspector={updateInspector}
                    />
                    <GUIEditor inspectorIndex={inspectorIndex} />
                  </Box>
                  </div>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default App;
