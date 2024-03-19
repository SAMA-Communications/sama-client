import ContextLink from "@newcomponents/context/elements/ContextLink";
import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

import { ReactComponent as AddParticipants } from "@icons/context/AddParticipants.svg";

export default function AddParticipantsLink() {
  const { pathname, hash } = useLocation();

  return (
    <ContextLink
      text="Add participants"
      icon={<AddParticipants />}
      onClickFunc={() => addSuffix(pathname + hash, "/add")}
    />
  );
}
