import React, { useState, useEffect } from "react";

import Main from "./components/Main";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ws from ".";

function App() {
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
          deviceId: "PC",
        },
      },
    };
    ws.sendMessage(JSON.stringify(requstData));
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
    ws.sendMessage(JSON.stringify(requstData));
  };

  const onDisplaySignUp = () => {
    setIsCreateUserView(true);
    setIsLoginView(false);
  };

  const onDisplayLogin = () => {
    setIsCreateUserView(false);
    setIsLoginView(true);
  };

  if (isLoginView) {
    return <Login onSubmit={onLogin} onSignUp={onDisplaySignUp} />;
  }
  if (isCreateUserView) {
    return <SignUp onSubmit={onSignUp} onLogin={onDisplayLogin} />;
  }

  return <Main />;
}

export default App;
