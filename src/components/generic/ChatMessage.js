import React from "react";

import "../../styles/chat/ChatMessage.css";
import MessageAttachments from "./MessageAttachments";
import MessageStatus from "./MessageStatus";

export default function ChatMessage({
  fromId,
  text,
  userId,
  uName,
  status,
  attachments,
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
        <MessageAttachments attachments={attachments} />
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
          <MessageStatus status={status} />
        </div>
      </div>
    </div>
  );
}
