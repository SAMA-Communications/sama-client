import { FC, useMemo, useState, useEffect, useRef } from "react";

import { VideoViewProps } from "./VideoView.types";
import { MediaBlurHash } from "../MediaBlurHash";
import { PlayButton } from "./PlayButton";

export const VideoView: FC<VideoViewProps> = ({
  video,
  onClick,
  isFullSize = true,
  removePlayButton = false,
  enableControls = false,
  mediaBlurHashProps = {},
}) => {
  const [loadStatus, setLoadStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const { file_name, file_url, file_blur_hash } = video || {};
  const videoRef = useRef<HTMLVideoElement>(null);

  const preloaderView = useMemo(() => {
    if (loadStatus === "success") {
      if (enableControls || removePlayButton) return null;
      return <PlayButton onClick={onClick} />;
    }
    return (
      <MediaBlurHash
        status={loadStatus}
        blurHash={file_blur_hash}
        {...mediaBlurHashProps}
      />
    );
  }, [
    loadStatus,
    file_blur_hash,
    enableControls,
    removePlayButton,
    onClick,
    mediaBlurHashProps,
  ]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleLoadedData = () => setLoadStatus("success");
    const handleError = () => setLoadStatus("error");

    videoEl.addEventListener("loadeddata", handleLoadedData);
    videoEl.addEventListener("error", handleError);

    return () => {
      videoEl.removeEventListener("loadeddata", handleLoadedData);
      videoEl.removeEventListener("error", handleError);
    };
  }, [file_url]);

  return (
    <>
      <video
        ref={videoRef}
        data-testid="video"
        className={`${
          isFullSize ? "w-full h-full" : "max-w-full max-h-full"
        } object-cover`}
        controls={enableControls}
        autoPlay={enableControls}
        src={file_url ? `${file_url}#t=0.1` : undefined}
        poster={file_name}
        onClick={onClick}
      />
      {preloaderView}
    </>
  );
};
