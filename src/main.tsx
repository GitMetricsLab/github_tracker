import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ThemeWrapper from "./context/ThemeContext.tsx";
import UserProvider from "./context/UserContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <ThemeWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeWrapper>
    </UserProvider>
  </StrictMode>
);