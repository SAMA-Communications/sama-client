import type { WrapperRootProps } from "../WrapperRoot";
import type { User } from "types/samaWssModels";

export interface SearchedUserProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  user: User;
  /** Whether the user is currently selected. */
  isSelected?: boolean;
  /** When true, click does not call onClick. */
  isClickDisabled?: boolean;
  /** Called when the row is activated. */
  onClick: () => void;
}
