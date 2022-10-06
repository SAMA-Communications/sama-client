import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ws from "./api/main.js";

ws["chat"].connect();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App webSocket={ws["chat"]} />
  </React.StrictMode>
);
