import ItemLoader from "@components/attach/elements/ItemLoader";
import { useMemo } from "react";

export default function DynamicAvatar({
  avatarUrl,
  avatarBlurHash,
  defaultIcon,
  altText,
}) {
  const avatarView = useMemo(() => {
    if (avatarUrl) {
      return <img src={avatarUrl} alt={altText} />;
    }

    return avatarBlurHash ? (
      <ItemLoader blurHash={avatarBlurHash} />
    ) : (
      defaultIcon
    );
  }, [avatarBlurHash, avatarUrl, defaultIcon]);

  return avatarView;
}
