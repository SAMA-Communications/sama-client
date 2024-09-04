import encryptionService from "@services/encryptionService";
import showCustomAlert from "@utils/show_alert";
import { useRef } from "react";

import "@styles/hub/EncryptedHub.css";

import { ReactComponent as EncryptedConversation } from "@icons/EncryptedConversation.svg";

export default function EncryptedAuth() {
  const inputRef = useRef(null);

  const registerDeviceFunc = async () => {
    await encryptionService.registerDevice(inputRef.current.value);

    if (encryptionService.validateIsAuthEncrypted()) {
      showCustomAlert("Authorization was successful.", "success");
    }
  };

  return (
    <div className="encrypted--container">
      <p>
        <EncryptedConversation />
        Encrypted authorization
      </p>
      <input
        autoFocus
        type="password"
        ref={inputRef}
        placeholder="Enter the authorization key"
      />
      <button onClick={registerDeviceFunc}>Send the key</button>
    </div>
  );
}
