import ContextLink from "@components/context/elements/ContextLink";

import AddParticipants from "@icons/context/AddParticipants.svg?react";

export default function AddParticipantsLink({ onClick }) {
  return (
    <ContextLink
      text="Add participants"
      icon={<AddParticipants />}
      onClick={onClick}
    />
  );
}
