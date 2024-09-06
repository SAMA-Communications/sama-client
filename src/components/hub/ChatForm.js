import api from "@api/api";
import encryptionService from "@services/encryptionService";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { getIsTabInFocus } from "@store/values/IsTabInFocus";
import { getUserIsLoggedIn } from "@store/values/UserIsLoggedIn.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import {
  clearSelectedConversation,
  setSelectedConversation,
} from "@store/values/SelectedConversation";
import { KEY_CODES } from "@helpers/keyCodes";
import { setClicked } from "@store/values/ContextMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "@styles/hub/ChatForm.css";

import ChatFormContent from "@components/hub/chatForm/ChatFormContent.js";
import ChatFormHeader from "@components/hub/chatForm/ChatFormHeader.js";
import ChatFormInputs from "@components/hub/chatForm/ChatFormInputs.js";
import LockScreen from "@components/hub/LockScreen";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();

  const currentUserId = useSelector(selectCurrentUserId);
  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const isUserLogin = useSelector(getUserIsLoggedIn);
  const isTabInFocus = useSelector(getIsTabInFocus);
  const [isSuccesESession, setIsSuccesESession] = useState(
    selectedConversation?.is_encrypted
  );

  const chatMessagesBlock = useRef();
  const [files, setFiles] = useState([]);

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
    if (selectedConversation?.is_encrypted) {
      if (
        !encryptionService.hasEncryptedAccount() &&
        !location.hash.includes("/auth_encrypted")
      ) {
        dispatch(clearSelectedConversation());
        navigateTo(`/auth_encrypted?convId=${selectedConversation._id}`);
        return;
      }

      encryptionService
        .createEncryptionSession(
          selectedConversation.owner_id === currentUserId
            ? selectedConversation.opponent_id
            : selectedConversation.owner_id
        )
        .then(({ session }) => {
          setIsSuccesESession(!!session);
        });
    }

    files.length && setFiles([]);

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

  return (
    <section className={`chat-form__container ${selectedCID ? "" : "fcc"}`}>
      {location.pathname.includes("auth_encrypted") ? (
        <LockScreen />
      ) : selectedCID ? (
        <>
          <ChatFormHeader closeFormFunc={closeForm} />
          <ChatFormContent scrollRef={chatMessagesBlock} />
          <ChatFormInputs
            chatMessagesBlockRef={chatMessagesBlock}
            isEncryptedSessionActive={isSuccesESession}
            files={files}
            setFiles={setFiles}
          />
        </>
      ) : (
        <p className="chat-form__title">
          Select a conversation to start chatting
        </p>
      )}
    </section>
  );
}
