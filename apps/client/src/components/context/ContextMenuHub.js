import { useMemo } from "react";
import { useSelector } from "react-redux";

import ConversationLinks from "@components/context/elements/ConversationLinks.js";
import MessageLinks from "@components/context/elements/MessageLinks.js";

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
        return <ConversationLinks listOfIds={list} />;
      case "message":
        return <MessageLinks listOfIds={list} />;
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
