export default function MessageAttachments({ attachments }) {
  return attachments ? (
    <div className="message-file">
      {attachments.map((el) =>
        el.file_url ? (
          <img src={el.file_url} alt={el.file_name} key={el.file_url} />
        ) : (
          <div
            key={el.file_name}
            style={{
              backgroundColor: "#fff",
              width: "100px",
              height: "100px",
              margin: "5px 5px  0 5px",
            }}
          ></div>
        )
      )}
    </div>
  ) : null;
}
