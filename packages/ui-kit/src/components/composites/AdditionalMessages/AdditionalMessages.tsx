import { clsx } from "clsx";
import { SquarePen, X, Reply, Forward } from "lucide-react";

import type { AdditionalMessagesProps } from "@composites/AdditionalMessages/AdditionalMessages.types";

import { WrapperRoot } from "@elements/WrapperRoot";

export const AdditionalMessages = ({
  type,
  message,
  messages = [],
  isPreview = false,
  color = "accent",
  onCloseFunc,
  onClickFunc,
  senderName = "",
  attachmentSlot,
  className,
  ...rest
}: AdditionalMessagesProps) => {
  const data = message ?? (Array.isArray(messages) && messages[0]) ?? {};
  const msg = data as { body?: string; attachments?: unknown[]; from?: string; error?: string };
  const { attachments, body, error } = msg;

  const isReply = type === "reply";
  const isEdit = type === "edit";
  const isAccent = color === "accent";

  if (error) {
    return (
      <WrapperRoot
        className={clsx(
          "ui:w-[calc(100%-7rem)] ui:gap-2.75 ui:self-center ui:rounded-xl ui:border ui:border-text-dark ui:p-2 ui:lg:max-w-272",
          className,
        )}
        {...rest}
      >
        <p>{error}</p>
      </WrapperRoot>
    );
  }

  const titleLine = isEdit ? "Edit message" : (isPreview && isReply ? "Reply to " : "") + senderName;
  const bodyLine =
    isReply || (Array.isArray(messages) && messages.length < 2)
      ? body
      : Array.isArray(messages)
        ? messages.length + " forwarded messages"
        : "";

  return (
    <WrapperRoot
      className={clsx(
        "ui:flex ui:shrink ui:items-center ui:lg:max-w-272",
        isPreview
          ? "ui:w-[calc(100%-7rem)] ui:gap-2.75 ui:self-center ui:rounded-xl ui:border ui:border-text-dark ui:px-2 ui:py-1"
          : `ui:-mb-3 ui:flex ui:min-h-15.5 ui:flex-row ui:flex-nowrap ui:items-center ui:gap-1.75 ui:rounded-t-xl ui:pt-0.5 ui:pr-3 ui:pb-3 ui:pl-1 ${isAccent ? "ui:bg-bg-dark/5" : "ui:bg-accent-500/65"} ${onClickFunc ? "ui:cursor-pointer" : ""}`,
        className,
      )}
      onClick={onClickFunc}
      {...rest}
    >
      {isPreview ? (
        <span>
          {isEdit ? (
            <SquarePen size={28} color="var(--color-text-dark)" />
          ) : isReply ? (
            <Reply size={28} color={isAccent ? "var(--color-text-dark)" : "white"} />
          ) : (
            <Forward size={28} color="var(--color-text-dark)" />
          )}
        </span>
      ) : isReply ? (
        <Reply size={19} color={isAccent ? "var(--color-text-dark)" : "white"} className="ui:min-w-4.75" />
      ) : null}
      {attachments?.length && attachmentSlot ? (
        <div className="ui:flex ui:h-10 ui:w-10 ui:min-w-10 ui:overflow-hidden ui:rounded-lg ui:object-cover">
          {attachmentSlot}
        </div>
      ) : null}
      <div className="ui:flex ui:w-[calc(100%-5rem)] ui:max-w-full ui:grow ui:flex-col">
        <p
          className={`ui:w-full ui:overflow-hidden ui:font-medium ui:text-ellipsis ui:whitespace-nowrap ${isAccent ? "ui:text-text-dark" : "ui:text-white"}`}
        >
          {titleLine}
        </p>
        <p
          className={`ui:w-full ui:overflow-hidden ui:font-light ui:text-ellipsis ui:whitespace-nowrap ${isAccent ? "" : "ui:text-white"}`}
        >
          {bodyLine}
        </p>
      </div>
      {onCloseFunc && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onCloseFunc();
          }}
          className="ui:cursor-pointer"
        >
          <X size={28} color="var(--color-text-dark)" />
        </span>
      )}
    </WrapperRoot>
  );
};
