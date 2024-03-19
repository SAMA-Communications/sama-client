import showCustomAlert from "@utils/show_alert";
import { useState } from "react";

import { ReactComponent as ImageMedium } from "@icons/media/ImageMedium.svg";

export default function ChatNameInput({ setState, closeWindow }) {
  const [name, setName] = useState(null);

  const confirmChatName = () => {
    console.log(name);
    if (!name?.length) {
      showCustomAlert("Enter chat name pls", "warning");
      return;
    }
    setState(name);
  };

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
