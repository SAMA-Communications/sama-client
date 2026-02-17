import { ReactNode } from "react";

import { ImageLoaderProps } from "../ImageLoader";

export interface DynamicAvatarProps {
  customClassName?: string | "";
  size?: number;
  avatarUrl?: string;
  avatarBlurHash?: string;
  defaultIcon?: ReactNode;
  altText?: string;
  bgColorKey?: string;
  imageLoaderProps?: Partial<ImageLoaderProps>;
}
