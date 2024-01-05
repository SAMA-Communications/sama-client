import MessageStatus from "../messageComponents/MessageStatus";
import React, { useMemo } from "react";
import ImageView from "../attachmentComponents/ImageView";
import getFileType from "../../../utils/get_file_type";

import { ReactComponent as ChatIconPrivate } from "./../../../assets/icons/chatList/ChatIconPrivate.svg";
import { ReactComponent as ChatIconGroup } from "./../../../assets/icons/chatList/ChatIconGroup.svg";
import { ReactComponent as ImagePreviewIcon } from "./../../../assets/icons/chatList/ImagePreviewIcon.svg";

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

  const lastMessageParams = useMemo(() => {
    if (lastMessage) {
      const param = { text: lastMessage.body };
      if (lastMessage.from === uId) {
        param.status = (
          <MessageStatus key={lastMessage._id} status={lastMessage.status} />
        );
      }

      return {
        att: lastMessage.attachments,
        text: param.text,
        status: param.status,
      };
    } else {
      return null;
    }
  }, [lastMessage]);

  const lastMessageView = useMemo(() => {
    if (!lastMessage || !lastMessageParams) {
      return null;
    }

    const { att, text, status } = lastMessageParams;
    const lastAtt = att?.slice(-1)[0];

    return (
      <div className="last-message">
        {lastAtt ? (
          <div className="media-container">
            {lastAtt.file_blur_hash ? (
              <ImageView
                blurHash={lastAtt.file_blur_hash}
                url={null}
                localUrl={null}
                altName={lastAtt.file_name}
              />
            ) : (
              <ImagePreviewIcon />
            )}
          </div>
        ) : null}
        <p>{text?.length ? text : getFileType(lastAtt?.file_name)}</p>
        {status}
      </div>
    );
  }, [lastMessageParams]);

  return (
    <div className="chat-box">
      <div
        className={`chat-box-icon ${
          chatType === "g" ? "chat-box-icon-g-bg" : "chat-box-icon-u-bg"
        }`}
      >
        {chatType === "g" ? <ChatIconGroup /> : <ChatIconPrivate />}
      </div>

      <div className="chat-box-info">
        <p className="chat-name">{chatName}</p>
        {lastMessageView}
      </div>
      {countOfNewMessages > 0 && (
        <div className="chat-indicator">{countOfNewMessages}</div>
      )}
      <div className="chat-last-update">{tView}</div>
    </div>
  );
}
