import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ThemeWrapper from "./context/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeWrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeWrapper>
  </StrictMode>
);