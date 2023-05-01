import React, { Suspense, useEffect } from "react";
import api from "./api/api";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { default as EventEmitter } from "./event/eventEmitter";

import Login from "./components/screens/Login";
import SignUp from "./components/screens/SignUp";
import PageLoader from "./components/PageLoader";

import "./styles/GlobalParam.css";
import "./styles/themes/DarkTheme.css";
import "./styles/themes/DefaultTheme.css";
const Main = React.lazy(() => import("./components/Main"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const keyLocation =
    location.pathname.split("/")[1] === "main" ? "/main" : location.pathname;

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
    EventEmitter.subscribe("onConnect", () =>
      userLoginByToken(localStorage.getItem("sessionId"))
    );
    if (token && token !== "undefined") {
      userLoginByToken(token);
    } else {
      localStorage.removeItem("sessionId");
      navigate("/login");
    }
  }, []);

  const userLoginByToken = async (token) => {
    try {
      const userToken = await api.userLogin({ token });
      console.log("userToken_1: ", userToken);
      if (userToken) {
        localStorage.setItem("sessionId", userToken);
        navigate("/main");
      } else {
        localStorage.removeItem("sessionId");
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence initial={false} mode="wait">
        <Routes location={location} key={keyLocation}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/main/*" element={<Main />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default App;
