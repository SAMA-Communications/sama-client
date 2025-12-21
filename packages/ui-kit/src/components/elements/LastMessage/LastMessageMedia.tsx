import { Blurhash } from "react-blurhash";
import { ImageIcon, VideoIcon } from "lucide-react";

import { MessageAttachment } from "types/samaWssModels";

export interface LastMessageMediaProps {
  attachment: MessageAttachment;
  fileType?: "Image" | "Video";
}

export const LastMessageMedia = ({
  attachment,
  fileType,
}: LastMessageMediaProps) => {
  const type =
    fileType ??
    (attachment.file_content_type?.startsWith("image")
      ? "Image"
      : attachment.file_content_type?.startsWith("video")
      ? "Video"
      : "Image");
  ///  getFileType(attachment.file_name, attachment.file_content_type)

  const icons = {
    Image: <ImageIcon color={"#6d6d6d"} size={16} strokeWidth={1} />,
    Video: <VideoIcon color={"#6d6d6d"} size={16} strokeWidth={1} />,
  };

  return (
    <div className="w-[16px] h-[16px] flex items-center justify-center">
      {attachment.file_blur_hash ? (
        <Blurhash
          hash={attachment.file_blur_hash}
          className="!w-[16px] !h-[16px] rounded-[3px] overflow-hidden"
          style={{ width: 16, height: 16, borderRadius: 3, overflow: "hidden" }} //tmp
          resolutionX={32}
          resolutionY={32}
        />
      ) : (
        icons[type]
      )}
    </div>
  );
};
