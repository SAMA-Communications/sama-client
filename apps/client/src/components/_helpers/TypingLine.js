import * as m from "motion/react-m";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import DotsLoader from "./DotsLoader.js";

import { selectParticipantsEntities } from "@store/values/Participants";

import { getLastMessageUserName } from "@utils/UserUtils.js";

export default function TypingLine({
  userIds,
  displayUserNames = false,
  displayBackground = false,
}) {
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
    <m.div
      initial={{ y: -8, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.2 } }}
      className={`ml-[5px] flex items-center gap-[10px] ${
        displayBackground
          ? "py-[2px] px-[10px] rounded-2xl bg-accent-dark/10"
          : ""
      }`}
    >
      <DotsLoader height={22} width={16} />
      <p className="text-(--color-accent-dark) !font-light">
        {usersNameView}typing
      </p>
    </m.div>
  );
}
