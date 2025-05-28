import { useEffect, useMemo, useState } from "react";

import MediaBlurHash from "@components/attach/components/MediaBlurHash.js";

export default function ImageView({ image, onClickFunc, isFullSize = true }) {
  const [loadStatus, setLoadStatus] = useState("load");

  const { file_name, file_url, file_blur_hash } = image || {};

  const preloaderView = useMemo(() => {
    if (loadStatus === "success") return null;

    return <MediaBlurHash status={loadStatus} blurHash={file_blur_hash} />;
  }, [loadStatus, file_blur_hash]);

  useEffect(() => {
    if (!file_url) return;
    const img = new Image();
    img.onerror = () => setLoadStatus("error");
    img.src = file_url;
    return () => {
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
        onClick={loadStatus !== "error" ? onClickFunc : null}
        alt={file_name}
        src={file_url}
      />
      {preloaderView}
    </>
  );
}
