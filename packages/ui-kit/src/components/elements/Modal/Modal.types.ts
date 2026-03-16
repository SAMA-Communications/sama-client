import type { ReactNode } from "react";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ModalProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  children: ReactNode;
  /** Optional className for the inner panel. */
  panelClassName?: string;
  /** Optional key for animation (e.g. step identity). */
  contentKey?: string;
  /** If true, panel has min height for forms (e.g. 80svh). */
  tall?: boolean;
}
