import { useMemo } from "react";

import { getAdapters } from "../../../adapters";

import { MessageStatus } from "../MessageStatus";
import { LastMessageMedia } from "./LastMessageMedia";

import { Reply } from "lucide-react";

import { LastMessageProps } from "./LastMessage.types";

export const LastMessage = ({
  message,
  draft,
  countOfUnreadMessages,
  isShowUserName,
  isSelected = false,
}: LastMessageProps) => {
  const { mediaUtils, userUtils, useParticipants } = getAdapters();
  const { getCurrentUser, getUserById } = useParticipants();

  const currentUserId = getCurrentUser()._id;
  const isAuthorCurrentUser = currentUserId === message?.from;

  const { text: dText, replied_mid: dRepliedMid } = draft || {};
  if (!message && !dText && !dRepliedMid) return null;

  if ((dText || dRepliedMid) && countOfUnreadMessages < 1) {
    return (
      <div className="ui:flex ui:flex-1 ui:items-center ui:gap-1.25 ui:overflow-y-hidden">
        <p className="ui:flex ui:items-center ui:gap-0.75 ui:font-light ui:text-nowrap ui:text-accent-500">
          {dRepliedMid && <Reply strokeWidth={2} />} Draft:
        </p>
        <p className="ui:w-full ui:overflow-hidden ui:font-extralight ui:text-ellipsis ui:whitespace-nowrap ui:text-text-dark">
          {dText}
        </p>
      </div>
    );
  }

  const { attachments, body } = message || {};
  const lastAtt = attachments?.slice(-1)[0];

  const buildLastMessageText = (text: string | undefined, att?: { file_name?: string; file_content_type?: string }) => {
    if (text) return text;
    if (att?.file_name || att?.file_content_type) return mediaUtils.getFileType(att.file_name, att.file_content_type);
    return "";
  };

  const displayName = useMemo(() => {
    if (isAuthorCurrentUser) return "You";
    if (message?.from) {
      const user = getUserById(message.from);
      return userUtils.getLastMessageUserName(user);
    }
    return null;
  }, [isAuthorCurrentUser, message?.from, getUserById, userUtils]);

  return (
    <>
      <div className="ui:flex ui:flex-1 ui:items-center ui:gap-1.25 ui:overflow-y-hidden">
        {isShowUserName ? <p className={`ui:font-light ui:text-nowrap ui:text-accent-500`}>{displayName}:</p> : null}
        {lastAtt ? <LastMessageMedia isSelected={isSelected} attachment={lastAtt} /> : null}
        <p className={`ui:w-full ui:overflow-hidden ui:font-extralight ui:text-ellipsis ui:whitespace-nowrap`}>
          {buildLastMessageText(body, lastAtt)}
        </p>
      </div>
      {countOfUnreadMessages > 0 ? (
        <div className="ui:text-md ui:rounded-lg ui:bg-accent-500 ui:px-1.5 ui:py-0.5 ui:font-light ui:text-white">
          {countOfUnreadMessages}
        </div>
      ) : isAuthorCurrentUser ? (
        <MessageStatus message={message} color={"accent"} />
      ) : null}
    </>
  );
};
