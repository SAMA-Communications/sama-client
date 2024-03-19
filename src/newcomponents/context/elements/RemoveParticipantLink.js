import ContextLink from "@newcomponents/context/elements/ContextLink";

import { ReactComponent as Remove } from "@icons/context/Remove.svg";

export default function RemoveParticipantLink() {
  return (
    <ContextLink
      text="Remove participant"
      icon={<Remove />}
      isDangerStyle={true}
      //   onClickFunc={() => {}}
    />
  );
}
