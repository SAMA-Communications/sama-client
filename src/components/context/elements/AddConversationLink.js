import ContextLink from "./ContextLink";

import { ReactComponent as AddConversation } from "@icons/AddConversationBlackSmall.svg";

export default function AddConversationLink({ onClick }) {
  return (
    <ContextLink
      text="Create group chat"
      icon={<AddConversation />}
      onClick={onClick}
    />
  );
}
