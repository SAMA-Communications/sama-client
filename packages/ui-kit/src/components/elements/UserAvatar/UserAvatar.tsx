import { memo, useMemo } from "react";
import { clsx } from "clsx";
import { Blurhash } from "react-blurhash";

import { OvalLoader } from "../OvalLoader";
import { WrapperRoot } from "../WrapperRoot";
import type { UserAvatarProps } from "./UserAvatar.types";

export const UserAvatar = memo(function UserAvatar({
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  wrapperClassName,
  height = 64,
  width = 64,
  alt = "User's profile picture",
  className,
  style,
  ...rest
}: UserAvatarProps) {
  const avatarView = useMemo(() => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={alt}
          width={width}
          height={height}
          className="ui:h-full ui:w-full ui:rounded-full ui:object-cover"
          loading="lazy"
        />
      );
    }
    if (avatarBlurHash) {
      return (
        <div className="ui:relative ui:h-full ui:w-full">
          <Blurhash
            hash={avatarBlurHash || "LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
          <OvalLoader
            wrapperClassName="ui:absolute ui:top-1/2 ui:left-1/2 ui:transform ui:-translate-x-1/2 ui:-translate-y-1/2"
            height={30}
            width={30}
          />
        </div>
      );
    }
    return (
      defaultIcon || (
        <div className="flex ui:h-full ui:w-full ui:items-center ui:justify-center ui:rounded-full ui:bg-gray-200">
          <span className="ui:text-sm ui:text-gray-500">?</span>
        </div>
      )
    );
  }, [avatarUrl, avatarBlurHash, defaultIcon, alt, height, width]);

  return (
    <WrapperRoot
      className={clsx("ui:relative ui:overflow-hidden ui:rounded-full", wrapperClassName, className)}
      style={{ width, height, ...style }}
      {...rest}
    >
      {avatarView}
    </WrapperRoot>
  );
});
