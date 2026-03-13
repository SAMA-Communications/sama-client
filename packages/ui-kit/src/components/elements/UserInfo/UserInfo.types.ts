import type { User } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface UserInfoProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  user: User;
  /** Called when the remove control is activated. */
  onRemove: () => void;
}

