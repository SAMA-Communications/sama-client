import ChatList from "./screens/chat/ChatList";
import MiniLogo from "./static/MiniLogo.js";
import React, { useMemo, useState } from "react";
import api from "../api/api";
import urlBase64ToUint8Array from "../api/base64_to_uint8Array.js";
import { Link } from "react-router-dom";
import { changeOpacity } from "../styles/animations/animationBlocks";
import { motion as m } from "framer-motion";

import "../styles/Main.css";

import { ReactComponent as IconSun } from "./../assets/icons/ThemeSun.svg";
import { ReactComponent as IconMoon } from "./../assets/icons/ThemeMoon.svg";
const ChatForm = React.lazy(() => import("./screens/chat/ChatForm"));

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) =>
      reg.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.REACT_APP_PUBLIC_VAPID_KEY
          ),
        })
        .then((sub) =>
          //TODO: optimize ?btoa?
          api.pushSubscriptionCreate({
            web_endpoint: sub.endpoint,
            web_key_auth: btoa(
              String.fromCharCode(...new Uint8Array(sub.getKey("auth")))
            ),
            web_key_p256dh: btoa(
              String.fromCharCode(...new Uint8Array(sub.getKey("p256dh")))
            ),
          })
        )
    )
    .catch((err) => console.log(err));
}

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
        <IconSun />
      </div>
    ) : (
      <div className="change-themes" onClick={changeToDarkTheme}>
        <IconMoon />
      </div>
    );
  }, [currentTheme]);

  return (
    <div>
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
        <ChatList />
        <ChatForm />
      </main>
    </div>
  );
}
