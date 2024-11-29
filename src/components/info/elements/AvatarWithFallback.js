import { useState, useEffect } from "react";

import { ReactComponent as UserIcon } from "@icons/users/User.svg";

export default function AvatarWithFallback({ avatarUrl, altText }) {
  const [component, setComponent] = useState(avatarUrl);

  useEffect(() => {
    const img = new Image();
    img.src = avatarUrl;
    img.onload = () => setComponent(<img src={avatarUrl} alt={altText} />);
    img.onerror = () => setComponent(<UserIcon />);
  }, [avatarUrl]);

  return component;
}
