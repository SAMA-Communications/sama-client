import { clsx } from "clsx";
import { Info, ListStart } from "lucide-react";
import { Tooltip } from "react-tooltip";

import type { EditorHelperBarProps } from "@composites/EditorHelperBar/EditorHelperBar.types";

import { WrapperRoot } from "@elements/WrapperRoot";

export const EditorHelperBar = ({
  docsHref,
  docsLabel,
  tooltipId,
  actions,
  actionButtonClassName = "",
  className,
  ...rest
}: EditorHelperBarProps) => {
  return (
    <WrapperRoot
      className={clsx(
        "ui:editor-helper ui:flex ui:h-full ui:items-center ui:gap-2.75 ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn",
        className,
      )}
      {...rest}
    >
      <a href={docsHref} target="_blank" rel="noopener noreferrer">
        <Info size={28} color="var(--color-text-dark)" />
      </a>
      <span className="ui:h-[30px] ui:w-px ui:bg-gray-400" />
      <ListStart color="var(--color-text-dark)" data-tooltip-id={tooltipId} data-tooltip-delay-hide={500} size={28} />
      <Tooltip clickable id={tooltipId} className="editor-tooltip-style" classNameArrow="editor-tooltip-arrow">
        <div className="ui:flex ui:flex-col ui:gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              type="button"
              className={`ui:cursor-pointer ui:text-black/40 ui:underline ui:underline-offset-4 ${actionButtonClassName}`}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </Tooltip>
    </WrapperRoot>
  );
};

