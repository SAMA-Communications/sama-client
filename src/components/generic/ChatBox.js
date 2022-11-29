import React, { useMemo } from "react";
import { VscDeviceCamera } from "react-icons/vsc";
import MessageStatus from "./MessageStatus";

export default function ChatBox({
  chatName,
  countOfNewMessages,
  timeOfLastUpdate,
  lastMessage,
  uId,
}) {
  const tView = useMemo(() => {
    const t = new Date(Date.parse(timeOfLastUpdate));
    const tToday = new Date(Date.now());
    if (
      tToday.getFullYear() - t.getFullYear() ||
      tToday.getMonth() - t.getMonth() ||
      tToday.getDate() - t.getDate() > 6
    ) {
      return (
        t.getDate() +
        "." +
        t.getMonth() +
        "." +
        t.getFullYear().toString().slice(2)
      );
    } else if (tToday.getDay() - t.getDay()) {
      switch (t.getDay()) {
        case 0:
          return "Su";
        case 1:
          return "Mo";
        case 2:
          return "Tu";
        case 3:
          return "We";
        case 4:
          return "Th";
        case 5:
          return "Fr";
        case 6:
          return "Sa";
        default:
          break;
      }
    } else {
      return (
        t.getHours() +
        ":" +
        (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes())
      );
    }
  }, [timeOfLastUpdate]);

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
        <VscDeviceCamera />
      </div>
      <div className="chat-box-info">
        <p className="chat-name">{chatName}</p>
        <p className="chat-message">{lastMessageView}</p>
      </div>
      {countOfNewMessages ? (
        <div className="chat-indicator">{countOfNewMessages}</div>
      ) : null}
      <div className="chat-last-update">{tView}</div>
    </div>
  );
}
