import addPrefix from "@utils/navigation/add_prefix";
import { useLocation } from "react-router-dom";

import AccountIcon from "@icons/Menu.svg?react";
import CreateChat from "@icons/AddConversationBlack.svg?react";

export default function MenuButtons() {
  const { pathname, hash } = useLocation();
  return (
    <>
      <AccountIcon
        className="navigation-account"
        onClick={() => addPrefix(pathname + hash, "/profile")}
      />
      <div
        className="navigation-create"
        onClick={() => addPrefix(pathname + hash, "/create")}
      >
        <CreateChat />
      </div>
    </>
  );
}
