import { useMemo } from "react";
import { useSelector } from "react-redux";

import ConversationActions from "@components/context/elements/ConversationActions.js";
import MessageActions from "@components/context/elements/MessageActions.js";

import {
  selectContextListCategory,
  selectContextList,
  selectCoords,
} from "@store/values/ContextMenu";

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
      className="absolute left-[10px] w-[240px] py-[10px] px-[4px] flex flex-col gap-px rounded-[12px] shadow-md bg-(--color-bg-light) z-50"
      style={{ top, left }}
    >
      {listView}
    </div>
  );
}
