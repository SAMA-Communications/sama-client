import InfoBox from "@components/info/elements/InfoBox";
import addSuffix from "@utils/navigation/add_suffix";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import usersService from "@services/usersService";
import { KEY_CODES } from "@helpers/keyCodes";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import "@styles/info/UserProfile.css";

import { ReactComponent as Close } from "@icons/actions/Close.svg";
import { ReactComponent as Password } from "@icons/users/Password.svg";
import { ReactComponent as Trash } from "@icons/actions/Trash.svg";
import { ReactComponent as UserIcon } from "@icons/users/ProfileIcon.svg";
export default function UserProfile() {
  const { pathname, hash } = useLocation();

  const currentUser = useSelector(selectCurrentUser);
  const { login, email, phone, first_name, last_name } = currentUser || {};

  useEffect(() => {
    const keydownHandler = (e) => {
      e.keyCode === KEY_CODES.ESCAPE &&
        removeAndNavigateSubLink(pathname + hash, "/profile");
      e.keyCode === KEY_CODES.ENTER && e.preventDefault();
    };

    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [hash, pathname]);

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
        <div onClick={() => addSuffix(pathname + hash, "/edit?type=user")}>
          <p className="uname__first">
            {first_name || <span className="text-gray">First name</span>}
          </p>
          <p className="uname__last">
            {last_name || <span className="text-gray">Last name</span>}
          </p>
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
          onClickFunc={() => addSuffix(pathname + hash, "/edit?type=personal")}
          iconType={"mobile"}
          title={"Mobile phone"}
          value={phone}
          placeholder={"Enter your phone number"}
        />
        <InfoBox
          onClickFunc={() => addSuffix(pathname + hash, "/edit?type=personal")}
          iconType={"email"}
          title={"Email address"}
          value={email}
          placeholder={"Enter your email address"}
        />
        <div className="info__link">
          <Password />
          <p
            className="info__password"
            onClick={() => {
              const currentPassword = window.prompt(
                "Enter your current password:"
              );
              if (!currentPassword) {
                return;
              }

              const newPassword = window.prompt("Enter a new password:");
              if (!newPassword || !currentPassword) {
                return;
              }

              usersService.changePassword(currentPassword, newPassword);
            }}
          >
            Change password...
          </p>
        </div>
        <div className="info__link">
          <Trash />
          <p
            className="info__delete"
            onClick={async () => {
              await usersService.deleteCurrentUser();
              navigateTo("/authorization");
            }}
          >
            Delete account...
          </p>
        </div>
      </div>
    </div>
  );
}
