import { useMemo } from "react";

import { AvatarWithFallback } from "./AvatarWithFallback";
import { ImageLoader } from "../ImageLoader";

import { generateSoftPastelGradient } from "../../../utils/generateSoftPastelGradient";

import { DynamicAvatarProps } from "./DynamicAvatar.types";

export const DynamicAvatar = ({
  customClassName = "",
  size = 64,
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  altText,
  bgColorKey,
  imageLoaderProps = {},
}: DynamicAvatarProps) => {
  const avatarView = useMemo(() => {
    if (avatarUrl) {
      return <AvatarWithFallback avatarUrl={avatarUrl} altText={altText} fallbackIcon={defaultIcon} />;
    }

    return avatarBlurHash ? <ImageLoader blurHash={avatarBlurHash} {...imageLoaderProps} /> : defaultIcon;
  }, [avatarBlurHash, avatarUrl, defaultIcon, altText, imageLoaderProps]);

  return (
    <div
      className={
        `ui:flex ui:items-center ui:justify-center ui:overflow-hidden ui:rounded-3xl ui:font-light ui:text-white ui:uppercase ` +
        (size > 50 ? "ui:text-2xl " : "ui:text-lg ") +
        customClassName
      }
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: generateSoftPastelGradient(bgColorKey || ""),
      }}
    >
      {/* ui:corner-squircle */}
      {avatarView}
    </div>
  );
};
