import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import { useCallback, useEffect, useState } from "react";

import { ReactComponent as ImageMedium } from "@icons/media/ImageMedium.svg";

export default function ChatNameInput({ setState, closeWindow }) {
  const [name, setName] = useState(null);

  const confirmChatName = useCallback(() => {
    if (!name?.length) {
      showCustomAlert("Enter a name for the group chat.", "warning");
      return;
    }
    setState(name);
  }, [name, setState]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.keyCode === KEY_CODES.ENTER && confirmChatName();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [confirmChatName]);

  return (
    <>
      <div className="edit-modal__create">
        <div className="em-create__photo fcc">
          <ImageMedium />
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
