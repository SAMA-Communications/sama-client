import ItemLoader from "@components/attach/elements/ItemLoader";
import { useMemo } from "react";

export default function UserAvatar({ avatarUrl, avatarBlurHash, defaultIcon }) {
  const avatarView = useMemo(
    () =>
      avatarUrl ? (
        <img src={avatarUrl} alt={"User's Profile"} />
      ) : avatarBlurHash ? (
        <ItemLoader blurHash={avatarBlurHash} />
      ) : (
        defaultIcon
      ),
    [avatarBlurHash, avatarUrl, defaultIcon]
  );

  return avatarView;
}
