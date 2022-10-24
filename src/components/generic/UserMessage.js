import React from "react";

export default function UserMessage({ userInfo, data }) {
  return (
    <div
      className={
        data.from === userInfo._id.toString() ? "message my-message" : "message"
      }
    >
      <p className="message-user-name">{data.from.slice(-6)}</p>
      <p className="message-body">{data.body}</p>
    </div>
  );
}
