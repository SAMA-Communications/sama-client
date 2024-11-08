import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import DynamicAvatar from "@components/info/elements//DynamicAvatar";
import InfoBox from "@components/info/elements/InfoBox";
import addSuffix from "@utils/navigation/add_suffix";
import encryptionService from "@services/encryptionService";
import globalConstants from "@src/_helpers/constants";
import messagesService from "@services/messagesService";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import usersService from "@services/usersService";
import { KEY_CODES } from "@helpers/keyCodes";
import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

import "@styles/info/UserProfile.css";

import { ReactComponent as BackBtn } from "@icons/options/Back.svg";
import { ReactComponent as Close } from "@icons/actions/CloseGray.svg";
import { ReactComponent as LogoutMini } from "@icons/actions/LogoutMini.svg";
import { ReactComponent as Password } from "@icons/users/Password.svg";
import { ReactComponent as Trash } from "@icons/actions/Trash.svg";
import { ReactComponent as UserIcon } from "@icons/users/AddAvatar.svg";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const isMobileView = useSelector(getIsMobileView);

  const currentUser = useSelector(getCurrentUserFromParticipants);
  const { login, email, phone, first_name, last_name } = currentUser || {};

  const inputFilesRef = useRef(null);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());
  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateSubLink(pathname + hash, "/profile")
  );

  const sendLogout = async () => {
    try {
      await usersService.logout();
      await encryptionService.clearStoredAccount();
      await messagesService.clearLocalMessages();
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
    } catch (err) {
      await encryptionService.clearStoredAccount();
      await messagesService.clearLocalMessages();
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
      dispatch(setUserIsLoggedIn(false));
    }
  };

  const pickFileClick = () => inputFilesRef.current.click();

  const sendChangeAvatarRequest = async (file) =>
    void (await usersService.updateUserAvatar(file));

  return (
    <div className="profile__container">
      <CustomScrollBar>
        <div className="profile__container--top fcc">
          {isMobileView ? (
            <BackBtn
              className="ci-close"
              onClick={() =>
                removeAndNavigateSubLink(pathname + hash, "/profile")
              }
            />
          ) : (
            <Close
              className="profile__close"
              onClick={() =>
                removeAndNavigateSubLink(pathname + hash, "/profile")
              }
            />
          )}
          <div
            className="profile__photo--current fcc cursor-pointer"
            onClick={pickFileClick}
          >
            <DynamicAvatar
              avatarUrl={currentUser.avatar_url}
              avatarBlurHash={currentUser.avatar_object?.file_blur_hash}
              defaultIcon={<UserIcon />}
              altText={"User's Profile"}
            />
            <input
              id="inputFile"
              ref={inputFilesRef}
              type="file"
              onChange={(e) =>
                sendChangeAvatarRequest(Array.from(e.target.files).at(0))
              }
              accept={globalConstants.allowedAvatarFormats}
              multiple
            />
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
            onClickFunc={() =>
              addSuffix(pathname + hash, "/edit?type=personal")
            }
            iconType={"mobile"}
            title={"Mobile phone"}
            value={phone}
            placeholder={"Enter your phone number"}
          />
          <InfoBox
            onClickFunc={() =>
              addSuffix(pathname + hash, "/edit?type=personal")
            }
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
          {isMobileView ? (
            <div className="info__link">
              <LogoutMini />
              <p
                className="info__delete"
                onClick={async () => {
                  sendLogout();
                  navigateTo("/authorization");
                }}
              >
                Log out
              </p>
            </div>
          ) : null}
          <div className="info__link">
            <Trash />
            <p
              className="info__delete"
              onClick={async () =>
                (await usersService.deleteCurrentUser()) &&
                navigateTo("/authorization")
              }
            >
              Delete account
            </p>
          </div>
        </div>
      </CustomScrollBar>
    </div>
  );
}
