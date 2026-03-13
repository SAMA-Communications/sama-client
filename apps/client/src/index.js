import React from "react";

import ReactDOM from "react-dom/client";

import { BrowserRouter } from "react-router";

import { Provider } from "react-redux";

import ConnectingLine from "@components/connection/ConnectingLine";

import "@sama-communications.ui-kit.css";

import App from "@src/App";

import store from "@store/store";

import "@styles/index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ConnectingLine />
      <App />
    </BrowserRouter>
  </Provider>,
);

