import { useState } from "react";

import { RefreshCcw, File } from "lucide-react";

import { MessageLinkPreviewProps } from "./MessageLinkPreview.types";

export const MessageLinkPreview = ({
  urlData,
  color = "accent",
  onRefresh,
  isDocument = false,
  formattedFileSize,
}: MessageLinkPreviewProps) => {
  const [imageError, setImageError] = useState(false);

  if (!urlData) return null;

  const { url, title, siteName, description, images = [], favicons = [], file_name } = urlData;

  const bgClass = color === "white" ? "ui:bg-bg-dark/5" : "ui:bg-accent-500/20";
  const textClass = color === "white" ? "ui:text-gray-200" : "ui:text-gray-500";

  if (isDocument) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        <div className={`ui:mt-1.25 ui:flex ui:flex-row ui:gap-2.5 ui:rounded-lg ui:p-1.25 ${bgClass}`}>
          <div className="ui:flex ui:h-13.75 ui:w-11.25 ui:items-center ui:justify-center ui:rounded-md ui:bg-bg-dark/15 ui:px-1.75">
            <File size={36} color="white" />
          </div>
          <div className="ui:flex ui:flex-col ui:justify-center">
            <p className="ui:line-clamp-1 ui:overflow-hidden ui:font-light ui:text-ellipsis">{file_name}</p>
            {formattedFileSize != null && (
              <p className={`ui:font-light ui:text-text-dark ${textClass}`}>{formattedFileSize}</p>
            )}
          </div>
        </div>
      </a>
    );
  }

  if (!description && images.length === 0) return null;

  return (
    <a href={url} className="ui:max-w-full" target="_blank" rel="noopener noreferrer">
      <div className={`ui:mt-1.25 ui:flex ui:flex-col ui:rounded-lg ui:p-2.5 ${bgClass}`}>
        <div className="ui:flex ui:flex-row ui:items-center ui:gap-1.25">
          {favicons[0] && (
            <img src={favicons[0]} alt="Preview" className="ui:h-2.5 ui:w-2.5 ui:rounded-md ui:object-contain" />
          )}
          <div className="ui:flex ui:w-full ui:flex-1 ui:flex-col">
            {siteName && <p className="ui:line-clamp-1 ui:overflow-hidden ui:text-ellipsis">{siteName}</p>}
            <p className="ui:line-clamp-1 ui:overflow-hidden ui:text-ellipsis">{title}</p>
          </div>
          <RefreshCcw
            size={18}
            color="var(--color-hover-dark)"
            className="ui:cursor-pointer"
            onClick={(e) => onRefresh(e, url)}
          />
        </div>
        {description && (
          <p className="ui:mt-0.5 ui:line-clamp-2 ui:overflow-hidden ui:font-light ui:text-ellipsis ui:text-text-dark">
            {description}
          </p>
        )}
        {images[0] && !imageError && (
          <img
            src={images[0]}
            alt="Preview"
            className="ui:mt-1 ui:h-full ui:max-h-60 ui:w-full ui:rounded-md ui:object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </a>
  );
};
