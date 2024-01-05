import getUniqueId from "@api/uuid";

import { ReactComponent as CloseButtonMini } from "@icons/chatForm/CloseButtonMini.svg";

export default function AttachmentsListItem({ name, files, funcUpdateFile }) {
  return (
    <div
      className="file-pin-box"
      key={getUniqueId(name)}
      onClick={() => funcUpdateFile(files.filter((obj) => obj.name !== name))}
    >
      <p>{name}</p>
      <span>
        <CloseButtonMini />
      </span>
    </div>
  );
}
