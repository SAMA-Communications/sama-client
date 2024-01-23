import api from "@api/api";
import getUserInitials from "@utils/get_user_initials";
import { Link, useNavigate } from "react-router-dom";
import { setUserIsLoggedIn } from "@store/UserIsLoggedIn";
import { updateNetworkState } from "@store/NetworkState";
import { useDispatch } from "react-redux";

import "../../newstyles/NavigationLine.css";

import SamaLogo from "@components/static/SamaLogo";

import { ReactComponent as List } from "../../newassets/icons/Conversations.svg";
import { ReactComponent as Create } from "../../newassets/icons/AddConversation.svg";
import { ReactComponent as Logout } from "../../newassets/icons/Logout.svg";

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
        <Link to={"/profile"} className="menu__profile fcc">
          <span className="fcc">{getUserInitials()}</span>
        </Link>
        <Link to={"/main"} className="menu__list fcc active">
          <List />
        </Link>
        <Link to={"/create"} className="menu__create fcc">
          <Create />
        </Link>
      </div>
      <Link
        to={"/authorization"}
        className="menu__logout fcc"
        onClick={sendLogout}
      >
        <Logout />
      </Link>
    </aside>
  );
}
