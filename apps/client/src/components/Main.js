import { cloneElement, useMemo } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";

import { EditModalContainer, ConversationInfo } from "@sama-communications.ui-kit";

import ChatForm from "@components/hub/ChatForm";
import ChatList from "@components/hub/ChatList";

import AttachHub from "@components/attach/AttachHub";
import ConversationSelectHub from "@components/modals/ConversationSelectHub.js";
import MediaHub from "@components/attach/MediaHub";
import OtherUserProfile from "@components/info/OtherUserProfile";
import UserProfileContainer from "@components/info/UserProfileContainer.js";
import UsersSelectModalHub from "@components/modals/UsersSelectModalHub";

import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView";
import { getConverastionById, selectConversationsEntities } from "@store/values/Conversations";

import { getEditWindowTypeFromUrl } from "@utils/NavigationUtils.js";

import "react-loading-skeleton/dist/skeleton.css";

const blockMap = {
  "/info": <ConversationInfo />,
  "/user": <OtherUserProfile />,
  "/add": <UsersSelectModalHub type={"add_participants"} />,
  "/create": <UsersSelectModalHub />,
  "/attach": <AttachHub />,
  "/media": <MediaHub />,
  "/edit": <EditModalContainer />,
  "/forward": <ConversationSelectHub title="Forward to..." />,
};

export default function Main({ isNeedToAnimate }) {
  const location = useLocation();

  const isMobileView = useSelector(getIsMobileView);
  const isTabletView = useSelector(getIsTabletView);

  const conversations = useSelector(selectConversationsEntities);
  const conversationsArray = conversations && Object.values(conversations);
  const selectedConversation = useSelector(getConverastionById);

  const additionalContainerRight = useMemo(() => {
    const { pathname, hash } = location;

    const isChatInfo = hash.includes("/info");
    const isEditModal = (pathname + hash).includes("/edit");

    const allBlocks = Object.entries(blockMap)
      .filter(([key, _]) => pathname.includes(key) || hash.includes(key))
      .map(([key, component]) =>
        cloneElement(component, {
          key,
          ...(isChatInfo
            ? {
                conversation: selectedConversation,
                isMobile: isMobileView,
              }
            : {}),
          ...(isEditModal
            ? {
                type: getEditWindowTypeFromUrl(location.pathname + location.hash + location.search),
              }
            : {}),
        }),
      );

    return isMobileView ? allBlocks.slice(-2) : allBlocks;
  }, [location, isMobileView]);

  const hubContainer = useMemo(() => {
    if (isMobileView) {
      const keys = additionalContainerRight.map((el) => el.key);
      if (!!location.hash) {
        return keys.includes("/user") || keys.includes("/info") ? null : <ChatForm />;
      }
      return location.pathname.includes("/profile") ? null : <ChatList />;
    }

    if (isTabletView) {
      return !!location.hash ? <ChatForm /> : <ChatList />;
    }

    return (
      <>
        {location.pathname.includes("/profile") ? <UserProfileContainer key="userProfile" /> : <ChatList />}
        <ChatForm />
      </>
    );
  }, [location, isMobileView, isTabletView, conversations]);

  const mainContent = useMemo(() => {
    const shouldRenderContent = isMobileView
      ? !(!!location.hash
          ? additionalContainerRight.some((el) => el.key === "/user" || el.key === "/info")
          : location.pathname.includes("/profile"))
      : true;

    if (!shouldRenderContent) return null;

    return hubContainer;
  }, [hubContainer]);

  return (
    <>
      {mainContent}
      {additionalContainerRight}
    </>
  );
}
