import addPrefix from "@utils/navigation/add_prefix";
import api from "@api/api";
import getUserInitials from "@utils/user/get_user_initials";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";

import "@newstyles/navigation/NavigationLine.css";

import SamaLogo from "@newcomponents/static/SamaLogo";

import { ReactComponent as List } from "@newicons/Conversations.svg";
import { ReactComponent as Create } from "@newicons/AddConversation.svg";
import { ReactComponent as Logout } from "@newicons/actions/Logout.svg";

export default function NavigationLine() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

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
      <div className="navigation__logo fcc" onClick={() => navigate("/")}>
        <SamaLogo />
      </div>
      <div className="navigation__menu fcc">
        <div
          onClick={() =>
            ((pathname + hash).includes("/profile")
              ? removeAndNavigateSubLink
              : addPrefix)(pathname + hash, "/profile")
          }
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
          navigate("/login");
        }} //authorization
        className="menu__logout fcc"
      >
        <Logout />
      </div>
    </aside>
  );
}
