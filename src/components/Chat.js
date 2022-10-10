import React, { useState, useRef, useMemo, useEffect } from "react";
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
      api.messageCreate(text);

      messageInputEl.current.value = "";
    }
  };

  const sendLogout = async (data) => {
    const response = await api.userLogout(data);
    //тимчасово
    localStorage.removeItem("conversationId");
    if (!response.status) {
      document.location.reload(true);
    } else {
      alert(response.message);
    }
  };
  const sendDeleteAccount = async (data) => {
    const response = await api.userDelete(data);
    //тимчасово
    localStorage.removeItem("conversationId");
    if (!response.status) {
      document.location.reload(true);
    } else {
      alert(response.message);
    }
  };

  //  fix it when create conversation page mustn`t reload
  const [isConversationCreate, setIsConversationCreate] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("conversationId")) setIsConversationCreate(true);
  }, []);

  const createConversation = async (data) => {
    localStorage.setItem("conversationId", Math.floor(Math.random() * 10001));
    setIsConversationCreate(true);
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
      {isConversationCreate ? (
        <form id="messageForm" action="">
          <input
            id="inputMessage"
            ref={messageInputEl}
            autoComplete="off"
            placeholder="Message"
          />
          <button onClick={sendMessage}>Send</button>
        </form>
      ) : (
        <form id="createChatForm" action="">
          <input
            id="inputLogin"
            ref={messageInputEl}
            autoComplete="off"
            placeholder="User login"
          />
          <button onClick={createConversation}>Create chat</button>
        </form>
      )}
    </div>
  );
}
