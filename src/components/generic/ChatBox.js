import React from "react";
import { VscDeviceCamera } from "react-icons/vsc";

export default function ChatBox({
  chatName,
  chatDescription,
  countOfNewMessage,
  timeOfLastUpdate,
}) {
  const t = new Date(Date.parse(timeOfLastUpdate));
  return (
    <div className="chat-box">
      <div className="chat-box-icon">
        <VscDeviceCamera />
      </div>
      <div className="chat-box-info">
        <p className="chat-name">{chatName}</p>
        <p className="chat-message">{chatDescription}</p>
      </div>
      {countOfNewMessage ? <div className="chat-indicator"></div> : null}
      <div className="chat-last-update">
        {t.getHours() +
          ":" +
          (t.getMinutes() > 9 ? t.getMinutes() : "0" + t.getMinutes())}
      </div>
    </div>
  );
}
