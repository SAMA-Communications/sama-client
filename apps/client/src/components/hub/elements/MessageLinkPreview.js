import { useState } from "react";

import { formatFileSize } from "@utils/MediaUtils.js";
import { SUPPORTED_DOCUMENT_PREVIEW_REGEX } from "@utils/constants.js";

import File from "@icons/media/File.svg?react";
import Refresh from "@icons/options/Refresh.svg?react";

export default function MessageLinkPreview({ refreshFunc, urlData, color }) {
  if (!urlData) return null;

  const {
    url,
    title,
    siteName,
    description,
    images = [],
    favicons = [],
    file_name,
    size,
  } = urlData;
  const [imageError, setImageError] = useState(false);

  const isDocument = SUPPORTED_DOCUMENT_PREVIEW_REGEX.test(url);

  const bgClass = color === "white" ? "bg-accent-light/20" : "bg-hover-dark/5";
  const textClass = color === "white" ? "text-gray-200" : "text-gray-500";

  if (isDocument) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div
          className={`flex flex-row gap-[10px] p-[5px] mt-[5px] ${bgClass} rounded-lg`}
        >
          <div
            className={`w-[45px] h-[55px] px-[7px] flex items-center justify-center ${bgClass} rounded-md`}
          >
            <File className="w-[24px] h-[36px]" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="!font-light line-clamp-1 overflow-hidden text-ellipsis">
              {file_name}
            </p>
            <p className={textClass}>{formatFileSize(Number(size))}</p>
          </div>
        </div>
      </a>
    );
  }

  if (!description && images.length === 0) return null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className={`flex flex-col p-[10px] mt-[5px] ${bgClass} rounded-lg`}>
        <div className="flex flex-row gap-[5px] items-center">
          {favicons[0] && (
            <img
              src={favicons[0]}
              alt="Preview"
              className="w-[10px] h-[10px] object-contain rounded-md"
            />
          )}
          <div className="flex flex-col flex-1">
            {siteName && (
              <p className="!font-normal line-clamp-1 overflow-hidden text-ellipsis">
                {siteName}
              </p>
            )}
            <p className="!font-normal line-clamp-1 overflow-hidden text-ellipsis">
              {title}
            </p>
          </div>
          <Refresh onClick={(e) => refreshFunc(e, url)} className={"h-[10px"} />
        </div>
        {description && (
          <p className="line-clamp-2 overflow-hidden text-ellipsis mt-[2px]">
            {description}
          </p>
        )}
        {images[0] && !imageError && (
          <img
            src={images[0]}
            alt="Preview"
            className="w-full max-h-[240px] h-full object-cover rounded-md mt-[4px]"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </a>
  );
}
