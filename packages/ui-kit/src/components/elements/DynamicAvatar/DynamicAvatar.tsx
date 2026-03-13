import { memo, useMemo } from "react";

import { clsx } from "clsx";

import { AvatarWithFallback } from "@elements/DynamicAvatar/AvatarWithFallback";
import type { DynamicAvatarProps } from "@elements/DynamicAvatar/DynamicAvatar.types";
import { ImageLoader } from "@elements/ImageLoader";
import { WrapperRoot } from "@elements/WrapperRoot";

import { generateSoftPastelGradient } from "@utils/generateSoftPastelGradient";

export const DynamicAvatar = memo(function DynamicAvatar({
  customClassName = "",
  size = 64,
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  altText,
  bgColorKey,
  imageLoaderProps = {},
  className,
  style,
  ...rest
}: DynamicAvatarProps) {
  const avatarView = useMemo(() => {
    if (avatarUrl) {
      return <AvatarWithFallback avatarUrl={avatarUrl} altText={altText} fallbackIcon={defaultIcon} />;
    }
    return avatarBlurHash ? <ImageLoader blurHash={avatarBlurHash} {...imageLoaderProps} /> : defaultIcon;
  }, [avatarBlurHash, avatarUrl, defaultIcon, altText, imageLoaderProps]);

  const sizePx = `${size}px`;
  const mergedStyle = {
    width: sizePx,
    height: sizePx,
    background: generateSoftPastelGradient(bgColorKey || ""),
    ...style,
  };

  return (
    <WrapperRoot
      className={clsx(
        "ui:flex ui:items-center ui:justify-center ui:overflow-hidden ui:rounded-3xl ui:font-light ui:text-white ui:uppercase",
        size > 50 ? "ui:text-2xl" : "ui:text-lg",
        customClassName,
        className,
      )}
      style={mergedStyle}
      {...rest}
    >
      {avatarView}
    </WrapperRoot>
  );
});
