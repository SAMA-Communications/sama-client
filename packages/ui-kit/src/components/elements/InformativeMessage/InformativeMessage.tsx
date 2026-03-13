import { memo, useCallback } from "react";

import { clsx } from "clsx";

import type { InformativeMessageProps } from "@elements/InformativeMessage/InformativeMessage.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const baseClassName =
  "ui:cursor-pointer ui:self-center ui:rounded-xl ui:bg-hover-light ui:px-3 ui:py-2 ui:text-gray-500";

export const InformativeMessage = memo(function InformativeMessage({
  text,
  onClick,
  isNextMessageUsers = false,
  className,
  ...rest
}: InformativeMessageProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.();
      }
    },
    [onClick],
  );

  return (
    <WrapperRoot
      className={clsx(baseClassName, isNextMessageUsers && "ui:mb-1.5", className)}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      <p className="ui:font-light">{text}</p>
    </WrapperRoot>
  );
});
