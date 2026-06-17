import { memo } from "react";

import { clsx } from "clsx";

import type { SocketConnectingLineProps } from "@elements/SocketConnectingLine/SocketConnectingLine.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const baseClassName =
  "ui:absolute ui:top-0 ui:z-100 ui:flex ui:h-7 ui:w-full ui:items-center ui:justify-center ui:bg-accent-500 ui:shadow-md";

export const SocketConnectingLine = memo(function SocketConnectingLine({
  isSocketConnected,
  message = "Connecting...",
  className,
  ...rest
}: SocketConnectingLineProps) {
  if (isSocketConnected) return null;
  return (
    <WrapperRoot className={clsx(baseClassName, className)} {...rest}>
      <p className="ui:text-center ui:text-[18px] ui:font-light ui:text-white">{message}</p>
    </WrapperRoot>
  );
});
