import React, { useEffect, useMemo, useState } from "react";
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
      api.conversationList({}).then((arr) => {
        api
          .getParticipantsByCids({ cids: arr.map((obj) => obj._id) })
          .then((particiapnts) => {
            let i = 0;
            for (const cid in particiapnts) {
              arr[i++]["participants"] = particiapnts[cid];
            }
            dispatch(setChats(arr));
          });
      });
    }, 300);
  }, []);

  const chatsList = useMemo(
    () =>
      conversations.map((obj) => {
        const chatName = obj.name
          ? obj.name
          : obj.participants.find((el) => el._id !== userInfo._id).login;
        return (
          <Link
            to={`/main/#${obj._id}`}
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
    [conversations]
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
          <p>{userInfo.login}</p>
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
