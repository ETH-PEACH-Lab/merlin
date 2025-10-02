import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // To apply baseline CSS reset
import theme from "./Theme";

import App from "./App";
import { ParseCompileProvider } from "./context/ParseCompileContext";
import { StudyProvider } from "./study/StudyContext";
import { hasSharedExample, extractCodeFromUrl } from "./utils/urlSharing";
import { PostHogProvider } from "posthog-js/react";

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

// Check if PostHog is properly configured
const posthogApiKey = process.env.REACT_APP_POSTHOG_KEY;
const isPostHogEnabled = Boolean(posthogApiKey && posthogApiKey !== 'phc_placeholder_key' && String(posthogApiKey).trim() !== '');

// Detect GitHub Pages at runtime
const isGitHubPages = window.location.hostname === 'eth-peach-lab.github.io' && window.location.pathname.includes('/merlin-study/');

// Log PostHog configuration status for debugging
if (true) {
  console.log('PostHog Configuration:', {
    apiKey: posthogApiKey ? `${posthogApiKey.substring(0, 10)}...` : 'NOT SET',
    host: process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com',
    enabled: isPostHogEnabled,
    isGitHubPages
  });
  
  if (!isPostHogEnabled) {
    console.warn('PostHog is disabled. Set REACT_APP_POSTHOG_KEY to enable analytics.');
  }
}

// Create the app content
const createAppContent = () => (
  <StudyProvider>
    <ParseCompileProvider initialCode={getInitialCode()}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ParseCompileProvider>
  </StudyProvider>
);

root.render(
  <React.StrictMode>
    {isPostHogEnabled ? (
      <PostHogProvider
          apiKey={posthogApiKey}
          options={{
            api_host: process.env.REACT_APP_POSTHOG_HOST || 'https://app.posthog.com',
            capture_exceptions: true,
            debug: false, // disable PostHog debug logs
          }}
      >
        {createAppContent()}
      </PostHogProvider>
    ) : (
      createAppContent()
    )}
  </React.StrictMode>
);