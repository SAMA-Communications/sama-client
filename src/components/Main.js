import React from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { VscCommentDiscussion } from "react-icons/vsc";

import "../styles/Main.css";

import ChatForm from "./mainPageComponents/ChatForm";
import ChatList from "./mainPageComponents/ChatList";

export default function Main() {
  const sendLogout = async () => {
    try {
      await api.userLogout();
    } catch (error) {
      alert(error.message);
    }
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
