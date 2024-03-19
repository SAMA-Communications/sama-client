import ContextLink from "@newcomponents/context/elements/ContextLink";
import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

import { ReactComponent as Edit } from "@icons/context/Edit.svg";

export default function EditLink() {
  const { pathname, hash } = useLocation();

  return (
    <ContextLink
      text="Edit"
      icon={<Edit />}
      onClickFunc={() => addSuffix(pathname + hash, "/edit?type=chat")}
    />
  );
}
