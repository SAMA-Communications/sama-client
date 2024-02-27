import React, { Suspense, useEffect, useRef } from "react";
import activityService from "@services/activityService";
import autoLoginService from "@services/autoLoginService.js";
import conversationService from "@services/conversationsService";
import globalConstants from "@helpers/constants";
import messagesService from "@services/messagesService";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { getIsMobileView, setIsMobileView } from "@store/values/IsMobileView";
import { history } from "@helpers/history";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";

import PageLoader from "@components/PageLoader";
import SignUp from "@screens/SignUp";

import "@newstyles/GlobalParam.css";
import "@styles/themes/DarkTheme.css";
import "@styles/themes/DefaultTheme.css";

const Main = React.lazy(() => import("@newcomponents/Main"));
const Login = React.lazy(() => import("@screens/Login"));
// const ErrorPage = React.lazy(() => import("@components/ErrorPage"));

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

    const token = localStorage.getItem("sessionId");
    if (token && token !== "undefined") {
      const { pathname, hash } = history.location;
      const path = hash ? pathname + hash : "/";
      history.navigate(path);
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
          {/* //authorization */}
          <Route path="/signup" element={<SignUp />} />
          {/* //authorization */}
          <Route path="/*" element={<Main />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
