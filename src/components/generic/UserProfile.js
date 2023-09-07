import jwtDecode from "jwt-decode";

import "./../../styles/chat/UserProfile.css";

import { ReactComponent as UserIcon } from "./../../assets/icons/chatList/UserIcon.svg";

export default function UserProfile({ close }) {
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const closeModal = () => close(false);

  return (
    <div className="user-options-bg" onClick={closeModal}>
      <div className="user-options-block">
        <div className="user-o-box">
          <div className="user-o-photo">
            {!userInfo ? (
              <UserIcon />
            ) : (
              userInfo?.login.slice(0, 2).toUpperCase()
            )}
          </div>
          <div className="user-o-info">
            <p className="user-o-info-name">{userInfo?.login}</p>
            {/* <p className="user-info-status"></p> */}
          </div>
        </div>
        <hr />
        <form id="userEditForm">
          <p>Edit info</p>
        </form>
      </div>
    </div>
  );
}
