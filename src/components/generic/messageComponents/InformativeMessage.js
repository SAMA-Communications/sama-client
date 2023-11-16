import { selectParticipantsEntities } from "../../../store/Participants";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function InformativeMessage({
  text,
  type,
  isPrevMesssageUsers,
}) {
  const participants = useSelector(selectParticipantsEntities);

  const [uId, comment] = [
    text.split(" ")[0],
    text.split(" ").slice(1).join(" "),
  ];

  const participantsInfoView = useMemo(() => {
    if (!uId || !participants[uId]) {
      return null;
    }

    const { first_name, last_name, login } = participants[uId];
    const viewName = [first_name, last_name].filter(Boolean);

    return viewName.length ? viewName.join(" ") : login;
  }, [participants, uId]);

  return (
    <div
      className={
        isPrevMesssageUsers
          ? "informative-message mt-10"
          : "informative-message"
      }
    >
      {participantsInfoView + " " + comment}
    </div>
  );
}
