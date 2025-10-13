import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import { getUserInitials } from "@utils/UserUtils.js";

import UserIconBlack from "@icons/users/UserIconBlack.svg?react";
import UserIconWhite from "@icons/users/UserIconWhite.svg?react";

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
