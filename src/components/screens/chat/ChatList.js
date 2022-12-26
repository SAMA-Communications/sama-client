import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import ChatBox from "../../generic/ChatBox.js";
import UserSearch from "./UserSearch.js";
import { NavLink } from "react-router-dom";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";
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

import "../../../styles/chat/ChatList.css";

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
      <div className="user-box">
        <div className="user-photo">
          {!userInfo ? (
            <VscDeviceCamera />
          ) : (
            userInfo?.login.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="user-info">
          <p>{userInfo?.login}</p>
        </div>
      </div>
      <div className="chat-list">
        {!Object.keys(conversations).length ? (
          <p>No one chat find...</p>
        ) : (
          chatsList
        )}
        <div className="chat-create-btn" onClick={() => setIsSearchForm(true)}>
          <VscComment />
        </div>
        {isSearchForm && <UserSearch close={setIsSearchForm} />}
      </div>
    </aside>
  );
}
