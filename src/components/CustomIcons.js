import React from "react";

export const arrayIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#a94fd8" fill="none">
      <rect x="1" y="11" width="10" height="10" />
      <rect x="11" y="11" width="10" height="10" />
      <rect x="21" y="11" width="10" height="10" />
    </g>
  </svg>
);

export const architectureIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <marker
        id="archArrow"
        viewBox="0 0 6 6"
        refX="5"
        refY="3"
        markerWidth="2"
        markerHeight="2"
        orient="auto"
        stroke="white"
      >
        <path d="M 0 0 L 6 3 L 0 6 z" fill="white" />
      </marker>
    </defs>

    <g fill="none" stroke="#a94fd8" strokeWidth="1">
      <rect x="2" y="4" width="11" height="24" rx="2" />
      <rect x="19" y="4" width="11" height="24" rx="2" />

      <rect x="4.5" y="8" width="5" height="5" />
      <rect x="4.5" y="17" width="5" height="5" />

      <rect x="22.5" y="8" width="5" height="5" />
      <rect x="22.5" y="17" width="5" height="5" />

      <line x1="25" y1="13" x2="25" y2="16.2" markerEnd="url(#archArrow)" />

      <line
        x1="9.5"
        y1="10.5"
        x2="22"
        y2="10.5"
        markerEnd="url(#archArrow)"
        stroke="white"
      />
      <line
        x1="9.5"
        y1="19.5"
        x2="22"
        y2="19.5"
        markerEnd="url(#archArrow)"
        stroke="white"
      />
    </g>
  </svg>
);

export const neuralNetworkIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <line x1="5" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.2" />
      <line x1="5" y1="9" x2="16" y2="16" stroke="white" strokeWidth="1.2" />
      <line x1="5" y1="23" x2="16" y2="9" stroke="white" strokeWidth="1.2" />
      <line x1="5" y1="23" x2="16" y2="16" stroke="white" strokeWidth="1.2" />

      <line
        x1="5"
        y1="23"
        x2="16"
        y2="9"
        stroke="white"
        strokeWidth="1.1"
        strokeDasharray="3 2"
      />
      <line
        x1="16"
        y1="23"
        x2="27"
        y2="16"
        stroke="white"
        strokeWidth="1.1"
        strokeDasharray="3 2"
      />

      <line x1="16" y1="9" x2="27" y2="16" stroke="white" strokeWidth="1.2" />
      <line x1="16" y1="16" x2="27" y2="16" stroke="white" strokeWidth="1.2" />
      <line x1="16" y1="23" x2="27" y2="16" stroke="white" strokeWidth="1.2" />

      <circle
        cx="5"
        cy="9"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />
      <circle
        cx="5"
        cy="16"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />
      <circle
        cx="5"
        cy="23"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />

      <circle
        cx="16"
        cy="9"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />
      <circle
        cx="16"
        cy="16"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />
      <circle
        cx="16"
        cy="23"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />

      <circle
        cx="27"
        cy="16"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />
      <circle
        cx="27"
        cy="23"
        r="3"
        stroke="#000"
        strokeWidth="0.8"
        fill="#a94fd8"
      />
    </g>
  </svg>
);

export const stackIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#a94fd8" fill="none">
      <rect x="11" y="1" width="10" height="10" />
      <rect x="11" y="11" width="10" height="10" />
      <rect x="11" y="21" width="10" height="10" />
    </g>
  </svg>
);

export const matrixIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#a94fd8" fill="none">
      <rect x="6" y="6" width="10" height="10" />
      <rect x="6" y="16" width="10" height="10" />
      <rect x="16" y="6" width="10" height="10" />
      <rect x="16" y="16" width="10" height="10" />
    </g>
  </svg>
);

export const linkedListIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#a94fd8" fill="none">
      <rect x="1" y="11" width="10" height="10" />
      <rect x="21" y="11" width="10" height="10" />
      <line x1="11" y1="16" x2="21" y2="16" />
      <line x1="21" y1="16" x2="16" y2="11" />
      <line x1="21" y1="16" x2="16" y2="21" />
    </g>
  </svg>
);

export const treeIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#a94fd8" fill="none">
      <circle cx="16" cy="8" r="5" />
      <circle cx="6" cy="22" r="5" />
      <circle cx="26" cy="22" r="5" />
      <line x1="10" y1="19" x2="13" y2="12" />
      <line x1="22" y1="19" x2="19" y2="12" />
    </g>
  </svg>
);

export const graphIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#a94fd8" fill="none">
      <circle cx="16" cy="8" r="5" />
      <circle cx="6" cy="22" r="5" />
      <circle cx="26" cy="22" r="5" />
      <line x1="10" y1="19" x2="13" y2="12" />
      <line x1="22" y1="19" x2="19" y2="12" />
      <line x1="10" y1="24" x2="22" y2="24" />
    </g>
  </svg>
);

