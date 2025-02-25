import ContextLink from "@components/context/elements/ContextLink";

import Remove from "@icons/context/Remove.svg?react";

export default function RemoveParticipantLink({ onClick }) {
  return (
    <ContextLink
      text="Remove participant"
      icon={<Remove />}
      isDangerStyle={true}
      onClick={onClick}
    />
  );
}
