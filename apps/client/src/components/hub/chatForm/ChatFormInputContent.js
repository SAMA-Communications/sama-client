import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";

import draftService from "@services/draftService.js";

import MediaAttachment from "../../message/elements/MediaAttachment.js";

import { selectParticipantsEntities } from "@store/values/Participants.js";

import getUserFullName from "@utils/user/get_user_full_name.js";

import Reply from "@icons/context/ReplyGray.svg?react";
import Close from "@icons/options/Close.svg?react";

export default function ChatFormInputContent({ cid, message }) {
  const participants = useSelector(selectParticipantsEntities);

  const { attachments } = message || {};

  return (
    <AnimatePresence mode="exit">
      {message ? (
        <m.div
          initial={{ opacity: 0, scale: 0.98, y: 40, height: 0, marginTop: -5 }}
          animate={{
            opacity: 1,
            scale: [0.98, 1.005, 1],
            y: 0,
            height: 90,
            marginTop: 0,
          }}
          exit={{ opacity: 0, scale: 0.98, y: 30, height: 0, marginTop: -5 }}
          className="h-[90px] w-[calc(100%-20px)] -mb-[20px] pb-[20px] pt-[5px] px-[18px] shrink flex items-center self-center gap-[15px] rounded-[16px] bg-(--color-hover-light)/65 overflow-hidden z-10"
        >
          <span>
            <Reply className="w-[25px] h-[25px]" />
          </span>
          {attachments?.length && (
            <div className="w-[45px] h-[45px] overflow-hidden rounded-lg object-cover flex">
              <MediaAttachment attachment={attachments[0]} flexGrow={1} />
            </div>
          )}
          <div className="w-[calc(100%-160px)] flex flex-col grow">
            <p className="text-accent-dark !font-normal overflow-hidden text-ellipsis whitespace-nowrap">
              Reply to {getUserFullName(participants[message.from])}
            </p>
            <p className="overflow-hidden text-ellipsis whitespace-nowrap">
              {message.body}
            </p>
          </div>
          <span>
            <Close
              className="w-[20px] h-[20px] cursor-pointer"
              onClick={() => {
                draftService.removeDraftWithOptions(cid, "replied_mid");
              }}
            />
          </span>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
