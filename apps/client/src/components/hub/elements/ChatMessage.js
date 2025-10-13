import * as m from "motion/react-m";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";

import { urlify, hardUrlify } from "@services/tools/urlMetaService";
import { messageObserver as observer } from "@services/tools/visibilityObserver.js";
import draftService from "@services/tools/draftService.js";

import AdditionalMessages from "./AdditionalMessages.js";
import MediaAttachments from "@components/message/elements/MediaAttachments";
import MessageStatus from "@components/message/elements/MessageStatus";
import MessageUserIcon from "@components/hub/elements/MessageUserIcon";
import MessageLinkPreview from "@components/hub/elements/MessageLinkPreview.js";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { setAllParams } from "@store/values/ContextMenu.js";

import { addSuffix } from "@utils/NavigationUtils.js";
import { getUserFullName } from "@utils/UserUtils.js";
import { SWIPE_THRESHOLD, ALLOWED_FORMATS_TO_COPY } from "@utils/constants.js";

import Selected from "@icons/status/Selected.svg?react";
import CornerLight from "@icons/_helpers/CornerLight.svg?react";
import CornerAccent from "@icons/_helpers/CornerAccent.svg?react";
import CornerSelected from "@icons/_helpers/CornerSelected.svg?react";
import ForwardWhite from "@icons/context/ForwardWhiteBold.svg?react";
import ForwardAccent from "@icons/context/ForwardAccentBold.svg?react";

