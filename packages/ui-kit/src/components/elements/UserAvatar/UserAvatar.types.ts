import type { ReactNode } from "react";
import type { WrapperRootProps } from "../WrapperRoot";

export interface UserAvatarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  avatarUrl?: string;
  avatarBlurHash?: string;
  defaultIcon?: ReactNode;
  /** Class name for the wrapper (legacy; prefer className). */
  wrapperClassName?: string;
  height?: number;
  width?: number;
  alt?: string;
}
