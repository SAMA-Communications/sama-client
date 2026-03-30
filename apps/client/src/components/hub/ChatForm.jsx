import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

import { useLocation } from "react-router";

import { useSelector, useDispatch } from "react-redux";

import { X } from "lucide-react";

import api from "@api/api";

import ChatFormContent from "@components/hub/chatForm/ChatFormContent";
import ChatFormEditor from "@components/hub/chatForm/ChatFormEditor";

import useHistory from "@hooks/api/useHistory.js";
import { useKeyDown } from "@hooks/tools/useKeyDown";

import { ConversationHeader, useViewportBreakpoints } from "@sama-communications.ui-kit";

import draftService from "@services/tools/draftService.js";

import { addExternalProps, setClicked } from "@store/values/ContextMenu";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId.js";
import { getIsTabInFocus } from "@store/values/IsTabInFocus";
import { clearSelectedConversation, setSelectedConversation } from "@store/values/SelectedConversation";
import { getUserIsLoggedIn } from "@store/values/UserIsLoggedIn.js";

import { KEY_CODES, CHAT_CONTENT_TABS } from "@utils/constants.js";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const isUserLogin = useSelector(getUserIsLoggedIn);
  const isTabInFocus = useSelector(getIsTabInFocus);
  const { isMobile: isMobileView, isTablet: isTabletView } = useViewportBreakpoints();

  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const isGroup = selectedConversation?.type === "g";

  const currentUserId = useSelector(selectCurrentUserId);
  const conversationOwner = selectedConversation?.owner_id?.toString();
  const isOwner = currentUserId === conversationOwner;

  const [currentTab, setCurrentTab] = useState(CHAT_CONTENT_TABS.MESSAGES);
  const isEnableProgrammableChat = import.meta.env.VITE_ENABLE_PROGRAMMABLE_CHAT === "true" && !isMobileView;

  const closeForm = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    if (!selectedCID) {
      return;
    }

    if (draftService.getDraftEditedMessageId(selectedCID)) {
      dispatch(addExternalProps({ [selectedCID]: {} }));
      draftService.removeDraftWithOptions(selectedCID, "edited_mid");
      return;
    }

    dispatch(setClicked(false));
    dispatch(clearSelectedConversation());
    api.unsubscribeFromUserActivity({});
    history.closeChatCompletely();
  };

  const onBackButton = () => {
    if (!selectedCID) return;
    if (draftService.getDraftEditedMessageId(selectedCID)) {
      dispatch(addExternalProps({ [selectedCID]: {} }));
      draftService.removeDraftWithOptions(selectedCID, "edited_mid");
      return;
    }
    if (isTabletView) {
      if (location.hash.includes("/list")) {
        dispatch(setClicked(false));
        dispatch(clearSelectedConversation());
        api.unsubscribeFromUserActivity({});
        history.closeChatCompletely();
      } else {
        history.openTabletListView();
      }
    } else {
      closeForm();
    }
  };

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
  }, [location, selectedCID]);

  useEffect(() => {
    const { hash } = location;

    if (!hash || hash.split("/")[0].slice(1) === selectedCID || !isUserLogin) {
      return;
    }

    dispatch(setSelectedConversation({ id: hash.slice(1).split("/")[0] }));
  }, [location, isUserLogin]);

  useKeyDown(KEY_CODES.ESCAPE, closeForm);

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
      className="relative flex h-full min-w-0 flex-1 flex-col gap-1.25 overflow-hidden px-3.5 shadow-[inset_7px_0_14px_-3px_rgba(0,0,0,0.05),inset_-7px_0_14px_-3px_rgba(0,0,0,0.05)] max-md:w-dvw"
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
