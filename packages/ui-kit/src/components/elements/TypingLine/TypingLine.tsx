import { memo, useMemo } from "react";
import { clsx } from "clsx";
import { getAdapters } from "../../../adapters";

import { DotsLoader } from "../DotsLoader";
import { WrapperRoot } from "../WrapperRoot";
import type { TypingLineInternalProps } from "./TypingLine.types";

export const TypingLine = memo(function TypingLine({
  typingUserIds,
  isDisplayUserNames = false,
  isDisplayBackground = false,
  className,
  ...rest
}: TypingLineInternalProps) {
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
    <WrapperRoot className={clsx("ui:flex ui:items-center ui:gap-2.5", className)} {...rest}>
      <DotsLoader height={22} width={16} />
      <p className="ui:font-light ui:text-accent-500">{usersNameView}typing</p>
    </WrapperRoot>
  );
});
