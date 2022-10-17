import React, { useMemo, useRef, useState } from "react";
import {
  VscClose,
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
} from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";

import "../../styles/ChatForm.css";

export default function ChatForm() {
  const navigate = useNavigate();
  const url = useLocation();

  const chatId = useMemo(() => {
    return url.hash ? url.hash.slice(1) : null;
  }, [url]);

  const messageInputEl = useRef(null);
  const [messages, setMessages] = useState([]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageInputEl.current.value.trim();
    if (text.length > 0) {
      const message = await api.messageCreate({ text, chatId });
      setMessages([...messages, message]);
      messageInputEl.current.value = "";
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
                  <p key={d.mid}>{d.mid.slice(0, 8)}</p>
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
