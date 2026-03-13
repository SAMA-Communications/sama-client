import { MessageUserIcon as UIMessageUserIcon } from "@sama-communications.ui-kit";

import UserIconBlack from "@icons/users/UserIconBlack.svg?react";
import UserIconWhite from "@icons/users/UserIconWhite.svg?react";

/** Client wrapper: passes custom fallback icons for empty user state */
export default function MessageUserIcon({ userObject, isCurrentUser }) {
  return (
    <UIMessageUserIcon
      user={userObject}
      isCurrentUser={isCurrentUser}
      fallbackCurrentUser={<UserIconWhite />}
      fallbackOtherUser={<UserIconBlack />}
    />
  );
}
