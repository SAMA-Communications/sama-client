import { useMemo } from "react";
import { useSelector } from "react-redux";

import DotsLoader from "./DotsLoader.js";

import { selectParticipantsEntities } from "@store/values/Participants";

import getLastMessageUserName from "@utils/user/get_last_message_user_name";

export default function TypingLine({ userIds, displayUserNames = false }) {
  const participants = useSelector(selectParticipantsEntities);

  const usersNameView = useMemo(() => {
    if (!displayUserNames) {
      return null;
    }

    const typingUsers = userIds?.map((id) => participants[id]);
    const typingUsersLength = typingUsers?.length;

    if (typingUsersLength > 2) {
      return `${getLastMessageUserName(typingUsers[0])} and ${
        typingUsersLength - 1
      } more `;
    }

    return typingUsers?.map(
      (user, i) =>
        `${getLastMessageUserName(user)}${
          i !== typingUsersLength - 1 ? ", " : " "
        }`
    );
  }, [participants, userIds, displayUserNames]);

  return (
    <div className="mt-[5px] flex gap-[10px] items-end">
      <DotsLoader height={22} width={16} />
      <p className="text-(--color-accent-dark)">{usersNameView}typing</p>
    </div>
  );
}
