import { useEffect, useRef } from "react";

import { useLocation } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import MessageLinkPreview from "@components/hub/elements/MessageLinkPreview";

import { ChatMessage as UIChatMessage, MediaAttachments } from "@sama-communications.ui-kit";

import draftService from "@services/tools/draftService.js";
import { hardUrlify, urlify } from "@services/tools/urlMetaService";
import { messageObserver as observer } from "@services/tools/visibilityObserver.js";

import { addExternalProps, setAllParams } from "@store/values/ContextMenu.js";
import { selectParticipantsEntities } from "@store/values/Participants";

import { ALLOWED_FORMATS_TO_COPY, SWIPE_THRESHOLD } from "@utils/constants.js";
import { addPrefix, addSuffix } from "@utils/NavigationUtils.js";
import { getUserFullName } from "@utils/UserUtils.js";

export default function ChatMessage({
  sender,
  message,
  repliedMessage,
  currentUserId,
  onViewFunc,
  onSelectClick = () => {},
  onUnselectClick = () => {},
  onReplyClickFunc,
  isMobile,
  isSelected,
  isSelectionMode = false,
  isLongTimeBetweenMessages = false,
  isPrevMessageYours: prev,
  isNextMessageYours: next,
  isBlockStart,
  isBlockEnd,
  showAuthor,
  showTimestamp,
}) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();
  const participants = useSelector(selectParticipantsEntities);
  const messageRef = useRef(null);

  const { _id, body, from, attachments, url_preview } = message;
  const isCurrentUser = from === currentUserId;
  const linkColor = "text-accent-500";

  const openUserProfile = (uid) => {
    if (sender)
      isCurrentUser ? addPrefix(pathname + hash, `/profile`) : addSuffix(pathname + hash, `/user?uid=${uid}&view=card`);
  };

  const refreshLinkPreview = (event, url) => {
    event.preventDefault();
    hardUrlify(_id, url);
  };

  const openContextMenu = (e, copyType, externalProps) => {
    e.preventDefault();
    e.stopPropagation();
    const isAttachment = copyType === "Attachment";
    const isCopyableAttachment =
      isAttachment && ALLOWED_FORMATS_TO_COPY.includes(externalProps?.attachment?.file_content_type);
    const copyOption = (isCopyableAttachment && "messageCopyAttachment") || (message.body && "messageCopyText") || null;

    const hasDistinctUpdatedAt =
      message.updated_at != null && message.created_at != null && message.created_at !== message.updated_at;

    const list = [
      "messageReply",
      message.body && isCurrentUser && !message.forwarded_message_id ? "messageEdit" : null,
      copyOption,
      isAttachment ? "messageSaveAs" : null,
      "messageForward",
      "messageDelete",
      "messageSelect",
      "messageMetaSentAt",
      hasDistinctUpdatedAt ? "messageMetaEditedAt" : null,
    ].filter(Boolean);

    dispatch(
      setAllParams({
        category: "message",
        list,
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
        externalProps: { message, ...externalProps },
      }),
    );
  };

  useEffect(() => {
    const el = messageRef.current;
    if (!el || !observer || !onViewFunc) return;
    const handleVisible = () => onViewFunc?.();
    observer.observe(el, handleVisible, true);
    return () => observer.unobserve(el);
  }, [_id, onViewFunc]);

  const longPressTimeout = useRef(null);
  const longPressTriggered = useRef(false);

  const handlePointerUp = () => clearTimeout(longPressTimeout.current);
  const handleClick = (e) => longPressTriggered.current && e.stopPropagation();
  const handlePointerDown = (e) => {
    e.stopPropagation();
    longPressTriggered.current = false;
    longPressTimeout.current = setTimeout(() => {
      longPressTriggered.current = true;
      openContextMenu(e, message.body ? "Text" : null);
    }, 250);
  };

  const bodyContent = body ? (
    <p className="max-w-full p-2 font-light wrap-break-word whitespace-pre-wrap normal-nums!">
      {urlify(_id, body, linkColor, !url_preview)}
    </p>
  ) : null;

  const attachmentsNode = attachments?.length ? (
    <MediaAttachments
      onContextMenu={
        isSelectionMode
          ? (e) => openContextMenu(e, null, { message })
          : (e, att) => openContextMenu(e, "Attachment", { attachment: att })
      }
      attachments={attachments}
      mid={message._id}
      onOpenMedia={(index) => addSuffix(pathname + hash, `/media?mid=${_id}=${index}`)}
    />
  ) : null;

  const linkPreviewNode =
    !attachments?.length && body ? (
      <MessageLinkPreview
        urlData={url_preview}
        color={isCurrentUser ? "accent" : "white"}
        refreshFunc={refreshLinkPreview}
      />
    ) : null;

  return (
    <UIChatMessage
      ref={messageRef}
      message={message}
      sender={sender}
      isCurrentUser={isCurrentUser}
      repliedMessage={repliedMessage ?? undefined}
      bodyContent={bodyContent}
      attachmentsNode={attachmentsNode}
      linkPreviewNode={linkPreviewNode}
      hideUserIcon={isMobile}
      onUserProfile={openUserProfile}
      onContextMenu={openContextMenu}
      onSelectClick={onSelectClick ? () => onSelectClick(_id) : null}
      onUnselectClick={onUnselectClick ? () => onUnselectClick(_id) : null}
      onReplyClick={onReplyClickFunc}
      onVisible={onViewFunc}
      onSwipeReply={() => {
        dispatch(addExternalProps({ [message.cid]: { draft_replied_mid: _id } }));
        draftService.saveDraft(message.cid, { replied_mid: _id });
      }}
      isMobile={isMobile}
      isSelected={isSelected}
      isSelectionMode={isSelectionMode}
      isLongTimeBetweenMessages={isLongTimeBetweenMessages}
      isPrevMessageYours={prev}
      isNextMessageYours={next}
      isBlockStart={isBlockStart}
      isBlockEnd={isBlockEnd}
      showAuthor={showAuthor}
      showTimestamp={showTimestamp}
      senderDisplayName={getUserFullName(sender)}
      repliedMessageSenderName={repliedMessage ? getUserFullName(participants[repliedMessage.from]) : undefined}
      swipeReplyThreshold={SWIPE_THRESHOLD}
      onBubblePointerDown={isMobile ? handlePointerDown : undefined}
      onBubblePointerUp={isMobile ? handlePointerUp : undefined}
      onBubblePointerLeave={isMobile ? handlePointerUp : undefined}
      onBubbleClick={isMobile ? handleClick : undefined}
    />
  );
}
