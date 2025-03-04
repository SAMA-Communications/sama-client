import ContextLink from "@components/context/elements/ContextLink";

import Leave from "@icons/context/Leave.svg?react";

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
