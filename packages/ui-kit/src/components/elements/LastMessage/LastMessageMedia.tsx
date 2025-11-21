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
    Image: <ImageIcon className="w-4 h-4 text-text-light)" strokeWidth={2} />,
    Video: <VideoIcon className="w-4 h-4 text-text-light)" strokeWidth={2} />,
  };

  return (
    <div className="w-auto max-w-[24px] h-[16px] flex items-center justify-center">
      {attachment.file_blur_hash ? (
        <Blurhash
          hash={attachment.file_blur_hash}
          className="w-4! h-4! rounded-[3px] overflow-hidden"
          resolutionX={32}
          resolutionY={32}
        />
      ) : (
        icons[type]
      )}
    </div>
  );
};
