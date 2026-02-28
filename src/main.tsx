import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App.tsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
      light: "#818cf8",
      dark: "#3730a3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#0f172a",
      light: "#334155",
      dark: "#020617",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    success: { main: "#10b981", light: "#d1fae5", dark: "#065f46" },
    warning: { main: "#f59e0b", light: "#fef3c7", dark: "#92400e" },
    error: { main: "#ef4444", light: "#fee2e2", dark: "#991b1b" },
    text: {
      primary: "#0f172a",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
  },
  typography: {
    fontFamily:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: { fontWeight: 800, letterSpacing: -2 },
    h2: { fontWeight: 700, letterSpacing: -1 },
    h3: { fontWeight: 700, letterSpacing: -0.5 },
    h4: { fontWeight: 700, letterSpacing: -0.25 },
    h5: { fontWeight: 600, letterSpacing: 0 },
    h6: { fontWeight: 600, letterSpacing: 0 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
          "&:focus-visible": {
            outline: "2px solid #4f46e5",
            outlineOffset: 2,
          },
        },
        containedPrimary: {
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)",
          },
          "&:disabled": { background: "#e2e8f0", color: "#94a3b8" },
        },
        outlinedPrimary: {
          borderColor: "#c7d2fe",
          color: "#4f46e5",
          "&:hover": { borderColor: "#4f46e5", bgcolor: "#f5f3ff" },
        },
        sizeLarge: { padding: "11px 28px", fontSize: "0.9375rem" },
        sizeSmall: { padding: "5px 14px", fontSize: "0.8125rem" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#ffffff",
            "& fieldset": { borderColor: "#e2e8f0" },
            "&:hover fieldset": { borderColor: "#94a3b8" },
            "&.Mui-focused fieldset": { borderColor: "#4f46e5", borderWidth: 1.5 },
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#4f46e5" },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "& fieldset": { borderColor: "#e2e8f0" },
          "&:hover fieldset": { borderColor: "#94a3b8" },
          "&.Mui-focused fieldset": { borderColor: "#4f46e5", borderWidth: 1.5 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: "0.75rem",
          height: 26,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255,255,255,0.95)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16, border: "1px solid #e2e8f0" },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {},
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: { fontWeight: 500, fontSize: "0.8125rem" },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontSize: "0.875rem" },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#e2e8f0" },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
