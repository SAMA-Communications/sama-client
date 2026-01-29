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

  const linkColor = isCurrentUser ? "white" : "black";

  const refreshLinkPreview = (event, url) => {
    event.preventDefault();
    hardUrlify(_id, url);
  };

  const width = useMemo(() => {
    if (isAttachments || url_preview) return "w-[min(85%,540px)]";
    return "w-max max-2xl:max-w-[min(85%,680px)] 2xl:max-w-[min(60%,680px)]";
  }, [attachments, url_preview]);

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
      className={`flex w-full flex-row flex-nowrap items-end gap-2.75 ${isCurrentUser ? "justify-end" : "justify-start"}`}
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
        className={`relative ${width} flex flex-row gap-2.75 ${next ? "" : "mb-1.5"}`}
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
        <div className={`flex min-w-11.5 items-end`}>
          {next || isCurrentUser ? null : (
            <div
              className={`bg-hover-light flex h-11.5 w-11.5 cursor-pointer items-center justify-center rounded-xl text-black uppercase ${
                isCurrentUser ? "bg-accent-500! text-white!" : ""
              } ${isSelected ? "bg-accent-500/45!" : ""} overflow-hidden`}
              onClick={() => openUserProfile(from)}
            >
              <MessageUserIcon userObject={sender} isCurrentUser={isCurrentUser} />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {isForwardMessage && (
            <div className="bg-accent-500/65 -mb-3 flex flex-row flex-nowrap items-center gap-1.75 rounded-t-xl px-1 pt-0.5 pb-3">
              <Forward size={18} color={isCurrentUser ? "white" : "var(--color-accent-500)"} />
              <p className={`text-sm font-medium italic ${isCurrentUser ? "text-white" : "text-accent-500"}`}>
                Forwarded
              </p>
            </div>
          )}
          {repliedMessage && (
            <AdditionalMessages
              type={"reply"}
              color={isCurrentUser ? "white" : "accent"}
              message={repliedMessage}
              onClickFunc={onReplyClickFunc}
            />
          )}
          <m.div
            className={`relative flex min-h-11.5 w-full max-w-full min-w-28 flex-col justify-between gap-1 rounded-xl p-3 ${
              next ? "" : isCurrentUser ? "rounded-br-none" : "rounded-bl-none"
            } ${isCurrentUser ? "bg-accent-500" : "bg-hover-light"} ${isSelected ? "bg-accent-200!" : ""}`}
            whileTap={isMobile ? { scale: 0.95, transition: { duration: 0.3, delay: 0.05 } } : null}
            onClick={isMobile ? handleClick : null}
            onPointerDown={isMobile ? handlePointerDown : null}
            onPointerUp={isMobile ? handlePointerUp : null}
            onPointerLeave={isMobile ? handlePointerUp : null}
            onContextMenu={
              isSelectionMode ? openSelectionContextMenu : (e) => openContextMenu(e, message.body ? "Text" : null)
            }
          >
            {prev || isForwardMessage ? null : (
              <div
                className={`text-accent-500 font-medium ${
                  sender ? "cursor-pointer" : ""
                } ${isCurrentUser ? "text-white!" : ""}`}
                onClick={() => openUserProfile(from)}
              >
                &zwnj;{getUserFullName(sender) || "Deleted account"}
              </div>
            )}
            <div
              className={`flex flex-wrap items-end gap-x-1.75 gap-y-0.75 ${
                isAttachments ? "w-auto flex-col! items-start" : ""
              } ${url_preview ? "flex-col" : "flex-row"}`}
            >
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
                <div
                  className={`max-w-full font-light wrap-break-word whitespace-pre-wrap ${isCurrentUser ? "text-white" : ""}`}
                  style={{ wordBreak: "break-word", inlineSize: "auto" }}
                >
                  <p>{urlify(_id, body, linkColor, !url_preview)}</p>
                  {!isAttachments && (
                    <MessageLinkPreview urlData={url_preview} color={linkColor} refreshFunc={refreshLinkPreview} />
                  )}
                </div>
              ) : null}
              <div
                className={`relative flex grow items-end justify-end gap-0.75 self-end ${
                  isAttachments && !body ? "absolute! right-4 bottom-4 self-end rounded-lg bg-black/50 p-2" : ""
                } `}
              >
                {isEdited ? (
                  <span
                    className={`text-text-dark text-xs leading-4.5 ${
                      (isAttachments && !body) || isCurrentUser ? "text-white" : ""
                    }`}
                  >
                    edited
                  </span>
                ) : null}
                <div
                  className={`text-text-dark text-xs ${(isAttachments && !body) || isCurrentUser ? "text-white" : ""}`}
                >
                  {timeSend}
                </div>
                {isCurrentUser ? (
                  <div className={`-mb-0.5`}>
                    <MessageStatus status={status} color="white" />
                  </div>
                ) : null}
              </div>
            </div>
          </m.div>
        </div>
        <div className={`flex min-w-11.5 items-end`}>
          {next || !isCurrentUser ? null : (
            <div
              className={`bg-hover-light flex h-11.5 w-11.5 cursor-pointer items-center justify-center rounded-xl text-black uppercase ${
                isCurrentUser ? "bg-accent-500! text-white!" : ""
              } ${isSelected ? "bg-accent-500/45!" : ""} overflow-hidden`}
              onClick={() => openUserProfile(from)}
            >
              <MessageUserIcon userObject={sender} isCurrentUser={isCurrentUser} />
            </div>
          )}
        </div>
      </m.div>
    </div>
  );
}
