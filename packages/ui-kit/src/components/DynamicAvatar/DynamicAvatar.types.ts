import { ReactNode } from "react";
import { ImageLoaderProps } from "../ImageLoader";

export interface DynamicAvatarProps {
  avatarUrl?: string;
  avatarBlurHash?: string;
  defaultIcon?: ReactNode;
  altText?: string;
  imageLoaderProps?: Partial<ImageLoaderProps>;
}
