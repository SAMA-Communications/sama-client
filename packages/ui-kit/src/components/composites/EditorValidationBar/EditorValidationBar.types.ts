import type { ReactNode } from "react";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface EditorValidationBarProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Status icon (OvalLoader / Check / X / RefreshCw) */
  statusNode: ReactNode;
  tooltipId: string;
  /** Tooltip content (e.g. validation checks list) */
  tooltipContent: ReactNode;
  onCheck: () => void;
  onSave: () => void;
  saveDisabled: boolean;
  /** Test message input (or any slot) */
  children?: ReactNode;
}

