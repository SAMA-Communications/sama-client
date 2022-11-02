import React from "react";

export default function ChatMessage({ fromId, text, userId, uName }) {
  return (
    <div
      className={
        fromId === userId.toString() ? "message my-message" : "message"
      }
    >
      <p className="message-user-name">{uName}</p>
      <p className="message-body">{text}</p>
    </div>
  );
}
