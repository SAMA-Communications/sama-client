import { ReactNode } from "react";

export interface UserAvatarProps {
  avatarUrl?: string;
  avatarBlurHash?: string;
  defaultIcon?: ReactNode;
  wrapperClassName?: string;
  height?: number;
  width?: number;
  alt?: string;
}
