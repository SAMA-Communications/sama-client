import { lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Route, Routes, useLocation, useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { AnimatePresence, LazyMotion, domAnimation, motion as m } from "motion/react";

import ContextMenuHub from "@components/context/ContextMenuHub";

import BetterSuspense from "@hooks/tools/BetterSuspense.js";

import "@lib/samaAdapter";

import {
  ConfirmWindowProvider,
  PageLoaderSkeleton,
  initDocumentKeyDown,
  useViewportBreakpoints,
} from "@sama-communications.ui-kit";

import activityService from "@services/activityService";
import autoLoginService from "@services/autoLoginService";
import conversationService from "@services/conversationsService";
import messagesService from "@services/messagesService";

import { selectIsClicked, setClicked } from "@store/values/ContextMenu";
import { setIsTabInFocus } from "@store/values/IsTabInFocus";
import { updateNetworkState } from "@store/values/NetworkState";
import { setSelectedConversation } from "@store/values/SelectedConversation";

import { history } from "@utils/history.js";
import { removeAndNavigateSubLink, navigateTo } from "@utils/NavigationUtils.js";

const Main = lazy(() => import("@components/Main"));
const AuthorizationHub = lazy(() => import("@components/auth/AuthorizationHub"));

initDocumentKeyDown();

export default function App() {
  const dispatch = useDispatch();
  history.location = useLocation();
  history.navigate = useNavigate();

  const isContextClicked = useSelector(selectIsClicked);
  const isUserLoggedIn = !!localStorage.getItem("sessionId");

  const { isMobile, isTablet } = useViewportBreakpoints();
  const isMobileRef = useRef(isMobile);
  const isTabletRef = useRef(isTablet);

  useEffect(() => {
    if (isMobile && isMobile !== isMobileRef.current) {
      removeAndNavigateSubLink(history.location.pathname + history.location.hash, "/profile");
    }
    if (isTablet && isTablet !== isTabletRef.current) {
      removeAndNavigateSubLink(history.location.pathname + history.location.hash, "/profile");
    }
    isMobileRef.current = isMobile;
    isTabletRef.current = isTablet;
  }, [isMobile, isTablet]);

  useEffect(() => {
    window.onfocus = () => dispatch(setIsTabInFocus(true));
    window.onblur = () => dispatch(setIsTabInFocus(false));

    window.addEventListener("offline", () => dispatch(updateNetworkState(false)));
    window.addEventListener("online", () => dispatch(updateNetworkState(true)));
    window.addEventListener("resize", () => dispatch(setClicked(false)));
    window.addEventListener("popstate", () => {
      if (!history.location.hash.includes("#")) {
        dispatch(setSelectedConversation({}));
      }
      if (history.location.pathname === "/authorization") {
        autoLoginService.userLoginByToken();
      }
    });

    const handleClick = () => dispatch(setClicked(false));
    document.addEventListener("click", handleClick);

    dispatch(setIsTabInFocus(true));

    const { pathname, hash } = history.location;
    const token = localStorage.getItem("sessionId");
    if (token && token !== "undefined") {
      const path = hash ? pathname + hash : "/";
      navigateTo(path);
    } else {
      localStorage.removeItem("sessionId");
      navigateTo(pathname === "/demo" ? "/demo" : "/authorization");
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const routePathKey = useMemo(() => {
    const { pathname } = history.location;
    return ["/authorization", "/demo"].includes(pathname) ? "/authorization" : "/*";
  }, [history.location.pathname]);

  useLayoutEffect(() => {
    const mainElement = document.getElementsByTagName("main")[0];
    const bodyElement = document.getElementsByTagName("body")[0];
    mainElement.style.backgroundColor = routePathKey === "/*" ? "#f6f6f6" : "#DBDCFC";
    bodyElement.style.backgroundColor = routePathKey === "/*" ? "#1b1b1d" : "#DBDCFC";
  }, [routePathKey]);

  const exitAnimation = {
    scale: [1, 1.00001],
    transition: { duration: 0.5 },
  };

  const [isNeedToAnimateMain, setIsNeedToAnimateMain] = useState(true);
  useEffect(() => setIsNeedToAnimateMain(true), [routePathKey]);

  return (
    <LazyMotion features={domAnimation}>
      <BetterSuspense fallback={<PageLoaderSkeleton />} fallbackMinDurationMs={isUserLoggedIn ? 700 : 400}>
        <ConfirmWindowProvider>
          {isContextClicked && <ContextMenuHub key={"ContextMenu"} id={"ContextMenu"} />}
          <AnimatePresence mode="wait">
            <Routes location={history.location} key={routePathKey}>
              <Route path="/authorization" element={<AuthorizationHub key={routePathKey} />} />
              <Route
                path="/demo"
                element={
                  <m.div key={routePathKey} exit={exitAnimation}>
                    <AuthorizationHub showDemoMessage={true} />
                  </m.div>
                }
              />
              <Route
                path="/*"
                element={
                  <Main key={routePathKey} isNeedToAnimate={isNeedToAnimateMain} exit={exitAnimation} />
                  // <m.div key={routePathKey} className="flex h-dvh w-dvw overflow-hidden" >
                  // </m.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </ConfirmWindowProvider>
      </BetterSuspense>
    </LazyMotion>
  );
}
