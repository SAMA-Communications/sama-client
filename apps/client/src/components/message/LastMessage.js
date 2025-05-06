import LastMessageMedia from "@components/message/lastMessage/LastMessageMedia";
import LastMessageStatus from "@components/message/lastMessage/LastMessageStatus";

import getFileType from "@utils/media/get_file_type";

export default function LastMessage({ message, count, userId, viewName }) {
  if (!message) {
    return null;
  }

  const { attachments, body } = message;
  const lastAtt = attachments?.slice(-1)[0];

  const lastMessageText = (text, att) => {
    if (!text && !att) {
      return "";
    }
    const fileType = att && getFileType(att.file_name);

    return text || fileType || "";
  };

  return (
    <>
      <div className="flex flex-1 items-center gap-[5px] overflow-y-hidden">
        <p className="text-(--color-accent-dark) text-nowrap !font-light">
          {viewName ? `${viewName}:` : null}
        </p>
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
