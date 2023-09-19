import api from "../../api/api";
import jwtDecode from "jwt-decode";
import showCustomAlert from "../../utils/show_alert";
import {
  selectParticipantsEntities,
  upsertUser,
} from "../../store/Participants";
import { updateNetworkState } from "../../store/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "./../../styles/chat/UserProfile.css";

import { ReactComponent as TrashCan } from "./../../assets/icons/chatForm/TrashCan.svg";
import { ReactComponent as CloseChatList } from "./../../assets/icons/CloseChatList.svg";

export default function UserProfile({ close }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const participants = useSelector(selectParticipantsEntities);
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const { register, handleSubmit, reset } = useForm();
  const onSubmit = async (data) => {
    try {
      Object.keys(data).forEach((key) => !data[key].length && delete data[key]);
      if (!Object.keys(data).length) {
        return;
      }
      const userNewData = await api.userEdit(data);

      dispatch(upsertUser(userNewData));
      reset();
      showCustomAlert("User data has been successfully updated.", "success");
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
  } = useForm();
  const onSubmitPass = async (data) => {
    try {
      if (!data.new_password || !data.current_password) {
        showCustomAlert("Please fill in both fields below.", "warning");
        return;
      }

      await api.userEdit(data);
      resetPass();
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
    event.keyCode === 13 && event.preventDefault();
  };

  return (
    <div className="user-options-bg">
      <div className="user-options-block">
        <div className="user-o-box">
          <div className="user-o-photo">
            {currentUser.login?.slice(0, 2).toUpperCase()}
          </div>
          <div className="user-o-info">
            {currentUser.first_name || currentUser.last_name ? (
              <>
                <p className="user-o-info-name">
                  {(currentUser.first_name
                    ? currentUser.first_name + " "
                    : "") + (currentUser.last_name || "")}
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
        <div className="forms-block">
          <form id="userEditForm" onSubmit={handleSubmit(onSubmit)}>
            <p className="form-title">Edit user information</p>
            <div>
              <p>First name:</p>
              <input
                {...register("first_name", { maxLength: 20 })}
                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                placeholder="Type a new first name..."
                type={"text"}
                autoComplete="off"
              />
            </div>
            <div>
              <p>Last name:</p>
              <input
                {...register("last_name", { maxLength: 20 })}
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
                  maxLength: 40,
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
                  pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
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
                {...register("phone", { minLength: 3, maxLength: 15 })}
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
            <p className="form-title">Change password</p>
            <div>
              <p>New password:</p>
              <input
                {...registerPass("new_password", {
                  pattern: /[A-Za-z0-9_\-.@]{3,40}/,
                })}
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
                  pattern: /[A-Za-z0-9_\-.@]{3,40}/,
                })}
                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                placeholder="Confirm your current password..."
                type={"text"}
                autoComplete="off"
              />
            </div>
            <input type="submit" value="Change" />
          </form>
        </div>
        <div className="user-profile-close" onClick={() => close(false)}>
          <p>
            <CloseChatList />
          </p>
        </div>
      </div>
    </div>
  );
}
