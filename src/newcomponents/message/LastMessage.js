import LastMessageMedia from "@newcomponents/message/lastMessage/LastMessageMedia";
import LastMessageStatus from "@newcomponents/message/lastMessage/LastMessageStatus";
import getFileType from "@utils/get_file_type";

export default function LastMessage({ message, count, userId }) {
  if (!message) {
    return null;
  }

  const { attachments, body } = message;
  const lastAtt = attachments?.slice(-1)[0];

  return (
    <>
      <div className="content-bottom__last-message">
        {lastAtt ? <LastMessageMedia attachment={lastAtt} /> : null}
        <p className="last-message__text">
          {body?.length ? body : getFileType(lastAtt?.file_name)}
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
