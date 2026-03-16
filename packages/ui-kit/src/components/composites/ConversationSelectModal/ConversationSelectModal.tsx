import { X } from "lucide-react";

import { ConversationSelectModalProps } from "@composites/ConversationSelectModal/ConversationSelectModal.types";
import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";

import { Modal } from "@elements/Modal";

const panelClassName =
  "ui:h-[80svh] ui:w-[min(460px,100%)] ui:gap-5 ui:rounded-[32px] ui:bg-bg-light ui:p-[30px] ui:max-md:w-[94svw] ui:max-md:max-h-[90svh] ui:max-md:p-5";

export const ConversationSelectModal = ({ title, onClose, topContent, children }: ConversationSelectModalProps) => {
  return (
    <Modal panelClassName={panelClassName} onClick={onClose}>
      <div className="ui:flex ui:min-h-0 ui:flex-1 ui:flex-col ui:gap-2.75">
        <div className="ui:flex ui:shrink-0 ui:items-center ui:justify-between">
          <p className="ui:text-xl ui:font-normal ui:text-black">{title}</p>
          <button
            type="button"
            aria-label="Close"
            className="ui:mb-1.5 ui:cursor-pointer ui:self-start ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:hover:bg-bg-dark ui:hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        {topContent != null && <div className="ui:shrink-0">{topContent}</div>}
        <CustomVerticalScrollbar className="ui:min-h-0 ui:flex-1 ui:overscroll-contain">
          {children}
        </CustomVerticalScrollbar>
      </div>
    </Modal>
  );
};
