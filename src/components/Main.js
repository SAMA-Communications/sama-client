import ChatList from "./screens/chat/ChatList";
import React, { useMemo, useState } from "react";
import api from "../api/api";
import MiniLogo from "./static/MiniLogo.js";
import { Link } from "react-router-dom";
import { changeOpacity } from "../styles/animations/animationBlocks";
import { motion as m } from "framer-motion";

import "../styles/Main.css";

import { ReactComponent as IconSun } from "./../assets/icons/ThemeSun.svg";
import { ReactComponent as IconMoon } from "./../assets/icons/ThemeMoon.svg";
const ChatForm = React.lazy(() => import("./screens/chat/ChatForm"));

function urlBase64ToUint8Array(base64String) {
  var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  var base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ("serviceWorker" in navigator) {
  const publicVapidKey =
    "BEDl13AheorvsFF1em9iDmcVVtNe96dzOJac0eZven3TqtreoXvsSfZdPG1xnELHnLVaKXQEzaqReisx9ZKbvsM";
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => {
      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
      };
      reg.pushManager
        .subscribe(options)
        .then((sub) => api.pushSubscriptionCreate(sub));
    })
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
