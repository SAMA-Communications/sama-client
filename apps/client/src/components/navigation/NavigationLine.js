import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useMemo } from "react";

import usersService from "@services/usersService";

import SAMALogo from "@components/static/SAMALogo";
import { DynamicAvatar } from "@sama-communications.ui-kit";

import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";

import { addPrefix, navigateTo } from "@utils/NavigationUtils.js";
import { getUserInitials } from "@utils/UserUtils.js";
import { showItem, showLogoOptions } from "@utils/AnimationUtils.js";

import List from "@icons/Conversations.svg?react";
import Create from "@icons/AddConversation.svg?react";
import Logout from "@icons/actions/Logout.svg?react";

export default function NavigationLine({
  isReverse,
  disableAnimation = false,
  shareRef,
  triggerExitEvent,
}) {
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
    <aside
      ref={shareRef}
      className="w-[84px] px-[10px] flex flex-col justify-between bg-transparent select-none pt-[20px] pb-[20px]"
    >
      <AnimatePresence initial={!disableAnimation}>
        <m.div
          key="navigationLineLogo"
          className="flex items-center justify-center cursor-pointer"
          onClick={() => {
            dispatch(setSelectedConversation({}));
            navigateTo("/");
          }}
          whileTap={{ scale: 0.95 }}
        >
          <SAMALogo
            customClassName="w-[58px] h-[58px]"
            variants={disableAnimation ? false : showLogoOptions(isReverse)}
            initial="hidden"
            animate="visible"
            disableAnimation={disableAnimation}
            reduceDuration={0.4}
            reduceDelay={isReverse ? 1.1 : 0.9}
          />
        </m.div>
        <div className="flex flex-col gap-[20px] items-center justify-center">
          <m.div
            key="navigationLineProfileIcon"
            className={`w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) transition-[background-color] duration-200 flex items-center justify-center ${isProfilePageActive}`}
            onClick={() => {
              const currentPath =
                isTabletView && hash.includes("/info")
                  ? pathname + hash.replace("/info", "")
                  : pathname + hash;
              addPrefix(currentPath, "/profile");
            }}
            variants={showItem(3, isReverse, disableAnimation)}
            initial="hidden"
            animate="visible"
            whileTap="tap"
          >
            <span className="w-full h-full text-h5 text-black rounded-[16px] bg-(--color-bg-light) overflow-hidden flex items-center justify-center">
              <DynamicAvatar
                avatarUrl={currentUser.avatar_url}
                avatarBlurHash={currentUser.avatar_object?.file_blur_hash}
                defaultIcon={getUserInitials()}
                altText={"User's Profile"}
              />
            </span>
          </m.div>
          <m.div
            key="navigationLineChatIcon"
            onClick={() => {
              if (isTabletView || isMobileView) {
                dispatch(setSelectedConversation({}));
                navigateTo(`/`);
              } else {
                navigateTo(`/${hash || ""}`);
              }
            }}
            className={`w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) transition-[background-color] duration-200 flex items-center justify-center ${isChatListActive}`}
            variants={showItem(2, isReverse, disableAnimation)}
            initial="hidden"
            animate="visible"
            whileTap="tap"
          >
            <List />
          </m.div>
          <m.div
            key="navigationLineCreateicon"
            onClick={() => addPrefix(pathname + hash, "/create")}
            className={`w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) transition-[background-color] duration-200 flex items-center justify-center ${isCreatePageActive}`}
            variants={showItem(1, isReverse, disableAnimation)}
            initial="hidden"
            animate="visible"
            whileTap="tap"
          >
            <Create className="w-[36px]" />
          </m.div>
        </div>
        <m.div
          key="navigationLineLogoutIcon"
          onClick={() => {
            navigateTo("/authorization");
            triggerExitEvent();
            sendLogout();
          }}
          className="w-[58px] h-[58px] p-[6px] rounded-[16px] cursor-pointer hover:bg-(--color-hover-dark) transition-[background-color] duration-200 flex items-center justify-center"
          variants={showItem(0, isReverse, disableAnimation)}
          initial="hidden"
          animate="visible"
          whileTap="tap"
        >
          <Logout />
        </m.div>
      </AnimatePresence>
    </aside>
  );
}
