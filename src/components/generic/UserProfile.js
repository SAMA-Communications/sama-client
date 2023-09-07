import jwtDecode from "jwt-decode";
import api from "../../api/api";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectParticipantsEntities } from "../../store/Participants";

import "./../../styles/chat/UserProfile.css";

import { ReactComponent as TrashCan } from "./../../assets/icons/chatForm/TrashCan.svg";
import { useNavigate } from "react-router-dom";
import { updateNetworkState } from "../../store/NetworkState";

export default function UserProfile({ close }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const participants = useSelector(selectParticipantsEntities);
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const currentUser = useMemo(
    () => (userInfo ? participants[userInfo._id] : {}),
    [participants, userInfo]
  );

  const deleteCurrentUser = async () => {
    if (window.confirm("Do you confirm the user's deletion?")) {
      await api.userDelete();
      navigate("/login");
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
    }
  };

  window.onkeydown = function (event) {
    event.keyCode === 27 && close(false);
  };

  return (
    <div className="user-options-bg">
      <div className="user-options-block">
        <div className="user-o-box">
          <div className="user-o-photo">
            {currentUser.login?.slice(0, 2).toUpperCase()}
          </div>
          <div className="user-o-info">
            {currentUser.first_name ? (
              <>
                <p className="user-o-info-name">
                  {currentUser.first_name + " " + currentUser.last_name}
                </p>
                <i className="user-o-info-login">{currentUser.login}</i>
              </>
            ) : (
              <p className="user-o-info-name">{currentUser.login}</p>
            )}
            <p className="user-o-info-email">
              Email: {currentUser.email || "..."}
            </p>
            <p className="user-o-info-phone">
              Phone: {currentUser.phone || "..."}
            </p>
            {/* <p className="user-info-status"></p> */}
          </div>
          <div className="user-o-delete" onClick={deleteCurrentUser}>
            <TrashCan />
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
