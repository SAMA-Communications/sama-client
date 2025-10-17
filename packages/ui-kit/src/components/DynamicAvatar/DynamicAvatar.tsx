import { FC, useMemo } from "react";

import { DynamicAvatarProps } from "./DynamicAvatar.types";
import { AvatarWithFallback } from "./AvatarWithFallback";
import { ItemLoader } from "../ItemLoader";

export const DynamicAvatar: FC<DynamicAvatarProps> = ({
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  altText,
  itemLoaderProps = {},
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
      <ItemLoader blurHash={avatarBlurHash} {...itemLoaderProps} />
    ) : (
      defaultIcon
    );
  }, [avatarBlurHash, avatarUrl, defaultIcon, altText, itemLoaderProps]);

  return <>{avatarView}</>;
};
