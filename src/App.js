import React, { Suspense, useEffect } from "react";
import api from "./api/api";
import subscribeForNotifications from "./services/notifications.js";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { default as EventEmitter } from "./event/eventEmitter";
import { updateNetworkState } from "./store/NetworkState";
import { useDispatch } from "react-redux";

import PageLoader from "./components/PageLoader";
import SignUp from "./components/screens/SignUp";

import "./styles/GlobalParam.css";
import "./styles/themes/DarkTheme.css";
import "./styles/themes/DefaultTheme.css";

const Main = React.lazy(() => import("./components/Main"));
const Login = React.lazy(() => import("./components/screens/Login"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("offline", () =>
      dispatch(updateNetworkState(false))
    );
    window.addEventListener("online", () => dispatch(updateNetworkState(true)));

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
      if (userToken && userToken !== "undefined") {
        localStorage.setItem("sessionId", userToken);
        subscribeForNotifications();
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
        <Routes location={location}>
          <Route path="/loading" element={<PageLoader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/main/*" element={<Main />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
