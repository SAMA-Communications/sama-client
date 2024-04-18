import addPrefix from "@utils/navigation/add_prefix";
import api from "@api/api";
import getUserInitials from "@utils/user/get_user_initials";
import navigateTo from "@utils/navigation/navigate_to";
import { getIsTabletView } from "@store/values/IsTabletView";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import "@styles/navigation/NavigationLine.css";

import SamaLogo from "@components/static/SamaLogo";

import { ReactComponent as List } from "@icons/Conversations.svg";
import { ReactComponent as Create } from "@icons/AddConversation.svg";
import { ReactComponent as Logout } from "@icons/actions/Logout.svg";

export default function NavigationLine() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const isTabletView = useSelector(getIsTabletView);

  const sendLogout = async () => {
    navigator.serviceWorker.ready
      .then((reg) =>
        reg.pushManager.getSubscription().then((sub) =>
          sub.unsubscribe().then(async () => {
            await api.pushSubscriptionDelete();
            await api.userLogout();
            dispatch({ type: "RESET_STORE" });
            dispatch(updateNetworkState(true));
          })
        )
      )
      .catch(async (err) => {
        console.error(err);
        await api.userLogout();
        dispatch({ type: "RESET_STORE" });
        dispatch(updateNetworkState(true));
        dispatch(setUserIsLoggedIn(false));
      });
    localStorage.removeItem("sessionId");
  };

  const [isProfilePageActive, isChatListActive, isCreatePageActive] =
    useMemo(() => {
      const isProfilePage = pathname.includes("/profile");
      return [
        isProfilePage ? "active" : "",
        !isProfilePage ? "active" : "",
        pathname.includes("/create") ? "active" : "",
      ];
    }, [pathname]);

  return (
    <aside className="navigation__container">
      <div className="navigation__logo fcc" onClick={() => navigateTo("/")}>
        <SamaLogo />
      </div>
      <div className="navigation__menu fcc">
        <div
          onClick={() => {
            let currentPath = pathname + hash;
            if (isTabletView && hash.includes("/info")) {
              currentPath = currentPath.replace("/info", "");
            }
            addPrefix(currentPath, "/profile");
          }}
          className={`menu__profile fcc ${isProfilePageActive}`}
        >
          <span className="fcc">{getUserInitials()}</span>
        </div>
        <div
          onClick={() => navigateTo(`/${hash || ""}`)}
          className={`menu__list fcc ${isChatListActive}`}
        >
          <List />
        </div>
        <div
          onClick={() => addPrefix(pathname + hash, "/create")}
          className={`menu__create fcc ${isCreatePageActive}`}
        >
          <Create />
        </div>
      </div>
      <div
        onClick={() => {
          sendLogout();
          navigateTo("/authorization");
        }} //authorization
        className="menu__logout fcc"
      >
        <Logout />
      </div>
    </aside>
  );
}
