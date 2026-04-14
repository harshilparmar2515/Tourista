import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import AuthContextProvider from "./components/context/AuthContext.jsx";
import ThemeProvider from "./context/ThemeContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </AuthContextProvider>
    </ThemeProvider>
  </StrictMode>
);