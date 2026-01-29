import { useMemo } from "react";

import { AvatarWithFallback } from "./AvatarWithFallback";
import { ImageLoader } from "../ImageLoader";

import { DynamicAvatarProps } from "./DynamicAvatar.types";

export const DynamicAvatar = ({
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  altText,
  imageLoaderProps = {},
}: DynamicAvatarProps) => {
  const avatarView = useMemo(() => {
    if (avatarUrl) {
      return <AvatarWithFallback avatarUrl={avatarUrl} altText={altText} fallbackIcon={defaultIcon} />;
    }

    return avatarBlurHash ? <ImageLoader blurHash={avatarBlurHash} {...imageLoaderProps} /> : defaultIcon;
  }, [avatarBlurHash, avatarUrl, defaultIcon, altText, imageLoaderProps]);

  return <>{avatarView}</>;
};
