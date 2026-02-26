import { useMemo } from "react";

import { getAdapters } from "../../../adapters";

import { DotsLoader } from "../DotsLoader";

import { TypingLineInternalProps } from "./TypingLine.types";

export const TypingLine = ({
  typingUserIds,
  isDisplayUserNames = false,
  isDisplayBackground = false,
}: TypingLineInternalProps) => {
  const { useParticipants, userUtils } = getAdapters();
  const { getParticipantsByIdsAsList } = useParticipants();

  const typingUsers = useMemo(
    () => (typingUserIds?.length ? getParticipantsByIdsAsList(typingUserIds) : []),
    [typingUserIds, getParticipantsByIdsAsList],
  );

  const usersNameView = useMemo(() => {
    if (!isDisplayUserNames || !typingUsers?.length) return "";

    const length = typingUsers.length;

    if (length > 2) {
      const firstUserName = userUtils.getLastMessageUserName(typingUsers[0]);
      return `${firstUserName} and ${length - 1} more `;
    }

    return typingUsers
      .map((user, i) => {
        const userName = userUtils.getLastMessageUserName(user);
        return `${userName}${i !== length - 1 ? ", " : " "}`;
      })
      .join("");
  }, [typingUsers, isDisplayUserNames, userUtils]);

  return (
    <div className={`ui:flex ui:items-center ui:gap-2.5`}>
      <DotsLoader height={22} width={16} />
      <p className="ui:font-light ui:text-accent-500">{usersNameView}typing</p>
    </div>
  );
};
