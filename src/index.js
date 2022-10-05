import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChatApi from "./api/chat";

const ws = new ChatApi("ws://localhost:9001");
ws.connect();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App websocket={ws} />
  </React.StrictMode>
);

export default ws;
