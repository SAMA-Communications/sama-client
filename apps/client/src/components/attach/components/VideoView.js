import { useMemo, useState, useEffect, useRef } from "react";

import PlayButton from "@components/_helpers/PlayButton.js";
import MediaBlurHash from "@components/attach/components/MediaBlurHash.js";

export default function VideoView({
  video,
  onClickFunc,
  isFullSize = true,
  removePlayButton = false,
  enableControls = false,
}) {
  const [loadStatus, setLoadStatus] = useState("load");

  const { file_name, file_url, file_blur_hash } = video || {};

  const preloaderView = useMemo(() => {
    if (loadStatus === "success") {
      return enableControls || removePlayButton ? null : (
        <PlayButton onClickFunc={onClickFunc} />
      );
    }

    return <MediaBlurHash status={loadStatus} blurHash={file_blur_hash} />;
  }, [loadStatus, file_blur_hash]);

  const videoRef = useRef(null);

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
        className={`${
          isFullSize ? "w-full h-full" : "max-w-full max-h-full"
        } object-cover`}
        controls={enableControls}
        autoPlay={enableControls}
        src={file_url + "#t=0.1"}
        poster={file_name}
        onClick={onClickFunc}
      />
      {preloaderView}
    </>
  );
}
