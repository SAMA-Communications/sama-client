import { memo, useCallback } from "react";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";

import type { ModalProps } from "@elements/Modal/Modal.types";

import { MODAL_IOS_FULL_BLEED_STYLE } from "@utils/modalOverlayStyle";

const DURATION = 0.25;

const overlayBaseClassName =
  "ui:fixed ui:inset-0 ui:z-100 ui:flex ui:w-screen ui:max-w-none ui:items-center ui:justify-center ui:overflow-y-auto ui:overscroll-y-contain ui:bg-black/50 ui:[-webkit-tap-highlight-color:transparent] ui:isolate";

const panelBaseClassName =
  "ui:flex ui:w-[min(400px,100%)] ui:flex-col ui:gap-3 ui:rounded-3xl ui:bg-bg-light ui:px-6 ui:pt-6 ui:pb-4 ui:max-md:w-[min(94dvw,94vw)] ui:max-md:p-[20px] ui:origin-center";

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
    <div
      className={clsx(overlayBaseClassName, className)}
      style={MODAL_IOS_FULL_BLEED_STYLE}
      onClick={handleOverlayClick}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey ?? "modal-panel"}
          role="dialog"
          aria-modal="true"
          className={clsx(
            panelBaseClassName,
            tall && "ui:max-h-[min(80svh,80dvh)] ui:min-h-0 ui:overflow-y-auto",
            panelClassName,
          )}
          initial={{ scale: 0.96 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.96 }}
          transition={{ duration: DURATION, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
