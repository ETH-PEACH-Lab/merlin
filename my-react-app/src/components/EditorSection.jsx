import React from "react";
import CodeEditor from "./CodeEditor";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

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
);

export default EditorSection;
