import DotsLoader from "./DotsLoader";
import getUserFullName from "@utils/user/get_user_full_name";
import { selectParticipantsEntities } from "@src/store/values/Participants";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function TypingLine({ userIds, isViewUserNames = false }) {
  const participants = useSelector(selectParticipantsEntities);

  const usersNameView = useMemo(() => {
    const typingUsers = userIds?.map((id) => participants[id]);
    const typingUsersLength = typingUsers?.length;

    if (typingUsersLength > 2) {
      return `${getUserFullName(typingUsers[0])} and ${
        typingUsersLength - 1
      } more `;
    }

    return typingUsers?.map(
      (user, i) =>
        `${getUserFullName(user)}${i !== typingUsersLength - 1 ? ", " : " "}`
    );
  }, [participants, userIds]);

  return (
    <div className="typing-line__container">
      <DotsLoader height={22} width={16} />
      <p>{isViewUserNames ? usersNameView : ""}typing</p>
    </div>
  );
}
