import { useMemo } from "react";

import LastMessage from "@components/message/LastMessage";
import TypingLine from "@components/_helpers/TypingLine";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";

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
    updated_at,
    unread_messages_count,
    type,
    last_message,
    typing_users,
  } = chatObject;

  const tView = useMemo(() => {
    return getLastUpdateTime(updated_at, last_message);
  }, [updated_at, last_message]);

  return (
    <div
      className={`relative w-full p-[10px] flex gap-[15px] items-center rounded-[12px] cursor-pointer ${
        isSelected ? "bg-(--color-hover-light)" : ""
      } hover:bg-(--color-hover-light)`}
      onClick={onClickFunc}
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
              viewName={lastMessageUserName}
              count={unread_messages_count}
              userId={currentUserId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
