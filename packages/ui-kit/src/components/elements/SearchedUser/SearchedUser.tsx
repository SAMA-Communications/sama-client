import { memo, useCallback } from "react";

import { clsx } from "clsx";
import { Check } from "lucide-react";

import { getAdapters } from "@adapters";

import { DynamicAvatar } from "@elements/DynamicAvatar";
import type { SearchedUserProps } from "@elements/SearchedUser/SearchedUser.types";
import { WrapperRoot } from "@elements/WrapperRoot";

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
      <div className="relative">
        <DynamicAvatar
          size={60}
          avatarUrl={user.avatar_url}
          avatarBlurHash={user.avatar_object?.file_blur_hash}
          defaultIcon={userUtils.getUserInitials(user)}
          altText="User's Profile"
          bgColorKey={user._id}
        />
        {isSelected ? (
          <div className="ui:absolute ui:-right-2 ui:-bottom-1 ui:z-10 ui:flex ui:h-6 ui:w-6 ui:items-center ui:justify-center ui:rounded-full ui:bg-accent-500">
            <Check size={14} color="white" />
          </div>
        ) : null}
      </div>
      <div className="ui:flex ui:flex-1 ui:flex-col ui:gap-0.75 ui:overflow-hidden">
        <p className="ui:overflow-hidden ui:text-lg ui:text-ellipsis ui:whitespace-nowrap">
          {userUtils.getUserFullName(user)}
        </p>
      </div>
    </WrapperRoot>
  );
});
