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

import GUIEditor from "./components/GUIEditor";
import Header from "./components/Header";
import { useParseCompile } from "./context/ParseCompileContext";

const App = () => {
  // Use context for code and parsing
  const {
    unparsedCode,
    parsedCode,
    compiledMerlin,
    updateUnparsedCode,
    pages,
  } = useParseCompile();

  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [activeTab, setActiveTab] = useState("examples");
  const [savedItems, setSavedItems] = useState([]);
  const [inspectorIndex, setInspectorIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dslEditorEditable, setDslEditorEditable] = useState(true);

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Keep currentPage in range
    if (currentPage < 1 || pages.length === 0) {
      setCurrentPage(1);
    } else if (currentPage > pages.length) {
      setCurrentPage(pages.length);
    }
  }, [currentPage, pages.length]);

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
      } else if (format === "svg") {
        const svg = mermaidRef.current.innerHTML;
        download(svg, "diagram.svg", "image/svg+xml");
      }
    }
  };

  const handleSelectExample = (item) => {
    updateUnparsedCode(item.userCode);
    setCurrentPage(1);
  };

  const handleSave = () => {
    const timestamp = new Date().toISOString();
    const cookieName = `diagram_${timestamp}`;
    const newSavedItem = {
      userCode: unparsedCode,
      mermaidCode: compiledMerlin,
      timestamp: timestamp,
    };

    // Save new item to cookies
    document.cookie = `${cookieName}=${encodeURIComponent(
      JSON.stringify(newSavedItem)
    )}; max-age=31536000; path=/`;

    // Save new item to local storage
    localStorage.setItem(cookieName, JSON.stringify(newSavedItem));

    // Update saved items state
    setSavedItems((prevItems) => {
      const updatedItems = [...prevItems, newSavedItem];
      if (updatedItems.length > 20) {
        // Remove oldest item if more than 20
        const oldestItem = updatedItems.shift();
        document.cookie = `${oldestItem.timestamp}=; max-age=0; path=/`; // Delete the cookie
        localStorage.removeItem(`diagram_${oldestItem.timestamp}`); // Delete the item from local storage
      }
      // Sort items in descending order
      updatedItems.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      return updatedItems;
    });

    // Function to trigger the download of the string onto the local computer
    const downloadString = (filename, content) => {
      const blob = new Blob([content], { type: "text/plain" });
      const link = document.createElement("a");
      link.download = filename;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    };

    // Prepare plain text content for download
    const plainTextContent = `
userCode:

${unparsedCode}

mermaidCode:

${compiledMerlin}

timestamp:

${timestamp}
    `;

    // Download the saved item as a plain text file
    downloadString(`${cookieName}.txt`, plainTextContent);

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
    updateUnparsedCode(item.userCode);
    setCurrentPage(1);
  };

  const updateInspector = (unitID, componentID, pageID) => {
    // Update the Inspector based on the given IDs
    if (unitID && componentID && pageID)
      setInspectorIndex({ unitID, componentID, pageID });
    else setInspectorIndex(null);
  };

  return (
    <div ref={containerRef} className="container">
      <Box
        sx={{
          display: "flex",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <Header
            sx={{
              position: {
                md: "static",
              },
            }}
          />
          <Box
            sx={{
              flex: 1,
              display: "flex",
              minHeight: 0,
            }}
          >
            <NavigationBar
              items={examples}
              savedItems={savedItems}
              onSelect={
                activeTab === "examples"
                  ? handleSelectExample
                  : handleSelectSavedItem
              }
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <Box
              component="main"
              sx={{
                minWidth: 0,
                minHeight: 0,
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  height: "100%",
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
                    code1={unparsedCode}
                    mermaidCode={compiledMerlin}
                    editor1Height={editor1Height}
                    leftWidth={leftWidth}
                    setEditor1Height={setEditor1Height}
                    handleMouseDown={handleMouseDown}
                    updateInspector={updateInspector}
                    dslEditorEditable={dslEditorEditable}
                    setDslEditorEditable={setDslEditorEditable}
                    setCode1={updateUnparsedCode}
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
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <RendererSection
                      mermaidCode={compiledMerlin}
                      handleExport={handleExport}
                      handleSave={handleSave}
                      mermaidRef={mermaidRef}
                      updateInspector={updateInspector}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                    <GUIEditor
                      inspectorIndex={inspectorIndex}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      dslEditorEditable={dslEditorEditable}
                      setDslEditorEditable={setDslEditorEditable}
                    />
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
