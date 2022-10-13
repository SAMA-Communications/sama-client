import React, { useMemo, useState } from "react";
import {
  VscClose,
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
} from "react-icons/vsc";
import { useLocation, useNavigate } from "react-router-dom";

import "../../styles/ChatForm.css";

export default function ChatForm() {
  const navigate = useNavigate();
  const url = useLocation();

  const chatId = useMemo(() => {
    return url.hash ? url.hash.slice(1) : null;
  }, [url]);

  // const messageInputEl = useRef(null);

  // const [messages, _setMessages] = useState([]);
  // const messagesRef = useRef(messages);
  // const setMessages = (data) => {
  //   messagesRef.current = data;
  //   _setMessages(data);
  // };

  // const listItems = useMemo(() => {
  //   return messages.map((d) => <li key={d}>{d}</li>);
  // }, [messages]);

  // const sendMessage = (event) => {
  //   event.preventDefault();

  //   // socket.send(JSON.stringify({}));
  //   const text = messageInputEl.current.value.trim();
  //   if (text.length > 0) {
  //     api.messageCreate(text);

  //     messageInputEl.current.value = "";
  //   }
  // };

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
            <div className="chat-empty">Chat is empty..</div>
          </div>
          <form id="chat-form-send" action="">
            <input
              id="inputMessage"
              // ref={}
              autoComplete="off"
              placeholder="> Write your message..."
            />
            <button>
              <p>Send</p>
              <VscRocket />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
