import { useSelector } from "react-redux";

import MediaAttachment from "@components/message/elements/MediaAttachment.js";

import { selectParticipantsEntities } from "@store/values/Participants.js";

import { getUserFullName } from "@utils/UserUtils.js";

import { SquarePen, X, Reply, Forward } from "lucide-react";

export default function AdditionalMessages({
  message,
  messages,
  type,
  isPreview = false,
  color = "accent",
  onCloseFunc,
  onClickFunc,
}) {
  const participants = useSelector(selectParticipantsEntities);

  const { attachments, body, from: senderId, error } = message || messages[0] || {};
  const isReply = type === "reply";
  const isEdit = type === "edit";
  const isAccent = color === "accent";

  if (error) {
    return (
      <div className={`border-text-dark w-[calc(100%-7rem)] gap-2.75 self-center rounded-xl border p-2 lg:max-w-272`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`flex shrink items-center lg:max-w-272 ${
        isPreview
          ? "border-text-dark w-[calc(100%-7rem)] gap-2.75 self-center rounded-xl border px-2 py-1"
          : `-mb-3 flex cursor-pointer flex-row flex-nowrap items-center gap-1.75 rounded-t-xl pt-0.5 pr-3 pb-3 pl-1 ${isAccent ? "bg-bg-dark/15" : "bg-accent-500/65"}`
      }`}
      onClick={onClickFunc}
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
        <Reply size={19} color={isAccent ? "var(--color-text-dark)" : "white"} />
      ) : null}
      {attachments?.length ? (
        <div className="flex h-11 w-11 overflow-hidden rounded-lg object-cover">
          <MediaAttachment attachment={attachments[0]} flexGrow={1} />
        </div>
      ) : null}
      <div className="flex w-[calc(100%-2.25rem)] grow flex-col">
        <p
          className={`text-accent-500 overflow-hidden font-medium text-ellipsis whitespace-nowrap ${isAccent ? "var(--color-text-dark)" : "text-white"}`}
        >
          {isEdit ? (
            "Edit message"
          ) : (
            <>
              {isPreview && isReply ? "Reply to " : ""}
              {senderId && getUserFullName(participants[senderId])}
            </>
          )}
        </p>
        <p className={`overflow-hidden font-light text-ellipsis whitespace-nowrap ${isAccent ? "" : "text-white"}`}>
          {isReply || messages?.length < 2 ? body : messages?.length + " forwarded messages"}
        </p>
      </div>
      {onCloseFunc && (
        <span>
          <X size={28} color="var(--color-text-dark)" className="cursor-pointer" onClick={onCloseFunc} />
        </span>
      )}
    </div>
  );
}
