import LastMessageMedia from "@components/message/lastMessage/LastMessageMedia";
import getFileType from "@utils/media/get_file_type";
import MessageIndicator from "./elements/MessageIndicator";

export default function LastMessage({
  message,
  count,
  userId,
  viewName,
  isEncrypted,
}) {
  if (isEncrypted) {
    return (
      <>
        <div className="content-bottom__last-message">
          <p className="last-message__text">Encrypted chat</p>
        </div>
        <MessageIndicator message={message} userId={userId} count={count} />
      </>
    );
  }

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
      <div className="content-bottom__last-message">
        <p className="last-message__uname">
          {viewName ? `${viewName}:` : null}
        </p>
        {lastAtt ? <LastMessageMedia attachment={lastAtt} /> : null}
        <p className="last-message__text">{lastMessageText(body, lastAtt)}</p>
      </div>
      <MessageIndicator message={message} userId={userId} count={count} />
    </>
  );
}
