import type { ReactNode } from "react";

import type { ImageLoaderProps } from "@elements/ImageLoader";
import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface DynamicAvatarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Additional class for the root. */
  customClassName?: string | "";
  /** Avatar size in pixels. */
  size?: number;
  avatarUrl?: string;
  avatarBlurHash?: string;
  defaultIcon?: ReactNode;
  altText?: string;
  /** Key used to generate fallback background gradient. */
  bgColorKey?: string;
  imageLoaderProps?: Partial<ImageLoaderProps>;
}

