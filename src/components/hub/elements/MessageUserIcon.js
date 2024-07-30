import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import getUserInitials from "@utils/user/get_user_initials";

import { ReactComponent as UserIconBlack } from "@icons/users/UserIconBlack.svg";
import { ReactComponent as UserIconWhite } from "@icons/users/UserIconWhite.svg";

export default function MessageUserIcon({ userObject, isCurrentUser }) {
  return userObject && !!Object.keys(userObject).length ? (
    <DynamicAvatar
      avatarUrl={userObject.avatar_url}
      avatarBlurHash={userObject.avatar_object?.file_blur_hash}
      defaultIcon={getUserInitials(userObject)}
      altText={"User's Profile"}
    />
  ) : isCurrentUser ? (
    <UserIconWhite />
  ) : (
    <UserIconBlack />
  );
}
