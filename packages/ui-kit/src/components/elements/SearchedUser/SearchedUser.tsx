import { memo, useCallback } from "react";
import { clsx } from "clsx";
import { getAdapters } from "../../../adapters";
import { Check } from "lucide-react";

import { DynamicAvatar } from "../DynamicAvatar";
import { WrapperRoot } from "../WrapperRoot";
import type { SearchedUserProps } from "./SearchedUser.types";

const baseClassName =
  "ui:relative ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:gap-3.75 ui:rounded-2xl ui:px-1.5 ui:py-2.5 ui:duration-100 ui:hover:bg-accent-500/20 ui:focus:outline-none";

export const SearchedUser = memo(function SearchedUser({
  user,
  isSelected = false,
  isClickDisabled = false,
  onClick,
  className,
  ...rest
}: SearchedUserProps) {
  const { userUtils } = getAdapters();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!isClickDisabled) onClick();
      }
    },
    [isClickDisabled, onClick],
  );

  return (
    <WrapperRoot
      className={clsx(baseClassName, className)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      {...rest}
    >
      <DynamicAvatar
        size={60}
        avatarUrl={user.avatar_url}
        avatarBlurHash={user.avatar_object?.file_blur_hash}
        defaultIcon={userUtils.getUserInitials(user)}
        altText="User's Profile"
        bgColorKey={user._id}
      />
      {isSelected ? (
        <div className="ui:absolute ui:right-[3px] ui:bottom-[3px] ui:z-10 ui:flex ui:h-[20px] ui:w-[20px] ui:items-center ui:justify-center ui:rounded-full ui:bg-accent-500">
          <Check size={12} color="white" />
        </div>
      ) : null}
      <p className="ui:text-h6 ui:flex-1 ui:overflow-hidden ui:font-medium! ui:overflow-ellipsis ui:whitespace-nowrap ui:text-black">
        {userUtils.getUserFullName(user)}
      </p>
    </WrapperRoot>
  );
});
