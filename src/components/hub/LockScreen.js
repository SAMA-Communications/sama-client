import encryptionService from "@services/encryptionService";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch } from "react-redux";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import "@styles/hub/LockScreen.css";

import { ReactComponent as EncryptedConversationIcon } from "@icons/encryption/EncryptedConversation.svg";
import { ReactComponent as HidePassword } from "@icons/actions/HidePassword.svg";
import { ReactComponent as ResetAccountIcon } from "@icons/encryption/ResetAccount.svg";
import { ReactComponent as ShowPassword } from "@icons/actions/ShowPassword.svg";

export default function LockScreen() {
  const { pathname, hash, search } = useLocation();

  const dispatch = useDispatch();

  const inputRef = useRef(null);
  const [passwordType, setPasswordType] = useState("password");
  const [accountExists, setAccountExists] = useState(false);

  const activeConvId = useMemo(() => search.split("=")[1], [search]);

  const unlock = async () => {
    const { isSuccessAuth } = await encryptionService.registerDevice(
      inputRef.current.value
    );

    if (isSuccessAuth && activeConvId) {
      navigateTo(`/#${activeConvId}`);
      dispatch(setSelectedConversation({ id: activeConvId }));
    } else if (!activeConvId) {
      navigateTo(`/`);
    }

    isSuccessAuth &&
      showCustomAlert("Authorization was successful.", "success");
  };

  const resetAccount = async () => {
    await encryptionService.clearStoredAccount();
    setAccountExists(false);
  };

  useEffect(() => {
    encryptionService
      .hasStoredAccount()
      .then((value) => setAccountExists(value));
  }, []);

  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateLastSection(pathname + hash)
  );

  return (
    <div className="encrypted--container">
      <p className="encrypted--container__header">
        <EncryptedConversationIcon />
        {accountExists ? "Unlock with password" : "Pick a password"}
      </p>
      {!accountExists && <p>This will be used to unlock your wallet.</p>}
      <div className="encrypted--container__password">
        <input
          ref={inputRef}
          placeholder="password"
          type={passwordType}
          autoComplete="off"
          readOnly
          onFocus={(e) => e.target.removeAttribute("readOnly")}
          autoFocus
        />
        {passwordType === "password" ? (
          <HidePassword onClick={() => setPasswordType("text")} />
        ) : (
          <ShowPassword onClick={() => setPasswordType("password")} />
        )}
      </div>
      <button onClick={unlock}>{accountExists ? "Unlock" : "Pick"}</button>
      {accountExists && (
        <p className="encrypted--container__span" onClick={resetAccount}>
          <ResetAccountIcon />
          Reset your account
        </p>
      )}
    </div>
  );
}
