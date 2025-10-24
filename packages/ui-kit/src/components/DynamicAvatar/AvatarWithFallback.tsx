import { FC, useState, useEffect, ReactNode } from "react";
import { User } from "lucide-react";

interface AvatarWithFallbackProps {
  avatarUrl?: string;
  altText?: string;
  fallbackIcon?: ReactNode;
}

export const AvatarWithFallback: FC<AvatarWithFallbackProps> = ({
  avatarUrl,
  altText,
  fallbackIcon,
}) => {
  const [component, setComponent] = useState<ReactNode>(
    fallbackIcon || <User />
  );

  useEffect(() => {
    if (!avatarUrl) {
      setComponent(fallbackIcon || <User />);
      return;
    }

    const img = new Image();
    img.src = avatarUrl;
    img.onload = () =>
      setComponent(
        <img
          data-testid="avatar-with-fallback"
          className="w-full h-full object-cover"
          src={avatarUrl}
          alt={altText}
        />
      );
    img.onerror = () => setComponent(fallbackIcon || <User />);
  }, [avatarUrl, altText, fallbackIcon]);

  return <>{component}</>;
};
