import ImageView from "@newcomponents/message/elements/ImageView";
import VideoView from "@newcomponents/message/elements/VideoView";
import getFileType from "@utils/get_file_type";
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
      className="media-attachment"
      onClick={() => {
        navigate(hash + `/modal?id=${id.replaceAll(" ", "%")}`);
      }}
    >
      {getFileType(name) === "Video" ? (
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
