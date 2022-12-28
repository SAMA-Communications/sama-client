import React from "react";
import MessageAttachments from "../screens/chat/MessageAttachments";
import MessageStatus from "./MessageStatus";
import { motion as m } from "framer-motion";

import "../../styles/chat/ChatMessage.css";

export default function ChatMessage({
  fromId,
  text,
  userId,
  uName,
  status,
  isPrevMesssageYours,
  isNextMessageYours,
  attachments,
  tSend,
}) {
  const timeSend = new Date(tSend * 1000);

  const messageStyle = () => {
    let status = "message-content";
    if (!isPrevMesssageYours) {
      status += " mt-10";
    } else {
      status += " br-tl";
    }

    if (!attachments?.length) {
      if (text.length < 50) {
        status += " m-pr";
      } else {
        status += " m-pb";
      }
    }

    return status;
  };

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0, duration: 0.25 },
      }}
      className={
        fromId === userId.toString() ? "message my-message" : "message"
      }
    >
      {!isNextMessageYours ? (
        <div className="message-user-photo">
          {uName ? (
            uName.slice(0, 2)
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.0433 25.3333C24.0433 20.8183 19.5517 17.1667 14.0217 17.1667C8.49167 17.1667 4 20.8183 4 25.3333M14.0217 13.6667C15.5688 13.6667 17.0525 13.0521 18.1465 11.9581C19.2404 10.8642 19.855 9.38043 19.855 7.83333C19.855 6.28624 19.2404 4.80251 18.1465 3.70854C17.0525 2.61458 15.5688 2 14.0217 2C12.4746 2 10.9908 2.61458 9.89688 3.70854C8.80291 4.80251 8.18833 6.28624 8.18833 7.83333C8.18833 9.38043 8.80291 10.8642 9.89688 11.9581C10.9908 13.0521 12.4746 13.6667 14.0217 13.6667V13.6667Z"
                stroke="white"
              />
            </svg>
          )}
        </div>
      ) : (
        <div className="message-user-photo-none"></div>
      )}
      <div className={messageStyle()}>
        <div className="message-info">
          {!isPrevMesssageYours && <p className="message-user-name">{uName}</p>}
          <MessageAttachments attachments={attachments} />
          {text && (
            <p
              className={
                attachments?.length || isPrevMesssageYours
                  ? "message-body mt-10"
                  : "message-body"
              }
            >
              {text}
            </p>
          )}
        </div>
        <div
          className={
            attachments?.length && !text
              ? "message-status bg-status-att"
              : "message-status"
          }
        >
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
    </m.div>
  );
}
