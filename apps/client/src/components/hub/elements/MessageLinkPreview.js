import { useState } from "react";

import { formatFileSize } from "@utils/MediaUtils.js";
import { SUPPORTED_DOCUMENT_PREVIEW_REGEX } from "@utils/constants.js";

import { RefreshCcw, File } from "lucide-react";

export default function MessageLinkPreview({ refreshFunc, urlData, color }) {
  if (!urlData) return null;

  const { url, title, siteName, description, images = [], favicons = [], file_name, size } = urlData;
  const [imageError, setImageError] = useState(false);

  const isDocument = SUPPORTED_DOCUMENT_PREVIEW_REGEX.test(url);

  const bgClass = color === "white" ? "bg-bg-dark/5" : "bg-accent-500/20";
  const textClass = color === "white" ? "text-gray-200" : "text-gray-500";

  if (isDocument) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className={`mt-1.25 flex flex-row gap-2.5 p-1.25 ${bgClass} rounded-lg`}>
          <div className={`bg-bg-dark/15 flex h-13.75 w-11.25 items-center justify-center rounded-md px-1.75`}>
            <File size={36} color="white" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="line-clamp-1 overflow-hidden font-light text-ellipsis">{file_name}</p>
            <p className={`text-text-dark font-light ${textClass}`}>{formatFileSize(Number(size))}</p>
          </div>
        </div>
      </a>
    );
  }

  if (!description && images.length === 0) return null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className={`mt-1.25 flex flex-col p-2.5 ${bgClass} rounded-lg`}>
        <div className="flex flex-row items-center gap-1.25">
          {favicons[0] && <img src={favicons[0]} alt="Preview" className="h-2.5 w-2.5 rounded-md object-contain" />}
          <div className="flex flex-1 flex-col">
            {siteName && <p className="line-clamp-1 overflow-hidden text-ellipsis">{siteName}</p>}
            <p className="line-clamp-1 overflow-hidden text-ellipsis">{title}</p>
          </div>
          <RefreshCcw size={18} color="var(--color-hover-dark)" onClick={(e) => refreshFunc(e, url)} />
        </div>
        {description && (
          <p className="text-text-dark mt-0.5 line-clamp-2 overflow-hidden font-light text-ellipsis">{description}</p>
        )}
        {images[0] && !imageError && (
          <img
            src={images[0]}
            alt="Preview"
            className="mt-1 h-full max-h-60 w-full rounded-md object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </a>
  );
}
