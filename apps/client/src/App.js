import { lazy, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import { Route, Routes, useLocation, useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { AnimatePresence, LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";

import ContextMenuHub from "@components/context/ContextMenuHub";

import BetterSuspense from "@hooks/tools/BetterSuspense.js";

// import ConfirmWindowProvider from "@hooks/tools/useConfirmWindow.js";

import "@lib/samaAdapter";

import { ConfirmWindowProvider } from "@sama-communications.ui-kit";
import { PageLoaderSkeleton } from "@sama-communications.ui-kit";

import activityService from "@services/activityService";
import autoLoginService from "@services/autoLoginService";
import conversationService from "@services/conversationsService";
import messagesService from "@services/messagesService";

import { selectIsClicked, setClicked } from "@store/values/ContextMenu";
import { getIsMobileView, setIsMobileView } from "@store/values/IsMobileView";
import { setIsTabInFocus } from "@store/values/IsTabInFocus";
import { getIsTabletView, setIsTabletView } from "@store/values/IsTabletView";
import { updateNetworkState } from "@store/values/NetworkState";
import { setSelectedConversation } from "@store/values/SelectedConversation";

import { MOBILE_VIEW_WIDTH, TABLET_VIEW_WIDTH } from "@utils/constants.js";
import { history } from "@utils/history.js";
import { removeAndNavigateSubLink, navigateTo } from "@utils/NavigationUtils.js";
const Main = lazy(() => import("@components/Main"));
const AuthorizationHub = lazy(() => import("@components/auth/AuthorizationHub"));

export default function App() {
  const dispatch = useDispatch();
  history.location = useLocation();
  history.navigate = useNavigate();

  const isContextClicked = useSelector(selectIsClicked);
  const isUserLoggedIn = !!localStorage.getItem("sessionId");

  const isMobileView = useSelector(getIsMobileView);
  const isMobileViewRef = useRef(isMobileView);

  const isTabletView = useSelector(getIsTabletView);
  const isTabletViewRef = useRef(isTabletView);

  useEffect(() => {
    window.onfocus = () => dispatch(setIsTabInFocus(true));
    window.onblur = () => dispatch(setIsTabInFocus(false));

    window.addEventListener("offline", () => dispatch(updateNetworkState(false)));
    window.addEventListener("online", () => dispatch(updateNetworkState(true)));
    window.addEventListener("resize", () => {
      const isMobileView = window.innerWidth <= MOBILE_VIEW_WIDTH;
      if (isMobileView !== isMobileViewRef.current) {
        isMobileView === true &&
          removeAndNavigateSubLink(history.location.pathname + history.location.hash, "/profile");
        isMobileViewRef.current = isMobileView;
        dispatch(setIsMobileView(isMobileView));
      }

      const isTabletView = window.innerWidth <= TABLET_VIEW_WIDTH && window.innerWidth > MOBILE_VIEW_WIDTH;
      if (isTabletView !== isTabletViewRef.current) {
        isTabletView === true &&
          removeAndNavigateSubLink(history.location.pathname + history.location.hash, "/profile");
        isTabletViewRef.current = isTabletView;
        dispatch(setIsTabletView(isTabletView));
      }
      dispatch(setClicked(false));
    });
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
    dispatch(setIsMobileView(window.innerWidth <= MOBILE_VIEW_WIDTH));
    dispatch(setIsTabletView(window.innerWidth <= TABLET_VIEW_WIDTH && window.innerWidth > MOBILE_VIEW_WIDTH));

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
