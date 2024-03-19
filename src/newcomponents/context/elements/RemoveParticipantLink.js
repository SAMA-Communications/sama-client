import ContextLink from "@newcomponents/context/elements/ContextLink";

import { ReactComponent as Remove } from "@icons/context/Remove.svg";
import conversationService from "@services/conversationsService";

export default function RemoveParticipantLink({ uId }) {
  return (
    <ContextLink
      text="Remove participant"
      icon={<Remove />}
      isDangerStyle={true}
      onClickFunc={async () =>
        await conversationService.sendRemoveParticipantRequest(uId)
      }
    />
  );
}
