import React, { useEffect, useState } from "react";
import UserSearch from "./UserSearch.js";
import api from "../../api/api.js";
import { Link } from "react-router-dom";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";

import "../../styles/ChatList.css";

export default function ChatList() {
  const userToken = localStorage.getItem("sessionId");
  const [list, setList] = useState([]);
  const [isSearchForm, setIsSearchForm] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      api.conversationList({}).then((el) => setList(el));
    }, 300);
  }, []);

  return (
    <aside>
      <div className="user-box">
        <div className="user-photo">
          {!userToken ? (
            <VscDeviceCamera />
          ) : (
            userToken?.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="user-info">
          <p>{userToken?.slice(-6)}</p>
        </div>
      </div>
      <div className="chat-list">
        {!list.length ? (
          <p>No one chat find...</p>
        ) : (
          list.map((obj) => (
            <Link to={`/main/#${obj._id}`} key={obj._id}>
              <div className="chat-box">
                <div className="chat-box-icon">
                  <VscDeviceCamera />
                </div>
                <div className="chat-box-info">
                  <p className="chat-name">{obj.name}</p>
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
