import { memo } from "react";

import { clsx } from "clsx";

import type { ModalProps } from "@elements/Modal/Modal.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const overlayClassName =
  "ui:absolute ui:top-0 ui:z-10 ui:flex ui:h-dvh ui:w-dvw ui:items-center ui:justify-center ui:bg-black/50";

export const Modal = memo(function Modal({
  children,
  panelClassName = "",
  contentKey,
  tall = false,
  className,
  ...rest
}: ModalProps) {
  return (
    <WrapperRoot className={clsx(overlayClassName, className)} {...rest}>
      <div
        key={contentKey}
        className={clsx(
          "ui:flex ui:w-[min(400px,100%)] ui:flex-col ui:gap-3 ui:rounded-3xl ui:bg-bg-light ui:px-6 ui:pt-6 ui:pb-4 ui:max-md:w-[94svw] ui:max-md:p-[20px]",
          tall && "ui:h-[80svh]",
          panelClassName,
        )}
      >
        {children}
      </div>
    </WrapperRoot>
  );
});
