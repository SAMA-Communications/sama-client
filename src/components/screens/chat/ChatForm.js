import React, { useEffect, useMemo, useRef } from "react";
import {
  VscClose,
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
  VscTrash,
} from "react-icons/vsc";
import ChatMessage from "../../generic/ChatMessage.js";
import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import { participantsSelectors } from "../../../store/Participants.js";
import { removeChat } from "../../../store/Conversations";
import { setConversation } from "../../../store/CurrentConversation";
import { setMessages, addMessage } from "../../../store/Messages";
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

  const conversation = useSelector((state) => state.conversation.value);
  const allParticipants = useSelector(participantsSelectors.selectEntities);
  const participants = useMemo(() => {
    let arrayParticipants = {};
    for (const id in allParticipants) {
      if (Object.hasOwnProperty.call(allParticipants, id)) {
        const participant = allParticipants[id];
        arrayParticipants[id] = participant.login;
      }
    }
    return arrayParticipants;
  }, [allParticipants]);

  const messageInputEl = useRef(null);
  const messages = useSelector((state) => state.messages.value);

  useEffect(() => {
    if (!conversation._id) {
      return;
    }
    api.messageList({ cid: conversation._id, limit: 10 }).then((arr) => {
      dispatch(setMessages(arr));
    });
  }, [url]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageInputEl.current.value.trim();
    if (text.length > 0) {
      const response = await api.messageCreate({
        text,
        chatId: conversation._id,
      });
      if (response.mid) {
        const msg = {
          _id: response.server_mid,
          body: text,
          cid: conversation._id,
          from: userInfo._id,
          t: response.t,
        };
        dispatch(addMessage(msg));
      }
      messageInputEl.current.value = "";
    }
  };

  const deleteChat = async () => {
    const isConfirm = window.confirm(`Do you want to delete this chat?`);
    if (isConfirm) {
      try {
        await api.conversationDelete({ cid: conversation._id });
        dispatch(removeChat(conversation._id));
        navigate("/main");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <section className="chat-form">
      {!conversation._id ? (
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
              <p>{conversation.name}</p>
              <div className="chat-recipient-status hide">
                <span>|</span>
                <p>typing...</p>
              </div>
            </div>
            <div className="chat-delete-btn" onClick={deleteChat}>
              <VscTrash />
            </div>
            <div
              className="chat-close-btn"
              onClick={() => {
                dispatch(setConversation({}));
                navigate("/main");
              }}
            >
              <VscClose />
            </div>
          </div>
          <div className="chat-form-main">
            {!messages.length ? (
              <div className="chat-empty">Chat is empty..</div>
            ) : (
              <div className="chat-messages">
                {messages.map((d) => (
                  <ChatMessage
                    key={d._id}
                    fromId={d.from}
                    userId={userInfo._id}
                    text={d.body}
                    uName={participants[d.from]}
                  />
                ))}
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
