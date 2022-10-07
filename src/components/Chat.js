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

  return (
    <div className="App">
      <ul id="messages">{listItems}</ul>
      <form id="form" action="">
        <input id="inputMessage" ref={messageInputEl} autoComplete="off" />
        <button onClick={sendMessage}>Send</button>
      </form>
    </div>
  );
}
