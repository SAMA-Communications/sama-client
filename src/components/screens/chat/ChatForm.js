import React, { useEffect, useMemo, useRef } from "react";
import {
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
  VscTrash,
} from "react-icons/vsc";
import ChatMessage from "../../generic/ChatMessage.js";
import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import { selectParticipantsEntities } from "../../../store/Participants.js";
import { removeChat } from "../../../store/Conversations";
import { setSelectedConversation } from "../../../store/SelectedConversation";
import {
  addMessage,
  removeAllMessages,
  selectAllMessages,
  setMessages,
  updateMessage,
} from "../../../store/Messages";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/chat/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useLocation();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const selectedConversation = useSelector(
    (state) => state.selectedConversation.value
  );
  const participants = useSelector(selectParticipantsEntities);

  const messageInputEl = useRef(null);
  const messages = useSelector(selectAllMessages);

  useEffect(() => {
    if (selectedConversation._id) {
      api
        .messageList({ cid: selectedConversation._id, limit: 20 })
        .then((arr) => {
          dispatch(setMessages(arr));
        });
    }
  }, [url]);

  const scrollChatToBottom = () => {
    const chatMessagesEl = document.getElementById("chat-messages");
    if (chatMessagesEl) {
      chatMessagesEl.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    function generateMID(uId) {
      let result = "WWW:";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (const i in characters) {
        if (Math.random() % 2) result += characters[i];
      }
      return result + ":" + uId;
    }

    const text = messageInputEl.current.value.trim();
    if (text.length > 0) {
      const mid = generateMID(userInfo._id);
      let msg = {
        _id: mid,
        body: text,
        cid: selectedConversation._id,
        from: userInfo._id,
        isSending: true,
        t: Date.now(),
      };
      messageInputEl.current.value = "";
      dispatch(addMessage(msg));

      const response = await api.messageCreate({
        mid,
        text,
        chatId: selectedConversation._id,
      });

      scrollChatToBottom();
      if (response.mid === mid) {
        msg = {
          _id: response.server_mid,
          isSending: "success",
          t: response.t,
        };
        dispatch(updateMessage({ id: mid, changes: msg }));
      }
    }
  };

  const deleteChat = async () => {
    const isConfirm = window.confirm(`Do you want to delete this chat?`);
    if (isConfirm) {
      try {
        await api.conversationDelete({ cid: selectedConversation._id });
        dispatch(setSelectedConversation({}));
        dispatch(removeAllMessages());
        dispatch(removeChat(selectedConversation._id));
        navigate("/main");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  window.onkeydown = function (event) {
    if (event.keyCode === 27) {
      dispatch(setSelectedConversation({}));
      dispatch(removeAllMessages());
      navigate("/main");
    }
  };

  const messagesList = useMemo(
    () =>
      messages.map((m) => (
        <ChatMessage
          key={m._id}
          fromId={m.from}
          userId={userInfo._id}
          text={m.body}
          uName={participants[m.from]?.login}
          isSending={m.isSending}
        />
      )),
    [messages]
  );

  return (
    <section className="chat-form">
      {!selectedConversation._id ? (
        <div className="chat-form-loading">
          <VscFileSymlinkDirectory />
          <p>Select your chat ...</p>
        </div>
      ) : (
        <div className="chat-form-messaging">
          <div className="chat-messaging-info">
            <div className="chat-recipient-photo">
              <VscDeviceCamera />
            </div>
            <div className="chat-recipient-info">
              <p>{selectedConversation.name}</p>
              <div className="chat-recipient-status hide">
                <span>|</span>
                <p>typing...</p>
              </div>
            </div>
            <div className="chat-delete-btn" onClick={deleteChat}>
              <VscTrash />
            </div>
          </div>
          <div className="chat-form-main">
            {!Object.keys(messages).length ? (
              <div className="chat-empty">Chat is empty..</div>
            ) : (
              <div className="chat-messages" id="chat-messages">
                {messagesList}
              </div>
            )}
          </div>
          <form id="chat-form-send" action="">
            <input
              id="inputMessage"
              ref={messageInputEl}
              autoComplete="off"
              placeholder="> Write your message..."
            />
            <button onClick={sendMessage}>
              <p>Send</p>
              <VscRocket />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
