import React, { useMemo } from "react";
import { VscDeviceCamera } from "react-icons/vsc";
import { IoCheckmark, IoCheckmarkDone, IoTimeOutline } from "react-icons/io5";

export default function ChatBox({
  chatName,
  countOfNewMessage,
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
      return t.getHours() + ":" + t.getMinutes();
    }
  }, [timeOfLastUpdate]);

  const mStatusView = useMemo(() => {
    if (lastMessage) {
      const mStatus = lastMessage.status;
      if (lastMessage.from !== uId) {
        return null;
      }
      return mStatus === "sent" ? <IoCheckmark /> : <IoTimeOutline />;
    }
  }, [lastMessage]);

  return (
    <div className="chat-box">
      <div className="chat-box-icon">
        <VscDeviceCamera />
      </div>
      <div className="chat-box-info">
        <p className="chat-name">{chatName}</p>
        <p className="chat-message">
          {lastMessage?.body}
          <span>{mStatusView}</span>
        </p>
      </div>
      {countOfNewMessage ? <div className="chat-indicator"></div> : null}
      <div className="chat-last-update">{tView}</div>
    </div>
  );
}
