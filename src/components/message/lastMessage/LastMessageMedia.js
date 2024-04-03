import getFileType from "@utils/media/get_file_type";
import { Blurhash } from "react-blurhash";

import { ReactComponent as Image } from "@icons/media/Image.svg";
import { ReactComponent as Video } from "@icons/media/Video.svg";

export default function LastMessageMedia({ attachment }) {
  const attIcons = {
    Image: <Image />,
    Video: <Video />,
  };

  return (
    <div className="last-message__media">
      {attachment.file_blur_hash ? (
        <Blurhash
          className="image__blur-hash"
          hash={attachment.file_blur_hash}
          resolutionX={32}
          resolutionY={32}
        />
      ) : (
        attIcons[getFileType(attachment.file_name)]
      )}
    </div>
  );
}
