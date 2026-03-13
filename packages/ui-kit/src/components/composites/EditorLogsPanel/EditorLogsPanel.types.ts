import type { ReactNode } from "react";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface EditorLogsPanelProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** When false, panel is not rendered */
  visible: boolean;
  onClose: () => void;
  /** Content (e.g. read-only Monaco editor) */
  children: ReactNode;
}

