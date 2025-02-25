import globalConstants from "@helpers/constants";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import { useCallback, useRef, useState } from "react";
import { useKeyDown } from "@hooks/useKeyDown";

import ImageMedium from "@icons/media/ImageBig.svg?react";

export default function ChatNameInput({ setState, setImage, closeWindow }) {
  const [name, setName] = useState(null);
  const [localUrlImage, setLcalUrlImage] = useState(null);

  const inputFilesRef = useRef(null);

  const confirmChatName = useCallback(() => {
    if (!name?.length) {
      showCustomAlert("Enter a name for the group chat.", "warning");
      return;
    }
    if (name?.length > 255) {
      showCustomAlert(
        "The length of the chat name should not exceed 255 characters.",
        "warning"
      );
      return;
    }
    setState(name);
  }, [name, setState]);

  useKeyDown(KEY_CODES.ENTER, confirmChatName);

  const pickFileClick = () => inputFilesRef.current.click();

  return (
    <>
      <div className="edit-modal__create">
        <div className="em-create__photo fcc" onClick={pickFileClick}>
          {localUrlImage ? (
            <img src={localUrlImage} alt="Group" />
          ) : (
            <ImageMedium />
          )}
          <input
            id="inputFile"
            ref={inputFilesRef}
            type="file"
            onChange={(e) => {
              const file = Array.from(e.target.files).at(0);
              setImage(file);
              setLcalUrlImage(URL.createObjectURL(file));
            }}
            accept={globalConstants.allowedAvatarFormats}
            multiple
          />
        </div>
        <div>
          <p className="edit-modal__title">Group name</p>
          <input
            className="em-create__name-input"
            placeholder="Enter group name"
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className="em-navigation__container fcc">
        <p className="em-navigation__link" onClick={closeWindow}>
          Cancel
        </p>
        <p className="em-navigation__link" onClick={confirmChatName}>
          Continue
        </p>
      </div>
    </>
  );
}
