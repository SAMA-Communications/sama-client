import AttachmentItem from "@components/attach/components/AttachmentItem";
import addSuffix from "@src/utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

import "@styles/hub/elements/MessageMedia.css";

export default function MessageAttachments({ attachments, mid }) {
  const { pathname, hash } = useLocation();

  if (!attachments) {
    return null;
  }

  return (
    <div className="message-media__container">
      {attachments.map((att, index) => (
        <AttachmentItem
          key={att.file_id}
          file={att}
          onClickfunc={() =>
            addSuffix(pathname + hash, `/media?mid=${mid}=${index}`)
          }
        />
      ))}
    </div>
  );
}
