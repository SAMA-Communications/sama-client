import type { ReactNode } from "react";
import type { WrapperRootProps } from "../WrapperRoot";

export interface ContextMenuItemProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Label text. */
  text: string;
  /** Icon (e.g. Lucide element). */
  icon?: ReactNode;
  /** Click handler. */
  onClick: () => void;
  /** Danger style (red text). */
  isDangerStyle?: boolean;
  /** Optional key for list. */
  id?: string;
}
