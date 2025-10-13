import * as m from "motion/react-m";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";

import LastMessage from "@components/message/LastMessage";
import TypingLine from "@components/_helpers/TypingLine";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";

import draftService from "@services/tools/draftService.js";

import { updateWithDrafts } from "@store/values/Conversations.js";

import { getLastUpdateTime } from "@utils/ConversationUtils.js";

import Group from "@icons/users/Group.svg?react";
import GroupMini from "@icons/users/GroupMini.svg?react";
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

  const isGroup = type === "g";

  const draftParams = isSelected ? null : draft;

  useEffect(() => {
    const draftParams = draftService.getDraft(cid);
    const { text, replied_mid, updated_at: draftUpdatedAt } = draftParams;
    if (!text && !replied_mid) return;
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
            isGroup ? (
              <Group />
            ) : chatName ? (
              chatName.slice(0, 2).toUpperCase()
            ) : (
              <UnknownPhoto />
            )
          }
          altText={isGroup ? "Chat Group" : "User's Profile"}
        />
      </div>
      <div className="max-w-[calc(100%-90px)] max-h-[70px] flex-1 flex gap-[7px] flex-col overflow-hidden">
        <div className="flex gap-[12px] items-center justify-between">
          <p className="!font-medium flex flex-nowrap items-center gap-[7px] text-black text-h6 overflow-hidden text-ellipsis whitespace-nowrap no-underline">
            &zwnj;{isGroup && <GroupMini className="-ml-[7px]" />}
            {chatName || "Deleted account"}
          </p>
          <div className="!font-light text-(--color-text-light)">{tView}</div>
        </div>
        <div className="flex gap-[12px] items-center justify-between h-[32px]">
          {typing_users?.length && !isSelected ? (
            <TypingLine userIds={typing_users} displayUserNames={isGroup} />
          ) : (
            <LastMessage
              message={last_message}
              draft={draftParams}
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
