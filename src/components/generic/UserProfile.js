import api from "../../api/api";
import jwtDecode from "jwt-decode";
import showCustomAlert from "../../utils/show_alert";
import { history } from "../../_helpers/history";
import {
  selectParticipantsEntities,
  upsertUser,
} from "../../store/Participants";
import { updateNetworkState } from "../../store/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "./../../styles/pages/UserProfile.css";

import { ReactComponent as BackBtn } from "./../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as EmailIcon } from "./../../assets/icons/userProfile/EmailIcon.svg";
import { ReactComponent as PasswordIcon } from "./../../assets/icons/userProfile/PasswordIcon.svg";
import { ReactComponent as PenEditIcon } from "./../../assets/icons/userProfile/PenEditIcon.svg";
import { ReactComponent as PhoneIcon } from "./../../assets/icons/userProfile/PhoneIcon.svg";
import { ReactComponent as TrashCan } from "./../../assets/icons/chatForm/TrashCan.svg";
import { ReactComponent as UserLoginIcon } from "./../../assets/icons/userProfile/UserLoginIcon.svg";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const participants = useSelector(selectParticipantsEntities);
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  // vv  User setting block  vv //
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
    event.keyCode === 27 && history.navigate("/main");
    event.keyCode === 13 && event.preventDefault();
  };
  // ʌʌ  User setting block  ʌʌ //

  // const { register, handleSubmit, reset } = useForm();
  // const onSubmit = async (data) => {
  //   try {
  //     Object.keys(data).forEach((key) => !data[key].length && delete data[key]);
  //     if (!Object.keys(data).length) {
  //       return;
  //     }
  //     const userNewData = await api.userEdit(data);

  //     dispatch(upsertUser(userNewData));
  //     reset();
  //     showCustomAlert("User data has been successfully updated.", "success");
  //   } catch (error) {
  //     showCustomAlert(error.message, "danger");
  //   }
  // };

  // const {
  //   register: registerPass,
  //   handleSubmit: handleSubmitPass,
  //   reset: resetPass,
  // } = useForm();
  // const onSubmitPass = async (data) => {
  //   try {
  //     if (!data.new_password || !data.current_password) {
  //       showCustomAlert("Please fill in both fields below.", "warning");
  //       return;
  //     }

  //     await api.userEdit(data);
  //     resetPass();
  //     showCustomAlert(
  //       "Your password has been successfully updated.",
  //       "success"
  //     );
  //   } catch (error) {
  //     showCustomAlert(error.message, "danger");
  //   }
  // };

  return (
    <div className="user-options-bg">
      <div className="user-options-container">
        <div className="uo-navigation">
          <div className="uo-close" onClick={() => history.navigate("/main")}>
            <BackBtn />
          </div>
          <div>
            <div className="uo-edit" onClick={() => {}}>
              <PenEditIcon />
            </div>
            <div className="uo-delete" onClick={deleteCurrentUser}>
              <TrashCan />
            </div>
          </div>
        </div>
        <div className="uo-photo-name">
          <div className="uo-photo">
            {currentUser.login?.slice(0, 2).toUpperCase()}
          </div>
          <p className="uo-name">
            {(currentUser.first_name ? currentUser.first_name + " " : "") +
              (currentUser.last_name || "")}
          </p>
        </div>
        <div className="uo-info">
          <div>
            <UserLoginIcon />
            <p className="uo-login">
              Username:
              <span>{currentUser.login}</span>
            </p>
          </div>
          <div>
            <EmailIcon />
            <p className="uo-email">
              Email address: <span>{currentUser.email || "..."}</span>
            </p>
          </div>
          <div>
            <PhoneIcon />
            <p className="uo-phone">
              Phone number: <span>{currentUser.phone || "..."}</span>
            </p>
          </div>
          <div>
            <PasswordIcon />
            <p className="uo-password">
              Password :<span onClick={() => {}}>change password...</span>
            </p>
          </div>
        </div>
        {/* <div className="forms-block">
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
        </div> */}
      </div>
    </div>
  );
}
