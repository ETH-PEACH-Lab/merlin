import React from "react";
import MermaidRenderer from "./MermaidRenderer";

const RendererSection = ({
  mermaidCode,
  handleDownload,
  handleExport,
  handleSave,
  mermaidRef,
}) => (
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
          <button onClick={() => handleExport("png")}>Export as PNG</button>
          <button onClick={() => handleExport("pdf")}>Export as PDF</button>
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
);

export default RendererSection;
