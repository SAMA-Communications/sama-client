import { useEffect, useMemo } from "react";

import { getAdapters } from "../../../adapters";

import { TypingLine } from "../TypingLine";
import { DynamicAvatar } from "../../DynamicAvatar";
import { LastMessage } from "../LastMessage/LastMessage";

import { Users, CircleQuestionMark } from "lucide-react";

import { ConversationItemProps } from "./ConversationItem.types";

export const ConversationItem = ({
  conversation,
  isSelected,
  ...rest
}: ConversationItemProps) => {
  const { useDrafts, useParticipants, conversationUtils, userUtils } =
    getAdapters();
  const { syncDraftByCid } = useDrafts();
  const { getUserById, getCurrentUser } = useParticipants();

  const {
    _id: cid,
    type,
    name,
    typing_users,
    draft,
    image_url,
    image_object,
    owner_id,
    opponent_id,
    last_message,
    unread_messages_count,
    updated_at,
  } = conversation;

  const isGroup = type === "g";

  const currentUserId = getCurrentUser()._id;

  const participant = useMemo(() => {
    if (isGroup) return null;

    const participantId = owner_id === currentUserId ? opponent_id : owner_id;
    return participantId ? getUserById(participantId) : null;
  }, [isGroup, owner_id, opponent_id, currentUserId, getUserById]);

  const displayName = useMemo(() => {
    if (name) return name;

    if (!isGroup && participant) {
      const fullName = userUtils.getUserFullName(participant);
      if (fullName) return fullName;
    }
    return "Deleted account";
  }, [name, isGroup, participant, userUtils]);

  useEffect(() => syncDraftByCid(cid, draft, updated_at), [isSelected]);

  const tView = useMemo(
    () => conversationUtils.getLastUpdateTime(updated_at, last_message?.t),
    [conversationUtils, updated_at, last_message?.t]
  );

  return (
    <div
      className={`relative w-full p-[10px] flex gap-[15px] items-center rounded-[12px] cursor-pointer ${
        isSelected ? "bg-(--color-hover-light)" : ""
      } hover:bg-(--color-hover-light) transition-[background-color] duration-200 focus:outline-none`}
      {...rest}
      // initial={{ opacity: 0, x: -30 }}
      // whileInView={{ opacity: 1, x: 0 }}
      // whileHover={{ x: -3 }}
      // whileTap={{ scale: 0.95 }}
      // transition={{ duration: 0.3 }}
      // layout
    >
      <div className="w-[70px] h-[70px] !font-light text-h4 rounded-[8px] bg-(--color-bg-dark) flex items-center justify-center text-(--color-text-dark) overflow-hidden">
        <DynamicAvatar
          avatarUrl={image_url || participant?.avatar_url}
          avatarBlurHash={
            image_object?.file_blur_hash ||
            participant?.avatar_object?.file_blur_hash
          }
          defaultIcon={
            isGroup ? (
              <Users size={32} strokeWidth={1} />
            ) : displayName ? (
              displayName.slice(0, 2).toUpperCase()
            ) : (
              <CircleQuestionMark size={32} strokeWidth={1} />
            )
          }
          altText={isGroup ? "Chat Group" : "User's Profile"}
        />
      </div>
      <div className="max-w-[calc(100%-90px)] max-h-[70px] flex-1 flex gap-[7px] flex-col overflow-hidden">
        <div className="flex gap-[12px] items-center justify-between">
          <p className="!font-normal flex flex-nowrap items-center gap-[7px] text-black text-h6 overflow-hidden text-ellipsis whitespace-nowrap no-underline">
            {/* {&zwnj; */}
            {isGroup && <Users className="-ml-[7px]" strokeWidth={1} />}
            {displayName}
          </p>
          <div className="!font-light text-(--color-text-light)">{tView}</div>
        </div>
        <div className="flex gap-[12px] items-center justify-between h-[32px]">
          {typing_users?.length && !isSelected ? (
            <TypingLine
              typingUserIds={typing_users}
              isDisplayUserNames={isGroup}
            />
          ) : (
            <LastMessage
              message={last_message}
              draft={isSelected ? null : draft}
              countOfUnreadMessages={unread_messages_count}
              isShowUserName={isGroup}
            />
          )}
        </div>
      </div>
    </div>
  );
};
