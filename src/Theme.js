import { createTheme } from "@mui/material/styles";

export const defaultTheme = createTheme();

const colorTheme = createTheme({
  palette: {
    sidebarColor: "#1b1b1d",
    navbarColor: "#1b1b1d",
    highlight: "#a94fd8",
    borderHighlight: "2px solid #a94fd8",
    border: "1px solid #606770",
    secondaryColor: "#ffffff",
  },
});

export const themeConfig = {
  rules: [
    { token: "definition-name", foreground: "FFD700", fontStyle: "bold" },
    { token: "property-name", foreground: "C586C0" },
    { token: "variable", foreground: "50C1F9" },
    { token: "number", foreground: "b5cea8" },
    { token: "keyword", foreground: "8477FD" },
    { token: "symbol", foreground: "ffffff" },
    { token: "string", foreground: "3AE1FF", fontStyle: "bold" },
    { token: "component", foreground: "21FFD6" },
    { token: "attributes", foreground: "black" },
    { token: "positional", foreground: "21FFD6" },
    { token: "dot-command", foreground: "21FFD6" },
  ],
  palette: {
    mode: "dark",
    sectionHeaderColor: "#1c1e21",
    border: colorTheme.palette.border,
    primary: {
      main: colorTheme.palette.highlight,
    },
    secondary: {
      main: colorTheme.palette.secondaryColor,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colorTheme.palette.navbarColor,
          backgroundImage: "none",
          borderBottom: colorTheme.palette.border,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "16px",
          marginRight: "10px",
          color: colorTheme.palette.secondaryColor,
          "&:hover": {
            color: colorTheme.palette.highlight,
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        docked: {
          "& .MuiPaper-root": {
            position: "static",
          },
        },
        paper: {
          backgroundColor: colorTheme.palette.sidebarColor,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#121212",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            borderLeft: colorTheme.palette.borderHighlight,
            color: colorTheme.palette.highlight,
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          fontSize: "5px",
        },
      },
    },
  },

  typography: {
    fontSize: 15,
    fontFamily: "sans-serif",
    textTransform: "none",
  },
};

const theme = createTheme(themeConfig);
export default theme;
