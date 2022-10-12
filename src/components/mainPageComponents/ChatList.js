import React from "react";

import "../../styles/ChatList.css";

export default function ChatList() {
  return (
    <aside>
      <div className="chat-logo">SAMA</div>
      <hr />
      <div className="user-box">
        <div className="user-photo">UP</div>
        <div className="user-info">
          <p>UserName</p>
        </div>
      </div>
      <hr />
      <div className="chat-list">
        <div className="chat-box">
          <div className="chat-box-icon">CN</div>
          <div className="chat-box-info">
            <p className="chat-name">Chat_name</p>
            <p className="chat-message">Messages_chat</p>
          </div>
        </div>
        <div className="chat-box">
          <div className="chat-box-icon">CN</div>
          <div className="chat-box-info">
            <p className="chat-name">Chat_name</p>
            <p className="chat-message">Messages_chat</p>
          </div>
        </div>
        <div className="chat-box">
          <div className="chat-box-icon">CN</div>
          <div className="chat-box-info">
            <p className="chat-name">Chat_name</p>
            <p className="chat-message">Messages_chat</p>
          </div>
        </div>
        <div className="chat-box">
          <div className="chat-box-icon">CN</div>
          <div className="chat-box-info">
            <p className="chat-name">Chat_name</p>
            <p className="chat-message">Messages_chat</p>
          </div>
        </div>
        <div className="chat-box">
          <div className="chat-box-icon">CN</div>
          <div className="chat-box-info">
            <p className="chat-name">Chat_name</p>
            <p className="chat-message">Messages_chat</p>
          </div>
        </div>
      </div>
      <div className="chat-create-btn">
        <a>+</a>
      </div>
    </aside>
  );
}