export const textIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="#a94fd8" fill="none">
      <line x1="16" y1="6" x2="16" y2="26" />
      <line x1="10" y1="6" x2="22" y2="6" />
    </g>
  </svg>
);

export const addEdgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 -960 960 960"
    height="24px"
    width="24px"
    fill="inherit"
    style={{ transform: "rotate(90deg)" }}
  >
    <path d="M 680 -160 q 17 0 28.5 -11.5 T 720 -200 q 0 -17 -11.5 -28.5 T 680 -240 q -17 0 -28.5 11.5 T 640 -200 q 0 17 11.5 28.5 T 680 -160 Z m 0 -560 q 17 0 28.5 -11.5 T 720 -760 q 0 -17 -11.5 -28.5 T 680 -800 q -17 0 -28.5 11.5 T 640 -760 q 0 17 11.5 28.5 T 680 -720 Z M 80 -470 v -10 q 0 -50 35 -85 t 85 -35 q 24 0 45 8.5 t 37 23.5 l 281 -164 q -2 -7 -2.5 -13.5 T 560 -760 q 0 -50 35 -85 t 85 -35 q 50 0 85 35 t 35 85 q 0 50 -35 85 t -85 35 q -24 0 -45 -8.5 T 598 -672 L 318 -509 q -19 -5 -38.5 -8 t -39.5 -3 q -45 0 -85.5 13 T 80 -470 Z M 680 -80 q -50 0 -85 -35 t -35 -85 q 0 -6 3 -28 l -43 -26 q -2 -24 -7 -46.5 T 499 -345 l 99 57 q 16 -15 37 -23.5 t 45 -8.5 q 50 0 85 35 t 35 85 q 0 50 -35 85 t -85 35 Z M 240 -40 q -83 0 -141.5 -58.5 T 40 -240 q 0 -83 58.5 -141.5 T 240 -440 q 83 0 141.5 58.5 T 440 -240 q 0 83 -58.5 141.5 T 240 -40 Z m -35 -90 l 70 0 l 0 -70 l 70 0 l 0 -70 l -70 0 l 0 -70 l -70 0 l 0 70 l -70 0 l 0 70 l 70 0 l 0 70 Z m 440 12 Z m 0 -560 Z" />
  </svg>
);

export const removeEdgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="inherit"
    style={{ transform: "rotate(90deg)" }}
  >
    <path d="M680-160q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160Zm0-560q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720ZM80-470v-10q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L318-509q-19-5-38.5-8t-39.5-3q-45 0-85.5 13T80-470ZM680-80q-50 0-85-35t-35-85q0-6 3-28l-43-26q-2-24-7-46.5T499-345l99 57q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35ZM240-40q-83 0-141.5-58.5T40-240q0-83 58.5-141.5T240-440q83 0 141.5 58.5T440-240q0 83-58.5 141.5T240-40Zm0-172 70 71 29-28-71-71 71-71-28-28-71 71-71-71-28 28 71 71-71 71 28 28 71-71Zm440 12Zm0-560Z" />
  </svg>
);

export const addRowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="inherit"
    style={{ transform: "rotate(180deg)" }}
  >
    <path d="M200-160h560v-240H200v240Zm640 80H120v-720h160v80h-80v240h560v-240h-80v-80h160v720ZM480-480Zm0 80v-80 80Zm0 0Zm-40-240v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
  </svg>
);

export const addColumnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="inherit"
    style={{ transform: "rotate(90deg)" }}
  >
    <path d="M200-160h560v-240H200v240Zm640 80H120v-720h160v80h-80v240h560v-240h-80v-80h160v720ZM480-480Zm0 80v-80 80Zm0 0Zm-40-240v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
  </svg>
);

export const removeRowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="inherit"
    style={{ transform: "rotate(180deg)" }}
  >
    <g>
      <path
        id="svg_1"
        d="M200-160h560v-240H200v240Zm640 80H120v-720h160v80h-80v240h560v-240h-80v-80h160v720ZM480-480Zm0 80v-80 80Zm0"
      />
      <g style={{ transform: "rotate(45deg)" }}>
        <path d="M-850-520Zm640 0Zm-40-240v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
      </g>
    </g>
  </svg>
);

export const removeColumnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    width="24px"
    fill="inherit"
    style={{ transform: "rotate(90deg)" }}
  >
    <g>
      <title>Layer 1</title>
      <path
        id="svg_1"
        d="M200-160h560v-240H200v240Zm640 80H120v-720h160v80h-80v240h560v-240h-80v-80h160v720ZM480-480Zm0 80v-80 80Zm0"
      />
      <g style={{ transform: "rotate(45deg)" }}>
        <path d="M-850-520Zm640 0Zm-40-240v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
      </g>
    </g>
  </svg>
);

export const merlinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24px"
    height="24px"
    fill="white"
    viewBox="0 0 16 16"
  >
    <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707zM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1zM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707zM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0z" />
  </svg>
);
