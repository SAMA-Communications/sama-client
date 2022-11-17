import React, { useMemo, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { VscCommentDiscussion } from "react-icons/vsc";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";

import "../styles/Main.css";
import ChatList from "./screens/chat/ChatList";
const ChatForm = React.lazy(() => import("./screens/chat/ChatForm"));

export default function Main() {
  const sendLogout = async () => {
    try {
      await api.userLogout();
    } catch (error) {
      alert(error.message);
    }
    localStorage.removeItem("sessionId");
  };

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );
  const changeToDarkTheme = () => {
    localStorage.setItem("theme", "dark");
    document.body.classList.add("dark-theme");
    setCurrentTheme("dark");
  };
  const changeToLightTheme = () => {
    localStorage.setItem("theme", "light");
    document.body.classList.remove("dark-theme");
    setCurrentTheme("light");
  };

  const changeThemeBtn = useMemo(() => {
    return currentTheme === "dark" ? (
      <div className="change-themes" onClick={changeToLightTheme}>
        <IoSunnyOutline />
      </div>
    ) : (
      <div className="change-themes" onClick={changeToDarkTheme}>
        <IoMoonOutline />
      </div>
    );
  }, [currentTheme]);

  return (
    <div>
      <nav>
        <div className="chat-logo">
          <VscCommentDiscussion />
          <p>SAMA</p>
        </div>
        <div className="chat-navigate-bar">
          {changeThemeBtn}
          <div className="chat-navigate-slice">
            <span>|</span>
          </div>
          <div className="chat-logout-btn">
            <Link to={"/login"} onClick={sendLogout} className="logout-btn">
              Logout
            </Link>
          </div>
        </div>
      </nav>
      <main className="Main">
        <ChatList />
        <ChatForm />
      </main>
    </div>
  );
}
