import AttachmentsListItem from "./AttachmentsListItem";
import { ReactComponent as ClearFilesButton } from "./../../assets/icons/chatForm/ClearFilesButton.svg";

export default function AttachmentsList({ files, funcUpdateFile }) {
  return (
    <div className="chat-files-preview">
      <div className="chat-files-block">
        {Object.values(files).map((el) => (
          <AttachmentsListItem
            name={el.name}
            files={files}
            funcUpdateFile={funcUpdateFile}
          />
        ))}
      </div>
      <div className="btn-clear-files" onClick={() => funcUpdateFile([])}>
        <ClearFilesButton />
      </div>
    </div>
  );
}
