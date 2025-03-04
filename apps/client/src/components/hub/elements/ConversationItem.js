import LastMessage from "@components/message/LastMessage";
import TypingLine from "@components/_helpers/TypingLine";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import getLastUpdateTime from "@utils/conversation/get_last_update_time";
import { useMemo } from "react";

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
      className={`chat-box__container${isSelected ? "--selected" : ""}`}
      onClick={onClickFunc}
    >
      <div className="box__photo fcc">
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
      <div className="box__content">
        <div className="content-top">
          <p className="content-top__name">
            &zwnj;{chatName || "Deleted account"}
          </p>
          <div className="content-top__time">{tView}</div>
        </div>
        <div className="content-bottom">
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
