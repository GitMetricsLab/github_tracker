import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ThemeWrapper from "./context/ThemeContext.tsx";
// Import the service worker registration from the virtual module
import { registerSW } from "virtual:pwa-register";
// Register the service worker to handle automatic background updates
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeWrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ThemeWrapper>
  </StrictMode>
);
