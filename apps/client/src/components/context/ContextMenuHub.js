import { useMemo } from "react";
import { useSelector } from "react-redux";

import ConversationActions from "@components/context/elements/ConversationActions.js";
import MessageActions from "@components/context/elements/MessageActions.js";

import { selectContextListCategory, selectContextList, selectCoords } from "@store/values/ContextMenu";

export default function ContextMenuHub() {
  const category = useSelector(selectContextListCategory);
  const list = useSelector(selectContextList);
  const { x: left, y: top } = useSelector(selectCoords);

  const listView = useMemo(() => {
    switch (category) {
      case "conversation":
        return <ConversationActions listOfIds={list} />;
      case "message":
        return <MessageActions listOfIds={list} />;
      default:
        return [];
    }
  }, [list, category]);

  return (
    <div
      className="bg-bg-light border-text-dark absolute left-2.5 z-50 flex w-50 flex-col gap-px rounded-xl border p-3 shadow-md"
      style={{ top, left }}
    >
      {listView}
    </div>
  );
}
