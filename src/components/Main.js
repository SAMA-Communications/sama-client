import ChatList from "./screens/chat/ChatList";
import MiniLogo from "./static/MiniLogo.js";
import React, { useMemo, useRef, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { changeOpacity } from "../styles/animations/animationBlocks";
import { motion as m } from "framer-motion";

import "../styles/Main.css";

import { ReactComponent as IconSun } from "./../assets/icons/ThemeSun.svg";
import { ReactComponent as CloseChatList } from "./../assets/icons/CloseChatList.svg";
import { ReactComponent as IconMoon } from "./../assets/icons/ThemeMoon.svg";
const ChatForm = React.lazy(() => import("./screens/chat/ChatForm"));

export default function Main() {
  const [asideRef, chatFormBgRef] = [useRef(null), useRef(null)];

  const sendLogout = async () => {
    navigator.serviceWorker.ready
      .then((reg) =>
        reg.pushManager.getSubscription().then((sub) =>
          sub.unsubscribe().then(async () => {
            await api.pushSubscriptionDelete();
            await api.userLogout();
          })
        )
      )
      .catch(async (err) => {
        console.error(err);
        await api.userLogout();
      });
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
        <IconSun />
      </div>
    ) : (
      <div className="change-themes" onClick={changeToDarkTheme}>
        <IconMoon />
      </div>
    );
  }, [currentTheme]);

  const closeChatList = () => {
    asideRef.current.style.display = "none";
    chatFormBgRef.current.style.display = "none";
  };

  return (
    <div>
      <div ref={chatFormBgRef} className="chat-menu-bg" onClick={closeChatList}>
        <CloseChatList />
      </div>
      <nav>
        <div className="nav-logo">
          <MiniLogo />
        </div>
        <m.div
          variants={changeOpacity(0.1, 1, 0, 0.25)}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="nav-navigate-bar"
        >
          {changeThemeBtn}
          <div className="nav-navigate-slice">
            <span>|</span>
          </div>
          <div className="nav-logout-btn">
            <Link to={"/login"} onClick={sendLogout} className="logout-btn">
              Logout
            </Link>
          </div>
        </m.div>
      </nav>
      <main>
        <ChatList asideRef={asideRef} chatFormBgRef={chatFormBgRef} />
        <ChatForm asideRef={asideRef} chatFormBgRef={chatFormBgRef} />
      </main>
    </div>
  );
}
