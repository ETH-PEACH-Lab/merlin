import React, { useState } from "react";
import CodeEditor from "./CodeEditor";
import DslEditor from "./DslEditor";
import MermaidEditor from "./MermaidEditor";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorIcon from "@mui/icons-material/Error";
import { useParseCompile } from "../context/ParseCompileContext";

const EditorSection = ({
  editor1Height,
  leftWidth,
  setEditor1Height,
  dslEditorEditable,
  setDslEditorEditable,
  setCurrentPage,
  currentPage,
  pages,
}) => {
  // Start collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true);
  // Track height for expanded state
  const [splitHeight, setSplitHeight] = useState(window.innerHeight * 0.7);
  
  const handleClickLock = () => {
    setDslEditorEditable((dslEditorEditable) => !dslEditorEditable);
  };

  const {
    unparsedCode,
    compiledMerlin,
    error,
    updateUnparsedCode,
  } = useParseCompile();

  // Check if there's an actual error (not just "nothing to show")
  const hasError = error && !error.startsWith("Compile error:\nNothing to show\n");

  return (
    <div
      className="CodeEditorsContent"
      style={{
        width: leftWidth,
        display: "flex",
        flexDirection: "column",
        overflow: "shown",
        position: "relative",
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* Code Editor Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#121212",
          px: 2,
        }}
      >
        <Typography variant="overline">Merlin-Lite Editor</Typography>
        <Tooltip title={dslEditorEditable ? "Edit Mode" : "Read Mode"}>
          <IconButton onClick={handleClickLock} size="small">
            {dslEditorEditable ? (
              <EditIcon sx={{ fontSize: 18 }} />
            ) : (
              <LockIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>
      {/* Merlin Lite Editor Section (Resizable when expanded) */}
      {isCollapsed ? (
        <div style={{
          height: '100%',
          width: '100%',
          position: 'relative',
          flexShrink: 0,
        }}>
          <DslEditor
            value={unparsedCode}
            onChange={updateUnparsedCode}
            readOnly={!dslEditorEditable}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pages={pages}
          />
        </div>
      ) : (
        <ResizableBox
          height={splitHeight}
          width={Infinity}
          resizeHandles={["s"]}
          onResizeStop={(e, data) => {
            // If dragged all the way down, collapse
            if (data.size.height < 80) {
              setIsCollapsed(true);
            } else {
              setSplitHeight(data.size.height);
            }
          }}
          minConstraints={[Infinity, 80]}
          maxConstraints={[Infinity, window.innerHeight - 100]}
          handle={
            <span
              style={{
                width: "100%",
                height: "4px",
                borderTop: "1px solid #444",
                cursor: "row-resize",
                position: "absolute",
                bottom: 0,
                left: 0,
                overflow: "visible",
              }}
            />
          }
        >
          <div style={{ height: "100%", margin: 0, padding: 0 }}>
            <DslEditor
              value={unparsedCode}
              onChange={updateUnparsedCode}
              readOnly={!dslEditorEditable}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pages={pages}
            />
          </div>
        </ResizableBox>
      )}

      {/* Merlin Editor Bar and Section */}
      <div
        style={{
          position: isCollapsed ? 'absolute' : 'relative',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: isCollapsed ? '40px' : `calc(100% - ${splitHeight}px)`,
          minHeight: '40px',
          maxHeight: isCollapsed ? '40px' : undefined,
          overflow: 'hidden',
          zIndex: 2,
          background: isCollapsed ? 'rgba(30,30,30,0.98)' : undefined,
          boxShadow: isCollapsed ? '0 -2px 8px rgba(0,0,0,0.12)' : undefined,
          borderTop: '1px solid #444',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(24, 24, 24, 1)",
            },
            height: '40px',
            minHeight: '40px',
            maxHeight: '40px',
            boxSizing: "border-box",
            backgroundColor: "#121212",
          }}
          onClick={() => {
            if (isCollapsed) {
              setIsCollapsed(false);
              setSplitHeight(window.innerHeight * 0.5);
            } else {
              setIsCollapsed(true);
            }
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="overline">Compiled Merlin</Typography>
            {hasError && (
              <Tooltip title="Error in code">
                <ErrorIcon sx={{ fontSize: 16, color: "#f44336", marginBottom: "2px" }} />
              </Tooltip>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title={isCollapsed ? "Expand" : "Collapse"}>
              <IconButton size="small">
                {isCollapsed ? (
                  <ExpandMoreIcon sx={{ fontSize: 18 }} />
                ) : (
                  <ExpandLessIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Only render content if expanded */}
        {!isCollapsed && (
          <div style={{ flexGrow: 1, overflow: "auto" }}>
            {
              error
                ? error.startsWith("Compile error:\nNothing to show\n")
                  ? (
                    <div
                      style={{
                        fontFamily: "inherit",
                        color: "#999",
                        fontSize: "15px",
                        padding: "30px",
                        whiteSpace: "pre-line",
                      }}
                    >
                      Nothing to show yet. Please enter some code above.
                      <br />
                      <br />
                      <b>Example input format:</b>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: "14px",
                          padding: "14px 18px",
                          margin: "10px 0",
                          background: "#23272f",
                          color: "#e0e0e0",
                          borderRadius: "7px",
                          whiteSpace: "pre",
                          overflowX: "auto",
                        }}
                      >
                        &lt;type&gt; &lt;component_name&gt; {`{`} <br />
                          &nbsp;&nbsp;... <br />
                        {`}`} <br />
                        <br />
                        page <br />
                        show &lt;component_name&gt;
                      </div>
                      <span style={{ fontSize: "13px" }}>
                        • <b>&lt;type&gt;</b>: The type of component (e.g., <i>array</i>, <i>graph</i>, etc.)<br />
                        • <b>&lt;component_name&gt;</b>: A name you choose for your component<br />
                      </span>
                      <br />
                      For more information, please visit the documentation.
                    </div>
                  )
                  : (
                    <div
                      style={{
                        fontFamily: "monospace",
                        color: "rgb(255, 118, 118)",
                        fontSize: "14px",
                        padding: "30px",
                        whiteSpace: "pre",
                      }}
                    >
                      {error}
                    </div>
                  )
                : (
                  <MermaidEditor value={compiledMerlin} onChange={() => {}} />
                )
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorSection;
