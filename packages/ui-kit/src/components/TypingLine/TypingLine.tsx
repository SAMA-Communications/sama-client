import { FC, useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

import { TypingLineProps } from "./TypingLine.types";
import { DotsLoader } from "../DotsLoader";

interface Participant {
  id: string;
  name?: string;
}

interface TypingLineInternalProps extends TypingLineProps {
  participants?: Record<string, Participant>;
  getUserName?: (user: Participant) => string;
}

export const TypingLine: FC<TypingLineInternalProps> = ({
  userIds,
  displayUserNames = false,
  displayBackground = false,
  textColor = "var(--color-accent-dark)",
  className,
  participants = {},
  getUserName = (u) => u?.name || "Unknown",
}) => {
  const usersNameView = useMemo(() => {
    if (!displayUserNames || !userIds?.length) return null;

    const typingUsers = userIds.map((id) => participants[id]);
    const length = typingUsers.length;

    if (length > 2) {
      return `${getUserName(typingUsers[0])} and ${length - 1} more `;
    }

    return typingUsers
      .map((user, i) => `${getUserName(user)}${i !== length - 1 ? ", " : " "}`)
      .join("");
  }, [userIds, participants, displayUserNames, getUserName]);

  return (
    <motion.div
      initial={{ y: -8, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1, transition: { duration: 0.2 } }}
      className={clsx(
        "ml-[5px] flex items-center gap-[10px]",
        displayBackground
          ? "py-[2px] px-[10px] rounded-2xl bg-accent-dark/10"
          : "",
        className
      )}
    >
      <DotsLoader height={22} width={16} />
      <p style={{ color: textColor }} className="!font-light">
        {usersNameView}typing
      </p>
    </motion.div>
  );
};
