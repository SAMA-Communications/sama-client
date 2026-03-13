import { memo } from "react";

import { clsx } from "clsx";

import type { ContextMenuItemProps } from "@elements/ContextMenuItem/ContextMenuItem.types";
import { WrapperRoot } from "@elements/WrapperRoot";

import { MENU_ITEM_ANIMATE } from "@utils/constants";

export const ContextMenuItem = memo(function ContextMenuItem({
  text,
  icon,
  onClick,
  isDangerStyle = false,
  id,
  className,
  ...rest
}: ContextMenuItemProps) {
  return (
    <WrapperRoot
      key={id ?? text}
      role="menuitem"
      className={clsx(
        "ui:flex ui:cursor-pointer ui:items-center ui:gap-1.75 ui:rounded-lg ui:p-1.25 ui:hover:bg-hover-light/45",
        isDangerStyle && "ui:mt-1.25",
        isDangerStyle ? "ui:text-danger" : "ui:text-text-dark",
        className,
      )}
      onClick={onClick}
      animate={MENU_ITEM_ANIMATE}
      {...rest}
    >
      {icon}
      <p className="ui:whitespace-nowrap">{text}</p>
    </WrapperRoot>
  );
});

