import ContextLink from "@newcomponents/context/elements/ContextLink";

import { ReactComponent as Leave } from "@icons/context/Leave.svg";

export default function LeaveAndDeleteLink({ onClick }) {
  return (
    <ContextLink
      text="Delete and leave"
      icon={<Leave />}
      isDangerStyle={true}
      onClick={onClick}
    />
  );
}
