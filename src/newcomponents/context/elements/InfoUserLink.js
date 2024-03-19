import ContextLink from "@newcomponents/context/elements/ContextLink";
import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

import { ReactComponent as Info } from "@icons/context/Info.svg";

export default function InfoUserLink({ uId, isOwner }) {
  const { pathname, hash } = useLocation();

  return (
    <ContextLink
      text="Info"
      icon={<Info />}
      onClickFunc={() => {
        isOwner
          ? addPrefix(pathname + hash, "/profile")
          : addSuffix(pathname + hash, `/user?uid=${uId}`);
      }}
    />
  );
}
