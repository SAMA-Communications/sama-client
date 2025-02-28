import ContextLink from "@components/context/elements/ContextLink";

import Edit from "@icons/context/Edit.svg?react";

export default function EditLink({ onClick }) {
  return <ContextLink text="Edit" icon={<Edit />} onClick={onClick} />;
}
