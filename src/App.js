import React, { Suspense, useEffect } from "react";
import api from "./api/api";
import { Route, Routes, useNavigate } from "react-router-dom";

import Login from "./components/screens/Login";
import SignUp from "./components/screens/SignUp";
import PageLoader from "./components/PageLoader";

import("./styles/themes/DarkTheme.css");
import("./styles/themes/DefaultTheme.css");
const Main = React.lazy(() => import("./components/Main"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches === true) {
      if (localStorage.getItem("theme") !== "light") {
        localStorage.setItem("theme", "dark");
        document.body.classList.add("dark-theme");
      }
    } else {
      if (localStorage.getItem("theme") !== "dark") {
        localStorage.setItem("theme", "light");
        document.body.classList.remove("dark-theme");
      }
    }

    const token = localStorage.getItem("sessionId");
    token ? userLoginByToken(token) : navigate("/login");
  }, []);

  const userLoginByToken = async (token) => {
    try {
      const userToken = await api.userLogin({ token });
      localStorage.setItem("sessionId", userToken);
      navigate("/main");
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main/*" element={<Main />} />
        <Route path="/*" element={<ErrorPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
