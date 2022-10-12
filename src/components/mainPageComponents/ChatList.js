import React, { useMemo } from "react";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";

import "../../styles/ChatList.css";

export default function ChatList() {
  const listChats = useMemo(() => {
    const list = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10,
    ];
    return list.map((el) => (
      <div className="chat-box">
        <div className="chat-box-icon">
          <VscDeviceCamera />
        </div>
        <div className="chat-box-info">
          <p className="chat-name">Chat_{el}</p>
          <p className="chat-message">Messages_chat</p>
        </div>
      </div>
    ));
  }, []);

  return (
    <aside>
      <div className="user-box">
        <div className="user-photo">
          <VscDeviceCamera />
        </div>
        <div className="user-info">
          <p>UserName</p>
        </div>
      </div>
      <div className="chat-list">
        {listChats}
        <div className="chat-create-btn">
          <VscComment />
        </div>
      </div>
    </aside>
  );
}
