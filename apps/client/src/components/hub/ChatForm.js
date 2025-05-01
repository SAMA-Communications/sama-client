import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { motion as m } from "framer-motion";

import api from "@api/api";

import { useKeyDown } from "@hooks/useKeyDown";

import ChatFormContent from "@components/hub/chatForm/ChatFormContent.js";
import ChatFormHeader from "@components/hub/chatForm/ChatFormHeader.js";
import ChatFormNavigation from "@components/hub/chatForm/ChatFormNavigation.js";
import ChatFormEditor from "@components/hub/chatForm/ChatFormEditor.js";

import { getIsTabInFocus } from "@store/values/IsTabInFocus";
import { getUserIsLoggedIn } from "@store/values/UserIsLoggedIn.js";
import { selectCurrentUserId } from "@store/values/CurrentUserId.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import {
  clearSelectedConversation,
  setSelectedConversation,
} from "@store/values/SelectedConversation";
import { setClicked } from "@store/values/ContextMenu";
import { getIsMobileView } from "@store/values/IsMobileView.js";

import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import { CHAT_CONTENT_TABS } from "@utils/global/chatContentTabs.js";
import { KEY_CODES } from "@utils/global/keyCodes";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();

  const isUserLogin = useSelector(getUserIsLoggedIn);
  const isTabInFocus = useSelector(getIsTabInFocus);
  const isMobileView = useSelector(getIsMobileView);

  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const isGroup = selectedConversation?.type === "g";

  const currentUserId = useSelector(selectCurrentUserId);
  const conversationOwner = selectedConversation.owner_id?.toString();
  const isOwner = currentUserId === conversationOwner;

  const [currentTab, setCurrentTab] = useState(CHAT_CONTENT_TABS.MESSAGES);
  const isEnableProgrammableChat =
    import.meta.env.VITE_ENABLE_PROGRAMMABLE_CHAT === "true" && !isMobileView;

  const chatMessagesBlock = useRef();

  const closeForm = (e) => {
    const { pathname, hash } = location;

    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    if (!selectedCID) {
      return;
    }

    dispatch(setClicked(false));
    dispatch(clearSelectedConversation());
    api.unsubscribeFromUserActivity({});
    removeAndNavigateLastSection(pathname + hash);
  };

  const readMessage = useCallback(() => {
    if (!conversations[selectedCID] || !document.hasFocus()) {
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

  useLayoutEffect(
    () => setCurrentTab(CHAT_CONTENT_TABS.MESSAGES),
    [selectedCID]
  );

  const formComponent = useMemo(() => {
    if (!selectedCID) return null;

    switch (currentTab) {
      case CHAT_CONTENT_TABS.MESSAGES:
        return <ChatFormContent chatMessagesBlock={chatMessagesBlock} />;
      case CHAT_CONTENT_TABS.APPS:
        return <ChatFormEditor />;
      default:
        return null;
    }
  }, [selectedCID, currentTab, chatMessagesBlock]);

  return (
    <m.section
      className="flex flex-col flex-grow max-md:p-[4svw] md:max-xl:my-[20px] md:max-xl:mr-[20px] max-xl:p-[20px] md:rounded-[32px] bg-(--color-bg-light)"
      initial={{ scale: 1, opacity: 0 }}
      animate={{ scale: [1.02, 1], y: [3, 0], opacity: [0, 1] }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {selectedCID ? (
        <>
          <ChatFormHeader closeFormFunc={closeForm} />
          {isGroup && isOwner && isEnableProgrammableChat ? (
            <ChatFormNavigation
              currentTab={currentTab}
              changeTabFunc={setCurrentTab}
            />
          ) : null}
          {formComponent}
        </>
      ) : (
        <p className="mt-auto mb-auto text-center font-light text-[58px] !text-(--color-text-light)">
          Select a conversation to start chatting
        </p>
      )}
    </m.section>
  );
}
