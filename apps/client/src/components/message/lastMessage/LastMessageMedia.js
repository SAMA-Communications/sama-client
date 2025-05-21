import { Blurhash } from "react-blurhash";

import getFileType from "@utils/media/get_file_type";

import Image from "@icons/media/Image.svg?react";
import Video from "@icons/media/Video.svg?react";

export default function LastMessageMedia({ attachment }) {
  const attIcons = {
    Image: <Image />,
    Video: <Video />,
  };

  return (
    <div className="w-auto max-w-[24px] h-[16px]">
      {attachment.file_blur_hash ? (
        <Blurhash
          className="!w-[16px] !h-[16px] rounded-[3px] overflow-hidden"
          hash={attachment.file_blur_hash}
          resolutionX={32}
          resolutionY={32}
        />
      ) : (
        attIcons[
          getFileType(attachment.file_name, attachment.file_content_type)
        ]
      )}
    </div>
  );
}
