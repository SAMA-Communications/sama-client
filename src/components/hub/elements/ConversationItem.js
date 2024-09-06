import LastMessage from "@components/message/LastMessage";
import TypingLine from "@components/_helpers/TypingLine";
import DynamicAvatar from "@components/info/elements/DynamicAvatar";
import getLastUpdateTime from "@utils/conversation/get_last_update_time";
import { useMemo } from "react";

import { ReactComponent as Group } from "@icons/users/Group.svg";
import { ReactComponent as UnknownPhoto } from "@icons/users/UnknownPhoto.svg";
import { ReactComponent as EncryptedConversationIcon } from "@icons/encryption/EncryptedConversation.svg";

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
    is_encrypted,
  } = chatObject;

  const tView = useMemo(() => {
    return getLastUpdateTime(updated_at, last_message);
  }, [updated_at, last_message]);

  const iconView = useMemo(() => {
    if (is_encrypted) return <EncryptedConversationIcon />;
    if (type === "g") return <Group />;
    return chatName ? chatName.slice(0, 2).toUpperCase() : <UnknownPhoto />;
  }, [chatName, is_encrypted, type]);

  return (
    <div
      className={`chat-box__container${isSelected ? "--selected" : ""}`}
      onClick={onClickFunc}
    >
      <div className="box__photo fcc">
        <DynamicAvatar
          avatarUrl={chatAvatarUrl}
          avatarBlurHash={chatAvatarBlutHash}
          defaultIcon={iconView}
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
              isEncrypted={is_encrypted}
            />
          )}
        </div>
      </div>
    </div>
  );
}
