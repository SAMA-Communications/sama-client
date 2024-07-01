import ItemLoader from "@components/attach/elements/ItemLoader";
import { useMemo } from "react";

export default function UserAvatar({
  size = 1,
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
}) {
  const defaultSize = 80;

  const avatarView = useMemo(
    () =>
      avatarUrl ? (
        <img src={avatarUrl} alt={"UserAvatra"} />
      ) : avatarBlurHash ? (
        <ItemLoader
          width={size * defaultSize}
          height={size * defaultSize}
          blurHash={avatarBlurHash}
        />
      ) : (
        defaultIcon
      ),
    [avatarBlurHash, avatarUrl, defaultIcon, size]
  );

  return avatarView;
}
