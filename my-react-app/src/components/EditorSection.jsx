import React from "react";
import CodeEditor from "./CodeEditor";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { Box, Typography } from "@mui/material";

const EditorSection = ({
  code1,
  mermaidCode,
  editor1Height,
  leftWidth,
  handleEditor1Change,
  setEditor1Height,
  setMermaidCode,
  handleMouseDown,
}) => (
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
    <Box>
    <Typography variant="overline" sx={{pl: 2}}>Code Editor</Typography>
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
    </Box>
  </div>
);

export default EditorSection;
