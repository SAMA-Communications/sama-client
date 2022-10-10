import React, { useEffect, useState } from "react";

import Login from "./components/Login";
import Chat from "./components/Chat";
import SignUp from "./components/SignUp";
import { Audio } from "react-loader-spinner";

function App() {
  const [page, setPage] = useState("loading");
  const [loading, setLoading] = useState("loading");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setPage(!!!token ? "login" : "main");
  }, []);

  useEffect(() => {
    setLoading("loading");
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [page]);

  return loading === "loading" ? (
    <Audio height="70" width="70" color="#1a8ee1" wrapperClass="aria-loading" />
  ) : page === "register" ? (
    <SignUp onLogin={setPage} />
  ) : page === "login" ? (
    <Login onSignUp={setPage} />
  ) : (
    <Chat />
  );
}

export default App;
