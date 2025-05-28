import * as m from "motion/react-m";
import { useLocation } from "react-router";
import { useMemo } from "react";

import MediaAttachments from "@components/message/elements/MediaAttachments";
import MessageStatus from "@components/message/elements/MessageStatus";
import MessageUserIcon from "@components/hub/elements/MessageUserIcon";

import addSuffix from "@utils/navigation/add_suffix";
import getUserFullName from "@utils/user/get_user_full_name";
import { urlify } from "@utils/text/urlify";

import CornerLight from "@icons/_helpers/CornerLight.svg?react";
import CornerAccent from "@icons/_helpers/CornerAccent.svg?react";

export default function ChatMessage({
  sender,
  message,
  currentUserId,
  isPrevMesssageYours: prev,
  isNextMessageYours: next,
}) {
  const { pathname, hash } = useLocation();

  const { _id, old_id, body, from, attachments, status, t } = message;
  const isCurrentUser = from === currentUserId;

  const timeSend = useMemo(() => {
    const time = new Date(t * 1000);
    return `${time.getHours()}:${
      time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes()
    }`;
  }, [t]);

  const openUserProfile = () =>
    sender ? addSuffix(pathname + hash, `/user?uid=${from}`) : {};

  return (
    <m.div
      key={old_id || _id}
      className={`relative w-max max-w-[min(80%,820px)] flex flex-row gap-[16px] ${
        prev ? "" : "mt-[8px]"
      }`}
      whileInView={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: -7 }}
      transition={{ duration: 0.3, delay: 0.03 }}
      // layout
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
        <div
          className={`flex flex-row flex-wrap items-end gap-y-[8px] gap-x-[15px] ${
            attachments?.length ? "w-auto !flex-col items-start" : ""
          } ${isCurrentUser ? "!bg-(--color-accent-dark)" : ""}`}
        >
          {attachments?.length ? (
            <MediaAttachments attachments={attachments} mid={message._id} />
          ) : null}
          {body ? (
            <div
              className={`${
                attachments?.length ? "max-w-[440px]" : "max-w-full"
              } whitespace-pre-wrap text-black wrap-break-word ${
                isCurrentUser ? "!text-white" : ""
              }`}
              style={{ wordBreak: "break-word", inlineSize: "auto" }}
            >
              <p>{urlify(body, isCurrentUser ? "white" : "black")}</p>
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
