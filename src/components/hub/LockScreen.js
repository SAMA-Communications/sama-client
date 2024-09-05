import encryptionService from "@services/encryptionService";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch } from "react-redux";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

import "@styles/hub/LockScreen.css";

import { ReactComponent as EncryptedConversationIconIcon } from "@icons/EncryptedConversation.svg";

export default function LockScreen({ activeConvId }) {
  const { pathname, hash } = useLocation();

  const dispatch = useDispatch();

  const inputRef = useRef(null);

  const unlock = async () => {
    const { isSuccessAuth } = await encryptionService.registerDevice(
      inputRef.current.value
    );

    if (activeConvId) {
      navigateTo(`/#${activeConvId}`);
      dispatch(setSelectedConversation({ id: activeConvId }));
    }

    if (isSuccessAuth) {
      showCustomAlert("Authorization was successful.", "success");
    }
  };

  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateLastSection(pathname + hash)
  );

  return (
    <div className="encrypted--container">
      <p>
        <EncryptedConversationIconIcon />
        Unlock with password
      </p>
      <input autoFocus type="password" ref={inputRef} placeholder="password" />
      <button onClick={unlock}>Unlock</button>
    </div>
  );
}
