import { memo, useCallback } from "react";

import { clsx } from "clsx";

import type { InformativeMessageProps } from "@elements/InformativeMessage/InformativeMessage.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const baseClassName = "ui:cursor-pointer ui:self-center";

export const InformativeMessage = memo(function InformativeMessage({
  text,
  onClick,
  isNextMessageUsers = false,
  className,
  ...rest
}: InformativeMessageProps) {
  return (
    <WrapperRoot
      className={clsx(baseClassName, isNextMessageUsers && "ui:mb-1.5", className)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      <p className="ui:font-light ui:text-text-dark/40">{text}</p>
    </WrapperRoot>
  );
});
