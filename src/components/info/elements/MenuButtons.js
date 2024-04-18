import addPrefix from "@src/utils/navigation/add_prefix";
import { useLocation } from "react-router-dom";

import { ReactComponent as AccountIcon } from "@icons/Menu.svg";
import { ReactComponent as CreateChat } from "@icons/AddConversationBlack.svg";

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
