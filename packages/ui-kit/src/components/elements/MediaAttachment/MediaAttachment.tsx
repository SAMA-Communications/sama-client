import { memo, useMemo } from "react";
import { clsx } from "clsx";
import { Trash2 } from "lucide-react";

import { ImageView } from "../ImageView";
import { VideoView } from "../VideoView";
import { WrapperRoot } from "../WrapperRoot";
import { getFileType } from "../../../utils/mediaUtils";
import type { MediaAttachmentProps } from "./MediaAttachment.types";

const baseClassName = "ui:relative ui:flex ui:items-center ui:justify-center ui:overflow-hidden ui:rounded-sm";

export const MediaAttachment = memo(function MediaAttachment({
  index,
  attachment,
  flexGrow,
  onClick,
  onContextMenu,
  removeFileFunc,
  disableAnimation = false,
  className,
  style,
  ...rest
}: MediaAttachmentProps) {
  const { file_name, file_url, file_content_type } = attachment;
  const isVideo = getFileType(file_name || file_url, file_content_type) === "Video";

  const animation = useMemo(
    () =>
      disableAnimation
        ? undefined
        : {
            hidden: { scale: 0.97 },
            visible: {
              scale: 1,
              transition: { duration: 0.3, delay: index * 0.05 + 0.15 },
            },
          },
    [disableAnimation, index],
  );

  return (
    <WrapperRoot
      variants={animation}
      initial={animation ? "hidden" : undefined}
      animate={animation ? "visible" : undefined}
      className={clsx(baseClassName, className)}
      style={{ flexGrow, flexBasis: 0, ...style }}
      onContextMenu={onContextMenu}
      {...rest}
    >
      {isVideo ? (
        <VideoView video={attachment} onClick={onClick} />
      ) : (
        <ImageView image={attachment} onClick={onClick} />
      )}
      {removeFileFunc && (
        <button
          type="button"
          className="ui:absolute ui:top-0.75 ui:right-0.75 ui:cursor-pointer ui:rounded-sm ui:border-0 ui:bg-bg-dark/50 ui:p-0.75"
          onClick={() => removeFileFunc(index)}
          aria-label="Remove"
        >
          <Trash2 size={14} className="ui:text-white" />
        </button>
      )}
    </WrapperRoot>
  );
});
