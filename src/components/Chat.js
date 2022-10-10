import React, { useState, useEffect, useRef, useMemo } from "react";
import api from "../api/api";

import "../styles/Chat.css";

export default function Main() {
  const messageInputEl = useRef(null);

  const [messages, _setMessages] = useState([]);
  const messagesRef = useRef(messages);
  const setMessages = (data) => {
    messagesRef.current = data;
    _setMessages(data);
  };

  const listItems = useMemo(() => {
    return messages.map((d) => <li key={d}>{d}</li>);
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    // socket.send(JSON.stringify({}));
    const text = messageInputEl.current.value.trim();
    if (text.length > 0) {
      api.chat.send(text);

      messageInputEl.current.value = "";
    }
  };

  const sendLogout = async (data) => {
    const response = await api.logout(data);
    if (!response.status) {
      document.location.reload(true);
    } else {
      alert(response.message);
    }
  };
  const sendDeleteAccount = async (data) => {
    const response = await api.delete(data);
    if (!response.status) {
      document.location.reload(true);
    } else {
      alert(response.message);
    }
  };

  return (
    <div className="App">
      <div className="control-panel">
        <div>
          <p className="chat-logo">Chat</p>
        </div>
        <div>
          <div className="control-btn">
            <a onClick={sendLogout}>Loguot</a>
          </div>
          <div className="control-btn">
            <a onClick={sendDeleteAccount}>Delete account</a>
          </div>
        </div>
      </div>
      <ul id="messages">{listItems}</ul>
      <form id="form" action="">
        <input id="inputMessage" ref={messageInputEl} autoComplete="off" />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
}
