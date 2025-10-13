import * as m from "motion/react-m";

import { useLocation } from "react-router";

import ImageView from "@components/attach/components/ImageView.js";
import VideoView from "@components/attach/components/VideoView.js";

import { addSuffix } from "@utils/NavigationUtils.js";
import getFileType from "@utils/media/get_file_type.js";

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

  const isVideo =
    getFileType(file_name || file_url, file_content_type) === "Video";

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
      className={`relative overflow-hidden flex justify-center items-center`}
      style={{ flexGrow, flexBasis: 0 }}
      onContextMenu={onContextMenu}
    >
      {isVideo ? (
        <VideoView video={attachment} onClickFunc={openMediaWindow} />
      ) : (
        <ImageView image={attachment} onClickFunc={openMediaWindow} />
      )}
      {removeFileFunc && (
        <div
          className="absolute right-[3px] top-[3px] p-[3px] bg-(--color-bg-dark)/50 rounded-sm cursor-pointer"
          onClick={() => removeFileFunc(index)}
        >
          <Delete />
        </div>
      )}
    </m.div>
  );
}
