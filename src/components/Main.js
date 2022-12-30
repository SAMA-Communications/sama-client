import ChatList from "./screens/chat/ChatList";
import React, { useMemo, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { motion as m } from "framer-motion";

import "../styles/Main.css";
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
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.5754 10.5754C12.5445 8.60625 15.2152 7.5 18 7.5C20.7848 7.5 23.4555 8.60625 25.4246 10.5754C27.3938 12.5445 28.5 15.2152 28.5 18C28.5 20.7848 27.3938 23.4555 25.4246 25.4246C23.4555 27.3938 20.7848 28.5 18 28.5C15.2152 28.5 12.5445 27.3938 10.5754 25.4246C8.60625 23.4555 7.5 20.7848 7.5 18C7.5 15.2152 8.60625 12.5445 10.5754 10.5754ZM18 9C15.6131 9 13.3239 9.94821 11.636 11.636C9.94821 13.3239 9 15.6131 9 18C9 20.3869 9.94821 22.6761 11.636 24.364C13.3239 26.0518 15.6131 27 18 27C20.3869 27 22.6761 26.0518 24.364 24.364C26.0518 22.6761 27 20.3869 27 18C27 15.6131 26.0518 13.3239 24.364 11.636C22.6761 9.94821 20.3869 9 18 9Z"
            fill="white"
          />
          <path
            d="M18 2C18.5523 2 19 2.44772 19 3V3.12C19 3.67228 18.5523 4.12 18 4.12C17.4477 4.12 17 3.67228 17 3.12V3C17 2.44772 17.4477 2 18 2ZM6.58289 6.58289C6.97342 6.19237 7.60658 6.19237 7.99711 6.58289L8.19211 6.77789C8.58263 7.16842 8.58263 7.80158 8.19211 8.19211C7.80158 8.58263 7.16842 8.58263 6.77789 8.19211L6.58289 7.99711C6.19237 7.60658 6.19237 6.97342 6.58289 6.58289ZM29.4171 6.58289C29.8076 6.97342 29.8076 7.60658 29.4171 7.99711L29.2221 8.19211C28.8316 8.58263 28.1984 8.58263 27.8079 8.19211C27.4174 7.80158 27.4174 7.16842 27.8079 6.77789L28.0029 6.58289C28.3934 6.19237 29.0266 6.19237 29.4171 6.58289ZM2 18C2 17.4477 2.44772 17 3 17H3.12C3.67228 17 4.12 17.4477 4.12 18C4.12 18.5523 3.67228 19 3.12 19H3C2.44772 19 2 18.5523 2 18ZM31.88 18C31.88 17.4477 32.3277 17 32.88 17H33C33.5523 17 34 17.4477 34 18C34 18.5523 33.5523 19 33 19H32.88C32.3277 19 31.88 18.5523 31.88 18ZM8.19211 27.8079C8.58263 28.1984 8.58263 28.8316 8.19211 29.2221L7.99711 29.4171C7.60658 29.8076 6.97342 29.8076 6.58289 29.4171C6.19237 29.0266 6.19237 28.3934 6.5829 28.0029L6.77789 27.8079C7.16842 27.4174 7.80159 27.4174 8.19211 27.8079ZM27.8079 27.8079C28.1984 27.4174 28.8316 27.4174 29.2221 27.8079L29.4171 28.0029C29.8076 28.3934 29.8076 29.0266 29.4171 29.4171C29.0266 29.8076 28.3934 29.8076 28.0029 29.4171L27.8079 29.2221C27.4174 28.8316 27.4174 28.1984 27.8079 27.8079ZM18 31.88C18.5523 31.88 19 32.3277 19 32.88V33C19 33.5523 18.5523 34 18 34C17.4477 34 17 33.5523 17 33V32.88C17 32.3277 17.4477 31.88 18 31.88Z"
            fill="white"
          />
        </svg>
      </div>
    ) : (
      <div className="change-themes" onClick={changeToDarkTheme}>
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.9244 2.90006C15.5488 3.48717 15.4761 4.46407 15.0535 5.43458L15.0531 5.43536C14.3453 7.0533 13.9556 8.82887 13.97 10.7061L13.9701 10.7079C13.9989 17.6792 19.7813 23.601 26.8555 23.8904L26.8559 23.8904C27.8986 23.9338 28.8967 23.8615 29.8659 23.688C30.4213 23.5867 30.9211 23.5778 31.3406 23.6757C31.7645 23.7745 32.1341 23.9909 32.3561 24.3542C32.5775 24.7165 32.6026 25.1438 32.5024 25.5654C32.403 25.9835 32.1753 26.4259 31.843 26.876C28.7769 31.0718 23.6694 33.7319 17.9634 33.4845L17.9631 33.4845C9.87094 33.1286 3.10478 26.6502 2.54631 18.6654C2.03516 11.5832 6.23649 5.40695 12.3608 2.82424C13.3346 2.41152 14.3156 2.32753 14.9244 2.90006ZM14.2394 3.62858C14.0947 3.49254 13.6511 3.36333 12.7502 3.74528L12.7493 3.74566C6.99378 6.17287 3.06518 11.9663 3.54376 18.5939L3.54384 18.5951C4.06565 26.06 10.4094 32.1513 18.007 32.4854C23.3704 32.7179 28.1624 30.2185 31.0363 26.285L31.0379 26.2829C31.3201 25.9008 31.4709 25.5804 31.5295 25.3342C31.5872 25.0911 31.5495 24.9522 31.5028 24.8757C31.4567 24.8002 31.3528 24.7054 31.1134 24.6495C30.8698 24.5927 30.5166 24.5857 30.0448 24.6718L30.0432 24.6721C29.0028 24.8585 27.9314 24.936 26.8146 24.8895C19.2191 24.5789 13.0017 18.2312 12.9701 10.7129C12.9546 8.69059 13.3749 6.77657 14.1368 5.03485C14.5239 4.14569 14.3688 3.75021 14.2394 3.62858Z"
            fill="white"
          />
        </svg>
      </div>
    );
  }, [currentTheme]);

  const exitOptions = { opacity: 0, transition: { duration: 0.25 } };
  const logoViewOptions = { strokeDashoffset: 0, opacity: 1 };

  return (
    <div>
      <nav>
        <div className="nav-logo">
          <svg
            width="49"
            height="48"
            viewBox="0 0 49 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <m.path
              initial={{
                strokeDasharray: "219px",
                strokeDashoffset: "219px",
              }}
              animate={{
                ...logoViewOptions,
                transition: { delay: 0.1, duration: 2.1 },
              }}
              exit={exitOptions}
              d="M36.7092 21.58V29.58C36.7092 30.1 36.6887 30.6 36.6275 31.08C36.1579 36.48 32.9117 39.16 26.9296 39.16H26.1129C25.6025 39.16 25.1125 39.4 24.8062 39.8L22.3562 43C21.2742 44.42 19.5183 44.42 18.4362 43L15.9862 39.8C15.8228 39.6136 15.6231 39.461 15.3987 39.3511C15.1744 39.2412 14.9299 39.1762 14.6796 39.16H13.8629C7.34999 39.16 4.08333 37.58 4.08333 29.58V21.58C4.08333 15.72 6.83958 12.54 12.3317 12.08C12.8217 12.02 13.3321 12 13.8629 12H26.9296C33.4425 12 36.7092 15.2 36.7092 21.58Z"
              stroke="var(--icon-stroke-color)"
            />
            <m.path
              initial={{
                strokeDasharray: "209px",
                strokeDashoffset: "209px",
              }}
              animate={{
                ...logoViewOptions,
                transition: { delay: 0.1, duration: 2.1 },
              }}
              exit={exitOptions}
              d="M44.8758 13.58V21.58C44.8758 27.46 42.1196 30.62 36.6275 31.08C36.6888 30.6 36.7092 30.1 36.7092 29.58V21.58C36.7092 15.2 33.4425 12 26.9296 12H13.8629C13.3321 12 12.8217 12.02 12.3317 12.08C12.8012 6.7 16.0475 4 22.0296 4H35.0963C41.6092 4 44.8758 7.2 44.8758 13.58V13.58Z"
              stroke="var(--icon-stroke-color)"
            />
            <m.path
              initial={{
                strokeDasharray: "19px",
                strokeDashoffset: "19px",
              }}
              animate={{
                ...logoViewOptions,
                transition: { delay: 0.1, duration: 2.1 },
              }}
              exit={exitOptions}
              d="M27.5523 26.5H27.5727M20.4065 26.5H20.4269M13.2606 26.5H13.281"
              stroke="var(--icon-stroke-color)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.1, duration: 1 } }}
            exit={exitOptions}
          >
            SAMA
          </m.p>
        </div>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1, duration: 1 } }}
          exit={exitOptions}
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
