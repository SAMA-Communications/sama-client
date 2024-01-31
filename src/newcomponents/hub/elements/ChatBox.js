import MessageStatus from "@newcomponents/message/elements/MessageStatus";
import React, { useMemo } from "react";
import getFileType from "@utils/get_file_type";
import globalConstants from "@helpers/constants";

import { ReactComponent as Group } from "@newicons/users/Group.svg";
import { ReactComponent as Image } from "@newicons/media/Image.svg";
import { Blurhash } from "react-blurhash";

export default function ChatBox({
  onClickFunc,
  isSelected,
  chatName,
  countOfNewMessages,
  timeOfLastUpdate,
  lastMessage,
  chatType,
  uId,
}) {
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
      return globalConstants.weekDays[t.getDay()];
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

    const { att, text } = lastMessageParams;
    const lastAtt = att?.slice(-1)[0];

    return (
      <div className="content-bottom__last-message">
        {lastAtt ? (
          <div className="last-message__media">
            {lastAtt.file_blur_hash ? (
              <Blurhash
                className="image__blur-hash"
                hash={lastAtt.file_blur_hash}
                resolutionX={32}
                resolutionY={32}
              />
            ) : (
              <Image />
            )}
          </div>
        ) : null}
        <p className="last-message__text">
          {text?.length ? text : getFileType(lastAtt?.file_name)}
        </p>
      </div>
    );
  }, [lastMessageParams]);

  return (
    <div
      className={`chat-box__container${isSelected ? "--selected" : ""}`}
      onClick={onClickFunc}
    >
      <div className="box__photo fcc">
        {chatType === "g" ? <Group /> : chatName?.slice(0, 2).toUpperCase()}
      </div>
      <div className="box__content">
        <div className="content-top">
          <p className="content-top__name">{chatName}</p>
          <div className="content-top__time">{tView}</div>
        </div>
        <div className="content-bottom">
          {lastMessageView}
          {countOfNewMessages > 0 ? (
            <div className="content-bottom__indicator">
              {countOfNewMessages}
            </div>
          ) : (
            lastMessageParams?.status
          )}
        </div>
      </div>
    </div>
  );
}
