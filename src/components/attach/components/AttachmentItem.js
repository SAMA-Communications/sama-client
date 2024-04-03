import ItemLoader from "@components/attach/elements/ItemLoader";
import getFileType from "@src/utils/get_file_type";
import { useMemo } from "react";

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
    size,
  } = file;

  const localUrl = file.file_local_url || file.localUrl;
  const fileType = getFileType(name);

  const pictureView = useMemo(() => {
    if (fileType === "Video") {
      if (url || localUrl) {
        return <video src={url || localUrl} alt={name} />;
      }
      return <ItemLoader blurHash={blurHash} />;
    }

    if (url) {
      return <img src={url} alt={name} />;
    }
    return localUrl ? (
      <img src={localUrl} alt={name} />
    ) : (
      <ItemLoader blurHash={blurHash} />
    );
  }, [blurHash, fileType, localUrl, name, url]);

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
