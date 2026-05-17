import { createContext, useState, useEffect, type ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

const getMuiTheme = (mode: ThemeMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            background: { default: "#FFFFFF", paper: "#F7F7F7" },
            text: { primary: "#111111", secondary: "#444444" },
            primary: { main: "#0F62FE" },
            divider: "#E0E0E0",
          }
        : {
            background: { default: "#000000", paper: "#111111" },
            text: { primary: "#F5F5F5", secondary: "#BBBBBB" },
            primary: { main: "#4589FF" },
            divider: "#2A2A2A",
          }),
    },
    typography: {
      fontFamily: "'Open Sans', sans-serif",
      h1: { fontFamily: "'Montserrat', sans-serif", fontWeight: 700 },
      h2: { fontFamily: "'Montserrat', sans-serif", fontWeight: 700 },
      h3: { fontFamily: "'Montserrat', sans-serif", fontWeight: 700 },
      h4: { fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
      h5: { fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
      h6: { fontFamily: "'Montserrat', sans-serif", fontWeight: 600 },
      fontSize: 16,
    },
    shape: { borderRadius: 8 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.10)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "15px",
            borderRadius: "8px",
            boxShadow: "none",
            "&:hover": { boxShadow: "0 2px 4px rgba(0,0,0,0.10)" },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": { fontFamily: "'Open Sans', sans-serif", fontSize: "16px" },
            "& .MuiInputLabel-root": { fontFamily: "'Open Sans', sans-serif" },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { fontFamily: "'Montserrat', sans-serif", fontWeight: 600, textTransform: "none", fontSize: "15px" },
        },
      },
    },
  });

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const stored = typeof window !== "undefined" ? localStorage.getItem("gt-theme") : null;
  const [mode, setMode] = useState<ThemeMode>((stored as ThemeMode) || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("gt-theme", mode);
  }, [mode]);

  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={getMuiTheme(mode)}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}