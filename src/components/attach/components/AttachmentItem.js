import "@styles/attach/AttachmentItem.css";

import { ReactComponent as CloseIcon } from "@icons/actions/CloseGray.svg";

export default function AttachmentItem({ url, name, size, removeFileFunc }) {
  return (
    <div className="att-item__container">
      <div className="att-item__photo fcc">
        <img src={url} alt="" />
      </div>
      <div className="att-item__content">
        <p className="att-item__name">{name || "Undefined"}</p>
        <p className="att-item__size">{size} MB</p>
      </div>
      {removeFileFunc ? (
        <CloseIcon className="att-item__remove" onClick={removeFileFunc} />
      ) : null}
    </div>
  );
}
