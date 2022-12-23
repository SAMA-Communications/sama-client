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
      attachments ? (
        <div className="message-file">
          {attachments.map((el) =>
            el.file_url ? (
              <img src={el.file_url} alt={el.file_name} key={el.file_url} />
            ) : (
              <div
                key={el.file_name}
                style={{
                  backgroundColor: "#fff",
                  width: "100px",
                  height: "100px",
                  margin: "5px 5px  0 5px",
                }}
              ></div>
            )
          )}
        </div>
      ) : null,
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
        <p className="message-body">{text}</p>
        {attachmentsView}
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
