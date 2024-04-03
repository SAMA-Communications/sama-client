import MessageAttachments from "@src/components/message/elements/MessageAttachments";
import MessageStatus from "@components/message/elements/MessageStatus";
import MessageUserIcon from "@components/hub/elements/MessageUserIcon";
import getUserFullName from "@utils/user/get_user_full_name";
import { urlify } from "@utils/urlify";
import { useMemo } from "react";

import "@styles/hub/elements/ChatMessage.css";

import { ReactComponent as CornerLight } from "@icons/_helpers/CornerLight.svg";
import { ReactComponent as CornerAccent } from "@icons/_helpers/CornerAccent.svg";

export default function ChatMessage({
  sender,
  message,
  currentUserId,
  isPrevMesssageYours: prev,
  isNextMessageYours: next,
}) {
  const { body, from, attachments, status, t } = message;
  const isCurrentUser = from === currentUserId;

  const timeSend = useMemo(() => {
    const time = new Date(t * 1000);
    return `${time.getHours()}:${
      time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()
    }`;
  }, [t]);

  return (
    <div
      className={`message__container${isCurrentUser ? "--my" : ""} ${
        prev ? "" : "mt-8"
      }`}
    >
      <div className="message-photo">
        {next ? null : (
          <div className="photo__container fcc">
            <MessageUserIcon
              userObject={sender}
              isCurrentUser={isCurrentUser}
            />
          </div>
        )}
      </div>
      <div className={`message-content__container ${next ? "" : "br-bl-0"}`}>
        {next ? null : isCurrentUser ? (
          <CornerAccent className="message-content--corner" />
        ) : (
          <CornerLight className="message-content--corner" />
        )}
        {prev ? null : (
          <div className="content__uname">
            {getUserFullName(sender) || "Deleted account"}
          </div>
        )}
        <div
          className={`content__container${
            attachments?.length ? "--with-media" : ""
          }`}
        >
          {attachments?.length ? (
            <MessageAttachments attachments={attachments} mid={message._id} />
          ) : null}
          {body ? <div className="content__text">{urlify(body)}</div> : null}

          <div
            className={`content__status${
              attachments?.length && !body ? "--darken" : ""
            } fcc ${isCurrentUser ? "pr-28" : ""}`}
          >
            <div className="status__time">{timeSend}</div>
            {isCurrentUser ? (
              <div className="status__icon">
                <MessageStatus
                  status={status}
                  type={isCurrentUser ? "white" : "accent"}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
