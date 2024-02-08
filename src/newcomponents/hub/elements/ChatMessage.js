import MessageAttachments from "@screens/chat/MessageAttachments";
import MessageStatus from "@newcomponents/message/elements/MessageStatus";
import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { urlify } from "@utils/urlify";
import { useMemo } from "react";

import "@newstyles/hub/elements/ChatMessage.css";

import { ReactComponent as UserPhoto } from "@icons/chatForm/UserPhotoIconChat.svg";
import { ReactComponent as CornerLight } from "@newicons/_helpers/CornerLight.svg";
import { ReactComponent as CornerAccent } from "@newicons/_helpers/CornerAccent.svg";

export default function ChatMessage({
  message,
  userObject,
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
            {userObject ? getUserInitials(userObject) : <UserPhoto />}
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
          <div className="content__uname">{getUserFullName(userObject)}</div>
        )}
        <div className="content__container">
          {!!attachments?.length && (
            <MessageAttachments attachments={attachments} />
          )}
          {body ? <div className="content__text">{urlify(body)}</div> : null}
          {isCurrentUser ? (
            <div
              className={`content__status${
                attachments?.length && !body ? "--darken" : ""
              } fcc`}
            >
              <div className="status__time">{timeSend}</div>
              <div className="status__icon">
                <MessageStatus
                  status={status}
                  type={isCurrentUser ? "white" : "accent"}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
