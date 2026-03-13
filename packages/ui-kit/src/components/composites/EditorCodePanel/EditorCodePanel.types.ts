import type { ReactNode } from "react";
import type { WrapperRootProps } from "../../elements/WrapperRoot";

export interface EditorCodePanelProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Status line text (e.g. "Recent changes - 12:00 by John") */
  statusText: string;
  children: ReactNode;
}
