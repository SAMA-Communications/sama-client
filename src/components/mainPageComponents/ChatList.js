import React, { useEffect, useState } from "react";
import api from "../../api/api.js";
import { Link } from "react-router-dom";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";

import "../../styles/ChatList.css";

export default function ChatList() {
  const userLogin = localStorage.getItem("token");
  const [list, setList] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    api.conversationList({}).then((el) => setList(el));
  }, [update]);

  const createChat = async () => {
    const idRecipient = prompt("ID user");
    const requestData = {
      name: idRecipient,
      type: "u",
      recipient: idRecipient,
      participants: [idRecipient],
    };
    await api.conversationCreate(requestData);
    update ? setUpdate(false) : setUpdate(true);
  };

  return (
    <aside>
      <div className="user-box">
        <div className="user-photo">
          {!userLogin ? (
            <VscDeviceCamera />
          ) : (
            userLogin.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="user-info">
          <p>{userLogin}</p>
        </div>
      </div>
      <div className="chat-list">
        {!list.length ? (
          <p>No one chat find...</p>
        ) : (
          list.map((obj) => (
            <Link to={`/main/#${obj.name}`}>
              <div className="chat-box" key={obj.name}>
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
        <div className="chat-create-btn" onClick={createChat}>
          <VscComment />
        </div>
      </div>
    </aside>
  );
}
