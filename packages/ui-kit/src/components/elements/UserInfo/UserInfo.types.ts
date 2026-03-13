import type { WrapperRootProps } from "../WrapperRoot";
import type { User } from "types/samaWssModels";

export interface UserInfoProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  user: User;
  /** Called when the remove control is activated. */
  onRemove: () => void;
}
