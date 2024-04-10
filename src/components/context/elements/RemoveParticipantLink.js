import ContextLink from "@components/context/elements/ContextLink";

import { ReactComponent as Remove } from "@icons/context/Remove.svg";

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
