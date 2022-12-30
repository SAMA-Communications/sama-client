import getUniqueId from "../../api/uuid";
import { ReactComponent as CloseButtonMini } from "./../../assets/icons/chatForm/CloseButtonMini.svg";
import { ReactComponent as ClearFilesButton } from "./../../assets/icons/chatForm/ClearFilesButton.svg";

export default function AttachmentsList({ files, funcUpdateFile }) {
  return (
    <div className="chat-files-preview">
      <div className="chat-files-block">
        {Object.values(files).map((el) => (
          <div
            className="file-pin-box"
            key={getUniqueId(el.name)}
            onClick={() =>
              funcUpdateFile(files.filter((obj) => obj.name !== el.name))
            }
          >
            <p>{el.name}</p>
            <span>
              <CloseButtonMini />
            </span>
          </div>
        ))}
      </div>
      <div className="btn-clear-files" onClick={() => funcUpdateFile([])}>
        <ClearFilesButton />
      </div>
    </div>
  );
}
