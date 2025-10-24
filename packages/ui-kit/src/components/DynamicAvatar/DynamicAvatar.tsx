import { FC, useMemo } from "react";

import { DynamicAvatarProps } from "./DynamicAvatar.types";
import { AvatarWithFallback } from "./AvatarWithFallback";
import { ImageLoader } from "../ImageLoader";

export const DynamicAvatar: FC<DynamicAvatarProps> = ({
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  altText,
  imageLoaderProps = {},
}) => {
  const avatarView = useMemo(() => {
    if (avatarUrl) {
      return (
        <AvatarWithFallback
          avatarUrl={avatarUrl}
          altText={altText}
          fallbackIcon={defaultIcon}
        />
      );
    }

    return avatarBlurHash ? (
      <ImageLoader blurHash={avatarBlurHash} {...imageLoaderProps} />
    ) : (
      defaultIcon
    );
  }, [avatarBlurHash, avatarUrl, defaultIcon, altText, imageLoaderProps]);

  return <>{avatarView}</>;
};
