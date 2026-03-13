import { clsx } from "clsx";
import { Minimize2 } from "lucide-react";

import { WrapperRoot } from "../../elements/WrapperRoot";
import type { EditorLogsPanelProps } from "./EditorLogsPanel.types";

export const EditorLogsPanel = ({ visible, onClose, children, className, ...rest }: EditorLogsPanelProps) => {
  if (!visible) return null;

  return (
    <WrapperRoot
      className={clsx("ui:relative ui:mb-2.5 ui:max-h-[min(400px,25svh)] ui:w-full ui:grow-2 ui:self-center ui:overflow-hidden ui:rounded-xl ui:border ui:border-dashed ui:border-gray-300 ui:lg:max-w-300", className)}
      animate={{ opacity: [0, 1], scale: [0.8, 1.02, 1] }}
      exit={{ scale: [1, 0.8], opacity: [1, 0] }}
      transition={{ duration: 0.3 }}
      {...rest}
    >
      <div className="ui:z-10 ui:flex ui:justify-between ui:p-3">
        <p className="ui:h-6.25 ui:text-gray-500">Debugging log:</p>
        <button type="button" className="ui:cursor-pointer" onClick={onClose}>
          <Minimize2 size={25} color="var(--color-text-dark)" />
        </button>
      </div>
      <div className="ui:absolute ui:top-8.75 ui:left-0 ui:h-[calc(100%)] ui:w-full ui:pt-4 ui:pb-4">
        {children}
      </div>
    </WrapperRoot>
  );
};
