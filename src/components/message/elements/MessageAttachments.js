import MessageAttachment from "@components/message/elements/MessageAttachment";
import React from "react";

import "@styles/hub/elements/MessageMedia.css";

export default function MessageAttachments({ attachments }) {
  if (!attachments) {
    return null;
  }

  return (
    <div className="message-media__container">
      {attachments.map((att) => (
        <MessageAttachment
          key={att.file_id}
          id={att.file_id}
          url={att.file_url}
          name={att.file_name}
          localUrl={att.file_local_url}
          blurHash={att.file_blur_hash}
        />
      ))}
    </div>
  );
}
