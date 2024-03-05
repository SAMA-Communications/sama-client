import activityService from "@services/activityService";
import autoLoginService from "@services/autoLoginService.js";
import conversationService from "@services/conversationsService";
import globalConstants from "@helpers/constants";
import messagesService from "@services/messagesService";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useRef } from "react";
import { getIsMobileView, setIsMobileView } from "@store/values/IsMobileView";
import { history } from "@helpers/history";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";

import SMain from "@skeletons/SMain";
import SPageLoader from "@skeletons/SPageLoader";
import SignUp from "@screens/SignUp";

import "@newstyles/GlobalParam.css";
import "@styles/themes/DarkTheme.css";
import "@styles/themes/DefaultTheme.css";

const Main = lazy(() => import("@newcomponents/Main"));
const Login = lazy(() => import("@screens/Login"));

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
      console.log("App.js: ", path);
      history.navigate(path);
    } else {
      localStorage.removeItem("sessionId");
      console.log("App.js: ", "/login");
      history.navigate("/login");
    }
  }, []);

  return (
    <Suspense
      fallback={localStorage.getItem("sessionId") ? <SMain /> : <SPageLoader />}
    >
      <AnimatePresence initial={false} mode="wait">
        <Routes location={history.location}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<Main />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
