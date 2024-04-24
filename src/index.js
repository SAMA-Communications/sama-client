import App from "@src/App";
import ConnectLine from "@components/_helpers/ConnectLine";
import React from "react";
import ReactDOM from "react-dom/client";
import store from "@store/store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ConnectLine />
      <App />
    </BrowserRouter>
  </Provider>
);
