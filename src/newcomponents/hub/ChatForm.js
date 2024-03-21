import ChatFormContent from "@newcomponents/hub/chatForm/ChatFormContent.js";
import ChatFormHeader from "@newcomponents/hub/chatForm/ChatFormHeader.js";
import ChatFormInputs from "@newcomponents/hub/chatForm/ChatFormInputs.js";
import api from "@api/api";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
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
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "@newstyles/hub/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();

  const isUserLogin = useSelector(getUserIsLoggedIn);

  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const chatMessagesBlock = useRef();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const { pathname, hash } = location;

    const closeForm = (event) => {
      if (event && event.stopPropagation) {
        event.stopPropagation();
      }

      if (!selectedCID) {
        return;
      }

      dispatch(clearSelectedConversation());
      api.unsubscribeFromUserActivity({});
      removeAndNavigateLastSection(pathname + hash);
    };

    const keydownHandler = ({ keyCode }) =>
      void (keyCode === KEY_CODES.ESCAPE && closeForm());

    document.addEventListener("swiped-left", closeForm);
    document.addEventListener("swiped-right", closeForm);
    window.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("swiped-left", closeForm);
      document.removeEventListener("swiped-right", closeForm);
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [location]);

  useEffect(() => {
    const { hash } = location;

    if (!hash || hash.split("/")[0].slice(1) === selectedCID || !isUserLogin) {
      return;
    }

    dispatch(setSelectedConversation({ id: hash.slice(1).split("/")[0] }));
  }, [location, isUserLogin]);

  useLayoutEffect(() => {
    if (!selectedCID) {
      return;
    }

    if (conversations[selectedCID].unread_messages_count > 0) {
      dispatch(clearCountOfUnreadMessages(selectedCID));
      api.markConversationAsRead({ cid: selectedCID });
    }

    files.length && setFiles([]);
  }, [selectedCID, conversations]);

  return (
    <section className={`chat-form__container ${selectedCID ? "" : "fcc"}`}>
      {selectedCID ? (
        <>
          <ChatFormHeader />
          <ChatFormContent scrollRef={chatMessagesBlock} />
          <ChatFormInputs
            chatMessagesBlockRef={chatMessagesBlock}
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
