import React, { useMemo } from "react";
import MessageStatus from "./MessageStatus";

import { ReactComponent as ChatIcon } from "./../../assets/icons/chatList/ChatIcon.svg";
import { ReactComponent as ImagePreviewIcon } from "./../../assets/icons/chatList/ImagePreviewIcon.svg";

export default function ChatBox({
  chatName,
  countOfNewMessages,
  timeOfLastUpdate,
  lastMessage,
  chatType,
  uId,
}) {
  const days = {
    0: "Su",
    1: "Mo",
    2: "Tu",
    3: "We",
    4: "Th",
    5: "Fr",
    6: "Sa",
  };

  const tView = useMemo(() => {
    const t = new Date(
      lastMessage
        ? lastMessage.t / 1000000000 < 10
          ? lastMessage.t * 1000
          : lastMessage.t
        : Date.parse(timeOfLastUpdate)
    );
    const tToday = new Date(Date.now());
    if (
      tToday.getFullYear() - t.getFullYear() ||
      tToday.getMonth() - t.getMonth() ||
      tToday.getDate() - t.getDate() > 6
    ) {
      return (
        (t.getDate() < 10 ? "0" + t.getDate() : t.getDate()) +
        "." +
        (t.getMonth() < 10 ? "0" + t.getMonth() : t.getMonth()) +
        "." +
        t.getFullYear().toString().slice(2)
      );
    } else if (tToday.getDay() - t.getDay()) {
      return days[t.getDay()];
    } else {
      return (
        t.getHours() +
        ":" +
        (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes())
      );
    }
  }, [timeOfLastUpdate, lastMessage]);

  const lastMessageView = useMemo(() => {
    if (lastMessage) {
      const param = { text: lastMessage.body };
      if (lastMessage.from === uId) {
        param.status = (
          <MessageStatus key={lastMessage._id} status={lastMessage.status} />
        );
      }
      return [param.text, param.status];
    } else {
      return null;
    }
  }, [lastMessage]);

  return (
    <div className="chat-box">
      <div className="chat-box-icon">
        <ChatIcon />
      </div>
      <div className="chat-box-info">
        <p className="chat-name">{chatName}</p>
        {lastMessage &&
          (lastMessageView[0] === "" ? (
            <div className="last-message-img-preview">
              <ImagePreviewIcon />
              <p>photo</p>
            </div>
          ) : (
            <p className="chat-message">{lastMessageView}</p>
          ))}
      </div>
      {countOfNewMessages > 0 && (
        <div
          className={
            chatType === "g" ? "chat-indicator-group" : "chat-indicator"
          }
        >
          {countOfNewMessages}
        </div>
      )}
      <div className="chat-last-update">{tView}</div>
    </div>
  );
}
