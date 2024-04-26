import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/AuthContext";

// Create a root and render the app inside it
const root = document.getElementById("root");
const rootElement = root || document.createElement("div"); // Create a container if 'root' is not found
const createRoot = ReactDOM.createRoot || ReactDOM.unstable_createRoot; // Fallback for older React versions

createRoot(rootElement).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
