import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useLocation } from "react-router";
import { motion as m } from "motion/react";

import PlayButton from "@components/_helpers/PlayButton.js";

import addSuffix from "@utils/navigation/add_suffix";
import getFileType from "@utils/media/get_file_type.js";

export default function MessageAttachments({ attachments, mid }) {
  const { pathname, hash } = useLocation();

  if (!attachments) {
    return null;
  }

  const attCount = attachments.length;
  const getColumnCount = () => (attCount < 3 ? 1 : attCount % 2 ? 3 : 2);

  return (
    <ResponsiveMasonry
      className="w-[440px] max-w-full"
      columnsCountBreakPoints={{ 350: 1, 768: getColumnCount() }}
    >
      <Masonry className="gap-[5px]! media-gallery">
        {attachments.map((att, index) => (
          <m.div
            key={att.file_name}
            layout
            className="masonry-item w-full max-h-[200px] h-full overflow-hidden rounded-lg cursor-pointer"
          >
            {getFileType(att.file_name) === "Video" ? (
              <>
                <video
                  src={att.file_url}
                  alt={att.file_name}
                  className="w-full h-full object-cover"
                  onClick={() =>
                    addSuffix(pathname + hash, `/media?mid=${mid}=${index}`)
                  }
                />
                <PlayButton />
              </>
            ) : (
              <img
                src={att.file_url}
                alt={att.file_name}
                className="w-full h-full object-cover "
                onClick={() =>
                  addSuffix(pathname + hash, `/media?mid=${mid}=${index}`)
                }
              />
            )}
          </m.div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}
