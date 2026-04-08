import { forwardRef } from "react";

import { clsx } from "clsx";
import { Check, Forward, UserRound } from "lucide-react";
import * as m from "motion/react-m";

import { AdditionalMessages } from "@composites/AdditionalMessages";
import type { ChatMessageProps } from "@composites/ChatMessage/ChatMessage.types";

import { MessageStatus } from "@elements/MessageStatus";
import { MessageUserIcon } from "@elements/MessageUserIcon";
import { WrapperRoot } from "@elements/WrapperRoot";

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage(
  {
    message,
    sender,
    isCurrentUser,
    repliedMessage,
    bodyContent,
    attachmentsNode,
    linkPreviewNode,
    onUserProfile,
    onContextMenu,
    onSelectClick,
    onUnselectClick,
    onReplyClick,
    onVisible,
    onSwipeReply,
    isMobile = false,
    isSelected = false,
    isSelectionMode = false,
    isLongTimeBetweenMessages = false,
    isPrevMessageYours: prev = false,
    isNextMessageYours: next = false,
    isBlockStart: _isBlockStart,
    isBlockEnd: isBlockEndProp,
    showAuthor: showAuthorProp,
    showTimestamp: showTimestampProp,
    senderDisplayName = "",
    repliedMessageSenderName = "",
    swipeReplyThreshold = 50,
    onBubblePointerDown,
    onBubblePointerUp,
    onBubblePointerLeave,
    onBubbleClick,
    hideUserIcon = false,
    className,
    ...rest
  },
  ref,
) {
  const { _id, body, from, attachments, status, t, created_at, updated_at, old_id } = message;
  const isForwardMessage = !!message.forwarded_message_id;
  const isEdited = created_at !== updated_at;
  const hasAttachments = !!attachments?.length;

  const atBlockEnd = isBlockEndProp !== undefined ? isBlockEndProp : !next;
  const continuesBlockBelow = !atBlockEnd;
  const showAuthorName = showAuthorProp !== undefined ? showAuthorProp : !prev;
  const showTimeFooter = showTimestampProp !== undefined ? showTimestampProp : isLongTimeBetweenMessages || !next;

  const timeSend = (() => {
    const time = new Date(t * 1000);
    return `${time.getHours()}:${time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()}`;
  })();

  const openUserProfile = (uid: string) => onUserProfile?.(uid);

  const handleSelectionContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu?.(e, null, { message });
  };

  const handleBubbleContextMenu = (e: React.MouseEvent) => {
    onContextMenu?.(e, body ? "Text" : null);
  };

  return (
    <WrapperRoot
      className={clsx(
        "ui:flex ui:w-full ui:flex-row ui:flex-nowrap ui:items-end ui:gap-2.75",
        isCurrentUser ? "ui:justify-end" : "ui:justify-start",
        className,
      )}
      onClick={isSelectionMode ? (isSelected ? () => onUnselectClick?.() : () => onSelectClick?.()) : undefined}
      onContextMenu={handleSelectionContextMenu}
      {...rest}
    >
      {isSelectionMode && (
        <div
          className={`ui:flex ui:h-11.5 ui:w-11.5 ui:items-center ui:justify-center ${isCurrentUser ? "ui:mr-auto" : ""}`}
        >
          {isSelected ? (
            <span className="ui:flex ui:h-5.5 ui:w-5.5 ui:items-center ui:justify-center ui:rounded-full ui:bg-accent-500/70">
              <Check size={14} color="white" />
            </span>
          ) : (
            <span className="ui:h-5.5 ui:w-5.5 ui:rounded-full ui:border ui:border-black/50" />
          )}
        </div>
      )}
      <m.div
        ref={ref}
        key={old_id || _id}
        data-message-id={_id}
        className={`ui:relative ui:flex ui:flex-row ui:gap-2.75 ${continuesBlockBelow ? "" : "ui:mb-1.5"}`}
        drag={isMobile ? "x" : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_e, info) => {
          if (onSwipeReply && info.offset.x < -swipeReplyThreshold) onSwipeReply();
        }}
        whileDrag={{ scale: 0.9 }}
      >
        {hideUserIcon ? null : (
          <div className="ui:flex ui:min-w-11.5 ui:items-end">
            {continuesBlockBelow || isCurrentUser ? null : (
              <button
                type="button"
                onClick={() => openUserProfile(from)}
                className="ui:cursor-pointer ui:border-0 ui:bg-transparent ui:p-0"
              >
                <MessageUserIcon
                  user={sender}
                  isCurrentUser={isCurrentUser}
                  fallbackCurrentUser={<UserRound color="white" />}
                  fallbackOtherUser={<UserRound color="black" />}
                  className="ui:flex ui:h-11.5 ui:w-11.5 ui:cursor-pointer ui:items-center ui:justify-center ui:overflow-hidden ui:rounded-xl ui:bg-hover-light"
                />
              </button>
            )}
          </div>
        )}
        <div
          className={`ui:flex ui:min-w-0 ui:flex-col ui:max-2xl:max-w-[min(80dvw,520px)] ui:2xl:max-w-[min(60%,520px)] ${
            isCurrentUser ? "ui:ml-auto" : "ui:mr-auto"
          }`}
        >
          {!showAuthorName ? null : (
            <div
              className="ui:mb-1.25 ui:cursor-pointer ui:truncate ui:text-text-dark/60"
              onClick={() => openUserProfile(from)}
            >
              &zwnj;{senderDisplayName || "Deleted account"}
            </div>
          )}
          <div
            className={`ui:flex ui:w-max ui:max-w-full ui:min-w-0 ui:flex-col ui:rounded-xl ui:shadow-btn ${
              continuesBlockBelow ? "" : isCurrentUser ? "ui:rounded-br-none" : "ui:rounded-bl-none"
            } ${isCurrentUser ? "ui:self-end" : "ui:self-start"}`}
          >
            {isForwardMessage ? (
              <div
                className={`ui:-mb-3 ui:flex ui:flex-row ui:flex-nowrap ui:items-center ui:gap-1.75 ui:rounded-t-xl ui:px-1 ui:pt-0.5 ui:pb-3 ${
                  isCurrentUser ? "ui:bg-accent-500/65" : "ui:bg-bg-dark/5"
                }`}
              >
                <Forward size={18} color={isCurrentUser ? "white" : "var(--color-text-dark)"} />
                <p className={`ui:text-sm ui:font-medium ${isCurrentUser ? "ui:text-white" : "ui:text-black/35"}`}>
                  Forwarded
                </p>
              </div>
            ) : null}
            {repliedMessage ? (
              <AdditionalMessages
                type="reply"
                color={isCurrentUser ? "white" : "accent"}
                message={repliedMessage}
                onClickFunc={onReplyClick}
                senderName={repliedMessageSenderName}
              />
            ) : null}
            <m.div
              className={`ui:relative ui:flex ui:min-h-11.5 ui:max-w-full ui:min-w-0 ui:flex-col ui:justify-between ui:gap-1 ui:rounded-xl ui:p-1 ${
                isCurrentUser ? "ui:bg-accent-100" : "ui:bg-white"
              } ${continuesBlockBelow ? "" : isCurrentUser ? "ui:rounded-br-none" : "ui:rounded-bl-none"} ${
                isForwardMessage ? "ui:min-w-28" : "ui:min-w-14"
              } ${isSelected ? "ui:bg-accent-200!" : ""} ${repliedMessage ? "ui:w-full" : "ui:w-max"}`}
              whileTap={isMobile ? { scale: 0.95, transition: { duration: 0.3, delay: 0.05 } } : undefined}
              onClick={onBubbleClick}
              onPointerDown={onBubblePointerDown}
              onPointerUp={onBubblePointerUp}
              onPointerLeave={onBubblePointerLeave}
              onContextMenu={isSelectionMode ? handleSelectionContextMenu : handleBubbleContextMenu}
            >
              <div className="ui:flex ui:w-full ui:min-w-0 ui:flex-col ui:flex-wrap ui:overflow-hidden">
                {hasAttachments && attachmentsNode}
                {bodyContent}
                {!hasAttachments && linkPreviewNode}
              </div>
            </m.div>
          </div>
          {(isEdited || showTimeFooter) && (
            <div
              className={`ui:relative ui:mt-1.25 ui:mb-0.5 ui:flex ui:w-full ui:flex-row ui:items-center ui:gap-0.75 ui:self-end ${
                isCurrentUser ? "ui:justify-end" : "ui:justify-start"
              }`}
            >
              {isEdited ? <span className="ui:text-xs ui:leading-4.5 ui:text-text-dark/60">edited</span> : null}
              {showTimeFooter && (
                <>
                  <div className="ui:text-xs ui:text-text-dark/60">{timeSend}</div>
                  {isCurrentUser ? (
                    <MessageStatus status={status === "sent" || status === "read" ? status : undefined} />
                  ) : null}
                </>
              )}
            </div>
          )}
        </div>
        {hideUserIcon ? null : (
          <div className="ui:flex ui:min-w-11.5 ui:items-end">
            {continuesBlockBelow || !isCurrentUser ? null : (
              <button
                type="button"
                onClick={() => openUserProfile(from)}
                className="ui:cursor-pointer ui:border-0 ui:bg-transparent ui:p-0"
              >
                <MessageUserIcon
                  user={sender}
                  isCurrentUser={isCurrentUser}
                  fallbackCurrentUser={<UserRound color="white" />}
                  fallbackOtherUser={<UserRound color="black" />}
                />
              </button>
            )}
          </div>
        )}
      </m.div>
    </WrapperRoot>
  );
});
