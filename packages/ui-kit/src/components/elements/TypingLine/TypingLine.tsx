import * as motion from "motion/react-m";
import clsx from "clsx";
import { useMemo } from "react";

import { getAdapters } from "../../../adapters";

import { DotsLoader } from "../../DotsLoader";

import { TypingLineInternalProps } from "./TypingLine.types";

export const TypingLine = ({
  typingUserIds,
  isDisplayUserNames = false,
  isDisplayBackground = false,
}: TypingLineInternalProps) => {
  const { useParticipants, userUtils } = getAdapters();
  const { getParticipantsByIdsAsList } = useParticipants();

  const typingUsers = useMemo(
    () =>
      typingUserIds?.length ? getParticipantsByIdsAsList(typingUserIds) : [],
    [typingUserIds, getParticipantsByIdsAsList]
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
    <motion.div
      className={clsx(
        "ml-[5px] flex items-center gap-[10px]",
        isDisplayBackground
          ? "py-[2px] px-[10px] rounded-2xl bg-accent-dark/10"
          : ""
      )}
      initial={{ y: -8, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.2 } }}
    >
      <DotsLoader height={22} width={16} />
      <p style={{ color: "var(--color-accent-dark)" }} className="!font-light">
        {usersNameView}typing
      </p>
    </motion.div>
  );
};
