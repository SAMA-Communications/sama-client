import { clsx } from "clsx";

import type { AttachModalProps } from "@composites/AttachModal/AttachModal.types";
import { MediaAttachments } from "@composites/MediaAttachments";

import { Modal } from "@elements/Modal";
import { OvalLoader } from "@elements/OvalLoader";
import { TextAreaInput } from "@elements/TextAreaInput";

const attachPanelClassName =
  "ui:max-h-[90svh] ui:w-[500px]! ui:flex-col ui:gap-5 ui:rounded-[32px] ui:p-7 ui:max-sm:w-[94svw]";

export const AttachModal = ({
  files,
  onRemoveFile,
  onSend,
  onCancel,
  onAddMore,
  inputRef,
  onInput,
  onKeyDown,
  placeholder = "Type your message...",
  isSending = false,
  isPending = false,
  title,
  attachmentsMaxHeight = "min(460px, calc(100svh - 300px))",
  contentClassName = "",
  className,
  ...rest
}: AttachModalProps) => {
  const resolvedTitle = title ?? (files.length > 1 ? `Selected ${files.length} files` : "Send attachment");

  return (
    <Modal
      className={clsx("ui:z-100 ui:p-2.5", className)}
      panelClassName={clsx(attachPanelClassName, contentClassName)}
      onClick={onCancel}
      {...rest}
    >
      <div className="ui:flex ui:flex-col ui:gap-2.75">
        <p className="ui:text-xl ui:font-normal ui:text-black">{resolvedTitle}</p>

        <div className="ui:flex ui:min-h-50 ui:flex-col ui:items-center ui:justify-center">
          {isSending ? (
            <p className="ui:self-center ui:py-2.5 ui:text-lg">Processing...</p>
          ) : isPending && !files.length ? (
            <OvalLoader width={80} height={80} wrapperClassName="ui:self-center" />
          ) : !files.length ? (
            <p className="ui:self-center ui:py-2.5 ui:text-lg ui:text-gray-500">Select files</p>
          ) : (
            <MediaAttachments
              maxHeight={attachmentsMaxHeight}
              attachments={files}
              removeFileFunc={onRemoveFile}
              disableAnimation
            />
          )}
        </div>

        <TextAreaInput
          className="ui:max-h-[140px] ui:min-h-10 ui:resize-none ui:rounded-xl ui:bg-hover-light ui:px-3.5 ui:py-3 ui:text-black ui:[&::-webkit-scrollbar]:hidden"
          inputRef={inputRef}
          onInput={onInput}
          onKeyDown={onKeyDown}
          onBlur={onInput}
          placeholder={isSending ? "Processing and sending files..." : placeholder}
          disabled={isSending}
          autoFocus
        />

        <hr className="ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
        {!isSending && (
          <div className="ui:mt-auto ui:flex ui:items-center ui:justify-end ui:gap-7">
            <button
              className="ui:mr-auto ui:flex ui:cursor-pointer ui:items-center ui:px-3 ui:py-2 ui:text-accent-500"
              onClick={onAddMore}
            >
              Add
            </button>
            <button
              className="ui:flex ui:cursor-pointer ui:items-center ui:px-3 ui:py-2 ui:text-text-dark"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="ui:flex ui:cursor-pointer ui:items-center ui:rounded-xl ui:bg-accent-500 ui:px-6 ui:py-2 ui:text-white ui:duration-150 ui:hover:bg-black"
              onClick={onSend}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
