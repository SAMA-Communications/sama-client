import React, { useEffect, useMemo, useRef } from "react";
import {
  VscClose,
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
  VscTrash,
} from "react-icons/vsc";
import api from "../../api/api";
import jwtDecode from "jwt-decode";
import UserMessage from "../generic/UserMessage.js";
import { removeChat } from "../../store/ChatList";
import { setArr, addMessage } from "../../store/MessageArray";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/mainPageComponents/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useLocation();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const chatId = useMemo(() => {
    return url.hash ? url.hash.slice(1) : null;
  }, [url]);

  const messageInputEl = useRef(null);
  const messages = useSelector((state) => state.messageArr.value);

  useEffect(() => {
    if (!chatId) {
      return;
    }
    api.messageList({ cid: chatId, limit: 10 }).then((arr) => {
      dispatch(setArr(arr));
    });
  }, [chatId]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageInputEl.current.value.trim();
    if (text.length > 0) {
      const response = await api.messageCreate({ text, chatId });
      if (response.mid) {
        const msg = {
          _id: response.mid,
          id: response.server_mid,
          body: text,
          cid: chatId,
          // deleted_for: []
          from: userInfo._id,
          // x: {
          //   param1: "value",
          //   param2: "value",
          // },
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
        await api.conversationDelete({ cid: chatId });
        dispatch(removeChat(chatId));
        navigate("/main");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <section className="chat-form">
      {!chatId ? (
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
              <p>{chatId}</p>
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
                  <UserMessage key={d.id} data={d} userInfo={userInfo} />
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
