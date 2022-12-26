import MessageAttachment from "../../generic/MessageAttachment";

export default function MessageAttachments({ attachments }) {
  const attachmentPreloader = (key) => (
    <div
      key={key}
      style={{
        backgroundColor: "#fff",
        width: "100px",
        height: "100px",
        margin: "5px 5px 0 5px",
      }}
    ></div>
  );

  return attachments ? (
    <div className="message-file">
      {attachments.map((el) =>
        el.file_url ? (
          <MessageAttachment
            key={el.file_url}
            url={el.file_url}
            name={el.file_name}
          />
        ) : (
          attachmentPreloader(el.file_name)
        )
      )}
    </div>
  ) : null;
}
