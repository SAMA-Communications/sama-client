import ContextLink from "@components/context/elements/ContextLink";

import { ReactComponent as Edit } from "@icons/context/Edit.svg";

export default function EditLink({ onClick }) {
  return <ContextLink text="Edit" icon={<Edit />} onClick={onClick} />;
}
