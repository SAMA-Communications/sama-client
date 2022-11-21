import React from "react";
import { IoCheckmark, IoCheckmarkDone, IoTimeOutline } from "react-icons/io5";

import "../../styles/chat/ChatMessage.css";

export default function ChatMessage({
  fromId,
  text,
  userId,
  uName,
  read,
  status,
  tSend,
}) {
  const timeSend = new Date(tSend * 1000);

  return (
    <div
      className={
        fromId === userId.toString() ? "message my-message" : "message"
      }
    >
      <div className="message-info">
        <p className="message-user-name">{uName}</p>
        <p className="message-body">{text}</p>
      </div>
      <div className="message-status">
        <div className="message-status-time">
          {timeSend.getHours() +
            ":" +
            (timeSend.getMinutes() > 9
              ? timeSend.getMinutes()
              : "0" + timeSend.getMinutes())}
        </div>
        <div className="message-status-icon">
          {status === "sent" ? (
            read ? (
              <IoCheckmarkDone />
            ) : (
              <IoCheckmark />
            )
          ) : (
            <IoTimeOutline />
          )}
        </div>
      </div>
    </div>
  );
}
