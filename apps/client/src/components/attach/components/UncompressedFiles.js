import { useMemo, useState } from "react";

import ItemLoader from "@components/attach/elements/ItemLoader";

import { getFileType, getFileSize } from "@utils/MediaUtils.js";

import CloseIcon from "@icons/actions/CloseGray.svg?react";

export default function UncompressedFiles({
  file = {},
  removeFileFunc,
  isOnClickDisabled = false,
  onClickfunc,
}) {
  const {
    file_url: url,
    file_blur_hash: blurHash,
    file_name: name,
    file_content_type: type,
    size: initFileSize,
  } = file;

  const [size, setSize] = useState(null);
  const fileType = getFileType(name, type);
  const localUrl = file.file_local_url || file.localUrl;

  const pictureView = useMemo(() => {
    if (fileType === "Video") {
      if (!initFileSize) {
        getFileSize(url).then((size) => setSize(size));
      }

      if (url || localUrl) {
        return (
          <video
            className="w-auto h-full object-cover"
            src={url || localUrl}
            alt={name}
          />
        );
      }
      return <ItemLoader blurHash={blurHash} />;
    }

    if (url) {
      const image = (
        <img className="w-auto h-full object-cover" src={url} alt={name} />
      );
      if (!initFileSize) {
        getFileSize(url).then((size) => setSize(size));
      }
      return image;
    }
    return localUrl ? (
      <img className="w-auto h-full object-cover" src={localUrl} alt={name} />
    ) : (
      <ItemLoader blurHash={blurHash} />
    );
  }, [blurHash, fileType, localUrl, name, size, url]);

  return (
    <div
      className="min-w-[240px] w-full max-w-[min(440px,100%)] p-[14px] flex gap-[10px] rounded-[12px] bg-(--color-accent-light) cursor-pointer disabled:!cursor-default"
      aria-label={isOnClickDisabled ? "disabled" : ""}
      onClick={onClickfunc}
    >
      <div className="w-[70px] h-[70px] rounded-[8px] bg-(--color-accent-dark) overflow-hidden flex items-center justify-center">
        {pictureView}
      </div>
      <div className="w-[calc(100%-122px)] flex-1 flex flex-col justify-center gap-[7px]">
        <p className="!font-light text-black overflow-hidden text-ellipsis whitespace-nowrap">
          {name || "Undefined"}
        </p>
        <p>{initFileSize || size || 0} MB</p>
      </div>
      {removeFileFunc ? (
        <CloseIcon
          className="px-[2px] self-center cursor-pointer"
          onClick={removeFileFunc}
        />
      ) : null}
    </div>
  );
}
