import ImageView from "../attachmentComponents/ImageView";
import VideoView from "../attachmentComponents/VideoView";
import { useLocation, useNavigate } from "react-router-dom";

export default function MessageAttachment({
  id,
  url,
  name,
  localUrl,
  blurHash,
}) {
  const { hash } = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className="attachment-img"
      style={{ gridColumnEnd: `span ${1}`, gridRowEnd: `span ${1}` }}
      onClick={() => {
        navigate(hash + `/modal?id=${id.replaceAll(" ", "%")}`);
      }}
    >
      {name.includes(".mp4") ? (
        <VideoView url={url} posterName={name} />
      ) : (
        <ImageView
          url={url}
          localUrl={localUrl}
          blurHash={blurHash}
          altName={name}
        />
      )}
    </div>
  );
}
