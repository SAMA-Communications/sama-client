import UserAvatar from "@components/info/elements/UserAvatar";
import getUserInitials from "@utils/user/get_user_initials";

import { ReactComponent as UserIconBlack } from "@icons/users/UserIconBlack.svg";
import { ReactComponent as UserIconWhite } from "@icons/users/UserIconWhite.svg";

export default function MessageUserIcon({ userObject, isCurrentUser }) {
  return userObject && !!Object.keys(userObject).length ? (
    <UserAvatar
      avatarUrl={userObject.avatar_url}
      avatarBlurHash={userObject.avatar_object?.file_blur_hash}
      defaultIcon={getUserInitials(userObject)}
    />
  ) : isCurrentUser ? (
    <UserIconWhite />
  ) : (
    <UserIconBlack />
  );
}
