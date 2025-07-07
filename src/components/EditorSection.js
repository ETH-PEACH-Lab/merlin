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
          {// Use terminal-like font and don't wrap lines
            error ? (
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
            ) : (
              <MermaidEditor value={compiledMerlin} onChange={() => {}} />
            )}
        </div>
      </Box>
    </div>
  );
};

export default EditorSection;
