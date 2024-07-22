import LastMessageMedia from "@components/message/lastMessage/LastMessageMedia";
import LastMessageStatus from "@components/message/lastMessage/LastMessageStatus";
import getFileType from "@utils/media/get_file_type";

export default function LastMessage({ message, count, userId, viewName }) {
  if (!message) {
    return null;
  }

  const { attachments, body } = message;
  const lastAtt = attachments?.slice(-1)[0];

  const lastMessageText = (text, att, name) => {
    if (!text && !att) {
      return "";
    }
    const fileType = att && getFileType(att.file_name);

    const textWithName = (
      <>
        {name ? <span>{name}: </span> : null}
        {text}
      </>
    );

    return textWithName || fileType || "";
  };

  return (
    <>
      <div className="content-bottom__last-message">
        {lastAtt ? <LastMessageMedia attachment={lastAtt} /> : null}
        <p className="last-message__text">
          {lastMessageText(body, lastAtt, viewName)}
        </p>
      </div>
      {count > 0 ? (
        <div className="content-bottom__indicator">{count}</div>
      ) : (
        <LastMessageStatus message={message} userId={userId} />
      )}
    </>
  );
}
