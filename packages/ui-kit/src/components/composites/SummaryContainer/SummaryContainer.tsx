import { WandSparkles, X } from "lucide-react";

import { SummaryContainerProps } from "@composites/SummaryContainer/SummaryContainer.types";

import { OvalLoader } from "@elements/OvalLoader";

export const SummaryContainer = ({ summaryContent, onClose, getFilterLabel }: SummaryContainerProps) => {
  if (!summaryContent) return null;

  const { isLoading, text, filter } = summaryContent;

  return (
    <div className="ui:absolute ui:right-1/2 ui:bottom-17 ui:z-45 ui:w-[calc(100%-28px)] ui:max-w-300 ui:translate-x-1/2 ui:rounded-2xl ui:bg-black/65 ui:p-3 ui:text-end ui:text-white">
      <div className="ui:flex ui:items-center ui:justify-between">
        <span className="ui:text-span ui:text-gray-300">Only you can see this summary</span>
        <X color="white" size={16} className="ui:cursor-pointer" onClick={onClose} />
      </div>
      <div className="ui:flex ui:items-center ui:gap-1.75">
        <WandSparkles size={22} color="white" />
        <p className="ui:my-2 ui:text-xl">
          <b>Here&apos;s what you missed: </b>
        </p>
      </div>
      <div className="ui:flex ui:max-h-100 ui:flex-col ui:overflow-auto ui:rounded-lg ui:text-left">
        {isLoading ? (
          <OvalLoader width={35} height={35} wrapperClassName="ui:my-[10px] ui:self-center" />
        ) : (
          <p>{text}</p>
        )}
      </div>
      {getFilterLabel && (
        <span className="ui:text-span ui:mt-2.25 ui:ml-auto ui:text-gray-300">{getFilterLabel(filter)}</span>
      )}
    </div>
  );
};
