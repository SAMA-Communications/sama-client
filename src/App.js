import React, { useEffect, useState } from "react";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Audio } from "react-loader-spinner";

function App() {
  const [isMainPage, setIsMainPage] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsMainPage(!!token ? true : "login");
  }, []);

  if (isMainPage === "login") return <Login onSignUp={setIsMainPage} />;
  else if (isMainPage === "register") return <SignUp onLogin={setIsMainPage} />;
  else
    return (
      <Audio
        height="70"
        width="70"
        color="#1a8ee1"
        wrapperClass="aria-loading"
      />
    );
}

export default App;
