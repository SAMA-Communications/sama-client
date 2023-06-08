import React, { useMemo } from "react";
import MessageAttachments from "../screens/chat/MessageAttachments";
import MessageStatus from "./MessageStatus";
import { changeOpacity } from "../../styles/animations/animationBlocks";
import { motion as m } from "framer-motion";

import "../../styles/chat/ChatMessage.css";

import { ReactComponent as UserPhoto } from "./../../assets/icons/chatForm/UserPhotoIconChat.svg";

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
  openModalParam,
}) {
  const timeSend = useMemo(() => {
    const t = new Date(tSend * 1000);
    return (
      t.getHours() +
      ":" +
      (t.getMinutes() > 9 ? t.getMinutes() : "0" + t.getMinutes())
    );
  }, [tSend]);

  const messageStyle = useMemo(() => {
    let status = "message-content";
    if (isPrevMesssageYours) {
      status += " br-tl";
    } else {
      status += " mt-10";
    }

    if (!attachments?.length) {
      if (text?.length < 50) {
        status += " m-pr";
      } else {
        status += " m-pb";
      }
    } else if (text?.length > 16) {
      status += " m-pb";
    }

    return status;
  }, [isPrevMesssageYours, attachments]);

  return (
    <m.div
      variants={changeOpacity(0, 0.25, 0, 0)}
      initial="hidden"
      animate="visible"
      className={
        fromId === userId.toString() ? "message my-message" : "message"
      }
    >
      {isNextMessageYours ? (
        <div className="message-user-photo-none"></div>
      ) : (
        <div className="message-user-photo">
          {uName ? uName.slice(0, 2) : <UserPhoto />}
        </div>
      )}
      <div className={messageStyle}>
        <div className="message-info">
          {!isPrevMesssageYours && <p className="message-user-name">{uName}</p>}
          {!!attachments?.length && (
            <MessageAttachments
              attachments={attachments}
              openModalParam={openModalParam}
            />
          )}
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
          <div className="message-status-time">{timeSend}</div>
          <div className="message-status-icon">
            <MessageStatus status={status} />
          </div>
        </div>
      </div>
    </m.div>
  );
}
