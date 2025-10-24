import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { createContext, useContext, useState } from "react";

import { useKeyDown } from "@hooks/useKeyDown.js";

import { KEY_CODES } from "@utils/constants.js";

const ConfirmContext = createContext(null);

const ActionComponents = {
  messageDelete: ({ data, setData }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={data.type === "all"}
        onChange={(e) =>
          setData({ ...data, type: e.target.checked ? "all" : "myself" })
        }
      />
      <span>Delete for everyone</span>
    </label>
  ),
};

export default function ConfirmWindowProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({});
  const [resolver, setResolver] = useState(null);
  const [data, setData] = useState({});

  const requestConfirm = (opts = {}) => {
    setOptions(opts);
    setIsOpen(true);

    if (opts.action === "messageDelete") {
      setData({ type: "myself" });
    } else {
      setData({});
    }

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  };

  const handleClose = (isConfirm) => {
    setIsOpen(false);
    resolver?.({
      isConfirm,
      data,
    });
  };

  useKeyDown(KEY_CODES.ESCAPE, handleClose);

  const ActionComponent = options.action
    ? ActionComponents[options.action]
    : null;

  return (
    <ConfirmContext.Provider value={{ requestConfirm }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <m.div
            className="fixed inset-0 flex items-center justify-center bg-(--color-black-50) z-50"
            initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`p-[30px] flex flex-col gap-[10px] rounded-[32px] bg-(--color-bg-light) w-[min(460px,100%)] max-md:w-[94svw] max-md:p-[20px] max-h-[80svh]`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <p className="!text-h5 !font-normal text-black">
                {options.title || "Confirm"}
              </p>
              {options.description && (
                <p className="!text-h6 !font-normal text-black">
                  {options.description}
                </p>
              )}

              {ActionComponent && (
                <ActionComponent data={data} setData={setData} />
              )}

              <div className="mt-2 justify-end gap-[30px] flex items-center">
                <p
                  className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
                  onClick={() => handleClose(false)}
                >
                  {options.cancelText || "Cancel"}
                </p>
                <p
                  className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
                  onClick={() => handleClose(true)}
                >
                  {options.confirmText || "Confirm"}
                </p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}

export const useConfirmWindow = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("ConfirmWindowProvider Error");
  return ctx.requestConfirm;
};
