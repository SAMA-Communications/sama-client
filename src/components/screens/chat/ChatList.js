import React, { useEffect, useState } from "react";
import UserSearch from "./UserSearch.js";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";
import { setChats } from "../../../store/Conversations.js";
import { setConversation } from "../../../store/CurrentConversation.js";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/mainPageComponents/ChatList.css";

export default function ChatList() {
  const [isSearchForm, setIsSearchForm] = useState(false);
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.conversations.value);

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  useEffect(() => {
    setTimeout(() => {
      api.conversationList({}).then((arr) => dispatch(setChats(arr)));
    }, 300);
  }, []);

  const [opponentName, setOpponentName] = useState(null);
  const getNameForUTypeChat = (cid, currentUserId) => {
    api.getParticioantsByCid({ cid: cid }).then((arr) => {
      setOpponentName(arr.filter((el) => el._id !== currentUserId)[0]?.login);
    });
    return opponentName;
  };

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
          <p>{userInfo.login}</p>
        </div>
      </div>
      <div className="chat-list">
        {!conversations.length ? (
          <p>No one chat find...</p>
        ) : (
          conversations.map((obj) => (
            <Link
              to={`/main/#${obj._id}`}
              key={obj._id}
              onClick={() =>
                dispatch(
                  setConversation({
                    ...obj,
                    name: obj.name
                      ? obj.name
                      : getNameForUTypeChat(obj._id, userInfo._id),
                  })
                )
              }
            >
              <div className="chat-box">
                <div className="chat-box-icon">
                  <VscDeviceCamera />
                </div>
                <div className="chat-box-info">
                  <p className="chat-name">
                    {obj.name
                      ? obj.name
                      : getNameForUTypeChat(obj._id, userInfo._id)}
                  </p>
                  <p className="chat-message">{obj.description}</p>
                </div>
              </div>
            </Link>
          ))
        )}
        <div className="chat-create-btn" onClick={() => setIsSearchForm(true)}>
          <VscComment />
        </div>
        {isSearchForm ? <UserSearch close={setIsSearchForm} /> : ""}
      </div>
    </aside>
  );
}
