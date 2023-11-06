import { history } from "../../../_helpers/history.js";
import { selectParticipantsEntities } from "../../../store/Participants.js";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import getPrevPage from "../../../utils/get_prev_page.js";

import "./../../../styles/pages/UserGuestProfile.css";

import { ReactComponent as BackBtn } from "./../../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as EmailIcon } from "./../../../assets/icons/userProfile/EmailIcon.svg";
import { ReactComponent as PhoneIcon } from "./../../../assets/icons/userProfile/PhoneIcon.svg";
import { ReactComponent as UserLoginIcon } from "./../../../assets/icons/userProfile/UserLoginIcon.svg";

export default function UserGuestProfile() {
  const participants = useSelector(selectParticipantsEntities);

  const prevPageLink = useMemo(() => {
    const { hash, pathname } = history.location;
    return getPrevPage(pathname + hash);
  }, [history.location]);

  // vv  User setting block  vv //
  const userInfo = useMemo(
    () => participants[history.location.hash.split("=")[1]],
    [participants, history.location]
  );

  window.onkeydown = function (event) {
    event.keyCode === 27 && history.navigate(prevPageLink);
    event.keyCode === 13 && event.preventDefault();
  };

  const userLetters = useMemo(() => {
    const { first_name, last_name, login } = userInfo;
    if (first_name) {
      return last_name
        ? first_name.slice(0, 1) + last_name.slice(0, 1)
        : first_name.slice(0, 1);
    }

    return login.slice(0, 2).toUpperCase();
  }, [userInfo]);
  // ʌʌ  User setting block  ʌʌ //

  return (
    <div className="guest-options-bg">
      <div className="guest-options-container">
        <div className="go-navigation">
          <div
            className="go-close"
            onClick={() => history.navigate(prevPageLink)}
          >
            <BackBtn />
          </div>
          <div></div>
        </div>
        <div className="go-info">
          <div className="go-photo-name">
            <div className="go-photo">{userLetters}</div>
            <div className="go-name">
              <p>{userInfo.first_name}</p>
              <p>{userInfo.last_name}</p>
            </div>
          </div>
          <div className="go-info">
            <div>
              <UserLoginIcon />
              <p className="go-login">Username:</p>
              <p>{userInfo.login}</p>
            </div>
            <div>
              <EmailIcon />
              <p className="go-email">Email address:</p>
              <p>{userInfo.email || "-"}</p>
            </div>
            <div>
              <PhoneIcon />
              <p className="go-phone">Phone number:</p>
              <p>{userInfo.phone || "-"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
