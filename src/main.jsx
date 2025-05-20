import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // To apply baseline CSS reset
import theme from "./Theme";

import App from "./App";
import { ParseCompileProvider } from "./context/ParseCompileContext"
const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ParseCompileProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ParseCompileProvider>
  </React.StrictMode>
);