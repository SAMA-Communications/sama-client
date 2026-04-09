import { memo } from "react";

import { clsx } from "clsx";

import type { ContextMenuProps } from "@composites/ContextMenu/ContextMenu.types";

import { WrapperRoot } from "@elements/WrapperRoot";

const baseClassName =
  "ui:absolute ui:z-150 ui:flex ui:w-50 ui:flex-col ui:gap-px ui:rounded-xl ui:bg-white ui:p-3 ui:shadow-md ui:animate-context-menu-pop-in ui:origin-top-left";

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
