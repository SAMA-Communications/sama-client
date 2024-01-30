import api from "@api/api";
import getUserInitials from "@utils/user/get_user_initials";
import { useNavigate } from "react-router-dom";
import { setUserIsLoggedIn } from "@store/UserIsLoggedIn";
import { updateNetworkState } from "@store/NetworkState";
import { useDispatch } from "react-redux";

import "@newstyles/navigation/NavigationLine.css";

import SamaLogo from "@newcomponents/static/SamaLogo";

import { ReactComponent as List } from "@newicons/Conversations.svg";
import { ReactComponent as Create } from "@newicons/AddConversation.svg";
import { ReactComponent as Logout } from "@newicons/actions/Logout.svg";

export default function NavigationLine() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <aside className="navigation__container">
      <div className="navigation__logo fcc" onClick={() => navigate("/")}>
        <SamaLogo />
      </div>
      <div className="navigation__menu fcc">
        <div onClick={() => navigate("/profile")} className="menu__profile fcc">
          <span className="fcc">{getUserInitials()}</span>
        </div>
        <div onClick={() => navigate("/")} className="menu__list fcc active">
          <List />
        </div>
        <div onClick={() => navigate("/create")} className="menu__create fcc">
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
