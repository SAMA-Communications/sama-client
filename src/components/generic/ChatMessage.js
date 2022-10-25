import React from "react";

export default function ChatMessage({ fromId, text, userId }) {
  return (
    <div
      className={
        fromId === userId.toString() ? "message my-message" : "message"
      }
    >
      <p className="message-user-name">{fromId.slice(-6)}</p>
      <p className="message-body">{text}</p>
    </div>
  );
}
