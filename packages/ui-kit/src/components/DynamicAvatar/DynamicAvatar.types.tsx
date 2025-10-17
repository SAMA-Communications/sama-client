import { ReactNode } from "react";
import { ItemLoaderProps } from "../ItemLoader";

export interface DynamicAvatarProps {
  avatarUrl?: string;
  avatarBlurHash?: string;
  defaultIcon?: ReactNode;
  altText?: string;
  itemLoaderProps?: Partial<ItemLoaderProps>;
}
