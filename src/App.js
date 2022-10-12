import React, { useEffect, useState } from "react";

import Login from "./components/Login";
import Main from "./components/Main";
import SignUp from "./components/SignUp";

function App() {
  const [page, setPage] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setPage(!!!token ? "login" : "main");
  }, []);

  return page === "register" ? (
    <SignUp onSuccess={setPage} />
  ) : page === "login" ? (
    <Login onSuccess={setPage} />
  ) : (
    <Main />
  );
}

export default App;
