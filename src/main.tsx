// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { getMuiTheme } from "./theme";
import { useTheme } from "./hooks/useTheme";

const RootApp = () => {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={getMuiTheme(theme)}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);