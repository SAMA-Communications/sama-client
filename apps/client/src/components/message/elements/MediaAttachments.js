import MediaAttachment from "./MediaAttachment.js";

import chunkMedia from "@utils/media/chunk_media.js";
import normalizeRatio from "@utils/media/normalize_ratio.js";

export default function MediaAttachments({
  maxWidth = null,
  maxHeight = null,
  attachments,
  mid,
  removeFileFunc,
  disableAnimation = false,
}) {
  if (!attachments?.length) return null;

  const rows = chunkMedia(attachments);

  return (
    <div
      className={`w-full ${
        maxWidth ? `max-w-[${maxWidth}]` : "max-w-[550px]"
      } ${maxHeight ? `max-h-[${maxHeight}]` : "max-h-[660px]"} ${
        maxHeight ? `max-sm:max-h-${maxHeight}]` : "max-sm:max-h-[440px]"
      } min-h-[350px] min-w-[300px] flex flex-col gap-1 overflow-hidden rounded-lg`}
    >
      {rows.map((row, rowIndex) => {
        const totalRatio = row.reduce(
          (acc, att) => acc + normalizeRatio(att.file_width / att.file_height),
          0
        );
        return (
          <div
            key={rowIndex}
            className={`flex flex-row gap-1 flex-1 overflow-hidden ${
              mid ? "cursor-pointer" : ""
            }`}
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
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
