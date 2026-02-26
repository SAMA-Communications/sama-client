import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";

import { useKeyDown } from "@hooks/tools/useKeyDown";
import { useTouchScreen } from "@hooks/tools/useTouchScreen";

import { ImageView, VideoView } from "@sama-communications.ui-kit";

import { getFileType } from "@utils/MediaUtils.js";
import { removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import { KEY_CODES } from "@utils/constants.js";

import { getIsMobileView } from "@store/values/IsMobileView";
import { getMessageById } from "@store/values/Messages";

import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function MediaHub() {
  const { pathname, hash } = useLocation();
  const isMobile = useSelector(getIsMobileView);
  const swipedBlockRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const [, , index] = hash.split("=");
    return +index;
  });

  const mid = hash.split("=")[1];
  const { attachments = [] } = useSelector((state) => getMessageById(state, mid)) || {};

  const isLastIndex = currentIndex === attachments.length - 1;
  const isFirstIndex = currentIndex === 0;

  const closeModal = () => removeAndNavigateLastSection(pathname + hash);

  useKeyDown(KEY_CODES.ARROW_RIGHT, () => !isLastIndex && setCurrentIndex(currentIndex + 1));
  useKeyDown(KEY_CODES.ARROW_LEFT, () => !isFirstIndex && setCurrentIndex(currentIndex - 1));

  useTouchScreen(swipedBlockRef, {
    left: () => !isFirstIndex && setCurrentIndex(currentIndex - 1),
    right: () => !isLastIndex && setCurrentIndex(currentIndex + 1),
    down: closeModal,
    up: closeModal,
  });

  const currentAttachment = attachments[currentIndex];
  const currentFileType = getFileType(currentAttachment?.file_name, currentAttachment?.file_content_type);

  return (
    <div
      className="absolute top-0 z-10 flex h-dvh w-dvw flex-col bg-black/90"
      onClick={!isMobile ? closeModal : undefined}
    >
      {isMobile && (
        <button className="absolute top-10 right-10 z-11" onClick={closeModal}>
          <X />
        </button>
      )}
      <div className="flex shrink justify-center pt-8 pb-2">
        <p className="text-lg text-gray-300">{currentIndex + 1 + " / " + attachments.length}</p>
      </div>
      <div
        ref={swipedBlockRef}
        className="flex max-h-[calc(100dvh-250px)] flex-1 items-center justify-center px-[30px] md:px-[max(10%,90px)]"
      >
        {currentFileType === "Video" ? (
          <VideoView
            video={currentAttachment}
            enableControls={true}
            isFullSize={false}
            onClickFunc={(e) => e.stopPropagation()}
          />
        ) : (
          <ImageView image={currentAttachment} isFullSize={false} />
        )}
      </div>
      {!isFirstIndex && (
        <div
          className="hover:bg-bg-light/25 absolute top-0 left-0 flex h-full w-[max(8%,80px)] cursor-pointer items-center justify-center opacity-0 duration-200 select-none md:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex - 1);
          }}
        >
          <ChevronLeft />
        </div>
      )}
      {!isLastIndex && (
        <div
          className="hover:bg-bg-light/25 absolute top-0 right-0 flex h-full w-[max(8%,80px)] cursor-pointer items-center justify-center opacity-0 duration-200 select-none md:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex + 1);
          }}
        >
          <ChevronRight />
        </div>
      )}
      <div className="flex h-[min(175px,20%)] flex-shrink items-center justify-center gap-2.5 pt-3 pb-3">
        {attachments.map((file, i) => (
          <div
            key={i}
            className={`${
              i === currentIndex ? "h-full w-[10%]" : "h-[85%] w-[8%]"
            } cursor-pointer overflow-hidden rounded-xl`}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(i);
            }}
          >
            {getFileType(file.file_name, file.file_content_type) === "Video" ? (
              <VideoView video={file} removePlayButton={true} />
            ) : (
              <ImageView image={file} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
