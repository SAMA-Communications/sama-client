import { memo } from "react";
import { clsx } from "clsx";

import { WrapperRoot } from "../../elements/WrapperRoot";
import type { ContextMenuProps } from "./ContextMenu.types";

const baseClassName =
  "ui:absolute ui:z-50 ui:flex ui:w-50 ui:flex-col ui:gap-px ui:rounded-xl ui:bg-white ui:p-3 ui:shadow-md";

export const ContextMenu = memo(function ContextMenu({
  position,
  children,
  className = "",
  style,
  ...rest
}: ContextMenuProps) {
  return (
    <WrapperRoot
      className={clsx(baseClassName, className)}
      style={{ left: position.x, top: position.y, ...style }}
      role="menu"
      {...rest}
    >
      {children}
    </WrapperRoot>
  );
});
