import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { createTauriClient } from "./ipc/tauri-client";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App client={createTauriClient()} />
  </React.StrictMode>,
);
