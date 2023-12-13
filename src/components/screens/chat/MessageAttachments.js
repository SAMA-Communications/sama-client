import MessageAttachment from "../../generic/messageComponents/MessageAttachment";

export default function MessageAttachments({ attachments }) {
  const attachmentPreloader = (key) => (
    <div key={key} className="attachment-preloader"></div>
  );

  if (!attachments) {
    return null;
  }

  const arrayAtts = [];

  for (const att of attachments) {
    if (att.file_url) {
      arrayAtts.push(
        <MessageAttachment
          key={att.file_id}
          id={att.file_id}
          url={att.file_url}
          name={att.file_name}
        />
      );
    } else {
      arrayAtts.push(attachmentPreloader(att.file_id));
    }
  }

  return <div className="message-file">{arrayAtts}</div>;
}
