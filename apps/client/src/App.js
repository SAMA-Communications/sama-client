import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import autoLoginService from "@services/autoLoginService";
import activityService from "@services/activityService";
import conversationService from "@services/conversationsService";
import messagesService from "@services/messagesService";

import ContextMenuHub from "@components/context/ContextMenuHub";

import { getIsMobileView, setIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView, setIsTabletView } from "@store/values/IsTabletView";
import { selectIsClicked, setClicked } from "@store/values/ContextMenu";
import { setIsTabInFocus } from "@store/values/IsTabInFocus";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { updateNetworkState } from "@store/values/NetworkState";

import globalConstants from "@utils/global/constants";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { history } from "@utils/global/history";

import SMain from "@skeletons/SMain";
import SPageLoader from "@skeletons/SPageLoader";

const Main = lazy(() => import("@components/Main"));
const AuthorizationHub = lazy(() =>
  import("@components/auth/AuthorizationHub")
);

export default function App() {
  const dispatch = useDispatch();
  history.location = useLocation();
  history.navigate = useNavigate();

  const isContextClicked = useSelector(selectIsClicked);

  const isMobileView = useSelector(getIsMobileView);
  const isMobileViewRef = useRef(isMobileView);

  const isTabletView = useSelector(getIsTabletView);
  const isTabletViewRef = useRef(isTabletView);

  useEffect(() => {
    window.onfocus = () => dispatch(setIsTabInFocus(true));
    window.onblur = () => dispatch(setIsTabInFocus(false));

    window.addEventListener("offline", () =>
      dispatch(updateNetworkState(false))
    );
    window.addEventListener("online", () => dispatch(updateNetworkState(true)));
    window.addEventListener("resize", () => {
      const isMobileView = window.innerWidth <= globalConstants.mobileViewWidth;
      if (isMobileView !== isMobileViewRef.current) {
        isMobileView === true &&
          removeAndNavigateSubLink(
            history.location.pathname + history.location.hash,
            "/profile"
          );
        isMobileViewRef.current = isMobileView;
        dispatch(setIsMobileView(isMobileView));
      }

      const isTabletView =
        window.innerWidth <= globalConstants.tabletViewWidth &&
        window.innerWidth > globalConstants.mobileViewWidth;
      if (isTabletView !== isTabletViewRef.current) {
        isTabletView === true &&
          removeAndNavigateSubLink(
            history.location.pathname + history.location.hash,
            "/profile"
          );
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
    dispatch(
      setIsMobileView(window.innerWidth <= globalConstants.mobileViewWidth)
    );
    dispatch(
      setIsTabletView(
        window.innerWidth <= globalConstants.tabletViewWidth &&
          window.innerWidth > globalConstants.mobileViewWidth
      )
    );

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

  return (
    <Suspense
      fallback={localStorage.getItem("sessionId") ? <SMain /> : <SPageLoader />}
    >
      {isContextClicked ? (
        <ContextMenuHub key={"ContextMenu"} id={"ContextMenu"} />
      ) : null}
      <AnimatePresence initial={false} mode="wait">
        <Routes location={history.location}>
          <Route path="/authorization" element={<AuthorizationHub />} />
          <Route
            path="/demo"
            element={<AuthorizationHub showDemoMessage={true} />}
          />
          <Route path="/*" element={<Main />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
