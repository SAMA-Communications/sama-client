import { memo, useCallback, useState } from "react";

import { clsx } from "clsx";
import { X } from "lucide-react";

import { getAdapters } from "@adapters";

import { DynamicAvatar } from "@elements/DynamicAvatar";
import { UserInfoProps } from "@elements/UserInfo/UserInfo.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const baseClassName =
  "ui:flex ui:max-h-8 ui:min-w-max ui:cursor-pointer ui:flex-row ui:items-center ui:gap-1.75 ui:rounded-[8px] ui:bg-hover-light ui:p-1.5";

export const UserInfo = memo(function UserInfo({ user, onRemove, className, ...rest }: UserInfoProps) {
  const [visibleCloseBtn, setVisibleCloseBtn] = useState(false);
  const { userUtils } = getAdapters();

  const showClose = useCallback(() => setVisibleCloseBtn(true), []);
  const hideClose = useCallback(() => setVisibleCloseBtn(false), []);

  return (
    <WrapperRoot
      className={clsx(baseClassName, className)}
      onClick={onRemove}
      onMouseEnter={showClose}
      onMouseLeave={hideClose}
      {...rest}
    >
      <div className="ui:flex ui:h-6 ui:w-6 ui:items-center ui:justify-center ui:overflow-hidden ui:rounded-[8px]">
        {visibleCloseBtn ? (
          <p className="ui:flex ui:items-center ui:justify-center ui:text-text-dark">
            <X size={14} className="ui:shrink-0" />
          </p>
        ) : (
          <DynamicAvatar
            size={24}
            avatarUrl={user.avatar_url}
            avatarBlurHash={user.avatar_object?.file_blur_hash}
            defaultIcon={userUtils.getUserInitials(user)}
            altText=""
            bgColorKey={user._id}
            customClassName="ui:rounded-[8px] ui:text-sm"
          />
        )}
      </div>
      <p className="ui:text-text-dark">{userUtils.getUserFullName(user)}</p>
    </WrapperRoot>
  );
});
