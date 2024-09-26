import OvalLoader from "../_helpers/OvalLoader";
import encryptionService from "@services/encryptionService";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

import "@styles/hub/LockScreen.css";

import { ReactComponent as EncryptedConversationIcon } from "@icons/encryption/EncryptedConversation.svg";

export default function LockScreen() {
  const { pathname, hash, search } = useLocation();

  const dispatch = useDispatch();

  const [panding, setPanding] = useState(false);
  const currentUserId = useSelector(selectCurrentUserId);
  const activeConvId = useMemo(() => search.split("=")[1], [search]);

  const tryRegistrationAgain = async () => {
    setPanding(true);

    const { isSuccessAuth } = await encryptionService.registerDevice(
      currentUserId
    );

    if (isSuccessAuth && activeConvId) {
      if (activeConvId) {
        navigateTo(`/#${activeConvId}`);
        dispatch(setSelectedConversation({ id: activeConvId }));
      } else {
        navigateTo(`/`);
      }
    }

    showCustomAlert(
      ...(isSuccessAuth
        ? ["Registration was successful.", "success"]
        : ["Registration failed. Please try again.", "warning"])
    );

    setPanding(false);
  };

  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateLastSection(pathname + hash)
  );

  return (
    <div className="encrypted--container">
      <div className="encrypted--container__header ">
        <EncryptedConversationIcon />
        <p>Encrypted authorization</p>
      </div>
      <p>We could not authenticate your device in the system.</p>
      <button className="fcc" onClick={tryRegistrationAgain}>
        {panding ? (
          <OvalLoader width={15} height={15} secondaryColor={"#dbdcfc"} />
        ) : (
          "Try again"
        )}
      </button>
    </div>
  );
}
