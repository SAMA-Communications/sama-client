import React from "react";
import { VscDeviceCamera } from "react-icons/vsc";

export default function ChatBox({
  chatName,
  chatDescription,
  countOfNewMessage,
  timeOfLastUpdate,
}) {
  const t = new Date(Date.parse(timeOfLastUpdate));
  const tToday = new Date(Date.now());
  let tView = "";
  console.log(t);
  if (
    tToday.getFullYear() - t.getFullYear() ||
    tToday.getMonth() - t.getMonth() ||
    tToday.getDate() - t.getDate() > 6
  ) {
    tView =
      t.getDate() +
      "." +
      t.getMonth() +
      "." +
      t.getFullYear().toString().slice(2);
  } else if (tToday.getDay() - t.getDay()) {
    switch (t.getDay()) {
      case 0:
        tView = "Su";
        break;
      case 1:
        tView = "Mo";
        break;
      case 2:
        tView = "Tu";
        break;
      case 3:
        tView = "We";
        break;
      case 4:
        tView = "Th";
        break;
      case 5:
        tView = "Fr";
        break;
      case 6:
        tView = "Sa";
        break;
      default:
        break;
    }
  } else {
    tView = t.getHours() + ":" + t.getMinutes();
  }

  return (
    <div className="chat-box">
      <div className="chat-box-icon">
        <VscDeviceCamera />
      </div>
      <div className="chat-box-info">
        <p className="chat-name">{chatName}</p>
        <p className="chat-message">{chatDescription}</p>
      </div>
      {countOfNewMessage ? <div className="chat-indicator"></div> : null}
      <div className="chat-last-update">{tView}</div>
    </div>
  );
}
