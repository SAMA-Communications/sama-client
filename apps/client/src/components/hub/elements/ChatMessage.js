import * as m from "motion/react-m";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";

import { urlify, hardUrlify } from "@services/tools/urlMetaService";
import { messageObserver as observer } from "@services/tools/visibilityObserver.js";
import draftService from "@services/tools/draftService.js";

import AdditionalMessages from "./AdditionalMessages.js";
import MediaAttachments from "@components/message/elements/MediaAttachments";
import MessageUserIcon from "@components/hub/elements/MessageUserIcon";
import MessageLinkPreview from "@components/hub/elements/MessageLinkPreview.js";

import { MessageStatus } from "@sama-communications.ui-kit";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { setAllParams } from "@store/values/ContextMenu.js";

import { addSuffix } from "@utils/NavigationUtils.js";
import { getUserFullName } from "@utils/UserUtils.js";
import { SWIPE_THRESHOLD, ALLOWED_FORMATS_TO_COPY } from "@utils/constants.js";

import { Check, Forward } from "lucide-react";

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
  isPrevMesssageYours: prev,
  isNextMessageYours: next,
}) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const messageRef = useRef(null);
  const { _id, old_id, body, from, attachments, status, t, url_preview } = message;
  const isCurrentUser = from === currentUserId;
  const isForwardMessage = !!message.forwarded_message_id;
  const isEdited = message.created_at !== message.updated_at;
  const isAttachments = attachments?.length;

  const timeSend = useMemo(() => {
    const time = new Date(t * 1000);
    return `${time.getHours()}:${time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()}`;
  }, [t]);

  const openUserProfile = (uid) => (sender ? addSuffix(pathname + hash, `/user?uid=${uid}`) : {});

  const linkColor = "text-accent-500";

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

    const list = [
      "messageReply",
      message.body && isCurrentUser && !message.forwarded_message_id ? "messageEdit" : null,
      copyOption,
      isAttachment ? "messageSaveAs" : null,
      "messageForward",
      "messageDelete",
      "messageSelect",
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

  const openSelectionContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setAllParams({
        category: "message",
        list: ["messageSelect"],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
        externalProps: { message },
      }),
    );
  };

  useEffect(() => {
    const el = messageRef.current;
    if (!el || !observer || !onViewFunc) return;
    const handleVisible = () => onViewFunc && onViewFunc();
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

  return (
    <div
      className={`flex flex-row flex-nowrap items-end gap-2.75 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      onClick={isSelectionMode ? (isSelected ? () => onUnselectClick(_id) : () => onSelectClick(_id)) : null}
      onContextMenu={openSelectionContextMenu}
    >
      {isSelectionMode && (
        <div className={`flex h-11.5 w-11.5 items-center justify-center ${isCurrentUser ? "mr-auto" : ""}`}>
          {isSelected ? (
            <span className="bg-accent-500/70 flex h-5.5 w-5.5 items-center justify-center rounded-full">
              <Check size={14} color="white" />
            </span>
          ) : (
            <span className="h-5.5 w-5.5 rounded-full border border-black/50"></span>
          )}
        </div>
      )}
      <m.div
        ref={messageRef}
        key={old_id || _id}
        data-message-id={_id}
        className={`relative flex flex-row gap-2.75 ${next ? "" : "mb-1.5"}`}
        drag={isMobile ? "x" : false}
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -SWIPE_THRESHOLD) {
            dispatch(addExternalProps({ [message.cid]: { draft_replied_mid: _id } }));
            draftService.saveDraft(message.cid, { replied_mid: _id });
          }
        }}
        whileDrag={{ scale: 0.9 }}
      >
        <div className="flex min-w-11.5 items-end">
          {next || isCurrentUser ? null : (
            <button onClick={() => openUserProfile(from)}>
              <MessageUserIcon userObject={sender} isCurrentUser={isCurrentUser} />
            </button>
          )}
        </div>
        <div
          className={`flex flex-col max-2xl:max-w-[min(85%,520px)] 2xl:max-w-[min(60%,520px)] ${isCurrentUser ? "ml-auto" : "mr-auto"}`}
        >
          {prev ? null : (
            <div
              className={`text-text-dark/60 mb-1.25 ${sender ? "cursor-pointer" : ""} ${isCurrentUser ? "" : ""}`}
              onClick={() => openUserProfile(from)}
            >
              &zwnj;{getUserFullName(sender) || "Deleted account"}
            </div>
          )}
          <div
            className={`shadow-btn flex flex-col rounded-xl ${next ? "" : isCurrentUser ? "rounded-br-none" : "rounded-bl-none"}`}
          >
            {isForwardMessage ? (
              <div
                className={`-mb-3 flex flex-row flex-nowrap items-center gap-1.75 rounded-t-xl px-1 pt-0.5 pb-3 ${isCurrentUser ? "bg-accent-500/65" : "bg-bg-dark/5"}`}
              >
                <Forward size={18} color={isCurrentUser ? "white" : "var(--color-text-dark)"} />
                <p className={`text-sm font-medium ${isCurrentUser ? "text-white" : "text-black/35"}`}>Forwarded</p>
              </div>
            ) : null}
            {repliedMessage ? (
              <AdditionalMessages
                type={"reply"}
                color={isCurrentUser ? "white" : "accent"}
                message={repliedMessage}
                onClickFunc={onReplyClickFunc}
              />
            ) : null}
            <m.div
              className={`relative flex min-h-11.5 w-full max-w-full flex-col justify-between gap-1 rounded-xl p-1 ${isCurrentUser ? "bg-accent-100" : "bg-white"} ${
                next ? "" : isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
              } ${isForwardMessage ? "min-w-28" : "min-w-14"} ${isSelected ? "bg-accent-200!" : ""}`}
              whileTap={isMobile ? { scale: 0.95, transition: { duration: 0.3, delay: 0.05 } } : null}
              onClick={isMobile ? handleClick : null}
              onPointerDown={isMobile ? handlePointerDown : null}
              onPointerUp={isMobile ? handlePointerUp : null}
              onPointerLeave={isMobile ? handlePointerUp : null}
              onContextMenu={
                isSelectionMode ? openSelectionContextMenu : (e) => openContextMenu(e, message.body ? "Text" : null)
              }
            >
              <div className="flex flex-col flex-wrap">
                {isAttachments ? (
                  <MediaAttachments
                    onContextMenu={
                      isSelectionMode
                        ? openSelectionContextMenu
                        : (e, att) => openContextMenu(e, "Attachment", { attachment: att })
                    }
                    attachments={attachments}
                    mid={message._id}
                  />
                ) : null}
                {body ? (
                  <>
                    <p className="max-w-full p-2 font-light wrap-break-word whitespace-pre-wrap">
                      {urlify(_id, body, linkColor, !url_preview)}
                    </p>
                    {!isAttachments && (
                      <MessageLinkPreview
                        urlData={url_preview}
                        color={isCurrentUser ? "accent" : "white"}
                        refreshFunc={refreshLinkPreview}
                      />
                    )}
                  </>
                ) : null}
              </div>
            </m.div>
          </div>
          {isEdited || isLongTimeBetweenMessages || !next ? (
            <div
              className={`relative mt-1.25 mb-0.5 flex w-full flex-row items-center gap-0.75 self-end ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              {isEdited ? <span className="text-text-dark text-xs leading-4.5">edited</span> : null}
              {isLongTimeBetweenMessages || !next ? (
                <>
                  <div className="text-text-dark/60 text-xs">{timeSend}</div>
                  {isCurrentUser ? <MessageStatus status={status} /> : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className={`flex min-w-11.5 items-end`}>
          {next || !isCurrentUser ? null : (
            <button onClick={() => openUserProfile(from)}>
              <MessageUserIcon userObject={sender} isCurrentUser={isCurrentUser} />
            </button>
          )}
        </div>
      </m.div>
    </div>
  );
}
