import ContextLink from "./ContextLink";

import { ReactComponent as AddEncryptedConversation } from "@icons/encryption/AddEncryptedConversation.svg";

export default function AddEncryptedConversationLink({ onClick }) {
  return (
    <ContextLink
      text="Create encrypted chat"
      icon={<AddEncryptedConversation />}
      onClick={onClick}
    />
  );
}
