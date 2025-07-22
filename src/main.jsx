import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // To apply baseline CSS reset
import theme from "./Theme";

import App from "./App";
import { ParseCompileProvider } from "./context/ParseCompileContext";
import { hasSharedExample, extractCodeFromUrl } from "./utils/urlSharing";

const container = document.getElementById("app");
const root = createRoot(container);

// Check for shared code in URL and use it as initial code
const getInitialCode = () => {
  if (hasSharedExample()) {
    const sharedCode = extractCodeFromUrl();
    if (sharedCode) {
      return sharedCode;
    }
  }
  return "";
};

root.render(
  <React.StrictMode>
    <ParseCompileProvider initialCode={getInitialCode()}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ParseCompileProvider>
  </React.StrictMode>
);