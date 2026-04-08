import type { ReactNode } from "react";

import type { WrapperRootProps } from "@elements/WrapperRoot";

/**
 * Centered dialog; overlay uses `className` and `onClick` only (backdrop dismiss when target is overlay).
 * Other `WrapperRoot` / `div` props on this type are not read by `Modal.tsx`.
 */
export interface ModalProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  children: ReactNode;
  /** Classes merged into the inner motion panel (not the backdrop). */
  panelClassName?: string;
  /** `motion.div` key for AnimatePresence when swapping steps. */
  contentKey?: string;
  /** Taller scrollable panel preset (e.g. forms). */
  tall?: boolean;
}
