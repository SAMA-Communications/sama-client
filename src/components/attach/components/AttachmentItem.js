import ItemLoader from "@components/attach/elements/ItemLoader";
import getFileType from "@utils/media/get_file_type";
import { useMemo, useState } from "react";

import "@styles/attach/AttachmentItem.css";

import { ReactComponent as CloseIcon } from "@icons/actions/CloseGray.svg";

export default function AttachmentItem({
  file = {},
  removeFileFunc,
  isOnClickDisabled = false,
  onClickfunc,
}) {
  const {
    file_url: url,
    file_blur_hash: blurHash,
    file_name: name,
    size: initFileSize,
  } = file;

  const [size, setSize] = useState(initFileSize);
  const fileType = getFileType(name);
  const localUrl = file.file_local_url || file.localUrl;

  const pictureView = useMemo(() => {
    if (fileType === "Video") {
      if (url || localUrl) {
        return <video src={url || localUrl} alt={name} />;
      }
      return <ItemLoader blurHash={blurHash} />;
    }

    if (url) {
      const image = <img src={url} alt={name} />;
      if (!size) {
        fetch(url).then((res) =>
          setSize((res.headers.get("Content-Length") / 1000000).toFixed(2))
        );
      }
      return image;
    }
    return localUrl ? (
      <img src={localUrl} alt={name} />
    ) : (
      <ItemLoader blurHash={blurHash} />
    );
  }, [blurHash, fileType, localUrl, name, size, url]);

  return (
    <div
      className="att-item__container"
      aria-label={isOnClickDisabled ? "disabled" : ""}
      onClick={onClickfunc}
    >
      <div className="att-item__photo fcc">{pictureView}</div>
      <div className="att-item__content">
        <p className="att-item__name">{name || "Undefined"}</p>
        <p className="att-item__size">{size || 0} MB</p>
      </div>
      {removeFileFunc ? (
        <CloseIcon className="att-item__remove" onClick={removeFileFunc} />
      ) : null}
    </div>
  );
}
