import { useMemo } from "react";

import "@newstyles/context/ContextMenuHub.css";

import { ReactComponent as AddParticipants } from "@newicons/context/AddParticipants.svg";
import { ReactComponent as Edit } from "@newicons/context/Edit.svg";
import { ReactComponent as Info } from "@newicons/context/Info.svg";
import { ReactComponent as Leave } from "@newicons/context/Leave.svg";
import { ReactComponent as Remove } from "@newicons/context/Remove.svg";
import { ReactComponent as SendMessage } from "@newicons/context/SendMessage.svg";

export default function ContextMenuHub({
  top,
  left,
  bottom,
  customStyle = {},
  listOfButtons = [],
}) {
  const buttonsList = {
    info: {
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
    return listOfButtons.map((name) => {
      const { text, icon, onClickFunc, isDangerStyle } =
        buttonsList[name] || {};

      if (!text) {
        return null;
      }

      return (
        <div
          key={name}
          className={`context-menu__link${isDangerStyle ? "--danger" : ""}`}
        >
          {icon} <p className="context-menu__text">{text}</p>
        </div>
      );
    });
  }, [listOfButtons]);

  return (
    <div
      className="context-menu__container"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        bottom: `${bottom}px`,
        ...customStyle,
      }}
    >
      {listView}
    </div>
  );
}
