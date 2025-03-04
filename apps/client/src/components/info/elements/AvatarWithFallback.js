import { useState, useEffect } from "react";

import UserIcon from "@icons/users/User.svg?react";

export default function AvatarWithFallback({ avatarUrl, altText }) {
  const [component, setComponent] = useState("");

  useEffect(() => {
    const img = new Image();
    img.src = avatarUrl;
    img.onload = () => setComponent(<img src={avatarUrl} alt={altText} />);
    img.onerror = () => setComponent(<UserIcon />);
  }, [avatarUrl]);

  return component;
}
