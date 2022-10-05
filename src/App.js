import React, { useState, useEffect } from "react";

import Main from "./components/Main";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Audio } from "react-loader-spinner";

function App({ webSocket }) {
  const [isLoginView, setIsLoginView] = useState(false);
  const [isCreateUserView, setIsCreateUserView] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoginView(!!!token);
  }, []);

  const onLogin = () => {
    const login = document.getElementsByName("uname");
    const password = document.getElementsByName("pass");
    const requstData = {
      request: {
        user_login: {
          login: login[0].value,
          password: password[0].value,
          deviceId: navigator.productSub,
        },
      },
    };
    webSocket.sendMessage(JSON.stringify(requstData));
    document.getElementById("submit").disabled = true;
    onDisplayMain();
  };

  const onSignUp = () => {
    const login = document.getElementsByName("uname");
    const password = document.getElementsByName("pass");
    const requstData = {
      request: {
        user_create: {
          login: login[0].value,
          password: password[0].value,
        },
      },
    };
    webSocket.sendMessage(JSON.stringify(requstData));
    document.getElementById("submit").disabled = true;
    onDisplayMain();
  };

  const onDisplaySignUp = () => {
    setIsCreateUserView(true);
    setIsLoginView(false);
  };

  const onDisplayLogin = () => {
    setIsCreateUserView(false);
    setIsLoginView(true);
  };

  const onDisplayMain = () => {
    setIsCreateUserView(false);
    setIsLoginView(false);
  };

  if (isLoginView) {
    return <Login onSubmit={onLogin} onSignUp={onDisplaySignUp} />;
  }
  if (isCreateUserView) {
    return <SignUp onSubmit={onSignUp} onLogin={onDisplayLogin} />;
  }
  return (
    <Audio height="70" width="70" color="#1a8ee1" wrapperClass="aria-loading" />
  );
  // return <Main />;
}

export default App;
