import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

import { useLocation } from "react-router";

import { useSelector, useDispatch } from "react-redux";

import { X } from "lucide-react";

import api from "@api/api";

import ChatFormContent from "@components/hub/chatForm/ChatFormContent";
import ChatFormEditor from "@components/hub/chatForm/ChatFormEditor";

import useHistory from "@hooks/api/useHistory.js";
import { useKeyDown } from "@hooks/tools/useKeyDown";

import { getDraftEditedMessageId, removeDraftFields } from "@lib/draftsEngine.js";

import { ConversationHeader, useViewportBreakpoints } from "@sama-communications.ui-kit";

import { addExternalProps, selectContextExternalProps, setClicked } from "@store/values/ContextMenu";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId.js";
import { getIsTabInFocus } from "@store/values/IsTabInFocus";
import { clearSelectedConversation, setSelectedConversation } from "@store/values/SelectedConversation";
import { getUserIsLoggedIn } from "@store/values/UserIsLoggedIn.js";

import { CHAT_CONTENT_TABS, KEY_CODES } from "@utils/constants.js";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const isUserLogin = useSelector(getUserIsLoggedIn);
  const isTabInFocus = useSelector(getIsTabInFocus);
  const { isMobile: isMobileView, isTablet: isTabletView } = useViewportBreakpoints();

  const conversations = useSelector(selectConversationsEntities);
  const draftExternalProps = useSelector(selectContextExternalProps);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const isGroup = selectedConversation?.type === "g";

  const currentUserId = useSelector(selectCurrentUserId);
  const conversationOwner = selectedConversation?.owner_id?.toString();
  const isOwner = currentUserId === conversationOwner;

  const [currentTab, setCurrentTab] = useState(CHAT_CONTENT_TABS.MESSAGES);
  const isEnableProgrammableChat = import.meta.env.VITE_ENABLE_PROGRAMMABLE_CHAT === "true" && !isMobileView;

  const cancelMessageEditIfActive = useCallback(() => {
    if (!selectedCID) return false;
    const isEditing = !!getDraftEditedMessageId(selectedCID) || !!draftExternalProps[selectedCID]?.draft_edited_mid;
    if (!isEditing) return false;
    dispatch(addExternalProps({ [selectedCID]: {} }));
    removeDraftFields(selectedCID, ["edited_mid"]);
    return true;
  }, [selectedCID, draftExternalProps, dispatch]);

  const closeChatCompletely = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (!selectedCID) return;
      dispatch(setClicked(false));
      dispatch(clearSelectedConversation());
      api.unsubscribeFromUserActivity({});
      history.closeChatCompletely();
    },
    [selectedCID, dispatch, history],
  );

  const closeForm = useCallback(
    (e) => {
      if (e && e.stopPropagation) e.stopPropagation();
      if (!selectedCID) return;
      closeChatCompletely();
    },
    [selectedCID, closeChatCompletely],
  );

  const onBackButton = useCallback(() => {
    if (!selectedCID) return;
    if (isTabletView) {
      if (location.hash.includes("/list")) {
        closeChatCompletely();
      } else {
        history.openTabletListView();
      }
    } else {
      closeForm();
    }
  }, [selectedCID, closeChatCompletely, closeForm, isTabletView, location.hash, history]);

  const handleEscapeKey = useCallback(() => {
    if (!selectedCID) return;
    if (cancelMessageEditIfActive()) return;
    closeChatCompletely();
  }, [selectedCID, cancelMessageEditIfActive, closeChatCompletely]);

  const readMessage = useCallback(() => {
    if (!conversations || !conversations[selectedCID] || !document.hasFocus()) {
      return;
    }

    if (conversations[selectedCID].unread_messages_count > 0) {
      dispatch(clearCountOfUnreadMessages(selectedCID));
      api.markConversationAsRead({ cid: selectedCID });
    }
  }, [conversations, selectedCID]);

  useEffect(() => {
    if (isTabInFocus === true) {
      readMessage();
    }
  }, [isTabInFocus, readMessage]);

  useEffect(() => {
    document.addEventListener("swiped-left", closeForm);
    document.addEventListener("swiped-right", closeForm);

    return () => {
      document.removeEventListener("swiped-left", closeForm);
      document.removeEventListener("swiped-right", closeForm);
    };
  }, [closeForm]);

  useEffect(() => {
    const { hash } = location;

    if (!hash || hash.split("/")[0].slice(1) === selectedCID || !isUserLogin) {
      return;
    }

    dispatch(setSelectedConversation({ id: hash.slice(1).split("/")[0] }));
  }, [location, isUserLogin]);

  useKeyDown(KEY_CODES.ESCAPE, handleEscapeKey);

  useLayoutEffect(() => setCurrentTab(CHAT_CONTENT_TABS.MESSAGES), [selectedCID]);

  const formComponent = useMemo(() => {
    if (!selectedCID) return null;

    switch (currentTab) {
      case CHAT_CONTENT_TABS.MESSAGES:
        return (
          <ChatFormContent
            onOpenAttachmentHub={history.openAttachmentHub}
            isLocationIncludeAttach={history.isLocationIncludeAttach()}
          />
        );
      case CHAT_CONTENT_TABS.APPS:
        return <ChatFormEditor />;
      default:
        return null;
    }
  }, [selectedCID, currentTab, history]);

  return (
    <section
      key="chatForm"
      id="chatFormContainer"
      className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col gap-1.25 overflow-hidden px-3.5 shadow-[inset_7px_0_14px_-3px_rgba(0,0,0,0.05),inset_-7px_0_14px_-3px_rgba(0,0,0,0.05)] max-md:w-full"
    >
      {selectedCID ? (
        <>
          <ConversationHeader
            conversation={selectedConversation}
            isSelectionMode={location.hash.includes("/selection")}
            currentTab={currentTab}
            changeTabFunc={setCurrentTab}
            closeFormFunc={onBackButton}
            closeIcon={isTabletView && location.hash.includes("/list") ? <X size={18} /> : undefined}
            onForwardSection={history.openForwardSection}
            onCloseSelectionMode={history.closeSelectionMode}
            onOpenChatOrParticipantInfo={history.openChatOrPaticipantInfo}
          />
          {formComponent}
        </>
      ) : (
        <p className="text-text-dark/60 my-auto self-center text-center text-4xl font-extralight max-xl:text-3xl">
          Select a conversation to start chatting
        </p>
      )}
    </section>
  );
}
