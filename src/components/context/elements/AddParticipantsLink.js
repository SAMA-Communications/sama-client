import ContextLink from "@components/context/elements/ContextLink";

import { ReactComponent as AddParticipants } from "@icons/context/AddParticipants.svg";

export default function AddParticipantsLink({ onClick }) {
  return (
    <ContextLink
      text="Add participants"
      icon={<AddParticipants />}
      onClick={onClick}
    />
  );
}
