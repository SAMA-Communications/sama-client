import React, { useState, useRef, useMemo } from "react";
import api from "../api/api";
import { VscCommentDiscussion } from "react-icons/vsc";

import "../styles/Main.css";
import ChatForm from "./mainPageComponents/ChatForm";
import ChatList from "./mainPageComponents/ChatList";

export default function Main() {
  const sendLogout = async (data) => {
    const response = await api.userLogout(data);
    localStorage.removeItem("token");
    if (response.status) {
      alert(response.message);
    }
    document.location.reload(true);
  };

  return (
    <div>
      <nav>
        <div className="chat-logo">
          <VscCommentDiscussion />
          <p>SAMA</p>
        </div>
        <div className="chat-logout-btn">
          <a onClick={sendLogout}>Logout</a>
        </div>
      </nav>
      <main className="Main">
        <ChatList />
        <ChatForm />
      </main>
    </div>
  );
}
