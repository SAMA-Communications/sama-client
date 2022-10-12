import React, { useState } from "react";
import {
  VscClose,
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
} from "react-icons/vsc";

import "../../styles/ChatForm.css";

export default function ChatForm() {
  const [chatId, setChatId] = useState(false);

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
              <p>UserName</p>
              <div className="chat-recipient-status">
                <span>|</span>
                <p>typing...</p>
              </div>
            </div>
            <div className="chat-close-btn" onClick={() => setChatId(false)}>
              <VscClose />
            </div>
          </div>
          <div className="chat-form-main">List Message</div>
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
