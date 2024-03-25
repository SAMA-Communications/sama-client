import ContextMenuHub from "@newcomponents/context/ContextMenuHub";
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
import { selectIsClicked, setClicked } from "@store/values/ContextMenu";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";

import SMain from "@skeletons/SMain";
import SPageLoader from "@skeletons/SPageLoader";

import "@newstyles/GlobalParam.css";

const Main = lazy(() => import("@newcomponents/Main"));
const AuthorizationHub = lazy(() =>
  import("@newcomponents/auth/AuthorizationHub")
);

export default function App() {
  const dispatch = useDispatch();
  history.location = useLocation();
  history.navigate = useNavigate();

  const isContextClicked = useSelector(selectIsClicked);

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
      dispatch(setClicked(false));
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
      history.navigate("/authorization");
    }
  }, []);

  useEffect(() => {
    const handleClick = () => dispatch(setClicked(false));
    document.addEventListener("click", handleClick);
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
          <Route path="/*" element={<Main />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
