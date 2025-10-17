import { FC, useMemo } from "react";
import { Blurhash } from "react-blurhash";
import clsx from "clsx";

import { UserAvatarProps } from "./UserAvatar.types";
import { OvalLoader } from "../OvalLoader";

export const UserAvatar: FC<UserAvatarProps> = ({
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  className,
  height = 64,
  width = 64,
  alt = "User's profile picture",
}) => {
  const avatarView = useMemo(() => {
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={alt}
          width={width}
          height={height}
          className="object-cover w-full h-full rounded-full"
          loading="lazy"
        />
      );
    }

    if (avatarBlurHash) {
      return (
        <div className="relative w-full h-full">
          <Blurhash
            hash={avatarBlurHash || "LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
          <OvalLoader
            customClassName="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            height={30}
            width={30}
          />
        </div>
      );
    }

    return (
      defaultIcon || (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
          <span className="text-gray-500 text-sm">?</span>
        </div>
      )
    );
  }, [avatarUrl, avatarBlurHash, defaultIcon, alt, height, width]);

  return (
    <div
      className={clsx("relative overflow-hidden rounded-full", className)}
      style={{ width, height }}
    >
      {avatarView}
    </div>
  );
};
