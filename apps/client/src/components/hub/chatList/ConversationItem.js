import * as m from "motion/react-m";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import LastMessage from "@components/message/LastMessage";
import TypingLine from "@components/_helpers/TypingLine";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import draftService from "@services/draftService.js";

import { updateWithDrafts } from "@store/values/Conversations.js";

import getLastUpdateTime from "@utils/conversation/get_last_update_time";

import Group from "@icons/users/Group.svg?react";
import UnknownPhoto from "@icons/users/UnknownPhoto.svg?react";

export default function ConversationItem({
  isSelected,
  onClickFunc,
  chatName,
  chatObject,
  currentUserId,
  chatAvatarUrl,
  chatAvatarBlutHash,
  lastMessageUserName,
}) {
  const {
    _id: cid,
    type,
    typing_users,
    draft,
    last_message,
    unread_messages_count,
    updated_at,
  } = chatObject;

  const dispatch = useDispatch();

  const draftMessage = useMemo(() => {
    if (isSelected && !draft) return null;
    return draftService.getDraftMessage(cid);
  }, [isSelected, draft]);

  useEffect(() => {
    const draftParams = draftService.getDraft(cid);
    const { message, updated_at: draftUpdatedAt } = draftParams;
    if (!message) return;
    if (!draft) {
      dispatch(updateWithDrafts({ cid, draft: draftParams }));
      return;
    }

    const convUpdatedAt = Math.floor(Date.parse(updated_at) / 1000);
    !(draftUpdatedAt === convUpdatedAt || draftUpdatedAt === last_message?.t) &&
      dispatch(updateWithDrafts({ cid, draft: draftParams }));
  }, [isSelected]);

  const tView = useMemo(() => {
    return getLastUpdateTime(updated_at, last_message);
  }, [updated_at, last_message]);

  return (
    <m.div
      className={`relative w-full p-[10px] flex gap-[15px] items-center rounded-[12px] cursor-pointer ${
        isSelected ? "bg-(--color-hover-light)" : ""
      } hover:bg-(--color-hover-light) transition-[background-color] duration-200 focus:outline-none`}
      onClick={onClickFunc}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="w-[70px] h-[70px] !font-light text-h4 rounded-[8px] bg-(--color-bg-dark) flex items-center justify-center text-(--color-text-dark) overflow-hidden">
        <DynamicAvatar
          avatarUrl={chatAvatarUrl}
          avatarBlurHash={chatAvatarBlutHash}
          defaultIcon={
            type === "g" ? (
              <Group />
            ) : chatName ? (
              chatName.slice(0, 2).toUpperCase()
            ) : (
              <UnknownPhoto />
            )
          }
          altText={type === "g" ? "Chat Group" : "User's Profile"}
        />
      </div>
      <div className="max-w-[calc(100%-90px)] max-h-[70px] flex-1 flex gap-[7px] flex-col overflow-hidden">
        <div className="flex gap-[12px] items-center justify-between">
          <p className="!font-medium text-black text-h6 overflow-hidden text-ellipsis whitespace-nowrap no-underline">
            &zwnj;{chatName || "Deleted account"}
          </p>
          <div className="!font-light text-(--color-text-light)">{tView}</div>
        </div>
        <div className="flex gap-[12px] items-center justify-between h-[32px]">
          {typing_users?.length && !isSelected ? (
            <TypingLine
              userIds={typing_users}
              displayUserNames={type === "g"}
            />
          ) : (
            <LastMessage
              message={last_message}
              draft={draftMessage}
              viewName={lastMessageUserName}
              count={unread_messages_count}
              userId={currentUserId}
            />
          )}
        </div>
      </div>
    </m.div>
  );
}
