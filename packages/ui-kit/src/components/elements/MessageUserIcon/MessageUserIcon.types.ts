import type { WrapperRootProps } from "../WrapperRoot";
import type { User } from "types/samaWssModels";

export interface MessageUserIconProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  user: User | null | undefined;
  /** When true, use fallbackCurrentUser when user is empty. */
  isCurrentUser?: boolean;
  /** Avatar size in pixels. */
  size?: number;
  /** Optional custom fallback when user is null/empty (e.g. SVG component). */
  fallbackCurrentUser?: React.ReactNode;
  /** Optional custom fallback for other user when user is null/empty. */
  fallbackOtherUser?: React.ReactNode;
}
