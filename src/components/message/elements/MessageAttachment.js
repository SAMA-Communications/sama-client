import ImageView from "@components/message/elements/ImageView";
import VideoView from "@components/message/elements/VideoView";
import getFileType from "@utils/get_file_type";
import navigateTo from "@utils/navigation/navigate_to";
import { useLocation } from "react-router-dom";

export default function MessageAttachment({
  id,
  url,
  name,
  localUrl,
  blurHash,
}) {
  const { hash } = useLocation();

  return (
    <div
      className="media-attachment"
      onClick={() => {
        navigateTo(hash + `/modal?id=${id.replaceAll(" ", "%")}`);
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
