import { clsx } from "clsx";
import { Tooltip } from "react-tooltip";
import { SearchCode, Save } from "lucide-react";

import { WrapperRoot } from "../../elements/WrapperRoot";
import type { EditorValidationBarProps } from "./EditorValidationBar.types";

export const EditorValidationBar = ({
  statusNode,
  tooltipId,
  tooltipContent,
  onCheck,
  onSave,
  saveDisabled,
  children,
  className,
  ...rest
}: EditorValidationBarProps) => {
  return (
    <WrapperRoot className={clsx("ui:flex ui:grow ui:items-end ui:gap-2.75", className)} {...rest}>
      <div className="ui:editor-validation ui:flex ui:h-full ui:grow ui:items-center ui:justify-end ui:gap-2.75 ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn">
        <div data-tooltip-id={tooltipId} data-tooltip-delay-hide={500} className="ui:flex ui:items-center ui:px-1">
          {statusNode}
        </div>
        <Tooltip id={tooltipId} className="editor-tooltip-style" classNameArrow="editor-tooltip-arrow">
          {tooltipContent}
        </Tooltip>
        <span className="ui:h-full ui:w-px ui:bg-gray-300" />
        {children}
      </div>
      <button
        type="button"
        className="ui:flex ui:h-11.5 ui:cursor-pointer ui:items-center ui:gap-1.75 ui:self-end ui:rounded-xl ui:border ui:bg-accent-500 ui:p-2 ui:text-base ui:text-white"
        onClick={onCheck}
      >
        <SearchCode size={24} color="white" />
        Check
      </button>
      <button
        type="button"
        className={`ui:flex ui:h-11.5 ui:cursor-pointer ui:items-center ui:gap-1.75 ui:self-end ui:rounded-xl ui:border ui:p-2 ui:text-base ui:text-white ${
          saveDisabled ? "ui:bg-gray-500" : "ui:bg-accent-500"
        }`}
        disabled={saveDisabled}
        onClick={onSave}
      >
        <Save size={24} color="white" />
        Save
      </button>
    </WrapperRoot>
  );
};
