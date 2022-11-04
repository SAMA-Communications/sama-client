import React from "react";
import { IoCheckmark, IoCheckmarkDone, IoTimeOutline } from "react-icons/io5";

export default function ChatMessage({ fromId, text, userId, uName, status }) {
  return (
    <div
      className={
        fromId === userId.toString() ? "message my-message" : "message"
      }
    >
      <p className="message-user-name">{uName}</p>
      <p className="message-body">{text}</p>
      <div className="message-status-icon">
        {!status ? <IoTimeOutline /> : <IoCheckmark />}
        {/* also use  IoCheckmarkDone for delivered status*/}
      </div>
    </div>
  );
}
