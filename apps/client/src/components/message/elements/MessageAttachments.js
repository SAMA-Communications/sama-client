import ImageView from "@components/attach/components/ImageView.js";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

import "@styles/hub/elements/MessageMedia.css";

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
          <div
            key={att.file_id}
            className="masonry-item w-full max-h-[200px] h-full overflow-hidden rounded-lg"
          >
            <ImageView
              url={att.file_url}
              blurHash={att.file_blur_hash}
              altName={att.file_name}
              onClickFunc={() =>
                addSuffix(pathname + hash, `/media?mid=${mid}=${index}`)
              }
            />
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}
