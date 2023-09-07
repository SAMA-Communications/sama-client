import api from "../../api/api";
import jwtDecode from "jwt-decode";
import { selectParticipantsEntities } from "../../store/Participants";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useMemo } from "react";

import "./../../styles/chat/UserProfile.css";

import { ReactComponent as TrashCan } from "./../../assets/icons/chatForm/TrashCan.svg";
import { useNavigate } from "react-router-dom";
import { updateNetworkState } from "../../store/NetworkState";
import showCustomAlert from "../../utils/show_alert";

export default function UserProfile({ close }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const participants = useSelector(selectParticipantsEntities);
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      await api.userEdit(data);
      showCustomAlert("User data has been successfully updated.", "success");
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

  const { register: registerPass, handleSubmit: handleSubmitPass } = useForm();
  const onSubmitPass = async (data) => {
    try {
      await api.userEdit(data);
      showCustomAlert(
        "Your password has been successfully updated.",
        "success"
      );
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

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
        <form id="userEditForm" onSubmit={handleSubmit(onSubmit)}>
          <p className="formTitle">Edit user information</p>
          <div>
            <p>First name:</p>
            <input
              {...register("first_name", {})}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              placeholder="Type a new first name..."
              type={"text"}
              autoComplete="off"
            />
          </div>
          <div>
            <p>Last name:</p>
            <input
              {...register("last_name", {})}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              placeholder="Type a new last name..."
              type={"text"}
              autoComplete="off"
            />
          </div>
          <div>
            <p>Login:</p>
            <input
              {...register("login", {
                pattern: /[A-Za-z0-9_\-.@]{3,20}/,
              })}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              placeholder="Type a new login..."
              type={"text"}
              autoComplete="off"
            />
          </div>
          <div>
            <p>Email:</p>
            <input
              {...register("email", {
                pattern: /[A-Za-z0-9_\-.@]{3,20}/,
              })}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              placeholder="Type a new email..."
              type={"text"}
              autoComplete="off"
            />
          </div>
          <div>
            <p>Phone:</p>
            <input
              {...register("phone", {})}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              placeholder="Type a new phone..."
              type={"text"}
              autoComplete="off"
            />
          </div>
          <input type="submit" value="Update" />
        </form>
        <hr />
        <form id="passwordEditForm" onSubmit={handleSubmitPass(onSubmitPass)}>
          <p className="formTitle">Change password</p>
          <div>
            <p>New password:</p>
            <input
              {...registerPass("new_password", {})}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              placeholder="Type a new password..."
              type={"text"}
              autoComplete="off"
            />
          </div>
          <div>
            <p>Current password:</p>
            <input
              {...registerPass("current_password", {
                required: "The current password is required.",
                pattern: /[A-Za-z0-9_\-.@]{3,20}/,
              })}
              onKeyDown={(e) => e.key === " " && e.preventDefault()}
              placeholder="Confirm your current password..."
              type={"text"}
              autoComplete="off"
            />
          </div>
          <input type="submit" value="Update" />
        </form>
      </div>
    </div>
  );
}
