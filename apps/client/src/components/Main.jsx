import { cloneElement, useMemo } from "react";

import { useLocation } from "react-router";

import { useSelector } from "react-redux";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";

import AttachHub from "@components/attach/AttachHub";
import MediaHub from "@components/attach/MediaHub";
import ChatForm from "@components/hub/ChatForm";
import ChatList from "@components/hub/ChatList";
import OtherUserProfile from "@components/info/OtherUserProfile";
import UserProfileContainer from "@components/info/UserProfileContainer";
import ConversationSelectHub from "@components/modals/ConversationSelectHub";
import UsersSelectModalHub from "@components/modals/UsersSelectModalHub";

import useHistory from "@hooks/api/useHistory.js";

import { EditModalContainer, ConversationInfo, useViewportBreakpoints } from "@sama-communications.ui-kit";

import { getConverastionById } from "@store/values/Conversations";

import { showRightPanelSlide, showLeftPanelWidth, showChatPanelSlide } from "@utils/AnimationUtils.js";
import { getEditWindowTypeFromUrl } from "@utils/NavigationUtils.js";

const OVERLAY_KEYS = ["/add", "/create", "/attach", "/media", "/edit", "/forward"];

const overlayBlocks = {
  "/add": <UsersSelectModalHub type="add_participants" />,
  "/create": <UsersSelectModalHub />,
  "/attach": <AttachHub />,
  "/media": <MediaHub />,
  "/edit": <EditModalContainer />,
  "/forward": <ConversationSelectHub title="Forward to..." />,
};

export default function Main() {
  const location = useLocation();
  const history = useHistory();
  const selectedConversation = useSelector(getConverastionById);
  const { isMobile: isMobileView, isTablet: isTabletView, isLaptop: isLaptopView } = useViewportBreakpoints();

  const { pathname, hash } = location;
  const fullPath = pathname + hash;
  const isChatInfo = hash.includes("/info");
  const isUserProfile = hash.includes("/user");
  const isEditModal = fullPath.includes("/edit");
  const isTabletListView = !!hash?.includes("/list");

  const hasConversationHash = !!hash && hash.split("/").length > 0;
  const conversationIdFromHash = hash ? hash.slice(1).split("/")[0] : null;
  const otherUserProfileView = isUserProfile && hash?.includes("view=card") ? "card" : "compact";

  const rightPanelContent = useMemo(() => {
    if (isUserProfile && otherUserProfileView === "compact") {
      return cloneElement(<OtherUserProfile />, { key: "/user", view: "compact" });
    }
    if (isChatInfo) {
      return cloneElement(<ConversationInfo />, {
        key: "/info",
        conversation: selectedConversation,
        isMobile: isMobileView,
        onClose: history.closeChatInfoPage,
        onEditConversation: history.openEditConversationWindow,
        onAddParticipants: history.openAddParticipantsWindow,
        onParticipantOpenProfile: (uid) =>
          uid === null ? history.openCurrentUserProfile() : history.openProfileById(uid),
        onParticipantContextMenu: history.openContextMenuWithParams,
      });
    }
    return null;
  }, [isChatInfo, isUserProfile, isMobileView, otherUserProfileView, selectedConversation, history]);

  const isRightPanelVisible = isChatInfo || (isUserProfile && otherUserProfileView === "compact");

  const overlayModals = useMemo(() => {
    return OVERLAY_KEYS.filter((key) => fullPath.includes(key)).map((key) => {
      const element = overlayBlocks[key];
      if (!element) return null;
      return cloneElement(element, {
        key,
        ...(key === "/edit" &&
          isEditModal && {
            type: getEditWindowTypeFromUrl(fullPath),
            onClose: history.undoLastSection,
          }),
      });
    });
  }, [fullPath, isEditModal, history]);

  const leftSection = pathname.includes("/profile") ? (
    <UserProfileContainer key="userProfile" />
  ) : (
    <ChatList key="chatList" />
  );

  const rightPanelVisible = isRightPanelVisible && rightPanelContent;

  if (isMobileView) {
    const mobileContent = pathname.includes("/profile") ? (
      <UserProfileContainer key="userProfile" />
    ) : isChatInfo ? (
      rightPanelContent
    ) : isUserProfile ? (
      <OtherUserProfile key="/user" view={otherUserProfileView} />
    ) : hasConversationHash ? (
      <ChatForm key="chatForm" />
    ) : (
      <ChatList key="chatList" />
    );

    return (
      <div className="flex h-dvh w-dvw flex-col overflow-hidden">
        {mobileContent}
        {overlayModals}
        {isUserProfile && otherUserProfileView === "card" && (
          <OtherUserProfile key="other-user-profile-card" view="card" />
        )}
      </div>
    );
  }

  if (isTabletView) {
    const tabletListOnly = !conversationIdFromHash;
    const tabletSplit = conversationIdFromHash && isTabletListView;
    const showList = tabletListOnly || tabletSplit;

    return (
      <>
        <AnimatePresence initial={false}>
          {showList && (
            <m.aside
              key="tablet-left-panel"
              className="flex shrink-0 flex-col overflow-hidden"
              variants={showLeftPanelWidth}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="w-[400px] shrink-0">{leftSection}</div>
            </m.aside>
          )}
        </AnimatePresence>
        <m.aside
          key="tablet-chat-panel"
          className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
          variants={showChatPanelSlide}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.25 }}
        >
          <ChatForm />
        </m.aside>
        <AnimatePresence>
          {rightPanelVisible && (
            <m.aside
              key="tablet-right-panel"
              className="bg-bg-dark fixed top-0 right-0 z-50 flex h-full w-[400px] flex-col overflow-hidden shadow-[-8px_0_24px_rgba(0,0,0,0.12)]"
              variants={showRightPanelSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {rightPanelContent}
            </m.aside>
          )}
        </AnimatePresence>
        {overlayModals}
        {isUserProfile && otherUserProfileView === "card" && (
          <OtherUserProfile key="other-user-profile-card" view="card" />
        )}
      </>
    );
  }

  if (isLaptopView) {
    return (
      <>
        <aside className="flex w-[400px] shrink-0 flex-col overflow-hidden">{leftSection}</aside>
        <ChatForm />
        <AnimatePresence>
          {rightPanelVisible && (
            <m.aside
              key="laptop-right-panel"
              className="bg-bg-dark fixed top-0 right-0 z-50 flex h-full w-[400px] flex-col overflow-hidden shadow-[-8px_0_24px_rgba(0,0,0,0.12)]"
              variants={showRightPanelSlide}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {rightPanelContent}
            </m.aside>
          )}
        </AnimatePresence>
        {overlayModals}
        {isUserProfile && otherUserProfileView === "card" && (
          <OtherUserProfile key="other-user-profile-card" view="card" />
        )}
      </>
    );
  }

  return (
    <>
      <aside className="flex w-[400px] shrink-0 flex-col overflow-hidden">{leftSection}</aside>
      <ChatForm />
      {rightPanelVisible && (
        <aside className="mr-[15px] flex h-full w-[400px] shrink-0 flex-col overflow-hidden">{rightPanelContent}</aside>
      )}
      {overlayModals}
      {isUserProfile && otherUserProfileView === "card" && (
        <OtherUserProfile key="other-user-profile-card" view="card" />
      )}
    </>
  );
}
