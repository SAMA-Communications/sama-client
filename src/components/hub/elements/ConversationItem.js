import LastMessage from "@components/message/LastMessage";
import getLastUpdateTime from "@utils/conversation/get_last_update_time";
import { useMemo } from "react";

import { ReactComponent as Group } from "@icons/users/Group.svg";
import { ReactComponent as UnknownPhoto } from "@icons/users/UnknownPhoto.svg";

export default function ConversationItem({
  isSelected,
  onClickFunc,
  chatName,
  chatObject,
  currentUserId,
}) {
  const { updated_at, unread_messages_count, type, last_message } = chatObject;

  const tView = useMemo(() => {
    return getLastUpdateTime(updated_at, last_message);
  }, [updated_at, last_message]);

  const chatPhoto = useMemo(() => {
    if (type === "g") {
      return <Group />;
    }
    return chatName ? chatName.slice(0, 2).toUpperCase() : <UnknownPhoto />;
  }, [type, chatName]);

  return (
    <div
      className={`chat-box__container${isSelected ? "--selected" : ""}`}
      onClick={onClickFunc}
    >
      <div className="box__photo fcc">{chatPhoto}</div>
      <div className="box__content">
        <div className="content-top">
          <p className="content-top__name">
            &zwnj;{chatName || "Deleted account"}
          </p>
          <div className="content-top__time">{tView}</div>
        </div>
        <div className="content-bottom">
          <LastMessage
            message={last_message}
            count={unread_messages_count}
            userId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}
