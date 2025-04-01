import ChatFormContent from "@components/hub/chatForm/ChatFormContent.js";
import ChatFormEditor from "@components/hub/chatForm/ChatFormEditor.js";
import ChatFormHeader from "@components/hub/chatForm/ChatFormHeader.js";
import ChatFormInputs from "@components/hub/chatForm/ChatFormInputs.js";
import ChatFormNavigation from "@components/hub/chatForm/ChatFormNavigation.js";
import api from "@api/api";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
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
import { KEY_CODES } from "@utils/global/keyCodes";
import { setClicked } from "@store/values/ContextMenu";
import { useCallback, useEffect, useRef, useState } from "react";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "@styles/hub/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();

  const isUserLogin = useSelector(getUserIsLoggedIn);
  const isTabInFocus = useSelector(getIsTabInFocus);

  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const isGroup = selectedConversation?.type === "g";

  const [tab, setTab] = useState("apps");

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
    <section className="flex flex-col flex-grow">
      {selectedCID ? (
        <>
          <ChatFormHeader closeFormFunc={closeForm} />
          {isGroup ? <ChatFormNavigation changeTabFunc={setTab} /> : null}
          {tab === "chat" ? (
            <>
              <ChatFormContent
                chatMessagesBlockRef={chatMessagesBlock}
                files={files}
                setFiles={setFiles}
              />
              <ChatFormInputs
                chatMessagesBlockRef={chatMessagesBlock}
                files={files}
                setFiles={setFiles}
              />
            </>
          ) : (
            <ChatFormEditor />
          )}
        </>
      ) : (
        <p className="mt-auto mb-auto text-center font-light text-[58px] !text-[#b0b0b0]">
          Select a conversation to start chatting
        </p>
      )}
    </section>
  );
}
