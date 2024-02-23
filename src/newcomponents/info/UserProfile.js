import InfoBox from "@newcomponents/info/elements/InfoBox";
import api from "@api/api";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import showCustomAlert from "@utils/show_alert";
import { getCurrentUser } from "@store/values/CurrentUser";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import "@newstyles/info/UserProfile.css";

import { ReactComponent as Close } from "@newicons/actions/Close.svg";
import { ReactComponent as Password } from "@newicons/users/Password.svg";
import { ReactComponent as Trash } from "@newicons/actions/Trash.svg";
import { ReactComponent as UserIcon } from "@newicons/users/ProfileIcon.svg";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const currentUser = useSelector(getCurrentUser);
  const { login, email, phone, first_name, last_name } = currentUser || {};

  const deleteCurrentUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.userDelete();
      navigate("/login");
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
    }
  };

  window.onkeydown = function (event) {
    event.keyCode === 27 &&
      removeAndNavigateSubLink(pathname + hash, "/profile");
    event.keyCode === 13 && event.preventDefault();
  };

  const changePasswordRequest = async () => {
    const currentPassword = window.prompt("Enter your current password:");
    if (!currentPassword) {
      return;
    }

    let newPassword = window.prompt("Enter a new password:");
    while (newPassword?.length < 3 || newPassword?.length > 40) {
      alert("Password length must be in the range of 3 to 40.");
      newPassword = window.prompt("Enter a new password:");
    }

    if (!newPassword || !currentPassword) {
      return;
    }

    try {
      await api.userEdit({
        current_password: currentPassword,
        new_password: newPassword,
      });
      showCustomAlert("Password has been successfully updated.", "success");
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

  return (
    <div className="profile__container">
      <div className="profile__container--top fcc">
        <Close
          className="profile__close"
          onClick={() => removeAndNavigateSubLink(pathname + hash, "/profile")}
        />
        <div className="profile__photo fcc">
          <UserIcon />
        </div>
        <div>
          <p className="uname__first">{first_name || "First name"}</p>
          <p className="uname__last">{last_name || "Last name"}</p>
        </div>
      </div>
      <div className="profile__container--bottom">
        <p className="info__title">Personal information</p>
        <InfoBox
          className="uname__box"
          iconType={"login"}
          title={"Username"}
          value={login}
        />
        <InfoBox
          iconType={"mobile"}
          title={"Mobile phone"}
          value={phone}
          placeholder={"Enter your phone number"}
        />
        <InfoBox
          iconType={"email"}
          title={"Email address"}
          value={email}
          placeholder={"Enter your email address"}
        />
        <div className="info__link">
          <Password />
          <p className="info__password" onClick={changePasswordRequest}>
            Change password...
          </p>
        </div>
        <div className="info__link">
          <Trash />
          <p className="info__delete" onClick={deleteCurrentUser}>
            Delete account...
          </p>
        </div>
      </div>
    </div>
  );
}
