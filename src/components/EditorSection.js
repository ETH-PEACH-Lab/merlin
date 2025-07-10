import React from "react";
import CodeEditor from "./CodeEditor";
import DslEditor from "./DslEditor";
import MermaidEditor from "./MermaidEditor";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import EditIcon from "@mui/icons-material/Edit";
import { useParseCompile } from "../context/ParseCompileContext";

const EditorSection = ({
  editor1Height,
  leftWidth,
  setEditor1Height,
  dslEditorEditable,
  setDslEditorEditable,
}) => {
  const handleClickLock = () => {
    setDslEditorEditable((dslEditorEditable) => !dslEditorEditable);
  };

  const {
    unparsedCode,
    compiledMerlin,
    error,
    updateUnparsedCode,
  } = useParseCompile();

  return (
    <div
      className="CodeEditorsContent"
      style={{
        width: leftWidth,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Code Editor Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
              height: "4px",
              borderTop: "1px solid #444",
              cursor: "row-resize",
              position: "absolute",
              bottom: 0,
              left: 0,
            }}
          />
        }
      >
        <div style={{ height: "100%", margin: 0, padding: 0 }}>
          <DslEditor
            value={unparsedCode}
            onChange={updateUnparsedCode}
            readOnly={!dslEditorEditable}
          />
        </div>
      </ResizableBox>

      {/* Mermaid Editor Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: `calc(100% - ${editor1Height}px)`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
          }}
        >
          <Typography variant="overline">Merlin Editor</Typography>
          <Tooltip title={"Read Mode"}>
            <IconButton size="small">
              <LockIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
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
      </Box>
    </div>
  );
};

export default EditorSection;
