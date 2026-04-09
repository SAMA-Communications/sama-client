import type { User } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface UserProfileAvatarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  user: User;
  /** When true, use accent-100 for background instead of bg-light. */
  swapAccentAndMainColor?: boolean;
}

