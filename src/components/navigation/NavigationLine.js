import "@styles/NavigationLine.css";

import SamaLogo from "@components/static/SamaLogo";
import { ReactComponent as List } from "../../newassets/icons/Conversations.svg";
import { ReactComponent as Create } from "../../newassets/icons/AddConversation.svg";
import { ReactComponent as Logout } from "../../newassets/icons/Logout.svg";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useMemo } from "react";
import { selectParticipantsEntities } from "@store/Participants";
import { useSelector } from "react-redux";

export default function NavigationLine() {
  const navigate = useNavigate();

  const participants = useSelector(selectParticipantsEntities);

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;
  const currentUser = useMemo(
    () => (userInfo ? participants[userInfo._id] : {}),
    [userInfo, participants]
  );
  //get User

  return (
    <aside className="navigation__container">
      <div className="navigation__logo fcc">
        <SamaLogo />
      </div>
      <div className="navigation__menu fcc">
        <div className="menu__profile fcc" onClick={() => navigate("/profile")}>
          <span className="fcc">OC</span>
        </div>
        <div className="menu__list fcc active" onClick={() => navigate("/")}>
          <List />
        </div>
        <div className="menu__create fcc" onClick={() => navigate("/create")}>
          <Create />
        </div>
      </div>
      <div className="menu__logout fcc">
        <Logout />
      </div>
    </aside>
  );
}
