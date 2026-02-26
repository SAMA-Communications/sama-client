import * as m from "motion/react-m";

import { useLocation } from "react-router";

import { ImageView, VideoView } from "@sama-communications.ui-kit";

import { addSuffix } from "@utils/NavigationUtils.js";
import { getFileType } from "@utils/MediaUtils.js";

import Delete from "@icons/options/Delete.svg?react";

export default function AttachmentCompressed({
  index,
  mid,
  attachment,
  flexGrow,
  removeFileFunc,
  onContextMenu,
  disableAnimation = false,
}) {
  const { pathname, hash } = useLocation();

  const { file_name, file_url, file_content_type } = attachment;

  const isVideo = getFileType(file_name || file_url, file_content_type) === "Video";

  const openMediaWindow = () => {
    mid ? addSuffix(pathname + hash, `/media?mid=${mid}=${index}`) : {};
  };

  const animation = disableAnimation
    ? {}
    : {
        hidden: {
          opacity: 0,
          scale: 0.97,
        },
        visible: {
          opacity: 1,
          scale: 1,
          transition: { duration: 0.3, delay: index * 0.05 + 0.15 },
        },
        transition: {
          duration: 0.3,
          delay: index * 0.05 + 0.15,
        },
      };

  return (
    <m.div
      variants={animation}
      initial="hidden"
      animate="visible"
      key={file_name || file_url}
      className={`relative flex items-center justify-center overflow-hidden rounded-sm`}
      style={{ flexGrow, flexBasis: 0 }}
      onContextMenu={onContextMenu}
    >
      {isVideo ? (
        <VideoView video={attachment} onClick={openMediaWindow} />
      ) : (
        <ImageView image={attachment} onClick={openMediaWindow} />
      )}
      {removeFileFunc && (
        <div
          className="absolute top-[3px] right-[3px] cursor-pointer rounded-sm bg-(--color-bg-dark)/50 p-[3px]"
          onClick={() => removeFileFunc(index)}
        >
          <Delete />
        </div>
      )}
    </m.div>
  );
}
