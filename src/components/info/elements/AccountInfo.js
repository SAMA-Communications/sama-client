import addPrefix from "@src/utils/navigation/add_prefix";
import { useLocation } from "react-router-dom";

import { ReactComponent as AccountIcon } from "@icons/users/Account.svg";

export default function AccountInfo() {
  const { pathname, hash } = useLocation();
  return (
    <AccountIcon
      className="navigation-account"
      onClick={() => addPrefix(pathname + hash, "/profile")}
    />
  );
}
