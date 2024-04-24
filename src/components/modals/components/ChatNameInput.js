import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import { useCallback, useState } from "react";
import { useKeyDown } from "@hooks/useKeyDown";

import { ReactComponent as ImageMedium } from "@icons/media/ImageMedium.svg";

export default function ChatNameInput({ setState, closeWindow }) {
  const [name, setName] = useState(null);

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
