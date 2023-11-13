import getPrevPage from "../../../utils/get_prev_page.js";
import { history } from "../../../_helpers/history.js";
import { selectParticipantsEntities } from "../../../store/Participants.js";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import "./../../../styles/pages/UserProfile.css";

import { ReactComponent as BackBtn } from "./../../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as EmailIcon } from "./../../../assets/icons/userProfile/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "./../../../assets/icons/userProfile/PhoneIcon.svg";
import { ReactComponent as UserLoginIcon } from "./../../../assets/icons/userProfile/UserLoginIcon.svg";

export default function ParticipantProfile() {
  const location = useLocation();

  const participants = useSelector(selectParticipantsEntities);

  const userInfo = useMemo(
    () => participants[location.hash.split("=")[1]] || {},
    [participants, location]
  );

  window.onkeydown = function (event) {
    event.keyCode === 27 &&
      history.navigate(getPrevPage(location.pathname + location.hash));
    event.keyCode === 13 && event.preventDefault();
  };

  const userLetters = useMemo(() => {
    const { first_name, last_name, login } = userInfo;
    if (first_name) {
      return last_name
        ? first_name.slice(0, 1) + last_name.slice(0, 1)
        : first_name.slice(0, 1);
    }

    return login?.slice(0, 2).toUpperCase();
  }, [userInfo]);

  return (
    <div className="user-options-bg">
      <div className="user-options-container">
        <div className="uo-navigation">
          <div
            className="uo-close"
            onClick={() =>
              history.navigate(getPrevPage(location.pathname + location.hash))
            }
          >
            <BackBtn />
          </div>
          <div className="uo-header uo-header-pr-51">User profile</div>
          <div></div>
        </div>
        <div className="uo-info">
          <div className="uo-photo-name">
            <div className="uo-photo uo-photo-u-bg">{userLetters}</div>
            <div className="uo-name">
              <p>{userInfo.first_name}</p>
              <p>{userInfo.last_name}</p>
            </div>
          </div>
          <div className="uo-info">
            <div>
              <UserLoginIcon />
              <p className="uo-login">Username:</p>
              <p>{userInfo.login || "-"}</p>
            </div>
            <div>
              <EmailIcon />
              <p className="uo-email">Email address:</p>
              <p>{userInfo.email || "-"}</p>
            </div>
            <div>
              <PhoneIcon />
              <p className="uo-phone">Phone number:</p>
              <p>{userInfo.phone || "-"}</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
