import React, { useEffect, useMemo, useState } from "react";
import UserSearch from "./UserSearch.js";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";
import { setChats } from "../../../store/Conversations.js";
import { setConversation } from "../../../store/CurrentConversation.js";
import { setUsers } from "../../../store/Participants.js";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/mainPageComponents/ChatList.css";

export default function ChatList() {
  const dispatch = useDispatch();
  const [isSearchForm, setIsSearchForm] = useState(false);
  const conversations = useSelector((state) => state.conversations.value);
  const participants = useSelector((state) => state.participants.value);

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  useEffect(() => {
    api.conversationList({}).then((arr) => {
      dispatch(setChats(arr));
      api
        .getParticipantsByCids({ cids: arr.map((obj) => obj._id) })
        .then((users) => {
          dispatch(setUsers(users));
        });
    });
  }, []);

  const chatsList = useMemo(
    () =>
      conversations.map((obj) => {
        const chatName = !obj.name
          ? obj.owner_id === userInfo._id
            ? participants[obj.opponent_id]
            : participants[obj.owner_id]
          : obj.name;

        return (
          <Link
            to={`/main/#${obj.name ? obj._id : chatName}`}
            key={obj._id}
            onClick={() =>
              dispatch(
                setConversation({
                  ...obj,
                  name: chatName,
                })
              )
            }
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
      }),
    [conversations, participants]
  );

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
        {!conversations.length ? <p>No one chat find...</p> : chatsList}
        <div className="chat-create-btn" onClick={() => setIsSearchForm(true)}>
          <VscComment />
        </div>
        {isSearchForm ? <UserSearch close={setIsSearchForm} /> : ""}
      </div>
    </aside>
  );
}