export default function ChatMessage({
  sender,
  message,
  repliedMessage,
  currentUserId,
  onViewFunc,
  onSelectClick = () => {},
  onUnselectClick = () => {},
  onReplyClickFunc,
  isSelected,
  isSelectionMode = false,
  isPrevMesssageYours: prev,
  isNextMessageYours: next,
}) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const messageRef = useRef(null);
  const { _id, old_id, body, from, attachments, status, t, url_preview } =
    message;
  const isCurrentUser = from === currentUserId;
  const isForwardMessage = !!message.forwarded_message_id;
  const isEdited = message.created_at !== message.updated_at;

  const timeSend = useMemo(() => {
    const time = new Date(t * 1000);
    return `${time.getHours()}:${
      time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()
    }`;
  }, [t]);

  const openUserProfile = (uid) =>
    sender ? addSuffix(pathname + hash, `/user?uid=${uid}`) : {};

  const linkColor = isCurrentUser ? "white" : "black";

  const refreshLinkPreview = (event, url) => {
    event.preventDefault();
    hardUrlify(_id, url);
  };

  const width = useMemo(() => {
    if (attachments?.length || url_preview) return "w-[min(85%,540px)]";
    return "w-max max-2xl:max-w-[min(85%,680px)] 2xl:max-w-[min(60%,680px)]";
  }, [attachments, url_preview]);

  const openContextMenu = (e, copyType, externalProps) => {
    e.preventDefault();
    e.stopPropagation();
    const isAttachment = copyType === "Attachment";
    const isCopyableAttachment =
      isAttachment &&
      ALLOWED_FORMATS_TO_COPY.includes(
        externalProps?.attachment?.file_content_type
      );
    const copyOption =
      (isCopyableAttachment && "messageCopyAttachment") ||
      (message.body && "messageCopyText") ||
      null;

    const list = [
      "messageReply",
      message.body && isCurrentUser ? "messageEdit" : null,
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
      })
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
      })
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
      className="w-full flex flex-row justify-between items-end gap-[7px] flex-nowrap"
      onClick={
        isSelectionMode
          ? isSelected
            ? () => onUnselectClick(_id)
            : () => onSelectClick(_id)
          : null
      }
      onContextMenu={openSelectionContextMenu}
    >
      <m.div
        ref={messageRef}
        key={old_id || _id}
        data-message-id={_id}
        className={`relative ${width} flex flex-row gap-[16px] ${
          prev ? "" : "mt-[8px]"
        }`}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -SWIPE_THRESHOLD) {
            dispatch(
              addExternalProps({ [message.cid]: { draft_replied_mid: _id } })
            );
            draftService.saveDraft(message.cid, { replied_mid: _id });
          }
        }}
        whileDrag={{ scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -7 }}
        transition={{ duration: 0.3, delay: 0.03 }}
      >
        <div
          className={`min-w-[46px] flex items-end ${
            sender ? "cursor-pointer" : ""
          }`}
        >
          {next ? null : (
            <div
              className={`w-[46px] h-[46px] uppercase text-black rounded-[16px] bg-(--color-hover-light) flex items-center justify-center ${
                isCurrentUser ? "!text-white !bg-(--color-accent-dark)" : ""
              } ${
                isSelected ? "!bg-(--color-accent-dark)/45" : ""
              } overflow-hidden`}
              onClick={() => openUserProfile(from)}
            >
              <MessageUserIcon
                userObject={sender}
                isCurrentUser={isCurrentUser}
              />
            </div>
          )}
        </div>
        <m.div
          className={`relative max-w-full w-fit min-h-[46px] p-[15px] flex flex-col gap-[5px] rounded-[16px] bg-(--color-hover-light) ${
            next ? "" : "rounded-bl-none"
          } ${isCurrentUser ? "!bg-(--color-accent-dark)" : ""} ${
            isSelected ? "!bg-(--color-accent-dark)/50" : ""
          }`}
          whileTap={{ scale: 0.95, transition: { duration: 0.3, delay: 0.05 } }}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onContextMenu={
            isSelectionMode
              ? openSelectionContextMenu
              : (e) => openContextMenu(e, message.body ? "Text" : null)
          }
        >
          {next ? null : isSelected ? (
            <CornerSelected className="absolute -left-[16px] bottom-[0px]" />
          ) : isCurrentUser ? (
            <CornerAccent className="absolute -left-[16px] bottom-[0px]" />
          ) : (
            <CornerLight className="absolute -left-[16px] bottom-[0px]" />
          )}
          {prev || isForwardMessage ? null : (
            <div
              className={`text-(--color-accent-dark) !font-medium ${
                sender ? "cursor-pointer" : ""
              } ${isCurrentUser ? "!text-white" : ""}`}
              onClick={() => openUserProfile(from)}
            >
              &zwnj;{getUserFullName(sender) || "Deleted account"}
            </div>
          )}
          {repliedMessage && (
            <AdditionalMessages
              type={"reply"}
              message={repliedMessage}
              onClickFunc={onReplyClickFunc}
              color={isCurrentUser ? "accent" : "light"}
            />
          )}
          {isForwardMessage && (
            <div className="flex flex-row gap-[7px] items-center flex-nowrap">
              {isCurrentUser ? (
                <ForwardWhite className="w-[18px] h-[12px]" />
              ) : (
                <ForwardAccent className="w-[18px] h-[12px]" />
              )}
              <p
                className={`!font-medium ${
                  isCurrentUser ? "text-white" : "text-accent-dark"
                }`}
              >
                Forwarded
              </p>
            </div>
          )}
          <div
            className={`flex flex-wrap items-end gap-y-[8px] gap-x-[15px] ${
              attachments?.length ? "w-auto !flex-col items-start" : ""
            }  ${url_preview ? "flex-col" : "flex-row"}`}
          >
            {attachments?.length ? (
              <MediaAttachments
                onContextMenu={
                  isSelectionMode
                    ? openSelectionContextMenu
                    : (e, att) =>
                        openContextMenu(e, "Attachment", { attachment: att })
                }
                attachments={attachments}
                mid={message._id}
              />
            ) : null}
            {body ? (
              <div
                className={`max-w-full whitespace-pre-wrap text-black wrap-break-word ${
                  isCurrentUser ? "!text-white" : ""
                }`}
                style={{ wordBreak: "break-word", inlineSize: "auto" }}
              >
                <p>{urlify(_id, body, linkColor, !url_preview)}</p>
                {!attachments?.length && (
                  <MessageLinkPreview
                    urlData={url_preview}
                    color={linkColor}
                    refreshFunc={refreshLinkPreview}
                  />
                )}
              </div>
            ) : null}
            <div
              className={`relative grow justify-end self-end ${
                attachments?.length && !body
                  ? "!absolute bottom-[16px] right-[16px] p-[8px] rounded-lg bg-(--color-black-50) self-end"
                  : ""
              } flex items-end justify-center gap-[3px] ${
                isCurrentUser ? "pr-[28px]" : ""
              }`}
            >
              {isEdited ? (
                <span
                  className={`text-(--color-text-dark) leading-[18px] text-span ${
                    (attachments?.length && !body) || isCurrentUser
                      ? "text-white"
                      : ""
                  }`}
                >
                  edited
                </span>
              ) : null}
              <div
                className={`text-(--color-text-dark) text-span ${
                  (attachments?.length && !body) || isCurrentUser
                    ? "text-white"
                    : ""
                }`}
              >
                {timeSend}
              </div>
              {isCurrentUser ? (
                <div
                  className={`absolute right-[3px] flex ${
                    attachments?.length && !body
                      ? "bottom-[5px]"
                      : "-bottom-[3px]"
                  }`}
                >
                  <MessageStatus
                    status={status}
                    type={isCurrentUser ? "white" : "accent"}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </m.div>
      </m.div>
      {isSelectionMode && (
        <div className="flex 2xl:mr-[calc(100%-min(85%,680px))] max-2xl:mr-[15px]">
          {isSelected ? (
            <span className="w-[22px] h-[22px] bg-accent-dark/70 rounded-full flex items-center justify-center">
              <Selected className="w-[14px] h-[14px]" />
            </span>
          ) : (
            <span className="w-[22px] h-[22px] border-black/50 border-[1px] border-solid rounded-full"></span>
          )}
        </div>
      )}
    </div>
  );
}
