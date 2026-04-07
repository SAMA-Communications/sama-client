import { ImageIcon, VideoIcon } from "lucide-react";
import { Blurhash } from "react-blurhash";
import type { MessageAttachment } from "types/samaWssModels";

export interface LastMessageMediaProps {
  isSelected: boolean;
  attachment: MessageAttachment;
  fileType?: "Image" | "Video";
}

export const LastMessageMedia = ({ attachment, fileType, isSelected }: LastMessageMediaProps) => {
  const type =
    fileType ??
    (attachment.file_content_type?.startsWith("image")
      ? "Image"
      : attachment.file_content_type?.startsWith("video")
        ? "Video"
        : "Image");
  ///  getFileType(attachment.file_name, attachment.file_content_type)

  const icons = {
    Image: <ImageIcon color={isSelected ? "white" : "#6d6d6d"} size={16} strokeWidth={1} />,
    Video: <VideoIcon color={isSelected ? "white" : "#6d6d6d"} size={16} strokeWidth={1} />,
  };

  return (
    <div className="ui:flex ui:h-4 ui:w-4 ui:items-center ui:justify-center">
      {attachment.file_blur_hash ? (
        <Blurhash
          hash={attachment.file_blur_hash}
          className="ui:h-4! ui:w-4! ui:overflow-hidden ui:rounded-[3px]"
          resolutionX={32}
          resolutionY={32}
        />
      ) : (
        icons[type]
      )}
    </div>
  );
};
