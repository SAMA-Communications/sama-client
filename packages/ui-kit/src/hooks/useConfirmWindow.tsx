import { createContext, useCallback, useContext, useRef, useState, type MouseEvent, type ReactNode } from "react";

import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";

import { useKeyDown } from "@src/hooks/useKeyDown";
import { KEY_CODES } from "@src/utils/constants";

const DURATION = 0.25;

export type ConfirmResult<T = unknown> = {
  isConfirm: boolean;
  data: T;
};

export type ConfirmActionProps<T = unknown> = {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
};

export type ConfirmAction<T = unknown> = React.FC<ConfirmActionProps<T>>;

export type ConfirmOptions<T = unknown> = {
  title?: string;
  color?: "success" | "danger";
  description?: string;
  confirmText?: string;
  cancelText?: string;
  icon?: ReactNode;
  initialData?: T;
  actions?: Array<ConfirmAction<T>>;
};

type ConfirmContextType = {
  requestConfirm: <T>(options: ConfirmOptions<T>) => Promise<ConfirmResult<T>>;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export const ConfirmWindowProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions<any>>({});
  const [data, setData] = useState<any>(null);
  const [resolver, setResolver] = useState<((value: ConfirmResult<any>) => void) | null>(null);
  const pendingCloseRef = useRef<{
    isConfirm: boolean;
    data: any;
    resolver: (value: ConfirmResult<any>) => void;
  } | null>(null);

  const requestConfirm = <T,>(opts: ConfirmOptions<T>) => {
    setOptions(opts);
    setData(opts.initialData ?? ({} as T));
    setIsOpen(true);

    return new Promise<ConfirmResult<T>>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const close = useCallback(
    (isConfirm: boolean) => {
      if (!resolver) return;
      pendingCloseRef.current = { isConfirm, data, resolver };
      setIsOpen(false);
    },
    [resolver, data],
  );

  const onExitComplete = useCallback(() => {
    const pending = pendingCloseRef.current;
    if (pending) {
      pending.resolver({ isConfirm: pending.isConfirm, data: pending.data });
      pendingCloseRef.current = null;
    }
  }, []);

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      close(false);
    }
  };

  useKeyDown(KEY_CODES.ESCAPE, () => close(false));
  useKeyDown(KEY_CODES.ENTER, () => close(true));

  return (
    <ConfirmContext.Provider value={{ requestConfirm }}>
      {children}
      <AnimatePresence onExitComplete={onExitComplete}>
        {isOpen ? (
          <motion.div
            key="confirm-window"
            className="ui:fixed ui:inset-0 ui:z-200 ui:flex ui:items-center ui:justify-center ui:bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION, ease: "easeOut" }}
            onClick={onBackdropClick}
          >
            <motion.div
              className="ui:w-100 ui:max-w-sm ui:origin-center ui:justify-center ui:rounded-3xl ui:bg-bg-light ui:px-6 ui:pt-6 ui:pb-4 ui:shadow-xl"
              initial={{ opacity: 1, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 1, scale: 0.95 }}
              transition={{ duration: DURATION, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {options.icon && <div className="ui:mb-4 ui:flex ui:justify-center">{options.icon}</div>}

              {options.title && <h2 className="ui:mb-2 ui:text-center ui:text-xl ui:font-medium">{options.title}</h2>}

              {options.description && (
                <p className="ui:mb-4 ui:text-center ui:font-light ui:text-text-dark">{options.description}</p>
              )}

              {options.actions?.length && (
                <div className="ui:mb-4 ui:space-y-3">
                  {options.actions.map((Action, idx) => (
                    <Action key={idx} data={data} setData={setData} />
                  ))}
                </div>
              )}

              <hr className="ui:mt-4 ui:mb-2.75 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
              <div className="ui:flex ui:justify-between">
                <button
                  className="ui:cursor-pointer ui:px-3 ui:font-light ui:text-text-dark/75"
                  onClick={() => close(false)}
                >
                  {options.cancelText ?? "Cancel"}
                </button>
                <button
                  className={clsx(
                    "ui:cursor-pointer ui:rounded-lg ui:px-6 ui:py-2 ui:text-white ui:hover:bg-black",
                    options.color === "danger" ? "ui:bg-red-500" : "ui:bg-green-500",
                  )}
                  onClick={() => close(true)}
                >
                  {options.confirmText ?? "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};

export const useConfirmWindow = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirmWindow must be used within ConfirmWindowProvider");
  }
  return ctx.requestConfirm;
};
