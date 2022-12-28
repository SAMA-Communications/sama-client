export default function MessageAttachment({ url, name }) {
  return (
    <div className="attachment-img">
      <img src={url} alt={name} />
    </div>
  );
}
