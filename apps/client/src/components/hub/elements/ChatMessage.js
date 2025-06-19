import * as m from "motion/react-m";
import { useMemo } from "react";
import { useLocation } from "react-router";
import { useDispatch } from "react-redux";

import { urlify, hardUrlify } from "@services/urlMetaService";

import MediaAttachments from "@components/message/elements/MediaAttachments";
import MessageStatus from "@components/message/elements/MessageStatus";
import MessageUserIcon from "@components/hub/elements/MessageUserIcon";
import MessageLinkPreview from "@components/hub/elements/MessageLinkPreview.js";
import RepliedMessage from "./RepliedMessage.js";

import { setAllParams } from "@store/values/ContextMenu.js";

import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";

import CornerLight from "@icons/_helpers/CornerLight.svg?react";
import CornerAccent from "@icons/_helpers/CornerAccent.svg?react";

export default function ChatMessage({
  sender,
  message,
  repliedMessage,
  currentUserId,
  isPrevMesssageYours: prev,
  isNextMessageYours: next,
}) {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const { _id, old_id, body, from, attachments, status, t, url_preview } =
    message;
  const isCurrentUser = from === currentUserId;

  const timeSend = useMemo(() => {
    const time = new Date(t * 1000);
    return `${time.getHours()}:${
      time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()
    }`;
  }, [t]);

  const openUserProfile = () =>
    sender ? addSuffix(pathname + hash, `/user?uid=${from}`) : {};

  const linkColor = isCurrentUser ? "white" : "black";

  const refreshLinkPreview = (event, url) => {
    event.preventDefault();
    hardUrlify(_id, url);
  };

  const width = useMemo(() => {
    if (attachments?.length || url_preview) return "w-[min(80%,540px)]";
    return "w-max max-2xl:max-w-[min(80%,680px)] 2xl:max-w-[min(60%,680px)]";
  }, [attachments, url_preview]);

  const openContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setAllParams({
        category: "message",
        list: ["messageReply"],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
        externalProps: { mid: _id },
      })
    );
  };

  return (
    <m.div
      key={old_id || _id}
      className={`relative ${width} flex flex-row gap-[16px] ${
        prev ? "" : "mt-[8px]"
      }`}
      onContextMenu={openContextMenu}
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
            } overflow-hidden`}
            onClick={openUserProfile}
          >
            <MessageUserIcon
              userObject={sender}
              isCurrentUser={isCurrentUser}
            />
          </div>
        )}
      </div>
      <div
        className={`relative max-w-full w-fit min-h-[46px] p-[15px] flex flex-col gap-[5px] rounded-[16px] bg-(--color-hover-light) ${
          next ? "" : "rounded-bl-none"
        } ${isCurrentUser ? "!bg-(--color-accent-dark)" : ""}`}
      >
        {next ? null : isCurrentUser ? (
          <CornerAccent className="absolute -left-[16px] bottom-[0px]" />
        ) : (
          <CornerLight className="absolute -left-[16px] bottom-[0px]" />
        )}
        {prev ? null : (
          <div
            className={`text-(--color-accent-dark) !font-medium ${
              sender ? "cursor-pointer" : ""
            } ${isCurrentUser ? "!text-white" : ""}`}
            onClick={openUserProfile}
          >
            &zwnj;{getUserFullName(sender) || "Deleted account"}
          </div>
        )}
        {repliedMessage && (
          <RepliedMessage
            message={repliedMessage}
            color={isCurrentUser ? "accent" : "light"}
          />
        )}
        <div
          className={`flex flex-wrap items-end gap-y-[8px] gap-x-[15px] ${
            attachments?.length ? "w-auto !flex-col items-start" : ""
          } ${isCurrentUser ? "!bg-(--color-accent-dark)" : ""} ${
            url_preview ? "flex-col" : "flex-row"
          }`}
        >
          {attachments?.length ? (
            <MediaAttachments attachments={attachments} mid={message._id} />
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
            } flex items-center justify-center ${
              isCurrentUser ? "pr-[28px]" : ""
            }`}
          >
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
      </div>
    </m.div>
  );
}
