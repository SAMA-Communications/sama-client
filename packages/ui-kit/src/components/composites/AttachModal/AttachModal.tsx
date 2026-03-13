import { clsx } from "clsx";

import { MediaAttachments } from "../MediaAttachments";
import { TextAreaInput } from "../../elements/TextAreaInput";
import { OvalLoader } from "../../elements/OvalLoader";
import { WrapperRoot } from "../../elements/WrapperRoot";

import type { AttachModalProps } from "./AttachModal.types";

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
    <WrapperRoot
      className={clsx(
        "ui:absolute ui:top-0 ui:z-[200] ui:flex ui:h-dvh ui:w-dvw ui:items-center ui:justify-center ui:bg-black/50 ui:p-2.5",
        className,
      )}
      {...rest}
    >
      <div
        className={`ui:flex ui:max-h-[90svh] ui:w-[500px] ui:flex-col ui:gap-5 ui:rounded-[32px] ui:bg-bg-light ui:p-7 ui:max-sm:w-[94svw] ${contentClassName}`}
      >
        <p className="ui:text-h5 ui:font-normal ui:text-black">{resolvedTitle}</p>

        {isSending ? (
          <p className="ui:text-h5 ui:self-center ui:py-2.5">Processing...</p>
        ) : isPending && !files.length ? (
          <OvalLoader width={80} height={80} wrapperClassName="ui:self-center" />
        ) : !files.length ? (
          <p className="ui:text-h5 ui:self-center ui:py-2.5">Select files</p>
        ) : (
          <MediaAttachments
            maxHeight={attachmentsMaxHeight}
            attachments={files}
            removeFileFunc={onRemoveFile}
            disableAnimation
          />
        )}

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

        {!isSending && (
          <div className="ui:mt-auto ui:flex ui:items-center ui:justify-end ui:gap-7">
            <p className="ui:text-h6 ui:mr-auto ui:cursor-pointer ui:font-light ui:text-accent-500" onClick={onAddMore}>
              Add
            </p>
            <p className="ui:text-h6 ui:cursor-pointer ui:font-light ui:text-accent-500" onClick={onCancel}>
              Cancel
            </p>
            <p className="ui:text-h6 ui:cursor-pointer ui:font-light ui:text-accent-500" onClick={onSend}>
              Send
            </p>
          </div>
        )}
      </div>
    </WrapperRoot>
  );
};
