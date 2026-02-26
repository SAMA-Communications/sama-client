import MediaAttachment from "./MediaAttachment.js";

import { chunkMedia, normalizeRatio } from "@utils/MediaUtils.js";

export default function MediaAttachments({
  maxWidth = null,
  maxHeight = null,
  attachments,
  mid,
  removeFileFunc,
  disableAnimation = false,
  onContextMenu,
}) {
  if (!attachments?.length) return null;

  const rows = chunkMedia(attachments);

  return (
    <div
      className={`w-full ${
        maxWidth ? `max-w-[${maxWidth}]` : "max-w-[520px]"
      } ${maxHeight ? `max-h-[${maxHeight}]` : "max-h-[660px]"} ${
        maxHeight ? `max-sm:max-h-${maxHeight}]` : "max-sm:max-h-[440px]"
      } flex min-h-[350px] flex-col gap-0.75 overflow-hidden rounded-lg sm:min-w-[300px]`}
    >
      {rows.map((row, rowIndex) => {
        const totalRatio = row.reduce((acc, att) => acc + normalizeRatio(att.file_width / att.file_height), 0);
        return (
          <div
            key={rowIndex}
            className={`flex flex-1 flex-row gap-0.75 overflow-hidden ${mid ? "cursor-pointer" : ""}`}
          >
            {row.map((att, idx) => {
              const ratio = normalizeRatio(att.file_width / att.file_height);
              const flexGrow = ratio / totalRatio;
              return (
                <MediaAttachment
                  key={idx}
                  index={attachments.findIndex((a) => a === att)}
                  mid={mid}
                  attachment={att}
                  flexGrow={flexGrow}
                  removeFileFunc={removeFileFunc}
                  disableAnimation={disableAnimation}
                  onContextMenu={(e) => onContextMenu(e, att)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
