import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { useRef, useState } from "react";

import { useKeyDown } from "@hooks/useKeyDown";
import { useTouchScreen } from "@hooks/useTouchScreen";

import ImageView from "./components/ImageView.js";
import VideoView from "./components/VideoView.js";

import { getFileType } from "@utils/MediaUtils.js";
import { removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import { KEY_CODES } from "@utils/constants.js";

import { getIsMobileView } from "@store/values/IsMobileView";
import { getMessageById } from "@store/values/Messages";

import Prev from "@icons/options/Prev.svg?react";
import Next from "@icons/options/Next.svg?react";
import Close from "@icons/actions/CloseGray.svg?react";

export default function MediaHub() {
  const { pathname, hash } = useLocation();
  const isMobile = useSelector(getIsMobileView);
  const swipedBlockRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(() => {
    const [, , index] = hash.split("=");
    return +index;
  });

  const mid = hash.split("=")[1];
  const { attachments = [] } =
    useSelector((state) => getMessageById(state, mid)) || {};

  const isLastIndex = currentIndex === attachments.length - 1;
  const isFirstIndex = currentIndex === 0;

  const closeModal = () => removeAndNavigateLastSection(pathname + hash);

  useKeyDown(
    KEY_CODES.ARROW_RIGHT,
    () => !isLastIndex && setCurrentIndex(currentIndex + 1)
  );
  useKeyDown(
    KEY_CODES.ARROW_LEFT,
    () => !isFirstIndex && setCurrentIndex(currentIndex - 1)
  );

  useTouchScreen(swipedBlockRef, {
    left: () => !isFirstIndex && setCurrentIndex(currentIndex - 1),
    right: () => !isLastIndex && setCurrentIndex(currentIndex + 1),
    down: closeModal,
    up: closeModal,
  });

  const currentAttachment = attachments[currentIndex];
  const currentFileType = getFileType(
    currentAttachment?.file_name,
    currentAttachment?.file_content_type
  );

  return (
    <div
      className="absolute top-0 w-dvw h-dvh flex flex-col bg-[var(--color-black-90)] z-10"
      onClick={!isMobile ? closeModal : undefined}
    >
      {isMobile && (
        <button className="absolute top-10 right-10 z-11" onClick={closeModal}>
          <Close />
        </button>
      )}
      <div className="flex justify-center flex-shrink pt-8 pb-2">
        <p className="text-lg text-gray-300">
          {currentIndex + 1 + " / " + attachments.length}
        </p>
      </div>
      <div
        ref={swipedBlockRef}
        className="max-h-[calc(100dvh-250px)] px-[30px] md:px-[max(10%,90px)] flex-1 flex justify-center items-center"
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
          className="absolute top-0 left-0 w-[max(8%,80px)] h-full flex justify-center items-center cursor-pointer duration-200 select-none hover:bg-[var(--color-bg-light-25)] opacity-0 md:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex - 1);
          }}
        >
          <Prev />
        </div>
      )}
      {!isLastIndex && (
        <div
          className="absolute top-0 right-0 w-[max(8%,80px)] h-full flex justify-center items-center cursor-pointer duration-200 select-none hover:bg-[var(--color-bg-light-25)] opacity-0 md:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex(currentIndex + 1);
          }}
        >
          <Next />
        </div>
      )}
      <div className="h-[min(175px,20%)] flex-shrink pt-3 pb-3 flex justify-center items-center gap-2.5">
        {attachments.map((file, i) => (
          <div
            key={i}
            className={`${
              i === currentIndex ? "h-full w-[10%]" : "h-[85%] w-[8%]"
            } overflow-hidden cursor-pointer rounded-xl`}
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
