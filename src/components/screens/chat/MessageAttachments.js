import MessageAttachment from "../../generic/MessageAttachment";

export default function MessageAttachments({ attachments }) {
  const attachmentPreloader = (key) => (
    <div key={key} className="attachment-preloader"></div>
  );

  if (attachments) {
    const arrayAtts = [];

    for (let i = 0; i < attachments.length; i++) {
      const att = attachments[i];

      if (att.file_url) {
        arrayAtts.push(
          <MessageAttachment
            key={att.file_url}
            url={att.file_url}
            name={att.file_name}
          />
        );
      } else {
        arrayAtts.push(attachmentPreloader(att.file_name));
      }
    }

    return <div className="message-file">{arrayAtts}</div>;
  } else {
    return null;
  }
}
