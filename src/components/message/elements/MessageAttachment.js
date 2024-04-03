import ImageView from "@components/attach/components/ImageView";
import VideoView from "@components/attach/components/VideoView";
import getFileType from "@utils/media/get_file_type";

export default function MessageAttachment({ url, name, localUrl, blurHash }) {
  return getFileType(name) === "Video" ? (
    <VideoView url={url} posterName={name} />
  ) : (
    <ImageView
      url={url}
      localUrl={localUrl}
      blurHash={blurHash}
      altName={name}
    />
  );
}
