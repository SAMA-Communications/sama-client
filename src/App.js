import React, { Suspense, useEffect, useRef } from "react";
import activityService from "./services/activityService";
import autoLoginService from "./services/autoLoginService.js";
import conversationService from "./services/conversationsService";
import globalConstants from "./_helpers/constants";
import messagesService from "./services/messagesService";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { history } from "./_helpers/history";
import { getIsMobileView, setIsMobileView } from "./store/IsMobileView";
import { updateNetworkState } from "./store/NetworkState";
import { useDispatch, useSelector } from "react-redux";

import PageLoader from "./components/PageLoader";
import SignUp from "./components/screens/SignUp";

import "./styles/GlobalParam.css";
import "./styles/themes/DarkTheme.css";
import "./styles/themes/DefaultTheme.css";

const Main = React.lazy(() => import("./components/Main"));
const Login = React.lazy(() => import("./components/screens/Login"));
const ErrorPage = React.lazy(() => import("./components/ErrorPage"));

export default function App() {
  const dispatch = useDispatch();
  history.location = useLocation();
  history.navigate = useNavigate();

  const isMobileView = useSelector(getIsMobileView);
  const isMobileViewRef = useRef(isMobileView);
  useEffect(() => {
    isMobileViewRef.current = isMobileView;
  }, [isMobileView]);

  useEffect(() => {
    window.addEventListener("offline", () =>
      dispatch(updateNetworkState(false))
    );
    window.addEventListener("online", () => dispatch(updateNetworkState(true)));
    window.addEventListener("resize", () => {
      const isMobileView =
        window.innerWidth <= globalConstants.windowChangeWitdh;
      if (isMobileView !== isMobileViewRef.current) {
        dispatch(setIsMobileView(isMobileView));
      }
    });

    dispatch(
      setIsMobileView(window.innerWidth <= globalConstants.windowChangeWitdh)
    );

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
    if (token && token !== "undefined") {
      const currentPath = history.location.hash;
      history.navigate(!currentPath ? "/main" : `/main/${currentPath}`);
    } else {
      localStorage.removeItem("sessionId");
      history.navigate("/login");
    }
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence initial={false} mode="wait">
        <Routes location={history.location}>
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
