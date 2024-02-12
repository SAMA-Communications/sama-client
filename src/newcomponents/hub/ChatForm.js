import ChatFormHeader from "@newcomponents/hub/chatForm/ChatFormHeader.js";
import ChatFormInputs from "@newcomponents/hub/chatForm/ChatFormInputs.js";
import ChatFormContent from "@newcomponents/hub/chatForm/ChatFormContent.js";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import api from "@api/api";
import { getUserIsLoggedIn } from "@store/values/UserIsLoggedIn.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { setSelectedConversation } from "@store/values/SelectedConversation";
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
  const messageInputEl = useRef(null);
  const [files, setFiles] = useState([]);

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

  window.onresize = function () {
    if (messageInputEl.current) {
      messageInputEl.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  return (
    <section className={`chat-form__container ${selectedCID ? "" : "fcc"}`}>
      {selectedCID ? (
        <>
          <ChatFormHeader />
          <ChatFormContent scrollRef={chatMessagesBlock} />
          <ChatFormInputs
            chatMessagesBlockRef={chatMessagesBlock}
            messageInputEl={messageInputEl}
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
