import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

import usersService from "@services/usersService";
import { useKeyDown } from "@hooks/useKeyDown";

import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import InfoBox from "@components/info/elements/InfoBox";
import DynamicAvatar from "@components/info/elements//DynamicAvatar";

import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";

import addSuffix from "@utils/navigation/add_suffix";
import globalConstants from "@utils/global/constants";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { KEY_CODES } from "@utils/global/keyCodes";

import BackBtn from "@icons/options/Back.svg?react";
import Close from "@icons/actions/CloseGray.svg?react";
import LogoutMini from "@icons/actions/LogoutMini.svg?react";
import Password from "@icons/users/Password.svg?react";
import Trash from "@icons/actions/Trash.svg?react";
import UserIcon from "@icons/users/AddAvatar.svg?react";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const currentUser = useSelector(getCurrentUserFromParticipants);
  const { login, email, phone, first_name, last_name } = currentUser || {};

  const isMobileView = useSelector(getIsMobileView);
  const isCurrentUserCantLeave = login?.startsWith("sama-user-");

  const inputFilesRef = useRef(null);

  useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());
  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateSubLink(pathname + hash, "/profile")
  );

  const sendLogout = async () => {
    try {
      await usersService.logout();
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
    } catch (err) {
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
      dispatch(setUserIsLoggedIn(false));
    }
  };

  const pickFileClick = () => inputFilesRef.current.click();

  const sendChangeAvatarRequest = async (file) =>
    void (await usersService.updateUserAvatar(file));

  return (
    <div className="w-[400px] h-full mr-[15px] max-md:w-dvw max-md:h-dvh max-md:mr-[0px]">
      <CustomScrollBar childrenClassName="py-[20px] flex flex-col gap-[15px] max-md:py-[0px]">
        <div className="relative flex flex-col justify-center items-center py-[40px] gap-[20px] rounded-[32px] bg-(--color-accent-light) max-md:rounded-t-[0px]">
          {isMobileView ? (
            <BackBtn
              className="absolute right-[30px] top-[30px] cursor-pointer max-md:left-[4svw] max-md:top-[34px]"
              onClick={() =>
                removeAndNavigateSubLink(pathname + hash, "/profile")
              }
            />
          ) : (
            <Close
              className="absolute top-[30px] right-[30px] cursor-pointer"
              onClick={() =>
                removeAndNavigateSubLink(pathname + hash, "/profile")
              }
            />
          )}
          <div
            className="relative w-[160px] h-[160px] rounded-[24px] bg-(--color-bg-light) flex justify-center items-center cursor-pointer overflow-hidden"
            onClick={pickFileClick}
          >
            <span
              className="absolute w-full h-full bg-(--color-black-25) rounded-[24px] opacity-0 transition-opacity duration-300 hover:opacity-100"
              aria-hidden="true"
            ></span>
            <DynamicAvatar
              avatarUrl={currentUser.avatar_url}
              avatarBlurHash={currentUser.avatar_object?.file_blur_hash}
              defaultIcon={<UserIcon />}
              altText={"User's Profile"}
            />
            <input
              id="inputFile"
              className="hidden invisible"
              ref={inputFilesRef}
              type="file"
              onChange={(e) =>
                sendChangeAvatarRequest(Array.from(e.target.files).at(0))
              }
              accept={globalConstants.allowedAvatarFormats}
              multiple
            />
          </div>
          <div
            className="w-[90%]"
            onClick={() => addSuffix(pathname + hash, "/edit?type=user")}
          >
            <p className="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer text-center !font-bold text-h3 text-black">
              {first_name || (
                <span className="text-center !font-bold text-h3 text-(--color-text-dark)">
                  First name
                </span>
              )}
            </p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer text-center !font-normal text-h5 text-black mt-[10px]">
              {last_name || (
                <span className="text-center !font-normal text-h5 text-(--color-text-dark) mt-[10px]">
                  Last name
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="py-[30px] px-[20px] flex flex-1 flex-col rounded-[32px] bg-(--color-bg-light) max-md:flex-1 max-md:rounded-b-[0px]">
          <p className="text-center !font-normal text-h5 text-(--color-text-dark) mb-[10px]">
            Personal information
          </p>
          <InfoBox
            modifier={"!cursor-default"}
            iconType={"login"}
            title={"Username"}
            value={login}
          />
          <InfoBox
            modifier={"mt-[10px]"}
            onClickFunc={() =>
              addSuffix(pathname + hash, "/edit?type=personal")
            }
            iconType={"mobile"}
            title={"Mobile phone"}
            value={phone}
            placeholder={"Enter your phone number"}
          />
          <InfoBox
            modifier={"mt-[10px]"}
            onClickFunc={() =>
              addSuffix(pathname + hash, "/edit?type=personal")
            }
            iconType={"email"}
            title={"Email address"}
            value={email}
            placeholder={"Enter your email address"}
          />
          {isCurrentUserCantLeave ? null : (
            <div className="flex items-center gap-[10px] px-[10px] cursor-pointer mt-[10px]">
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
          )}
          {isMobileView ? (
            <div className="flex items-center gap-[10px] px-[10px] cursor-pointer mt-[30px] max-md:mt-[20px]">
              <LogoutMini />
              <p
                onClick={async () => {
                  sendLogout();
                  navigateTo("/authorization");
                }}
              >
                Log out
              </p>
            </div>
          ) : null}
          {isCurrentUserCantLeave ? null : (
            <div className="flex items-center gap-[10px] px-[10px] cursor-pointer mt-auto">
              <Trash />
              <p
                className="text-(--color-red)"
                onClick={async () =>
                  (await usersService.deleteCurrentUser()) &&
                  navigateTo("/authorization")
                }
              >
                Delete account
              </p>
            </div>
          )}
        </div>
      </CustomScrollBar>
    </div>
  );
}
