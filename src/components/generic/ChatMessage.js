import React, { useMemo } from "react";

import "../../styles/chat/ChatMessage.css";
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

  const attachmentsView = useMemo(
    () =>
      attachments ? <img src={attachments && attachments[0].file_url} /> : null,
    [attachments]
  );

  return (
    <div
      className={
        fromId === userId.toString() ? "message my-message" : "message"
      }
    >
      <div className="message-info">
        <p className="message-user-name">{uName}</p>
        <p className="message-body">
          {text}
          <div>{attachmentsView}</div>
        </p>
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
