import AttachmentsListItem from "@generic/messageComponents/AttachmentsListItem";
import getUniqueId from "@api/uuid";

import { ReactComponent as ClearFilesButton } from "@icons/chatForm/ClearFilesButton.svg";

export default function AttachmentsList({ files, funcUpdateFile }) {
  return (
    <>
      <div className="chat-files-block">
        {Object.values(files).map((el) => (
          <AttachmentsListItem
            key={getUniqueId(el.name)}
            name={el.name}
            files={files}
            funcUpdateFile={funcUpdateFile}
          />
        ))}
      </div>
      <div className="btn-clear-files" onClick={() => funcUpdateFile([])}>
        <ClearFilesButton />
      </div>
    </>
  );
}
