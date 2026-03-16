import { memo, useCallback } from "react";

import { clsx } from "clsx";
import { motion } from "motion/react";

import type { ModalProps } from "@elements/Modal/Modal.types";

const DURATION = 0.25;

const overlayBaseClassName =
  "ui:absolute ui:top-0 ui:z-10 ui:flex ui:h-dvh ui:w-dvw ui:items-center ui:justify-center ui:bg-black/50";

const panelBaseClassName =
  "ui:flex ui:w-[min(400px,100%)] ui:flex-col ui:gap-3 ui:rounded-3xl ui:bg-bg-light ui:px-6 ui:pt-6 ui:pb-4 ui:max-md:w-[94svw] ui:max-md:p-[20px] ui:origin-center";

export const Modal = memo(function Modal({
  children,
  panelClassName = "",
  contentKey,
  tall = false,
  className,
  onClick,
}: ModalProps) {
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      e.stopPropagation();
      onClick?.(e);
    },
    [onClick],
  );

  return (
    <motion.div
      className={clsx(overlayBaseClassName, className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION, ease: "easeOut" }}
      onClick={handleOverlayClick}
    >
      <motion.div
        key={contentKey}
        role="dialog"
        aria-modal="true"
        className={clsx(panelBaseClassName, tall && "ui:h-[80svh]", panelClassName)}
        initial={{ opacity: 1, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 1, scale: 0.95 }}
        transition={{ duration: DURATION, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
  );
});
