import ContextLink from "@newcomponents/context/elements/ContextLink";
import conversationService from "@services/conversationsService";

import { ReactComponent as SendMessage } from "@icons/context/SendMessage.svg";

export default function SendMessageLink({ uObject }) {
  return (
    <ContextLink
      text="Write a message"
      icon={<SendMessage />}
      onClickFunc={async () =>
        await conversationService.createPrivateChat(uObject._id, uObject)
      }
    />
  );
}
