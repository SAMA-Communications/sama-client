import api from "@api/api";
import removePrefix from "@utils/navigation/remove_prefix";
import showCustomAlert from "@utils/show_alert";
import { getCurrentUser } from "@store/values/CurrentUser";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import "@newstyles/info/UserProfile.css";

import { ReactComponent as Close } from "@newicons/actions/Close.svg";
import { ReactComponent as Email } from "@newicons/media/Email.svg";
import { ReactComponent as Password } from "@newicons/users/Password.svg";
import { ReactComponent as Phone } from "@newicons/media/Phone.svg";
import { ReactComponent as Trash } from "@newicons/actions/Trash.svg";
import { ReactComponent as User } from "@newicons/users/User.svg";
import { ReactComponent as UserIcon } from "@newicons/users/ProfileIcon.svg";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const currentUser = useSelector(getCurrentUser);

  const deleteCurrentUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.userDelete();
      navigate("/login");
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
    }
  };

  window.onkeydown = function (event) {
    event.keyCode === 27 && removePrefix(pathname + hash, "/profile");
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
          onClick={() => removePrefix(pathname + hash, "/profile")}
        />
        <div className="profile__photo fcc">
          <UserIcon />
        </div>
        <div>
          <p className="uname__first">
            {currentUser.first_name || "First name"}
          </p>
          <p className="uname__last">{currentUser.last_name || "Last name"}</p>
        </div>
      </div>
      <div className="profile__container--bottom">
        <p className="info__title">Personal information</p>
        <div className="info__box uname__box">
          <div>
            <User />
            <p>Username</p>
          </div>
          <p className="info__login">{currentUser.login}</p>
        </div>
        <div className="info__box">
          <div>
            <Phone />
            <p>Mobile phone</p>
          </div>
          <p className="info__email">
            {currentUser.email || (
              <span className="text-grey">Enter your email address</span>
            )}
          </p>
        </div>
        <div className="info__box">
          <div>
            <Email />
            <p>Email address</p>
          </div>
          <p className="info__phone">
            {currentUser.phone || (
              <span className="text-grey">Enter your phone number</span>
            )}
          </p>
        </div>
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
