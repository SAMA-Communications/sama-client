import LastMessageMedia from "@components/message/lastMessage/LastMessageMedia";
import LastMessageStatus from "@components/message/lastMessage/LastMessageStatus";

import getFileType from "@utils/media/get_file_type";

import Reply from "@icons/context/ReplyAccent.svg?react";

export default function LastMessage({
  message,
  draft,
  count,
  userId,
  viewName,
}) {
  const { text: dText, replied_mid: dRepliedMid } = draft || {};
  if (!message && !dText && !dRepliedMid) return null;

  if ((dText || dRepliedMid) && count < 1) {
    return (
      <div className="flex flex-1 items-center gap-[5px] overflow-y-hidden">
        <p className="flex items-center gap-[3px] text-(--color-accent-dark) text-nowrap !font-light">
          {dRepliedMid && <Reply />} Draft:
        </p>
        <p className="w-full !font-light text-(--color-text-dark) overflow-hidden text-ellipsis whitespace-nowrap">
          {dText}
        </p>
      </div>
    );
  }

  const { attachments, body } = message || {};
  const lastAtt = attachments?.slice(-1)[0];

  const lastMessageText = (text, att) => {
    if (text) return text;
    if (att?.file_name || att?.file_content_type)
      return getFileType(att.file_name, att.file_content_type);
    return "";
  };

  return (
    <>
      <div className="flex flex-1 items-center gap-[5px] overflow-y-hidden">
        {viewName && (
          <p className="text-(--color-accent-dark) text-nowrap !font-light">
            {viewName}:
          </p>
        )}
        {lastAtt ? <LastMessageMedia attachment={lastAtt} /> : null}
        <p className="w-full !font-light text-(--color-text-dark) overflow-hidden text-ellipsis whitespace-nowrap">
          {lastMessageText(body, lastAtt)}
        </p>
      </div>
      {count > 0 ? (
        <div className="px-[6px] py-[4px] !font-light text-white rounded-[12px] bg-(--color-accent-dark)">
          {count}
        </div>
      ) : (
        <LastMessageStatus message={message} userId={userId} />
      )}
    </>
  );
}
