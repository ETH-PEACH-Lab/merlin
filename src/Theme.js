import { createTheme } from '@mui/material/styles';

export const defaultTheme = createTheme()

export const themeConfig = {
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  components: {
    MuiAccordion: {
      defaultProps: {
        square: true,
        TransitionProps: {
          unmountOnExit: true,
        },
      },
      styleOverrides: {
        root: {
          border: "1px solid rgba(255, 255, 255, .125)",
          boxShadow: "none",
          transition: defaultTheme.transitions.create("margin-left"),
          "&:not(:last-child)": {
            borderBottom: 0,
          },
          "&:before": {
            display: "none",
          },
          "&.Mui-expanded": {
            margin: "auto",
          },
          "&.Mui-disabled": {
            marginLeft: 32
          }
        },
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid rgba(255, 255, 255, .125)",
          minHeight: 56,
          "&.Mui-expanded": {
            minHeight: 56
          }
        },
        content: {
          alignItems: "center",
          justifyContent: "space-between",
          "&.Mui-expanded": {
            margin: "12px 0",
          },
        },
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: "#212121",
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        docked: {
          "& .MuiPaper-root": {
            position: "static",
          },
        },
        paper: {},
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
            borderLeft: '2px solid #3399ff',
            color: '#66b3ff',
            // Optionally, you can add other styles here, like background color
            backgroundColor: '#1d2126'
          },
      }
    }}
  },
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 14,
  },
}

const theme = createTheme(themeConfig);
export default theme;

