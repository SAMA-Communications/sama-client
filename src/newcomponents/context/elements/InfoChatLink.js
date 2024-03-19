import ContextLink from "@newcomponents/context/elements/ContextLink";
import addSuffix from "@utils/navigation/add_suffix";
import { getConverastionById } from "@store/values/Conversations";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { ReactComponent as Info } from "@icons/context/Info.svg";

export default function InfoChatLink() {
  const { pathname, hash } = useLocation();
  const selectedConversation = useSelector(getConverastionById);

  return (
    <ContextLink
      text="Info"
      icon={<Info />}
      onClickFunc={() =>
        addSuffix(
          pathname + hash,
          selectedConversation.type === "g"
            ? "/info"
            : `/user?uid=${selectedConversation.opponent_id}`
        )
      }
    />
  );
}
