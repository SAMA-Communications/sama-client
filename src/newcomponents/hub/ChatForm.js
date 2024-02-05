import ChatFormHeader from "@newcomponents/hub/chatForm/ChatFormHeader.js";
import ChatFormInputs from "@newcomponents/hub/chatForm/ChatFormInputs.js";
import ChatFormContent from "@newcomponents/hub/chatForm/ChatFormContent.js";
import NoChatSelected from "@static/NoChatSelected.js";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import api from "@api/api";
import { getUserIsLoggedIn } from "@store/UserIsLoggedIn.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectConversationsEntities,
} from "@store/Conversations";
import {
  clearSelectedConversation,
  setSelectedConversation,
} from "@store/SelectedConversation";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "@newstyles/hub/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
  }, [selectedCID, conversations[selectedCID]]);

  const closeForm = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    dispatch(clearSelectedConversation());
    api.unsubscribeFromUserActivity({});
    navigate("/main");
  };

  document.addEventListener("swiped-left", closeForm);
  document.addEventListener("swiped-right", closeForm);
  window.onkeydown = function (event) {
    event.keyCode === 27 && closeForm();
  };
  window.onresize = function (event) {
    if (messageInputEl.current) {
      messageInputEl.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  if (!selectedCID) {
    return (
      <section className="chat-form">
        <NoChatSelected />
      </section>
    );
  }

  // if (obj.unread_messages_count > 0) {
  //   dispatch(clearCountOfUnreadMessages(obj._id));
  //   api.markConversationAsRead({ cid: obj._id });
  // }

  return (
    <section className="chat-form">
      <ChatFormHeader closeForm={closeForm} />
      <ChatFormContent scrollRef={chatMessagesBlock} />
      <ChatFormInputs
        chatMessagesBlockRef={chatMessagesBlock}
        messageInputEl={messageInputEl}
        files={files}
        setFiles={setFiles}
      />
    </section>
  );
}
