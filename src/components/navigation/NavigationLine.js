import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import addPrefix from "@utils/navigation/add_prefix";
import getUserInitials from "@utils/user/get_user_initials";
import navigateTo from "@utils/navigation/navigate_to";
import usersService from "@services/usersService";
import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { setAllParams } from "@store/values/ContextMenu";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import "@styles/navigation/NavigationLine.css";

import SamaLogo from "@components/static/SamaLogo";

import { ReactComponent as Create } from "@icons/AddConversation.svg";
import { ReactComponent as List } from "@icons/Conversations.svg";
import { ReactComponent as Logout } from "@icons/actions/Logout.svg";

export default function NavigationLine() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const currentUser = useSelector(getCurrentUserFromParticipants);

  const isTabletView = useSelector(getIsTabletView);
  const isMobileView = useSelector(getIsMobileView);

  const sendLogout = async () => {
    try {
      await usersService.logout();
    } catch (err) {
      dispatch(setUserIsLoggedIn(false));
    }
  };

  const [isProfilePageActive, isChatListActive, isCreatePageActive] =
    useMemo(() => {
      const isProfilePage = pathname.includes("/profile");
      return [
        isProfilePage ? "active" : "",
        !isProfilePage ? "active" : "",
        pathname.includes("/create") || pathname.includes("/create_encrypted")
          ? "active"
          : "",
      ];
    }, [pathname]);

  const openContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setAllParams({
        list: ["createGroupChat", "createEncryptedChat"],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
      })
    );
  };

  return (
    <aside className="navigation__container">
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
          className={`menu__create fcc ${isCreatePageActive}`}
          onContextMenu={openContextMenu}
          onClick={openContextMenu}
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
