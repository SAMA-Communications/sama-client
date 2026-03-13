import { memo, useCallback, useState } from "react";

import { clsx } from "clsx";
import { X } from "lucide-react";

import { getAdapters } from "@adapters";

import { UserInfoProps } from "@elements/UserInfo/UserInfo.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const baseClassName =
  "ui:flex ui:max-h-[32px] ui:min-w-max ui:cursor-pointer ui:flex-row ui:items-center ui:gap-[7px] ui:rounded-[12px] ui:bg-hover-light ui:p-[4px]";

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
      <div className="ui:flex ui:h-[24px] ui:w-[24px] ui:items-center ui:justify-center ui:rounded-[8px] ui:bg-bg-dark">
        <p className="ui:text-text-dark">
          {visibleCloseBtn ? <X size={14} className="shrink-0" /> : userUtils.getUserInitials(user)}
        </p>
      </div>
      <p className="ui:text-text-dark">{userUtils.getUserFullName(user)}</p>
    </WrapperRoot>
  );
});
