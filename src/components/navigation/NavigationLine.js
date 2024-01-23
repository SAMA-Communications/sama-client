import "@styles/NavigationLine.css";

import SamaLogo from "@components/static/SamaLogo";
import { ReactComponent as List } from "../../newassets/icons/Conversations.svg";
import { ReactComponent as Create } from "../../newassets/icons/AddConversation.svg";
import { ReactComponent as Logout } from "../../newassets/icons/Logout.svg";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useMemo } from "react";
import { selectParticipantsEntities } from "@store/Participants";
import { useDispatch, useSelector } from "react-redux";
import { updateNetworkState } from "@store/NetworkState";
import { setUserIsLoggedIn } from "@store/UserIsLoggedIn";
import api from "@api/api";

export default function NavigationLine() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;
  const currentUser = useMemo(
    () => (userInfo ? participants[userInfo._id] : {}),
    [userInfo, participants]
  );

  const userLetters = useMemo(() => {
    if (!currentUser || !Object.keys(currentUser).length) {
      return null;
    }

    const { first_name, last_name, login } = currentUser;
    if (first_name) {
      return last_name
        ? first_name.slice(0, 1) + last_name.slice(0, 1)
        : first_name.slice(0, 1);
    }

    return login.slice(0, 2).toUpperCase();
  }, [currentUser]);

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
          <span className="fcc">{userLetters}</span>
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
