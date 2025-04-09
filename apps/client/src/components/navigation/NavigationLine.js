import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import addPrefix from "@utils/navigation/add_prefix";
import getUserInitials from "@utils/user/get_user_initials";
import navigateTo from "@utils/navigation/navigate_to";
import usersService from "@services/usersService";
import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import "@styles/navigation/NavigationLine.css";

import SamaLogo from "@components/static/SamaLogo";

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
        isProfilePage ? "active" : "",
        !isProfilePage ? "active" : "",
        pathname.includes("/create") ? "active" : "",
      ];
    }, [pathname]);

  return (
    <aside
      className="navigation__container"
      style={{ paddingTop: 20, paddingBottom: 20 }}
    >
      <div
        className="navigation__logo fcc"
        onClick={() => {
          dispatch(setSelectedConversation({}));
          navigateTo("/");
        }}
      >
        <SamaLogo />
      </div>
      <div className="navigation__menu fcc">
        <div
          onClick={() => {
            const currentPath =
              isTabletView && hash.includes("/info")
                ? pathname + hash.replace("/info", "")
                : pathname + hash;
            addPrefix(currentPath, "/profile");
          }}
          className={`menu__profile fcc ${isProfilePageActive}`}
        >
          <span className="fcc">
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
          className={`menu__list fcc ${isChatListActive}`}
        >
          <List />
        </div>
        <div
          onClick={() => addPrefix(pathname + hash, "/create")}
          className={`menu__create fcc ${isCreatePageActive}`}
        >
          <Create />
        </div>
      </div>
      <div
        onClick={() => {
          sendLogout();
          navigateTo("/authorization");
        }}
        className="menu__logout fcc"
      >
        <Logout />
      </div>
    </aside>
  );
}
