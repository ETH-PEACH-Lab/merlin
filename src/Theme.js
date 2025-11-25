import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme()

const colorTheme = createTheme({
  palette: {
    sidebarColor: "#1b1b1d",
    navbarColor: "#1b1b1d",
    highlight: "#a94fd8",
    borderHighlight: "2px solid #a94fd8",
    border: "1px solid #606770",
  }
});

export const themeConfig = {
  palette: {
    mode: "dark",
    sectionHeaderColor: "#1c1e21",
    border: colorTheme.palette.border,
    primary: {
      main: "#a94fd8",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colorTheme.palette.navbarColor,
          backgroundImage: "none",
          borderBottom: colorTheme.palette.border
        }
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
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
      }
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#121212",
        },
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            borderLeft: colorTheme.palette.borderHighlight,
            color: colorTheme.palette.highlight,
          },
        }
      }
    }
  },
  typography: {
    fontSize: 15,
    fontFamily: "sans-serif",
    textTransform: 'none'
  },
}

const theme = createTheme(themeConfig);
export default theme;

