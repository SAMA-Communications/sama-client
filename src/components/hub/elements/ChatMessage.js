import MessageAttachments from "@components/message/elements/MessageAttachments";
import MessageStatus from "@components/message/elements/MessageStatus";
import MessageUserIcon from "@components/hub/elements/MessageUserIcon";
import addSuffix from "@utils/navigation/add_suffix";
import encryptionService from "@services/encryptionService";
import getUserFullName from "@utils/user/get_user_full_name";
import { urlify } from "@utils/text/urlify";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import "@styles/hub/elements/ChatMessage.css";

import { ReactComponent as CornerLight } from "@icons/_helpers/CornerLight.svg";
import { ReactComponent as CornerAccent } from "@icons/_helpers/CornerAccent.svg";

export default function ChatMessage({
  sender,
  message,
  currentUserId,
  isEncryptedChat,
  isPrevMesssageYours: prev,
  isNextMessageYours: next,
}) {
  const { pathname, hash } = useLocation();

  const { body, from, attachments, status, t, encrypted_message_type } =
    message;
  const isCurrentUser = from === currentUserId;

  const timeSend = useMemo(() => {
    const time = new Date(t * 1000);
    return `${time.getHours()}:${
      time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()
    }`;
  }, [t]);

  const messageText = useMemo(() => {
    if (!isEncryptedChat || isCurrentUser) {
      return body;
    }

    try {
      //update when session connect
      return encryptionService.decryptMessage(
        body,
        encrypted_message_type,
        from
      );
    } catch (error) {
      console.log(error);
      return "#Encrypted message";
    }
  }, [body, encrypted_message_type, from]);

  const openUserProfile = () =>
    sender ? addSuffix(pathname + hash, `/user?uid=${from}`) : {};

  return (
    <div
      className={`message__container${isCurrentUser ? "--my" : ""} ${
        prev ? "" : "mt-8"
      }`}
    >
      <div className={`message-photo${sender ? "--hover" : ""}`}>
        {next ? null : (
          <div className="photo__container fcc" onClick={openUserProfile}>
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
          <div
            className={`content__uname${sender ? "--hover" : ""}`}
            onClick={openUserProfile}
          >
            &zwnj;{getUserFullName(sender) || "Deleted account"}
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
          {messageText ? (
            <div className="content__text">{urlify(messageText)}</div>
          ) : null}

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
