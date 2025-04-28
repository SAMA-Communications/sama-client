import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import usersService from "@services/usersService";

import SAMALogo from "@components/static/SAMALogo";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";

import addPrefix from "@utils/navigation/add_prefix";
import getUserInitials from "@utils/user/get_user_initials";
import navigateTo from "@utils/navigation/navigate_to";

import List from "@icons/Conversations.svg?react";
import Create from "@icons/AddConversation.svg?react";
import Logout from "@icons/actions/Logout.svg?react";

export default function NavigationLine() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const currentUser = useSelector(getCurrentUserFromParticipants);

  const isTabletView = useSelector(getIsTabletView);
  const isMobileView = useSelector(getIsMobileView);

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

  const [isProfilePageActive, isChatListActive, isCreatePageActive] =
    useMemo(() => {
      const isProfilePage = pathname.includes("/profile");
      return [
        isProfilePage ? "bg-(--color-hover-dark)" : "",
        !isProfilePage ? "bg-(--color-hover-dark)" : "",
        pathname.includes("/create") ? "bg-(--color-hover-dark)" : "",
      ];
    }, [pathname]);

  return (
    <aside className="w-[84px] px-[10px] flex flex-col justify-between bg-transparent select-none pt-[20px] pb-[20px]">
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={() => {
          dispatch(setSelectedConversation({}));
          navigateTo("/");
        }}
      >
        <SAMALogo customClassName="w-[64px] h-[64px]" />
      </div>
      <div className="flex flex-col gap-[20px] items-center justify-center">
        <div
          onClick={() => {
            const currentPath =
              isTabletView && hash.includes("/info")
                ? pathname + hash.replace("/info", "")
                : pathname + hash;
            addPrefix(currentPath, "/profile");
          }}
          className={`w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) flex items-center justify-center ${isProfilePageActive}`}
        >
          <span className="w-full h-full text-h5 text-black rounded-[16px] bg-(--color-bg-light) overflow-hidden flex items-center justify-center">
            <DynamicAvatar
              avatarUrl={currentUser.avatar_url}
              avatarBlurHash={currentUser.avatar_object?.file_blur_hash}
              defaultIcon={getUserInitials()}
              altText={"User's Profile"}
            />
          </span>
        </div>
        <div
          onClick={() => {
            if (isTabletView || isMobileView) {
              dispatch(setSelectedConversation({}));
              navigateTo(`/`);
            } else {
              navigateTo(`/${hash || ""}`);
            }
          }}
          className={`w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) flex items-center justify-center ${isChatListActive}`}
        >
          <List />
        </div>
        <div
          onClick={() => addPrefix(pathname + hash, "/create")}
          className={`w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) flex items-center justify-center ${isCreatePageActive}`}
        >
          <Create className="w-[36px]" />
        </div>
      </div>
      <div
        onClick={() => {
          sendLogout();
          navigateTo("/authorization");
        }}
        className="w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) flex items-center justify-center"
      >
        <Logout />
      </div>
    </aside>
  );
}
