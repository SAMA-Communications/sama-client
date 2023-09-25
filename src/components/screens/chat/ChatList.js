import React, { useMemo, useState } from "react";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import ChatBox from "../../generic/ChatBox.js";
import MiniLogo from "./../../static/MiniLogo.js";
import { Link, NavLink } from "react-router-dom";
import {
  addUsers,
  selectParticipantsEntities,
} from "../../../store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
  upsertChat,
} from "../../../store/Conversations.js";
import { history } from "../../../_helpers/history.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { setUserIsLoggedIn } from "../../../store/UserIsLoggedIn .js";
import { updateNetworkState } from "../../../store/NetworkState.js";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/pages/ChatList.css";

import { ReactComponent as UserIcon } from "./../../../assets/icons/chatList/UserIcon.svg";
import { ReactComponent as IconSun } from "./../../../assets/icons/ThemeSun.svg";
import { ReactComponent as IconMoon } from "./../../../assets/icons/ThemeMoon.svg";
import { ReactComponent as CreateChatButton } from "./../../../assets/icons/chatList/CreateChatButton.svg";
import { ReactComponent as LogoutBtn } from "./../../../assets/icons/chatList/LogoutBtn.svg";

export default function ChatList() {
  const dispatch = useDispatch();

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  // vv  API Listeners  vv //
  api.onConversationCreateListener = (chat) => {
    dispatch(
      upsertChat({ ...chat, unread_messages_count: 0, messagesIds: [] })
    );
    api
      .getParticipantsByCids([chat._id])
      .then((users) => dispatch(addUsers(users)));
  };
  // ʌʌ  API Listeners  ʌʌ //

  // vv  Send logout block  vv //
  const sendLogout = async () => {
    navigator.serviceWorker.ready
      .then((reg) =>
        reg.pushManager.getSubscription().then((sub) =>
          sub.unsubscribe().then(async () => {
            await api.pushSubscriptionDelete();
            await api.userLogout();
            dispatch({ type: "RESET_STORE" });
            dispatch(updateNetworkState(true));
          })
        )
      )
      .catch(async (err) => {
        console.error(err);
        await api.userLogout();
        dispatch(setUserIsLoggedIn(false));
      });
    localStorage.removeItem("sessionId");
  };
  // ʌʌ  Send logout block  ʌʌ //

  // vv  Change theme block  vv //
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
  // ʌʌ  Change theme block  ʌʌ //

  // vv  Chat list block  vv //
  const chatsList = useMemo(() => {
    let list = [];
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
  // ʌʌ  Chat list block  ʌʌ //

  return (
    <aside>
      <div className="nav-navigate-bar">
        <div className="nav-logo">
          <MiniLogo />
        </div>
        <div className="nav-btns fcc">
          {changeThemeBtn}
          <div
            className="nav-create-btn"
            onClick={() => history.navigate("/main/search")}
          >
            <CreateChatButton />
          </div>
          <div className="nav-navigate-slice">
            <span>|</span>
          </div>

          <div className="nav-logout-btn">
            <Link to={"/login"} onClick={sendLogout} className="logout-btn fcc">
              <LogoutBtn />
            </Link>
          </div>
        </div>
      </div>
      <div className="user-box">
        <div className="user-photo">
          {!userInfo ? <UserIcon /> : userInfo?.login.slice(0, 2).toUpperCase()}
        </div>
        <div className="user-info">
          <p className="user-info-name">{userInfo?.login}</p>
        </div>
      </div>
      <div className="chat-list">
        {!Object.keys(conversations).length ? (
          <p className="empty-list">You haven't started any chats yet.</p>
        ) : (
          chatsList
        )}
      </div>
    </aside>
  );
}
