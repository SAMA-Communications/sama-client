import { clsx } from "clsx";

import type { MediaAttachmentsProps } from "@composites/MediaAttachments/MediaAttachments.types";

import { MediaAttachment } from "@elements/MediaAttachment";
import { WrapperRoot } from "@elements/WrapperRoot";

import { chunkMedia, normalizeRatio } from "@utils/mediaUtils";

export const MediaAttachments = ({
  attachments,
  mid,
  maxWidth = null,
  maxHeight = null,
  removeFileFunc,
  disableAnimation = false,
  onContextMenu,
  onOpenMedia,
  className,
  style,
  ...rest
}: MediaAttachmentsProps) => {
  if (!attachments?.length) return null;

  const rows = chunkMedia(attachments);

  const maxWidthStyle = maxWidth != null ? (typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth) : "520px";
  const maxHeightStyle = maxHeight != null ? (typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight) : "660px";

  return (
    <WrapperRoot
      className={clsx(
        "ui:flex ui:min-h-[350px] ui:w-full ui:flex-col ui:gap-0.75 ui:overflow-hidden ui:rounded-lg ui:sm:min-w-[300px]",
        className,
      )}
      style={{
        maxWidth: maxWidthStyle,
        maxHeight: maxHeightStyle,
        ...style,
      }}
      {...rest}
    >
      {rows.map((row, rowIndex) => {
        const totalRatio = row.reduce(
          (acc, att) => acc + normalizeRatio((att.file_width ?? 1) / (att.file_height ?? 1)),
          0,
        );
        return (
          <div
            key={rowIndex}
            className={`ui:flex ui:flex-1 ui:flex-row ui:gap-0.75 ui:overflow-hidden ${mid ? "ui:cursor-pointer" : ""}`}
          >
            {row.map((att, idx) => {
              const ratio = normalizeRatio((att.file_width ?? 1) / (att.file_height ?? 1));
              const flexGrow = ratio / totalRatio;
              return (
                <MediaAttachment
                  key={idx}
                  index={attachments.indexOf(att)}
                  attachment={att}
                  flexGrow={flexGrow}
                  onClick={onOpenMedia ? () => onOpenMedia(attachments.indexOf(att)) : undefined}
                  removeFileFunc={removeFileFunc}
                  disableAnimation={disableAnimation}
                  onContextMenu={onContextMenu ? (e) => onContextMenu(e, att) : undefined}
                />
              );
            })}
          </div>
        );
      })}
    </WrapperRoot>
  );
};
