import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import App from "@src/App";

import SocketConnectLine from "@components/_helpers/SocketConnectLine.js";

import store from "@store/store";

import "@styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <SocketConnectLine />
      <App />
    </BrowserRouter>
  </Provider>
);
