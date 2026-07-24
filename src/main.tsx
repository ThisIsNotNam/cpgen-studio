import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import your Tailwind entry point here
import "./App.css";

import { loader } from "@monaco-editor/react";
loader.config({ paths: { vs: "/monaco-editor/min/vs" } });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
