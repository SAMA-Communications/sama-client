import type { WrapperRootProps } from "../WrapperRoot";
import type { User } from "types/samaWssModels";

export interface UserProfileAvatarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  user: User;
  /** When true, use accent-100 for background instead of bg-light. */
  swapAccentAndMainColor?: boolean;
}
