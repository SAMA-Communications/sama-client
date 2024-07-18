import ItemLoader from "@components/attach/elements/ItemLoader";
import { useMemo } from "react";

export default function DynamicAvatar({
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  altText,
}) {
  const avatarView = useMemo(
    () =>
      avatarUrl ? (
        <img src={avatarUrl} alt={altText} />
      ) : avatarBlurHash ? (
        <ItemLoader blurHash={avatarBlurHash} />
      ) : (
        defaultIcon
      ),
    [avatarBlurHash, avatarUrl, defaultIcon]
  );

  return avatarView;
}
