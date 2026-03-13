import { useEffect, useMemo, memo } from "react";
import { clsx } from "clsx";
import { getAdapters } from "../../../adapters";
import { Users, UserRoundX } from "lucide-react";

import { DynamicAvatar } from "../DynamicAvatar";
import { LastMessage } from "../LastMessage/LastMessage";
import { TypingLine } from "../TypingLine";
import { WrapperRoot } from "../WrapperRoot";
import type { ConversationItemProps } from "./ConversationItem.types";

export const ConversationItem = memo(function ConversationItem({
  conversation,
  isSelected,
  className,
  ...rest
}: ConversationItemProps) {
  const { useDrafts, useParticipants, conversationUtils, userUtils } = getAdapters();
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

  const opponentId = currentUserId === owner_id ? opponent_id : owner_id;

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
    [conversationUtils, updated_at, last_message?.t],
  );

  return (
    <WrapperRoot
      className={clsx(
        "ui:relative ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:gap-3.75 ui:rounded-2xl ui:px-2.5 ui:py-2.5 ui:duration-100 ui:focus:outline-none",
        isSelected ? "ui:bg-accent-100 ui:shadow-btn" : "ui:hover:bg-accent-100/50",
        className,
      )}
      {...rest}
    >
      <DynamicAvatar
        size={60}
        avatarUrl={image_url || participant?.avatar_url}
        avatarBlurHash={image_object?.file_blur_hash || participant?.avatar_object?.file_blur_hash}
        defaultIcon={
          isGroup || displayName !== "Deleted account" ? (
            displayName.slice(0, 2).toUpperCase()
          ) : (
            <UserRoundX size={32} />
          )
        }
        altText={isGroup ? "Chat Group" : "User's Profile"}
        bgColorKey={isGroup ? cid : opponentId}
      />
      <div className="ui:flex ui:max-h-17.5 ui:max-w-[calc(100%-60px)] ui:flex-1 ui:flex-col ui:justify-between ui:overflow-hidden">
        <div className="ui:flex ui:items-center ui:justify-between ui:gap-3">
          <p
            className={`ui:flex ui:flex-nowrap ui:items-center ui:gap-1.5 ui:overflow-hidden ui:text-lg ui:text-ellipsis ui:whitespace-nowrap`}
          >
            {/* {&zwnj; */}
            {isGroup && <Users size={18} />}
            {displayName}
          </p>
          <div className={`ui:text-md ui:font-light ui:text-text-dark/60 ui:ordinal!`}>{tView}</div>
        </div>
        <div className="ui:flex ui:h-8 ui:items-center ui:justify-between ui:gap-3">
          {typing_users?.length && !isSelected ? (
            <TypingLine typingUserIds={typing_users} isDisplayUserNames={isGroup} />
          ) : (
            <LastMessage
              isSelected={isSelected}
              message={last_message}
              draft={isSelected ? null : draft}
              countOfUnreadMessages={unread_messages_count}
              isShowUserName={isGroup}
            />
          )}
        </div>
      </div>
    </WrapperRoot>
  );
});
