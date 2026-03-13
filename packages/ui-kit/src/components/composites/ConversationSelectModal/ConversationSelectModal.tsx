import { X } from "lucide-react";

import { ConversationSelectModalProps } from "@composites/ConversationSelectModal/ConversationSelectModal.types";

export const ConversationSelectModal = ({ title, onClose, children }: ConversationSelectModalProps) => {
  return (
    <div className="ui:absolute ui:top-0 ui:z-10 ui:flex ui:h-dvh ui:w-dvw ui:items-center ui:justify-center ui:bg-black/50">
      <div
        className="ui:flex ui:h-[80svh] ui:w-[min(460px,100%)] ui:flex-col ui:gap-[20px] ui:rounded-[32px] ui:bg-(--color-bg-light) ui:p-[30px] ui:max-md:w-[94svw] ui:max-md:p-[20px]"
        key="forwardTo"
      >
        <div className="ui:flex ui:items-center ui:justify-between">
          <p className="ui:text-h5 ui:font-normal ui:text-black">{title}</p>
          <X className="ui:h-[22px] ui:w-[22px] ui:shrink-0 ui:cursor-pointer" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
};

