import React, { useMemo } from "react";
import MessageStatus from "./MessageStatus";
import { motion as m } from "framer-motion";

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
      return days[t.getDay()];
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
    <m.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0.9, duration: 1 },
      }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="chat-box"
    >
      <div className="chat-box-icon">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.88 5.33334C24.4667 5.33334 26.5467 7.42667 26.5467 10C26.5467 12.52 24.5467 14.5733 22.0533 14.6667C21.9382 14.6533 21.8218 14.6533 21.7067 14.6667M24.4533 26.6667C25.4133 26.4667 26.32 26.08 27.0667 25.5067C29.1467 23.9467 29.1467 21.3733 27.0667 19.8133C26.3333 19.2533 25.44 18.88 24.4933 18.6667M12.2133 14.4933C12.08 14.48 11.92 14.48 11.7733 14.4933C10.2429 14.4414 8.79286 13.7958 7.73017 12.6933C6.66749 11.5908 6.07565 10.1179 6.08 8.58667C6.08 5.32001 8.72 2.66667 12 2.66667C13.5683 2.63838 15.0836 3.23426 16.2126 4.32322C17.3416 5.41219 17.9917 6.90503 18.02 8.47334C18.0483 10.0417 17.4524 11.557 16.3635 12.6859C15.2745 13.8149 13.7816 14.4651 12.2133 14.4933ZM5.54667 19.4133C2.32 21.5733 2.32 25.0933 5.54667 27.24C9.21333 29.6933 15.2267 29.6933 18.8933 27.24C22.12 25.08 22.12 21.56 18.8933 19.4133C15.24 16.9733 9.22667 16.9733 5.54667 19.4133V19.4133Z"
            stroke="white"
          />
        </svg>
      </div>
      <div className="chat-box-info">
        <p className="chat-name">{chatName}</p>
        {lastMessageView && <p className="chat-message">{lastMessageView}</p>}
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
    </m.div>
  );
}
