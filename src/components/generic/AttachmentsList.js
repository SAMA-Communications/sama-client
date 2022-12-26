export default function AttachmentsList({ files }) {
  return (
    <div className="chat-files-preview">
      {Object.values(files).map((el) => (
        <p key={el.name}>{el.name}</p>
      ))}
    </div>
  );
}
