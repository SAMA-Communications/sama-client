import { createContext, useContext, useState, ReactNode, MouseEvent } from "react";

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

  const requestConfirm = <T,>(opts: ConfirmOptions<T>) => {
    setOptions(opts);
    setData(opts.initialData ?? ({} as T));
    setIsOpen(true);

    return new Promise<ConfirmResult<T>>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const close = (isConfirm: boolean) => {
    setIsOpen(false);
    resolver?.({ isConfirm, data });
  };

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      close(false);
    }
  };

  return (
    <ConfirmContext.Provider value={{ requestConfirm }}>
      {children}
      {isOpen ? (
        <div
          className="ui:fixed ui:inset-0 ui:z-50 ui:flex ui:items-center ui:justify-center ui:bg-black/50"
          onClick={onBackdropClick}
        >
          <div className="ui:w-100 ui:max-w-sm ui:justify-center ui:rounded-3xl ui:bg-white ui:px-3 ui:pt-9 ui:pb-3 ui:shadow-xl">
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

            <div className="ui:flex ui:justify-between ui:gap-3 ui:pt-4">
              <button
                className="ui:flex-1 ui:cursor-pointer ui:rounded-lg ui:bg-hover-light ui:p-2 ui:hover:bg-hover-light/75"
                onClick={() => close(false)}
              >
                {options.cancelText ?? "Cancel"}
              </button>
              <button
                className="ui:flex-1 ui:cursor-pointer ui:rounded-lg ui:bg-red-500 ui:p-2 ui:text-white ui:hover:bg-red-600"
                onClick={() => close(true)}
              >
                {options.confirmText ?? "Confirm"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
