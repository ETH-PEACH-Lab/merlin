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
import { convertDSLtoMermaid, convertParsedDSLtoMermaid } from "./compiler/myCompiler.mjs";
import GUIEditor from "./components/GUIEditor";
import Header from "./components/Header";
import { fillParsedDsl } from "./components/fillParsedDSL";
import { reconstructDSL } from "./components/reconstructDSL"
import { myParser } from "./parser/myParser";
import { parserMyDSL } from "./parser/test";
// Import the image directly
import appIcon from "./public/empty.png";

// Import the DSL parser and translator
import { parseDSL, convertToMermaid, convertToMermaidNearley } from "./dslCompiler";

const App = () => {
  const [editor1Height, setEditor1Height] = useState(window.innerHeight / 2);
  const [leftWidth, setLeftWidth] = useState(window.innerWidth / 2);
  const [code1, setCode1] = useState(`// input dsl code`);
  const [parsedCode1, setParsedCode1] = useState({});
  const [mermaidCode, setMermaidCode] = useState("");
  const [exampleSvg, setExampleSvg] = useState(null); // New state for example SVG
  const [activeTab, setActiveTab] = useState("examples"); // State for active tab
  const [savedItems, setSavedItems] = useState([]); // State for saved items
  const [inspectorIndex, setInspectorIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [svgContent, setSvgContent] = useState(null)
  const [dslEditorEditable, setDslEditorEditable] = useState(true);

  const mermaidRef = useRef(null);
  const containerRef = useRef(null);

  console.log("savedItems\n", savedItems);

  const renderPage = (showIndex) => {
    const svg_element = document.getElementById('preview');
    if (svg_element && currentPage <= totalPages) {
      const pages = svg_element.querySelectorAll('g.page');
      if (pages && pages.length > 0) {
        pages.forEach(page => {
          if (page && page.style) {
            page.style.display = 'none';
          }
        });
      }
      if (pages && pages.length > 0 && pages[showIndex].style) {
        pages[showIndex].style.display = 'inline';
      }
    }
  };

  useEffect(() => {
    loadSavedItems();
  }, []);

  useEffect(() => {
    // console.log("app.jsx svgContent is changed!");
    let svg = document.getElementById('preview');
    let totalPages = 0
    try { totalPages = svg.querySelectorAll('g.page').length;
    } catch (error) {
      console.log('got error when fetching total pages: error');
    }
    // console.log("debug totalPages\n", totalPages)
    setTotalPages(totalPages);
    renderPage(currentPage - 1);
  }, [svgContent]);

  useEffect(() => {
    const svg_element = document.getElementById('preview');
    // console.log("app.jsx svg_element: ", svg_element);
    if (svg_element && currentPage <= totalPages) {
      const pages = svg_element.querySelectorAll('g.page');
      if (pages && pages.length > 0) {
        pages.forEach(page => {
          if (page && page.style) {
            page.style.display = 'none';
          }
        });
      }
      if (pages && pages.length > 0 && pages[currentPage - 1].style) {
        pages[currentPage - 1].style.display = 'inline';
      }
    }
  }, [currentPage])

  useEffect(() => {
    try {
      let parsedCode1 = myParser(code1);
      setParsedCode1(parsedCode1);
      let mermaidCode = convertParsedDSLtoMermaid(parsedCode1);
      setMermaidCode(mermaidCode);
      renderPage(currentPage-1);
    } catch (err) {
      setMermaidCode("DSL grammar is incorrect!");
      console.log("update mermaid error:\n", err);
    }
  },[code1]);

  useEffect(() => {
    const handlePageChange = () => {
      setCurrentPage(window.currentPage);
    };
    // Listen for the custom page change event
    window.addEventListener('pageChange', handlePageChange);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('pageChange', handlePageChange);
    };
  }, []);

  // console.log("currentPage:", currentPage);

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
    if (dslEditorEditable) {
      let parsedDSL = myParser(value);
      // console.log('handleEditor1Change before-fill parsedDSL:\n', parsedDSL);
      if (parsedDSL) {
        parsedDSL = fillParsedDsl(parsedDSL)
        setParsedCode1(parsedDSL);
      }
      else {
        setParsedCode1({});
      }
      setCurrentPage(1);
      setCode1(value);
    } else {
      alert("The editor is locked! please unlock it first.");
    }
  };

  const handleSelectExample = (item) => {
    setCode1(item.userCode);
    setParsedCode1(myParser(item.userCode));
    setCurrentPage(1);
    // setMermaidCode(item.renderCode);
  };

  const handleSave = () => {
    const timestamp = new Date().toISOString();
    const cookieName = `diagram_${timestamp}`;
    const newSavedItem = {
        userCode: code1,
        mermaidCode: mermaidCode,
        timestamp: timestamp,
    };

    // Save new item to cookies
    document.cookie = `${cookieName}=${encodeURIComponent(JSON.stringify(newSavedItem))}; max-age=31536000; path=/`;

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
        updatedItems.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return updatedItems;
    });

    // Function to trigger the download of the string onto the local computer
    const downloadString = (filename, content) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const link = document.createElement('a');
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

${code1}

mermaidCode:

${mermaidCode}

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
    console.log("coookies: ", cookies);
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
    setParsedCode1(myParser(item.code1));
    setCurrentPage(1);
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
              dslEditorEditable={dslEditorEditable}
              setDslEditorEditable={setDslEditorEditable}
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
                      totalPages={totalPages}
                      setTotalPages={setTotalPages}
                      setSvgContent={setSvgContent}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                    <GUIEditor 
                      inspectorIndex={inspectorIndex} 
                      setCode1={setCode1}
                      parsedCode1={parsedCode1}
                      setParsedCode1={setParsedCode1}
                      code1={code1}
                      currentPage={currentPage}
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                      setTotalPages={setTotalPages}
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
