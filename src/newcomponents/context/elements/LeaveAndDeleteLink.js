import ContextLink from "@newcomponents/context/elements/ContextLink";
import conversationService from "@services/conversationsService";

import { ReactComponent as Leave } from "@icons/context/Leave.svg";

export default function LeaveAndDeleteLink() {
  const onClickFunc = async () => await conversationService.sendDeleteRequest();

  return (
    <ContextLink
      text="Delete and leave"
      icon={<Leave />}
      isDangerStyle={true}
      onClickFunc={onClickFunc}
    />
  );
}
