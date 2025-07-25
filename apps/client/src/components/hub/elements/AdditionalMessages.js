import * as m from "motion/react-m";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import MediaAttachment from "@components/message/elements/MediaAttachment.js";

import { selectParticipantsEntities } from "@store/values/Participants.js";

import getUserFullName from "@utils/user/get_user_full_name.js";

import Forward from "@icons/context/ForwardGray.svg?react";
import Reply from "@icons/context/ReplyGray.svg?react";
import Close from "@icons/options/Close.svg?react";

export default function AdditionalMessages({
  message,
  messages,
  color,
  type,
  isPreview = false,
  onCloseFunc,
  onClickFunc,
}) {
  const participants = useSelector(selectParticipantsEntities);

  const {
    attachments,
    body,
    from: senderId,
    error,
  } = message || messages[0] || {};
  const isReply = type === "reply";

  const { bodyColor, bgColor, userNameColor } = useMemo(() => {
    switch (color) {
      case "accent":
        return {
          bodyColor: "text-white",
          bgColor: "bg-accent-light/30",
          userNameColor: "text-white",
        };
      case "light":
        return {
          bodyColor: "text-black",
          bgColor: "bg-hover-dark/5",
          userNameColor: "text-accent-dark",
        };
      default:
        return {
          bodyColor: "text-black",
          bgColor: "bg-hover-light/65",
          userNameColor: "text-accent-dark",
        };
    }
  }, [color]);

  if (error) {
    return (
      <div
        className={`w-[calc(100%)] px-[10px] py-[7px] border-l-[3px] rounded-lg shrink ${bgColor}   ${
          color === "accent" ? "border-l-accent-light" : "border-l-accent-dark"
        }`}
      >
        <p className={`${bodyColor}`}>{error}</p>
      </div>
    );
  }

  const animateInOut = isPreview && {
    opacity: 0,
    scale: 0.98,
    y: 30,
    height: 0,
    marginTop: -5,
  };

  const animateVisible = isPreview && {
    opacity: 1,
    scale: [0.98, 1.005, 1],
    y: 0,
    height: 90,
    marginTop: 0,
  };

  return (
    <m.div
      initial={animateInOut}
      animate={animateVisible}
      exit={animateInOut}
      className={`${
        isPreview
          ? `!h-[73px] w-[calc(100%-20px)] -mb-[20px] pb-[20px] pt-[5px] px-[18px] rounded-[16px] gap-[15px] ${bgColor} z-1`
          : `w-[calc(100%)] px-[10px] py-[7px] cursor-pointer border-l-[3px] rounded-lg gap-[10px] ${bgColor} ${
              color === "accent"
                ? "border-l-accent-light"
                : "border-l-accent-dark"
            }`
      } shrink flex items-center self-center`}
      onClick={onClickFunc}
    >
      {isPreview && (
        <span>
          {isReply ? (
            <Reply className="w-[25px] h-[25px]" />
          ) : (
            <Forward className="w-[25px] h-[25px]" />
          )}
        </span>
      )}
      {attachments?.length && (
        <div className="w-[45px] h-[45px] overflow-hidden rounded-lg object-cover flex">
          <MediaAttachment attachment={attachments[0]} flexGrow={1} />
        </div>
      )}
      <div className="w-[calc(100%-160px)] flex flex-col grow">
        <p
          className={`${userNameColor} !font-normal overflow-hidden text-ellipsis whitespace-nowrap`}
        >
          {isPreview && isReply ? "Reply to " : ""}
          {getUserFullName(participants[senderId])}
        </p>
        <p
          className={`${bodyColor} overflow-hidden text-ellipsis whitespace-nowrap`}
        >
          {isReply || messages?.length < 2
            ? body
            : messages?.length + " forwarded messages"}
        </p>
      </div>
      {onCloseFunc && (
        <span>
          <Close
            className="w-[20px] h-[20px] cursor-pointer"
            onClick={onCloseFunc}
          />
        </span>
      )}
    </m.div>
  );
}
