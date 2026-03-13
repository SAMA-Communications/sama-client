import { useMemo } from "react";
import { useSelector } from "react-redux";

import { ContextMenu } from "@sama-communications.ui-kit";

import ConversationActions from "@components/context/elements/ConversationActions";
import MessageActions from "@components/context/elements/MessageActions";

import { selectContextListCategory, selectContextList, selectCoords } from "@store/values/ContextMenu";

export default function ContextMenuHub() {
  const category = useSelector(selectContextListCategory);
  const list = useSelector(selectContextList);
  const coords = useSelector(selectCoords);

  const listView = useMemo(() => {
    switch (category) {
      case "conversation":
        return <ConversationActions listOfIds={list} />;
      case "message":
        return <MessageActions listOfIds={list} />;
      default:
        return null;
    }
  }, [list, category]);

  if (!listView) return null;

  return (
    <ContextMenu position={{ x: coords.x, y: coords.y }}>
      {listView}
    </ContextMenu>
  );
}
