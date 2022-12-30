import MessageAttachment from "../../generic/MessageAttachment";

export default function MessageAttachments({ attachments, openModalParam }) {
  const attachmentPreloader = (key) => (
    <div key={key} className="attachment-preloader"></div>
  );

  if (attachments) {
    const arrayAtts = [];

    for (const att of attachments) {
      if (att.file_url) {
        arrayAtts.push(
          <MessageAttachment
            key={att.file_url}
            url={att.file_url}
            name={att.file_name}
            openModalParam={openModalParam}
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
