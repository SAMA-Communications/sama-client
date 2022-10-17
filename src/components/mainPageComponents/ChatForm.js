import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  VscClose,
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
} from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import jwtDecode from "jwt-decode";

import "../../styles/ChatForm.css";

export default function ChatForm() {
  const navigate = useNavigate();
  const url = useLocation();
  const sessionId = localStorage.getItem("sessionId");
  const userInfo = sessionId ? jwtDecode(sessionId) : null;

  const chatId = useMemo(() => {
    return url.hash ? url.hash.slice(1) : null;
  }, [url]);

  const messageInputEl = useRef(null);
  const [messages, setMessages] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const listMessages = api
      .messageList({ cid: chatId, limit: 10 })
      .then((arr) => {
        console.log(arr);
        setMessages(arr);
      });
    console.log(messages);
  }, [chatId, update]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageInputEl.current.value.trim();
    if (text.length > 0) {
      await api.messageCreate({ text, chatId });
      messageInputEl.current.value = "";
      update ? setUpdate(false) : setUpdate(true);
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
                  <p
                    key={d.id}
                    className={
                      d.from === userInfo._id.toString() ? "my-message" : ""
                    }
                  >
                    {d.body}
                  </p>
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
