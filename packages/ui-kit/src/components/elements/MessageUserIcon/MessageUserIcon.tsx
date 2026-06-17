import { memo } from "react";

import { clsx } from "clsx";
import { User } from "lucide-react";

import { getAdapters } from "@adapters";

import { DynamicAvatar } from "@elements/DynamicAvatar";
import type { MessageUserIconProps } from "@elements/MessageUserIcon/MessageUserIcon.types";
import { WrapperRoot } from "@elements/WrapperRoot";

import { DEFAULT_MESSAGE_USER_ICON_SIZE } from "@utils/constants";

export const MessageUserIcon = memo(function MessageUserIcon({
  user,
  isCurrentUser = false,
  size = DEFAULT_MESSAGE_USER_ICON_SIZE,
  fallbackCurrentUser,
  fallbackOtherUser,
  className,
  style,
  ...rest
}: MessageUserIconProps) {
  const { userUtils } = getAdapters();
  const hasUser = user && Object.keys(user).length > 0;

  if (hasUser) {
    return (
      <WrapperRoot className={className} style={style} {...rest}>
        <DynamicAvatar
          size={size}
          avatarUrl={user!.avatar_url}
          avatarBlurHash={user!.avatar_object?.file_blur_hash}
          defaultIcon={userUtils.getUserInitials(user!)}
          altText="User's Profile"
          bgColorKey={user!._id}
          customClassName="ui:rounded-xl ui:cursor-pointer"
        />
      </WrapperRoot>
    );
  }

  if (isCurrentUser && fallbackCurrentUser) {
    return (
      <WrapperRoot className={className} style={style} {...rest}>
        {fallbackCurrentUser}
      </WrapperRoot>
    );
  }
  if (!isCurrentUser && fallbackOtherUser) {
    return (
      <WrapperRoot className={className} style={style} {...rest}>
        {fallbackOtherUser}
      </WrapperRoot>
    );
  }

  return (
    <WrapperRoot
      className={clsx("ui:flex ui:items-center ui:justify-center ui:rounded-xl ui:bg-bg-dark/10", className)}
      style={{ width: size, height: size, ...style }}
      {...rest}
    >
      <User size={size * 0.5} className="ui:text-text-dark/50" />
    </WrapperRoot>
  );
});
