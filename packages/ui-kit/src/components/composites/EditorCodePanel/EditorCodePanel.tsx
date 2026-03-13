import { clsx } from "clsx";

import { WrapperRoot } from "../../elements/WrapperRoot";
import type { EditorCodePanelProps } from "./EditorCodePanel.types";

export const EditorCodePanel = ({ statusText, children, className, ...rest }: EditorCodePanelProps) => {
  return (
    <WrapperRoot className={clsx("ui:relative ui:flex ui:grow-3 ui:items-end", className)} {...rest}>
      <div className="ui:absolute ui:top-0 ui:left-1/2 ui:h-full ui:w-full ui:-translate-x-1/2 ui:py-3.5 ui:font-normal ui:lg:max-w-300">
        {children}
        <div className="ui:-mt-6.25 ui:h-6.25 ui:w-full ui:text-end ui:lg:max-w-300">
          <p className="ui:text-gray-400">Recent changes - {statusText}</p>
        </div>
      </div>
    </WrapperRoot>
  );
};
