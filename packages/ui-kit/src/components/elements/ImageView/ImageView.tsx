import { useEffect, useMemo, useState } from "react";

import { MediaBlurHash } from "../MediaBlurHash";

import { ImageViewProps } from "./ImageView.types";

export const ImageView = ({ image, onClick, isFullSize = true, mediaBlurHashProps = {} }: ImageViewProps) => {
  const [loadStatus, setLoadStatus] = useState<"loading" | "error" | "success">("loading");

  const { file_name, file_url, file_blur_hash } = image || {};

  const preloaderView = useMemo(() => {
    if (loadStatus === "success") return null;

    return <MediaBlurHash status={loadStatus} blurHash={file_blur_hash} {...mediaBlurHashProps} />;
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
        className={`ui:object-cover ${isFullSize ? "ui:h-full ui:w-full" : "ui:max-h-full ui:max-w-full"}`}
        onLoad={() => setLoadStatus("success")}
        onError={() => setLoadStatus("error")}
        onClick={loadStatus !== "error" ? onClick : undefined}
        alt={file_name}
        src={file_url}
      />
      {preloaderView}
    </>
  );
};
