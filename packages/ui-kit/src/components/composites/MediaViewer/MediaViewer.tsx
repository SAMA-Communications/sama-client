import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { MediaViewerProps } from "@composites/MediaViewer/MediaViewer.types";

import { ImageView } from "@elements/ImageView";
import { VideoView } from "@elements/VideoView";
import { WrapperRoot } from "@elements/WrapperRoot";

import { getFileType as defaultGetFileType } from "@utils/mediaUtils";

export const MediaViewer = ({
  attachments,
  currentIndex,
  onIndexChange,
  onClose,
  getFileType = defaultGetFileType,
  isMobile = false,
  swipeRef,
  className,
  style,
  ...rest
}: MediaViewerProps) => {
  const isLastIndex = currentIndex === attachments.length - 1;
  const isFirstIndex = currentIndex === 0;

  const currentAttachment = attachments[currentIndex];
  const currentFileType = getFileType(currentAttachment?.file_name, currentAttachment?.file_content_type);

  return (
    <WrapperRoot
      ref={swipeRef}
      className={clsx("ui:absolute ui:top-0 ui:z-10 ui:flex ui:h-dvh ui:w-dvw ui:flex-col ui:bg-black/90", className)}
      style={style}
      onClick={!isMobile ? onClose : undefined}
      {...rest}
    >
      {isMobile && (
        <button
          type="button"
          className="ui:absolute ui:top-10 ui:right-10 ui:z-[11] ui:rounded ui:p-1 ui:text-white ui:hover:bg-white/20"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={24} />
        </button>
      )}

      <div className="ui:flex ui:shrink-0 ui:justify-center ui:pt-8 ui:pb-2">
        <p className="ui:text-lg ui:text-gray-300">
          {currentIndex + 1} / {attachments.length}
        </p>
      </div>

      <div
        className="ui:flex ui:max-h-[calc(100dvh-250px)] ui:flex-1 ui:items-center ui:justify-center ui:px-7 ui:md:px-[max(10%,90px)]"
        onClick={(e) => e.stopPropagation()}
      >
        {currentFileType === "Video" ? (
          <VideoView video={currentAttachment} enableControls isFullSize={false} />
        ) : (
          <ImageView image={currentAttachment} isFullSize={false} />
        )}
      </div>

      {!isFirstIndex && (
        <div
          className="ui:absolute ui:top-0 ui:left-0 ui:flex ui:h-full ui:w-[max(8%,80px)] ui:cursor-pointer ui:items-center ui:justify-center ui:opacity-0 ui:duration-200 ui:select-none ui:hover:bg-bg-light/25 ui:md:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(currentIndex - 1);
          }}
        >
          <ChevronLeft className="ui:text-white" size={32} />
        </div>
      )}

      {!isLastIndex && (
        <div
          className="ui:absolute ui:top-0 ui:right-0 ui:flex ui:h-full ui:w-[max(8%,80px)] ui:cursor-pointer ui:items-center ui:justify-center ui:opacity-0 ui:duration-200 ui:select-none ui:hover:bg-bg-light/25 ui:md:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onIndexChange(currentIndex + 1);
          }}
        >
          <ChevronRight className="ui:text-white" size={32} />
        </div>
      )}

      <div className="ui:flex ui:h-[min(175px,20%)] ui:flex-shrink-0 ui:items-center ui:justify-center ui:gap-2.5 ui:pt-3 ui:pb-3">
        {attachments.map((file, i) => (
          <button
            key={i}
            type="button"
            className={`ui:cursor-pointer ui:overflow-hidden ui:rounded-xl ui:border-0 ui:bg-transparent ui:p-0 ${
              i === currentIndex ? "ui:h-full ui:w-[10%]" : "ui:h-[85%] ui:w-[8%]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(i);
            }}
          >
            {getFileType(file.file_name, file.file_content_type) === "Video" ? (
              <VideoView video={file} removePlayButton />
            ) : (
              <ImageView image={file} />
            )}
          </button>
        ))}
      </div>
    </WrapperRoot>
  );
};
