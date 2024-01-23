import ChatBox from "@generic/chatComponents/ChatBox.js";
import MiniLogo from "@static/MiniLogo.js";
import React, { useMemo, useState } from "react";
import api from "@api/api.js";
import jwtDecode from "jwt-decode";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { selectParticipantsEntities } from "@store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
} from "@store/Conversations.js";
import { setSelectedConversation } from "@store/SelectedConversation.js";
import { setUserIsLoggedIn } from "@store/UserIsLoggedIn.js";
import { updateNetworkState } from "@store/NetworkState.js";
import { useSelector, useDispatch } from "react-redux";

import "@styles/pages/chat/ChatList.css";

import { ReactComponent as CreateChatButton } from "@icons/chatList/CreateChatButton.svg";
import { ReactComponent as IconMoon } from "@icons/ThemeMoon.svg";
import { ReactComponent as IconSun } from "@icons/ThemeSun.svg";
import { ReactComponent as LogoutBtn } from "@icons/chatList/LogoutBtn.svg";
import { ReactComponent as MoreOptions } from "@icons/chatList/MoreOptions.svg";

export default function ChatList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;
  const currentUser = useMemo(
    () => (userInfo ? participants[userInfo._id] : {}),
    [userInfo, participants]
  );

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

  const chatsList = useMemo(() => {
    const list = [];
    for (const obj of conversations) {
      const chatName = !obj.name
        ? obj.owner_id === userInfo?._id
          ? participants[obj.opponent_id]?.login
          : participants[obj.owner_id]?.login
        : obj.name;

      list.push(
        <NavLink
          to={`/main/#${obj._id}`}
          key={obj._id}
          className={activeConv === obj._id ? "selected" : ""}
          onClick={async () => {
            dispatch(setSelectedConversation({ id: obj._id }));
            if (obj.unread_messages_count > 0) {
              dispatch(clearCountOfUnreadMessages(obj._id));
              api.markConversationAsRead({ cid: obj._id });
            }
          }}
        >
          <ChatBox
            chatName={chatName}
            timeOfLastUpdate={obj.updated_at}
            countOfNewMessages={obj.unread_messages_count}
            chatType={obj.type}
            lastMessage={obj.last_message}
            uId={userInfo?._id}
          />
        </NavLink>
      );
    }
    return list;
  }, [conversations, participants, activeConv]);

  const userLetters = useMemo(() => {
    if (!currentUser || !Object.keys(currentUser).length) {
      return null;
    }

    const { first_name, last_name, login } = currentUser;
    if (first_name) {
      return last_name
        ? first_name.slice(0, 1) + last_name.slice(0, 1)
        : first_name.slice(0, 1);
    }

    return login.slice(0, 2).toUpperCase();
  }, [currentUser]);

  const userName = useMemo(() => {
    if (!currentUser || !Object.keys(currentUser).length) {
      return null;
    }

    const { first_name, last_name, login } = currentUser;
    if (first_name) {
      return last_name ? first_name + " " + last_name : first_name;
    }

    return login;
  }, [currentUser]);

  return (
    <section>
      <div className="nav-navigate-bar">
        <div className="nav-logo">
          <MiniLogo />
        </div>
        <div className="nav-btns fcc">
          {changeThemeBtn}
          <div
            className="nav-create-btn"
            onClick={() => navigate(pathname + hash + "/search")}
          >
            <CreateChatButton />
          </div>
          <div className="nav-navigate-slice">
            <span>|</span>
          </div>

          <div className="nav-logout-btn"></div>
        </div>
      </div>
      <div className="user-box">
        <div className="user-photo">{userLetters?.toUpperCase()}</div>
        <div className="user-info">
          <p className="user-info-name">{userName}</p>
        </div>
        <div
          className="user-options"
          onClick={() => navigate(pathname + hash + "/user")}
        >
          <MoreOptions />
        </div>
      </div>
      <div className="chat-list">
        {!Object.keys(conversations).length ? (
          <p className="empty-list">You haven't started any chats yet.</p>
        ) : (
          chatsList
        )}
      </div>
    </section>
  );
}
