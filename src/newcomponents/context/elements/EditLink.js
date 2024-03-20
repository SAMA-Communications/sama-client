import ContextLink from "@newcomponents/context/elements/ContextLink";

import { ReactComponent as Edit } from "@icons/context/Edit.svg";

export default function EditLink({ onClick }) {
  return <ContextLink text="Edit" icon={<Edit />} onClick={onClick} />;
}
