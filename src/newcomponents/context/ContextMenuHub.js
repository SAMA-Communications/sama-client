import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getContextList, getCoords } from "@store/values/ContextMenu";

import "@newstyles/context/ContextMenuHub.css";

import { ReactComponent as AddParticipants } from "@icons/context/AddParticipants.svg";
import { ReactComponent as Edit } from "@icons/context/Edit.svg";
import { ReactComponent as Info } from "@icons/context/Info.svg";
import { ReactComponent as Leave } from "@icons/context/Leave.svg";
import { ReactComponent as Remove } from "@icons/context/Remove.svg";
import { ReactComponent as SendMessage } from "@icons/context/SendMessage.svg";

export default function ContextMenuHub({
  top,
  left,
  bottom,
  customStyle = {},
}) {
  const { pathname, hash } = useLocation();

  const list = useSelector(getContextList);
  const { x, y } = useSelector(getCoords);

  const buttonsList = {
    infoChat: {
      text: "Info",
      icon: <Info />,
      onClickFunc: () => addSuffix(pathname + hash, "/info"),
    },
    infoUser: {
      text: "Info",
      icon: <Info />,
      onClickFunc: () => {},
    },
    edit: {
      text: "Edit",
      icon: <Edit />,
      onClickFunc: () => {},
    },
    addParticipants: {
      text: "Add participants",
      icon: <AddParticipants />,
      onClickFunc: () => {},
    },
    leave: {
      text: "Delete and leave",
      icon: <Leave />,
      isDangerStyle: true,
      onClickFunc: () => {},
    },
    removeParticipant: {
      text: "Remove participant",
      icon: <Remove />,
      isDangerStyle: true,
      onClickFunc: () => {},
    },
    newChat: {
      text: "Write a message",
      icon: <SendMessage />,
      onClickFunc: () => {},
    },
  };

  const listView = useMemo(() => {
    return list.map((name) => {
      const { text, icon, onClickFunc, isDangerStyle } =
        buttonsList[name] || {};

      if (!text) {
        return null;
      }

      return (
        <div
          key={name}
          className={`context-menu__link${isDangerStyle ? "--danger" : ""}`}
          onClick={onClickFunc}
        >
          {icon} <p className="context-menu__text">{text}</p>
        </div>
      );
    });
  }, [list]);

  return (
    <div
      className="context-menu__container"
      style={{ top: `${y}px`, left: `${x}px` }}
    >
      {listView}
    </div>
  );
}
