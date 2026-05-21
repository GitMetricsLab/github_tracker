import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ThemeWrapper from "./context/ThemeContext.tsx";
import {GoogleOAuthProvider} from  '@react-oauth/google';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
console.log("CLIENT_ID =", CLIENT_ID);
createRoot(document.getElementById("root")!).render(
  
  <StrictMode>
    <ThemeWrapper>
    <BrowserRouter>
    <GoogleOAuthProvider clientId = {CLIENT_ID}>
      <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
    </ThemeWrapper>
  </StrictMode>
);