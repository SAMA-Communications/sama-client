import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import ChatBox from "../../generic/ChatBox.js";
import UserSearch from "./UserSearch.js";
import { NavLink } from "react-router-dom";
import {
  selectParticipantsEntities,
  setUsers,
} from "../../../store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
  setChats,
} from "../../../store/Conversations.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";
import { motion as m } from "framer-motion";

import "../../../styles/chat/ChatList.css";
import { ReactComponent as UserIcon } from "./../../../assets/icons/chatList/UserIcon.svg";
import { ReactComponent as CreateChatButton } from "./../../../assets/icons/chatList/CreateChatButton.svg";

export default function ChatList() {
  const dispatch = useDispatch();
  const [isSearchForm, setIsSearchForm] = useState(false);

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  useEffect(() => {
    setTimeout(() => {
      api.conversationList({}).then((chats) => {
        if (!chats) {
          return;
        }
        dispatch(setChats(chats));
        api
          .getParticipantsByCids(chats.map((obj) => obj._id))
          .then((users) => dispatch(setUsers(users)));
      });
    }, 300);
  }, []);

  const chatsList = useMemo(() => {
    let list = [];
    for (const obj of conversations) {
      const chatName = !obj.name
        ? obj.owner_id === userInfo._id
          ? participants[obj.opponent_id]?.login
          : participants[obj.owner_id]?.login
        : obj.name;

      list.push(
        <NavLink
          to={`/main/#${obj.name ? obj._id : chatName}`}
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
            uId={userInfo._id}
          />
        </NavLink>
      );
    }
    return list;
  }, [conversations, participants, activeConv]);

  return (
    <aside>
      <m.div
        animate={{
          scale: [0, 1, 1],
          borderRadius: ["50px", "20px"],
          transition: { delay: 0.1, duration: 1.7 },
          transitionEnd: { borderRadius: "var(--border-main-radius)" },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        className="user-box"
      >
        <m.div
          initial={{ opacity: 0, padding: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.9, duration: 1 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="user-photo"
        >
          {!userInfo ? <UserIcon /> : userInfo?.login.slice(0, 2).toUpperCase()}
        </m.div>
        <m.div
          initial={{ opacity: 0, padding: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.9, duration: 1 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="user-info"
        >
          <p className="user-info-name">{userInfo?.login}</p>
          {/* <p className="user-info-status"></p> */}
        </m.div>
      </m.div>
      <m.div
        initial={{}}
        animate={{
          scale: [0, 1, 1],
          borderRadius: ["50px", "20px"],
          transition: { delay: 0.1, duration: 1.7 },
          transitionEnd: { borderRadius: "var(--border-main-radius)" },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        className="chat-list"
      >
        {!Object.keys(conversations).length ? (
          <m.p
            initial={{ opacity: 0, padding: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.9, duration: 1 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="empty-list"
          >
            No one chat find...
          </m.p>
        ) : (
          chatsList
        )}
        <m.div
          initial={{ opacity: 0, marginBottom: "-10px" }}
          animate={{
            opacity: 1,
            marginBottom: 0,
            transition: { delay: 1, duration: 0.5 },
          }}
          exit={{ opacity: 0, transition: { delay: 0, duration: 0 } }}
          className="chat-create-btn"
          onClick={() => setIsSearchForm(true)}
        >
          <CreateChatButton />
        </m.div>
        {isSearchForm && <UserSearch close={setIsSearchForm} />}
      </m.div>
    </aside>
  );
}
