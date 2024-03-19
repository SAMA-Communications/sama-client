import ContextLink from "@newcomponents/context/elements/ContextLink";
import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

import { ReactComponent as Info } from "@icons/context/Info.svg";

export default function InfoChatLink() {
  const { pathname, hash } = useLocation();

  return (
    <ContextLink
      text="Info"
      icon={<Info />}
      onClickFunc={() => addSuffix(pathname + hash, "/info")}
    />
  );
}
