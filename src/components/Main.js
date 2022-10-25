import ChatForm from "./screens/chat/ChatForm";
import ChatList from "./screens/chat/ChatList";
import React from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { VscCommentDiscussion } from "react-icons/vsc";

import "../styles/Main.css";

export default function Main() {
  const sendLogout = async () => {
    try {
      await api.userLogout();
    } catch (error) {
      alert(error.message);
    }
    localStorage.removeItem("sessionId");
  };

  return (
    <div>
      <nav>
        <div className="chat-logo">
          <VscCommentDiscussion />
          <p>SAMA</p>
        </div>
        <div className="chat-logout-btn">
          <Link to={"/login"} onClick={sendLogout} className="logout-btn">
            Logout
          </Link>
        </div>
      </nav>
      <main className="Main">
        <ChatList />
        <ChatForm />
      </main>
    </div>
  );
}
