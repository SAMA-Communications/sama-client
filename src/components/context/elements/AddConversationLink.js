import ContextLink from "./ContextLink";

import { ReactComponent as AddConversation } from "@icons/AddConversation1.svg";

export default function AddConversationLink({ onClick }) {
  return (
    <ContextLink
      text="Create group chat"
      icon={<AddConversation />}
      onClick={onClick}
    />
  );
}
