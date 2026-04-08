import type { ReactNode } from "react";

import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface ContextMenuProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Viewport coordinates for `style.left` / `style.top` (e.g. from `clientX` / `clientY`). */
  position: { x: number; y: number };
  /** Menu content (list of ContextMenuItem or custom). */
  children: ReactNode;
  /** Optional class for the menu box. */
  className?: string;
}

