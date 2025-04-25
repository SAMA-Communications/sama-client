import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import App from "@src/App";
import ConnectLine from "@components/_helpers/ConnectLine";

import store from "@store/store";

import "@styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ConnectLine />
      <App />
    </BrowserRouter>
  </Provider>
);
