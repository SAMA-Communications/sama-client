import globalConstants from "@helpers/constants";
import { KEY_CODES } from "@src/_helpers/keyCodes";
import removeAndNavigateLastSection from "@src/utils/navigation/get_prev_page";
import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import "@styles/attach/AttachHub.css";
import MessageInput from "../hub/elements/MessageInput";

export default function AttachHub() {
  const inputFilesRef = useRef(null);
  const { pathname, hash } = useLocation();

  const closeModal = useCallback(
    () => removeAndNavigateLastSection(pathname + hash),
    [pathname, hash]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.keyCode === KEY_CODES.ESCAPE && closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="attach-window__container fcc">
      <div className="attach-modal__content">
        <p className="attach-modal__title">
          {"Send attachment" || "Selected {count} files"}
        </p>
        <div className="attach-view__container">
          "attachments picture preview"
        </div>
        <div className="attach-inputs__container">
          <textarea />
        </div>
        <div className="attach-navigation__container fcc">
          <p className="attach-navigation__link" onClick={closeModal}>
            Cancel
          </p>
          <input
            id="inputFile"
            ref={inputFilesRef}
            //onChange open pop-up window for attach files
            type="file"
            accept={globalConstants.allowedFileFormats}
            multiple
          />
          <p className="attach-navigation__link" onClick={() => {}}>
            Save
          </p>
        </div>
      </div>
    </div>
  );
}
