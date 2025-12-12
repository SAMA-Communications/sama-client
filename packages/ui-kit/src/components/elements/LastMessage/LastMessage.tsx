import { getAdapters } from "../../../adapters";

import { LastMessageStatus } from "./LastMessageStatus";
import { LastMessageMedia } from "./LastMessageMedia";

import { Reply } from "lucide-react";

import { LastMessageProps } from "./LastMessage.types";
import { useMemo } from "react";

export const LastMessage = ({
  message,
  draft,
  countOfUnreadMessages,
  isShowUserName,
}: LastMessageProps) => {
  const { mediaUtils, userUtils, useParticipants } = getAdapters();
  const { getCurrentUser, getUserById } = useParticipants();

  const currentUserId = getCurrentUser()._id;
  const isAuthorCurrentUser = currentUserId === message?.from;

  const { text: dText, replied_mid: dRepliedMid } = draft || {};
  if (!message && !dText && !dRepliedMid) return null;

  if ((dText || dRepliedMid) && countOfUnreadMessages < 1) {
    return (
      <div className="flex flex-1 items-center gap-[5px] overflow-y-hidden">
        <p className="flex items-center gap-[3px] text-(--color-accent-dark) text-nowrap font-light!">
          {dRepliedMid && <Reply strokeWidth={2} />} Draft:
        </p>
        <p className="w-full font-light! text-(--color-text-dark) overflow-hidden text-ellipsis whitespace-nowrap">
          {dText}
        </p>
      </div>
    );
  }

  const { attachments, body } = message || {};
  const lastAtt = attachments?.slice(-1)[0];

  const buildLastMessageText = (
    text: string | undefined,
    att?: { file_name?: string; file_content_type?: string }
  ) => {
    if (text) return text;
    if (att?.file_name || att?.file_content_type)
      return mediaUtils.getFileType(att.file_name, att.file_content_type);
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
      <div className="flex flex-1 items-center gap-[5px] overflow-y-hidden">
        {isShowUserName ? (
          <p className="text-(--color-accent-dark) text-nowrap font-light!">
            {displayName}:
          </p>
        ) : null}
        {lastAtt ? <LastMessageMedia attachment={lastAtt} /> : null}
        <p className="w-full font-light! text-(--color-text-dark) overflow-hidden text-ellipsis whitespace-nowrap">
          {buildLastMessageText(body, lastAtt)}
        </p>
      </div>
      {countOfUnreadMessages > 0 ? (
        <div
          className="px-[6px] py-[4px] !font-light text-white rounded-[12px] bg-accent-dark"
          style={{ padding: "4px 6px" }}
        >
          {countOfUnreadMessages}
        </div>
      ) : (
        <LastMessageStatus
          message={message}
          isCurrentUser={isAuthorCurrentUser}
        />
      )}
    </>
  );
};
