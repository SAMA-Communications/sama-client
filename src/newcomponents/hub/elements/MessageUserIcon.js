import getUserInitials from "@utils/user/get_user_initials";

import { ReactComponent as UserIconBlack } from "@icons/users/UserIconBlack.svg";
import { ReactComponent as UserIconWhite } from "@icons/users/UserIconWhite.svg";

export default function MessageUserIcon({ userObject, isCurrentUser }) {
  return userObject ? (
    getUserInitials(userObject)
  ) : isCurrentUser ? (
    <UserIconWhite />
  ) : (
    <UserIconBlack />
  );
}
