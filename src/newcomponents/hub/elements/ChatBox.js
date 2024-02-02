import LastMessage from "@newcomponents/message/LastMessage";
import globalConstants from "@helpers/constants";
import { useMemo } from "react";

import { ReactComponent as Group } from "@newicons/users/Group.svg";

export default function ChatBox({
  isSelected,
  onClickFunc,
  chatName,
  chatObject,
  currentUserId,
}) {
  const { updated_at, unread_messages_count, type, last_message } = chatObject;

  const tView = useMemo(() => {
    const t = new Date(
      last_message
        ? last_message.t / 1000000000 < 10
          ? last_message.t * 1000
          : last_message.t
        : Date.parse(updated_at)
    );
    const tToday = new Date(Date.now());

    if (
      tToday.getFullYear() - t.getFullYear() ||
      tToday.getMonth() - t.getMonth() ||
      tToday.getDate() - t.getDate() > 6
    ) {
      return (
        `${t.getDate() < 10 ? "0" : ""}${t.getDate()}` +
        "." +
        `${t.getMonth() < 10 ? "0" : ""}${t.getMonth() + 1}` +
        "." +
        t.getFullYear().toString().slice(2)
      );
    }

    return tToday.getDay() - t.getDay()
      ? globalConstants.weekDays[t.getDay()]
      : t.getHours() +
          ":" +
          (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes());
  }, [updated_at, last_message]);

  return (
    <div
      className={`chat-box__container${isSelected ? "--selected" : ""}`}
      onClick={onClickFunc}
    >
      <div className="box__photo fcc">
        {type === "g" ? <Group /> : chatName?.slice(0, 2).toUpperCase()}
      </div>
      <div className="box__content">
        <div className="content-top">
          <p className="content-top__name">{chatName}</p>
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
