import React, { useEffect, useMemo, useState } from "react";
import UserSearch from "./UserSearch.js";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";
import {
  selectParticipantsEntities,
  setUsers,
} from "../../../store/Participants.js";
import {
  selectAllConversations,
  setChats,
} from "../../../store/Conversations.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/chat/ChatList.css";
import { removeAllMessages } from "../../../store/Messages.js";

export default function ChatList() {
  const dispatch = useDispatch();
  const [isSearchForm, setIsSearchForm] = useState(false);

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  useEffect(() => {
    api.conversationList({}).then((arr) => {
      dispatch(setChats(arr));
      api.getParticipantsByCids(arr.map((obj) => obj._id)).then((users) => {
        dispatch(setUsers(users));
      });
    });
  }, []);

  const chatsList = useMemo(() => {
    let list = [];
    for (const id in conversations) {
      const obj = conversations[id];
      const chatName = !obj.name
        ? obj.owner_id === userInfo._id
          ? participants[obj.opponent_id]?.login
          : participants[obj.owner_id]?.login
        : obj.name;

      list.push(
        <Link
          to={`/main/#${obj.name ? obj._id : chatName}`}
          key={obj._id}
          onClick={() => {
            dispatch(removeAllMessages());
            dispatch(
              setSelectedConversation({
                ...obj,
                name: chatName,
              })
            );
          }}
        >
          <div className="chat-box">
            <div className="chat-box-icon">
              <VscDeviceCamera />
            </div>
            <div className="chat-box-info">
              <p className="chat-name">{chatName}</p>
              <p className="chat-message">{obj.description}</p>
            </div>
          </div>
        </Link>
      );
    }

    return list;
  }, [conversations, participants]);

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
        {isSearchForm ? <UserSearch close={setIsSearchForm} /> : ""}
      </div>
    </aside>
  );
}
