import { FC, useEffect, useMemo, useState } from "react";

import { ImageViewProps } from "./ImageView.types";
import { MediaBlurHash } from "../MediaBlurHash";

export const ImageView: FC<ImageViewProps> = ({
  image,
  onClickFunc,
  isFullSize = true,
  mediaBlurHashProps = {},
}) => {
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );

  const { file_name, file_url, file_blur_hash } = image || {};

  const preloaderView = useMemo(() => {
    if (loadStatus === "success") return null;

    return (
      <MediaBlurHash
        status={loadStatus}
        blurHash={file_blur_hash}
        {...mediaBlurHashProps}
      />
    );
  }, [loadStatus, file_blur_hash, mediaBlurHashProps]);

  useEffect(() => {
    if (!file_url) return;
    const img = new Image();
    img.onload = () => setLoadStatus("success");
    img.onerror = () => setLoadStatus("error");
    img.src = file_url;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [file_url]);

  return (
    <>
      <img
        className={`${
          isFullSize ? "w-full h-full" : "max-w-full max-h-full"
        } object-cover`}
        onLoad={() => setLoadStatus("success")}
        onError={() => setLoadStatus("error")}
        onClick={loadStatus !== "error" ? onClickFunc : undefined}
        alt={file_name}
        src={file_url}
      />
      {preloaderView}
    </>
  );
};
